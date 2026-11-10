import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Phone, Handshake, UserRound,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import {
  adjacentMonth,
  calendarDays,
  dateLabel,
  easternDate,
  timeLabel,
  type Availability,
} from "@/lib/custom-booking";
import { contactPhone, contactPhoneHref } from "@/lib/contact";
import { bookingAttribution, trackBookingEvent } from '@/lib/booking-attribution';
import { bookingConsentDisclosure, bookingConsentVersion } from '@/lib/booking-consent';

const fieldClass =
  "mt-1.5 block w-full rounded-[6px] border border-[#d0d3d7] bg-white px-3 py-2 text-[16px] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted/40";
const today = easternDate();
function Step({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <h3 className="mb-5 flex items-center gap-3 font-serif text-xl">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c6ac71] to-[#947b43] font-serif text-xl text-white">
        {number}.
      </span>
      {children}
    </h3>
  );
}
export default function BookingCalendar() {
  const [step,setStep] = useState(1);
  const [savedDetails,setSavedDetails] = useState<{firstName:string;lastName:string;phone:string;email:string;reason:string;smsConsent:{service:boolean;marketing:boolean;version:string};attribution:ReturnType<typeof bookingAttribution>} | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{if(step===2)stageRef.current?.focus();},[step]);
  const inquiryRequest = useRef<string | null>(null);
  const [month, setMonth] = useState(today.slice(0, 7)),
    [availability, setAvailability] = useState<Availability | null>(null);
  const [day, setDay] = useState(""),
    [slot, setSlot] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [refresh, setRefresh] = useState(0);
  const [submitting, setSubmitting] = useState(false),
    [pending, setPending] = useState(false),
    [booked, setBooked] = useState<{ start: string; email: string } | null>(
      null,
    );
  const began = useRef(Date.now()),
    attempt = useRef<{ key: string; id: string } | null>(null),
    successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(step!==2)return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setAvailability(null);
    fetch(`/api/booking?month=${month}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const value = await response.json();
        if (!response.ok)
          throw new Error(
            value.error || "Available times could not be loaded.",
          );
        if (controller.signal.aborted) return;
        setAvailability(value);
        setDay((previous) =>
          value.days.some(
            (item: { date: string; slots: string[] }) =>
              item.date === previous && item.slots.length,
          )
            ? previous
            : (value.days.find((item: { slots: string[] }) => item.slots.length)
                ?.date ?? ""),
        );
        setSlot("");
      })
      .catch((reason) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Available times could not be loaded.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [month, refresh, step]);
  useEffect(() => {
    if (booked) successRef.current?.focus();
  }, [booked]);
  const daySlots =
      availability?.days.find((item) => item.date === day)?.slots ?? [],
    locked = submitting || pending;
  const maxMonth = easternDate(new Date(Date.now() + 60 * 86400_000)).slice(
    0,
    7,
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || (step===2 && !slot)) return;
    const form = new FormData(event.currentTarget);
    const details = {
      start: slot,
      firstName: String(form.get("firstName") ?? "").trim(),
      lastName: String(form.get("lastName") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      reason: String(form.get("reason") ?? "").trim(),
      smsConsent: {
        service: form.get("serviceTexts") === "on",
        marketing: form.get("marketingTexts") === "on",
        version: bookingConsentVersion,
      },
      attribution: bookingAttribution(),
    };
    if(step===1){
      if(!inquiryRequest.current)inquiryRequest.current=crypto.randomUUID();
      setSubmitting(true);setError("");
      try{
        const response=await fetch('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...details,action:'inquiry',requestId:inquiryRequest.current,formStartedAt:began.current,website:String(form.get('website')??'')})});
        const value=await response.json();
        if(!response.ok || value.saved!==true || value.inquiryId!==inquiryRequest.current)throw new Error(value.error||'Your inquiry could not be confirmed. Please try again.');
        setSavedDetails(details);setStep(2);
      }catch(reason){setError(reason instanceof Error?reason.message:'Please try again.');}
      finally{setSubmitting(false);}
      return;
    }
    const bookingDetails={...savedDetails,start:slot,inquiryId:inquiryRequest.current};
    // Disabled controls are omitted from FormData. Pending retries retain the
    // exact original payload and request ID, including after network timeouts.
    const key = JSON.stringify(bookingDetails);
    if (!attempt.current || (!pending && attempt.current.key !== key))
      attempt.current = { key, id: crypto.randomUUID() };
    const payload = pending ? JSON.parse(attempt.current.key) : bookingDetails;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          requestId: attempt.current.id,
          formStartedAt: began.current,
          website: String(form.get("website") ?? ""),
        }),
      });
      const value = await response.json();
      if (!response.ok) {
        if (value.pending) setPending(true);
        if (response.status === 409) {
          setPending(false);
          setSlot("");
          setRefresh((count) => count + 1);
          attempt.current = null;
        }
        throw new Error(
          value.error || "We could not confirm your booking. Please try again.",
        );
      }
      if(value.booked!==true || typeof value.start!=='string')throw new SyntaxError('Confirmation unavailable. Keep this page open and retry.');
      setBooked({ start: value.start, email: payload.email ?? "" });
      setPending(false);
    } catch (reason) {
      trackBookingEvent('booking_error');
      if (reason instanceof TypeError || reason instanceof SyntaxError)
        setPending(true);
      setError(
        reason instanceof TypeError
          ? "The connection was interrupted. Keep this page open and retry to check your booking."
          : reason instanceof Error
            ? reason.message
            : "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  if (booked)
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="px-6 py-16 text-center outline-none"
        role="status"
      >
        <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-primary" />
        <h3 className="font-serif text-3xl">You’re booked.</h3>
        <p className="mt-4 text-lg">
          {dateLabel(easternDate(new Date(booked.start)), {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          · {timeLabel(booked.start)} Eastern
        </p>
        <p className="mt-3 text-muted-foreground">
          We’ll call you at the number you provided.
        </p>
        {booked.email && (
          <p className="mt-2 text-sm text-muted-foreground">
            A calendar invitation will be sent to your email.
          </p>
        )}
        <p className="mt-6 text-sm">
          Need to make a change? Call{" "}
          <a className="underline" href={contactPhoneHref}>
            {contactPhone}
          </a>
          .
        </p>
      </div>
    );
  return (
    <div className="booking-card bg-white">
      <ol aria-label="Booking progress" className="flex items-center justify-center gap-2 border-b p-3 font-serif text-sm sm:gap-5 sm:p-5 sm:text-base">
        <li aria-current={step === 1 ? "step" : undefined} className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ae9457] text-white sm:h-10 sm:w-10">
            {step === 2 ? "✓" : "1"}
          </span>
          Your details
        </li>
        <li aria-hidden="true" className="w-5 shrink border-t sm:w-16" />
        <li aria-current={step === 2 ? "step" : undefined} className="flex shrink-0 items-center gap-2">
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border sm:h-10 sm:w-10 ${step === 2 ? "bg-[#ae9457] text-white" : ""}`}>
            2
          </span>
          Choose a time
        </li>
      </ol>
      {step===2 && <div ref={stageRef} tabIndex={-1} role="status" className="m-5 rounded-md bg-[#eef0e8] p-4"><h3 className="font-serif text-xl">✓ Your inquiry has been received</h3><p className="text-sm mt-1">Choose a time below to finish booking your consultation.</p></div>}
      <div className="grid gap-6 p-4 sm:p-8 md:grid-cols-[.75fr_1.5fr]">
        <aside className={`md:border-r md:pr-6 ${step === 1 ? "hidden md:block" : ""}`}>
          {step===1 ? <><p className="text-xs uppercase tracking-widest text-primary mb-4">A conversation, at your pace</p><h3 className="font-serif text-2xl mb-3">Let’s start with you.</h3><p className="text-muted-foreground text-base">Tell us a little about what you’d like help with. Next, you can choose a time that works for you.</p></> : <><div className="flex justify-between"><h3 className="font-serif text-2xl">Your details</h3><button type="button" disabled={locked} onClick={()=>setStep(1)} className="underline text-primary text-sm">Edit</button></div><p className="mt-5 font-medium">{savedDetails?.firstName} {savedDetails?.lastName}</p><p className="mt-2">{savedDetails?.phone}</p>{savedDetails?.reason && <p className="mt-5 text-base"><span className="block text-sm">Reason</span>{savedDetails.reason}</p>}</>}
          <ul className="space-y-5 my-8 text-base"><li className="flex items-center gap-4"><Phone size={25} aria-hidden="true"/>15-minute phone consultation</li><li className="flex items-center gap-4"><Handshake size={25} aria-hidden="true"/>Complimentary · No obligation</li><li className="flex items-center gap-4"><UserRound size={25} aria-hidden="true"/>{step===1?'Speak with a licensed specialist.':'We’ll call the number you provided.'}</li></ul><p className="text-sm">Prefer to call? <a href={contactPhoneHref} className="underline text-primary">{contactPhone}</a></p>
        </aside>
        <section className="min-w-0" aria-label={step===1?'Your contact details':'Choose an appointment time'}>
        <form onSubmit={submit}>
          <div hidden={step!==1}><h3 className="font-serif text-2xl mb-1">Your details</h3><p className="text-sm text-muted-foreground mb-5">First name and phone number are required.</p>
          <fieldset disabled={locked} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <label className="block text-[13px]" htmlFor="booking-first">
                First name
                <input
                  id="booking-first"
                  name="firstName"
                  autoComplete="given-name"
                  maxLength={80}
                  required
                  className={fieldClass}
                />
              </label>
              <label className="block text-[13px]" htmlFor="booking-phone">
                Phone number
                <input
                  id="booking-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  required
                  className={fieldClass}
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <label className="block text-[13px]" htmlFor="booking-last">
                Last name <span className="text-muted-foreground">(optional)</span>
                <input
                  id="booking-last"
                  name="lastName"
                  autoComplete="family-name"
                  maxLength={80}
                  className={fieldClass}
                />
              </label>
              <label className="block text-[13px]" htmlFor="booking-email">
                Email <span className="text-muted-foreground">(optional)</span>
                <input
                  id="booking-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  className={fieldClass}
                />
              </label>
            </div>
            <label className="block text-[13px]" htmlFor="booking-reason">
              <span className="flex justify-between">
                Reason
                <span className="text-xs text-muted-foreground">Optional</span>
              </span>
              <textarea
                id="booking-reason"
                name="reason"
                maxLength={1000}
                rows={3}
                className={`${fieldClass} min-h-[80px] resize-y`}
              />
            </label>
            <details className="!mt-5 rounded-md border p-4"><summary className="cursor-pointer text-sm font-medium">Text message preferences (optional)</summary><div role="group" aria-labelledby="booking-text-preferences" className="pt-4">
              <h4 id="booking-text-preferences" className="flex flex-wrap items-center gap-3 font-sans text-sm font-semibold text-foreground">
                Stay in touch, your way
                <span className="bg-[#f2ede2] px-2 py-1 text-[9px] font-medium uppercase tracking-widest text-[#89713e]">Optional</span>
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Choose which texts, if any, you’d like to receive.</p>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-muted-foreground">
                <input type="checkbox" name="serviceTexts" className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#9c8045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                <span>I agree to receive <strong className="font-semibold text-foreground/80">service text messages</strong> from <strong className="font-semibold text-foreground/80">Sterling Crest Financial Group</strong> about my consultation, appointment reminders, and policy-related support.</span>
              </label>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-muted-foreground">
                <input type="checkbox" name="marketingTexts" className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#9c8045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                <span>I agree to receive <strong className="font-semibold text-foreground/80">marketing text messages</strong>, including automated texts, from <strong className="font-semibold text-foreground/80">Sterling Crest Financial Group</strong> about insurance products and offers.</span>
              </label>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{bookingConsentDisclosure}</p>

            </div></details>              <p className="mt-3 flex items-center gap-3 text-xs text-foreground/80">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Privacy Policy</a>
                <span aria-hidden="true">·</span>
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Terms of Service</a>
              </p>
            <div
              aria-hidden="true"
              className="absolute -left-[10000px] h-0 w-0 overflow-hidden"
            >
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          </fieldset>
          <p className="text-sm text-muted-foreground rounded-md bg-[#f5f2e9] p-3 mt-5">By continuing, you’re sending your inquiry to Sterling Crest Financial Group. We may call you about your inquiry, even if you don’t book a time.</p>
          </div>
          <div hidden={step!==2}><h3 className="font-serif text-2xl">Choose a time</h3><p className="text-sm text-muted-foreground mb-5">All times shown in Eastern Time.</p>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5"><div><div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            disabled={locked || loading || month <= today.slice(0, 7)}
            onClick={() => setMonth(adjacentMonth(month, -1))}
            className="rounded p-1 text-secondary disabled:opacity-25 focus-visible:outline-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-base font-medium" aria-live="polite">
            {dateLabel(`${month}-01`, { month: "long", year: "numeric" })}
          </p>
          <button
            type="button"
            aria-label="Next month"
            disabled={locked || loading || month >= maxMonth}
            onClick={() => setMonth(adjacentMonth(month, 1))}
            className="rounded p-1 text-secondary disabled:opacity-25 focus-visible:outline-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div
          className="grid grid-cols-7 text-center"
          role="group"
          aria-label="Choose a date"
          aria-busy={loading}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <span
              key={label}
              className="pb-3 text-[10px] uppercase text-muted-foreground"
            >
              {label}
            </span>
          ))}
          {calendarDays(month).map((date) => {
            const available =
              availability?.days.some(
                (item) => item.date === date && item.slots.length,
              ) ?? false;
            return (
              <div
                key={date}
                className="flex h-[39px] items-center justify-center"
              >
                <button
                  type="button"
                  aria-label={dateLabel(date, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  aria-pressed={day === date}
                  disabled={!available || loading || locked}
                  onClick={() => {
                    setDay(date);
                    setSlot("");
                    setError("");
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${day === date ? "bg-secondary text-[#d1b16d] shadow-sm" : "text-foreground hover:bg-muted disabled:text-[#a9adb5] disabled:hover:bg-transparent"}`}
                >
                  {Number(date.slice(-2))}
                </button>
              </div>
            );
          })}
        </div>
        </div><div>{loading ? (
          <p
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            role="status"
          >
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading available times…
          </p>
        ) : day ? (
          <>
            <p className="mb-3 mt-6 text-base">
              {dateLabel(day, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div
              className="grid max-h-[250px] grid-cols-2 gap-2.5 overflow-y-auto pr-1 md:max-h-[350px]"
              role="group"
              aria-label="Available times"
            >
              {daySlots.map((start) => (
                <button
                  key={start}
                  type="button"
                  disabled={locked}
                  aria-pressed={slot === start}
                  onClick={() => {
                    setSlot(start);
                    trackBookingEvent('time_selected');
                    setError("");
                  }}
                  className={`rounded-[6px] border px-1 py-2.5 text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${slot === start ? "border-secondary bg-secondary text-white shadow-sm" : "border-[#b6bdc7] bg-white text-foreground hover:border-primary hover:bg-primary/5"}`}
                >
                  {timeLabel(start)}
                </button>
              ))}
            </div>
          </>
        ) : availability ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No appointments remain this month. Please choose the next month.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setRefresh((count) => count + 1)}
            className="mt-6 text-sm underline"
          >
            Retry loading times
          </button>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Eastern Time · Scroll for more times
        </p></div></div>
{slot && <p className="border-t pt-4 mt-5 text-base">{dateLabel(easternDate(new Date(slot)),{weekday:'long',month:'long',day:'numeric'})} at {timeLabel(slot)} Eastern<br/><span className="text-sm text-muted-foreground">15-minute phone consultation</span></p>}</div>
          {error && (
            <p
              role="alert"
              className="mt-4 text-sm leading-relaxed text-destructive"
            >
              {error}{" "}
              <a href={contactPhoneHref} className="underline">
                {contactPhone}
              </a>
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || (step===2 && (!slot || loading))}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0c2031] px-4 py-3 font-serif text-lg text-white shadow-sm transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-55"
          >
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {step===1 ? "Sending inquiry…" : "Confirming…"}
              </>
            ) : pending ? (
              "Check booking again"
            ) : (
              step===1 ? "Send inquiry and choose a time →" : "Confirm appointment →"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {step===1 ? "Next: choose a time for your phone consultation." : "Your appointment is booked after you confirm."}
          </p>
          {step===2 && <button type="button" disabled={locked} onClick={()=>{setStep(1);setError("");}} className="text-sm underline text-primary mt-5">← Back to your details</button>}
          {step===2 && !slot && !loading && day && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Select a time to continue.
            </p>
          )}
        </form>
        </section>
      </div>
    </div>
  );
}
