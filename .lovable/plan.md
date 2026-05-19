I’ll simplify **All Bookings** so it no longer shows April as the main visible month unless April is opened.

Plan:

1. **Remove the misleading current-month text**
   - Delete the italic sentence that says “Current month is …”.
   - Remove the helper/state only used for that text.

2. **Make All Bookings month-first**
   - Show a clean list of available months only, newest first.
   - May 2026 will appear above April 2026 because months are sorted descending.
   - Each month row will show a compact count like “3 bookings” and whether it contains historical USD or live MXN entries.

3. **Add click-to-open month sections**
   - Clicking **May 2026** opens May’s bookings and monthly summary.
   - Clicking **April 2026** opens April’s bookings and monthly summary.
   - Only the selected/opened month’s files/bookings will be visible, so the page is not filled with every month’s details at once.
   - Default open month will be the latest available month, which should be May right now.

4. **Keep existing summaries and reports inside the opened month**
   - Preserve Accommodation / Upsells / Combined totals inside the opened month.
   - Keep the May and April full report buttons inside their matching month only.
   - Keep live booking edit, invoice, owner-statement, CSV, refresh, and backup/restore functionality unchanged.

Technical notes:
- This will be implemented in `src/pages/concierge/AllBookings.tsx` only.
- The existing grouped `monthSections` data already sorts newest first; I’ll add an `openMonthKey` state and render month headers as the primary UI, with details conditionally shown for the active month.