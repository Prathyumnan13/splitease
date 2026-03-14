import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getExpenses } from "@/actions/expenses";
import { getSession } from "@/lib/session";
import MonthSelector from "@/components/month-selector";
import ExpenseTable from "@/components/expense-table";
import AddExpenseModal from "@/components/add-expense-modal";

export const metadata = {
  title: "Expenses — SplitEase",
};

export default async function ExpensesPage({ searchParams }) {
  const params = await searchParams;

  // Auto-redirect to current month if no month param
  if (!params?.month) {
    const now = new Date();
    const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    redirect(`/expenses?month=${m}`);
  }

  const month = params.month;

  const [expenses, session] = await Promise.all([
    getExpenses(month),
    getSession(),
  ]);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
      {/* Month Selector */}
      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>

      {/* Header + Add Button */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div>
          <h1 className="text-xl font-bold">Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {expenses.length} expense{expenses.length !== 1 ? "s" : ""} this month
          </p>
        </div>
        <AddExpenseModal currentUser={{ id: session.userId, name: session.name }} month={month} />
      </div>

      {/* Expense List */}
      <ExpenseTable expenses={expenses} />
    </div>
  );
}
