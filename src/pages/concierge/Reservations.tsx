import { useEffect, useState } from "react";
import { conciergeDb } from "@/lib/conciergeApi";
import { COLORS, card, btnPrimary, btnGhost, sectionTitle } from "./styles";

interface Reservation {
  id: string;
  guesty_id: string;
  guest: string | null;
  checkin: string | null;
  checkout: string | null;
  nights: number | null;
  listing_name: string | null;
  status: string | null;
  meal_token: string;
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CopyLink({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          window.prompt("Copy this link:", url);
        }
      }}
      style={{
        ...btnGhost,
        padding: "7px 12px",
        fontSize: 10,
        color: copied ? COLORS.green : COLORS.textMid,
        borderColor: copied ? COLORS.green : COLORS.border,
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function Reservations() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setRows(await conciergeDb.reservationsList());
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sync = async () => {
    setSyncing(true);
    setErr(null);
    setNote(null);
    try {
      const res = await conciergeDb.reservationsSync();
      setNote(`Synced ${res?.synced ?? 0} reservations from Guesty.`);
      await load();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={sectionTitle}>Reservations</h2>
        <button onClick={sync} disabled={syncing} style={{ ...btnPrimary, opacity: syncing ? 0.6 : 1 }}>
          {syncing ? "Syncing…" : "Refresh from Guesty"}
        </button>
      </div>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 0, marginBottom: 20 }}>
        Upcoming stays pulled automatically from Guesty (Villa Pietro, Villa Luisa & Sempre Avanti). Grab each guest's
        meal-planner link below — no login needed; the link is theirs to fill in, and you and the chef can edit the same
        plan anytime.
      </p>

      {note && (
        <div style={{ ...card, borderColor: COLORS.green, color: COLORS.green, marginBottom: 16, fontSize: 13 }}>{note}</div>
      )}
      {err && (
        <div style={{ ...card, borderColor: COLORS.red, color: COLORS.red, marginBottom: 16, fontSize: 13 }}>{err}</div>
      )}

      {loading ? (
        <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ ...card, color: COLORS.textMuted, fontSize: 14 }}>
          No upcoming reservations yet. Click “Refresh from Guesty”.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r) => {
            const mealUrl = `${origin}/meals/${r.meal_token}`;
            return (
              <div key={r.id} style={{ ...card, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, justifyContent: "space-between" }}>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.textDark, lineHeight: 1.1 }}>
                    {r.guest || "Guest"}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>
                    {r.listing_name || "—"} · {fmtDate(r.checkin)} → {fmtDate(r.checkout)}
                    {r.nights ? ` · ${r.nights} night${r.nights === 1 ? "" : "s"}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <CopyLink url={mealUrl} label="Copy meal link" />
                  <a href={mealUrl} target="_blank" rel="noreferrer" style={{ ...btnGhost, padding: "7px 12px", fontSize: 10, textDecoration: "none" }}>
                    Open meal plan
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
