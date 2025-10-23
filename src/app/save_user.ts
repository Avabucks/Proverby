'use server';
import { pool } from "@/src/lib/db";
import admin from "@/src/lib/firebaseAdmin";

export async function saveUser(name: string, email: string, uid: string, idToken: string) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  await pool.query("INSERT INTO user (name, email) VALUES (?, ?)", [
    name,
    email,
  ]);
}