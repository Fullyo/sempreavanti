// Concierge tool — pure calculation helpers.

export type ServiceType =
  | "tour"
  | "mgmt"
  | "utv"
  | "margin"
  | "fixedprofit"
  | "grocery"
  | "beer"
  | "flat"
  | "villa";

export function calcGuestTotal(type: string, price: number, qty: number): number {
  if (type === "grocery") return Math.round(price * qty * 1.35);
  if (type === "minibar") return Math.round(price * qty * 2);
  if (type === "beer") return 480 * qty;
  return price * qty;
}

export function calcProfit(
  type: string,
  price: number,
  qty: number,
  unitCost: number | null,
): number | null {
  if (type === "tour") return Math.round(price * qty * 0.2);
  if (type === "tour10") return Math.round(price * qty * 0.1);
  if (type === "beer") return Math.round((480 - price - 140) * qty);
  if (type === "fixedprofit") return (unitCost ?? 500) * qty;
  if (type === "mgmt") return Math.round(price * qty * 0.15);
  // Owner-owned UTV: the full fare is profit that splits 85% owner / 15% LUX.
  // Maintenance/insurance is handled as a flat $100/month LUX contribution at the
  // month level (see AllBookings), NOT a per-booking carve-out.
  if (type === "utv") return Math.round(price * qty);
  if (type === "margin") return (price - (unitCost ?? 0)) * qty;
  if (type === "flat") return 1000 * qty;
  if (type === "grocery") return Math.round(price * qty * 0.35);
  if (type === "minibar") return Math.round(price * qty);
  if (type === "fuel") return 0; // UTV fuel is a pass-through cost — no profit
  return null; // villa = TBD
}

export function calcCost(
  type: string,
  price: number,
  qty: number,
  unitCost: number | null,
): number | null {
  if (type === "margin") return (unitCost ?? 0) * qty;
  if (type === "beer") return (price + 140) * qty;
  if (type === "flat") return 4000 * qty;
  if (type === "grocery") return price * qty;
  if (type === "minibar") return price * qty;
  if (type === "tour") return Math.round(price * qty * 0.8);
  if (type === "tour10") return Math.round(price * qty * 0.9);
  if (type === "mgmt") return Math.round(price * qty * 0.85);
  if (type === "utv") return 0; // no per-booking cost — maintenance is a flat $100/month line
  if (type === "fuel") return price * qty; // fuel cost = what we pay for gas
  return null;
}

export function calcTip(tipMode: string, tipValue: number, servicesSubtotal: number): number {
  if (tipMode === "percent") return Math.round((servicesSubtotal * tipValue) / 100);
  return Math.round(tipValue);
}

export function calcCCFee(ccFeeOn: boolean, servicesSubtotal: number, tip: number): number {
  return ccFeeOn ? Math.round((servicesSubtotal + tip) * 0.05) : 0;
}

export function formatMXN(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n as number)) return "—";
  return "$" + Math.round(n as number).toLocaleString("en-MX") + " MXN";
}

