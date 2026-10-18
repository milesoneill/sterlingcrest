import { bookingCalendarId, bookingCalendarSrc } from "@/lib/booking";

const BookingCalendar = () => (
  <div id={bookingCalendarId} className="px-6 py-10 text-center sm:px-10">
    <p className="text-xl font-medium text-primary">15-minute phone consultation</p>
    <p className="mt-3 text-muted-foreground">Monday–Friday · 9 a.m.–6 p.m. Eastern</p>
    <a
      href={bookingCalendarSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-7 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      Choose a day &amp; time
    </a>
    <p className="mx-auto mt-5 max-w-sm text-sm text-muted-foreground">
      Opens our secure booking calendar in a new tab. You’ll receive an email confirmation after booking.
    </p>
  </div>
);

export default BookingCalendar;
