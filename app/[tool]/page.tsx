import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Cpu, Download, LockKeyhole, UploadCloud } from "lucide-react";
import { notFound } from "next/navigation";
import PdfToolkit from "@/components/PdfToolkit";
import { getToolPage, SITE_URL, toolPages } from "@/lib/toolPages";

type PageProps = { params: { tool: string } };
export const dynamicParams = false;

export function generateStaticParams() {
  return toolPages.map((page) => ({ tool: page.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getToolPage(params.tool);
  if (!page) return {};
  const url = `${SITE_URL}/${page.slug}`;
  return {
    title: { absolute: page.metaTitle },
    description: page.description,
    keywords: [page.keyword, "private PDF tools", "client-side PDF", "no file upload"],
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: page.metaTitle, description: page.description },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.description },
  };
}

export default function ToolPageRoute({ params }: PageProps) {
  const page = getToolPage(params.tool);
  if (!page) notFound();

  const faq = [
    { question: `Is this ${page.keyword} tool really private?`, answer: "Yes. The selected files are processed in your browser with client-side JavaScript and are not uploaded to our servers." },
    { question: "Do I need to create an account?", answer: "No. The tool is free to use without signup, email, software installation or a watermark." },
    { question: "Where is my finished PDF saved?", answer: "Your browser downloads the finished PDF directly to the download location configured on your device." },
    { question: "Are my files stored after processing?", answer: "No. Files exist only in your current browser session and device memory. Closing or refreshing the page clears the selected file state." },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", name: page.h1, url: `${SITE_URL}/${page.slug}`, description: page.description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript and a modern web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: ["Client-side processing", "No file uploads", "No account required", "No watermark"] },
      { "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="relative isolate overflow-hidden px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-24">
        <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-mint"><ArrowLeft size={14} /> All PDF tools</Link>
        <p className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-mint/20 bg-mint/[.06] px-3 py-1.5 text-xs font-semibold text-mint"><LockKeyhole size={14} /> Private by design</p>
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-black tracking-[-.035em] text-white sm:text-6xl">{page.h1}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-400">{page.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500"><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-mint" /> No upload</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-mint" /> No signup</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-mint" /> Free download</span></div>
      </section>

      <PdfToolkit defaultTab={page.mode} />

      <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[.025] p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Simple private workflow</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">How to {page.keyword}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">Use this tool to {page.benefit}. The entire process runs locally, reducing the privacy risk created by ordinary upload-and-convert services.</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: UploadCloud, title: "1. Choose files", text: "Drop supported files into the secure area or browse your device." },
              { icon: Cpu, title: "2. Process locally", text: "Arrange files or enter a page range, then start the browser-side task." },
              { icon: Download, title: "3. Download", text: "Save the finished PDF directly. There is no server-side copy to delete." },
            ].map((step) => {
              const Icon = step.icon;
              return <li key={step.title} className="rounded-2xl border border-white/10 bg-black/15 p-5"><Icon className="text-mint" size={20} /><h3 className="mt-4 text-sm font-bold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{step.text}</p></li>;
            })}
          </ol>
        </div>

        <div className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Questions answered</p>
          <h2 className="mt-3 text-2xl font-bold text-white">{page.h1} FAQ</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {faq.map((item) => <details key={item.question} className="group py-5"><summary className="cursor-pointer list-none pr-5 text-sm font-semibold text-slate-200 marker:hidden">{item.question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{item.answer}</p></details>)}
          </div>
        </div>
      </section>
    </main>
  );
}