export function formatUSD(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n as number)) return "—";
  return "$" + (n as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Concierge petty cash: what we actually paid out of pocket on a live booking's
// upsells (sum of each item's cost). Tips and CC fees are pass-through and excluded.
export function bookingUpsellCost(items: { cost: number | null }[]): number {
  return items.reduce((s, i) => s + (i.cost ?? 0), 0);
}

export const OWNER_SHARE = 0.85;
export const LUX_SHARE = 0.15;

export const CATEGORY_ORDER = [
  "Sailing & Boats",
  "Surf — Victor",
  "MiChula Tours",
  "UTV Rentals",
  "Wellness",
  "Massages",
  "Spa Treatments",
  "Food & Culinary",
  "Groceries & Drinks",
  "Mini Bar",
  "Villa Services",
  "Transportation",
];

export const TYPE_COLOR: Record<string, string> = {
  tour: "#2D6A45",
  tour10: "#2D6A45",
  mgmt: "#7A5C1E",
  utv: "#7A5C1E",
  margin: "#7A5C1E",
  fixedprofit: "#7A5C1E",
  grocery: "#8B2E2E",
  minibar: "#8B2E2E",
  beer: "#8B2E2E",
  flat: "#1E4477",
  villa: "#5A5242",
};

export const TYPE_LABEL: Record<string, string> = {
  tour: "Tour 20%",
  tour10: "Tour 10%",
  mgmt: "Mgmt 15%",
  utv: "UTV profit",
  margin: "Margin",
  fixedprofit: "Fixed",
  grocery: "35% markup",
  minibar: "100% markup",
  beer: "Beer",
  flat: "Flat fee",
  villa: "Villa TBD",
};

export interface Service {
  id: number;
  category: string;
  name: string;
  price: number;
  type: string;
  unit_cost: number | null;
  sub_text: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface BookingItem {
  name: string;
  type: string;
  qty: number;
  price: number;
  unit_cost: number | null;
  guest_total: number;
  cost: number | null;
  profit: number | null;
  sub_text?: string | null;
}

export interface Booking {
  id: number;
  guest: string;
  checkin: string;
  checkout: string | null;
  items: BookingItem[];
  cc_fee_on: boolean;
  gratuity_waived?: boolean;
  tip_mode: string;
  tip_value: number;
  tip_method?: "cc" | "cash";
  tip: number;
  tip_currency?: string;
  tip_cash?: number;
  tip_cash_value?: number;
  tip_cash_currency?: string;
  cc_fee: number;
  total_guest: number;
  total_profit: number;
  cash_collected?: number;
  accommodation_fare?: number;
  accommodation_currency?: string;
  pay_token?: string;
  payment_status?: string;
  notes?: string | null;
  exchange_rate?: number;
  guest_gratuity?: number | null;
  guest_tip?: number | null;
  amount_paid?: number | null;
  paid_at?: string | null;
  stripe_session_id?: string | null;
  saved_at: string;
  created_at: string;
  guesty_id?: string | null;
  meal_token?: string | null;
  listing_name?: string | null;
  nights?: number | null;
  res_status?: string | null;
  source?: string | null;
  guesty_fare?: number | null;
}

export function commissionRule(type: string, price: number, unit_cost: number | null): string {
  switch (type) {
    case "tour":
      return `20% = ${formatMXN(price * 0.2)}`;
    case "tour10":
      return `10% = ${formatMXN(price * 0.1)}`;
    case "mgmt":
      return `15% = ${formatMXN(price * 0.15)}`;
    case "utv":
      return `100% profit · 85% owner / 15% LUX = ${formatMXN(price)}`;
    case "margin":
      return `${formatMXN(price - (unit_cost ?? 0))} profit`;
    case "fixedprofit":
      return `${formatMXN(unit_cost ?? 500)} fixed`;
    case "grocery":
      return "35% markup on cost";
    case "minibar":
      return "100% markup on cost";
    case "beer":
      return `${formatMXN(480 - (unit_cost ?? 0) - 140)} est.`;
    case "flat":
      return "$1,000 MXN flat";
    case "villa":
      return "TBD";
    default:
      return "—";
  }
}

// ─── Guest payment (Stripe) ──────────────────────────────────────────────
// Everything below is charged to the guest in MXN. Accommodation is NOT
// charged (paid via Guesty) — it is shown for context and is part of the
// tip base. USD accommodation converts to MXN at the booking's FX rate.

// The tip is no longer mandatory. On the guest link it defaults to 5% (the
// guest can change it or remove it entirely). This is the default preset.
export const GUEST_DEFAULT_TIP_RATE = 0.05;
export const GUEST_GRATUITY_RATE = GUEST_DEFAULT_TIP_RATE; // legacy alias
export const GUEST_CARD_FEE_RATE = 0.05; // card processing fee, guest pays
export const UTV_GAS_PER_RENTAL = 1000; // MXN gas auto-added per UTV rental
export const DEFAULT_FX = 16;

export const TIP_PRESETS = [5, 10, 15, 20];

// A UTV rental line (Can-Am / Polaris / generic UTV) — but not a gas line.
export function isUtvRental(name: string): boolean {
  const n = (name || "").toLowerCase();
  if (n.includes("gas")) return false;
  return n.includes("can-am") || n.includes("maverick") || n.includes("polaris") || n.includes("utv");
}

export interface GuestPayItem {
  name: string;
  type: string;
  qty: number;
  price: number;
  guest_total?: number | null;
}

export function computeUtvGas(items: GuestPayItem[]): number {
  // Only auto-add gas when the booking doesn't already include a gas line.
  const hasGasLine = items.some((i) => (i.name || "").toLowerCase().includes("gas"));
  if (hasGasLine) return 0;
  // One tank (one fuel charge) per UTV rental line — NOT per day/qty.
  const lines = items.filter((i) => isUtvRental(i.name)).length;
  return lines * UTV_GAS_PER_RENTAL;
}

export interface GuestPaymentBreakdown {
  upsellsSubtotal: number; // upsell line items only (MXN)
  utvGas: number; // auto gas (MXN)
  accommodationMXN: number; // context + tip base (MXN)
  tipBase: number; // accommodation + upsells + gas
  gratuityBase: number; // legacy alias of tipBase
  tip: number; // guest-selected tip (0 if opted out)
  feeBase: number; // upsells + gas + tip
  fee: number; // 5% card fee on feeBase
  chargeable: number; // upsells + gas + tip (pre-fee, accommodation excluded)
  total: number; // grand total charged in MXN
}

export function computeGuestPayment(params: {
  items: GuestPayItem[];
  accommodationFare: number;
  accommodationCurrency: string;
  fx?: number;
  tipMode: "percent" | "amount";
  tipValue: number;
}): GuestPaymentBreakdown {
  const fx = params.fx || DEFAULT_FX;
  const upsellsSubtotal = params.items.reduce(
    (s, i) => s + Number(i.guest_total ?? calcGuestTotal(i.type, i.price, i.qty)),
    0,
  );
  const utvGas = computeUtvGas(params.items);
  const accommodationMXN =
    params.accommodationCurrency === "USD" ? params.accommodationFare * fx : params.accommodationFare;
  const tipBase = accommodationMXN + upsellsSubtotal + utvGas;
  // Tip is entirely the guest's choice — no mandatory floor.
  const tip =
    params.tipMode === "percent"
      ? Math.round(tipBase * ((Number(params.tipValue) || 0) / 100))
      : Math.round(Number(params.tipValue) || 0);
  const chargeable = upsellsSubtotal + utvGas + tip;
  // Card fee applies ONLY to what's charged on the card (upsells + fuel +
  // tip). It does NOT apply to the accommodation fare — that is paid out
  // via Guesty, not on the card.
  const feeBase = chargeable;
  const fee = Math.round(feeBase * GUEST_CARD_FEE_RATE);
  const total = chargeable + fee;
  return {
    upsellsSubtotal,
    utvGas,
    accommodationMXN,
    tipBase,
    gratuityBase: tipBase,
    tip,
    feeBase,
    fee,
    chargeable,
    total,
  };
}
