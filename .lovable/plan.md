

## Remove Manual Surcharge -- Let Guesty Handle It

Since Guesty is now configured with occupancy set to 14, the API will accept 14 guests and automatically include the $100/guest surcharge in the quote response. The manual frontend surcharge logic is no longer needed and is double-counting/miscalculating the fee.

### What changed in Guesty
- Occupancy is now **14** (was 12)
- Guesty automatically calculates the extra guest fee in the quote response

### Changes in `src/pages/Book.tsx`

1. **Remove** the `GUESTY_MAX_GUESTS` and `EXTRA_GUEST_FEE` constants
2. **Remove** the `extraGuests`, `extraGuestSurcharge`, and `adjustedTotal` calculations
3. **Pass the real guest count** to the API instead of capping at 12: `guests: guests` (not `Math.min(guests, GUESTY_MAX_GUESTS)`)
4. **Remove** the "Extra Guest Fee" line item from the price breakdown UI (Guesty will include it in `invoiceItems` automatically)
5. **Revert** button visibility and total display to use `totalPrice` directly instead of `adjustedTotal`

### Result
- Guesty returns the correct quote including any extra guest fees
- No manual calculation needed on the frontend
- The price breakdown will show whatever line items Guesty returns (accommodation, taxes, extra guest fees, etc.)

### Files Modified
- `src/pages/Book.tsx`

