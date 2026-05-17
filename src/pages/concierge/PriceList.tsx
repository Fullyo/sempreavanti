import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_ORDER, Service, formatMXN } from "@/lib/calculations";
import { COLORS, btnPrimary, sectionTitle } from "./styles";

const RULES: Record<string, string> = {
  tour: "20% of guest price",
  tour10: "10% of guest price",
  mgmt: "15% of guest price",
  margin: "Guest price − cost",
  fixedprofit: "Fixed profit per session",
  grocery: "35% markup on cost",
  minibar: "100% markup on cost",
  beer: "$480/pack − wholesale − $140",
  flat: "$1,000 MXN flat",
  villa: "TBD",
};

function rowDisplay(s: Service) {
  const price = Number(s.price);
  const uc = s.unit_cost === null ? null : Number(s.unit_cost);
  switch (s.type) {
    case "tour":
      return { price: formatMXN(price), cost: formatMXN(price * 0.8), profit: formatMXN(price * 0.2), italic: false };
    case "tour10":
      return { price: formatMXN(price), cost: formatMXN(price * 0.9), profit: formatMXN(price * 0.1), italic: false };
    case "mgmt":
      return { price: formatMXN(price), cost: formatMXN(price * 0.85), profit: formatMXN(price * 0.15), italic: false };
    case "margin":
      return { price: formatMXN(price), cost: formatMXN(uc ?? 0), profit: formatMXN(price - (uc ?? 0)), italic: false };
    case "fixedprofit":
      return { price: formatMXN(price), cost: formatMXN(price - (uc ?? 0)), profit: formatMXN(uc ?? 0), italic: false };
    case "grocery":
      return { price: "cost × 1.35", cost: "actual paid", profit: "35% of cost", italic: true };
    case "beer":
      return { price: "$480 /pack", cost: "wholesale + $140", profit: "$340 − wholesale", italic: true };
    case "flat":
      return { price: "$5,000 MXN", cost: "$4,000 MXN", profit: "$1,000 MXN", italic: false };
    case "villa":
      return { price: formatMXN(price), cost: "TBD", profit: "TBD", italic: true, amber: true };
  }
  return { price: "—", cost: "—", profit: "—", italic: false };
}

export default function PriceList() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("sort_order")
      .then(({ data }) => setServices((data ?? []) as Service[]));
  }, []);

  const byCat: Record<string, Service[]> = {};
  services.forEach((s) => ((byCat[s.category] ||= []).push(s)));
  const cats = [...CATEGORY_ORDER.filter((c) => byCat[c]), ...Object.keys(byCat).filter((c) => !CATEGORY_ORDER.includes(c))];

  const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <style>{`@media print { nav, header, .no-print { display: none !important; } body { background: #fff !important; } main { max-width: none !important; padding: 0 !important; } }`}</style>
      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button onClick={() => window.print()} style={btnPrimary}>Print / Save as PDF</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, margin: 0 }}>Villas Sempre Avanti</h1>
        <div style={{ color: COLORS.gold, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", marginTop: 4 }}>Master Concierge Upsell Price List</div>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>Internal Reference · All Prices in MXN · Updated {month}</div>
      </div>

      <div style={{ background: COLORS.bg, borderLeft: `4px solid ${COLORS.gold}`, padding: 18, marginBottom: 26 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 10 }}>Commission Structure</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: COLORS.textMid, lineHeight: 1.8 }}>
          <li>Tours (Sailing, Surf, MiChula, Food) → 20% of guest price</li>
          <li>Villa / Management bookings → 15% of guest price</li>
          <li>Massages → $500 MXN per session</li>
          <li>Wellness sessions → $1,000 MXN per session</li>
          <li>Spa treatments → margin (price − cost)</li>
          <li>Groceries & shopping → 35% markup on cost</li>
          <li>Beer (per 6-pack) → $480 − wholesale − $140 overhead</li>
          <li>Airport transport → $1,000 MXN flat commission</li>
        </ul>
        <div style={{ textAlign: "center", fontStyle: "italic", color: COLORS.textMuted, marginTop: 10, fontSize: 12 }}>
          All profits split 85% owner · 15% LUX
        </div>
      </div>

      {cats.map((cat) => {
        const list = byCat[cat];
        const ruleKey = list[0]?.type ?? "";
        return (
          <div key={cat} style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${COLORS.gold}`, paddingBottom: 4 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>{cat}</div>
              <div style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {RULES[ruleKey] ?? ""}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 12 }}>
              <thead>
                <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  <th style={{ textAlign: "left", padding: 6 }}>Service</th>
                  <th style={{ textAlign: "right", padding: 6 }}>Guest Price</th>
                  <th style={{ textAlign: "right", padding: 6 }}>Our Cost</th>
                  <th style={{ textAlign: "right", padding: 6 }}>Our Profit</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => {
                  const d = rowDisplay(s);
                  const color = d.amber ? COLORS.amber : COLORS.textDark;
                  return (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: 6 }}>{s.name}{s.sub_text && <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.sub_text}</div>}</td>
                      <td style={{ padding: 6, textAlign: "right", color, fontStyle: d.italic ? "italic" : "normal" }}>{d.price}</td>
                      <td style={{ padding: 6, textAlign: "right", color, fontStyle: d.italic ? "italic" : "normal" }}>{d.cost}</td>
                      <td style={{ padding: 6, textAlign: "right", color: d.amber ? COLORS.amber : COLORS.green, fontStyle: d.italic ? "italic" : "normal" }}>{d.profit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
