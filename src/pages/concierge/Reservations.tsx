import { useEffect, useMemo, useState } from "react";
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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthKeyOf(r: Reservation): string | null {
  const d = r.checkin || r.checkout;
  if (!d) return null;
  const dt = new Date(d + "T00:00:00");
  if (Number.isNaN(dt.getTime())) return null;
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  const dt = new Date(y, m - 1 + delta, 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
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
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey());

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

  // Group stays by check-in month.
  const { byMonth, monthKeys } = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of rows) {
      const k = monthKeyOf(r);
      if (!k) continue;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.checkin || "").localeCompare(b.checkin || ""));
    }
    return { byMonth: map, monthKeys: Array.from(map.keys()).sort() };
  }, [rows]);

  // Bounds for prev/next navigation: span the available months but always allow
  // the current month even if it has no stays.
  const { minKey, maxKey } = useMemo(() => {
    const keys = [...monthKeys, currentMonthKey()].sort();
    return { minKey: keys[0], maxKey: keys[keys.length - 1] };
  }, [monthKeys]);

  const monthRows = byMonth.get(selectedMonth) ?? [];
  const canPrev = !minKey || selectedMonth > minKey;
  const canNext = !maxKey || selectedMonth < maxKey;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={sectionTitle}>Reservations</h2>
        <button onClick={sync} disabled={syncing} style={{ ...btnPrimary, opacity: syncing ? 0.6 : 1 }}>
          {syncing ? "Syncing…" : "Refresh from Guesty"}
        </button>
      </div>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 0, marginBottom: 20 }}>
        Upcoming stays pulled automatically from Guesty (Villa Pietro, Villa Luisa & Sempre Avanti), grouped by month.
        Grab each guest's meal-planner link below — no login needed; the link is theirs to fill in, and you and the chef
        can edit the same plan anytime.
      </p>

      {note && (
        <div style={{ ...card, borderColor: COLORS.green, color: COLORS.green, marginBottom: 16, fontSize: 13 }}>{note}</div>
      )}
      {err && (
        <div style={{ ...card, borderColor: COLORS.red, color: COLORS.red, marginBottom: 16, fontSize: 13 }}>{err}</div>
      )}

      {/* Month switcher */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedMonth((k) => shiftMonth(k, -1))}
          disabled={!canPrev}
          style={{ ...btnGhost, padding: "8px 14px", fontSize: 11, opacity: canPrev ? 1 : 0.35, cursor: canPrev ? "pointer" : "default" }}
        >
          ‹ Prev
        </button>
        <div style={{ textAlign: "center", minWidth: 180 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.textDark, lineHeight: 1.1 }}>
            {monthLabel(selectedMonth)}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
            {monthRows.length} stay{monthRows.length === 1 ? "" : "s"}
          </div>
        </div>
        <button
          onClick={() => setSelectedMonth((k) => shiftMonth(k, 1))}
          disabled={!canNext}
          style={{ ...btnGhost, padding: "8px 14px", fontSize: 11, opacity: canNext ? 1 : 0.35, cursor: canNext ? "pointer" : "default" }}
        >
          Next ›
        </button>
        {selectedMonth !== currentMonthKey() && (
          <button
            onClick={() => setSelectedMonth(currentMonthKey())}
            style={{ ...btnGhost, padding: "8px 14px", fontSize: 10, color: COLORS.gold, borderColor: COLORS.gold }}
          >
            This month
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Loading…</div>
      ) : monthRows.length === 0 ? (
        <div style={{ ...card, color: COLORS.textMuted, fontSize: 14, textAlign: "center" }}>
          No stays this month.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {monthRows.map((r) => {
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
