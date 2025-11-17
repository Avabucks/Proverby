import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

const SITE_URL = "https://www.proverby.it";

export async function GET() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const proverbsResult = await client.query(
      `SELECT seo_link, data_accettazione as "lastmod"
     FROM proverbi
     WHERE stato!=1`
    );
    const proverbs = proverbsResult.rows;

    const usersResult = await client.query(
      `SELECT username
     FROM users
     WHERE username!=uid`
    );
    const users = usersResult.rows;
    await client.query('COMMIT');

    const proverbi_urls = proverbs
      .map((p) => `<url><loc>${SITE_URL}/proverbio/${p.seo_link}</loc><lastmod>${p.lastmod.toISOString().split("T")[0]}</lastmod></url>`)
      .join("\n");

    const users_urls = users
      .map((u) => `<url><loc>${SITE_URL}/profilo/${u.username}</loc></url>`)
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc></url>
  <url><loc>${SITE_URL}/terms</loc></url>
  <url><loc>${SITE_URL}/about</loc></url>
  <url><loc>${SITE_URL}/aggiungi</loc></url>
  <url><loc>${SITE_URL}/sfoglia</loc></url>
  <url><loc>${SITE_URL}/quiz</loc></url>
  ${proverbi_urls}
  ${users_urls}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    client.release();
  }

}