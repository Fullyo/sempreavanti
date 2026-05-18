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
  },
  {
    id: "hist-may-izquierdo",
    guest: "Jose Izquierdo",
    checkin: "2026-04-29",
    checkout: "2026-05-04",
    villa: "Villa Pietro",
    accommodationFare: 4623.85,
    upsellsBilled: 957.00,
    upsellsProfit: 403.00,
    currency: "USD",
    notes: "5 nights · Ref HMJ3K93XXY",
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
  },
];

export const APRIL_2026_BOOKINGS: HistoricalBooking[] = [];

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
  // Bucket by check-in month (matches AllBookings live grouping behaviour).
  const [y, m] = b.checkin.split("-");
  return `${y}-${m}`;
}
