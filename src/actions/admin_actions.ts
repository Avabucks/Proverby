"use server"
import { pool } from "@/src/lib/db";
import { sendEmail } from "@/src/utils/send_mail";

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
     ORDER BY data_accettazione DESC, id DESC`
  );

  return result.rows;

}

export async function accettaProverbio(id: number, uid: string) {
  const check = await checkAdmin(uid)
  if (!check) return { success: false };

  const result = await pool.query(
    `WITH updated AS (
      UPDATE proverbi
      SET stato = 2, data_accettazione = $1
      WHERE id = $2
      RETURNING *
    )
    SELECT U.email, U.username, P.proverbio, P.seo_link AS "seoLink"
    FROM updated P
    JOIN users U ON U.username = P.username`,
    [new Date(), id]
  );

  const to_email = result.rows[0].email
  const username = result.rows[0].username
  const proverbio = result.rows[0].proverbio
  const proverbUrl = "https://www.proverby.it/proverbio/" + result.rows[0].seoLink

  const sended = await sendEmail({
    to: to_email,
    subject: "Il tuo proverbio è stato pubblicato su proverby.it 🎉",
    html: `
      <!doctype html>
      <html lang="it">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Proverbio pubblicato</title>
      </head>
      <body style="margin:0; padding:15px; background:#f5f7fa; font-family:Arial, sans-serif;">

        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <div style="padding:20px 24px; background:linear-gradient(90deg,#8a63e0,#6648af); color:#fff;">
            <h1 style="margin:0; font-size:20px;">Proverbio pubblicato su <a href="https://proverby.it" style="color:#ffffff;">proverby.it</a> 🎉</h1>
          </div>

          <div style="padding:20px 24px; font-size:16px; color:#111; line-height:1.5;">
            <p>Ciao <strong>${username}</strong>,</p>

            <p>Ottime notizie! Il tuo proverbio è stato <strong>approvato e pubblicato</strong> sul nostro sito.</p>

            <div style="background:#f3f6ff; border:1px solid #e6ebff; padding:16px; border-radius:6px; margin:16px 0; font-style:italic;">
              “${proverbio}”
            </div>

            <div style="text-align:center; margin-top:24px;">
              <a href="${proverbUrl}"
                style="display:inline-block; padding:12px 18px; background:#6648af; color:#fff; text-decoration:none;
                      border-radius:8px; font-weight:600; box-shadow:0 4px 12px rgba(37,99,235,0.18);">
                Visualizza il proverbio
              </a>
            </div>

            <p style="margin-top:24px;">
              Puoi modificarlo, condividerlo o vedere tutti i tuoi invii dalla tua area personale.
            </p>

            <p style="font-size:13px; color:rgba(0,0,0,.5);">
              Grazie per aver contribuito a far crescere il sapere di Proverby.it!
            </p>
          </div>

          <div style="padding:16px 24px; font-size:13px; color:#6b7280; background:#fafcff; border-top:1px solid #eef2ff;">
            <div>Saluti,<br><strong>Il team di Proverby.it</strong></div>
            <div style="margin-top:8px;">
              <a href="https://proverby.it" style="color:#2563eb; text-decoration:none;">proverby.it</a>
            </div>
          </div>

        </div>
      </body>
      </html>
      `
  });
  return { success: true };

}

export async function declinaProverbio(id: number, uid: string) {
  const check = await checkAdmin(uid)
  if (!check) return { success: false };

  const result = await pool.query(
    `WITH updated AS (
      UPDATE proverbi
      SET stato = 1, data_accettazione = $1
      WHERE id = $2
      RETURNING *
    )
    SELECT U.email, U.username, P.proverbio, P.seo_link AS "seoLink"
    FROM updated P
    JOIN users U ON U.username = P.username`,
    [new Date(), id]
  );

  const to_email = result.rows[0].email
  const username = result.rows[0].username
  const proverbio = result.rows[0].proverbio
  const motivo_rifiuto = null

  const sended = await sendEmail({
    to: to_email,
    subject: "Il tuo proverbio non è stato approvato su proverby.it",
    html: `
      <!doctype html>
      <html lang="it">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Proverbio rifiutato</title>
      </head>
      <body style="margin:0; padding:15px; background:#f5f7fa; font-family:Arial, sans-serif;">

        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <div style="padding:20px 24px; background:linear-gradient(90deg,#ff5b5b,#ff7b7b); color:#fff;">
            <h1 style="margin:0; font-size:20px;">Il tuo proverbio non è stato approvato</h1>
          </div>

          <div style="padding:20px 24px; font-size:16px; color:#111; line-height:1.5;">
            <p>Ciao <strong>${username}</strong>,</p>

            <p>Ti ringraziamo per aver inviato un proverbio su <a href="https://proverby.it" style="color:#000000;">proverby.it</a>.</p>

            <p>Purtroppo, dopo averlo revisionato, non abbiamo potuto approvarlo.</p>

            <div style="background:#fff5f5; border:1px solid #ffe0e0; padding:16px; border-radius:6px; margin:16px 0; font-style:italic; color:#b00000;">
              “${proverbio}”
            </div>

            ${
              motivo_rifiuto
                ? `<p><strong>Motivo del rifiuto:</strong><br>${motivo_rifiuto}</p>`
                : `<p><em>(Nessun motivo specificato)</em></p>`
            }

            <p style="margin-top:24px;">
              Se desideri, puoi inviare una versione rivista oppure proporre altri proverbi.
            </p>

            <div style="text-align:center; margin-top:24px;">
              <a href="https://www.proverby.it"
                style="display:inline-block; padding:12px 18px; background:#6b7280; color:#fff; text-decoration:none;
                      border-radius:8px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.18);">
                Torna al sito
              </a>
            </div>

            <p style="margin-top:24px; font-size:13px; color:rgba(0,0,0,.5);">
              Grazie per il tuo contributo e per aiutare la nostra raccolta di saggezza popolare.
            </p>
          </div>

          <div style="padding:16px 24px; font-size:13px; color:#6b7280; background:#fafcff; border-top:1px solid #eef2ff;">
            <div>Saluti,<br><strong>Il team di Proverby.it</strong></div>
            <div style="margin-top:8px;">
              <a href="https://proverby.it" style="color:#2563eb; text-decoration:none;">proverby.it</a>
            </div>
          </div>

        </div>
      </body>
      </html>
      `
  });
  return { success: true };

}