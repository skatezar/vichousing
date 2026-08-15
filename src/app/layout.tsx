import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIC Housing — Vienna International Centre",
  description:
    "Exclusive real estate platform for UNIDO, UN, IAEA & CTBTO staff at the Vienna International Centre.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t divider py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-[var(--warm-gray)]">
                VIC Housing — Vienna International Centre
              </p>
              <p className="font-sans text-xs text-[var(--warm-gray)] mt-1 opacity-70">
                Exclusive to UNIDO · UN · IAEA · CTBTO staff
              </p>
            </div>
            <div className="font-sans text-xs text-[var(--warm-gray)] opacity-60">
              © {new Date().getFullYear()} VIC Housing. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
