import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const baseUrl = "https://private-pdf-toolkit.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Private PDF Toolkit - Free Client-Side PDF & Image Tools",
    template: "%s | Private PDF Toolkit",
  },
  description:
    "Merge, split, convert and compress PDF files privately in your browser. Free PDF tools with no uploads, accounts or watermarks.",
  verification: { google: "google4bf79fc737f0ba77" },
  alternates: { canonical: baseUrl },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "Private PDF Toolkit",
    title: "Private PDF Toolkit - Your Files Never Leave Your Device",
    description: "Fast, free PDF and image tools that run entirely in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private PDF Toolkit",
    description: "Private, client-side PDF tools. No uploads. No tracking. No watermarks.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-white/10 bg-graphite/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white sm:text-base">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-graphite">
                <LockKeyhole size={18} strokeWidth={2.5} />
              </span>
              Private PDF Toolkit
            </Link>
            <a href="#toolkit" className="rounded-full border border-mint/25 px-4 py-2 text-xs font-semibold text-mint transition hover:border-mint/60 hover:bg-mint/10 sm:text-sm">
              Open toolkit
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-white/10 px-5 py-10 text-center text-sm text-slate-500">
          <p>Private PDF Toolkit · Files are processed locally in your browser.</p>
          <p className="mt-2">© {new Date().getFullYear()} Built for privacy, speed and everyday work.</p>
        </footer>
      </body>
    </html>
  );
}
