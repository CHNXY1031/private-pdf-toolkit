import { PDFDocument, PDFName } from "pdf-lib";

export type PdfBytes = Uint8Array;

async function readFile(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

function assertPdf(file: File): void {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) throw new Error(`${file.name} is not a PDF file.`);
}

function assertImage(file: File): void {
  const name = file.name.toLowerCase();
  const supported =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png");
  if (!supported) throw new Error(`${file.name} is not a supported JPG or PNG image.`);
}

export async function mergePdfFiles(files: File[]): Promise<PdfBytes> {
  if (files.length < 2) throw new Error("Choose at least two PDF files to merge.");

  const output = await PDFDocument.create();
  for (const file of files) {
    assertPdf(file);
    const source = await PDFDocument.load(await readFile(file));
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }

  return output.save({ useObjectStreams: true, addDefaultPage: false });
}

export function parsePageRange(input: string, pageCount: number): number[] {
  const normalized = input.trim();
  if (!normalized) return Array.from({ length: pageCount }, (_, index) => index);

  const result: number[] = [];
  const seen = new Set<number>();

  for (const rawPart of normalized.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;

    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error(`Invalid page range: “${part}”. Try 1-3, 5.`);

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    if (start < 1 || end < 1 || start > end) throw new Error(`Invalid page range: “${part}”.`);
    if (end > pageCount) throw new Error(`Page ${end} does not exist. This PDF has ${pageCount} pages.`);

    for (let page = start; page <= end; page += 1) {
      const index = page - 1;
      if (!seen.has(index)) {
        seen.add(index);
        result.push(index);
      }
    }
  }

  if (result.length === 0) throw new Error("Enter at least one page number.");
  return result;
}

export async function extractPdfPages(file: File, range: string): Promise<PdfBytes> {
  assertPdf(file);
  const source = await PDFDocument.load(await readFile(file));
  const pageIndices = parsePageRange(range, source.getPageCount());
  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, pageIndices);
  pages.forEach((page) => output.addPage(page));
  return output.save({ useObjectStreams: true, addDefaultPage: false });
}

const A4_PORTRAIT: [number, number] = [595.28, 841.89];
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];
const PAGE_MARGIN = 24;

export async function imagesToPdf(files: File[]): Promise<PdfBytes> {
  if (files.length === 0) throw new Error("Choose at least one JPG or PNG image.");

  const output = await PDFDocument.create();
  for (const file of files) {
    assertImage(file);
    const bytes = await readFile(file);
    const lowerName = file.name.toLowerCase();
    const isPng = file.type === "image/png" || lowerName.endsWith(".png");
    const image = isPng ? await output.embedPng(bytes) : await output.embedJpg(bytes);
    const pageSize = image.width > image.height ? A4_LANDSCAPE : A4_PORTRAIT;
    const [pageWidth, pageHeight] = pageSize;
    const maxWidth = pageWidth - PAGE_MARGIN * 2;
    const maxHeight = pageHeight - PAGE_MARGIN * 2;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
    const width = image.width * scale;
    const height = image.height * scale;
    const page = output.addPage(pageSize);

    page.drawImage(image, {
      x: (pageWidth - width) / 2,
      y: (pageHeight - height) / 2,
      width,
      height,
    });
  }

  return output.save({ useObjectStreams: true, addDefaultPage: false });
}

export async function compressAndCleanPdf(file: File): Promise<PdfBytes> {
  assertPdf(file);
  const pdf = await PDFDocument.load(await readFile(file), { updateMetadata: false });
  delete pdf.context.trailerInfo.Info;
  pdf.catalog.delete(PDFName.of("Metadata"));

  return pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
    objectsPerTick: 50,
  });
}

export function downloadPdf(bytes: PdfBytes, filename: string): void {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
