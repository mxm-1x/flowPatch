"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, ArrowRight, Zap, Repeat } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-mono font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-[#00FF41] flex items-center justify-center text-black">FP</div>
          FLOWPATCH
        </div>
        <nav className="hidden md:flex gap-8 font-mono text-sm text-gray-400">
          <Link href="#features" className="hover:text-[#00FF41] transition-colors">FEATURES</Link>
          <Link href="#how-it-works" className="hover:text-[#00FF41] transition-colors">SYSTEM_PROCESS</Link>
          <Link href="/dashboard" className="text-white border-b border-[#00FF41]">DASHBOARD _</Link>
        </nav>
      </header>

      <main className="max-w-4xl z-10 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3 py-1 mb-6 border border-[#00FF41] text-[#00FF41] font-mono text-xs tracking-widest uppercase bg-[#00FF41]/10">
            Next-Gen AI Orchestration
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            THE AGENTIC <br />
            <span className="text-[#00FF41]">CONTENT ENGINE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-mono mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop prompting. Start orchestrating. A multi-agent system that researches, learns your style, and self-critiques until it's perfect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/generate"
              className="px-8 py-4 bg-[#00FF41] text-black font-mono font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              INITIALIZE_GENERATION <ArrowRight size={18} />
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-4 border border-white/20 hover:border-[#00FF41]/50 transition-colors font-mono"
            >
              VIEW_DASHBOARD
            </Link>
          </div>
        </motion.div>

        <motion.section 
          id="features" 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          {[
            { icon: <Cpu />, title: "ATOMIC RAG", desc: "We don't just fetch text. We retrieve hooks, transitions, and CTAs by intent." },
            { icon: <Repeat />, title: "REFLECTION LOOP", desc: "The AI critiques itself across multiple turns until the output is human-grade." },
            { icon: <Zap />, title: "REAL-TIME LOGS", desc: "Watch the agents think, research, and revise in a high-fidelity terminal." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="p-6 bg-white/5 border border-white/10 hover:border-[#00FF41]/30 transition-colors group"
            >
              <div className="text-[#00FF41] mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-mono font-bold mb-2 tracking-tighter">{feature.title}</h3>
              <p className="text-sm text-gray-400 font-mono leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.section>
      </main>

      <footer className="mt-40 p-12 border-t border-white/5 w-full flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
        <div>© 2026 Flowpatch Industrial AI</div>
        <div>Build v0.1.0-alpha</div>
        <div>System_Stable</div>
      </footer>
    </div>
  );
}
