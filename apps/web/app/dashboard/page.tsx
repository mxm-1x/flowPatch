import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
import { LayoutDashboard, FileText, Zap, Settings, Plus, BarChart3, Clock, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const newslettersCount = await prisma.newsletter.count({
    where: { userId }
  });
  const activeAgentsCount = await prisma.agentRun.count({
    where: { status: "RUNNING", userId }
  });
  const recentRuns = await prisma.agentRun.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white">
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 shrink-0">
        <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tighter mb-4">
          <div className="w-6 h-6 bg-[#00FF41] flex items-center justify-center text-black text-xs">FP</div>
          FLOWPATCH
        </div>
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 bg-white/5 text-[#00FF41] border-l-2 border-[#00FF41] font-mono text-sm">
            <LayoutDashboard size={18} /> DASHBOARD
          </Link>
          <Link href="/library" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono text-sm">
            <FileText size={18} /> STYLE_LIBRARY
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono text-sm">
            <Settings size={18} /> SETTINGS
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">SYSTEM_OVERVIEW</h1>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Active session: admin_user_01</p>
          </div>
          <Link href="/generate" className="bg-[#00FF41] text-black font-mono font-bold px-6 py-3 flex items-center gap-2">
            <Plus size={18} /> NEW_GENERATION
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Newsletters_Generated", value: newslettersCount.toString(), icon: <FileText className="text-[#00FF41]" /> },
            { label: "Avg_Style_Score", value: "0%", icon: <Zap className="text-yellow-500" /> },
            { label: "Active_Agents", value: activeAgentsCount.toString().padStart(2, '0'), icon: <BarChart3 className="text-blue-500" /> },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-6 text-xl font-bold tracking-tighter">
             RECENT_ACTIVITY
          </div>
          <div className="w-full border border-white/5 bg-white/2">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-white/5 text-gray-500 uppercase">
                <tr>
                  <th className="p-4 border-b border-white/5">Topic</th>
                  <th className="p-4 border-b border-white/5">Status</th>
                  <th className="p-4 border-b border-white/5">Date</th>
                  <th className="p-4 border-b border-white/5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-gray-500 text-center">
                      No recent activity found.
                    </td>
                  </tr>
                ) : (
                  recentRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                      <td className="p-4 font-bold">{run.topic}</td>
                      <td className="p-4">{run.status.toUpperCase()}</td>
                      <td className="p-4 text-gray-500">{run.createdAt.toLocaleDateString()}</td>
                      <td className="p-4">
                         <Link href={`/reader/${run.id}`} className="text-[#00FF41] hover:underline">VIEW_STORY</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
