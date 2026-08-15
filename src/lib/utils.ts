import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, type: "rent" | "sell") {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price) + (type === "rent" ? "/mo" : "");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export const VIENNA_DISTRICTS = [
  "1st — Innere Stadt",
  "2nd — Leopoldstadt",
  "3rd — Landstraße",
  "4th — Wieden",
  "5th — Margareten",
  "6th — Mariahilf",
  "7th — Neubau",
  "8th — Josefstadt",
  "9th — Alsergrund",
  "10th — Favoriten",
  "11th — Simmering",
  "12th — Meidling",
  "13th — Hietzing",
  "14th — Penzing",
  "15th — Rudolfsheim-Fünfhaus",
  "16th — Ottakring",
  "17th — Hernals",
  "18th — Währing",
  "19th — Döbling",
  "20th — Brigittenau",
  "21st — Floridsdorf",
  "22nd — Donaustadt",
  "23rd — Liesing",
];

export const UN_EMAIL_DOMAINS = [
  "unido.org",
  "un.org",
  "iaea.org",
  "ctbto.org",
  "iaea.int",
];

export function isUNEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return UN_EMAIL_DOMAINS.some((d) => domain === d || domain?.endsWith("." + d));
}

export function getOrgFromEmail(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain?.includes("unido")) return "UNIDO";
  if (domain?.includes("iaea")) return "IAEA";
  if (domain?.includes("ctbto")) return "CTBTO";
  if (domain?.includes("un.org")) return "UN";
  return "OTHER";
}
