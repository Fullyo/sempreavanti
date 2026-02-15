

## Fix Inquiry Form, Connect to Guesty API, Update Footer & Hide Pricing

### 1. Fix Pop-up Form Scrollability

The scroll bug is caused by conflicting CSS on line 84 of `InquiryDialog.tsx`: `overflow-y-auto` and `overflow-hidden` are both applied to the same `DialogContent` element. `overflow-hidden` wins and kills scrolling.

**Fix:** Use a wrapper structure where:
- The outer `DialogContent` has `overflow-hidden` and `rounded-2xl` (fixes the white corner artifacts)
- An inner scrollable `div` with `overflow-y-auto` and `max-h-[90vh]` wraps all content (header + form)

### 2. Connect Form to Guesty Inquiry API

Create a new edge function `guesty-inquiry` that submits inquiries to Guesty's Open API:

- **Endpoint:** `POST https://open-api.guesty.com/v1/reservations`
- **Payload:** `status: "inquiry"`, `listingId`, guest details (name, email, phone), dates, notes (group size, activities, message)
- Reuses the existing OAuth token flow from `guesty-listings` (same `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` secrets)
- Note: The Open API scope may differ from the Booking Engine scope. The edge function will attempt the Open API first, then fall back to the Booking Engine inquiry endpoint if needed.

The `InquiryDialog` component will call this edge function on form submit via `supabase.functions.invoke('guesty-inquiry', { body: formData })`.

### 3. Footer "Get in Touch" -> Inquiry Dialog

The footer currently uses a `<Link to="/contact">` for "Get in Touch" (line 46 of `Footer.tsx`). This will be replaced with an `InquiryDialog`-wrapped button that triggers the pop-up form, matching the same pattern used in the Navbar.

### 4. Hide Pricing Page from Navigation

- The `/pricing` route in `App.tsx` currently redirects to `/contact`. This redirect will be removed and replaced with a direct route to the `Pricing` component so the URL still works.
- The `/pricing` route will render the `Pricing` page component directly (no redirect), but it won't be linked from any navigation, footer, or other visible UI element.
- The `/contact` route will also remain functional, rendering the `Contact` page.

---

### Technical Details

**Files to create:**
- `supabase/functions/guesty-inquiry/index.ts` -- new edge function that authenticates with Guesty OAuth and POSTs an inquiry reservation

**Files to modify:**
- `src/components/InquiryDialog.tsx` -- fix scroll (restructure overflow), wire up `supabase.functions.invoke('guesty-inquiry')` on submit
- `src/components/layout/Footer.tsx` -- replace "Get in Touch" `<Link>` with `<InquiryDialog>` trigger
- `src/App.tsx` -- change `/pricing` from redirect to direct render of `Pricing` component; import `Pricing`

