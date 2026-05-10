"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Key, Cpu, BookOpen, Save, ChevronRight, LayoutDashboard, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    openaiKey: "",
    tavilyKey: "",
    model: "gpt-4o",
    maxRetries: "3",
    styleProfile: "professional",
    outputFormat: "newsletter",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({
    label,
    hint,
    children,
  }: {
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] font-mono text-gray-600">{hint}</p>}
    </div>
  );

  const inputCls =
    "w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#00FF41] transition-colors placeholder:text-gray-700";
  const selectCls =
    "w-full bg-[#111] border border-white/10 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#00FF41] transition-colors appearance-none cursor-pointer";

  const sections = [
    { id: "api", label: "API_KEYS", icon: <Key size={14} /> },
    { id: "model", label: "MODEL_CONFIG", icon: <Cpu size={14} /> },
    { id: "style", label: "STYLE_PROFILE", icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 shrink-0">
        <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tighter mb-4">
          <div className="w-6 h-6 bg-[#00FF41] flex items-center justify-center text-black text-xs">
            FP
          </div>
          FLOWPATCH
        </div>
        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono text-sm"
          >
            <LayoutDashboard size={18} /> DASHBOARD
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 bg-white/5 text-[#00FF41] border-l-2 border-[#00FF41] font-mono text-sm"
          >
            <Settings size={18} /> SETTINGS
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition-colors font-mono text-sm"
          >
            <LogOut size={18} /> LOGOUT_SESSION
          </button>
        </nav>
        <div className="border-t border-white/5 pt-6 space-y-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-mono text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-widest"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <form onSubmit={handleSave}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur border-b border-white/5 px-10 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter">SYSTEM_CONFIG</h1>
              <p className="text-gray-600 font-mono text-xs uppercase tracking-widest mt-1">
                Configure keys, model behavior, and style preferences
              </p>
            </div>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-3 font-mono font-bold text-sm transition-all ${
                saved
                  ? "bg-white/10 text-[#00FF41] border border-[#00FF41]/30"
                  : "bg-[#00FF41] text-black hover:scale-105"
              }`}
            >
              <Save size={16} />
              {saved ? "SAVED_✓" : "SAVE_CONFIG"}
            </button>
          </div>

          <div className="p-10 space-y-12 max-w-2xl">
            {/* API Keys */}
            <motion.section
              id="api"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Key size={14} className="text-[#00FF41]" />
                <h2 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#00FF41]">
                  API_KEYS
                </h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <Field
                label="OpenAI API Key"
                hint="Used by the drafter and critic agents. Requires GPT-4o access."
              >
                <input
                  type="password"
                  placeholder="sk-..."
                  value={config.openaiKey}
                  onChange={(e) => setConfig({ ...config, openaiKey: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field
                label="Tavily Search API Key"
                hint="Powers the researcher agent's real-time web search capability."
              >
                <input
                  type="password"
                  placeholder="tvly-..."
                  value={config.tavilyKey}
                  onChange={(e) => setConfig({ ...config, tavilyKey: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </motion.section>

            {/* Model Config */}
            <motion.section
              id="model"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Cpu size={14} className="text-[#00FF41]" />
                <h2 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#00FF41]">
                  MODEL_CONFIG
                </h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <Field label="Language Model" hint="The model used for drafting and critique passes.">
                <div className="relative">
                  <select
                    value={config.model}
                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                    className={selectCls}
                  >
                    <option value="gpt-4o">GPT-4o — Recommended</option>
                    <option value="gpt-4o-mini">GPT-4o Mini — Faster, lower cost</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                  <ChevronRight size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                </div>
              </Field>

              <Field
                label="Max Critique Retries"
                hint="How many times the critic agent re-runs before accepting output. Higher = better quality, slower."
              >
                <div className="flex gap-2">
                  {["1", "2", "3", "5"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setConfig({ ...config, maxRetries: n })}
                      className={`flex-1 py-3 font-mono text-sm border transition-all ${
                        config.maxRetries === n
                          ? "bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]"
                          : "border-white/10 text-gray-500 hover:border-white/20"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>
            </motion.section>

            {/* Style Profile */}
            <motion.section
              id="style"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={14} className="text-[#00FF41]" />
                <h2 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#00FF41]">
                  STYLE_PROFILE
                </h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <Field label="Voice / Tone" hint="The style matcher agent will retrieve examples matching this profile.">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "professional", label: "Professional" },
                    { id: "conversational", label: "Conversational" },
                    { id: "analytical", label: "Analytical" },
                    { id: "opinionated", label: "Opinionated" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setConfig({ ...config, styleProfile: s.id })}
                      className={`py-3 px-4 font-mono text-xs text-left border transition-all ${
                        config.styleProfile === s.id
                          ? "bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]"
                          : "border-white/10 text-gray-500 hover:border-white/20"
                      }`}
                    >
                      {s.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Output Format">
                <div className="relative">
                  <select
                    value={config.outputFormat}
                    onChange={(e) => setConfig({ ...config, outputFormat: e.target.value })}
                    className={selectCls}
                  >
                    <option value="newsletter">Newsletter</option>
                    <option value="blog">Blog Post</option>
                    <option value="thread">Social Thread</option>
                    <option value="report">Research Report</option>
                  </select>
                  <ChevronRight size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                </div>
              </Field>
            </motion.section>

            {/* Danger zone */}
            <section className="border border-red-900/30 p-6 space-y-4">
              <h2 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-red-500">
                DANGER_ZONE
              </h2>
              <p className="text-[11px] font-mono text-gray-600">
                Clearing the style index will erase all uploaded writing samples. This cannot be undone.
              </p>
              <button
                type="button"
                className="px-6 py-2 border border-red-900/50 text-red-600 font-mono text-xs hover:bg-red-900/20 transition-colors"
              >
                CLEAR_STYLE_INDEX
              </button>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}
