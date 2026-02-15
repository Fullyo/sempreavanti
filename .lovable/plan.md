

## Fix: Buttons Not Showing + Footer Link

### Root Cause

The Guesty quote API returns pricing in this structure:

```text
quote.rates.ratePlans[0].ratePlan.money
  .fareAccommodation = 4796
  .fareCleaning = 0
  .subTotalPrice = 4796
  .hostPayout = 5803.16
  .totalTaxes = 1007.16
  .invoiceItems = [{title, amount}, ...]
```

But the code tries to read from:
```text
quote.money.totalPrice        --> undefined
quote.money.fareAccommodation --> undefined
```

Since `totalPrice` is always `null`, the condition `quote && totalPrice !== null` is never true, so the "Book Now" and "Ask a Question" buttons never render.

### Fix 1: Update price extraction in Book.tsx

Change the price extraction logic to read from the correct nested path:

```text
const ratePlanMoney = quote?.rates?.ratePlans?.[0]?.ratePlan?.money
const totalPrice = ratePlanMoney?.hostPayout ?? ratePlanMoney?.subTotalPrice ?? null
const accommodation = ratePlanMoney?.fareAccommodation ?? null
const cleaning = ratePlanMoney?.fareCleaning ?? null
const currency = ratePlanMoney?.currency ?? "USD"
const invoiceItems = ratePlanMoney?.invoiceItems ?? []
```

This uses `hostPayout` as the total (which includes taxes: $5,803.16) -- this is what the guest actually pays. Falls back to `subTotalPrice` if not available.

### Fix 2: Footer "Have Questions?" section

The footer currently links to `/contact`. I'll verify it's correct and not linking to an old pricing page. If the user wants this to also use the inquiry popup instead, I'll wrap it in InquiryDialog.

### Files Modified

- `src/pages/Book.tsx` -- fix price extraction from API response, ensure buttons render

