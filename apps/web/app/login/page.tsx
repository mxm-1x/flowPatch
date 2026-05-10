"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("AUTHENTICATION_FAILED: Invalid credentials.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 font-mono font-bold text-2xl tracking-tighter mb-4">
            <div className="w-8 h-8 bg-[#00FF41] flex items-center justify-center text-black">FP</div>
            FLOWPATCH
          </div>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Neural_Gate_Authorization</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/2 border border-white/5 p-8 backdrop-blur-sm">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 font-mono text-[10px] uppercase">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2">
              <Mail size={12} /> Email_Link
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 font-mono text-sm focus:border-[#00FF41] outline-none transition-colors"
              placeholder="user@flowpatch.ai"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2">
              <Lock size={12} /> Access_Key
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 font-mono text-sm focus:border-[#00FF41] outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00FF41] text-black font-mono font-bold py-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "AUTHORIZE_SESSION"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <footer className="mt-8 text-center space-y-4">
          <p className="text-gray-500 font-mono text-[10px] uppercase">
            New unit? <Link href="/register" className="text-[#00FF41] hover:underline">REGISTER_IDENTITY</Link>
          </p>
          <Link href="/" className="block text-gray-600 font-mono text-[10px] uppercase hover:text-white transition-colors">
            RETURN_TO_BASE
          </Link>
        </footer>
      </div>
    </div>
  );
}
