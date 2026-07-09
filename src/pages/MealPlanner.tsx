import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const C = {
  bg: "#F5F1E8",
  card: "#FDFBF7",
  dark: "#1C2A2E",
  gold: "#B8924A",
  jungle: "#2D6A45",
  text: "#26221B",
  mid: "#5A5242",
  muted: "#9E9080",
  border: "#E2DAC9",
  sun: "#8A6D3B",
};

interface Dish {
  id: string;
  course: string; // breakfast | appetizer | main | dessert
  name: string;
  description: string | null;
}
interface Day {
  date: string;
  sunday: boolean;
}
interface Selection {
  day: string;
  course: string;
  dish_id: string | null;
  free_text: string | null;
  skip: boolean;
}
interface PlanData {
  guest: string | null;
  listingName: string | null;
  checkin: string;
  checkout: string;
  days: Day[];
  dishes: Dish[];
  plan: { breakfast_time: string | null; lunch_time: string | null; special_requests: string | null; updated_at: string | null };
  selections: Selection[];
}

// The six meal slots per day and which dish course fills each.
const SLOTS: { course: string; label: string; from: string; optional?: boolean }[] = [
  { course: "breakfast", label: "Breakfast", from: "breakfast" },
  { course: "lunch_appetizer", label: "Lunch appetizer", from: "appetizer" },
  { course: "lunch", label: "Lunch", from: "main" },
  { course: "dinner_appetizer", label: "Dinner appetizer", from: "appetizer" },
  { course: "dinner", label: "Dinner", from: "main" },
  { course: "dessert", label: "Dessert (optional)", from: "dessert", optional: true },
];

const SKIP = "__skip__";

// Which meal slots are available on a given day of the stay.
// Arrival day: check-in is at 4:00 PM, so only dinner service is offered.
// Checkout day: checkout is at 11:00 AM, so only breakfast is offered.
// All other days get the full slate.
function slotsForDay(index: number, total: number) {
  const isArrival = index === 0;
  const isCheckout = index === total - 1;
  if (total === 1) return SLOTS; // single-day stay: offer everything
  if (isArrival) return SLOTS.filter((s) => s.course === "dinner_appetizer" || s.course === "dinner" || s.course === "dessert");
  if (isCheckout) return SLOTS.filter((s) => s.course === "breakfast");
  return SLOTS;
}

