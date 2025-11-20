"use server";
import nodemailer from "nodemailer";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  // Configura il trasporto SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Proverby" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });
    return { success: true, message: "Email inviata!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Errore nell'invio dell'email" };
  }
}