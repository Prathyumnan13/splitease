"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function getExpenses(month) {
  const sql = neon(process.env.DATABASE_URL);
  const expenses = await sql`
    SELECT e.id, e.user_id, u.name as person, e.reason, e.amount, e.created_at
    FROM expenses e
    JOIN users u ON e.user_id = u.id
    WHERE e.month = ${month}
    ORDER BY e.created_at DESC
  `;
  return expenses;
}

export async function addExpense(formData) {
  const userId = formData.get("userId")?.toString();
  const reason = formData.get("reason")?.toString().trim();
  const amount = parseFloat(formData.get("amount")?.toString());
  const month = formData.get("month")?.toString();

  if (!userId || !reason || !amount || !month) {
    return { error: "All fields are required" };
  }
  if (amount <= 0) {
    return { error: "Amount must be greater than 0" };
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    INSERT INTO expenses (user_id, reason, amount, month)
    VALUES (${userId}, ${reason}, ${amount}, ${month})
  `;

  revalidatePath("/expenses");
  revalidatePath("/summary");
  return { success: true };
}

export async function deleteExpense(expenseId) {
  const sql = neon(process.env.DATABASE_URL);
  await sql`DELETE FROM expenses WHERE id = ${expenseId}`;
  revalidatePath("/expenses");
  revalidatePath("/summary");
  return { success: true };
}
