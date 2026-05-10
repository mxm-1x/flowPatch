import { createGraph } from '../langgraph/graph.js';
import { researcherNode } from '../langgraph/nodes/researcher.js';
import { styleMatcherNode } from '../langgraph/nodes/styleMatcher.js';
import { drafterNode } from '../langgraph/nodes/drafter.js';
import { criticNode } from '../langgraph/nodes/critic.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error("Please provide a topic: npm run generate -- 'topic'");
    process.exit(1);
  }

  const app = createGraph({
    researcher: researcherNode,
    styleMatcher: styleMatcherNode,
    drafter: drafterNode,
    critic: criticNode,
  });

  console.log(`🚀 Starting generation for topic: "${topic}"\n`);

  const initialState = {
    topic,
    researchNotes: [],
    styleExamples: { hooks: [], ctas: [], transitions: [], stories: [] },
    draft: "",
    critique: { pass: false, issues: [] },
    retries: 0,
    logs: ["Generation started."]
  };

  try {
    const result = await app.invoke(initialState);

    console.log("\n--- GENERATION LOGS ---");
    result.logs.forEach((log: string) => console.log(`- ${log}`));

    console.log("\n--- FINAL NEWSLETTER ---");
    console.log(result.finalOutput || result.draft);
  } catch (error: any) {
    console.error("Generation failed:", error.message);
  }
}

main().catch(console.error);
