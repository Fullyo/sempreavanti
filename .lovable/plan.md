

## Fix Booking Engine URL, Dynamic Min Nights, and Extra Guest Fee Display

### Issues Identified

1. **404 on checkout** -- The booking engine URL was renamed from `casasempreavanti` to `villassempreavanti`, so the "Book Now" redirect is broken.

2. **Min nights is hardcoded to 3** -- The rate plan shows min night = 4. Currently, selecting 3 nights triggers a quote API call that fails with a `minNights` restriction, but the UI just shows a generic error instead of telling the guest the minimum. Also, when selecting 2 nights, it shows "(min 3)" which is wrong.

3. **Min nights should be dynamic** -- The Guesty calendar API returns a `minNights` field per day. The code should read this from the check-in date's calendar data so it always matches whatever is set in Guesty (including overrides).

4. **Extra guest fee display** -- The current `BASE_OCCUPANCY` and `EXTRA_GUEST_FEE` constants and display logic are already in place from the last edit. These remain correct since Guesty bundles the fee inside `fareAccommodation`.

---

### Changes in `src/pages/Book.tsx`

**1. Update checkout URL**
- Change `CHECKOUT_BASE` from `casasempreavanti.guestybookings.com` to `villassempreavanti.guestybookings.com`

**2. Remove hardcoded `MIN_NIGHTS = 3` constant**
- Replace with a computed value derived from the calendar data

**3. Add dynamic min nights logic**
- Create a helper that looks up the `minNights` value from the calendar data for the selected check-in date
- Default to 4 if no calendar data is available (matching the rate plan default)
- Use this dynamic value everywhere: in the auto-quote trigger condition, in the "(min X)" warning text, and in validation

**4. Improve the 3-night error UX**
- When nights are selected but below the dynamic minimum, show a clear message like "Minimum stay is X nights from this date" instead of firing a quote request that will fail with a generic error

### Technical Details

```
- const MIN_NIGHTS = 3;
+ const DEFAULT_MIN_NIGHTS = 4;

// Derive min nights from calendar data for the check-in date
+ const getMinNights = (checkInDate: Date | null): number => {
+   if (!checkInDate) return DEFAULT_MIN_NIGHTS;
+   const dateStr = format(checkInDate, "yyyy-MM-dd");
+   const dayData = calendarData.find(d => d.date === dateStr);
+   return dayData?.minNights ?? DEFAULT_MIN_NIGHTS;
+ };
+ const minNights = getMinNights(checkIn);
```

- The auto-quote `useEffect` will use the dynamic `minNights` instead of the old constant
- The sidebar night count display will show `(min {minNights})` using the dynamic value
- Quotes will only be requested when nights >= dynamic minNights, preventing the API error

### Files Modified
- `src/pages/Book.tsx`

