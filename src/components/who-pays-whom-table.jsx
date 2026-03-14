"use client";
import { useState } from "react";
import { markSettled } from "@/actions/settlements";
import CopyButton from "./copy-button";

export default function WhoPaysWhomTable({ debts, month }) {
  const [loadingIdx, setLoadingIdx] = useState(null);

  if (debts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-medium text-emerald-600 dark:text-emerald-400">All settled up!</p>
        <p className="text-sm text-slate-400 mt-1">No pending payments this month</p>
      </div>
    );
  }

  const handleSettle = async (debt, idx) => {
    setLoadingIdx(idx);
    const formData = new FormData();
    formData.set("fromUserId", debt.from.id);
    formData.set("toUserId", debt.to.id);
    formData.set("amount", debt.amount.toString());
    formData.set("month", month);
    await markSettled(formData);
    setLoadingIdx(null);
  };

  return (
    <div className="space-y-3">
      {debts.map((debt, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800
            border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          {/* From → To */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500
              flex items-center justify-center text-white font-bold text-xs shrink-0">
              {debt.from.name.charAt(0)}
            </div>
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500
              flex items-center justify-center text-white font-bold text-xs shrink-0">
              {debt.to.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm">
                <span className="font-semibold">{debt.from.name}</span>
                <span className="text-slate-400 mx-1">pays</span>
                <span className="font-semibold">{debt.to.name}</span>
              </span>
            </div>
            <span className="text-lg font-bold shrink-0">₹{debt.amount.toLocaleString("en-IN")}</span>
          </div>

          {/* GPay + Settle */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>GPay:</span>
              <CopyButton text={debt.to.phone} />
            </div>
            <button
              onClick={() => handleSettle(debt, idx)}
              disabled={loadingIdx === idx}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400
                bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50
                active:scale-95 disabled:opacity-50 transition-all"
            >
              {loadingIdx === idx ? "Settling..." : "✓ Mark Settled"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
