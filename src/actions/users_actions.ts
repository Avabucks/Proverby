'use server';
import { pool } from "@/src/lib/db";
import admin from "@/src/lib/firebaseAdmin";

export async function saveUser(displayName: string, email: string, uid: string, photo_url: string, idToken: string) {
  const decoded = await admin.auth().verifyIdToken(idToken);

  if (decoded) {

    const result = await pool.query(
      `INSERT INTO users (username, display_name, email, uid, foto_profilo)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (uid) 
    DO UPDATE SET display_name = EXCLUDED.display_name, email = EXCLUDED.email, foto_profilo = EXCLUDED.foto_profilo
    `,
      [uid, displayName, email, uid, photo_url]
    );

    return result.rows[0];

  }
}

export async function getUserFromUsername(username: string) {

  // TODO: calcolo punti saggezza totali

  const result = await pool.query(
    `SELECT uid, username, display_name AS "displayName", email, foto_profilo AS "photoURL", partite_giocate as "partiteGiocate", best_score as "bestScore", miglior_posizione as "migliorPosizione", posizione_attuale as "posizioneAttuale", is_admin as "isAdmin"
     FROM users
     WHERE username = $1
     LIMIT 1`,
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];

}

export async function getUser(username: string, uid: string) {

  const result = await pool.query(
    `SELECT uid, username, display_name AS "displayName", email, foto_profilo AS "photoURL", partite_giocate as "partiteGiocate", best_score as "bestScore", miglior_posizione as "migliorPosizione", posizione_attuale as "posizioneAttuale", is_admin as "isAdmin"
     FROM users
     WHERE username = $1 AND uid = $2
     LIMIT 1`,
    [username, uid]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];

}

export async function getUsername(uid: string) {

  const result = await pool.query(
    `SELECT username, uid FROM users WHERE uid = $1`,
    [uid]
  );

  const user = result.rows[0];
  return user.username;

}

export async function checkUsernameSameUid(uid: string) {

  const result = await pool.query(
    `SELECT username, uid FROM users WHERE uid = $1`,
    [uid]
  );

  if (result.rows.length === 0) {
    return false // user not found
  }

  const user = result.rows[0];
  return uid === user.username

}

export async function setUsername(uid: string, username: string) {

  if (username.length > 15) return { success: false, error: "Username massimo 15 caratteri" };

  try {
    const same = await checkUsernameSameUid(uid);
    if (same) {
      const result = await pool.query(
        `
      UPDATE users
      SET username = $1
      WHERE uid = $2
      RETURNING username;
      `,
        [username, uid]
      );

      if (result.rowCount === 0) {
        return { success: false, error: "Utente non trovato" };
      }

      return { success: true };
    } else {
      return { success: false, error: "Errore del database" }
    }
  } catch (err: any) {
    if (err.code === "23505") { // Unique constraint violation (Postgres code 23505)
      return { success: false, error: "Username già esistente" };
    }

    console.error("Database error:", err);
    return { success: false, error: "Errore del database" };
  }
}