import { AgentState } from "@flowpatch/types";
import { getPineconeClient } from "@flowpatch/db";
import { embed, getOpenRouterClient, MODELS } from "@flowpatch/ai";

export const styleMatcherNode = async (state: AgentState) => {
  console.log(`[Node: StyleMatcher] Retrieving style snippets...`);
  
  const pineconeKey = process.env.PINECONE_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!pineconeKey || !openRouterKey) {
    return {
      logs: ["Missing API keys for style matching. Using defaults."],
      styleExamples: { hooks: [], ctas: [], transitions: [], stories: [] }
    };
  }

  const pc = getPineconeClient(pineconeKey);
  const aiClient = getOpenRouterClient(openRouterKey);
  const index = pc.index("flowpatch");

  // In a real RAG, we would embed the topic or a "query hook"
  // Here we'll do a simple retrieval for each type to build the "style palette"
  const types = ["HOOK", "CTA", "TRANSITION", "STORYTELLING"];
  const styleExamples: any = { hooks: [], ctas: [], transitions: [], stories: [] };

  try {
    // For simplicity in this engine-first MVP, we'll query for the top snippets of each type
    // In advanced RAG, we'd use state.topic to find SEMANTICALLY similar snippets
    for (const type of types) {
      // Mocking semantic search with a generic query for now
      // since we need an embedding to search Pinecone
      const queryEmbedding = await embed(aiClient, `A ${type} about ${state.topic}`, MODELS.EMBEDDING);
      
      if (queryEmbedding && queryEmbedding[0]) {
        const results = await index.query({
          vector: queryEmbedding[0].embedding,
          topK: 2,
          includeMetadata: true,
          filter: { type: { "$eq": type } }
        });

        const contents = results.matches.map(m => m.metadata?.content as string).filter(Boolean);
        if (type === "HOOK") styleExamples.hooks = contents;
        if (type === "CTA") styleExamples.ctas = contents;
        if (type === "TRANSITION") styleExamples.transitions = contents;
        if (type === "STORYTELLING") styleExamples.stories = contents;
      }
    }

    return {
      styleExamples,
      logs: ["Retrieved style examples from Pinecone."]
    };
  } catch (error: any) {
    return {
      logs: [`Style matching failed: ${error.message}`],
      styleExamples: { hooks: [], ctas: [], transitions: [], stories: [] }
    };
  }
};
