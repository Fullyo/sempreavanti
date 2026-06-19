import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { GUEST_CARD_FEE_RATE, GUEST_GRATUITY_RATE, TIP_PRESETS } from "@/lib/calculations";

const C = {
  bg: "#F5F1E8",
  card: "#FDFBF7",
  dark: "#1C2A2E",
  gold: "#B8924A",
  ocean: "#1E4477",
  jungle: "#2D6A45",
  text: "#26221B",
  mid: "#5A5242",
  muted: "#9E9080",
  border: "#E2DAC9",
};

interface LineItem {
  name: string;
  qty: number;
  guest_total: number;
}

interface PayData {
  guest: string;
  checkin: string;
  checkout: string | null;
  accommodationMXN: number;
  accommodationCurrency: string;
  accommodationFare: number;
  fx: number;
  lineItems: LineItem[];
  upsellsSubtotal: number;
  utvGas: number;
  gratuityRate: number;
  feeRate: number;
  presetTip?: number;
  paymentStatus: string;
  amountPaid: number | null;
  paidAt: string | null;
}

function mxn(n: number) {
  return "$" + Math.round(n).toLocaleString("en-MX") + " MXN";
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function GuestPayment() {
  const { token } = useParams<{ token: string }>();
  const [params] = useSearchParams();
  const [data, setData] = useState<PayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tipMode, setTipMode] = useState<"percent" | "amount" | "none">("none");
  const [tipPct, setTipPct] = useState(0);
  const [customTip, setCustomTip] = useState(0);
  const [paying, setPaying] = useState(false);

  const status = params.get("status");

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("guest-payment-get", { body: { token } });
    setLoading(false);
    if (error || res?.error) {
      setErr(res?.error || "This payment link is invalid or has expired.");
      return;
    }
    setData(res as PayData);
    // Pre-fill the staff card tip set by the concierge (guest can increase it).
    const preset = Math.round(Number((res as PayData)?.presetTip) || 0);
    if (preset > 0) {
      setTipMode("amount");
      setCustomTip(preset);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const gratuityBase = useMemo(() => {
    if (!data) return 0;
    return data.accommodationMXN + data.upsellsSubtotal + data.utvGas;
  }, [data]);

  const gratuity = Math.round(gratuityBase * (data?.gratuityRate ?? GUEST_GRATUITY_RATE));
  const tip = useMemo(() => {
    if (tipMode === "percent") return Math.round(gratuityBase * (tipPct / 100));
    if (tipMode === "amount") return Math.round(customTip || 0);
    return 0;
  }, [tipMode, tipPct, customTip, gratuityBase]);

  const chargeable = (data?.upsellsSubtotal ?? 0) + (data?.utvGas ?? 0) + gratuity + tip;
  // Card fee applies only to the charged lines (upsells + fuel + gratuity +
  // tip). It does NOT apply to the accommodation fare — that's paid via Guesty.
  const feeBase = chargeable;
  const fee = Math.round(feeBase * (data?.feeRate ?? GUEST_CARD_FEE_RATE));
  const total = chargeable + fee;

  const pay = async () => {
    if (!token) return;
    setPaying(true);
    const { data: res, error } = await supabase.functions.invoke("guest-payment-checkout", {
      body: {
        token,
        tipMode: tipMode === "percent" ? "percent" : "amount",
        tipValue: tipMode === "percent" ? tipPct : tipMode === "amount" ? customTip : 0,
        origin: window.location.origin,
      },
    });
    if (error || res?.error || !res?.url) {
      setPaying(false);
      setErr(res?.error || "Unable to start the payment. Please try again.");
      return;
    }
    window.location.href = res.url as string;
  };

  const wrap: React.CSSProperties = {
    minHeight: "100dvh",
    background: C.bg,
    fontFamily: "'Montserrat', sans-serif",
    color: C.text,
    padding: "0 0 64px",
  };

  if (loading) {
    return (
      <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SEO title="Payment — Villas Sempre Avanti" description="Secure guest payment" path={`/pay/${token}`} noindex />
        <div style={{ color: C.muted }}>Loading…</div>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <SEO title="Payment — Villas Sempre Avanti" description="Secure guest payment" path={`/pay/${token}`} noindex />
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 34 }}>
            Link unavailable
          </h1>
          <p style={{ color: C.mid }}>{err || "This payment link is invalid."}</p>
        </div>
      </div>
    );
  }

  const isPaid = data.paymentStatus === "paid" || status === "success";

  return (
    <div style={wrap}>
      <SEO title="Payment — Villas Sempre Avanti" description="Secure guest payment" path={`/pay/${token}`} noindex />

      {/* Header */}
      <header style={{ background: C.dark, color: "#F5F1E8", padding: "40px 24px 36px", textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.26em",
            color: C.gold,
            marginBottom: 12,
          }}
        >
          Villas Sempre Avanti
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 40, margin: 0 }}>
          {isPaid ? "Thank you" : "Your stay summary"}
        </h1>
        <div style={{ marginTop: 10, color: "rgba(245,241,232,0.7)", fontSize: 14 }}>
          {data.guest} · {fmtDate(data.checkin)}
          {data.checkout ? ` – ${fmtDate(data.checkout)}` : ""}
        </div>
      </header>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>
        {isPaid ? (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: 36,
              marginTop: -20,
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 44, color: C.jungle, marginBottom: 8 }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 28, margin: "0 0 8px" }}>
              Payment received
            </h2>
            <p style={{ color: C.mid, fontSize: 14 }}>
              {data.amountPaid ? `We received ${mxn(data.amountPaid)}. ` : ""}Thank you for your generosity — it means
              the world to our team.
            </p>
          </div>
        ) : (
          <>
            {/* Summary card */}
            <section
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: 28,
                marginTop: -20,
                boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
              }}
            >
              {status === "cancel" && (
                <div
                  style={{
                    background: "#FBEFE2",
                    border: `1px solid ${C.gold}`,
                    color: C.mid,
                    borderRadius: 4,
                    padding: "10px 14px",
                    fontSize: 13,
                    marginBottom: 18,
                  }}
                >
                  Payment was not completed. You can try again below.
                </div>
              )}

              {/* Accommodation context */}
              {data.accommodationMXN > 0 && (
                <Row
                  label="Accommodation (already paid)"
                  sub={
                    data.accommodationCurrency === "USD"
                      ? `$${data.accommodationFare.toLocaleString("en-US")} USD @ ${data.fx}`
                      : "Shown for transparency"
                  }
                  value={mxn(data.accommodationMXN)}
                  faded
                />
              )}

              <div style={{ height: 1, background: C.border, margin: "14px 0" }} />
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: C.muted, marginBottom: 10 }}>
                Your experiences
              </div>

              {data.lineItems.map((i, idx) => (
                <Row key={idx} label={`${i.name}${i.qty > 1 ? ` ×${i.qty}` : ""}`} value={mxn(i.guest_total)} />
              ))}
              {data.utvGas > 0 && <Row label="UTV Gas" value={mxn(data.utvGas)} />}

              <div style={{ height: 1, background: C.border, margin: "14px 0" }} />
              <Row label="Experiences subtotal" value={mxn(data.upsellsSubtotal + data.utvGas)} bold />
            </section>

            {/* Gratuity */}
            <section
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: 28,
                marginTop: 18,
              }}
            >
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 8 }}>
                A note on gratuity
              </div>
              <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                As part of a fully serviced villa, a base <strong>5% gratuity is included</strong>. Our staff appreciates
                it deeply — it makes a real difference for the team caring for you.
              </p>
              <Row label="Included gratuity (5%)" value={mxn(gratuity)} bold />

              <div style={{ height: 1, background: C.border, margin: "18px 0 14px" }} />
              <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                If our concierge, chefs, housekeeping, property team, and valet made your stay special, you're warmly
                welcome to add to their gratuity.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TIP_PRESETS.map((p) => {
                  const active = tipMode === "percent" && tipPct === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setTipMode("percent");
                        setTipPct(p);
                      }}
                      style={tipBtn(active)}
                    >
                      {p}%
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setTipMode("amount");
                  }}
                  style={tipBtn(tipMode === "amount")}
                >
                  Custom
                </button>
              </div>

              {tipMode === "amount" && (
                <div style={{ marginTop: 12 }}>
                  <input
                    type="number"
                    min={0}
                    value={customTip || ""}
                    placeholder="Amount in MXN"
                    onChange={(e) => setCustomTip(Number(e.target.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 4,
                      fontSize: 15,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {tip > 0 && <div style={{ marginTop: 14 }}><Row label="Additional tip" value={mxn(tip)} bold /></div>}
            </section>

            {/* Total */}
            <section style={{ background: C.dark, color: "#F5F1E8", borderRadius: 6, padding: 28, marginTop: 18 }}>
              <RowDark label="Experiences" value={mxn(data.upsellsSubtotal + data.utvGas)} />
              <RowDark label="Included gratuity (5%)" value={mxn(gratuity)} />
              {tip > 0 && <RowDark label="Additional tip" value={mxn(tip)} />}
              <RowDark label="Card processing fee (5%)" value={mxn(fee)} />
              <div style={{ fontSize: 11, color: "rgba(245,241,232,0.55)", marginTop: 6, lineHeight: 1.4 }}>
                The 5% card fee does not apply to the accommodation fare — that is already paid via Guesty.
              </div>
              <div style={{ height: 1, background: "rgba(245,241,232,0.2)", margin: "14px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.14em", color: C.gold }}>
                  Total due
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300 }}>
                  {mxn(total)}
                </div>
              </div>

              <button
                onClick={pay}
                disabled={paying || total <= 0}
                style={{
                  marginTop: 22,
                  width: "100%",
                  padding: "16px",
                  background: C.gold,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontFamily: "inherit",
                  cursor: paying ? "wait" : "pointer",
                  opacity: paying || total <= 0 ? 0.6 : 1,
                }}
              >
                {paying ? "Redirecting…" : "Pay securely by card"}
              </button>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "rgba(245,241,232,0.5)" }}>
                Secure payment processed by Stripe
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function tipBtn(active: boolean): React.CSSProperties {
  return {
    flex: "1 1 auto",
    minWidth: 70,
    padding: "12px 10px",
    background: active ? C.jungle : "transparent",
    color: active ? "#fff" : C.mid,
    border: `1px solid ${active ? C.jungle : C.border}`,
    borderRadius: 4,
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "0.04em",
  };
}

function Row({
  label,
  value,
  sub,
  bold,
  faded,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  faded?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", opacity: faded ? 0.65 : 1 }}>
      <div style={{ fontSize: 14, color: C.text, fontWeight: bold ? 600 : 400 }}>
        {label}
        {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 14, fontWeight: bold ? 600 : 400, whiteSpace: "nowrap", marginLeft: 14 }}>{value}</div>
    </div>
  );
}

function RowDark({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14 }}>
      <div style={{ color: "rgba(245,241,232,0.75)" }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}
