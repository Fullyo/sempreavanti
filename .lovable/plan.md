

## Fix Checkout Redirect URL + Guesty Fee Clarification

### Issue 1: Redirect URL (Fixable)

The "Book Now" button currently redirects to:
`villassempreavanti.guestybookings.com/en/properties/{id}/checkout?...`

But Guesty's booking engine expects the property page URL (without `/checkout`):
`villassempreavanti.guestybookings.com/en/properties/{id}?...`

Guesty then handles the checkout flow internally from the property page.

**Fix in `src/pages/Book.tsx`:**
- Change `CHECKOUT_BASE` from `.../properties/{id}/checkout` to `.../properties/{id}`
- This will take guests directly to the property page with dates and guest count pre-filled, where they click Guesty's own "Book now" button to proceed to payment

### Issue 2: Extra Guest Fee on Guesty Checkout (NOT fixable from our side)

The totals match perfectly between our page ($6,287.16) and Guesty's checkout ($6,287.00). Guesty includes the extra guest fee inside their "Subtotal" line rather than showing it separately. This is how Guesty's hosted checkout widget works -- it consolidates accommodation + extra person fees into one subtotal.

This is a Guesty platform limitation. To get the fee displayed separately on their checkout, you would need to contact Guesty support or check if there's a setting in their booking engine configuration for itemized fee display.

### Files Modified
- `src/pages/Book.tsx` (one line change to `CHECKOUT_BASE`)

