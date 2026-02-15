import { useState, useCallback, useEffect } from "react";
import { format, addMonths, startOfMonth, eachDayOfInterval, endOfMonth, isBefore, isAfter, isSameDay, startOfDay, differenceInDays } from "date-fns";
import { ChevronLeft, ChevronRight, Users, Loader2, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import InquiryDialog from "@/components/InquiryDialog";
import { supabase } from "@/integrations/supabase/client";
import PropertyGallery from "@/components/book/PropertyGallery";
import PropertyOverview from "@/components/book/PropertyOverview";
import PropertyDescription from "@/components/book/PropertyDescription";
import AmenitiesGrid from "@/components/book/AmenitiesGrid";
import AvailableServices from "@/components/book/AvailableServices";
import estateHero from "@/assets/estate-1.jpeg";

const LISTING_ID = "697bcfcf3f5e990014fbc4dd";
const CHECKOUT_BASE = `https://casasempreavanti.guestybookings.com/en/properties/${LISTING_ID}/checkout`;
const MAX_GUESTS = 14;
const MIN_NIGHTS = 3;

interface CalendarDay {
  date: string;
  status: string;
  price?: number;
  minNights?: number;
}

interface QuoteData {
  rates?: { money?: { amount?: number; currency?: string } }[];
  ratePlans?: { money?: { amount?: number } }[];
  money?: {
    fareAccommodation?: number;
    fareCleaning?: number;
    totalFees?: number;
    hostPayout?: number;
    invoiceItems?: { title?: string; amount?: number }[];
    currency?: string;
    hostPayoutUsd?: number;
    subTotalPrice?: number;
    totalPrice?: number;
  };
  // Alternative shapes from BE API
  fareAccommodation?: number;
  fareCleaning?: number;
  totalPrice?: number;
  currency?: string;
  invoiceItems?: { title?: string; amount?: number }[];
}

export default function Book() {
  const today = startOfDay(new Date());
  const [baseMonth, setBaseMonth] = useState(startOfMonth(today));
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const fetchCalendar = useCallback(async (month: Date) => {
    setLoadingCalendar(true);
    try {
      const from = format(month, "yyyy-MM-dd");
      const to = format(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd");
      const { data, error } = await supabase.functions.invoke("guesty-availability", {
        body: { action: "calendar", from, to },
      });
      if (error) throw error;
      setCalendarData(Array.isArray(data) ? data : data?.days || data?.calendar || []);
    } catch (err) {
      console.error("Calendar fetch error:", err);
      setCalendarData([]);
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar(baseMonth);
  }, [baseMonth, fetchCalendar]);

  // Auto-fetch quote when dates and guests change
  useEffect(() => {
    if (checkIn && checkOut && differenceInDays(checkOut, checkIn) >= MIN_NIGHTS) {
      const timer = setTimeout(() => {
        fetchQuote();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [checkIn, checkOut, guests]);

  const blockedDates = new Set(
    calendarData
      .filter((d) => d.status === "booked" || d.status === "blocked" || d.status === "unavailable")
      .map((d) => d.date)
  );

  const isBlocked = (date: Date) => {
    return blockedDates.has(format(date, "yyyy-MM-dd")) || isBefore(date, today);
  };

  const handleDayClick = (date: Date) => {
    if (isBlocked(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      setQuote(null);
      setQuoteError(null);
    } else {
      if (isBefore(date, checkIn)) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
        // Check if any blocked dates in range
        const days = eachDayOfInterval({ start: checkIn, end: date });
        const hasBlocked = days.some((d) => isBlocked(d) && !isSameDay(d, checkIn));
        if (hasBlocked) {
          setCheckIn(date);
          setCheckOut(null);
        } else {
          setCheckOut(date);
        }
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return isAfter(date, checkIn) && isBefore(date, checkOut);
  };

  const fetchQuote = async () => {
    if (!checkIn || !checkOut) return;
    setLoadingQuote(true);
    setQuoteError(null);
    try {
      const { data, error } = await supabase.functions.invoke("guesty-availability", {
        body: {
          action: "quote",
          checkIn: format(checkIn, "yyyy-MM-dd"),
          checkOut: format(checkOut, "yyyy-MM-dd"),
          guests,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setQuote(data);
    } catch (err: unknown) {
      console.error("Quote error:", err);
      setQuoteError("Unable to get pricing for these dates. Please try different dates or contact us.");
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      minOccupancy: String(guests),
    });
    window.open(`${CHECKOUT_BASE}?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  // Extract pricing from quote (handle various API response shapes)
  const totalPrice = quote?.money?.totalPrice ?? quote?.totalPrice ?? null;
  const accommodation = quote?.money?.fareAccommodation ?? quote?.fareAccommodation ?? null;
  const cleaning = quote?.money?.fareCleaning ?? quote?.fareCleaning ?? null;
  const currency = quote?.money?.currency ?? quote?.currency ?? "USD";
  const invoiceItems = quote?.money?.invoiceItems ?? quote?.invoiceItems ?? [];

  const prevMonth = () => setBaseMonth((m) => addMonths(m, -1));
  const nextMonth = () => setBaseMonth((m) => addMonths(m, 1));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px]">
        <img src={estateHero} alt="Villas Sempre Avanti beachfront" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-sans uppercase tracking-[0.3em] text-golden mb-3"
          >
            Reserve Your Stay
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-light text-white mb-4"
          >
            Check Availability
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-white/80 max-w-md text-sm"
          >
            Select your dates to book your private beachfront retreat instantly.
          </motion.p>
        </div>
      </section>

      {/* Property Content */}
      <PropertyGallery />
      <PropertyOverview />
      <PropertyDescription />
      <AmenitiesGrid />
      <AvailableServices />

      {/* Booking Interface */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Calendar - 2 columns wide */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  disabled={isBefore(addMonths(baseMonth, -1), startOfMonth(today))}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-30"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-8">
                  <h3 className="font-serif text-xl md:text-2xl font-light">{format(baseMonth, "MMMM yyyy")}</h3>
                  <h3 className="font-serif text-xl md:text-2xl font-light hidden md:block">{format(addMonths(baseMonth, 1), "MMMM yyyy")}</h3>
                </div>
                <button
                  onClick={nextMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {loadingCalendar ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-golden" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MonthGrid
                    month={baseMonth}
                    blockedDates={blockedDates}
                    today={today}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    isInRange={isInRange}
                    onDayClick={handleDayClick}
                  />
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-light mb-4 md:hidden">{format(addMonths(baseMonth, 1), "MMMM yyyy")}</h3>
                    <MonthGrid
                      month={addMonths(baseMonth, 1)}
                      blockedDates={blockedDates}
                      today={today}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      isInRange={isInRange}
                      onDayClick={handleDayClick}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 mt-6 text-xs font-sans text-muted-foreground">
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-golden/20 border border-golden" /> Available</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-muted border border-border" /> Unavailable</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-golden" /> Selected</span>
              </div>
            </div>

            {/* Sidebar - Quote & Actions */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="font-serif text-2xl font-light mb-6">Your Stay</h3>

                {/* Guest Selector */}
                <div className="mb-6">
                  <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Guests</label>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-golden" />
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-muted text-sm"
                    >−</button>
                    <span className="font-sans text-lg w-8 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-muted text-sm"
                    >+</button>
                  </div>
                </div>

                {/* Selected Dates */}
                <div className="mb-6 space-y-3">
                  <div>
                    <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-1 block">Check-in</label>
                    <div className="flex items-center gap-2 font-sans">
                      <CalendarDays className="w-4 h-4 text-golden" />
                      <span className={checkIn ? "text-foreground" : "text-muted-foreground"}>
                        {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-1 block">Check-out</label>
                    <div className="flex items-center gap-2 font-sans">
                      <CalendarDays className="w-4 h-4 text-golden" />
                      <span className={checkOut ? "text-foreground" : "text-muted-foreground"}>
                        {checkOut ? format(checkOut, "MMM d, yyyy") : "Select date"}
                      </span>
                    </div>
                  </div>
                  {nights > 0 && (
                    <p className="text-sm font-sans text-muted-foreground">
                      {nights} night{nights !== 1 ? "s" : ""}
                      {nights < MIN_NIGHTS && <span className="text-destructive ml-1">(min {MIN_NIGHTS})</span>}
                    </p>
                  )}
                </div>

                {/* Loading state for auto-fetch */}
                {loadingQuote && (
                  <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-golden" />
                    <span className="text-sm font-sans">Fetching pricing...</span>
                  </div>
                )}

                {quoteError && (
                  <p className="text-sm font-sans text-destructive mb-4">{quoteError}</p>
                )}

                {/* Price Breakdown */}
                {quote && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-border pt-4 mb-6 space-y-2"
                  >
                    {accommodation !== null && (
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-muted-foreground">Accommodation ({nights} nights)</span>
                        <span>${accommodation.toLocaleString()}</span>
                      </div>
                    )}
                    {cleaning !== null && cleaning > 0 && (
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-muted-foreground">Cleaning Fee</span>
                        <span>${cleaning.toLocaleString()}</span>
                      </div>
                    )}
                    {invoiceItems.filter((i: { title?: string; amount?: number }) => i.title && i.amount && i.title !== "Accommodation fare" && i.title !== "Cleaning fee").map((item: { title?: string; amount?: number }, idx: number) => (
                      <div key={idx} className="flex justify-between font-sans text-sm">
                        <span className="text-muted-foreground">{item.title}</span>
                        <span>${item.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                    {totalPrice !== null && (
                      <div className="flex justify-between font-sans text-base font-semibold pt-2 border-t border-border">
                        <span>Total ({currency})</span>
                        <span className="text-golden">${totalPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Book Now + Inquiry */}
                {quote && totalPrice !== null && (
                  <div className="space-y-3">
                    <button
                      onClick={handleBookNow}
                      className="w-full py-4 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest rounded-full hover:bg-accent/90 transition-colors"
                    >
                      Book Now
                    </button>
                    <InquiryDialog>
                      <button className="w-full py-3 border border-golden text-golden font-sans text-sm uppercase tracking-widest rounded-full hover:bg-golden/10 transition-colors">
                        Ask a Question
                      </button>
                    </InquiryDialog>
                  </div>
                )}

                {!checkIn && (
                  <p className="text-sm font-sans text-muted-foreground text-center">
                    Select your check-in date on the calendar to begin.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer CTA */}
      <section className="py-16 bg-card text-center">
        <div className="container max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">Have Questions?</h2>
          <p className="font-sans text-muted-foreground mb-6">Our concierge team is happy to help you plan the perfect stay.</p>
          <a
            href="/contact"
            className="inline-block py-3 px-8 bg-foreground text-background font-sans text-sm uppercase tracking-widest rounded-full hover:bg-foreground/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </Layout>
  );
}

/* ───────── Month Grid Component ───────── */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MonthGrid({
  month,
  blockedDates,
  today,
  checkIn,
  checkOut,
  isInRange,
  onDayClick,
}: {
  month: Date;
  blockedDates: Set<string>;
  today: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  isInRange: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
}) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const startDay = start.getDay();

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-center text-[10px] font-sans uppercase tracking-wider text-muted-foreground py-1">
            {wd}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const blocked = blockedDates.has(dateStr) || isBefore(day, today);
          const isCheckIn = checkIn && isSameDay(day, checkIn);
          const isCheckOut = checkOut && isSameDay(day, checkOut);
          const inRange = isInRange(day);

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(day)}
              disabled={blocked}
              className={`
                aspect-square flex items-center justify-center text-sm font-sans rounded-lg transition-all
                ${blocked ? "text-muted-foreground/40 cursor-not-allowed bg-muted/50" : "hover:bg-golden/10 cursor-pointer"}
                ${isCheckIn || isCheckOut ? "bg-golden text-accent-foreground font-semibold" : ""}
                ${inRange ? "bg-golden/20" : ""}
                ${!blocked && !isCheckIn && !isCheckOut && !inRange ? "text-foreground" : ""}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
