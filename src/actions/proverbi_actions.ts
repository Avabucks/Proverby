'use server';
import { pool } from "@/src/lib/db";
import { generateCodeSecure, cleanString, getLastMondayUTC } from "@/src/utils/utils";
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

export async function getProverbioFromSEO(seoLink: string, uid?: string, username?: string, fingerprint?: string) {

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
      JOIN proverbi P ON P.seo_link = S.proverbio_seo_link
      WHERE P.seo_link = $1 AND U.uid = $2 AND U.username = $3`,
      [seoLink, uid, username]
    );

    arr.isSaved = savedResult.rows.length > 0 ? true : false;

  }

  if (fingerprint) {
    let saveFingerprint
    saveFingerprint = uid ? uid : fingerprint
    arr.likeState = await getLikeProverbio(saveFingerprint, arr.id)
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

export async function top10Proverbi(fingerprint: string, uid?: string) {

  const lastMonday = getLastMondayUTC();

  let saveFingerprint
  saveFingerprint = uid ? uid : fingerprint

  const result = await pool.query(
    `SELECT P.*, U.foto_profilo AS "photoURL", COALESCE(L.like_state, 0) AS "likeState", 
    (
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 1 AND proverbio_id = P.id
        ) * 20 -
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 2 AND proverbio_id = P.id
        ) * 5
    ) AS "scoreProverbio",
    (
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 1 AND proverbio_id = P.id AND data_like::date >= $2
        ) * 20 -
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 2 AND proverbio_id = P.id AND data_like::date >= $2
        ) * 3
    ) AS "scoreProverbioWeek"
     FROM proverbi P JOIN users U ON P.username=U.username LEFT JOIN likes L ON P.id=L.proverbio_id AND L.fingerprint = $1
     WHERE stato=2 AND proverbio_del_giorno!=2
     ORDER BY "scoreProverbioWeek" DESC, id DESC
     LIMIT 10`,
     [saveFingerprint, lastMonday]
  );

  return result.rows;

}

export async function acceptedProverbi(fingerprint: string, username?: string, uid?: string) {

  if (!username) return false

  let saveFingerprint
  saveFingerprint = uid ? uid : fingerprint

  const result = await pool.query(
    `SELECT 
    P.*,
    U.foto_profilo AS "photoURL", COALESCE(L.like_state, 0) AS "likeState",
    (
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 1 AND proverbio_id = P.id
        ) * 20 -
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 2 AND proverbio_id = P.id
        ) * 5
    ) AS "scoreProverbio",
    (
        SELECT COUNT(*) 
        FROM proverbi 
        WHERE username = $1 AND stato = 2
    ) AS "totProverbi"
    FROM proverbi P
    JOIN users U ON P.username = U.username
    LEFT JOIN likes L ON P.id=L.proverbio_id AND L.fingerprint = $2
    WHERE P.stato = 2 AND P.username = $1
     ORDER BY data_accettazione, id DESC`,
    [username, saveFingerprint]
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

export async function salvatiProverbi(fingerprint: string, username?: string, uid?: string) {

  if (!username || !uid) return false

  let saveFingerprint
  saveFingerprint = uid ? uid : fingerprint

  const result = await pool.query(
    `SELECT 
    P.*,
    U1.foto_profilo AS "photoURL", COALESCE(L.like_state, 0) AS "likeState",
    (
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 1 AND proverbio_id = P.id
        ) * 20 -
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 2 AND proverbio_id = P.id
        ) * 5
    ) AS "scoreProverbio",
    (
        SELECT COUNT(*) 
        FROM salvati S
        WHERE S.uid = $2
    ) AS "totProverbi"
     FROM salvati S
     JOIN proverbi P ON P.seo_link=S.proverbio_seo_link
     JOIN users U1 ON P.username=U1.username
     JOIN users U2 ON S.uid=U2.uid
    LEFT JOIN likes L ON P.id=L.proverbio_id AND L.fingerprint = $3
     WHERE P.stato=2 AND U2.username = $1 AND S.uid = $2
     ORDER BY S.id DESC`,
    [username, uid, saveFingerprint]
  );

  return result.rows;

}

export async function similarProverbi(fingerprint: string, seoLink?: string, uid?: string) {

  if (!seoLink) return null

  let saveFingerprint
  saveFingerprint = uid ? uid : fingerprint

  const result = await pool.query(
    `
    WITH original AS (
      SELECT proverbio
      FROM proverbi
      WHERE seo_link = $1
      LIMIT 1
    )
    SELECT P.*, U.foto_profilo AS "photoURL", COALESCE(L.like_state, 0) AS "likeState",
    (
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 1 AND proverbio_id = P.id
        ) * 20 -
        (
            SELECT COUNT(*) 
            FROM likes
            WHERE like_state = 2 AND proverbio_id = P.id
        ) * 5
    ) AS "scoreProverbio",
           similarity(P.proverbio, O.proverbio) AS sim
    FROM proverbi P
    CROSS JOIN original O
    JOIN users U ON P.username = U.username
    LEFT JOIN likes L ON P.id=L.proverbio_id AND L.fingerprint = $2
    WHERE P.stato = 2
      AND P.proverbio_del_giorno != 2
      AND P.seo_link <> $1
    ORDER BY sim DESC, P.id DESC
    LIMIT 5;
    `,
    [seoLink, saveFingerprint]
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
  const esempiCleaned = esempi.map(e => cleanString(e))
    .filter(e => e !== "");

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
      'DELETE FROM salvati WHERE proverbio_seo_link = $1 AND uid = $2',
      [id, uid]
    );
  } else {
    result = await pool.query(
      `INSERT INTO salvati (proverbio_seo_link, uid)
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

export async function likeProverbio(fingerprint: string, likeState: number, id?: number, user_uid?: string) {

  if (!id || fingerprint == "") return { success: false, error: "Errore del database" };

  let saveFingerprint
  saveFingerprint = user_uid ? user_uid : fingerprint

  const result = await pool.query(
    `INSERT INTO likes (proverbio_id, fingerprint, like_state)
        VALUES ($1, $2, $3)
        ON CONFLICT (proverbio_id, fingerprint) 
        DO UPDATE SET like_state = $3, data_like = $4`,
    [id, saveFingerprint, likeState, new Date() || ""]
  );

  if (result) {
    return { success: true };
  } else {
    return { success: false, error: "Errore del database" };
  }

}

export async function getLikeProverbio(fingerprint: string, id?: number) {

  if (!id || fingerprint == "") return 0;

  const result = await pool.query(
    `SELECT like_state
      FROM likes
      WHERE proverbio_id = $1 AND fingerprint = $2`,
    [id, fingerprint]
  );

  if (result.rows[0]) {
    return result.rows[0].like_state;
  } else {
    return 0;
  }

}