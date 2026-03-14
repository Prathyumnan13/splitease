export default function SummaryTable({ balances }) {
  if (balances.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">No data for this month</div>
    );
  }

  return (
    <div className="space-y-3">
      {balances.map((b) => {
        const isOwed = b.balance < -0.01;
        const owes = b.balance > 0.01;

        return (
          <div
            key={b.userId}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800
              border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0
              ${isOwed ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                owes ? "bg-gradient-to-br from-orange-500 to-red-500" :
                  "bg-gradient-to-br from-slate-400 to-slate-500"}`}>
              {b.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + spent */}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm">{b.name}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spent ₹{b.totalSpent.toLocaleString("en-IN")} · Share ₹{b.share.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Balance */}
            <div className="text-right shrink-0">
              {isOwed ? (
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  Gets ₹{Math.abs(b.balance).toLocaleString("en-IN")}
                </span>
              ) : owes ? (
                <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                  Owes ₹{b.balance.toLocaleString("en-IN")}
                </span>
              ) : (
                <span className="text-base font-bold text-slate-400">Settled</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
