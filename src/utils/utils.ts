import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSeoFriendly(str: string): string {
  return str
    .toLowerCase()                    // minuscole
    .normalize("NFD")                 // separa lettere e accenti
    .replace(/[\u0300-\u036f]/g, "") // rimuove accenti
    .replace(/[^a-z0-9 ]/g, "")      // rimuove caratteri non alfanumerici
    .trim()                           // rimuove spazi iniziali/finali
    .replace(/\s+/g, "_");            // sostituisce spazi con underscore
}

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(num: number): string {
  let result = "";
  while (num > 0) {
    const rem = num % 62;
    result = BASE62[rem] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

export function generateCodeSecure(): string {
  const ts = toBase62(Date.now());
  const random = Array.from({ length: 8 }, () =>
    BASE62[Math.floor(Math.random() * 62)]
  ).join("");
  return ts + random;
}

export function cleanString(str: string): string {
  let result = str;

  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1);
  }

  if (result.length > 0) {
    result = result[0].toUpperCase() + result.slice(1);
  }

  return result;
}

export function getLastMondayUTC(): string {
    const now = new Date();

    const dow = now.getUTCDay();

    const result = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));

    if (dow === 0) {
        result.setUTCDate(result.getUTCDate() - 6);
    } else {
        result.setUTCDate(result.getUTCDate() - (dow - 1));
    }

    const yyyy = result.getUTCFullYear();
    const mm = String(result.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(result.getUTCDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
}