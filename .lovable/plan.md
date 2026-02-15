

## Reliable Inquiry System with Email Confirmation

### Overview
Save every inquiry to the database first (guaranteed), then attempt to push it to Guesty as a bonus. Add a "Confirm Email" field to catch typos.

### Changes

**1. Create `inquiries` database table**

A new table to store all form submissions locally, ensuring no inquiry is ever lost regardless of Guesty API status.

Columns: id, first_name, last_name, email, phone, preferred_dates, group_size, message, selected_activities, guesty_reservation_id (nullable -- filled only if Guesty succeeds), status (default: 'new'), created_at

**2. Add "Confirm Email" field to the form (`src/components/InquiryDialog.tsx`)**

- Add a `confirmEmail` field below the existing email input
- Add client-side validation: if the two emails don't match, show an error and block submission
- This prevents typos from making guests unreachable

**3. Rewrite the edge function (`supabase/functions/guesty-inquiry/index.ts`)**

New flow:
1. Validate input (name, email required; add server-side email format check)
2. Save the inquiry to the `inquiries` table immediately -- this is the guaranteed step
3. Attempt the Guesty Booking Engine quote-to-inquiry flow, trying multiple date windows (30, 60, 90 days out)
4. If Guesty succeeds, update the database row with the Guesty reservation ID
5. Return success to the user regardless of Guesty outcome

The user always sees "Inquiry Sent" because the data is safely stored. You can view all inquiries in your backend.

**4. Make phone number required**

Change the phone input from optional to required in both the frontend form and the backend validation. This gives you a secondary way to reach guests if their email has issues.

### What this means for you
- Every inquiry is saved in your database -- you will never lose one
- If Guesty's calendar has available dates, the inquiry also appears in Guesty's inbox
- If Guesty's calendar is blocked, you still have the inquiry in your database to follow up manually
- The confirm-email field prevents the most common contact issue (email typos)
- Required phone number gives you a backup contact method

### Technical Details

Database migration:
```sql
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_dates TEXT,
  group_size TEXT,
  message TEXT,
  selected_activities TEXT[],
  guesty_reservation_id TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow the edge function (service role) to insert/update
-- No public access needed since only the edge function writes to this table
```

Frontend changes to `src/components/InquiryDialog.tsx`:
- Add `confirmEmail` to the form state
- Add a "Confirm Email" input field below the email field
- Add validation on submit: if `email !== confirmEmail`, show a toast error and prevent submission
- Change phone field to `required`

Edge function changes to `supabase/functions/guesty-inquiry/index.ts`:
- Add database insert as the first action after validation
- Wrap Guesty API calls in a try/catch so failures don't affect the user response
- Try 3 date windows for the quote (30, 60, 90 days out)
- On Guesty success, update the row with the reservation ID
- Always return success if the database insert worked

### Files modified
- `src/components/InquiryDialog.tsx` -- add confirm email field, make phone required
- `supabase/functions/guesty-inquiry/index.ts` -- rewrite with DB-first approach
- Database migration -- create `inquiries` table

