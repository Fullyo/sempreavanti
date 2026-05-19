I’ll rebuild the All Bookings tab around the actual workflow: current month first, previous months accessible as folders, and no financial calculations visible by default.

Plan:

1. **Force the default month to the real current month**
   - Use the browser date to compute the current month automatically, so on the 1st it switches to the new month without a code change.
   - If the current month exists in the data, it opens/appears first.
   - If there are no bookings for the current month, show a clean current-month empty state first, with older months below.
   - This will stop April from being the first opened month when today is May.

2. **Remove the current expanded April layout**
   - Remove the visible caret/chevron symbol the user called out: `▾`.
   - Remove auto-expanded April details from the initial page view.
   - Remove calculation/KPI blocks from the top-level month view.
   - Remove the separate bottom “Historical Reports” section that keeps April visible outside its month folder.

3. **Create a month-folder dashboard**
   - Replace the existing long stacked report layout with a folder-style month list/grid.
   - Top area will highlight **May 2026** as “Current month” because today is May 19, 2026.
   - Previous months, including **April 2026**, remain accessible as older folders.
   - Each month folder shows only simple operational info: month name, booking count, date range/source tags, and a clear “Open” action.

4. **Show files/bookings only after selecting a month**
   - Selecting May opens May’s bookings/files.
   - Selecting April opens April’s bookings/files.
   - Only the selected month’s content is shown; no other month’s calculations or booking details appear at the same time.
   - April remains accessible but never presented as the current/default month.

5. **Move financial summaries behind the selected month**
   - Inside an opened month, keep the existing accommodation/upsell/combined calculations available as a monthly summary section below the month header.
   - This preserves the calculations without showing them at the top when first landing on All Bookings.
   - Report buttons stay inside the matching month only: May report inside May, April report inside April.

6. **Technical implementation**
   - Update `src/pages/concierge/AllBookings.tsx` only.
   - Replace the current `monthSections[0]` default-open behavior with explicit current-month selection.
   - Build a `displayMonthSections` list that puts the current month first, then older months descending.
   - Keep live bookings, edit/delete/download invoice, owner statement, CSV, refresh, backup/restore behavior intact.