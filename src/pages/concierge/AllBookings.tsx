import { useEffect, useMemo, useState } from "react";
import { conciergeDb } from "@/lib/conciergeApi";
import { toast } from "sonner";
import {
  Booking,
  bookingUpsellCost,
  formatMXN,
} from "@/lib/calculations";
import { COLORS, btnGhost, btnPrimary, btnDanger, input, sectionTitle } from "./styles";
import NewBooking from "./NewBooking";
import { downloadInvoice } from "./GuestInvoicePDF";
import { downloadOwnerStatementCSV, openOwnerStatement } from "./ownerStatement";
import { openApril2026Historical } from "./april2026Historical";
import { openMay2026Historical } from "./may2026Historical";
import {
  ALL_HISTORICAL,
  MAY_2026_BOOKINGS,
  HistoricalBooking,
  KpiBreakdown,
  computeHistoricalKpis,
  formatUSD,
  historicalMonthKey,
} from "./historicalData";

function monthKey(d: string) {
  const dt = new Date(d);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Villa pricing is in pesos; guests are charged in USD converted at this rate.
// Accommodation fares are paid in USD directly on Guesty and are never converted.
const FX = 16;

type MoneyPair = { mxn: number; usd: number };
type MonthKpis = {
  count: number;
  accommodation: { fareUSD: number; ownerUSD: number; luxUSD: number };
  upsells: { billed: MoneyPair; profit: MoneyPair; owner: MoneyPair; lux: MoneyPair };
  combinedUSD: { ownerTotal: number; luxTotal: number };
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function monthNameFromKey(key: string) {
  const [, m] = key.split("-").map(Number);
  return MONTH_NAMES[m - 1];
}

type ViewTab = "upcoming" | "all";
type MonthGroup = { live: Booking[]; hist: HistoricalBooking[] };

function getCurrentMonthKey(date = new Date()) {
  // Local time keeps the concierge view aligned with the calendar users see;
  // on the 1st of each month this automatically rolls to the new month.
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewTab>("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [detailKey, setDetailKey] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  // Petty cash float per booking ref ('live-<id>' or historical string id).
  const [petty, setPetty] = useState<Record<string, number>>({});

  const load = async () => {
    setLoading(true);
    let data: any[];
    try {
      data = await conciergeDb.bookingsList();
    } catch (e) {
      setLoading(false);
      return toast.error((e as Error).message);
    }
    setLoading(false);
    setBookings(((data ?? []) as unknown as Booking[]).map((b) => ({
      ...b,
      items: Array.isArray(b.items) ? b.items : [],
    })));
  };

  const loadPetty = async () => {
    let data: any[];
    try {
      data = await conciergeDb.pettyCashList();
    } catch {
      return;
    }
    const map: Record<string, number> = {};
    (data ?? []).forEach((r: any) => { map[r.booking_ref] = Number(r.float_amount) || 0; });
    setPetty(map);
  };

  const saveFloat = async (ref: string, amount: number, currency: string) => {
    setPetty((p) => ({ ...p, [ref]: amount }));
    try {
      await conciergeDb.pettyCashUpsert({ booking_ref: ref, float_amount: amount, currency, updated_at: new Date().toISOString() });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => {
    load();
    loadPetty();
  }, []);

  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const sixtyDaysOut = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const viewFiltered = useMemo(() => {
    if (view === "upcoming") {
      return bookings.filter((b) => b.checkin >= todayISO && b.checkin <= sixtyDaysOut);
    }
    if (monthFilter !== "all") {
      return bookings.filter((b) => monthKey(b.checkin) === monthFilter);
    }
    return bookings;
  }, [bookings, view, monthFilter, todayISO, sixtyDaysOut]);

  // Historical (pre-tool, USD) rows visible in the current view scope.
  const historicalInView = useMemo<HistoricalBooking[]>(() => {
    if (view === "upcoming") {
      return ALL_HISTORICAL.filter((h) => h.checkin >= todayISO && h.checkin <= sixtyDaysOut);
    }
    if (monthFilter !== "all") {
      return ALL_HISTORICAL.filter((h) => historicalMonthKey(h) === monthFilter);
    }
    return ALL_HISTORICAL;
  }, [view, monthFilter, todayISO, sixtyDaysOut]);

  // Group live and historical by month, latest month first.
  const monthSections = useMemo(() => {
    const groups: Record<string, MonthGroup> = {};
    viewFiltered.forEach((b) => {
      const k = monthKey(b.checkin);
      (groups[k] ||= { live: [], hist: [] }).live.push(b);
    });
    historicalInView.forEach((h) => {
      const k = historicalMonthKey(h);
      (groups[k] ||= { live: [], hist: [] }).hist.push(h);
    });
    Object.values(groups).forEach((g) => {
      g.live.sort((a, b) => a.checkin.localeCompare(b.checkin));
      g.hist.sort((a, b) => a.checkin.localeCompare(b.checkin));
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)); // newest first
  }, [viewFiltered, historicalInView]);

  const currentMonthKey = getCurrentMonthKey();
  const currentMonthLabel = monthLabel(currentMonthKey);
  const shouldForceMayHistorical = view === "all" && (monthFilter === "all" || monthFilter === "2026-05");

  // Reorder: current month first if present, otherwise add one empty current folder.
  // May 2026 is a hard historical month: if the card renders, it must contain
  // the May imported rows and can never fall through to an empty placeholder.
  const displayMonthSections = useMemo(() => {
    const byKey = new Map<string, MonthGroup>(monthSections);
    if (shouldForceMayHistorical) {
      const mayGroup = byKey.get("2026-05") ?? { live: [], hist: [] };
      byKey.set("2026-05", { ...mayGroup, hist: [...MAY_2026_BOOKINGS] });
    }

    const ordered = Array.from(byKey.entries()).sort(([a], [b]) => b.localeCompare(a));
    const current = ordered.find(([k]) => k === currentMonthKey);
    const withoutCurrent = ordered.filter(([k]) => k !== currentMonthKey);
    if (!current) return [[currentMonthKey, { live: [], hist: [] }] as [string, MonthGroup], ...withoutCurrent];
    return [current, ...withoutCurrent];
  }, [monthSections, currentMonthKey, shouldForceMayHistorical]);

  // Default selection = most recent month that actually has bookings.
  const defaultOpenKey = useMemo(() => {
    const firstWithData = displayMonthSections.find(
      ([, g]) => g.live.length > 0 || g.hist.length > 0,
    );
    return firstWithData ? firstWithData[0] : currentMonthKey;
  }, [displayMonthSections, currentMonthKey]);


  // Per-month KPI breakdown.
  // Currency model:
  //  - Accommodation fare is always USD (paid on Guesty), never converted.
  //  - Upsells are priced in pesos (MXN) and charged to the guest in USD at FX (16).
  function computeMonthKpis(live: Booking[], hist: HistoricalBooking[]): MonthKpis {
    // --- Accommodation (USD only) ---
    const histAccomUSD = hist.reduce((s, h) => s + h.accommodationFare, 0);
    const liveAccomUSD = live.reduce((s, b) => {
      const fare = Number(b.accommodation_fare ?? 0);
      const rate = Number(b.exchange_rate) || FX;
      return s + (b.accommodation_currency === "MXN" ? fare / rate : fare);
    }, 0);
    const fareUSD = histAccomUSD + liveAccomUSD;

    // --- Upsells (native pesos; USD is the guest-billed conversion @ FX) ---
    // Historical June upsells are stored in USD → peso = USD * FX.
    const histBilledUSD = hist.reduce((s, h) => s + h.upsellsBilled, 0);
    const histProfitUSD = hist.reduce((s, h) => s + h.upsellsProfit, 0);
    // Live upsells are stored in MXN. Line-item guest totals only (tips / card fee excluded).
    const liveBilledMXN = live.reduce(
      (s, b) => s + (b.items ?? []).reduce((sum, i) => sum + (Number(i.guest_total) || 0), 0),
      0,
    );
    const liveProfitMXN = live.reduce((s, b) => s + Number(b.total_profit), 0);

    const billedMXN = histBilledUSD * FX + liveBilledMXN;
    const profitMXN = histProfitUSD * FX + liveProfitMXN;
    const pair = (mxn: number): MoneyPair => ({ mxn, usd: mxn / FX });

    return {
      count: hist.length + live.length,
      accommodation: { fareUSD, ownerUSD: fareUSD * 0.85, luxUSD: fareUSD * 0.15 },
      upsells: {
        billed: pair(billedMXN),
        profit: pair(profitMXN),
        owner: pair(profitMXN * 0.85),
        lux: pair(profitMXN * 0.15),
      },
      combinedUSD: {
        ownerTotal: fareUSD * 0.85 + (profitMXN / FX) * 0.85,
        luxTotal: fareUSD * 0.15 + (profitMXN / FX) * 0.15,
      },
    };
  }





  const startEdit = (b: Booking) => {
    setEditId(b.id);
  };

  const cancelEdit = () => {
    setEditId(null);
  };



  const remove = async (id: number) => {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await conciergeDb.bookingsDelete(id);
    } catch (e) {
      return toast.error((e as Error).message);
    }
    toast.success("Deleted");
    load();
  };

  const copyPayLink = async (b: Booking) => {
    if (!b.pay_token) return toast.error("No payment link — re-save this booking");
    const link = `${window.location.origin}/pay/${b.pay_token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Payment link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const downloadAllCSV = () => {
    const rows: string[][] = [];
    rows.push(["Month","Guest","Check-in","Check-out","Service","Qty","Unit Price (MXN)","Guest Total (MXN)","Our Cost (MXN)","Profit (MXN)"]);
    bookings.forEach((b) => {
      const m = monthLabel(monthKey(b.checkin));
      b.items.forEach((i) =>
        rows.push([m, b.guest, b.checkin, b.checkout ?? "", i.name, String(i.qty), String(Math.round(i.price)), String(Math.round(i.guest_total ?? 0)), i.cost === null ? "" : String(Math.round(i.cost)), i.profit === null ? "TBD" : String(Math.round(i.profit))]),
      );
      if (Number(b.tip) > 0) rows.push([m, b.guest, b.checkin, b.checkout ?? "", b.tip_mode === "percent" ? `Staff Tip (${b.tip_value}%)` : "Staff Tip", "", "", String(Math.round(b.tip)), "", "pass-through"]);
      if (Number(b.cc_fee) > 0) rows.push([m, b.guest, b.checkin, b.checkout ?? "", "5% Credit Card Fee", "", "", String(Math.round(b.cc_fee)), "", ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sempre-avanti-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sempre-avanti-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const restore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed: Booking[] = JSON.parse(reader.result as string);
        const existingIds = new Set(bookings.map((b) => b.id));
        const toInsert = parsed.filter((b) => !existingIds.has(b.id));
        if (!toInsert.length) {
          toast("No new bookings to restore");
          return;
        }
        await conciergeDb.bookingsUpsert(toInsert.map(({ id, ...rest }) => ({ ...rest })) as any);
        toast.success(`Restored ${toInsert.length} bookings`);
        load();
      } catch (err: any) {
        toast.error(err.message ?? "Restore failed");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <h1 style={sectionTitle}>{detailKey ? monthLabel(detailKey) : "Bookings"}</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {detailKey && (
            <button onClick={() => setDetailKey(null)} style={btnGhost}>← Back to all months</button>
          )}
          <button onClick={load} style={btnGhost}>↻ Refresh</button>
          <button onClick={downloadAllCSV} style={btnGhost}>Download All as CSV</button>
        </div>
      </div>

      {/* View toggle: All vs Upcoming — hidden while viewing a single month */}
      {!detailKey && (
      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: `1px solid ${COLORS.border}` }}>
        {([
          { id: "all", label: "All Bookings" },
          { id: "upcoming", label: "Upcoming (60 days)" },
        ] as { id: ViewTab; label: string }[]).map((t) => {
          const active = view === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setView(t.id); if (t.id === "upcoming") setMonthFilter("all"); }}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 18px",
                fontFamily: "inherit",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
                color: active ? COLORS.gold : COLORS.textMuted,
                borderBottom: active ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                marginBottom: -1,
                fontWeight: active ? 500 : 400,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      )}

      {!detailKey && (
      <div style={{ fontStyle: "italic", color: COLORS.textMuted, fontSize: 12, marginBottom: 18 }}>
        Current month is {currentMonthLabel}. Historical reports stay attached to their booking month.
      </div>
      )}

      {loading && <div style={{ color: COLORS.textMuted }}>Loading…</div>}
      {!loading && displayMonthSections.length === 0 && (
        <div style={{ background: "#fff", border: `1px dashed ${COLORS.border}`, borderRadius: 4, padding: "32px 22px", textAlign: "center", color: COLORS.textMuted }}>
          {view === "upcoming" ? "No upcoming check-ins in the next 60 days." : "No bookings match this filter."}
        </div>
      )}

      {(detailKey ? displayMonthSections.filter(([k]) => k === detailKey) : displayMonthSections).map(([key, group]) => {
        const kpis = computeMonthKpis(group.live, group.hist);
        const label = monthLabel(key);
        const [yStr, mStr] = key.split("-");
        const monthName = monthNameFromKey(key);
        const hasHist = group.hist.length > 0;
        const hasLive = group.live.length > 0;
        const histReportBtn = key === "2026-05"
          ? <button onClick={openMay2026Historical} style={btnGhost}>Open Full May 2026 Report</button>
          : key === "2026-04"
          ? <button onClick={openApril2026Historical} style={btnGhost}>Open Full April 2026 Report</button>
          : null;

        const isCurrent = key === currentMonthKey;
        const isOpen = detailKey === key;
        const isEmpty = !hasHist && !hasLive;
        return (
          <div key={key} style={{ marginBottom: isOpen ? 40 : 10 }}>
            <div
              onClick={() => { if (!isOpen) setDetailKey(key); }}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: isOpen ? 14 : 0,
                padding: "16px 18px",
                background: isCurrent ? "#FAF7F2" : "#fff",
                border: `1px solid ${isCurrent ? COLORS.gold : COLORS.border}`,
                borderRadius: 4,
                cursor: "pointer", gap: 12, flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div>
                  {isCurrent && (
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.gold, marginBottom: 4, fontWeight: 500 }}>
                      Current month
                    </div>
                  )}
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, lineHeight: 1 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                    {isEmpty ? "No bookings yet" : `${kpis.count} booking${kpis.count === 1 ? "" : "s"}`}
                    {hasHist && ` · ${group.hist.length} historical (USD)`}
                    {hasLive && ` · ${group.live.length} live (MXN)`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                {isOpen && histReportBtn}
                {isOpen && hasLive && (
                  <button onClick={() => openOwnerStatement(monthName, Number(yStr), group.live)} style={btnPrimary}>
                    ⬇ Owner Statement
                  </button>
                )}
                <button onClick={() => setDetailKey(isOpen ? null : key)} style={btnGhost}>
                  {isOpen ? "Close" : "Open"}
                </button>
              </div>
            </div>


            {isOpen && (<>
            {/* Per-month KPI summary */}
            <div style={{ marginBottom: 18 }}>
              <KpiBlock
                title="Accommodation Fare (paid in USD)"
                tone="accom"
                cells={[
                  { label: "Total Fare", value: formatUSD(kpis.accommodation.fareUSD) },
                  { label: "Owner's Share 85%", value: formatUSD(kpis.accommodation.ownerUSD), color: COLORS.green },
                  { label: "LUX's Cut 15%", value: formatUSD(kpis.accommodation.luxUSD), color: COLORS.amber },
                ]}
                note={kpis.accommodation.fareUSD === 0 ? "No accommodation fare recorded for this month." : undefined}
              />
              <KpiBlock
                title="Upsells (priced in pesos · charged to guests in USD @16)"
                tone="upsell"
                cells={[
                  { label: "Guest Billed", value: formatMXN(kpis.upsells.billed.mxn), sub: `≈ ${formatUSD(kpis.upsells.billed.usd)} USD` },
                  { label: "Profit Pool", value: formatMXN(kpis.upsells.profit.mxn), sub: `≈ ${formatUSD(kpis.upsells.profit.usd)} USD` },
                  { label: "Owner's Share 85%", value: formatMXN(kpis.upsells.owner.mxn), sub: `≈ ${formatUSD(kpis.upsells.owner.usd)} USD`, color: COLORS.green },
                  { label: "LUX's Cut 15%", value: formatMXN(kpis.upsells.lux.mxn), sub: `≈ ${formatUSD(kpis.upsells.lux.usd)} USD`, color: COLORS.amber },
                ]}
              />
              <KpiBlock
                title="Combined Totals in USD (Accommodation + Upsells @16)"
                tone="combined"
                cells={[
                  { label: "Bookings", value: String(kpis.count) },
                  { label: "Owner Total Earnings", value: formatUSD(kpis.combinedUSD.ownerTotal), color: COLORS.green },
                  { label: "LUX Total Cut", value: formatUSD(kpis.combinedUSD.luxTotal), color: COLORS.amber },
                ]}
              />
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 8 }}>
                Accommodation is billed in USD on Guesty. Upsells are priced in pesos and charged to guests in USD at 16.
              </div>
            </div>

            {/* Historical (USD) rows — read-only */}
            {group.hist.map((h) => (
              <div key={h.id} style={{ marginBottom: 12 }}>
                <PettyCashBox
                  guest={h.guest}
                  currency="USD"
                  float={petty[h.id] ?? null}
                  spent={Math.max(0, h.upsellsBilled - h.upsellsProfit)}
                  onSave={(amt) => saveFloat(h.id, amt, "USD")}
                />
                {h.items && h.items.length > 0 ? (
                  <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300 }}>
                          {h.guest}
                          <span style={{ fontSize: 9, background: "#7A5C1E1a", color: "#7A5C1E", padding: "2px 8px", borderRadius: 10, marginLeft: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Historical · USD</span>
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                          Check-in: {h.checkin}{h.checkout ? ` · Check-out: ${h.checkout}` : ""} · {h.villa}
                        </div>
                        {h.notes && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontStyle: "italic" }}>{h.notes}</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 500 }}>{formatUSD(h.upsellsBilled)}</div>
                        <div style={{ fontSize: 12, color: COLORS.green, marginTop: 2 }}>Profit: {formatUSD(h.upsellsProfit)}</div>
                        <div
                          style={{
                            display: "inline-block", marginTop: 6, fontSize: 10,
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            padding: "3px 8px", borderRadius: 2,
                            background: "#E7F0E9", color: COLORS.green,
                          }}
                        >
                          Paid · {formatUSD(h.upsellsBilled)}
                        </div>
                      </div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 13 }}>
                      <thead>
                        <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                          <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Service</th>
                          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Total</th>
                          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Cost</th>
                          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {h.items.map((i, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                              {i.name} <span style={{ color: COLORS.textMuted }}>×{i.qty}</span>
                            </td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatUSD(i.guest_total)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMid }}>{i.cost === null ? "—" : formatUSD(i.cost)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: i.passThrough ? COLORS.blue : (i.profit === null ? COLORS.amber : COLORS.green), fontStyle: i.passThrough || i.profit === null ? "italic" : "normal", fontSize: i.passThrough ? 11 : 13 }}>
                              {i.passThrough ? "pass-through" : i.profit === null ? "TBD" : formatUSD(i.profit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
                      <HistCell label="Accommodation Fare" value={formatUSD(h.accommodationFare)} sub={h.accommodationFare > 0 ? `Owner 85%: ${formatUSD(h.accommodationFare * 0.85)} · LUX 15%: ${formatUSD(h.accommodationFare * 0.15)}` : "Not captured for this booking"} />
                      <HistCell label="Upsells Billed" value={formatUSD(h.upsellsBilled)} sub={`Profit pool: ${formatUSD(h.upsellsProfit)}`} />
                      <HistCell label="LUX Cut (Total)" value={formatUSD(h.accommodationFare * 0.15 + h.upsellsProfit * 0.15)} sub={`Owner: ${formatUSD(h.accommodationFare * 0.85 + h.upsellsProfit * 0.85)}`} color={COLORS.amber} />
                    </div>
                  </div>
                ) : (
                <div style={{ background: "#FDF9F1", border: `1px solid #E5D8B5`, borderRadius: 4, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 400 }}>
                        {h.guest}
                        <span style={{ fontSize: 9, background: "#7A5C1E1a", color: "#7A5C1E", padding: "2px 8px", borderRadius: 10, marginLeft: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Historical · USD</span>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>
                        {h.checkin} → {h.checkout} · {h.villa}
                      </div>
                      {h.notes && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontStyle: "italic" }}>{h.notes}</div>}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
                    <HistCell label="Accommodation Fare" value={formatUSD(h.accommodationFare)} sub={h.accommodationFare > 0 ? `Owner 85%: ${formatUSD(h.accommodationFare * 0.85)} · LUX 15%: ${formatUSD(h.accommodationFare * 0.15)}` : "Not captured for this booking"} />
                    <HistCell label="Upsells Billed" value={formatUSD(h.upsellsBilled)} sub={`Profit pool: ${formatUSD(h.upsellsProfit)}`} />
                    <HistCell label="LUX Cut (Total)" value={formatUSD(h.accommodationFare * 0.15 + h.upsellsProfit * 0.15)} sub={`Owner: ${formatUSD(h.accommodationFare * 0.85 + h.upsellsProfit * 0.85)}`} color={COLORS.amber} />
                  </div>
                </div>
                )}
              </div>
            ))}

            {/* Live (MXN) rows */}
            {group.live.map((b) => {
              const isEditing = editId === b.id;
              const liveRef = `live-${b.id}`;
              const liveSpent = bookingUpsellCost(b.items);
              if (isEditing) {
                return (
                  <div key={b.id} style={{ marginBottom: 14, border: `1px solid ${COLORS.gold}`, borderRadius: 4, padding: "18px 22px", background: "#fff" }}>
                    <NewBooking
                      initialBooking={b}
                      onSaved={() => { load(); }}
                      onCancel={() => { cancelEdit(); load(); }}
                    />
                  </div>
                );
              }
              const v = b;
              return (
                <div key={b.id} style={{ marginBottom: 14 }}>
                <PettyCashBox
                  guest={b.guest}
                  currency="MXN"
                  float={petty[liveRef] ?? null}
                  spent={liveSpent}
                  onSave={(amt) => saveFloat(liveRef, amt, "MXN")}
                />
                <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "18px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300 }}>
                        {v.guest}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, display: "flex", gap: 10, alignItems: "center" }}>
                        <span>
                          Check-in: {v.checkin}{v.checkout ? ` · Check-out: ${v.checkout}` : ""}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>{formatMXN(v.total_guest)}</div>
                      <div style={{ fontSize: 12, color: COLORS.green, marginTop: 2 }}>Profit: {formatMXN(v.total_profit)}</div>
                      <div
                        style={{
                          display: "inline-block",
                          marginTop: 6,
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          padding: "3px 8px",
                          borderRadius: 2,
                          background: b.payment_status === "paid" ? "#E7F0E9" : "#FBEFE2",
                          color: b.payment_status === "paid" ? COLORS.green : COLORS.amber,
                        }}
                      >
                        {b.payment_status === "paid"
                          ? `Paid${b.amount_paid ? " · " + formatMXN(b.amount_paid) : ""}`
                          : "Unpaid"}
                      </div>
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Service</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Total</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Cost</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.items.map((i, idx) => {
                        const gt = i.guest_total;
                        const c = i.cost;
                        const p = i.profit;
                        return (
                          <tr key={idx}>
                            <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                              {i.name} <span style={{ color: COLORS.textMuted }}>×{i.qty}</span>
                            </td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatMXN(gt)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMid }}>{c === null ? "—" : formatMXN(c)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: p === null ? COLORS.amber : COLORS.green, fontStyle: p === null ? "italic" : "normal" }}>{p === null ? "TBD" : formatMXN(p)}</td>
                          </tr>
                        );
                      })}
                      {Number(v.tip) > 0 && (
                        <tr>
                          <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                            {v.tip_mode === "percent" ? `Staff Tip (${v.tip_value}%)` : "Staff Tip"}
                          </td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatMXN(v.tip)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.blue, fontStyle: "italic", fontSize: 11 }}>pass-through</td>
                        </tr>
                      )}
                      {Number(v.cc_fee) > 0 && (
                        <tr>
                          <td style={{ padding: "8px 6px" }}>5% Credit Card Fee</td>
                          <td style={{ textAlign: "right", padding: "8px 6px" }}>{formatMXN(v.cc_fee)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", color: COLORS.textMuted }}>—</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                    <button onClick={() => downloadInvoice(b)} style={btnPrimary}>Download Invoice</button>
                    <button onClick={() => copyPayLink(b)} style={btnGhost}>Copy Payment Link</button>
                    <button onClick={() => startEdit(b)} style={btnGhost}>Edit</button>
                    <button onClick={() => remove(b.id)} style={btnDanger}>Delete</button>
                  </div>
                </div>
                </div>
              );
            })}


            <PettyCashSummary group={group} petty={petty} />
            </>)}
          </div>
        );
      })}


      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted, marginBottom: 10 }}>
          Advanced — Data Safety
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={downloadBackup} style={btnGhost}>Download Data Backup</button>
          <label style={{ ...btnGhost, display: "inline-block" }}>
            Restore from Backup
            <input type="file" accept="application/json" style={{ display: "none" }} onChange={restore} />
          </label>
        </div>
      </div>
    </div>
  );
}

