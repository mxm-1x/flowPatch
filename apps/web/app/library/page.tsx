"use client";

import { motion } from "framer-motion";
import { Book, Search, Filter, Plus, Hash, Type, Link as LinkIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const mockSnippets = [
  { id: "1", type: "HOOK", content: "Most newsletters fail before sentence two. Here's why ours won't.", source: "The Hustle" },
  { id: "2", type: "CTA", content: "Click here to download the full scaling guide for 2026.", source: "Bankless" },
  { id: "3", type: "STORYTELLING", content: "Back in 2008, Paul Graham wrote about the 'maker schedule'. Today, we're seeing the 'agentic schedule'.", source: "Paul Graham" },
  { id: "4", type: "TRANSITION", content: "But before we dive into the data, we need to address the elephant in the GPU cluster.", source: "Think with IBM" },
  { id: "5", type: "HOOK", content: "Stop prompting. Start orchestrating. The era of the agent is here.", source: "Custom Ingest" },
];

export default function LibraryPage() {
  const [filter, setFilter] = useState("ALL");

  const filteredSnippets = filter === "ALL" 
    ? mockSnippets 
    : mockSnippets.filter(s => s.type === filter);

  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 shrink-0">
        <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tighter mb-4">
          <div className="w-6 h-6 bg-[#00FF41] flex items-center justify-center text-black text-xs">FP</div>
          FLOWPATCH
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono text-sm">
             DASHBOARD
          </Link>
          <Link href="/library" className="flex items-center gap-3 px-4 py-2 bg-white/5 text-[#00FF41] border-l-2 border-[#00FF41] font-mono text-sm">
             STYLE_LIBRARY
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono text-sm">
             SETTINGS
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2 text-[#EDEDED]">STYLE_LIBRARY</h1>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Atomic snippets retrieved for RAG orchestration.</p>
          </div>
          <button className="bg-[#00FF41] text-black font-mono font-bold px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform">
            <Plus size={18} /> INGEST_NEW_STYLE
          </button>
        </header>

        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input 
              type="text" 
              placeholder="SEARCH_SNIPPETS..." 
              className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 font-mono text-xs focus:outline-none focus:border-[#00FF41] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "HOOK", "TRANSITION", "CTA", "STORYTELLING"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 font-mono text-[10px] border transition-colors ${
                  filter === f ? "border-[#00FF41] text-[#00FF41] bg-[#00FF41]/5" : "border-white/10 text-gray-500 hover:border-white/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Snippet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet, i) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/2 border border-white/5 p-6 flex flex-col justify-between group hover:border-[#00FF41]/30 transition-colors relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 border border-white/5">
                  <Hash size={10} className="text-[#00FF41]" /> {snippet.type}
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
              
              <p className="text-sm font-sans leading-relaxed text-gray-300 mb-6 italic">
                "{snippet.content}"
              </p>

              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                <LinkIcon size={12} className="text-gray-600" />
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{snippet.source}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-gray-700 font-mono text-center">
             <Book size={40} className="mb-4 opacity-20" />
             <p>No snippets found matching filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
