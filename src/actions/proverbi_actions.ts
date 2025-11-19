'use server';
import { pool } from "@/src/lib/db";
import { generateCodeSecure, cleanString } from "@/src/utils/utils";

export async function dailyProverbio() {

  const result = await pool.query(
    `SELECT P.*, U.foto_profilo AS "photoURL"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE stato=2 AND proverbio_del_giorno=1
     LIMIT 1`
  );

  return result.rows[0];

}

export async function getProverbioFromSEO(seoLink: string) {

  if (!seoLink) return null;

  const result = await pool.query(
    `SELECT P.*, U.foto_profilo AS "photoURL"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE seo_link = $1
     LIMIT 1`,
    [seoLink]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];

}

export async function getRandomProverbioSEO() {

  const result = await pool.query(
    `SELECT seo_link AS "seoLink"
     FROM proverbi
     WHERE stato=2
     ORDER BY RANDOM()
     LIMIT 1`
  );

  return result.rows[0].seoLink;

}

export async function top10Proverbi() {

  const result = await pool.query(
    `SELECT P.*, U.foto_profilo AS "photoURL"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE stato=2 AND proverbio_del_giorno=0
     ORDER BY score_week
     LIMIT 10`
  );

  return result.rows;

}

export async function acceptedProverbi(username?: string) {

  if (!username) return false

  const result = await pool.query(
    `SELECT 
    P.*,
    U.foto_profilo AS "photoURL",
    (
        SELECT COUNT(*) 
        FROM proverbi 
        WHERE username = $1 AND stato = 2
    ) AS "totProverbi"
    FROM proverbi P
    JOIN users U ON P.username = U.username
    WHERE P.stato = 2 AND P.username = $1
    ORDER BY P.data_accettazione;`,
    [username]
  );

  return result.rows;

}

export async function reviewProverbi(username?: string, uid?: string) {

  if (!username || !uid) return false

  const result = await pool.query(
    `SELECT 
    P.*,
    U.foto_profilo AS "photoURL",
    (
        SELECT COUNT(*) 
        FROM proverbi 
        WHERE username = $1 AND stato = 2
    ) AS "totProverbi"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE stato=0 AND P.username=$1 AND U.uid=$2
     ORDER BY data_accettazione`,
    [username, uid]
  );

  return result.rows;

}

export async function declinedProverbi(username?: string, uid?: string) {

  if (!username || !uid) return false

  const result = await pool.query(
    `SELECT 
    P.*,
    U.foto_profilo AS "photoURL",
    (
        SELECT COUNT(*) 
        FROM proverbi 
        WHERE username = $1 AND stato = 2
    ) AS "totProverbi"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE stato=1 AND P.username=$1 AND U.uid=$2
     ORDER BY data_accettazione`,
    [username, uid]
  );

  return result.rows;

}

export async function aggiungiProverbio(id: string, username: string, uid: string, proverbio: string, spiegazione: string) {

  if (proverbio.length == 0 || spiegazione.length == 0) return { success: false, error: "Il proverbio e la spiegazione non possono essere vuoti." };

  proverbio = cleanString(proverbio)
  spiegazione = cleanString(spiegazione)
  // TODO: esempio
  const seoLink = generateCodeSecure()
  // TODO: controlla username se è diverso da uid e username apparteenete a quell uid

  if (id == "new") {
    // query aggiunta
  } else {
    // query modifica
  }

  return { success: true };
  // TODO: mail admin

}