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
  gratuityWaived?: boolean;
  feeRate: number;
  presetTip?: number;
  cashTipMXN?: number;
  cashTipValue?: number;
  cashTipCurrency?: string;
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
  // tipChoice: "default" = use the concierge-agreed tip as-is; "percent" /
  // "custom" = the guest is adding on top (never below the agreed floor).
  const [tipChoice, setTipChoice] = useState<"default" | "percent" | "custom">("default");
  const [tipPct, setTipPct] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);
  const [customCurrency, setCustomCurrency] = useState<"MXN" | "USD">("MXN");
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
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fx = data?.fx || 16;
  // The credit-card tip the concierge already agreed with the guest. This is
  // the floor — the guest may add to it but never go below it.
  const agreedTip = Math.round(Number(data?.presetTip) || 0);

  const gratuityBase = useMemo(() => {
    if (!data) return 0;
    return data.accommodationMXN + data.upsellsSubtotal + data.utvGas;
  }, [data]);

  const gratuityWaived = data?.gratuityWaived === true;
  const gratuity = gratuityWaived
    ? 0
    : Math.round(gratuityBase * (data?.gratuityRate ?? GUEST_GRATUITY_RATE));

  // The extra tip the guest is adding — purely on top of the agreed tip.
  const additionalTip = useMemo(() => {
    if (tipChoice === "percent") return Math.round(gratuityBase * (tipPct / 100));
    if (tipChoice === "custom")
      return Math.round(customCurrency === "USD" ? customAmount * fx : customAmount);
    return 0;
  }, [tipChoice, tipPct, customAmount, customCurrency, gratuityBase, fx]);

  // Total card tip = what the concierge agreed + whatever the guest adds.
  const tip = agreedTip + additionalTip;

  const chargeable = (data?.upsellsSubtotal ?? 0) + (data?.utvGas ?? 0) + gratuity + tip;
  // Card fee applies only to the charged lines (upsells + fuel + gratuity +
  // tip). It does NOT apply to the accommodation fare — that's paid via Guesty.
  const feeBase = chargeable;
  const fee = Math.round(feeBase * (data?.feeRate ?? GUEST_CARD_FEE_RATE));
  const total = chargeable + fee;

  const cashTipMXN = Math.round(Number(data?.cashTipMXN) || 0);

  const pay = async () => {
    if (!token) return;
    setPaying(true);
    const { data: res, error } = await supabase.functions.invoke("guest-payment-checkout", {
      body: {
        token,
        tipMode: tipChoice === "percent" ? "percent" : "amount",
        tipValue: tipChoice === "percent" ? tipPct : tipChoice === "custom" ? customAmount : 0,
        tipCurrency: tipChoice === "custom" ? customCurrency : "MXN",
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
              {gratuityWaived ? (
                <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                  No service gratuity is being requested for this stay.
                </p>
              ) : (
                <>
                  <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                    As part of a fully serviced villa, a base <strong>5% gratuity is included</strong>. Our staff
                    appreciates it deeply — it makes a real difference for the team caring for you.
                  </p>
                  <Row label="Included gratuity (5%)" value={mxn(gratuity)} bold />
                </>
              )}

              {/* Tip the concierge already agreed with the guest (the floor) */}
              {agreedTip > 0 && (
                <div style={{ marginTop: 14 }}>
                  <Row label="Tip agreed with concierge" value={mxn(agreedTip)} bold />
                </div>
              )}

              {/* Cash already left at the house — info only, not charged */}
              {cashTipMXN > 0 && (
                <div style={{ marginTop: 4 }}>
                  <Row label="Already left in cash (not charged here)" value={mxn(cashTipMXN)} faded />
                </div>
              )}

              <div style={{ height: 1, background: C.border, margin: "18px 0 14px" }} />
              <p style={{ color: C.mid, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                If our concierge, chefs, housekeeping, property team, and valet made your stay special, you're warmly
                welcome to add{agreedTip > 0 ? " to" : ""} their gratuity.
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TIP_PRESETS.map((p) => {
                  const active = tipChoice === "percent" && tipPct === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setTipChoice("percent");
                        setTipPct(p);
                      }}
                      style={tipBtn(active)}
                    >
                      {p}%
                    </button>
                  );
                })}
                <button
                  onClick={() => setTipChoice("custom")}
                  style={tipBtn(tipChoice === "custom")}
                >
                  Custom
                </button>
              </div>

              <div style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
                Calculated on accommodation + experiences ({mxn(gratuityBase)}).
                {tipChoice === "percent" && tipPct > 0 && (
                  <> {tipPct}% = {mxn(Math.round(gratuityBase * (tipPct / 100)))}.</>
                )}
              </div>

              {tipChoice === "custom" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "stretch" }}>
                  <input
                    type="number"
                    min={0}
                    value={customAmount || ""}
                    placeholder={`Amount in ${customCurrency}`}
                    onChange={(e) => setCustomAmount(Number(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: "12px 14px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 4,
                      fontSize: 15,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["MXN", "USD"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCustomCurrency(c)}
                        style={{
                          padding: "0 14px",
                          background: customCurrency === c ? C.jungle : "transparent",
                          color: customCurrency === c ? "#fff" : C.mid,
                          border: `1px solid ${customCurrency === c ? C.jungle : C.border}`,
                          borderRadius: 4,
                          fontSize: 13,
                          fontFamily: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {tipChoice === "custom" && customCurrency === "USD" && customAmount > 0 && (
                <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
                  = {mxn(customAmount * fx)} at the booking rate
                </div>
              )}

              {additionalTip > 0 && (
                <div style={{ marginTop: 14 }}>
                  <Row label="Additional tip" value={mxn(additionalTip)} bold />
                </div>
              )}
            </section>

            {/* Total */}
            <section style={{ background: C.dark, color: "#F5F1E8", borderRadius: 6, padding: 28, marginTop: 18 }}>
              <RowDark label="Experiences" value={mxn(data.upsellsSubtotal + data.utvGas)} />
              {!gratuityWaived && <RowDark label="Included gratuity (5%)" value={mxn(gratuity)} />}
              {agreedTip > 0 && <RowDark label="Tip agreed with concierge" value={mxn(agreedTip)} />}
              {additionalTip > 0 && <RowDark label="Additional tip" value={mxn(additionalTip)} />}
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
