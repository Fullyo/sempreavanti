import { useEffect, useMemo, useState, CSSProperties } from "react";
import { conciergeDb } from "@/lib/conciergeApi";
import { toast } from "sonner";
import {
  Booking,
  calcCost,
  calcGuestTotal,
  calcProfit,
  CATEGORY_ORDER,
  computeGuestPayment,
  formatMXN,
  isUtvRental,
  Service,
  TYPE_COLOR,
  UTV_GAS_PER_RENTAL,
} from "@/lib/calculations";
import { COLORS, btnPrimary, btnGhost, fieldLabel, input, sectionTitle } from "./styles";
import { useIsMobile } from "@/hooks/use-mobile";

const tipInput: CSSProperties = {
  width: 100,
  padding: "6px 10px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(247,244,238,0.2)",
  color: "#F7F4EE",
  fontFamily: "'Jost', sans-serif",
  fontSize: 13,
  borderRadius: 2,
  textAlign: "right",
};

function CurrencyToggle({
  value,
  onChange,
  size = "md",
}: {
  value: "MXN" | "USD";
  onChange: (v: "MXN" | "USD") => void;
  size?: "sm" | "md";
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {(["MXN", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          style={{
            background: value === c ? COLORS.gold : "rgba(0,0,0,0.04)",
            color: value === c ? "#fff" : COLORS.textMid,
            border: `1px solid ${COLORS.border}`,
            padding: size === "sm" ? "4px 7px" : "6px 10px",
            cursor: "pointer",
            fontFamily: "'Jost', sans-serif",
            fontSize: size === "sm" ? 10 : 11,
            letterSpacing: "0.06em",
            borderRadius: 2,
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

interface Row {
  uid: string;
  service_id: number | null;
  name: string;
  type: string;
  qty: number;
  price: number;
  currency: "MXN" | "USD";
  unit_cost: number | null;
  sub_text?: string | null;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

const MANUAL_TYPES = ["tour", "tour10", "mgmt", "margin", "fixedprofit", "grocery", "minibar", "beer", "flat", "villa"];

// Types where quantity is meaningless (priced as a single/total amount).
const QTY_LESS_TYPES = ["grocery", "minibar", "flat", "fixedprofit"];
const isQtyLess = (t: string) => QTY_LESS_TYPES.includes(t);

// Shared desktop grid template so header and rows always line up.
const GRID_COLS = "minmax(180px,2.6fr) 60px minmax(150px,1.5fr) 96px 110px 110px 30px";

const FUEL_NAME = "UTV Fuel — Gas";

function bookingToRows(b: Booking): Row[] {
  return (b.items ?? [])
    // Auto-fuel is recreated from the UTV lines, so don't load a stored fuel row.
    .filter((i) => i.type !== "fuel")
    .map((i) => ({
      uid: uid(),
      service_id: null,
      name: i.name,
      type: i.type,
      qty: i.qty,
      price: i.price,
      currency: ((i as { currency?: string }).currency === "USD" ? "USD" : "MXN") as "MXN" | "USD",
      unit_cost: i.unit_cost,
      sub_text: i.sub_text ?? null,
    }));
}

export default function NewBooking({
  onSaved,
  initialBooking = null,
  onCancel,
}: {
  onSaved: () => void;
  initialBooking?: Booking | null;
  onCancel?: () => void;
}) {
  const isEdit = !!initialBooking;
  const isMobile = useIsMobile();
  const [guest, setGuest] = useState(initialBooking?.guest ?? "");
  const [checkin, setCheckin] = useState(initialBooking?.checkin ?? "");
  const [checkout, setCheckout] = useState(initialBooking?.checkout ?? "");
  const [notes, setNotes] = useState(initialBooking?.notes ?? "");
  const [rows, setRows] = useState<Row[]>(initialBooking ? bookingToRows(initialBooking) : []);
  const [services, setServices] = useState<Service[]>([]);
  const [tipValue, setTipValue] = useState(initialBooking?.tip_value ?? 0);
  const [tipCurrency, setTipCurrency] = useState<"MXN" | "USD">(
    initialBooking?.tip_currency === "USD" ? "USD" : "MXN",
  );
  const [tipCashValue, setTipCashValue] = useState(initialBooking?.tip_cash_value ?? 0);
  const [tipCashCurrency, setTipCashCurrency] = useState<"MXN" | "USD">(
    initialBooking?.tip_cash_currency === "USD" ? "USD" : "MXN",
  );
  const [exchangeRate, setExchangeRate] = useState(initialBooking?.exchange_rate ?? 16);
  // Card fee is on by default — the concierge never has to remember it.
  const [ccFeeOn, setCcFeeOn] = useState(initialBooking ? (initialBooking.cc_fee_on ?? true) : true);
  const [cashCollected, setCashCollected] = useState(initialBooking?.cash_collected ?? 0);
  const [accommodationFare, setAccommodationFare] = useState(initialBooking?.accommodation_fare ?? 0);
  const [accommodationCurrency, setAccommodationCurrency] = useState<"MXN" | "USD">(
    initialBooking?.accommodation_currency === "USD" ? "USD" : "MXN",
  );
  // Editable fuel rate per UTV rental (one tank, auto-added when a UTV is booked).
  const [fuelPerUnit, setFuelPerUnit] = useState<number>(() => {
    const f = (initialBooking?.items ?? []).find((i) => i.type === "fuel");
    const utvLines = (initialBooking?.items ?? []).filter((i) => isUtvRental(i.name)).length;
    if (f && (f.guest_total || 0) > 0 && utvLines > 0) return Math.round((f.guest_total || 0) / utvLines);
    return UTV_GAS_PER_RENTAL;
  });
  // The auto fuel line can be removed by the concierge. When editing, a stored
  // fuel line with a zero total marks a previously-removed fuel charge.
  const [fuelRemoved, setFuelRemoved] = useState<boolean>(() => {
    const items = initialBooking?.items ?? [];
    const hasUtv = items.some((i) => isUtvRental(i.name));
    const fuel = items.find((i) => i.type === "fuel");
    return hasUtv && !!fuel && (fuel.guest_total || 0) === 0;
  });
  const [saving, setSaving] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    conciergeDb.servicesList(true).then((data) => setServices((data ?? []) as Service[]));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Service[]> = {};
    services.forEach((s) => {
      (map[s.category] ||= []).push(s);
    });
    return CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, items: map[c] }));
  }, [services]);

  const fx = Number(exchangeRate) || 16;
  // A row's price normalized to MXN (USD lines convert at the booking FX rate).
  const priceMXN = (r: Row) => (r.currency === "USD" ? r.price * fx : r.price);

  // Auto fuel: ONE fuel charge (one tank) per UTV/Polaris rental line — NOT per
  // day. Qty on a UTV line represents rental days, so we count lines, not qty.
  const utvLineCount = useMemo(
    () => rows.filter((r) => isUtvRental(r.name)).length,
    [rows],
  );
  const fuelActive = utvLineCount > 0 && !fuelRemoved;
  const fuelTotal = fuelActive ? utvLineCount * (Number(fuelPerUnit) || 0) : 0;

  // Line items in MXN (services + auto fuel) used for every total.
  const calcItems = useMemo(() => {
    const items = rows.map((r) => ({
      name: r.name,
      type: r.type,
      qty: r.qty,
      price: priceMXN(r),
      guest_total: calcGuestTotal(r.type, priceMXN(r), r.qty),
    }));
    if (fuelActive && fuelTotal > 0) {
      items.push({ name: FUEL_NAME, type: "fuel", qty: 1, price: fuelTotal, guest_total: fuelTotal });
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, fx, fuelActive, fuelTotal]);

  // Credit-card staff tip — a pre-set tip the guest pays on their card (MXN).
  const tip = useMemo(
    () => Math.round(tipCurrency === "USD" ? tipValue * fx : tipValue),
    [tipValue, tipCurrency, fx],
  );
  // Cash staff tip — reconciliation only, never part of the guest charge or profit.
  const tipCashMXN = useMemo(
    () => Math.round(tipCashCurrency === "USD" ? tipCashValue * fx : tipCashValue),
    [tipCashValue, tipCashCurrency, fx],
  );

  // Single source of truth — identical math to the guest /pay page.
  const breakdown = useMemo(
    () =>
      computeGuestPayment({
        items: calcItems,
        accommodationFare,
        accommodationCurrency,
        fx,
        tipMode: "amount",
        tipValue: tip,
      }),
    [calcItems, accommodationFare, accommodationCurrency, fx, tip],
  );

  const ccFee = ccFeeOn ? breakdown.fee : 0;
  const totalGuest = breakdown.chargeable + ccFee;
  const totalProfit = useMemo(
    () => rows.reduce((sum, r) => sum + (calcProfit(r.type, priceMXN(r), r.qty, r.unit_cost) ?? 0), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, fx],
  );

  const anyUSD = tipCurrency === "USD" || tipCashCurrency === "USD" || accommodationCurrency === "USD" || rows.some((r) => r.currency === "USD");

  const addRow = () =>
    setRows((r) => [
      ...r,
      { uid: uid(), service_id: null, name: "", type: "tour", qty: 1, price: 0, currency: "MXN", unit_cost: null },
    ]);

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((r) => r.map((x) => (x.uid === id ? { ...x, ...patch } : x)));

  const removeRow = (id: string) => setRows((r) => r.filter((x) => x.uid !== id));

  const pickService = (id: string, s: Service) =>
    updateRow(id, {
      service_id: s.id,
      name: s.name,
      type: s.type,
      price: s.type === "grocery" || s.type === "beer" ? 0 : Number(s.price),
      unit_cost: s.unit_cost === null ? null : Number(s.unit_cost),
      sub_text: s.sub_text,
      qty: 1,
    });

  const clearAll = () => {
    setGuest("");
    setCheckin("");
    setCheckout("");
    setNotes("");
    setRows([]);
    setTipValue(0);
    setTipCurrency("MXN");
    setTipCashValue(0);
    setTipCashCurrency("MXN");
    setCcFeeOn(true);
    setCashCollected(0);
    setAccommodationFare(0);
    setAccommodationCurrency("MXN");
    setFuelPerUnit(UTV_GAS_PER_RENTAL);
    setFuelRemoved(false);
  };

  const buildPayload = () => {
    const items = rows.map((r) => ({
      name: r.name,
      type: r.type,
      qty: r.qty,
      price: r.price, // value AS ENTERED (in the row's currency)
      currency: r.currency,
      unit_cost: r.unit_cost,
      guest_total: calcGuestTotal(r.type, priceMXN(r), r.qty), // always MXN
      cost: calcCost(r.type, priceMXN(r), r.qty, r.unit_cost),
      profit: calcProfit(r.type, priceMXN(r), r.qty, r.unit_cost),
      sub_text: r.sub_text ?? null,
    }));
    // Persist auto fuel as a real line so the guest /pay page shows it and
    // doesn't double-add gas (it skips when a "gas" line already exists).
    // When fuel is removed but UTVs exist, persist a zero-total fuel line so
    // the guest page recognizes the gas as intentionally removed (not re-added).
    if (fuelActive && fuelTotal > 0) {
      items.push({
        name: FUEL_NAME,
        type: "fuel",
        qty: 1,
        price: fuelTotal,
        currency: "MXN",
        unit_cost: fuelTotal,
        guest_total: fuelTotal,
        cost: fuelTotal,
        profit: 0,
        sub_text: `${utvLineCount} rental${utvLineCount > 1 ? "s" : ""} × ${formatMXN(Number(fuelPerUnit) || 0)}`,
      });
    } else if (utvLineCount > 0 && fuelRemoved) {
      items.push({
        name: FUEL_NAME,
        type: "fuel",
        qty: 1,
        price: 0,
        currency: "MXN",
        unit_cost: 0,
        guest_total: 0,
        cost: 0,
        profit: 0,
        sub_text: "Fuel removed",
      });
    }
    return {
      guest,
      checkin,
      checkout: checkout || null,
      notes: notes || null,
      items,
      cc_fee_on: ccFeeOn,
      tip_mode: "amount",
      tip_value: tipValue,
      tip_method: "cc" as const,
      tip,
      tip_currency: tipCurrency,
      tip_cash: tipCashMXN,
      tip_cash_value: tipCashValue,
      tip_cash_currency: tipCashCurrency,
      exchange_rate: fx,
      cc_fee: ccFee,
      guest_gratuity: breakdown.gratuity,
      guest_tip: tip,
      total_guest: totalGuest,
      total_profit: totalProfit,
      cash_collected: cashCollected,
      accommodation_fare: accommodationFare,
      accommodation_currency: accommodationCurrency,
    };
  };

  const save = async () => {
    if (!guest.trim()) return toast.error("Guest name is required");
    if (!checkin) return toast.error("Check-in is required");
    if (rows.length === 0) return toast.error("Add at least one service");

    setSaving(true);
    const payload = buildPayload();

    if (isEdit && initialBooking) {
      try {
        await conciergeDb.bookingsUpdate(initialBooking.id, payload);
      } catch (e) {
        setSaving(false);
        return toast.error((e as Error).message);
      }
      setSaving(false);
      toast.success("Reservation updated");
      // Same link automatically reflects the new totals.
      setSavedToken(initialBooking.pay_token ?? null);
      onSaved();
      return;
    }

    let data: { pay_token?: string } | undefined;
    try {
      data = await conciergeDb.bookingsInsert(payload);
    } catch (e) {
      setSaving(false);
      return toast.error((e as Error).message);
    }

    setSaving(false);
    toast.success("Booking saved");
    clearAll();
    setSavedToken((data?.pay_token as string) ?? null);
  };

  const payLink = savedToken ? `${window.location.origin}/pay/${savedToken}` : "";
  const copyLink = async () => {
    if (!payLink) return;
    try {
      await navigator.clipboard.writeText(payLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — select and copy manually");
    }
  };

  const regenerateLink = async () => {
    const targetId = initialBooking?.id;
    if (!targetId) return;
    if (
      !confirm(
        "Generate a brand-new link? The previous link will stop working and the guest must use the new one.",
      )
    )
      return;
    setRegenerating(true);
    const newToken = crypto.randomUUID();
    try {
      await conciergeDb.bookingsUpdate(targetId, { pay_token: newToken });
    } catch (e) {
      setRegenerating(false);
      return toast.error((e as Error).message);
    }
    setRegenerating(false);
    setSavedToken(newToken);
    toast.success("New link generated — the old one no longer works");
    onSaved();
  };

  const summaryRow: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    fontSize: 13,
  };

  return (
    <div>
      <h1 style={sectionTitle}>{isEdit ? "Edit Reservation" : "New Booking"}</h1>

      {isEdit && initialBooking?.payment_status === "paid" && (
        <div
          style={{
            background: "rgba(180,60,40,0.12)",
            border: `1px solid ${COLORS.red}`,
            color: COLORS.red,
            borderRadius: 4,
            padding: "14px 18px",
            marginTop: 18,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <strong>This reservation was already paid.</strong> Changing services or totals may cause a
          mismatch with what the guest actually paid. Edit only if you know what you're doing.
        </div>
      )}

      {savedToken && (
        <div
          style={{
            background: COLORS.dark,
            color: "#F7F4EE",
            borderRadius: 4,
            padding: isMobile ? 16 : 22,
            marginTop: 18,
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.gold, marginBottom: 6 }}>
            {isEdit ? "Reservation updated — re-send the payment link" : "Booking saved — share the payment link"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(247,244,238,0.6)", marginBottom: 14 }}>
            {isEdit
              ? "This is the same link as before — it now shows the updated invoice automatically, so just re-send it. Use “Generate new link” only if you want the old one to stop working."
              : "Send this to the guest. They'll see their experiences, the included 5% gratuity, optional tipping, and can pay by card."}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input
              readOnly
              value={payLink}
              onFocus={(e) => e.currentTarget.select()}
              style={{
                flex: "1 1 280px",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(247,244,238,0.2)",
                color: "#F7F4EE",
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                borderRadius: 2,
              }}
            />
            <button onClick={copyLink} style={btnPrimary}>
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            {isEdit && (
              <button
                onClick={regenerateLink}
                disabled={regenerating}
                style={{ ...btnGhost, color: "#F7F4EE", borderColor: "rgba(247,244,238,0.3)", opacity: regenerating ? 0.6 : 1 }}
              >
                {regenerating ? "Generating…" : "Generate new link"}
              </button>
            )}
            {isEdit ? (
              <button onClick={() => onCancel?.()} style={{ ...btnGhost, color: "#F7F4EE", borderColor: "rgba(247,244,238,0.3)" }}>
                Done
              </button>
            ) : (
              <>
                <button onClick={() => { setSavedToken(null); onSaved(); }} style={{ ...btnGhost, color: "#F7F4EE", borderColor: "rgba(247,244,238,0.3)" }}>
                  View all bookings
                </button>
                <button onClick={() => setSavedToken(null)} style={{ ...btnGhost, color: "#F7F4EE", borderColor: "rgba(247,244,238,0.3)" }}>
                  Start another
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Guest info */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 4,
          padding: isMobile ? 16 : 22,
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
          gap: isMobile ? 14 : 18,
        }}
      >
        <div style={isMobile ? { gridColumn: "1 / -1" } : undefined}>
          <label style={fieldLabel}>Guest Name</label>
          <input style={input} value={guest} onChange={(e) => setGuest(e.target.value)} />
        </div>
        <div>
          <label style={fieldLabel}>Check-in</label>
          <input style={input} type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
        </div>
        <div>
          <label style={fieldLabel}>Check-out</label>
          <input style={input} type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
        </div>
        <div style={{ gridColumn: "1 / -1", borderTop: `1px dashed ${COLORS.border}`, paddingTop: 16, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 2fr", gap: isMobile ? 12 : 18, alignItems: "end" }}>
          <div style={isMobile ? { gridColumn: "1 / -1" } : undefined}>
            <label style={fieldLabel}>Accommodation Fare (room only)</label>
            <input
              style={input}
              type="number"
              min={0}
              step="0.01"
              value={accommodationFare || ""}
              placeholder="0.00"
              onChange={(e) => setAccommodationFare(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label style={fieldLabel}>Currency</label>
            <select
              style={input}
              value={accommodationCurrency}
              onChange={(e) => setAccommodationCurrency(e.target.value as "MXN" | "USD")}
            >
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5, paddingBottom: 8, gridColumn: isMobile ? "1 / -1" : undefined }}>
            {accommodationFare > 0 ? (
              <>
                LUX 15% commission: <strong style={{ color: COLORS.amber }}>{accommodationCurrency} {(accommodationFare * 0.15).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                {" · "}Owner 85%: <strong style={{ color: COLORS.green }}>{accommodationCurrency} {(accommodationFare * 0.85).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </>
            ) : (
              <em>Room fare only (excludes cleaning, taxes, Guesty fees). LUX takes 15% management commission.</em>
            )}
          </div>
        </div>
      </div>

      {/* Services table */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 4,
          marginTop: 18,
          padding: isMobile ? 14 : 22,
        }}
      >
        {!isMobile && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: GRID_COLS,
              gap: 10,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: COLORS.textMuted,
              paddingBottom: 10,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <div>Service</div>
            <div>Qty</div>
            <div>Unit Price</div>
            <div>Our Cost</div>
            <div>Guest Total</div>
            <div>Your Profit</div>
            <div></div>
          </div>
        )}

        {rows.map((r) => (
          <ServiceLine
            key={r.uid}
            r={r}
            isMobile={isMobile}
            fx={fx}
            grouped={grouped}
            updateRow={updateRow}
            removeRow={removeRow}
            pickService={pickService}
          />
        ))}

        {/* Auto fuel line for UTV rentals — one tank per rental, removable */}
        {fuelActive &&
          (isMobile ? (
            <div
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 4,
                background: "rgba(122,92,30,0.05)",
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.textDark }}>UTV Fuel — Gas</div>
                <button
                  onClick={() => setFuelRemoved(true)}
                  style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}
                  aria-label="Remove fuel"
                >
                  ×
                </button>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, marginBottom: 10 }}>
                Auto-added · one tank per rental · {utvLineCount} rental{utvLineCount > 1 ? "s" : ""}
              </div>
              <label style={fieldLabel}>Rate per rental — one tank (MXN)</label>
              <input
                type="number"
                min={0}
                style={input}
                value={fuelPerUnit || ""}
                onChange={(e) => setFuelPerUnit(Number(e.target.value) || 0)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13, color: COLORS.textDark, fontWeight: 500 }}>
                <span>Guest Total</span>
                <span>{formatMXN(fuelTotal)}</span>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: GRID_COLS,
                gap: 10,
                padding: "12px 0",
                borderBottom: `1px solid ${COLORS.border}`,
                alignItems: "center",
                background: "rgba(122,92,30,0.05)",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.textDark }}>UTV Fuel — Gas</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  Auto-added · one tank per rental — editable rate
                </div>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>×{utvLineCount}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  type="number"
                  min={0}
                  style={{ ...input, minWidth: 0 }}
                  value={fuelPerUnit || ""}
                  onChange={(e) => setFuelPerUnit(Number(e.target.value) || 0)}
                />
                <span style={{ fontSize: 10, color: COLORS.textMuted }}>MXN / rental</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>{formatMXN(fuelTotal)}</div>
              <div style={{ fontSize: 13, color: COLORS.textDark, fontWeight: 500 }}>{formatMXN(fuelTotal)}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>—</div>
              <div style={{ paddingTop: 4 }}>
                <button
                  onClick={() => setFuelRemoved(true)}
                  style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20 }}
                  aria-label="Remove fuel"
                >
                  ×
                </button>
              </div>
            </div>
          ))}

        {/* Restore the auto fuel if it was removed but a UTV rental still exists */}
        {utvLineCount > 0 && fuelRemoved && (
          <button
            onClick={() => setFuelRemoved(false)}
            style={{
              marginTop: 4,
              background: "none",
              border: "none",
              color: COLORS.gold,
              cursor: "pointer",
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "6px 0",
            }}
          >
            + Add UTV fuel back
          </button>
        )}

        <button
          onClick={addRow}
          style={{
            marginTop: 14,
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: `1px dashed ${COLORS.border}`,
            color: COLORS.textMid,
            fontFamily: "'Jost', sans-serif",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            cursor: "pointer",
            borderRadius: 2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.gold;
            e.currentTarget.style.color = COLORS.gold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.color = COLORS.textMid;
          }}
        >
          + Add Service
        </button>
      </div>

      {/* ── Concierge inputs: tips & adjustments (no math required) ── */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 4,
          padding: isMobile ? 16 : 22,
          marginTop: 18,
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: COLORS.amber,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Tips & Adjustments
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 18 }}>
          Enter raw amounts in either currency — every total below updates automatically.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 14 : 18 }}>
          {/* Staff tip — credit card */}
          <div>
            <label style={fieldLabel}>Staff Tip — Credit Card</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min={0}
                value={tipValue || ""}
                placeholder="0"
                onChange={(e) => setTipValue(Number(e.target.value) || 0)}
                style={{ ...input, flex: 1, minWidth: 0 }}
              />
              <CurrencyToggle value={tipCurrency} onChange={setTipCurrency} />
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 5 }}>
              Added to the guest's card charge{tipCurrency === "USD" ? ` · = ${formatMXN(tip)}` : ""}
            </div>
          </div>

          {/* Staff tip — cash */}
          <div>
            <label style={fieldLabel}>Staff Tip — Cash</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min={0}
                value={tipCashValue || ""}
                placeholder="0"
                onChange={(e) => setTipCashValue(Number(e.target.value) || 0)}
                style={{ ...input, flex: 1, minWidth: 0 }}
              />
              <CurrencyToggle value={tipCashCurrency} onChange={setTipCashCurrency} />
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 5 }}>
              Paid in cash to staff — tracked separately{tipCashCurrency === "USD" ? ` · = ${formatMXN(tipCashMXN)}` : ""}
            </div>
          </div>

          {/* Exchange rate */}
          <div>
            <label style={fieldLabel}>Exchange Rate (USD → MXN)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              value={exchangeRate || ""}
              onChange={(e) => setExchangeRate(Number(e.target.value) || 0)}
              style={input}
            />
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 5 }}>
              Used to convert every USD amount {anyUSD ? "" : "(no USD values entered yet)"}
            </div>
          </div>

          {/* Paid in cash */}
          <div>
            <label style={fieldLabel}>Paid in Cash (MXN)</label>
            <input
              type="number"
              min={0}
              value={cashCollected || ""}
              placeholder="0"
              onChange={(e) => setCashCollected(Number(e.target.value) || 0)}
              style={input}
            />
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 5 }}>
              Reconciliation only — doesn't affect profit
            </div>
          </div>

          {/* Internal billing notes — concierge/owner only, never shown to guest */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={fieldLabel}>Internal Billing Notes</label>
            <textarea
              value={notes}
              placeholder="Private notes about this booking's billing (not shown to the guest)…"
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ ...input, minHeight: 72, resize: "vertical", fontFamily: "'Jost', sans-serif", lineHeight: 1.5 }}
            />
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 5 }}>
              Internal only — never appears on the guest payment page or invoice
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: COLORS.dark,
          color: "#F7F4EE",
          padding: isMobile ? 18 : 28,
          marginTop: 18,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 22,
            color: COLORS.gold,
            marginBottom: 4,
          }}
        >
          Guest Invoice
        </div>
        <div style={{ fontSize: 12, color: "rgba(247,244,238,0.5)", marginBottom: 18 }}>
          Mirrors exactly what the guest is asked to pay.
        </div>

        {/* Experiences */}
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(247,244,238,0.45)",
            marginBottom: 8,
          }}
        >
          Experiences
        </div>

        {rows.length === 0 && !fuelActive && (
          <div style={{ color: "rgba(247,244,238,0.5)", fontStyle: "italic", fontSize: 13, paddingBottom: 6 }}>
            No services added yet.
          </div>
        )}

        {rows.map((r) => {
          const gt = calcGuestTotal(r.type, priceMXN(r), r.qty);
          const p = calcProfit(r.type, priceMXN(r), r.qty, r.unit_cost);
          return (
            <div
              key={r.uid}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 13,
                borderBottom: "1px solid rgba(247,244,238,0.08)",
              }}
            >
              <div>
                {r.name || "(no service)"} <span style={{ color: "rgba(247,244,238,0.5)" }}>×{r.qty}</span>
              </div>
              <div>
                {formatMXN(gt)}{" "}
                <span style={{ color: p === null ? COLORS.goldLight : "#7DD89E", marginLeft: 6 }}>
                  ({p === null ? "TBD" : "+" + formatMXN(p)})
                </span>
              </div>
            </div>
          );
        })}

        {fuelActive && fuelTotal > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              fontSize: 13,
              borderBottom: "1px solid rgba(247,244,238,0.08)",
            }}
          >
            <div>
              UTV Fuel — Gas <span style={{ color: "rgba(247,244,238,0.5)" }}>(auto · one tank/rental)</span>
            </div>
            <div>{formatMXN(fuelTotal)}</div>
          </div>
        )}

        <div style={{ ...summaryRow, paddingTop: 12 }}>
          <div style={{ fontWeight: 500 }}>Experiences subtotal</div>
          <div style={{ fontWeight: 500 }}>{formatMXN(breakdown.upsellsSubtotal + breakdown.utvGas)}</div>
        </div>

        {/* Accommodation context — not charged here */}
        {breakdown.accommodationMXN > 0 && (
          <div style={{ ...summaryRow, color: "rgba(247,244,238,0.55)" }}>
            <div>
              Accommodation{" "}
              <span style={{ color: "rgba(247,244,238,0.4)" }}>(paid via Guesty — not charged here)</span>
            </div>
            <div>{formatMXN(breakdown.accommodationMXN)}</div>
          </div>
        )}

        {/* Charges section */}
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(247,244,238,0.45)",
            marginTop: 22,
            paddingTop: 16,
            borderTop: "1px solid rgba(247,244,238,0.15)",
            marginBottom: 4,
          }}
        >
          Charged to guest's card
        </div>

        <div style={summaryRow}>
          <div>
            Included Gratuity (5%){" "}
            <span style={{ color: "rgba(247,244,238,0.5)" }}>(accommodation + experiences + fuel)</span>
          </div>
          <div>{formatMXN(breakdown.gratuity)}</div>
        </div>

        {tip > 0 && (
          <div style={summaryRow}>
            <div>
              Staff Tip — Credit Card{" "}
              <span style={{ color: "rgba(247,244,238,0.5)" }}>(extra, on the card)</span>
            </div>
            <div>{formatMXN(tip)}</div>
          </div>
        )}

        <div style={summaryRow}>
          <div>
            5% Credit Card Fee{" "}
            <span style={{ color: "rgba(247,244,238,0.5)" }}>(on experiences + fuel + gratuity + card tip — not accommodation)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ minWidth: 100, textAlign: "right" }}>{formatMXN(ccFee)}</span>
            <button
              onClick={() => setCcFeeOn((v) => !v)}
              style={{
                background: ccFeeOn ? COLORS.red : COLORS.gold,
                color: "#fff",
                border: "none",
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderRadius: 2,
              }}
            >
              {ccFeeOn ? "Remove" : "Add"}
            </button>
          </div>
        </div>

        {/* Total guest charge */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "2px solid rgba(247,244,238,0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: COLORS.gold }}>
            Total Guest Charge
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 30,
              color: COLORS.gold,
            }}
          >
            {formatMXN(totalGuest)}
          </div>
        </div>

        {/* Reconciliation footnotes */}
        <div
          style={{
            marginTop: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            color: "#7DD89E",
          }}
        >
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em" }}>Your Total Profit</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{formatMXN(totalProfit)}</div>
        </div>

        {tipCashMXN > 0 && (
          <div
            style={{
              marginTop: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              color: "rgba(247,244,238,0.6)",
              fontSize: 12,
            }}
          >
            <div>Cash tip to staff (tracked separately)</div>
            <div>{formatMXN(tipCashMXN)}</div>
          </div>
        )}

        {cashCollected > 0 && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: "1px dashed rgba(247,244,238,0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              color: "rgba(247,244,238,0.75)",
              fontSize: 12,
            }}
          >
            <div>
              Charged on Card <span style={{ color: "rgba(247,244,238,0.45)" }}>(= total − cash)</span>
            </div>
            <div>{formatMXN(totalGuest - cashCollected)}</div>
          </div>
        )}
      </div>


      <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: isMobile ? "stretch" : "flex-end", flexDirection: isMobile ? "column-reverse" : "row" }}>
        {isEdit ? (
          <button onClick={() => onCancel?.()} style={{ ...btnGhost, padding: isMobile ? "14px 18px" : btnGhost.padding }}>
            Cancel
          </button>
        ) : (
          <button onClick={clearAll} style={{ ...btnGhost, padding: isMobile ? "14px 18px" : btnGhost.padding }}>
            Clear
          </button>
        )}
        <button onClick={save} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, padding: isMobile ? "14px 18px" : btnPrimary.padding }}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Booking"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Service Line (one row, responsive) ---------- */
