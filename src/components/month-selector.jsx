"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const now = new Date();
  const currentMonth = searchParams.get("month") ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [year, month] = currentMonth.split("-").map(Number);

  const navigate = (newYear, newMonth) => {
    const m = `${newYear}-${String(newMonth).padStart(2, "0")}`;
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", m);
    router.push(`?${params.toString()}`);
  };

  const goPrev = () => {
    if (month === 1) navigate(year - 1, 12);
    else navigate(year, month - 1);
  };

  const goNext = () => {
    if (month === 12) navigate(year + 1, 1);
    else navigate(year, month + 1);
  };

  const label = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-center gap-3 select-none">
      <button
        onClick={goPrev}
        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
          flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700
          active:scale-95 transition-all shadow-sm"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-lg font-semibold min-w-[160px] text-center">{label}</span>
      <button
        onClick={goNext}
        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
          flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700
          active:scale-95 transition-all shadow-sm"
        aria-label="Next month"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
