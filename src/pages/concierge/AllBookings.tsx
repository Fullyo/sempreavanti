import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Booking,
  BookingItem,
  bookingUpsellCost,
  calcCCFee,
  calcCost,
  calcGuestTotal,
  calcProfit,
  calcTip,
  formatMXN,
} from "@/lib/calculations";
import { COLORS, btnGhost, btnPrimary, btnDanger, fieldLabel, input, sectionTitle } from "./styles";
import { downloadInvoice } from "./GuestInvoicePDF";
import { downloadOwnerStatementCSV, openOwnerStatement } from "./ownerStatement";
import { openApril2026Historical } from "./april2026Historical";
import { openMay2026Historical } from "./may2026Historical";
import {
  ALL_HISTORICAL,
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

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

type ViewTab = "upcoming" | "all";

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
  const [openMonthKey, setOpenMonthKey] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Booking | null>(null);
  // Petty cash float per booking ref ('live-<id>' or historical string id).
  const [petty, setPetty] = useState<Record<string, number>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("checkin", { ascending: true });
    setLoading(false);
    if (error) return toast.error(error.message);
    setBookings(((data ?? []) as unknown as Booking[]).map((b) => ({
      ...b,
      items: Array.isArray(b.items) ? b.items : [],
    })));
  };

  const loadPetty = async () => {
    const { data, error } = await supabase.from("petty_cash").select("booking_ref, float_amount");
    if (error) return;
    const map: Record<string, number> = {};
    (data ?? []).forEach((r: any) => { map[r.booking_ref] = Number(r.float_amount) || 0; });
    setPetty(map);
  };

  const saveFloat = async (ref: string, amount: number, currency: string) => {
    setPetty((p) => ({ ...p, [ref]: amount }));
    const { error } = await supabase
      .from("petty_cash")
      .upsert({ booking_ref: ref, float_amount: amount, currency, updated_at: new Date().toISOString() }, { onConflict: "booking_ref" });
    if (error) toast.error(error.message);
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
    const groups: Record<string, { live: Booking[]; hist: HistoricalBooking[] }> = {};
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

  // Reorder: current month first (even if empty), then older months descending.
  const displayMonthSections = useMemo(() => {
    const withoutCurrent = monthSections.filter(([k]) => k !== currentMonthKey);
    const current = monthSections.find(([k]) => k === currentMonthKey);
    const currentEntry: [string, { live: Booking[]; hist: HistoricalBooking[] }] =
      current ?? [currentMonthKey, { live: [], hist: [] }];
    return [currentEntry, ...withoutCurrent];
  }, [monthSections, currentMonthKey]);

  // Default selection = current month. User can switch by clicking other folders.
  useEffect(() => {
    setOpenMonthKey((prev) => {
      if (prev && displayMonthSections.some(([k]) => k === prev)) return prev;
      return currentMonthKey;
    });
  }, [displayMonthSections, currentMonthKey]);

  const months = useMemo(() => {
    const set = new Set([
      ...bookings.map((b) => monthKey(b.checkin)),
      ...ALL_HISTORICAL.map((h) => historicalMonthKey(h)),
    ]);
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [bookings]);

  // Per-month KPI breakdown.
  function computeMonthKpis(live: Booking[], hist: HistoricalBooking[]): KpiBreakdown {
    const histK = computeHistoricalKpis(hist);
    const liveProfit = live.reduce((s, b) => s + Number(b.total_profit), 0);
    const liveBilled = live.reduce((s, b) => s + Number(b.total_guest), 0);
    const liveAccomFare = live.reduce((s, b) => s + Number(b.accommodation_fare ?? 0), 0);
    const liveAccomOwner = liveAccomFare * 0.85;
    const liveAccomLux = liveAccomFare * 0.15;
    return {
      count: histK.count + live.length,
      accommodation: {
        fare: histK.accommodation.fare + liveAccomFare,
        owner: histK.accommodation.owner + liveAccomOwner,
        lux: histK.accommodation.lux + liveAccomLux,
      },
      upsells: {
        billed: histK.upsells.billed + liveBilled,
        profit: histK.upsells.profit + liveProfit,
        owner: histK.upsells.owner + liveProfit * 0.85,
        lux: histK.upsells.lux + liveProfit * 0.15,
      },
      combined: {
        ownerTotal: histK.combined.ownerTotal + liveAccomOwner + liveProfit * 0.85,
        luxTotal: histK.combined.luxTotal + liveAccomLux + liveProfit * 0.15,
      },
    };
  }





  const startEdit = (b: Booking) => {
    setEditId(b.id);
    setEdit(JSON.parse(JSON.stringify(b)));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEdit(null);
  };

  const saveEdit = async () => {
    if (!edit) return;
    const items: BookingItem[] = edit.items.map((i) => ({
      ...i,
      guest_total: calcGuestTotal(i.type, i.price, i.qty),
      cost: calcCost(i.type, i.price, i.qty, i.unit_cost),
      profit: calcProfit(i.type, i.price, i.qty, i.unit_cost),
    }));
    const servicesSubtotal = items.reduce((s, i) => s + i.guest_total, 0);
    const tip = calcTip(edit.tip_mode, Number(edit.tip_value), servicesSubtotal);
    const cc_fee = calcCCFee(edit.cc_fee_on, servicesSubtotal, tip);
    const total_guest = servicesSubtotal + tip + cc_fee;
    const total_profit = items.reduce((s, i) => s + (i.profit ?? 0), 0);

    const { error } = await supabase
      .from("bookings")
      .update({
        guest: edit.guest,
        checkin: edit.checkin,
        checkout: edit.checkout,
        items: items as any,
        cc_fee_on: edit.cc_fee_on,
        tip_mode: edit.tip_mode,
        tip_value: edit.tip_value,
        tip,
        cc_fee,
        total_guest,
        total_profit,
      })
      .eq("id", edit.id);
    if (error) return toast.error(error.message);
    toast.success("Booking updated");
    cancelEdit();
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
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
      if (Number(b.cc_fee) > 0) rows.push([m, b.guest, b.checkin, b.checkout ?? "", "3% Credit Card Fee", "", "", String(Math.round(b.cc_fee)), "", ""]);
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
        const { error } = await supabase.from("bookings").upsert(
          toInsert.map(({ id, ...rest }) => ({ ...rest })) as any,
        );
        if (error) throw error;
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
        <h1 style={sectionTitle}>Bookings</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Month
          </label>
          <select
            style={{ ...input, width: "auto", padding: "8px 10px" }}
            value={monthFilter}
            onChange={(e) => { setMonthFilter(e.target.value); setView("all"); }}
          >
            <option value="all">All months</option>
            {months.map((m) => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>
          <button onClick={load} style={btnGhost}>↻ Refresh</button>
          <button onClick={downloadAllCSV} style={btnGhost}>Download All as CSV</button>
        </div>
      </div>

      {/* View toggle: All vs Upcoming */}
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

      <div style={{ fontStyle: "italic", color: COLORS.textMuted, fontSize: 12, marginBottom: 18 }}>
        Current month is {currentMonthLabel}. Click any month folder to open its bookings.
      </div>

      {loading && <div style={{ color: COLORS.textMuted }}>Loading…</div>}
      {!loading && displayMonthSections.length === 0 && (
        <div style={{ background: "#fff", border: `1px dashed ${COLORS.border}`, borderRadius: 4, padding: "32px 22px", textAlign: "center", color: COLORS.textMuted }}>
          {view === "upcoming" ? "No upcoming check-ins in the next 60 days." : "No bookings match this filter."}
        </div>
      )}

      {displayMonthSections.map(([key, group]) => {
        const kpis = computeMonthKpis(group.live, group.hist);
        const label = monthLabel(key);
        const [yStr, mStr] = key.split("-");
        const monthName = new Date(Date.UTC(Number(yStr), Number(mStr) - 1, 1)).toLocaleDateString("en-US", { month: "long" });
        const hasHist = group.hist.length > 0;
        const hasLive = group.live.length > 0;
        const histReportBtn = key === "2026-05"
          ? <button onClick={openMay2026Historical} style={btnGhost}>Open Full May 2026 Report</button>
          : key === "2026-04"
          ? <button onClick={openApril2026Historical} style={btnGhost}>Open Full April 2026 Report</button>
          : null;

        const isCurrent = key === currentMonthKey;
        const isOpen = openMonthKey === key;
        const isEmpty = !hasHist && !hasLive;
        return (
          <div key={key} style={{ marginBottom: isOpen ? 40 : 10 }}>
            <div
              onClick={() => setOpenMonthKey(isOpen ? null : key)}
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
                <button onClick={() => setOpenMonthKey(isOpen ? null : key)} style={btnGhost}>
                  {isOpen ? "Close" : "Open"}
                </button>
              </div>
            </div>


            {isOpen && (<>
            {/* Per-month KPI summary */}
            <div style={{ marginBottom: 18 }}>
              <KpiBlock
                title="Accommodation Fare"
                tone="accom"
                cells={[
                  { label: "Total Fare", value: hasHist ? formatUSD(kpis.accommodation.fare) : formatMXN(kpis.accommodation.fare) },
                  { label: "Owner's Share 85%", value: hasHist ? formatUSD(kpis.accommodation.owner) : formatMXN(kpis.accommodation.owner), color: COLORS.green },
                  { label: "LUX's Cut 15%", value: hasHist ? formatUSD(kpis.accommodation.lux) : formatMXN(kpis.accommodation.lux), color: COLORS.amber },
                ]}
                note={kpis.accommodation.fare === 0 ? "No accommodation fare recorded for this month." : undefined}
              />
              <KpiBlock
                title="Upsells (Transport, UTV, Groceries, etc.)"
                tone="upsell"
                cells={[
                  { label: "Guest Billed", value: hasHist ? formatUSD(kpis.upsells.billed) : formatMXN(kpis.upsells.billed) },
                  { label: "Profit Pool", value: hasHist ? formatUSD(kpis.upsells.profit) : formatMXN(kpis.upsells.profit) },
                  { label: "Owner's Share 85%", value: hasHist ? formatUSD(kpis.upsells.owner) : formatMXN(kpis.upsells.owner), color: COLORS.green },
                  { label: "LUX's Cut 15%", value: hasHist ? formatUSD(kpis.upsells.lux) : formatMXN(kpis.upsells.lux), color: COLORS.amber },
                ]}
              />
              <KpiBlock
                title="Combined Totals (Accommodation + Upsells)"
                tone="combined"
                cells={[
                  { label: "Bookings", value: String(kpis.count) },
                  { label: "Owner Total Earnings", value: hasHist ? formatUSD(kpis.combined.ownerTotal) : formatMXN(kpis.combined.ownerTotal), color: COLORS.green },
                  { label: "LUX Total Cut", value: hasHist ? formatUSD(kpis.combined.luxTotal) : formatMXN(kpis.combined.luxTotal), color: COLORS.amber },
                ]}
              />
              {hasHist && hasLive && (
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", marginTop: 8 }}>
                  Note · This month contains both historical (USD) and live (MXN) bookings. Totals above are not FX-converted — treat each currency block separately.
                </div>
              )}
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
              </div>
            ))}

            {/* Live (MXN) rows */}
            {group.live.map((b) => {
              const isEdit = editId === b.id && edit;
              const v = (isEdit ? edit! : b);
              const liveRef = `live-${b.id}`;
              const liveSpent = bookingUpsellCost(b.items);
              return (
                <div key={b.id} style={{ marginBottom: 14 }}>
                <PettyCashBox
                  guest={b.guest}
                  currency="MXN"
                  float={petty[liveRef] ?? null}
                  spent={liveSpent}
                  onSave={(amt) => saveFloat(liveRef, amt, "MXN")}
                />
                <div style={{ background: "#fff", border: `1px solid ${isEdit ? COLORS.gold : COLORS.border}`, borderRadius: 4, padding: "18px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      {isEdit ? (
                        <input
                          style={{ ...input, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300 }}
                          value={v.guest}
                          onChange={(e) => setEdit({ ...edit!, guest: e.target.value })}
                        />
                      ) : (
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300 }}>
                          {v.guest}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, display: "flex", gap: 10, alignItems: "center" }}>
                        {isEdit ? (
                          <>
                            <input type="date" style={{ ...input, width: "auto" }} value={v.checkin} onChange={(e) => setEdit({ ...edit!, checkin: e.target.value })} />
                            <input type="date" style={{ ...input, width: "auto" }} value={v.checkout ?? ""} onChange={(e) => setEdit({ ...edit!, checkout: e.target.value || null })} />
                          </>
                        ) : (
                          <span>
                            Check-in: {v.checkin}{v.checkout ? ` · Check-out: ${v.checkout}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>{formatMXN(v.total_guest)}</div>
                      <div style={{ fontSize: 12, color: COLORS.green, marginTop: 2 }}>Profit: {formatMXN(v.total_profit)}</div>
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Service</th>
                        {isEdit && <th style={{ width: 70, padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Qty</th>}
                        {isEdit && <th style={{ width: 100, padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Unit Price</th>}
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Total</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Cost</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.items.map((i, idx) => {
                        const gt = isEdit ? calcGuestTotal(i.type, i.price, i.qty) : i.guest_total;
                        const c = isEdit ? calcCost(i.type, i.price, i.qty, i.unit_cost) : i.cost;
                        const p = isEdit ? calcProfit(i.type, i.price, i.qty, i.unit_cost) : i.profit;
                        return (
                          <tr key={idx}>
                            <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                              {i.name} <span style={{ color: COLORS.textMuted }}>×{i.qty}</span>
                            </td>
                            {isEdit && (
                              <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                                <input type="number" min={1} style={input} value={i.qty} onChange={(e) => {
                                  const items = [...edit!.items];
                                  items[idx] = { ...i, qty: Math.max(1, Number(e.target.value) || 1) };
                                  setEdit({ ...edit!, items });
                                }} />
                              </td>
                            )}
                            {isEdit && (
                              <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                                <input type="number" min={0} style={input} value={i.price} onChange={(e) => {
                                  const items = [...edit!.items];
                                  items[idx] = { ...i, price: Number(e.target.value) || 0 };
                                  setEdit({ ...edit!, items });
                                }} />
                              </td>
                            )}
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
                          {isEdit && <td colSpan={2} />}
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatMXN(v.tip)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.blue, fontStyle: "italic", fontSize: 11 }}>pass-through</td>
                        </tr>
                      )}
                      {Number(v.cc_fee) > 0 && (
                        <tr>
                          <td style={{ padding: "8px 6px" }}>3% Credit Card Fee</td>
                          {isEdit && <td colSpan={2} />}
                          <td style={{ textAlign: "right", padding: "8px 6px" }}>{formatMXN(v.cc_fee)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", color: COLORS.textMuted }}>—</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {isEdit && (
                    <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label style={fieldLabel}>Tip</label>
                        <button
                          onClick={() => setEdit({ ...edit!, tip_mode: edit!.tip_mode === "amount" ? "percent" : "amount", tip_value: 0 })}
                          style={{ ...btnGhost, padding: "6px 12px", minWidth: 36 }}
                        >
                          {edit!.tip_mode === "amount" ? "$" : "%"}
                        </button>
                        <input
                          type="number"
                          min={0}
                          style={{ ...input, width: 90 }}
                          value={edit!.tip_value || ""}
                          onChange={(e) => setEdit({ ...edit!, tip_value: Number(e.target.value) || 0 })}
                        />
                      </div>
                      <button
                        onClick={() => setEdit({ ...edit!, cc_fee_on: !edit!.cc_fee_on })}
                        style={{ ...btnGhost, color: edit!.cc_fee_on ? COLORS.red : COLORS.textMid }}
                      >
                        CC Fee: {edit!.cc_fee_on ? "ON" : "OFF"}
                      </button>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                    {isEdit ? (
                      <>
                        <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
                        <button onClick={saveEdit} style={btnPrimary}>Save Changes</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => downloadInvoice(b)} style={btnPrimary}>Download Invoice</button>
                        <button onClick={() => startEdit(b)} style={btnGhost}>Edit</button>
                        <button onClick={() => remove(b.id)} style={btnDanger}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
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

type KpiCell = { label: string; value: string; color?: string };

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

