import CopyButton from "./copy-button";

export default function MyBalanceCard({ balances, debts, currentUserId }) {
  const myBalance = balances.find((b) => b.userId === currentUserId);
  if (!myBalance) return null;

  const myDebts = debts.filter((d) => d.from.id === currentUserId);
  const myReceivables = debts.filter((d) => d.to.id === currentUserId);

  const isOwed = myBalance.balance < -0.01;
  const owes = myBalance.balance > 0.01;

  return (
    <div className={`p-5 rounded-2xl border shadow-sm ${
      isOwed
        ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800"
        : owes
          ? "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800"
          : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 border-slate-200 dark:border-slate-700"
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
          isOwed ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
            owes ? "bg-gradient-to-br from-orange-500 to-red-500" :
              "bg-gradient-to-br from-slate-400 to-slate-500"
        }`}>
          {myBalance.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">Hey, {myBalance.name}!</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You spent ₹{myBalance.totalSpent.toLocaleString("en-IN")} this month
          </p>
        </div>
      </div>

      {isOwed && (
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2">
          You are owed ₹{Math.abs(myBalance.balance).toLocaleString("en-IN")}
        </p>
      )}

      {owes && (
        <>
          <p className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-2">
            You owe ₹{myBalance.balance.toLocaleString("en-IN")}
          </p>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-100/80 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 mb-1">
            <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Please check once and pay by 30th/31st of the month. No new expenses will be added after that, so the final amount won&apos;t change. Copy the GPay number below and settle your dues.
            </p>
          </div>
        </>
      )}

      {!isOwed && !owes && (
        <p className="text-lg font-bold text-slate-500 mb-2">You&apos;re all settled!</p>
      )}

      {/* Debts to pay */}
      {myDebts.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">You need to pay</p>
          {myDebts.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60">
              <span className="text-sm font-medium">{d.to.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">₹{d.amount.toLocaleString("en-IN")}</span>
                <CopyButton text={d.to.phone} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Money to receive */}
      {myReceivables.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">You will receive from</p>
          {myReceivables.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60">
              <span className="text-sm font-medium">{d.from.name}</span>
              <span className="font-bold">₹{d.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
