"use server"
import { pool } from "@/src/lib/db";

export async function checkAdmin(uid: string) {

  const result = await pool.query(
    `SELECT uid FROM users WHERE is_admin=1`
  );

  const isAdmin = result.rows.some(row => row.uid === uid);

  return isAdmin;
}

