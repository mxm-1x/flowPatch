import { AgentState } from "@flowpatch/types";
import FirecrawlApp from "@mendable/firecrawl-js";

export const researcherNode = async (state: AgentState) => {
  console.log(`[Node: Researcher] Researching topic: ${state.topic}`);
  
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return {
      logs: ["Firecrawl API key missing. Skipping research."],
      researchNotes: ["No research available."]
    };
  }

  const app = new FirecrawlApp({ apiKey });
  
  try {
    const searchResponse = await app.search(state.topic, {
      limit: 3,
      scrapeOptions: { formats: ["markdown"] }
    });

    if (!searchResponse.success) {
      throw new Error(searchResponse.error);
    }

    const notes = searchResponse.data.map((d: any) => d.markdown).filter(Boolean);

    return {
      researchNotes: notes,
      logs: [`Found ${notes.length} sources for research.`]
    };
  } catch (error: any) {
    return {
      logs: [`Research failed: ${error.message}`],
      researchNotes: []
    };
  }
};