function ServiceLine({
  r,
  isMobile,
  fx,
  grouped,
  updateRow,
  removeRow,
  pickService,
}: {
  r: Row;
  isMobile: boolean;
  fx: number;
  grouped: { category: string; items: Service[] }[];
  updateRow: (id: string, patch: Partial<Row>) => void;
  removeRow: (id: string) => void;
  pickService: (id: string, s: Service) => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const pMXN = r.currency === "USD" ? r.price * fx : r.price;
  const guestTotal = calcGuestTotal(r.type, pMXN, r.qty);
  const cost = calcCost(r.type, pMXN, r.qty, r.unit_cost);
  const profit = calcProfit(r.type, pMXN, r.qty, r.unit_cost);
  const qtyLess = isQtyLess(r.type);
  const pricePlaceholder =
    r.type === "grocery" || r.type === "minibar"
      ? "Total cost paid"
      : r.type === "beer"
        ? "Wholesale"
        : "0";

  const picker = (
    <ServicePicker
      row={r}
      grouped={grouped}
      onPick={(s) => pickService(r.uid, s)}
      onManual={(name, type) =>
        updateRow(r.uid, { service_id: null, name, type, price: 0, unit_cost: null })
      }
      onEditName={(name) => updateRow(r.uid, { name })}
    />
  );

  const priceField = (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <input
        type="number"
        min={0}
        style={{ ...input, minWidth: 0 }}
        value={r.price || ""}
        placeholder={pricePlaceholder}
        onChange={(e) => updateRow(r.uid, { price: Number(e.target.value) || 0 })}
      />
      <CurrencyToggle size="sm" value={r.currency} onChange={(c) => updateRow(r.uid, { currency: c })} />
    </div>
  );

  const qtyInput = (
    <input
      type="number"
      min={1}
      style={input}
      value={r.qty}
      onChange={(e) => updateRow(r.uid, { qty: Math.max(1, Number(e.target.value) || 1) })}
    />
  );

  const removeBtn = (
    <button
      onClick={() => removeRow(r.uid)}
      style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20 }}
      aria-label="Remove"
    >
      ×
    </button>
  );

  const costText = cost === null ? "—" : formatMXN(cost);
  const profitText = profit === null ? "cost TBD" : formatMXN(profit);
  const profitColor = profit === null ? COLORS.amber : COLORS.green;

  if (isMobile) {
    return (
      <div
        style={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 4,
          padding: 14,
          marginBottom: 12,
          background: COLORS.card,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>{picker}</div>
          {removeBtn}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: qtyLess ? "1fr" : "1.6fr 1fr",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div>
            <label style={fieldLabel}>Unit Price</label>
            {priceField}
          </div>
          {!qtyLess && (
            <div>
              <label style={fieldLabel}>Qty</label>
              {qtyInput}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            paddingTop: 10,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.textMuted }}>
            Guest Total
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.textDark }}>{formatMXN(guestTotal)}</span>
        </div>

        <button
          onClick={() => setShowDetail((v) => !v)}
          style={{
            marginTop: 8,
            background: "none",
            border: "none",
            color: COLORS.gold,
            cursor: "pointer",
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: 0,
          }}
        >
          {showDetail ? "▾ Hide cost & profit" : "▸ Cost & profit"}
        </button>

        {showDetail && (
          <div style={{ marginTop: 8, fontSize: 13, display: "grid", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textMid }}>
              <span>Our Cost {r.currency === "USD" ? `(@ ${fx})` : ""}</span>
              <span>{costText}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: profitColor, fontWeight: 500 }}>
              <span>Your Profit</span>
              <span style={{ fontStyle: profit === null ? "italic" : "normal" }}>{profitText}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID_COLS,
        gap: 10,
        padding: "12px 0",
        borderBottom: `1px solid ${COLORS.border}`,
        alignItems: "start",
      }}
    >
      {picker}
      {qtyLess ? (
        <div style={{ fontSize: 13, color: COLORS.textMuted, paddingTop: 10 }}>—</div>
      ) : (
        qtyInput
      )}
      {priceField}
      <div style={{ fontSize: 13, color: COLORS.textMid, paddingTop: 10 }}>
        {costText}
        {r.currency === "USD" && <div style={{ fontSize: 10, color: COLORS.textMuted }}>@ {fx}</div>}
      </div>
      <div style={{ fontSize: 13, color: COLORS.textDark, fontWeight: 500, paddingTop: 10 }}>
        {formatMXN(guestTotal)}
      </div>
      <div
        style={{
          fontSize: 13,
          color: profitColor,
          fontWeight: 500,
          fontStyle: profit === null ? "italic" : "normal",
          paddingTop: 10,
        }}
      >
        {profitText}
      </div>
      <div style={{ paddingTop: 4 }}>{removeBtn}</div>
    </div>
  );
}


