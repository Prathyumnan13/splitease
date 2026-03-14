"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

export default function BottomNav({ userName }) {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/expenses",
      label: "Expenses",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      href: "/summary",
      label: "Summary",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Top bar - desktop only */}
      <header className="hidden sm:flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-slate-900/80
        backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <Link href="/expenses" className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          SplitEase
        </Link>
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm text-slate-500 dark:text-slate-400">{userName}</span>
          )}
          <form action={logout}>
            <button className="px-3 py-1.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/30 transition">
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="sm:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80
        backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          SplitEase
        </span>
        <div className="flex items-center gap-2">
          {userName && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{userName}</span>
          )}
          <form action={logout}>
            <button className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </form>
        </div>
      </header>

      {/* Bottom tab bar - mobile only */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
        border-t border-slate-200 dark:border-slate-800
        px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all
                  ${active ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`}
              >
                {tab.icon(active)}
                <span className={`text-[10px] font-medium ${active ? "text-violet-600 dark:text-violet-400" : "text-slate-400"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
