import { useEffect, useRef, useState, type FormEvent } from "react";
import {
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

const fieldClass =
  "mt-1.5 block w-full rounded-[6px] border border-[#d0d3d7] bg-white px-3 py-2 text-[15px] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-muted/40";
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
  }, [month, refresh]);
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
    if (!slot || submitting) return;
    const form = new FormData(event.currentTarget);
    const details = {
      start: slot,
      firstName: String(form.get("firstName") ?? "").trim(),
      lastName: String(form.get("lastName") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      reason: String(form.get("reason") ?? "").trim(),
    };
    // Disabled controls are omitted from FormData. Pending retries retain the
    // exact original payload and request ID, including after network timeouts.
    const key = JSON.stringify(details);
    if (!attempt.current || (!pending && attempt.current.key !== key))
      attempt.current = { key, id: crypto.randomUUID() };
    const payload = pending ? JSON.parse(attempt.current.key) : details;
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
      setBooked({ start: value.start, email: payload.email });
      setPending(false);
    } catch (reason) {
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
    <div className="booking-card grid bg-white md:grid-cols-2">
      <section
        className="min-w-0 px-6 py-6 sm:px-8"
        aria-label="Choose an appointment time"
      >
        <Step number={1}>Choose a time</Step>
        <div className="mb-5 flex items-center justify-between">
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
        {loading ? (
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
              className="grid max-h-[94px] grid-cols-3 gap-2.5 overflow-y-auto pr-1"
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
        </p>
      </section>
      <section
        className="min-w-0 border-t border-[#e4e2df] px-6 py-6 sm:px-8 md:my-6 md:border-l md:border-t-0 md:py-1"
        aria-label="Your contact details"
      >
        <Step number={2}>Your details</Step>
        <form onSubmit={submit}>
          <fieldset disabled={locked} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
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
            disabled={!slot || submitting || loading}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#ad9153] via-[#b69b5b] to-[#a88b4d] px-4 py-3 font-serif text-lg text-white shadow-sm transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-55"
          >
            {submitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Confirming…
              </>
            ) : pending ? (
              "Check booking again"
            ) : (
              "Book consultation"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            We’ll call you at the number you provide.
          </p>
          {!slot && !loading && day && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Select a time to continue.
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
