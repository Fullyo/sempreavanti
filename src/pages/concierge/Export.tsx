import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Booking, formatMXN } from "@/lib/calculations";
import { COLORS, btnGhost, btnPrimary, sectionTitle } from "./styles";

function monthLabel(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function buildRows(bookings: Booking[]) {
  const rows: string[][] = [];
  rows.push(["Month", "Guest", "Check-in", "Service", "Qty", "Guest Total (MXN)", "Our Cost (MXN)", "Profit (MXN)"]);
  bookings.forEach((b) => {
    const m = monthLabel(b.checkin);
    b.items.forEach((i) =>
      rows.push([m, b.guest, b.checkin, i.name, String(i.qty), String(Math.round(i.guest_total ?? 0)), i.cost === null ? "" : String(Math.round(i.cost)), i.profit === null ? "TBD" : String(Math.round(i.profit))]),
    );
  });
  return rows;
}

export default function ExportTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    supabase
      .from("bookings")
      .select("*")
      .order("checkin")
      .then(({ data }) => setBookings(((data ?? []) as unknown as Booking[]).map((b) => ({ ...b, items: Array.isArray(b.items) ? b.items : [] }))));
  }, []);

  const copyTSV = async () => {
    const rows = buildRows(bookings);
    const tsv = rows.map((r) => r.join("\t")).join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
      toast.success("Copied! Paste into Google Sheets.");
    } catch {
      toast.error("Copy failed");
    }
  };

  const downloadCSV = () => {
    const rows = buildRows(bookings);
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `sempre-avanti-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const rows = buildRows(bookings);

  return (
    <div>
      <h1 style={sectionTitle}>Export</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 22 }}>Download data for Google Sheets or copy directly.</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <button onClick={copyTSV} style={btnPrimary}>Copy All Bookings for Sheets</button>
        <button onClick={downloadCSV} style={btnGhost}>Download All Bookings as CSV</button>
        <button onClick={() => setPreview((p) => !p)} style={btnGhost}>{preview ? "Hide" : "Preview"}</button>
      </div>

      {preview && (
        <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, padding: 14, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {rows[0].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: 6, borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted, textTransform: "uppercase", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => <td key={j} style={{ padding: 6, borderBottom: `1px solid ${COLORS.border}` }}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
