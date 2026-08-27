import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle2, FileImage, Files, Minimize2, Scissors, ShieldCheck, Sparkles, Zap } from "lucide-react";
import PdfToolkit from "@/components/PdfToolkit";

const popularTools = [
  { href: "/merge-pdf-free", title: "Merge PDF", text: "Combine PDFs in your chosen order.", icon: Files },
  { href: "/split-pdf-online", title: "Split PDF", text: "Extract any pages into a new file.", icon: Scissors },
  { href: "/jpg-to-pdf-converter", title: "JPG to PDF", text: "Turn images into a clean A4 PDF.", icon: FileImage },
  { href: "/compress-pdf-no-upload", title: "Compress & Clean", text: "Repack files and remove metadata.", icon: Minimize2 },
];

const features = [
  { icon: ShieldCheck, title: "No upload pipeline", text: "Files stay inside your browser memory and are never sent to our servers." },
  { icon: Zap, title: "Fast local processing", text: "Modern browsers and pdf-lib handle your documents directly on the device." },
  { icon: Sparkles, title: "Free, clean outputs", text: "No account, daily quota or promotional watermark on your finished PDF." },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden px-5 pb-14 pt-20 text-center sm:px-8 sm:pb-20 sm:pt-28">
        <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />
        <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-mint"><CheckCircle2 size={15} /> No uploads · No accounts · No watermarks</p>
        <h1 className="mx-auto max-w-5xl text-balance text-4xl font-black tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">Free PDF &amp; image tools that keep your <span className="bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">files private.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-lg">Merge, split, convert and clean documents instantly. Everything runs on your device, so confidential work never touches a server.</p>
        <a href="#toolkit" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-graphite transition hover:bg-mint">Start privately <ArrowDown size={16} /></a>
        <p className="mt-4 text-xs text-slate-600">Works in modern desktop and mobile browsers.</p>
      </section>

      <PdfToolkit />

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Popular tools</p><h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">Jump straight to the job.</h2></div>
          <a href="#toolkit" className="hidden items-center gap-1 text-sm font-semibold text-slate-400 transition hover:text-mint sm:flex">All tools <ArrowRight size={15} /></a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return <Link key={tool.href} href={tool.href} className="group rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:-translate-y-1 hover:border-mint/30 hover:bg-mint/[.04]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-mint/10 text-mint"><Icon size={19} /></span><h3 className="mt-5 font-bold text-white">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{tool.text}</p><span className="mt-4 flex items-center gap-1 text-xs font-semibold text-mint opacity-70 transition group-hover:opacity-100">Open tool <ArrowRight size={13} /></span></Link>;
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[.018]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return <article key={feature.title}><Icon className="text-mint" size={22} /><h2 className="mt-4 font-bold text-white">{feature.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p></article>;
          })}
        </div>
      </section>
    </main>
  );
}
