"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  FileImage,
  FileText,
  Files,
  GripVertical,
  HardDrive,
  LoaderCircle,
  Minimize2,
  Scissors,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  compressAndCleanPdf,
  downloadPdf,
  extractPdfPages,
  imagesToPdf,
  mergePdfFiles,
} from "@/lib/pdfEngine";

const tabs = [
  { id: "merge", label: "Merge PDF", icon: Files, multiple: true, accept: ".pdf,application/pdf" },
  { id: "split", label: "Split PDF", icon: Scissors, multiple: false, accept: ".pdf,application/pdf" },
  { id: "image", label: "Image to PDF", icon: FileImage, multiple: true, accept: ".jpg,.jpeg,.png,image/jpeg,image/png" },
  { id: "compress", label: "Compress PDF", icon: Minimize2, multiple: false, accept: ".pdf,application/pdf" },
] as const;

export type ToolMode = (typeof tabs)[number]["id"];
type Notice = { type: "error" | "success"; text: string } | null;

const descriptions: Record<ToolMode, { title: string; body: string; hint: string }> = {
  merge: { title: "Drop PDF files here", body: "Add two or more PDFs, then arrange them in the exact order you need.", hint: "PDF · Multiple files" },
  split: { title: "Drop one PDF here", body: "Extract a custom range such as 1-3, 5 into a new PDF.", hint: "PDF · One file" },
  image: { title: "Drop JPG or PNG images here", body: "Arrange your images and fit each one onto a clean A4 PDF page.", hint: "JPG / PNG · Multiple files" },
  compress: { title: "Drop one PDF here", body: "Remove common metadata and repack PDF objects locally.", hint: "PDF · One file" },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function outputName(mode: ToolMode): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `private-${mode === "image" ? "images" : mode}-${stamp}.pdf`;
}

