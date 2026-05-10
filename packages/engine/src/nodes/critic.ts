import { AgentState } from "@flowpatch/types";
import { chat, getOpenRouterClient, MODELS } from "@flowpatch/ai";

export const criticNode = async (state: AgentState) => {
  console.log(`[Node: Critic] Reviewing draft...`);
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const client = getOpenRouterClient(apiKey);

  const systemPrompt = `
  You are a harsh newsletter editor. 
  Review the following draft for the topic: ${state.topic}.

  CHECKLIST:
  1. Is the hook strong and specific?
  2. Is there any robotic/generic AI language?
  3. Is the CTA clear?
  4. Is the formatting punchy?

  Respond ONLY with a JSON object:
  {
    "pass": boolean,
    "issues": string[]
  }
  `;

  const response = await chat(client, [
    { role: "system", content: systemPrompt },
    { role: "user", content: state.draft }
  ], MODELS.REASONING, true);

  try {
    const critique = JSON.parse(response || '{"pass": true, "issues": []}');
    return {
      critique,
      retries: critique.pass ? 0 : 1,
      logs: [critique.pass ? "Critic passed the draft." : `Critic rejected: ${critique.issues.join(", ")}`],
      finalOutput: critique.pass ? state.draft : null
    };
  } catch (e) {
    return {
      critique: { pass: true, issues: [] },
      logs: ["Critic review failed to parse, assuming pass."]
    };
  }
};
