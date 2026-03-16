import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getExpenses } from "@/actions/expenses";
import { getSettlements } from "@/actions/settlements";
import { getUsers } from "@/actions/users";
import { getSession } from "@/lib/session";
import { calculateSplit } from "@/lib/split-calculator";
import MonthSelector from "@/components/month-selector";
import SummaryTable from "@/components/summary-table";
import WhoPaysWhomTable from "@/components/who-pays-whom-table";
import MyBalanceCard from "@/components/my-balance-card";
import SettlementHistory from "@/components/settlement-history";

export const metadata = {
  title: "Summary — SplitEase",
};

export default async function SummaryPage({ searchParams }) {
  const params = await searchParams;

  // Auto-redirect to current month if no month param
  if (!params?.month) {
    const now = new Date();
    const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    redirect(`/summary?month=${m}`);
  }

  const month = params.month;

  const [users, expenses, settlements, session] = await Promise.all([
    getUsers(),
    getExpenses(month),
    getSettlements(month),
    getSession(),
  ]);

  const { totalSpent, perPersonShare, balances, debts } = calculateSplit(users, expenses, settlements);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
      {/* Month Selector */}
      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>

      {/* My Balance Card */}
      {session && (
        <div className="mt-6">
          <MyBalanceCard
            balances={balances}
            debts={debts}
            currentUserId={session.userId}
          />
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Spent</p>
          <p className="text-2xl font-bold mt-1">₹{totalSpent.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Per Person</p>
          <p className="text-2xl font-bold mt-1">₹{perPersonShare.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Split Overview */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-3">Split Overview</h2>
        <SummaryTable balances={balances} />
      </div>

      {/* Who Pays Whom */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-3">Settlements</h2>
        <WhoPaysWhomTable debts={debts} month={month} />
      </div>

      {/* Settlement History with Undo */}
      <SettlementHistory settlements={settlements} />
    </div>
  );
}
