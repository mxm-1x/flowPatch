export type SnippetType = 'HOOK' | 'TRANSITION' | 'CTA' | 'STORYTELLING' | 'ANALOGY';

export interface StyleSnippet {
  id: string;
  content: string;
  type: SnippetType;
  metadata: {
    sourceUrl?: string;
    authorId?: string;
    newsletterId?: string;
    tone?: string[];
  };
}

export interface AgentState {
  topic: string;
  researchNotes: string[];
  styleExamples: {
    hooks: string[];
    ctas: string[];
    transitions: string[];
    stories: string[];
  };
  draft: string;
  critique: {
    pass: boolean;
    issues: string[];
  };
  retries: number;
  logs: string[];
  finalOutput?: string;
}

export interface IngestionResult {
  url: string;
  snippetCount: number;
  status: 'success' | 'failure';
  error?: string;
}
