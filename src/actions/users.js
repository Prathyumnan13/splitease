"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`SELECT * FROM users ORDER BY created_at ASC`;
  return users;
}

export async function addUser(formData) {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();

  if (!name || !phone) return { error: "Name and phone are required" };

  const sql = neon(process.env.DATABASE_URL);

  // Check max 4 users
  const count = await sql`SELECT COUNT(*) as count FROM users`;
  if (parseInt(count[0].count) >= 4) {
    return { error: "Maximum 4 users allowed" };
  }

  // Check duplicate phone
  const existing = await sql`SELECT id FROM users WHERE phone = ${phone}`;
  if (existing.length > 0) {
    return { error: "Phone number already registered" };
  }

  await sql`INSERT INTO users (name, phone) VALUES (${name}, ${phone})`;
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId) {
  const sql = neon(process.env.DATABASE_URL);
  await sql`DELETE FROM users WHERE id = ${userId}`;
  revalidatePath("/admin/users");
  return { success: true };
}
