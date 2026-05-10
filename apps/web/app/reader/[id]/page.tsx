import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowLeft, Clock, User, Share2, Copy } from "lucide-react";

const prisma = new PrismaClient();

export default async function ReaderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const run = await prisma.agentRun.findUnique({
    where: { 
      id: params.id,
      userId: (session.user as any).id
    }
  });

  if (!run || !run.output) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white pb-20">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#00FF41] transition-colors">
            <ArrowLeft size={14} /> BACK_TO_DASHBOARD
          </Link>
          <div className="flex gap-4">
             <button className="text-gray-400 hover:text-white"><Share2 size={18} /></button>
             <button className="text-gray-400 hover:text-white"><Copy size={18} /></button>
          </div>
        </div>
      </header>

      {/* Reader Layout */}
      <main className="max-w-3xl mx-auto px-6 pt-32">
        <article>
          {/* Metadata */}
          <div className="mb-12 space-y-4">
            <div className="inline-block px-3 py-1 border border-[#00FF41]/30 text-[#00FF41] font-mono text-[10px] tracking-widest uppercase bg-[#00FF41]/5">
              Agentic_Artifact_v1
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] text-[#EDEDED]">
              {run.topic}
            </h1>
            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Clock size={14} /> {new Date(run.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><User size={14} /> FLOWPATCH_AGENT_01</span>
            </div>
          </div>

          {/* Content Surface */}
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-[#EDEDED] prose-headings:tracking-tighter prose-headings:font-bold prose-headings:mt-12
            prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-xl prose-p:mb-8
            prose-strong:text-[#00FF41] prose-strong:font-bold
            prose-blockquote:border-l-[#00FF41] prose-blockquote:bg-white/2 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:my-10
            prose-li:text-gray-400 prose-li:my-2
          ">
            <ReactMarkdown>{run.output}</ReactMarkdown>
          </div>
        </article>

        {/* System Footnote */}
        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            End_of_Transmission // System_Stable
          </div>
        </footer>
      </main>
    </div>
  );
}
