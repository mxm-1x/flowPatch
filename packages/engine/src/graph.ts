import { StateGraph, END, START } from "@langchain/langgraph";
import { AgentState } from "@flowpatch/types";

// Define the graph state
const graphState: any = {
  topic: { value: null },
  researchNotes: { value: (x: any, y: any) => x.concat(y), default: () => [] },
  styleExamples: { value: null },
  draft: { value: null },
  critique: { value: null },
  retries: { value: (x: number, y: number) => x + y, default: () => 0 },
  logs: { value: (x: any, y: any) => x.concat(y), default: () => [] },
  finalOutput: { value: null },
};

export const createGraph = (nodes: any) => {
  const workflow = new StateGraph<any>({
    channels: graphState,
  });

  // Add nodes
  workflow.addNode("researcher", nodes.researcher);
  workflow.addNode("styleMatcher", nodes.styleMatcher);
  workflow.addNode("drafter", nodes.drafter);
  workflow.addNode("critic", nodes.critic);

  // Define edges
  (workflow as any).addEdge(START, "researcher");
  (workflow as any).addEdge("researcher", "styleMatcher");
  (workflow as any).addEdge("styleMatcher", "drafter");
  (workflow as any).addEdge("drafter", "critic");

  // Conditional edge for reflection loop
  (workflow as any).addConditionalEdges(
    "critic",
    (state: AgentState) => {
      if (state.critique.pass || state.retries >= 3) {
        return "end";
      }
      return "drafter";
    },
    {
      end: END,
      drafter: "drafter",
    }
  );

  return workflow.compile();
};
