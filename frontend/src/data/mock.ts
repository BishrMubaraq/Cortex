/** Static mock data for the UI-only screens (no backend calls). */

export interface ChatSummary {
  id: string;
  title: string;
  preview: string;
  timeLabel: string;
}

export const recentChats: ChatSummary[] = [
  {
    id: "c1",
    title: "Q3 research summary",
    preview: "Summarize the key findings from the Q3 reports…",
    timeLabel: "2h",
  },
  {
    id: "c2",
    title: "Competitor landscape",
    preview: "Compare positioning across the top 5 vendors",
    timeLabel: "1d",
  },
  {
    id: "c3",
    title: "Vector DB benchmarks",
    preview: "pgvector vs. Qdrant vs. Weaviate latency",
    timeLabel: "3d",
  },
  {
    id: "c4",
    title: "Onboarding docs review",
    preview: "Draft feedback on the new onboarding guide",
    timeLabel: "5d",
  },
];

export interface Model {
  id: string;
  name: string;
  vendor: string;
}

export const models: Model[] = [
  { id: "claude", name: "Claude", vendor: "Anthropic" },
  { id: "gpt-4", name: "GPT-4", vendor: "OpenAI" },
  { id: "llama-3-local", name: "Llama 3", vendor: "Local" },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { id: number; label: string }[];
}

export const sampleConversation: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "What are the main trade-offs between RAG and fine-tuning?",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "At a high level: RAG keeps knowledge external and retrievable, so it's cheaper to update and easier to cite sources. Fine-tuning bakes behavior into the model weights, which is better for style, format, and latency-sensitive tasks but costlier to iterate on. Many production systems combine both.",
    citations: [
      { id: 1, label: "rag-overview.pdf" },
      { id: 2, label: "finetuning-guide.md" },
    ],
  },
];

export const examplePrompts: {
  title: string;
  prompt: string;
}[] = [
  {
    title: "Summarize a document",
    prompt: "Summarize the attached research paper into 5 key takeaways.",
  },
  {
    title: "Compare approaches",
    prompt: "Compare RAG vs. fine-tuning for a customer support assistant.",
  },
  {
    title: "Draft with citations",
    prompt: "Draft a short brief on vector databases, citing my knowledge base.",
  },
  {
    title: "Extract structured data",
    prompt: "Extract all metrics and dates from the Q3 report into a table.",
  },
];

export type DocStatus = "Indexed" | "Processing";
export type DocType = "pdf" | "doc" | "sheet" | "markdown" | "web";

export interface KnowledgeDoc {
  id: string;
  name: string;
  type: DocType;
  size: string;
  date: string;
  status: DocStatus;
}

export const documents: KnowledgeDoc[] = [
  { id: "d1", name: "Q3-research-report.pdf", type: "pdf", size: "2.4 MB", date: "Jun 30, 2026", status: "Indexed" },
  { id: "d2", name: "competitor-analysis.docx", type: "doc", size: "812 KB", date: "Jun 28, 2026", status: "Indexed" },
  { id: "d3", name: "benchmarks.xlsx", type: "sheet", size: "1.1 MB", date: "Jun 25, 2026", status: "Processing" },
  { id: "d4", name: "architecture-notes.md", type: "markdown", size: "48 KB", date: "Jun 22, 2026", status: "Indexed" },
  { id: "d5", name: "vendor-pricing.pdf", type: "pdf", size: "640 KB", date: "Jun 20, 2026", status: "Indexed" },
  { id: "d6", name: "docs.company.com", type: "web", size: "—", date: "Jun 18, 2026", status: "Processing" },
];

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Paused";
  runs: number;
}

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Literature Reviewer",
    description:
      "Retrieves relevant papers, synthesizes findings, and critiques methodology before drafting a summary.",
    status: "Active",
    runs: 128,
  },
  {
    id: "a2",
    name: "Market Analyst",
    description:
      "Gathers competitor data, compares positioning, and produces a structured brief with citations.",
    status: "Active",
    runs: 64,
  },
  {
    id: "a3",
    name: "Doc QA Bot",
    description:
      "Answers questions strictly from the indexed knowledge base with inline source references.",
    status: "Draft",
    runs: 0,
  },
  {
    id: "a4",
    name: "Weekly Digest",
    description:
      "Scans new documents each week and refines a concise digest of what changed.",
    status: "Paused",
    runs: 12,
  },
];

export const pipelineStages = [
  { id: "retrieve", label: "Retrieve", description: "Fetch relevant context" },
  { id: "synthesize", label: "Synthesize", description: "Combine & draft" },
  { id: "critique", label: "Critique", description: "Check & score" },
  { id: "refine", label: "Refine", description: "Polish output" },
];
