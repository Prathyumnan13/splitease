"use client";
import { deleteExpense } from "@/actions/expenses";
import { useState } from "react";

export default function ExpenseTable({ expenses }) {
  const [deletingId, setDeletingId] = useState(null);

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteExpense(id);
    setDeletingId(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">No expenses this month</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Tap &ldquo;Add Expense&rdquo; to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800
            border border-slate-100 dark:border-slate-700 shadow-sm
            hover:shadow-md transition-shadow"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500
            flex items-center justify-center text-white font-bold text-sm shrink-0">
            {expense.person.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{expense.person}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{expense.reason}</p>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <span className="text-lg font-bold">₹{parseFloat(expense.amount).toLocaleString("en-IN")}</span>
          </div>

          {/* Delete */}
          <button
            onClick={() => handleDelete(expense.id)}
            disabled={deletingId === expense.id}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50
              dark:hover:bg-red-900/30 transition shrink-0"
            title="Delete expense"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-2xl
        bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20
        border border-violet-200 dark:border-violet-800">
        <span className="font-semibold text-violet-700 dark:text-violet-300">Total</span>
        <span className="text-xl font-bold text-violet-700 dark:text-violet-300">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
