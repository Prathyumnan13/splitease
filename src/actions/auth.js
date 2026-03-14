"use server";
import { neon } from "@neondatabase/serverless";
import { createSession, destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(formData) {
  const phone = formData.get("phone")?.toString().trim();
  if (!phone) return { error: "Phone number is required" };

  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`SELECT * FROM users WHERE phone = ${phone}`;

  if (users.length === 0) {
    return { error: "No account found with this phone number" };
  }

  await createSession(users[0]);
  redirect("/expenses");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
