// Pre-tool historical bookings (USD). Used to populate the All Bookings KPI strip
// and Current Month view since these months pre-date the live MXN bookings table.
// The rich printable reports still live in april2026Historical.ts / may2026Historical.ts.

export type HistoricalBooking = {
  id: string;
  guest: string;
  checkin: string;   // ISO date
  checkout: string;  // ISO date
  villa: string;
  accommodationFare: number; // USD, room fare only (basis for 15%)
  upsellsBilled: number;     // USD, total guest-paid on upsells
  upsellsProfit: number;     // USD, profit pool from upsells
  currency: "USD";
  notes?: string;
  monthKey?: string; // "YYYY-MM" — forces the folder this booking appears in (overrides check-in date)
};

export const MAY_2026_BOOKINGS: HistoricalBooking[] = [
  {
    id: "hist-may-maxim",
    guest: "Maxim",
    checkin: "2026-05-04",
    checkout: "2026-05-14",
    villa: "Casa Sempre Avanti (Pietro + Luisa)",
    accommodationFare: 12493.00,
    upsellsBilled: 6690.32,
    upsellsProfit: 3311.81,
    currency: "USD",
    notes: "10 nights · $1,300 paid in cash to owner direct",
    monthKey: "2026-05",
  },
  {
    id: "hist-may-izquierdo",
    guest: "Jose Izquierdo",
    checkin: "2026-04-29",
    checkout: "2026-05-04",
    villa: "Villa Pietro",
    accommodationFare: 3245.00,
    upsellsBilled: 957.00,
    upsellsProfit: 319.00,
    currency: "USD",
    notes: "5 nights · Ref HMJ3K93XXY",
    monthKey: "2026-05",
  },
  {
    id: "hist-may-teresa",
    guest: "Teresa",
    checkin: "2026-05-14",
    checkout: "2026-05-18",
    villa: "Villa Pietro",
    accommodationFare: 2223.00,
    upsellsBilled: 623.00,
    upsellsProfit: 326.00,
    currency: "USD",
    notes: "4 nights · 4 guests · Ref GY-GhQQwakD",
    monthKey: "2026-05",
  },
  {
    id: "hist-may-jackson",
    guest: "Christopher Jackson",
    checkin: "2026-05-20",
    checkout: "2026-05-27",
    villa: "Casa Sempre Avanti (Pietro + Luisa)",
    accommodationFare: 8743.00,
    upsellsBilled: 5198.00,
    upsellsProfit: 1842.50,
    currency: "USD",
    notes: "7 nights · 5 adults, 4 children · Invoice #58 · Ref GY-gNZkbdwv",
    monthKey: "2026-05",
  },
  {
    id: "hist-may-dominguez",
    guest: "Gustavo Dominguez",
    checkin: "2026-05-27",
    checkout: "2026-06-01",
    villa: "Villa Pietro",
    accommodationFare: 1971.05,
    upsellsBilled: 197.00,
    upsellsProfit: 0.00,
    currency: "USD",
    notes: "5 nights · 4 adults · Ref HM3KZYP9KW · Tip pass-through to staff",
    monthKey: "2026-05",
  },
  {
    id: "hist-may-garcia",
    guest: "Abril García",
    checkin: "2026-05-28",
    checkout: "2026-06-01",
    villa: "Villa Luisa",
    accommodationFare: 1426.10,
    upsellsBilled: 1760.00,
    upsellsProfit: 689.22,
    currency: "USD",
    notes: "4 nights · 7 adults, 1 child · Invoice #60 · Ref HM45CA4DB3",
    monthKey: "2026-05",
  },
];

export const APRIL_2026_BOOKINGS: HistoricalBooking[] = [
  {
    id: "hist-apr-jess",
    guest: "Jess Geevarghese",
    checkin: "2026-04-01",
    checkout: "2026-04-05",
    villa: "Casa Sempre Avanti",
    accommodationFare: 0,
    upsellsBilled: 1861.58,
    upsellsProfit: 330.00,
    currency: "USD",
    notes: "4 nights · 8 adults · Invoice #19 · GY-kcce78ZE",
  },
  {
    id: "hist-apr-orcutt",
    guest: "Michael Orcutt",
    checkin: "2026-04-06",
    checkout: "2026-04-10",
    villa: "Casa Sempre Avanti",
    accommodationFare: 0,
    upsellsBilled: 2853.65,
    upsellsProfit: 675.36,
    currency: "USD",
    notes: "4 nights · Invoice #25 · GY-pQnsRVfG",
  },
  {
    id: "hist-apr-warneke",
    guest: "Dan Warneke",
    checkin: "2026-04-10",
    checkout: "2026-04-13",
    villa: "Villa Pietro",
    accommodationFare: 0,
    upsellsBilled: 149.35,
    upsellsProfit: 37.59,
    currency: "USD",
    notes: "3 nights · Invoice #26 · HM9J4ZQERP",
  },
  {
    id: "hist-apr-strannigan",
    guest: "Scott Strannigan",
    checkin: "2026-04-13",
    checkout: "2026-04-17",
    villa: "Villa Luisa",
    accommodationFare: 0,
    upsellsBilled: 2246.00,
    upsellsProfit: 486.99,
    currency: "USD",
    notes: "4 nights · Invoice #29 · HMHNA9AMK5",
  },
  {
    id: "hist-apr-pietro",
    guest: "Erikk Pietro",
    checkin: "2026-04-17",
    checkout: "2026-04-21",
    villa: "Villa Pietro",
    accommodationFare: 0,
    upsellsBilled: 1014.55,
    upsellsProfit: 209.70,
    currency: "USD",
    notes: "4 nights · Invoice #33 · GY-afzErwEm",
  },
  {
    id: "hist-apr-sendaba",
    guest: "Alem Sendaba",
    checkin: "2026-04-18",
    checkout: "2026-04-22",
    villa: "Villa Luisa",
    accommodationFare: 0,
    upsellsBilled: 1287.50,
    upsellsProfit: 257.07,
    currency: "USD",
    notes: "4 nights · Invoice #32 · HMD9J2H534",
  },
];

export const ALL_HISTORICAL: HistoricalBooking[] = [
  ...MAY_2026_BOOKINGS,
  ...APRIL_2026_BOOKINGS,
];

export type KpiBreakdown = {
  count: number;
  accommodation: { fare: number; owner: number; lux: number };
  upsells: { billed: number; profit: number; owner: number; lux: number };
  combined: { ownerTotal: number; luxTotal: number };
};

export function computeHistoricalKpis(rows: HistoricalBooking[]): KpiBreakdown {
  const fare = rows.reduce((s, r) => s + r.accommodationFare, 0);
  const billed = rows.reduce((s, r) => s + r.upsellsBilled, 0);
  const profit = rows.reduce((s, r) => s + r.upsellsProfit, 0);
  const accomOwner = fare * 0.85;
  const accomLux = fare * 0.15;
  const upsellOwner = profit * 0.85;
  const upsellLux = profit * 0.15;
  return {
    count: rows.length,
    accommodation: { fare, owner: accomOwner, lux: accomLux },
    upsells: { billed, profit, owner: upsellOwner, lux: upsellLux },
    combined: { ownerTotal: accomOwner + upsellOwner, luxTotal: accomLux + upsellLux },
  };
}

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function historicalMonthKey(b: HistoricalBooking): string {
  // Explicit monthKey wins (e.g. a stay that checks in at the end of the prior month).
  if (b.monthKey) return b.monthKey;
  // Otherwise bucket by check-in month (matches AllBookings live grouping behaviour).
  const [y, m] = b.checkin.split("-");
  return `${y}-${m}`;
}
