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
  const [guest, setGuest] = useState(initialBooking?.guest ?? "");
  const [checkin, setCheckin] = useState(initialBooking?.checkin ?? "");
  const [checkout, setCheckout] = useState(initialBooking?.checkout ?? "");
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
  // Editable fuel rate per UTV unit (auto-added when a UTV/Polaris is booked).
  const [fuelPerUnit, setFuelPerUnit] = useState<number>(() => {
    const f = (initialBooking?.items ?? []).find((i) => i.type === "fuel");
    const utvUnits = (initialBooking?.items ?? [])
      .filter((i) => isUtvRental(i.name))
      .reduce((s, i) => s + (Number(i.qty) || 0), 0);
    if (f && utvUnits > 0) return Math.round((f.guest_total || 0) / utvUnits);
    return UTV_GAS_PER_RENTAL;
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

  // Auto fuel: one fuel charge per UTV/Polaris unit booked.
  const utvUnits = useMemo(
    () => rows.filter((r) => isUtvRental(r.name)).reduce((s, r) => s + (Number(r.qty) || 0), 0),
    [rows],
  );
  const fuelTotal = utvUnits * (Number(fuelPerUnit) || 0);

  // Line items in MXN (services + auto fuel) used for every total.
  const calcItems = useMemo(() => {
    const items = rows.map((r) => ({
      name: r.name,
      type: r.type,
      qty: r.qty,
      price: priceMXN(r),
      guest_total: calcGuestTotal(r.type, priceMXN(r), r.qty),
    }));
    if (utvUnits > 0 && fuelTotal > 0) {
      items.push({ name: FUEL_NAME, type: "fuel", qty: 1, price: fuelTotal, guest_total: fuelTotal });
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, fx, utvUnits, fuelTotal]);

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
    if (utvUnits > 0 && fuelTotal > 0) {
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
        sub_text: `${utvUnits} unit${utvUnits > 1 ? "s" : ""} × ${formatMXN(Number(fuelPerUnit) || 0)}`,
      });
    }
    return {
      guest,
      checkin,
      checkout: checkout || null,
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
            padding: 22,
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
          padding: 22,
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 18,
        }}
      >
        <div>
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
        <div style={{ gridColumn: "1 / -1", borderTop: `1px dashed ${COLORS.border}`, paddingTop: 16, display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: 18, alignItems: "end" }}>
          <div>
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
          <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5, paddingBottom: 8 }}>
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
          padding: 22,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(200px,3fr) 60px 140px 110px 120px 120px 32px",
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

        {rows.map((r) => {
          const pMXN = priceMXN(r);
          const guestTotal = calcGuestTotal(r.type, pMXN, r.qty);
          const cost = calcCost(r.type, pMXN, r.qty, r.unit_cost);
          const profit = calcProfit(r.type, pMXN, r.qty, r.unit_cost);
          return (
            <div
              key={r.uid}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(200px,3fr) 60px 140px 110px 120px 120px 32px",
                gap: 10,
                padding: "12px 0",
                borderBottom: `1px solid ${COLORS.border}`,
                alignItems: "center",
              }}
            >
              <ServicePicker
                row={r}
                grouped={grouped}
                onPick={(s) => pickService(r.uid, s)}
                onManual={(name, type) =>
                  updateRow(r.uid, { service_id: null, name, type, price: 0, unit_cost: null })
                }
                onEditName={(name) => updateRow(r.uid, { name })}
              />
              <input
                type="number"
                min={1}
                style={input}
                value={r.qty}
                onChange={(e) => updateRow(r.uid, { qty: Math.max(1, Number(e.target.value) || 1) })}
              />
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input
                  type="number"
                  min={0}
                  style={{ ...input, flex: 1, minWidth: 0 }}
                  value={r.price || ""}
                  placeholder={r.type === "grocery" ? "Cost paid" : r.type === "beer" ? "Wholesale" : "0"}
                  onChange={(e) => updateRow(r.uid, { price: Number(e.target.value) || 0 })}
                />
                <CurrencyToggle
                  size="sm"
                  value={r.currency}
                  onChange={(c) => updateRow(r.uid, { currency: c })}
                />
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>
                {cost === null ? "—" : formatMXN(cost)}
                {r.currency === "USD" && (
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>@ {fx}</div>
                )}
              </div>
              <div style={{ fontSize: 13, color: COLORS.textDark, fontWeight: 500 }}>{formatMXN(guestTotal)}</div>
              <div
                style={{
                  fontSize: 13,
                  color: profit === null ? COLORS.amber : COLORS.green,
                  fontWeight: 500,
                  fontStyle: profit === null ? "italic" : "normal",
                }}
              >
                {profit === null ? "cost TBD" : formatMXN(profit)}
              </div>
              <button
                onClick={() => removeRow(r.uid)}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.textMuted,
                  cursor: "pointer",
                  fontSize: 18,
                }}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          );
        })}

        {/* Auto fuel line for UTV rentals */}
        {utvUnits > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(200px,3fr) 60px 140px 110px 120px 120px 32px",
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
                Auto-added · {utvUnits} unit{utvUnits > 1 ? "s" : ""} — editable rate per unit
              </div>
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMid }}>×{utvUnits}</div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <input
                type="number"
                min={0}
                style={{ ...input, flex: 1, minWidth: 0 }}
                value={fuelPerUnit || ""}
                onChange={(e) => setFuelPerUnit(Number(e.target.value) || 0)}
              />
              <span style={{ fontSize: 10, color: COLORS.textMuted }}>MXN/unit</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMid }}>{formatMXN(fuelTotal)}</div>
            <div style={{ fontSize: 13, color: COLORS.textDark, fontWeight: 500 }}>{formatMXN(fuelTotal)}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>—</div>
            <div />
          </div>
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
          padding: 22,
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
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
        </div>
      </div>

      {/* ── Guest invoice: the exact charge the guest sees on /pay ── */}
      <div
        style={{
          background: COLORS.dark,
          color: "#F7F4EE",
          padding: 28,
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

        {rows.length === 0 && utvUnits === 0 && (
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

        {utvUnits > 0 && fuelTotal > 0 && (
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
              UTV Fuel — Gas <span style={{ color: "rgba(247,244,238,0.5)" }}>(auto · {utvUnits}×)</span>
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


      <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
        {isEdit ? (
          <button onClick={() => onCancel?.()} style={btnGhost}>
            Cancel
          </button>
        ) : (
          <button onClick={clearAll} style={btnGhost}>
            Clear
          </button>
        )}
        <button onClick={save} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Booking"}
        </button>
      </div>
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
