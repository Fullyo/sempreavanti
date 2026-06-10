I’m sorry — you’re right. The date/month data exists, but the UI still has a fragile “current month” insertion path that can render an empty May folder even when May historical rows exist. I’ll stop treating this as a refresh issue and fix the render logic directly.

Plan:
1. Update `AllBookings.tsx` so historical May 2026 bookings are merged into the current-month card by key every time, rather than allowing a placeholder empty current-month entry to win.
2. Make month filtering use the same forced historical month key (`monthKey`) consistently for May/April edge cases.
3. Add a small defensive fallback: if the current month is May 2026 and the imported historical list contains May rows, the card cannot say “No bookings yet”.
4. Verify from the rendered booking data that May shows 7 historical bookings and April remains separate with 6 bookings.

Technical note:
- The May reservation dates are already correct in `historicalData.ts`; the likely failure is the `displayMonthSections` current-month placeholder logic in `AllBookings.tsx`, not your month/date context.