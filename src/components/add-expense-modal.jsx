"use client";
import { useState } from "react";
import { addExpense } from "@/actions/expenses";

export default function AddExpenseModal({ currentUser, month }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    formData.set("userId", currentUser.id);
    formData.set("month", month);

    const result = await addExpense(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
      e.target.reset();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white
          bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700
          active:scale-95 transition-all duration-150 shadow-lg shadow-violet-500/25"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Expense
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl
            shadow-2xl p-6 pb-8 sm:pb-6 animate-slide-up sm:animate-scale-in">
            {/* Drag handle for mobile */}
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mx-auto mb-5 sm:hidden" />

            <h2 className="text-xl font-bold mb-5">Add Expense</h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Logged-in user shown as read-only */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500
                  flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Adding as you</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Reason
                </label>
                <input
                  type="text"
                  name="reason"
                  required
                  placeholder="e.g., Electricity bill"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
                    bg-slate-50 dark:bg-slate-700 text-base placeholder:text-slate-400
                    focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
                    bg-slate-50 dark:bg-slate-700 text-base placeholder:text-slate-400
                    focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
                    text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white
                    bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700
                    disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-violet-500/25"
                >
                  {loading ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
