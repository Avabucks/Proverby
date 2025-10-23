'use server';
import { pool } from "@/src/lib/db";
import admin from "@/src/lib/firebaseAdmin";

export async function saveUser(username: string, email: string, uid: string, idToken: string) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  await pool.query("INSERT INTO users (username, email, uid) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE username = VALUES(username), email = VALUES(email)", [
    username,
    email,
    uid,
  ]);
}