export default function PdfToolkit({ defaultTab = "merge" }: { defaultTab?: ToolMode }) {
  const [mode, setMode] = useState<ToolMode>(defaultTab);
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-3, 5");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tab = tabs.find((item) => item.id === mode) ?? tabs[0];
  const copy = descriptions[mode];
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const switchMode = (next: ToolMode) => {
    setMode(next);
    setFiles([]);
    setNotice(null);
  };

  const isAccepted = (file: File) => {
    const name = file.name.toLowerCase();
    if (mode === "image") return file.type === "image/jpeg" || file.type === "image/png" || /\.(jpe?g|png)$/.test(name);
    return file.type === "application/pdf" || name.endsWith(".pdf");
  };

  const addFiles = (incoming: File[]) => {
    const accepted = incoming.filter(isAccepted);
    if (accepted.length !== incoming.length) {
      setNotice({ type: "error", text: mode === "image" ? "Only JPG and PNG images are supported." : "Only PDF files are supported." });
    } else {
      setNotice(null);
    }
    if (!accepted.length) return;
    setFiles((current) => (tab.multiple ? [...current, ...accepted] : [accepted[0]]));
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  };

  const processFiles = async () => {
    setNotice(null);
    if (!files.length) {
      setNotice({ type: "error", text: "Choose a file before processing." });
      return;
    }
    if (mode === "merge" && files.length < 2) {
      setNotice({ type: "error", text: "Add at least two PDFs to merge." });
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      let bytes: Uint8Array;
      if (mode === "merge") bytes = await mergePdfFiles(files);
      else if (mode === "split") bytes = await extractPdfPages(files[0], range);
      else if (mode === "image") bytes = await imagesToPdf(files);
      else bytes = await compressAndCleanPdf(files[0]);

      downloadPdf(bytes, outputName(mode));
      const sizeResult = mode === "compress" ? ` ${formatBytes(totalSize)} → ${formatBytes(bytes.length)}.` : ` ${formatBytes(bytes.length)} created.`;
      setNotice({ type: "success", text: `Done — your private download has started.${sizeResult}` });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Unable to process this file." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="toolkit" className="mx-auto max-w-5xl scroll-mt-6 px-5 pb-20 sm:px-8">
      <div className="mb-5 flex items-center justify-center gap-2 rounded-2xl border border-mint/20 bg-mint/[.07] px-4 py-3 text-center text-xs font-medium text-mint sm:text-sm">
        <ShieldCheck size={18} className="shrink-0" />
        <span>🔒 100% Client-Side Privacy: Your files never leave your device. Processed locally in your browser.</span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-panel/90 shadow-glow backdrop-blur">
        <div className="grid grid-cols-2 border-b border-white/10 bg-black/15 md:grid-cols-4" role="tablist" aria-label="PDF tools">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = item.id === mode;
            return (
              <button key={item.id} type="button" role="tab" aria-selected={active} onClick={() => switchMode(item.id)} className={cn("flex items-center justify-center gap-2 border-white/10 px-3 py-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint", active ? "bg-mint/10 text-mint" : "text-slate-400 hover:bg-white/[.03] hover:text-white")}>
                <Icon size={17} /> {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-5 sm:p-8">
          <input ref={inputRef} className="sr-only" type="file" accept={tab.accept} multiple={tab.multiple} onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
            onDrop={(event) => { event.preventDefault(); setIsDragging(false); addFiles(Array.from(event.dataTransfer.files)); }}
            className={cn("w-full rounded-2xl border border-dashed px-6 py-12 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint sm:py-14", isDragging ? "border-mint bg-mint/[.08]" : "border-mint/35 bg-black/20 hover:border-mint/70 hover:bg-mint/[.035]")}
          >
            <UploadCloud className="mx-auto mb-4 text-mint" size={38} />
            <span className="block text-lg font-bold text-white">{copy.title}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-400">{copy.body}</span>
            <span className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-slate-500">{copy.hint}</span>
          </button>

          {files.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[.025] px-4 py-3 text-xs text-slate-400"><span>{files.length} file{files.length === 1 ? "" : "s"} selected</span><span>{formatBytes(totalSize)}</span></div>
              <ul className="divide-y divide-white/10">
                {files.map((file, index) => (
                  <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 px-3 py-3 sm:px-4">
                    <GripVertical size={16} className="hidden shrink-0 text-slate-600 sm:block" aria-hidden="true" />
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint/10 text-mint">{mode === "image" ? <FileImage size={17} /> : <FileText size={17} />}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-200">{file.name}</span><span className="text-xs text-slate-500">{formatBytes(file.size)}</span></span>
                    {tab.multiple && <span className="flex items-center gap-1"><button type="button" aria-label={`Move ${file.name} up`} disabled={index === 0} onClick={() => moveFile(index, -1)} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-25"><ArrowUp size={15} /></button><button type="button" aria-label={`Move ${file.name} down`} disabled={index === files.length - 1} onClick={() => moveFile(index, 1)} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-25"><ArrowDown size={15} /></button></span>}
                    <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"><Trash2 size={16} /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mode === "split" && files.length > 0 && (
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Pages to extract</span>
              <input value={range} onChange={(event) => setRange(event.target.value)} placeholder="Example: 1-3, 5" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-mint/60 focus:ring-2 focus:ring-mint/10" />
              <span className="mt-2 block text-xs text-slate-500">Use commas for separate pages and hyphens for ranges.</span>
            </label>
          )}

          {notice && <div role="status" className={cn("mt-5 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm", notice.type === "error" ? "border-red-400/20 bg-red-400/[.07] text-red-200" : "border-mint/20 bg-mint/[.07] text-mint")}>{notice.type === "error" ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}<span>{notice.text}</span></div>}

          <button type="button" onClick={processFiles} disabled={isProcessing} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-mint px-6 py-4 font-bold text-graphite transition hover:bg-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:cursor-wait disabled:opacity-60">
            {isProcessing ? <><LoaderCircle size={18} className="animate-spin" /> Processing locally…</> : <>⚡ Process &amp; Download</>}
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-500"><HardDrive size={14} /> Uses your device memory. Nothing is uploaded.</p>
        </div>
      </div>

      <aside className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[.025] px-5 py-6 text-center" aria-label="Partner recommendation placeholder">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Partner recommendation</p>
        <p className="mt-2 font-semibold text-slate-300">💼 Adobe Acrobat &amp; Cloud Storage Partner</p>
        <p className="mt-1 text-xs text-slate-500">Reserved for trusted professional document solutions.</p>
      </aside>
    </section>
  );
}
