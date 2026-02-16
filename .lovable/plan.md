

## Add Check-in and Check-out Date Pickers to the Inquiry Form

### What Changes

Replace the single free-text "Preferred Dates" field with two proper date picker fields: **Check-in Date** and **Check-out Date**. These real dates will then be sent directly to Guesty instead of the placeholder dates set 1 year in the future.

### Frontend Changes

**File: `src/components/InquiryDialog.tsx`**

1. Replace the `dates` string in form state with `checkIn` and `checkOut` (both `Date | undefined`)
2. Replace the text input with two date picker popover buttons using the existing Calendar component (already installed via react-day-picker)
3. Format selected dates for display (e.g., "Mar 15, 2026")
4. Send `checkIn` and `checkOut` as ISO date strings to the backend instead of the free-text `dates` field
5. Validate that check-out is after check-in before submitting

### Backend Changes

**File: `supabase/functions/guesty-inquiry/index.ts`**

1. Accept `checkIn` and `checkOut` fields from the request body (ISO date strings like "2026-03-15")
2. Use these actual dates for `checkInDateLocalized` and `checkOutDateLocalized` in the Guesty API call instead of the placeholder dates
3. Fall back to the current placeholder logic if dates aren't provided (backward compatibility)
4. Update the note string to show the actual selected dates

### Database

The existing `preferred_dates` text column in the `inquiries` table will store the formatted date range (e.g., "2026-03-15 to 2026-03-22") -- no schema change needed.

### Result

- Your team sees the actual requested dates on the inquiry in Guesty
- Converting an inquiry to a reservation becomes straightforward since the dates are already correct
- The calendar mini-view on the right side of the Guesty inbox will show the real dates instead of random future ones

### Technical Details

- Uses the existing `@/components/ui/calendar` (react-day-picker) and `@/components/ui/popover` components
- Date formatting via the already-installed `date-fns` library
- Minimum selectable date set to today to prevent past-date submissions
- Check-out minimum automatically set to the day after check-in

