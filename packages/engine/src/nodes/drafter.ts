import { AgentState } from "@flowpatch/types";
import { chat, getOpenRouterClient, MODELS } from "@flowpatch/ai";

export const drafterNode = async (state: AgentState) => {
  console.log(`[Node: Drafter] Generating draft (Retry: ${state.retries})...`);
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const client = getOpenRouterClient(apiKey);

  const styleContext = `
  HOOK EXAMPLES: ${state.styleExamples.hooks.join("\n- ")}
  TRANSITION EXAMPLES: ${state.styleExamples.transitions.join("\n- ")}
  CTA EXAMPLES: ${state.styleExamples.ctas.join("\n- ")}
  `;

  const researchContext = state.researchNotes.join("\n\n---\n\n");

  const systemPrompt = `
  You are an expert newsletter writer. 
  Your goal is to write a punchy, engaging newsletter about: ${state.topic}.
  
  USE THE FOLLOWING WRITING STYLE:
  ${styleContext}

  RESEARCH DATA:
  ${researchContext}

  RULES:
  1. Do not use generic AI phrases like "In today's fast-paced world".
  2. Be specific and opinionated.
  3. STRICT: Use very short paragraphs (MAX 2-3 SENTENCES). 
  4. Add a double newline (gap) between every single idea.
  5. Follow the hook/body/CTA structure seen in the style examples.
  ${state.critique?.issues.length > 0 ? `PREVIOUS CRITIQUE TO FIX: ${state.critique.issues.join(", ")}` : ""}
  `;

  const draft = await chat(client, [
    { role: "system", content: systemPrompt },
    { role: "user", content: "Write the newsletter now." }
  ], MODELS.REASONING);

  return {
    draft,
    logs: [`Draft generated.`],
  };
};
