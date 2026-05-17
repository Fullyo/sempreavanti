import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  calcCCFee,
  calcCost,
  calcGuestTotal,
  calcProfit,
  calcTip,
  CATEGORY_ORDER,
  formatMXN,
  Service,
  TYPE_COLOR,
} from "@/lib/calculations";
import { COLORS, btnPrimary, btnGhost, fieldLabel, input, sectionTitle } from "./styles";

interface Row {
  uid: string;
  service_id: number | null;
  name: string;
  type: string;
  qty: number;
  price: number;
  unit_cost: number | null;
  sub_text?: string | null;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

const MANUAL_TYPES = ["tour", "tour10", "mgmt", "margin", "fixedprofit", "grocery", "minibar", "beer", "flat", "villa"];

export default function NewBooking({ onSaved }: { onSaved: () => void }) {
  const [guest, setGuest] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [tipMode, setTipMode] = useState<"amount" | "percent">("amount");
  const [tipValue, setTipValue] = useState(0);
  const [ccFeeOn, setCcFeeOn] = useState(false);
  const [cashCollected, setCashCollected] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setServices((data ?? []) as Service[]));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Service[]> = {};
    services.forEach((s) => {
      (map[s.category] ||= []).push(s);
    });
    return CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, items: map[c] }));
  }, [services]);

  const servicesSubtotal = useMemo(
    () => rows.reduce((sum, r) => sum + calcGuestTotal(r.type, r.price, r.qty), 0),
    [rows],
  );
  const tip = useMemo(() => calcTip(tipMode, tipValue, servicesSubtotal), [tipMode, tipValue, servicesSubtotal]);
  const ccFee = useMemo(() => calcCCFee(ccFeeOn, servicesSubtotal, tip), [ccFeeOn, servicesSubtotal, tip]);
  const totalGuest = servicesSubtotal + tip + ccFee;
  const totalProfit = useMemo(
    () => rows.reduce((sum, r) => sum + (calcProfit(r.type, r.price, r.qty, r.unit_cost) ?? 0), 0),
    [rows],
  );

  const addRow = () =>
    setRows((r) => [
      ...r,
      { uid: uid(), service_id: null, name: "", type: "tour", qty: 1, price: 0, unit_cost: null },
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
    setTipMode("amount");
    setTipValue(0);
    setCcFeeOn(false);
    setCashCollected(0);
  };

  const save = async () => {
    if (!guest.trim()) return toast.error("Guest name is required");
    if (!checkin) return toast.error("Check-in is required");
    if (rows.length === 0) return toast.error("Add at least one service");

    setSaving(true);
    const items = rows.map((r) => ({
      name: r.name,
      type: r.type,
      qty: r.qty,
      price: r.price,
      unit_cost: r.unit_cost,
      guest_total: calcGuestTotal(r.type, r.price, r.qty),
      cost: calcCost(r.type, r.price, r.qty, r.unit_cost),
      profit: calcProfit(r.type, r.price, r.qty, r.unit_cost),
      sub_text: r.sub_text ?? null,
    }));

    const { error } = await supabase.from("bookings").insert({
      guest,
      checkin,
      checkout: checkout || null,
      items,
      cc_fee_on: ccFeeOn,
      tip_mode: tipMode,
      tip_value: tipValue,
      tip,
      cc_fee: ccFee,
      total_guest: totalGuest,
      total_profit: totalProfit,
      cash_collected: cashCollected,
    });

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Booking saved");
    clearAll();
    onSaved();
  };

  return (
    <div>
      <h1 style={sectionTitle}>New Booking</h1>

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
            gridTemplateColumns: "minmax(220px,3fr) 70px 110px 110px 130px 130px 36px",
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
          const guestTotal = calcGuestTotal(r.type, r.price, r.qty);
          const cost = calcCost(r.type, r.price, r.qty, r.unit_cost);
          const profit = calcProfit(r.type, r.price, r.qty, r.unit_cost);
          return (
            <div
              key={r.uid}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px,3fr) 70px 110px 110px 130px 130px 36px",
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
              <input
                type="number"
                min={0}
                style={input}
                value={r.price || ""}
                placeholder={r.type === "grocery" ? "Cost paid" : r.type === "beer" ? "Wholesale" : "0"}
                onChange={(e) => updateRow(r.uid, { price: Number(e.target.value) || 0 })}
              />
              <div style={{ fontSize: 13, color: COLORS.textMid }}>{cost === null ? "—" : formatMXN(cost)}</div>
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

      {/* Summary */}
      <div
        style={{
          background: COLORS.dark,
          color: "#F7F4EE",
          padding: 28,
          marginTop: 24,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 20,
            color: COLORS.gold,
            marginBottom: 16,
          }}
        >
          Booking Summary
        </div>

        {rows.length === 0 && (
          <div style={{ color: "rgba(247,244,238,0.5)", fontStyle: "italic", fontSize: 13 }}>
            No services added yet.
          </div>
        )}

        {rows.map((r) => {
          const gt = calcGuestTotal(r.type, r.price, r.qty);
          const p = calcProfit(r.type, r.price, r.qty, r.unit_cost);
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

        {/* Tip row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
            marginTop: 14,
            borderTop: "1px solid rgba(247,244,238,0.15)",
            fontSize: 13,
          }}
        >
          <div>
            Staff Tip <span style={{ color: "rgba(247,244,238,0.5)" }}>(pass-through to staff)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => {
                setTipMode((m) => (m === "amount" ? "percent" : "amount"));
                setTipValue(0);
              }}
              style={{
                background: COLORS.gold,
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
                fontSize: 12,
                borderRadius: 2,
                minWidth: 36,
              }}
            >
              {tipMode === "amount" ? "$" : "%"}
            </button>
            <input
              type="number"
              min={0}
              value={tipValue || ""}
              onChange={(e) => setTipValue(Number(e.target.value) || 0)}
              style={{
                width: 90,
                padding: "6px 10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(247,244,238,0.2)",
                color: "#F7F4EE",
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                borderRadius: 2,
              }}
            />
            <span style={{ color: "rgba(247,244,238,0.6)", fontSize: 12, minWidth: 110 }}>
              {tipMode === "amount" ? "MXN" : `% (= ${formatMXN(tip)})`}
            </span>
          </div>
        </div>

        {/* CC fee row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 14,
            fontSize: 13,
          }}
        >
          <div>
            3% Credit Card Fee{" "}
            <span style={{ color: "rgba(247,244,238,0.5)" }}>(on total — services + tip)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ minWidth: 110, textAlign: "right" }}>{formatMXN(ccFee)}</span>
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

        {/* Cash collected row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 14,
            fontSize: 13,
          }}
        >
          <div>
            Paid in Cash{" "}
            <span style={{ color: "rgba(247,244,238,0.5)" }}>(reconciliation only — doesn't affect profit)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="number"
              min={0}
              value={cashCollected || ""}
              onChange={(e) => setCashCollected(Number(e.target.value) || 0)}
              style={{
                width: 120,
                padding: "6px 10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(247,244,238,0.2)",
                color: "#F7F4EE",
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                borderRadius: 2,
                textAlign: "right",
              }}
            />
            <span style={{ color: "rgba(247,244,238,0.6)", fontSize: 12, minWidth: 40 }}>MXN</span>
          </div>
        </div>

        {/* Totals */}
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
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: COLORS.gold,
            }}
          >
            Total Guest Charge
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 28,
              color: COLORS.gold,
            }}
          >
            {formatMXN(totalGuest)}
          </div>
        </div>
        <div
          style={{
            marginTop: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            color: "#7DD89E",
          }}
        >
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em" }}>
            Your Total Profit
          </div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{formatMXN(totalProfit)}</div>
        </div>
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
              Charged on Card{" "}
              <span style={{ color: "rgba(247,244,238,0.45)" }}>
                (= total − cash)
              </span>
            </div>
            <div>{formatMXN(totalGuest - cashCollected)}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
        <button onClick={clearAll} style={btnGhost}>
          Clear
        </button>
        <button onClick={save} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Save Booking"}
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
