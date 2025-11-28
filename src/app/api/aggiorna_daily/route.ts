"use server"
import { pool } from "@/src/lib/db";
import { NextResponse } from 'next/server';
import { sendEmail } from "@/src/utils/send_mail";

export async function GET(request: Request) {
  if (request.headers.get('x-cron-key') !== process.env.CRON_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await pool.query(
      `UPDATE proverbi
       SET proverbio_del_giorno = 1
       WHERE proverbio_del_giorno = 2`
    );

    let result = await pool.query(
      `SELECT id FROM proverbi
       WHERE proverbio_del_giorno = 0 AND stato = 2
       ORDER BY data_accettazione ASC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      await pool.query(`UPDATE proverbi SET proverbio_del_giorno = 0`);
      result = await pool.query(
        `SELECT id FROM proverbi
         WHERE proverbio_del_giorno = 0 AND stato = 2
         ORDER BY data_accettazione ASC
         LIMIT 1`
      );
    }

    const newProverbId = result.rows[0].id;

    await pool.query(
      `UPDATE proverbi
       SET proverbio_del_giorno = 2
       WHERE id = $1`,
      [newProverbId]
    );

    const final = await pool.query(
      `SELECT P.*, U.foto_profilo AS "photoURL"
       FROM proverbi P
       JOIN users U ON P.username = U.username
       WHERE P.id = $1`,
      [newProverbId]
    );

    const sended = await sendEmail({
      to: "info@proverby.it",
      subject: "Aggiornamento proverbio del giorno",
      html: `
          <div>
            <p>Proverbio di oggi è: "${(final.rows[0].proverbio)}"</p>
            <a href="https://www.proverby.it">Vai a Proverby</a>
          <div>`
    })

    if (sended) return NextResponse.json(final.rows[0]);

  } catch (error) {
    const sended = await sendEmail({
      to: "info@proverby.it",
      subject: "Aggiornamento proverbio del giorno fallita",
      html: `
        <div>
          <p>Aggiornamento proverbio del giorno fallita</p>
          <a href="https://www.proverby.it/admin">Vai all'admin</a>
        <div>`
    })

    if (sended) return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// TODO (se giorno oggi == getprimolunediUTC [funzione utils]):
// azzera score_week di quiz e salva posizione in classifica
// mail ad admin con miglior proverbio
// mail ad admin se fallisce