"use client";
import { useState } from "react";
import { undoSettlement } from "@/actions/settlements";

export default function SettlementHistory({ settlements }) {
  const [undoingId, setUndoingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  if (settlements.length === 0) return null;

  const handleUndo = async (id) => {
    setUndoingId(id);
    await undoSettlement(id);
    setUndoingId(null);
    setConfirmId(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-3">Settlement History</h2>
      <div className="space-y-2">
        {settlements.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20
              border border-emerald-100 dark:border-emerald-800 text-sm"
          >
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="flex-1 min-w-0">
              <span className="font-medium">{s.from_name}</span>
              <span className="text-slate-500 mx-1">paid</span>
              <span className="font-medium">{s.to_name}</span>
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              ₹{parseFloat(s.amount).toLocaleString("en-IN")}
            </span>

            {confirmId === s.id ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleUndo(s.id)}
                  disabled={undoingId === s.id}
                  className="px-2 py-1 rounded-lg text-xs font-semibold text-white
                    bg-red-500 hover:bg-red-600 active:scale-95
                    disabled:opacity-50 transition-all"
                >
                  {undoingId === s.id ? "..." : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-2 py-1 rounded-lg text-xs font-medium text-slate-500
                    hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(s.id)}
                title="Undo settlement"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500
                  hover:bg-red-50 dark:hover:bg-red-900/30 active:scale-90
                  transition-all shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
