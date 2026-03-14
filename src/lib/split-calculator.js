/**
 * Calculate expense splits and simplified debts for a month.
 *
 * @param {Array} users - [{ id, name, phone }]
 * @param {Array} expenses - [{ user_id, amount }]
 * @param {Array} settlements - [{ from_user_id, to_user_id, amount }]
 * @returns {{ perPersonShare, balances, debts }}
 */
export function calculateSplit(users, expenses, settlements) {
  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const perPersonShare = users.length > 0 ? totalSpent / users.length : 0;

  // If no expenses, everyone is at zero — no debts possible
  if (totalSpent === 0) {
    const balances = users.map((u) => ({
      userId: u.id,
      name: u.name,
      phone: u.phone,
      totalSpent: 0,
      share: 0,
      balance: 0,
    }));
    return { totalSpent: 0, perPersonShare: 0, balances, debts: [] };
  }

  // Calculate how much each person spent
  const spentByUser = {};
  users.forEach((u) => (spentByUser[u.id] = 0));
  expenses.forEach((e) => {
    spentByUser[e.user_id] = (spentByUser[e.user_id] || 0) + parseFloat(e.amount);
  });

  // Account for settlements
  // When from_user pays to_user:
  //   from_user has paid money → reduce what they owe (subtract from balance)
  //   to_user received money → increase what they owe / reduce what they're owed (add to balance)
  const settledByUser = {};
  users.forEach((u) => (settledByUser[u.id] = 0));
  settlements.forEach((s) => {
    settledByUser[s.from_user_id] = (settledByUser[s.from_user_id] || 0) - parseFloat(s.amount);
    settledByUser[s.to_user_id] = (settledByUser[s.to_user_id] || 0) + parseFloat(s.amount);
  });

  // Balance: positive means they owe money, negative means they are owed
  // Formula: what they should pay (share) - what they spent + settlement adjustment
  const balances = users.map((u) => {
    const spent = spentByUser[u.id] || 0;
    const settled = settledByUser[u.id] || 0;
    const balance = perPersonShare - spent + settled;
    return {
      userId: u.id,
      name: u.name,
      phone: u.phone,
      totalSpent: spent,
      share: perPersonShare,
      balance: Math.round(balance * 100) / 100, // positive = owes, negative = is owed
    };
  });

  // Simplify debts using greedy algorithm
  const debts = simplifyDebts(balances);

  return { totalSpent, perPersonShare, balances, debts };
}

function simplifyDebts(balances) {
  const debtors = []; // people who owe (balance > 0)
  const creditors = []; // people who are owed (balance < 0)

  balances.forEach((b) => {
    if (b.balance > 0.01) {
      debtors.push({ ...b, remaining: b.balance });
    } else if (b.balance < -0.01) {
      creditors.push({ ...b, remaining: -b.balance });
    }
  });

  // Sort descending by amount
  debtors.sort((a, b) => b.remaining - a.remaining);
  creditors.sort((a, b) => b.remaining - a.remaining);

  const transactions = [];

  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].remaining, creditors[j].remaining);
    if (amount > 0.01) {
      transactions.push({
        from: { id: debtors[i].userId, name: debtors[i].name },
        to: { id: creditors[j].userId, name: creditors[j].name, phone: creditors[j].phone },
        amount: Math.round(amount * 100) / 100,
      });
    }
    debtors[i].remaining -= amount;
    creditors[j].remaining -= amount;
    if (debtors[i].remaining < 0.01) i++;
    if (creditors[j].remaining < 0.01) j++;
  }

  console.log("Simplified transactions:", transactions);

  return transactions;
}
