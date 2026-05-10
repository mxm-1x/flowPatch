import { NextRequest } from "next/server";
import { createGraph, researcherNode, styleMatcherNode, drafterNode, criticNode } from "@flowpatch/engine";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { topic } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), { status: 400 });
    }

    const run = await prisma.agentRun.create({
      data: {
        topic,
        status: "RUNNING",
        logs: ["Generation started via Stream API."],
        userId: (session.user as any).id,
      }
    });

    const app = createGraph({
      researcher: researcherNode,
      styleMatcher: styleMatcherNode,
      drafter: drafterNode,
      critic: criticNode,
    });

    const initialState = {
      topic,
      researchNotes: [],
      styleExamples: { hooks: [], ctas: [], transitions: [], stories: [] },
      draft: "",
      critique: { pass: false, issues: [] },
      retries: 0,
      logs: ["Generation started via Stream API."]
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let finalOutput = "";
        let allLogs = ["Generation started via Stream API."];
        
        try {
          const eventStream = await app.stream(initialState);

          for await (const event of eventStream) {
            const nodeName = Object.keys(event)[0];
            const data = event[nodeName];
            
            if (data.logs && data.logs.length > 0) {
              const latestLog = data.logs[data.logs.length - 1];
              allLogs.push(latestLog);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'log', message: latestLog })}\n\n`));
            }

            if (data.draft) {
              finalOutput = data.draft;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'draft', content: data.draft })}\n\n`));
            }
            
            if (data.finalOutput) {
               finalOutput = data.finalOutput;
               controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'final', content: data.finalOutput })}\n\n`));
            }
          }

          await prisma.agentRun.update({
            where: { id: run.id },
            data: { status: "COMPLETED", logs: allLogs, output: finalOutput }
          });
          
          if (finalOutput) {
            await prisma.newsletter.create({
              data: {
                title: topic,
                content: finalOutput,
                userId: (session.user as any).id
              }
            });
          }

          controller.close();
        } catch (error: any) {
          console.error("Stream Error:", error);
          await prisma.agentRun.update({
            where: { id: run.id },
            data: { status: "FAILED", logs: [...allLogs, `ERROR: ${error.message}`] }
          });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("API Generate Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
