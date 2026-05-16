// Concierge tool — pure calculation helpers.

export type ServiceType =
  | "tour"
  | "mgmt"
  | "margin"
  | "fixedprofit"
  | "grocery"
  | "beer"
  | "flat"
  | "villa";

export function calcGuestTotal(type: string, price: number, qty: number): number {
  if (type === "grocery") return Math.round(price * qty * 1.35);
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
  if (type === "beer") return Math.round((480 - price - 140) * qty);
  if (type === "fixedprofit") return (unitCost ?? 500) * qty;
  if (type === "mgmt") return Math.round(price * qty * 0.15);
  if (type === "margin") return (price - (unitCost ?? 0)) * qty;
  if (type === "flat") return 1000 * qty;
  if (type === "grocery") return Math.round(price * qty * 0.35);
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
  if (type === "tour") return Math.round(price * qty * 0.8);
  if (type === "mgmt") return Math.round(price * qty * 0.85);
  return null;
}

export function calcTip(tipMode: string, tipValue: number, servicesSubtotal: number): number {
  if (tipMode === "percent") return Math.round((servicesSubtotal * tipValue) / 100);
  return Math.round(tipValue);
}

export function calcCCFee(ccFeeOn: boolean, servicesSubtotal: number, tip: number): number {
  return ccFeeOn ? Math.round((servicesSubtotal + tip) * 0.03) : 0;
}

export function formatMXN(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n as number)) return "—";
  return "$" + Math.round(n as number).toLocaleString("en-MX") + " MXN";
}

export function formatUSD(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n as number)) return "—";
  return "$" + (n as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  "Villa Services",
  "Transportation",
];

export const TYPE_COLOR: Record<string, string> = {
  tour: "#2D6A45",
  mgmt: "#7A5C1E",
  margin: "#7A5C1E",
  fixedprofit: "#7A5C1E",
  grocery: "#8B2E2E",
  beer: "#8B2E2E",
  flat: "#1E4477",
  villa: "#5A5242",
};

export const TYPE_LABEL: Record<string, string> = {
  tour: "Tour 20%",
  mgmt: "Mgmt 15%",
  margin: "Margin",
  fixedprofit: "Fixed",
  grocery: "35% markup",
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
  tip_mode: string;
  tip_value: number;
  tip: number;
  cc_fee: number;
  total_guest: number;
  total_profit: number;
  saved_at: string;
  created_at: string;
}

export function commissionRule(type: string, price: number, unit_cost: number | null): string {
  switch (type) {
    case "tour":
      return `20% = ${formatMXN(price * 0.2)}`;
    case "mgmt":
      return `15% = ${formatMXN(price * 0.15)}`;
    case "margin":
      return `${formatMXN(price - (unit_cost ?? 0))} profit`;
    case "fixedprofit":
      return `${formatMXN(unit_cost ?? 500)} fixed`;
    case "grocery":
      return "35% markup on cost";
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
