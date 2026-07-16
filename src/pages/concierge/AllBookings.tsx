import { useEffect, useMemo, useState, CSSProperties } from "react";
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
  utvShareMXN: number; // monthly UTV share deducted from upsell pool
  commissionsOwed: MoneyPair; // commissions vendors owe us (guest-direct-paid)
  combinedUSD: { ownerTotal: number; luxTotal: number };
};

// Monthly UTV share deducted from the upsell profit pool before the 85/15 split.
// Covers the owner's UTV maintenance/insurance carve-out. Applies from June 2026
// forward (first month of the new upsell system).
const UTV_SHARE_MXN = 1750;
const UTV_SHARE_START = "2026-06";

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

type MonthGroup = { live: Booking[]; hist: HistoricalBooking[] };

function getCurrentMonthKey(date = new Date()) {
  // Local time keeps the concierge view aligned with the calendar users see;
  // on the 1st of each month this automatically rolls to the new month.
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const YEAR_TABS = [currentYear, currentYear + 1];
  const [year, setYear] = useState<number>(currentYear);
  const [detailKey, setDetailKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  // Petty cash float per booking ref ('live-<id>' or historical string id).
  const [petty, setPetty] = useState<Record<string, number>>({});
  const [syncing, setSyncing] = useState(false);

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

  const syncGuesty = async () => {
    setSyncing(true);
    try {
      const res = await conciergeDb.reservationsSync();
      toast.success(`Synced ${res?.synced ?? 0} reservations from Guesty`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    load();
    loadPetty();
  }, []);

  // Close the inline add form whenever the open month changes.
  useEffect(() => {
    setAdding(false);
  }, [detailKey]);

  // Live bookings for the selected year tab.
  const viewFiltered = useMemo(
    () => bookings.filter((b) => Number(monthKey(b.checkin).split("-")[0]) === year),
    [bookings, year],
  );

  // Historical (pre-tool, USD) rows for the selected year tab.
  const historicalInView = useMemo<HistoricalBooking[]>(
    () => ALL_HISTORICAL.filter((h) => Number(historicalMonthKey(h).split("-")[0]) === year),
    [year],
  );

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
  const shouldForceMayHistorical = year === 2026;

  // Organize strictly by month (newest month first) within the selected year.
  // May 2026 is a hard historical month: if the card renders, it must contain
  // the May imported rows and can never fall through to an empty placeholder.
  const displayMonthSections = useMemo(() => {
    const byKey = new Map<string, MonthGroup>(monthSections);
    if (shouldForceMayHistorical) {
      const mayGroup = byKey.get("2026-05") ?? { live: [], hist: [] };
      byKey.set("2026-05", { ...mayGroup, hist: [...MAY_2026_BOOKINGS] });
    }
    // Ensure the current month always has a (possibly empty) folder in its year.
    if (year === currentYear && !byKey.has(currentMonthKey)) {
      byKey.set(currentMonthKey, { live: [], hist: [] });
    }
    return Array.from(byKey.entries()).sort(([a], [b]) => b.localeCompare(a)); // newest month first
  }, [monthSections, currentMonthKey, shouldForceMayHistorical, year, currentYear]);



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
  function computeMonthKpis(live: Booking[], hist: HistoricalBooking[], key = ""): MonthKpis {
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

    const utvShareMXN = key >= UTV_SHARE_START ? UTV_SHARE_MXN : 0;
    // UTV share is deducted from the upsell profit pool BEFORE the 85/15 split.
    const netProfitMXN = profitMXN - utvShareMXN;

    // Commissions owed to us by vendors the guest paid directly (live bookings only).
    const commissionsMXN = live.reduce((s, b) => {
      const rate = Number(b.exchange_rate) || FX;
      const list = Array.isArray((b as any).commissions_owed) ? (b as any).commissions_owed : [];
      return s + list.reduce(
        (sum: number, c: any) =>
          sum + (c?.currency === "USD" ? (Number(c?.amount) || 0) * rate : Number(c?.amount) || 0),
        0,
      );
    }, 0);

    return {
      count: hist.length + live.length,
      accommodation: { fareUSD, ownerUSD: fareUSD * 0.85, luxUSD: fareUSD * 0.15 },
      upsells: {
        billed: pair(billedMXN),
        profit: pair(netProfitMXN),
        owner: pair(netProfitMXN * 0.85),
        lux: pair(netProfitMXN * 0.15),
      },
      utvShareMXN,
      commissionsOwed: pair(commissionsMXN),
      combinedUSD: {
        ownerTotal: fareUSD * 0.85 + (netProfitMXN / FX) * 0.85,
        luxTotal: fareUSD * 0.15 + (netProfitMXN / FX) * 0.15,
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
      if (Number(b.guest_gratuity) > 0) rows.push([m, b.guest, b.checkin, b.checkout ?? "", "5% Gratuity", "", "", String(Math.round(b.guest_gratuity)), "", "pass-through"]);
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
          <button onClick={syncGuesty} disabled={syncing} style={{ ...btnPrimary, opacity: syncing ? 0.6 : 1 }}>
            {syncing ? "Syncing…" : "Refresh from Guesty"}
          </button>
          <button onClick={load} style={btnGhost}>↻ Refresh</button>
          <button onClick={downloadAllCSV} style={btnGhost}>Download All as CSV</button>
        </div>
      </div>

      {/* Year tabs — hidden while viewing a single month */}
      {!detailKey && (
      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: `1px solid ${COLORS.border}` }}>
        {YEAR_TABS.map((y) => {
          const active = year === y;
          return (
            <button
              key={y}
              onClick={() => setYear(y)}
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 26px",
                fontFamily: "inherit",
                fontSize: 13,
                letterSpacing: "0.16em",
                cursor: "pointer",
                color: active ? COLORS.gold : COLORS.textMuted,
                borderBottom: active ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                marginBottom: -1,
                fontWeight: active ? 600 : 400,
              }}
            >
              {y}
            </button>
          );
        })}
      </div>
      )}

      {!detailKey && (
      <div style={{ fontStyle: "italic", color: COLORS.textMuted, fontSize: 12, marginBottom: 18 }}>
        {year === currentYear
          ? `Viewing ${year} · current month is ${currentMonthLabel}.`
          : `Viewing ${year}.`} Historical reports stay attached to their booking month.
      </div>
      )}

      {loading && <div style={{ color: COLORS.textMuted }}>Loading…</div>}
      {!loading && displayMonthSections.length === 0 && (
        <div style={{ background: "#fff", border: `1px dashed ${COLORS.border}`, borderRadius: 4, padding: "32px 22px", textAlign: "center", color: COLORS.textMuted }}>
          No bookings recorded for {year} yet.
        </div>
      )}


      {(detailKey ? displayMonthSections.filter(([k]) => k === detailKey) : displayMonthSections).map(([key, group], idx, arr) => {
        const kpis = computeMonthKpis(group.live, group.hist, key);
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
            {/* Add a new booking directly inside this month */}
            <div style={{ marginBottom: 18 }}>
              {adding ? (
                <div style={{ border: `1px solid ${COLORS.gold}`, borderRadius: 4, padding: "18px 22px", background: "#fff" }}>
                  <NewBooking
                    onSaved={() => { setAdding(false); load(); }}
                    onCancel={() => setAdding(false)}
                  />
                </div>
              ) : (
                <button onClick={() => setAdding(true)} style={btnPrimary}>+ Add New Booking</button>
              )}
            </div>


            {key === "2026-06" && (() => {
              // June ran two systems. Old system = owner collected upsells (historical
              // June bookings); New system = LUX collects all upsells (live bookings).
              const oldNames = group.hist.map((h) => h.guest);
              const newNames = Array.from(new Set(group.live.map((b) => b.guest)));
              const accomFareUSD = kpis.accommodation.fareUSD;
              const luxAccomUSD = accomFareUSD * 0.15;
              const oldUpsellProfitUSD = group.hist.reduce((s, h) => s + (h.upsellsProfit || 0), 0);
              const luxOldUpsellUSD = oldUpsellProfitUSD * 0.15;
              const newUpsellProfitMXN = group.live.reduce((s, b) => s + (Number(b.total_profit) || 0), 0);
              // Deduct the monthly UTV share from the new-system upsell pool before the 85/15 split,
              // mirroring the bottom MonthSummary so both views agree.
              const netNewUpsellMXN = Math.max(0, newUpsellProfitMXN - UTV_SHARE_MXN);
              const ownerNewUpsellMXN = netNewUpsellMXN * 0.85;
              const ownerOwesLuxUSD = luxAccomUSD + luxOldUpsellUSD;
              return (
                <div style={{ background: "#fff", border: `1px solid ${COLORS.gold}`, borderRadius: 4, padding: "18px 20px", marginBottom: 18 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.gold, fontWeight: 500, marginBottom: 4 }}>
                    Special Reconciliation · June 2026
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 10 }}>
                    Owner ⇄ LUX Settlement
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMid, lineHeight: 1.6, marginBottom: 14 }}>
                    June is a transition month running two systems.
                    <br />
                    <strong>Old system</strong> (owner collected the upsells): {oldNames.length ? oldNames.join(", ") : "—"}.
                    <br />
                    <strong>New system</strong> (LUX collects all upsells): {newNames.length ? newNames.join(", ") : "—"}.
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 14 }}>
                    <HistCell
                      label="A · LUX 15% on ALL accom (USD)"
                      value={formatUSD(luxAccomUSD)}
                      sub={`15% × ${formatUSD(accomFareUSD)} total accom · Owner → LUX`}
                      color={COLORS.amber}
                    />
                    <HistCell
                      label="B · LUX 15% of OLD upsell profit (USD)"
                      value={formatUSD(luxOldUpsellUSD)}
                      sub={`15% × ${formatUSD(oldUpsellProfitUSD)} old profit · Owner → LUX`}
                      color={COLORS.amber}
                    />
                    <HistCell
                      label="C · Owner 85% of NEW upsell profit (pesos)"
                      value={formatMXN(ownerNewUpsellMXN)}
                      sub={`85% × ${formatMXN(netNewUpsellMXN)} (net of ${formatMXN(UTV_SHARE_MXN)} UTV share) · LUX → Owner`}
                      color={COLORS.green}
                    />
                  </div>

                  <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted }}>Owner owes LUX (A + B)</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: COLORS.amber, marginTop: 4 }}>{formatUSD(ownerOwesLuxUSD)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted }}>LUX owes Owner (C)</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: COLORS.green, marginTop: 4 }}>{formatMXN(ownerNewUpsellMXN)}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>≈ {formatUSD(ownerNewUpsellMXN / FX)} @ {FX}</div>
                    </div>
                  </div>

                  {/* Net settlement — combine old + new into a single number */}
                  {(() => {
                    const cUSD = ownerNewUpsellMXN / FX;
                    const netUSD = ownerOwesLuxUSD - cUSD; // + = owner pays LUX, − = LUX pays owner
                    const ownerPays = netUSD >= 0;
                    return (
                      <div style={{ marginTop: 14, background: COLORS.dark, color: "#F7F4EE", borderRadius: 4, padding: "16px 20px" }}>
                        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.gold, marginBottom: 6 }}>
                          Net Settlement · June 2026 (USD @ {FX})
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                          <div style={{ fontSize: 13, opacity: 0.85 }}>
                            (A + B) {formatUSD(ownerOwesLuxUSD)} <span style={{ opacity: 0.6 }}>−</span> C {formatUSD(cUSD)}
                          </div>
                          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: COLORS.gold }}>
                            {ownerPays ? "Owner pays LUX" : "LUX pays Owner"} {formatUSD(Math.abs(netUSD))}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8, fontStyle: "italic" }}>
                          Convenience total. The two sides can also settle separately in their native currencies (USD above / pesos above) — either approach reconciles the month.
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 10 }}>
                    Under the new system LUX collects the full guest upsell payment, pays the supplier, and splits the remaining profit 85% owner / 15% LUX. Example: 6,000 MXN airport shuttle → 5,000 MXN to driver → 1,000 MXN profit → 850 MXN owner + 150 MXN LUX.
                  </div>
                </div>

              );
            })()}

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
                        <div style={{ fontSize: 18, fontWeight: 500 }}>{formatMXN(h.upsellsBilled * FX)}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>≈ {formatUSD(h.upsellsBilled)} USD @16</div>
                        <div style={{ fontSize: 12, color: COLORS.green, marginTop: 2 }}>Profit: {formatMXN(h.upsellsProfit * FX)} <span style={{ color: COLORS.textMuted }}>(≈ {formatUSD(h.upsellsProfit)})</span></div>
                        <div
                          style={{
                            display: "inline-block", marginTop: 6, fontSize: 10,
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            padding: "3px 8px", borderRadius: 2,
                            background: "#E7F0E9", color: COLORS.green,
                          }}
                        >
                          Paid · {formatUSD(h.upsellsBilled)} USD
                        </div>
                      </div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 13 }}>
                      <thead>
                        <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                          <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Service</th>
                          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Total (USD)</th>
                          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Cost (USD)</th>
                          <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Profit (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {h.items.map((i, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                              {i.name} <span style={{ color: COLORS.textMuted }}>×{i.qty}</span>
                            </td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatUSD(i.guest_total)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMid }}>{i.cost === null || i.type === "utv" ? "—" : formatUSD(i.cost)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: i.passThrough ? COLORS.blue : (i.profit === null ? COLORS.amber : COLORS.green), fontStyle: i.passThrough || i.profit === null ? "italic" : "normal", fontSize: i.passThrough ? 11 : 13 }}>
                              {i.passThrough ? "pass-through" : i.profit === null ? "TBD" : formatUSD(i.profit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
                      <HistCell label="Accommodation Fare" value={formatUSD(h.accommodationFare)} sub={h.accommodationFare > 0 ? `Owner 85%: ${formatUSD(h.accommodationFare * 0.85)} · LUX 15%: ${formatUSD(h.accommodationFare * 0.15)}` : "Not captured for this booking"} />
                      <HistCell label="Upsells Billed (pesos)" value={formatMXN(h.upsellsBilled * FX)} sub={`≈ ${formatUSD(h.upsellsBilled)} USD · Profit ${formatMXN(h.upsellsProfit * FX)}`} />
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
                    <HistCell label="Upsells Billed (pesos)" value={formatMXN(h.upsellsBilled * FX)} sub={`≈ ${formatUSD(h.upsellsBilled)} USD · Profit ${formatMXN(h.upsellsProfit * FX)}`} />
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
                        {v.source === "guesty" && (
                          <span style={{ fontSize: 9, background: "#B8924A1a", color: COLORS.gold, padding: "2px 8px", borderRadius: 10, marginLeft: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Guesty</span>
                        )}
                        {(v.res_status === "canceled" || v.res_status === "cancelled") && (
                          <span style={{ fontSize: 9, background: "#E08A8A1a", color: COLORS.red, padding: "2px 8px", borderRadius: 10, marginLeft: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Cancelled</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, display: "flex", gap: 10, alignItems: "center" }}>
                        <span>
                          {v.listing_name ? `${v.listing_name} · ` : ""}Check-in: {v.checkin}{v.checkout ? ` · Check-out: ${v.checkout}` : ""}{v.nights ? ` · ${v.nights} night${v.nights === 1 ? "" : "s"}` : ""}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.textMid, marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: COLORS.textMuted }}>Accommodation:</span>
                        <span style={{ fontWeight: 500 }}>
                          {v.accommodation_fare != null && Number(v.accommodation_fare) > 0 ? formatUSD(Number(v.accommodation_fare)) : "—"} USD
                        </span>
                        {v.accommodation_fare != null && v.guesty_fare != null && Number(v.accommodation_fare) !== Number(v.guesty_fare) && (
                          <span style={{ fontSize: 9, background: `${COLORS.amber}1a`, color: COLORS.amber, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Edited</span>
                        )}
                      </div>
                      {v.meal_token && (
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <MealLinkButton token={v.meal_token} />
                          <a
                            href={`${window.location.origin}/meals/${v.meal_token}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ ...btnGhost, padding: "6px 11px", fontSize: 10, textDecoration: "none" }}
                          >
                            Open meal plan
                          </a>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>{formatMXN(v.total_guest)}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>≈ {formatUSD(v.total_guest / (Number(v.exchange_rate) || FX))} USD @{Number(v.exchange_rate) || FX}</div>
                      <div style={{ fontSize: 12, color: COLORS.green, marginTop: 2 }}>Profit: {formatMXN(v.total_profit)} <span style={{ color: COLORS.textMuted }}>(≈ {formatUSD(v.total_profit / (Number(v.exchange_rate) || FX))})</span></div>
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
                      {Number(v.guest_gratuity) > 0 && (
                        <tr>
                          <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                            5% Gratuity
                          </td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatMXN(v.guest_gratuity)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.blue, fontStyle: "italic", fontSize: 11 }}>pass-through</td>
                        </tr>
                      )}
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


            <MonthSummary kpis={kpis} group={group} petty={petty} />
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

function MonthSummary({ kpis, group, petty }: {
  kpis: MonthKpis;
  group: { live: Booking[]; hist: HistoricalBooking[] };
  petty: Record<string, number>;
}) {
  // Petty cash roll-up (per currency).
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
  const pettyBlocks: { currency: string; float: number; spent: number }[] = [];
  if (group.hist.length) pettyBlocks.push({ currency: "USD", ...usd });
  if (group.live.length) pettyBlocks.push({ currency: "MXN", ...mxn });

  // Dark palette (cohesive black block).
  const CREAM = "#F7F4EE";
  const GOLD = "#B8924A";
  const MUTED = "rgba(247,244,238,0.5)";
  const GREEN = "#7FC9A0";
  const AMBER = "#D9B25A";
  const BLUE = "#8FB4D9";
  const RED = "#E08A8A";
  const DIV = "1px solid rgba(247,244,238,0.12)";

  const secTitle: CSSProperties = {
    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em",
    color: GOLD, fontWeight: 500, marginBottom: 12,
  };
  const cellLabel: CSSProperties = {
    fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: MUTED,
  };
  const cellVal = (color = CREAM): CSSProperties => ({
    fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, marginTop: 4, color,
  });
  const cellSub: CSSProperties = { fontSize: 10, color: MUTED, marginTop: 2 };

  const Section = ({ title, cols, children }: { title: string; cols: number; children: React.ReactNode }) => (
    <div style={{ padding: "18px 0", borderTop: DIV }}>
      <div style={secTitle}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
        {children}
      </div>
    </div>
  );
  const Cell = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) => (
    <div>
      <div style={cellLabel}>{label}</div>
      <div style={cellVal(color)}>{value}</div>
      {sub && <div style={cellSub}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ background: "#1C1914", border: "1px solid #1C1914", borderRadius: 4, padding: "8px 22px 20px", marginTop: 18, marginBottom: 12, color: CREAM }}>
      <div style={{ padding: "16px 0 0" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: GOLD, fontWeight: 500 }}>
          Month Summary
        </div>
      </div>

      <Section title="Accommodation Fare (paid in USD)" cols={3}>
        <Cell label="Total Fare" value={formatUSD(kpis.accommodation.fareUSD)} />
        <Cell label="Owner's Share 85%" value={formatUSD(kpis.accommodation.ownerUSD)} color={GREEN} />
        <Cell label="LUX's Cut 15%" value={formatUSD(kpis.accommodation.luxUSD)} color={AMBER} />
      </Section>

      <Section title="Upsells (priced in pesos · charged to guests in USD @16)" cols={4}>
        <Cell label="Guest Billed" value={formatMXN(kpis.upsells.billed.mxn)} sub={`≈ ${formatUSD(kpis.upsells.billed.usd)} USD`} />
        <Cell label="Profit Pool (net of UTV share)" value={formatMXN(kpis.upsells.profit.mxn)} sub={kpis.utvShareMXN > 0 ? `After ${formatMXN(kpis.utvShareMXN)} UTV share deduction` : `≈ ${formatUSD(kpis.upsells.profit.usd)} USD`} />
        <Cell label="Owner's Share 85%" value={formatMXN(kpis.upsells.owner.mxn)} sub={`≈ ${formatUSD(kpis.upsells.owner.usd)} USD`} color={GREEN} />
        <Cell label="LUX's Cut 15%" value={formatMXN(kpis.upsells.lux.mxn)} sub={`≈ ${formatUSD(kpis.upsells.lux.usd)} USD`} color={AMBER} />
      </Section>

      {kpis.utvShareMXN > 0 && (
        <Section title="UTV Share (deducted from upsell pool)" cols={1}>
          <Cell label="Monthly UTV Share to Owner" value={`− ${formatMXN(kpis.utvShareMXN)}`} sub="Deducted from upsell profit before the 85/15 split" color={AMBER} />
        </Section>
      )}

      <Section title="Combined Totals in USD (Accommodation + Upsells @16)" cols={3}>
        <Cell label="Bookings" value={String(kpis.count)} />
        <Cell label="Owner Total Earnings" value={formatUSD(kpis.combinedUSD.ownerTotal)} color={GREEN} />
        <Cell label="LUX Total Cut" value={formatUSD(kpis.combinedUSD.luxTotal)} color={AMBER} />
      </Section>

      {kpis.commissionsOwed.mxn > 0 && (
        <Section title="Commissions Owed to Us (vendors the guest paid directly)" cols={1}>
          <Cell label="Total Owed" value={formatMXN(kpis.commissionsOwed.mxn)} sub={`≈ ${formatUSD(kpis.commissionsOwed.usd)} USD`} color={BLUE} />
        </Section>
      )}

      {pettyBlocks.map((bl) => {
        const balance = bl.float - bl.spent;
        return (
          <Section key={bl.currency} title={`Petty Cash — ${bl.currency}`} cols={3}>
            <Cell label={`Total Given by Owner (${bl.currency})`} value={pcMoney(bl.float, bl.currency)} />
            <Cell label="Total Spent on Guests" value={pcMoney(bl.spent, bl.currency)} />
            <Cell label="Petty Cash Remaining" value={pcMoney(balance, bl.currency)} color={balance < 0 ? RED : GREEN} />
          </Section>
        );
      })}

      <div style={{ fontSize: 11, color: MUTED, fontStyle: "italic", marginTop: 16, paddingTop: 16, borderTop: DIV }}>
        Accommodation is billed in USD on Guesty. Upsells are priced in pesos and charged to guests in USD at 16.
      </div>
    </div>
  );
}



function MealLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/meals/${token}`;
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
        padding: "6px 11px",
        fontSize: 10,
        color: copied ? COLORS.green : COLORS.textMid,
        borderColor: copied ? COLORS.green : COLORS.border,
      }}
    >
      {copied ? "Copied ✓" : "Copy meal link"}
    </button>
  );
}