/* ---------- Service Picker ---------- */
function ServicePicker({
  row,
  grouped,
  onPick,
  onManual,
  onEditName,
}: {
  row: Row;
  grouped: { category: string; items: Service[] }[];
  onPick: (s: Service) => void;
  onManual: (name: string, type: string) => void;
  onEditName: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualType, setManualType] = useState("tour");

  const filtered = grouped
    .map((g) => ({
      category: g.category,
      items: g.items.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={{ position: "relative" }}>
      <input
        style={input}
        value={row.name}
        placeholder="Choose service…"
        onChange={(e) => {
          onEditName(e.target.value);
          setQ(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {row.sub_text && (
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{row.sub_text}</div>
      )}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "#fff",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxHeight: 360,
            overflowY: "auto",
            marginTop: 4,
          }}
        >
          {!manualMode &&
            filtered.map((g) => (
              <div key={g.category}>
                <div
                  style={{
                    padding: "8px 12px",
                    background: COLORS.bg,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: COLORS.amber,
                    fontWeight: 500,
                  }}
                >
                  {g.category}
                </div>
                {g.items.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onPick(s);
                      setOpen(false);
                      setQ("");
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "10px 12px",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${COLORS.border}`,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "'Jost', sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.textDark }}>{s.name}</div>
                      {s.sub_text && (
                        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
                          {s.sub_text}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: TYPE_COLOR[s.type] ?? COLORS.textMid, marginLeft: 12 }}>
                      {s.type === "grocery"
                        ? "cost + 35%"
                        : s.type === "beer"
                          ? "$80/beer (wholesale)"
                          : formatMXN(Number(s.price))}
                    </div>
                  </button>
                ))}
              </div>
            ))}

          {!manualMode && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setManualMode(true);
              }}
              style={{
                width: "100%",
                padding: 12,
                background: COLORS.dark,
                color: COLORS.gold,
                border: "none",
                fontFamily: "'Jost', sans-serif",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}
            >
              ✏ Enter manually
            </button>
          )}

          {manualMode && (
            <div style={{ padding: 12, display: "grid", gap: 8 }}>
              <input
                style={input}
                placeholder="Service description"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <select
                style={input}
                value={manualType}
                onChange={(e) => setManualType(e.target.value)}
              >
                {MANUAL_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <button
                style={btnPrimary}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (manualName) {
                    onManual(manualName, manualType);
                    setOpen(false);
                    setManualMode(false);
                    setManualName("");
                  }
                }}
              >
                Use This
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