type KpiCell = { label: string; value: string; color?: string; sub?: string };

function KpiBlock({ title, tone, cells, note }: { title: string; tone: "accom" | "upsell" | "combined"; cells: KpiCell[]; note?: string }) {
  const toneStyles: Record<string, { bg: string; border: string; accent: string }> = {
    accom:    { bg: "#F4EFE3", border: "#E5D8B5", accent: "#7A5C1E" },
    upsell:   { bg: "#FAF7F2", border: "#DDD5C4", accent: COLORS.textMid },
    combined: { bg: "#1C1914", border: "#1C1914", accent: "#B8924A" },
  };
  const t = toneStyles[tone];
  const dark = tone === "combined";
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 4, padding: "14px 16px", marginBottom: 10, color: dark ? "#F7F4EE" : undefined }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: dark ? "#B8924A" : t.accent, marginBottom: 10, fontWeight: 500 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: 12 }}>
        {cells.map((c) => (
          <div key={c.label}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "rgba(247,244,238,0.5)" : COLORS.textMuted }}>{c.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginTop: 4, color: c.color ?? (dark ? "#F7F4EE" : COLORS.textMid) }}>{c.value}</div>
            {c.sub && <div style={{ fontSize: 10, color: dark ? "rgba(247,244,238,0.55)" : COLORS.textMuted, marginTop: 2 }}>{c.sub}</div>}
          </div>
        ))}
      </div>
      {note && <div style={{ fontSize: 11, color: dark ? "rgba(247,244,238,0.6)" : COLORS.textMuted, fontStyle: "italic", marginTop: 10 }}>{note}</div>}
    </div>
  );
}