function fmtDay(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function fmtRange(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function MealPlanner() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // key: `${day}|${course}` -> dish id or SKIP or "" (unset)
  const [sel, setSel] = useState<Record<string, string>>({});
  const [special, setSpecial] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data: res, error } = await supabase.functions.invoke("meal-plan", { body: { token, op: "get" } });
    setLoading(false);
    if (error || res?.error) {
      setErr(res?.error || "This meal planner link is invalid.");
      return;
    }
    setData(res as PlanData);
    const m: Record<string, string> = {};
    for (const s of (res as PlanData).selections) {
      m[`${s.day}|${s.course}`] = s.skip ? SKIP : s.dish_id ?? "";
    }
    setSel(m);
    setSpecial(res.plan?.special_requests ?? "");
    setSavedAt(res.plan?.updated_at ?? null);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const dishesByCourse = useMemo(() => {
    const g: Record<string, Dish[]> = { breakfast: [], appetizer: [], main: [], dessert: [] };
    (data?.dishes ?? []).forEach((d) => {
      if (g[d.course]) g[d.course].push(d);
    });
    return g;
  }, [data]);

  const save = useCallback(async () => {
    if (!token || !data) return;
    setSaving(true);
    const selections = data.days
      .flatMap((d, i) =>
        d.sunday
          ? []
          : slotsForDay(i, data.days.length).map((s) => {
              const v = sel[`${d.date}|${s.course}`] ?? "";
              if (!v) return null;
              return { day: d.date, course: s.course, dish_id: v === SKIP ? null : v, skip: v === SKIP };
            }).filter(Boolean),
      );
    const { data: res, error } = await supabase.functions.invoke("meal-plan", {
      body: {
        token,
        op: "save",
        special_requests: special,
        selections,
      },
    });
    setSaving(false);
    if (error || res?.error) {
      setErr(res?.error || "Could not save. Please try again.");
      return;
    }
    setSavedAt(res.plan?.updated_at ?? new Date().toISOString());
  }, [token, data, sel, special]);

  // Debounced autosave whenever selections/fields change (after initial load).
  const firstRun = useRef(true);
  useEffect(() => {
    if (loading || !data) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = setTimeout(() => save(), 1000);
    return () => clearTimeout(t);
  }, [sel, breakfastTime, lunchTime, special, loading, data, save]);

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, display: "grid", placeItems: "center", color: C.muted, fontFamily: "'Jost',sans-serif" }}>
        <SEO title="Meal Planner" description="Plan your villa meals" path="/meals" noindex />
        Loading…
      </div>
    );
  }
  if (err || !data) {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, display: "grid", placeItems: "center", padding: 24, textAlign: "center", color: C.mid, fontFamily: "'Jost',sans-serif" }}>
        <SEO title="Meal Planner" description="Plan your villa meals" path="/meals" noindex />
        <div>{err || "Not found."}</div>
      </div>
    );
  }

  const label: React.CSSProperties = { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: C.muted, fontWeight: 600, marginBottom: 6, display: "block", fontFamily: "'Jost',sans-serif" };
  const selectStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, background: "#fff", fontFamily: "'Jost',sans-serif", fontSize: 14, color: C.text, borderRadius: 2, boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: "'Jost', sans-serif", color: C.text }}>
      <SEO title="Meal Planner — Villas Sempre Avanti" description="Plan your in-villa dining" path="/meals" noindex />

      {/* Header */}
      <div style={{ background: C.dark, color: "#F5F1E8", padding: "40px 24px 34px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: C.gold, marginBottom: 12 }}>Villas Sempre Avanti</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 40, margin: 0, lineHeight: 1.05 }}>
            {data.guest ? `${data.guest}, plan your meals` : "Plan your meals"}
          </h1>
          <p style={{ color: "rgba(245,241,232,0.72)", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
            Your stay includes two professional on-site chefs. Because everything is made from scratch, we plan selections
            in advance so it is ready for your arrival. Choose one main per meal (served family-style). The chefs handle
            all grocery shopping; food costs are additional, based on market pricing.
          </p>
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(184,146,74,0.14)", border: `1px solid ${C.gold}`, borderRadius: 4, padding: "10px 16px" }}>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: C.gold, fontWeight: 600 }}>Arrival</div>
              <div style={{ fontSize: 14, color: "#F5F1E8", marginTop: 2 }}>{fmtRange(data.checkin)}</div>
            </div>
            <div style={{ color: C.gold, fontSize: 18 }}>→</div>
            <div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: C.gold, fontWeight: 600 }}>Departure</div>
              <div style={{ fontSize: 14, color: "#F5F1E8", marginTop: 2 }}>{fmtRange(data.checkout)}</div>
            </div>
          </div>
          <p style={{ color: "rgba(245,241,232,0.6)", fontSize: 12.5, marginTop: 10, lineHeight: 1.55 }}>
            Check-in is at 4:00 PM, so your arrival day includes dinner. Checkout is at 11:00 AM, so your final day includes breakfast.
          </p>
          <a href="/menu" target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, color: C.gold, fontSize: 13, letterSpacing: "0.04em" }}>
            View the full menu →
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 80px" }}>
        {/* Times */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "20px 22px", marginBottom: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={label}>Preferred breakfast time</label>
              <input value={breakfastTime} onChange={(e) => setBreakfastTime(e.target.value)} placeholder="e.g. 9:00 AM" style={selectStyle} />
            </div>
            <div>
              <label style={label}>Preferred lunch time</label>
              <input value={lunchTime} onChange={(e) => setLunchTime(e.target.value)} placeholder="e.g. 1:30 PM" style={selectStyle} />
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: C.mid }}>
            Dinner is served at <strong>5:00 PM</strong>.
          </div>
        </div>

        {/* Day cards */}
        {data.days.map((d, i) => {
          if (d.sunday) {
            return (
              <div key={d.date} style={{ background: "#F1EAD9", border: `1px dashed ${C.sun}`, borderRadius: 6, padding: "18px 22px", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.text }}>Day {i + 1} — {fmtDay(d.date)}</div>
                <div style={{ color: C.sun, fontSize: 13, marginTop: 4, fontWeight: 600 }}>No chef service on Sundays</div>
              </div>
            );
          }
          const isArrival = i === 0 && data.days.length > 1;
          const isCheckout = i === data.days.length - 1 && data.days.length > 1;
          const tag = isArrival ? "Arrival day · dinner only" : isCheckout ? "Departure day · breakfast only" : null;
          return (
            <div key={d.date} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "20px 22px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: C.text, marginBottom: tag ? 4 : 14 }}>
                Day {i + 1} — {fmtDay(d.date)}
              </div>
              {tag && <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: C.gold, fontWeight: 600, marginBottom: 14 }}>{tag}</div>}
              <div style={{ display: "grid", gap: 14 }}>
                {slotsForDay(i, data.days.length).map((s) => {
                  const key = `${d.date}|${s.course}`;
                  const opts = dishesByCourse[s.from] ?? [];
                  return (
                    <div key={s.course}>
                      <label style={label}>{s.label}</label>
                      <select
                        value={sel[key] ?? ""}
                        onChange={(e) => setSel((p) => ({ ...p, [key]: e.target.value }))}
                        style={selectStyle}
                      >
                        <option value="">{s.optional ? "— None —" : "— Select —"}</option>
                        <option value={SKIP}>No meal this day</option>
                        {opts.map((o) => (
                          <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Special requests / dietary */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "20px 22px", marginBottom: 22 }}>
          <label style={label}>Dietary restrictions, allergies & special requests</label>
          <textarea
            value={special}
            onChange={(e) => setSpecial(e.target.value)}
            rows={5}
            placeholder="Allergies, dietary needs, off-menu requests, or anything the chefs should know…"
            style={{ ...selectStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        </div>

        {/* Save bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 12, color: C.muted }}>
            {saving ? "Saving…" : savedAt ? `Saved · updates automatically` : "Changes save automatically"}
          </div>
          <button
            onClick={save}
            disabled={saving}
            style={{ background: C.gold, color: "#fff", border: "none", padding: "12px 26px", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", borderRadius: 2, cursor: "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : "Save selections"}
          </button>
        </div>
      </div>
    </div>
  );
}
