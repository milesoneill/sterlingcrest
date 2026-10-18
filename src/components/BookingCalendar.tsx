import { bookingCalendarId, bookingCalendarSrc } from "@/lib/booking";

const BookingCalendar = () => (
  <div id={bookingCalendarId}>
    <div className="px-6 pt-8 pb-4 text-center">
      <p className="text-xl font-medium text-primary">15-minute phone consultation</p>
      <p className="mt-3 text-muted-foreground">Monday–Friday · 9 a.m.–6 p.m. Eastern</p>
    </div>
    <iframe
      src={bookingCalendarSrc}
      title="Book a Sterling Crest website consultation"
      className="block h-[760px] w-full border-0 bg-white"
    />
    <p className="px-6 py-5 text-center text-sm text-muted-foreground">
      If the calendar doesn’t appear,{' '}
      <a href={bookingCalendarSrc} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        open the booking calendar
      </a>.
    </p>
  </div>
);

export default BookingCalendar;
