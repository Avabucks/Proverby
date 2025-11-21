'use server';
import { pool } from "@/src/lib/db";
import { generateCodeSecure, cleanString } from "@/src/utils/utils";
import { checkUsernameSameUid, getUser } from "@/src/actions/users_actions";
import { sendEmail } from "@/src/utils/send_mail";

export async function dailyProverbio() {

  const result = await pool.query(
    `SELECT P.*, U.foto_profilo AS "photoURL"
     FROM proverbi P JOIN users U ON P.username=U.username
     WHERE stato=2 AND proverbio_del_giorno=2
     LIMIT 1`
  );

  return result.rows[0];

}

export async function getProverbioFromSEO(seoLink: string, uid?: string, username?: string) {

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

  const arr = result.rows[0]

  if (uid && username) {
    const savedResult = await pool.query(
      `SELECT 1
      FROM salvati S
      JOIN users U ON S.uid = U.uid
      JOIN proverbi P ON P.seo_link = S.proverbio_id
      WHERE P.seo_link = $1 AND U.uid = $2 AND U.username = $3`,
      [seoLink, uid, username]
    );

    arr.isSaved = savedResult.rows.length > 0 ? true : false;

  }

  return arr;

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
     WHERE stato=2 AND proverbio_del_giorno!=2
     ORDER BY score_week DESC, id DESC
     LIMIT 10`
  );

  return result.rows;

}

export async function acceptedProverbi(username?: string) {

  if (!username) return false

  // TODO: calcolo punti del proverbio

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
     ORDER BY data_accettazione, id DESC`,
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
     ORDER BY data_accettazione, id DESC`,
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
     ORDER BY data_accettazione, id DESC`,
    [username, uid]
  );

  return result.rows;

}

export async function salvatiProverbi(username?: string, uid?: string) {

  if (!username || !uid) return false

  const result = await pool.query(
    `SELECT 
    P.*,
    U1.foto_profilo AS "photoURL",
    (
        SELECT COUNT(*) 
        FROM salvati S
        WHERE S.uid = $2
    ) AS "totProverbi"
     FROM salvati S
     JOIN proverbi P ON P.seo_link=S.proverbio_id
     JOIN users U1 ON P.username=U1.username
     JOIN users U2 ON S.uid=U2.uid
     WHERE P.stato=2 AND U2.username = $1 AND S.uid = $2
     ORDER BY S.id DESC`,
    [username, uid]
  );

  return result.rows;

}

export async function deleteProverbio(id: number) {

  try {
    const result = await pool.query(
      'DELETE FROM proverbi WHERE id = $1',
      [id]
    );
    return true;
  } catch (err) {
    return false;
  }

}

export async function aggiungiProverbio(seoLink: string, uid: string, username: string, proverbio: string, spiegazione: string, esempi: string[], isAdmin: number) {

  proverbio = cleanString(proverbio)
  spiegazione = cleanString(spiegazione)
  const esempiCleaned = esempi.map(e => cleanString(e));

  let stato;

  const same = await checkUsernameSameUid(uid);
  if (same) return { success: false, error: "Errore del database" };
  const user = await getUser(username, uid);
  if (!user) return { success: false, error: "Utente non esistente" };

  let result;
  if (seoLink == "new") {
    stato = 0
    seoLink = generateCodeSecure()

    result = await pool.query(
      `INSERT INTO proverbi (proverbio, spiegazione, esempi, stato, data_accettazione, username, seo_link)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [proverbio, spiegazione, esempiCleaned, stato, new Date(), username, seoLink]
    );

  } else {
    if (isAdmin == 0) {
      stato = 0
      result = await pool.query(
        `UPDATE proverbi
        SET proverbio = $1,
        spiegazione = $2,
        esempi = $3,
        stato = $4,
        data_accettazione = $5
        WHERE seo_link = $6`,
        [proverbio, spiegazione, esempiCleaned, stato, new Date(), seoLink]
      );
    } else if (isAdmin == 1) {
      result = await pool.query(
        `UPDATE proverbi
        SET proverbio = $1,
        spiegazione = $2,
        esempi = $3
        WHERE seo_link = $4`,
        [proverbio, spiegazione, esempiCleaned, seoLink]
      );
    }
  }

  if (result) {
    if (isAdmin == 0) {
      return { success: true }; // TODO: togliere

      const sended = await sendEmail({
        to: "info@proverby.it",
        subject: "Richiesta di accettazione del proverbio",
        html: `
          <div>
            <p>Utente: ${username}</p>
            <p>Proverbio: ${proverbio}</p>
            <a href="https://www.proverby.it/admin">Vai all'admin</a>
          <div>`
      });
      return { success: true };
    } else {
      return { success: true };
    }
  } else {
    return { success: false, error: "Errore del database" };
  }

}

export async function salvaProverbio(uid: string, username: string, isSaved: boolean, id?: string) {

  if (!id) return { success: false, error: "Errore del database" };

  const same = await checkUsernameSameUid(uid);
  if (same) return { success: false, error: "Errore del database" };
  const user = await getUser(username, uid);
  if (!user) return { success: false, error: "Utente non esistente" };

  let result;
  if (isSaved) {
    result = await pool.query(
      'DELETE FROM salvati WHERE proverbio_id = $1 AND uid = $2',
      [id, uid]
    );
  } else {
    result = await pool.query(
      `INSERT INTO salvati (proverbio_id, uid)
        VALUES ($1, $2)`,
      [id, uid]
    );
  }

  if (result) {
    return { success: true };
  } else {
    return { success: false, error: "Errore del database" };
  }

}
