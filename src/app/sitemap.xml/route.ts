import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

const SITE_URL = "https://www.proverby.it";

export const dynamic = "force-dynamic";

export async function GET() {
  const client = await pool.connect();
  try {
    const proverbsResult = await client.query(
      `SELECT seo_link, data_accettazione as "lastmod"
       FROM proverbi
       WHERE stato != 1`
    );
    const usersResult = await client.query(
      `SELECT username
       FROM users
       WHERE username != uid`
    );
    const alfabetoResult = await pool.query(
      `SELECT UPPER(SUBSTRING(proverbio, 1, 1)) AS first_letter
     FROM proverbi
     WHERE stato = 2
     GROUP BY first_letter
     ORDER BY first_letter`
    );

    const proverbi_urls = proverbsResult.rows
      .map(
        (p) =>
          `<url><loc>${SITE_URL}/proverbio/${p.seo_link}</loc><lastmod>${p.lastmod.toISOString().split("T")[0]}</lastmod></url>`
      )
      .join("\n");

    const users_urls = usersResult.rows
      .map((u) => `<url><loc>${SITE_URL}/profilo/${u.username}</loc></url>`)
      .join("\n");

    const alfabeto = alfabetoResult.rows
      .map((a) => `<url><loc>${SITE_URL}/alfabeto/${a.first_letter}</loc></url>`)
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc></url>
  <url><loc>${SITE_URL}/terms</loc></url>
  <url><loc>${SITE_URL}/about</loc></url>
  <url><loc>${SITE_URL}/editor/new</loc></url>
  <url><loc>${SITE_URL}/sfoglia</loc></url>
  <url><loc>${SITE_URL}/quiz</loc></url>
  ${proverbi_urls}
  ${users_urls}
  ${alfabeto}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    client.release();
  }
}