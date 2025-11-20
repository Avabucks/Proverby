"use server"
import { pool } from "@/src/lib/db";

export async function checkAdmin(uid: string) {

  const result = await pool.query(
    `SELECT uid FROM users WHERE is_admin=1`
  );

  const isAdmin = result.rows.some(row => row.uid === uid);

  return isAdmin;
}

export async function adminProverbi() {

  const result = await pool.query(
    `SELECT P.*, U.foto_profilo AS "photoURL"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE stato=0
     ORDER BY data_accettazione DESC`
  );

  return result.rows;

}

export async function accettaProverbio(id: number, uid: string) {
  const check = await checkAdmin(uid)
  if (!check) return { success: false };

  await pool.query(
    `UPDATE proverbi
   SET stato = 2, data_accettazione = $1
   WHERE id = $2`,
    [new Date(), id]
  );

  // TODO: send mail

  return { success: true };

}

export async function declinaProverbio(id: number, uid: string) {
  const check = await checkAdmin(uid)
  if (!check) return { success: false };

  await pool.query(
    `UPDATE proverbi
   SET stato = 1
   WHERE id = $1`,
    [id]
  );

  // TODO: send mail
  
  return { success: true };

}