function HistCell({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#fff", border: `1px solid #E5D8B5`, borderRadius: 3, padding: "10px 12px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 400, marginTop: 4, color: color ?? COLORS.textMid }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function pcMoney(n: number, currency: string): string {
  return currency === "MXN" ? formatMXN(n) : formatUSD(n);
}

function PettyCashBox({ guest, currency, float, spent, onSave }: {
  guest: string;
  currency: string;
  float: number | null;
  spent: number;
  onSave: (amount: number) => void;
}) {
  const [draft, setDraft] = useState<string>(float != null ? String(float) : "");
  useEffect(() => { setDraft(float != null ? String(float) : ""); }, [float]);
  const floatNum = float ?? 0;
  const balance = floatNum - spent;
  const hasFloat = float != null && float > 0;
  const commit = () => {
    const amt = Math.max(0, Number(draft) || 0);
    if (amt !== (float ?? 0)) onSave(amt);
  };
  return (
    <div style={{ background: "#1C1914", border: "1px solid #1C1914", borderRadius: 4, padding: "12px 16px", marginBottom: 6 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#B8924A", marginBottom: 10, fontWeight: 500 }}>
        Concierge Petty Cash — {guest}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(247,244,238,0.5)", marginBottom: 4 }}>Owner Float In ({currency})</div>
          <input
            type="number"
            min={0}
            value={draft}
            placeholder="0"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            style={{ width: "100%", padding: "8px 10px", background: "#2A2620", border: "1px solid #4A4338", borderRadius: 3, color: "#F7F4EE", fontFamily: "inherit", fontSize: 15 }}
          />
        </div>
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(247,244,238,0.5)" }}>Spent on Guest</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginTop: 4, color: "#F7F4EE" }}>{pcMoney(spent, currency)}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(247,244,238,0.5)" }}>Balance</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginTop: 4, color: !hasFloat ? "rgba(247,244,238,0.4)" : balance < 0 ? "#E08A8A" : "#7FC9A0" }}>
            {hasFloat ? pcMoney(balance, currency) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

function PettyCashSummary({ group, petty }: {
  group: { live: Booking[]; hist: HistoricalBooking[] };
  petty: Record<string, number>;
}) {
  const usd = { float: 0, spent: 0 };
  const mxn = { float: 0, spent: 0 };
  group.hist.forEach((h) => {
    usd.float += petty[h.id] ?? 0;
    usd.spent += Math.max(0, h.upsellsBilled - h.upsellsProfit);
  });
  group.live.forEach((b) => {
    mxn.float += petty[`live-${b.id}`] ?? 0;
    mxn.spent += bookingUpsellCost(b.items);
  });
  const blocks: { currency: string; float: number; spent: number }[] = [];
  if (group.hist.length) blocks.push({ currency: "USD", ...usd });
  if (group.live.length) blocks.push({ currency: "MXN", ...mxn });
  if (!blocks.length) return null;
  return (
    <div style={{ background: "#FAF7F2", border: `1px solid ${COLORS.gold}`, borderRadius: 4, padding: "16px 18px", marginTop: 6, marginBottom: 12 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: COLORS.gold, marginBottom: 12, fontWeight: 500 }}>
        Petty Cash Summary — Month
      </div>
      {blocks.map((bl) => {
        const balance = bl.float - bl.spent;
        return (
          <div key={bl.currency} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted }}>Total Given by Owner ({bl.currency})</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, marginTop: 4, color: COLORS.textMid }}>{pcMoney(bl.float, bl.currency)}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted }}>Total Spent on Guests</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, marginTop: 4, color: COLORS.textMid }}>{pcMoney(bl.spent, bl.currency)}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted }}>Petty Cash Remaining</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, marginTop: 4, color: balance < 0 ? COLORS.red : COLORS.green }}>{pcMoney(balance, bl.currency)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

