

## Show Extra Guest Fee as a Separate Line Item

### Problem
Guesty includes the extra person fee ($100/night per guest beyond 12) inside the `fareAccommodation` total rather than as a separate `invoiceItem`. The pricing is correct, but guests can't see the surcharge breakdown.

### Solution
On the frontend in `src/pages/Book.tsx`, calculate and display the extra guest fee as a visible line item when guests exceed 12, subtracting it from the displayed accommodation fare so the math adds up correctly.

### Changes in `src/pages/Book.tsx`

1. Add constant: `const BASE_OCCUPANCY = 12` and `const EXTRA_GUEST_FEE = 100`
2. After extracting `accommodation` from the quote, calculate:
   - `extraGuests = Math.max(0, guests - BASE_OCCUPANCY)`
   - `extraGuestTotal = extraGuests * EXTRA_GUEST_FEE * nights`
   - `baseAccommodation = accommodation - extraGuestTotal` (the accommodation without the surcharge)
3. In the price breakdown UI:
   - Show `baseAccommodation` as "Accommodation (X nights)" when there are extra guests, otherwise show `accommodation` as before
   - Add a new line item "Extra Guest Fee (N guests x $100/night)" showing `extraGuestTotal` when `extraGuests > 0`
4. The total remains unchanged since Guesty already includes the fee -- we're just splitting the display

### Result
- 12 guests: Shows "Accommodation (4 nights) $4,796" -- no extra line
- 14 guests: Shows "Accommodation (4 nights) $4,796" + "Extra Guest Fee (2 x $100/night) $800" -- total still $6,771.16

### Files Modified
- `src/pages/Book.tsx`
