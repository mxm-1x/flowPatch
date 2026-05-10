"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Loader2, Copy, ExternalLink, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type Log = {
  id: string;
  message: string;
  status: "pending" | "completed" | "error";
  timestamp: string;
};

export default function GeneratorPage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [draft, setDraft] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setLogs([{
      id: "init",
      message: "INITIALIZING_STREAMING_ORCHESTRATOR...",
      status: "pending",
      timestamp: new Date().toLocaleTimeString([], { hour12: false })
    }]);
    setDraft("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error("Connection failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Failed to start stream reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.replace("data: ", ""));
            
            if (data.type === "log") {
              setLogs(prev => [
                ...prev.map(l => ({ ...l, status: "completed" as const })),
                {
                  id: Math.random().toString(),
                  message: data.message,
                  status: "pending",
                  timestamp: new Date().toLocaleTimeString([], { hour12: false })
                }
              ]);
            } else if (data.type === "draft" || data.type === "final") {
              setDraft(data.content);
            } else if (data.type === "error") {
              throw new Error(data.message);
            }
          }
        }
      }

      setLogs(prev => prev.map(l => ({ ...l, status: "completed" as const })));
      
    } catch (error: any) {
      setLogs(prev => [...prev, {
        id: "error",
        message: `STREAM_ERROR: ${error.message}`,
        status: "error",
        timestamp: new Date().toLocaleTimeString([], { hour12: false })
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] font-sans text-white">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono font-bold tracking-tighter hover:text-[#00FF41] transition-colors text-white">FLOWPATCH // GENERATOR</Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            SYSTEM_ONLINE_STREAMING
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 text-xs font-mono transition-colors ${isCopied ? "text-[#00FF41]" : "text-gray-400 hover:text-white"}`}
          >
            {isCopied ? "COPIED_TO_CLIPBOARD" : "COPY_DRAFT"}
            <Copy size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-1/3 border-r border-white/5 flex flex-col bg-black/40">
          <div className="p-4 border-b border-white/5 bg-white/5 text-xs font-mono font-bold uppercase tracking-widest text-[#00FF41]">
            Thinking_Monolith_v2
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] scrollbar-hide">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <span className="text-gray-700 shrink-0">{log.timestamp}</span>
                  <span className={
                    log.status === "error" ? "text-red-500" :
                    log.status === "pending" ? "text-yellow-500" : 
                    "text-gray-400"
                  }>
                    {log.status === "pending" && " > "}
                    {log.message}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isGenerating && logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-700 text-center px-8 space-y-4">
                <Terminal size={32} />
                <p>Awaiting initialization sequence...</p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <form onSubmit={handleGenerate} className="flex gap-4">
              <input 
                type="text"
                placeholder="ENTER_TOPIC_TO_START_STREAM..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
                className="flex-1 bg-white/5 border border-white/10 p-4 font-mono text-sm outline-none focus:border-[#00FF41] disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isGenerating || !topic}
                className="bg-[#00FF41] text-black font-mono font-bold px-8 hover:brightness-110 active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
              >
                {isGenerating ? "STREAMING..." : "GENERATE"}
              </button>
            </form>
          </div>
          <div className="flex-1 overflow-y-auto p-12 bg-[#0C0C0C]">
             <div className="prose prose-invert max-w-2xl mx-auto">
               <ReactMarkdown>{draft}</ReactMarkdown>
             </div>
             {!draft && isGenerating && (
                <div className="h-full flex items-center justify-center space-x-4 text-gray-600 font-mono text-xs uppercase tracking-[0.4em]">
                   <Loader2 className="animate-spin text-[#00FF41]" size={20} />
                   <span>Receiving_Data_Packets...</span>
                </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
}
