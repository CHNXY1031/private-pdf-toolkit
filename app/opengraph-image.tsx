import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Private PDF Toolkit - local browser PDF and image tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 84px", background: "#080b0e", color: "#eef7f4", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 25, color: "#66f5c2", fontWeight: 700 }}><span style={{ display: "flex", width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 14, background: "#66f5c2", color: "#080b0e" }}>🔒</span> Private PDF Toolkit</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: "-3px", fontWeight: 800, maxWidth: 960 }}>PDF tools that keep your files private.</div><div style={{ fontSize: 27, color: "#9aa8a3" }}>Merge · Split · Image to PDF · Compress &amp; Clean</div></div>
      <div style={{ display: "flex", gap: 28, fontSize: 20, color: "#66f5c2" }}><span>✓ No uploads</span><span>✓ No accounts</span><span>✓ No watermarks</span></div>
    </div>,
    size,
  );
}
