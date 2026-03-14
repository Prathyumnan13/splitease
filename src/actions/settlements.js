"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function getSettlements(month) {
  const sql = neon(process.env.DATABASE_URL);
  const settlements = await sql`
    SELECT s.*, 
      fu.name as from_name, 
      tu.name as to_name
    FROM settlements s
    JOIN users fu ON s.from_user_id = fu.id
    JOIN users tu ON s.to_user_id = tu.id
    WHERE s.month = ${month}
    ORDER BY s.settled_at DESC
  `;
  return settlements;
}

export async function markSettled(formData) {
  const fromUserId = formData.get("fromUserId")?.toString();
  const toUserId = formData.get("toUserId")?.toString();
  const amount = parseFloat(formData.get("amount")?.toString());
  const month = formData.get("month")?.toString();

  if (!fromUserId || !toUserId || !amount || !month) {
    return { error: "All fields are required" };
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    INSERT INTO settlements (from_user_id, to_user_id, amount, month)
    VALUES (${fromUserId}, ${toUserId}, ${amount}, ${month})
  `;

  revalidatePath("/summary");
  return { success: true };
}

export async function undoSettlement(settlementId) {
  const sql = neon(process.env.DATABASE_URL);
  await sql`DELETE FROM settlements WHERE id = ${settlementId}`;
  revalidatePath("/summary");
  return { success: true };
}
