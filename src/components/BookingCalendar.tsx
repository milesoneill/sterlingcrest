import { bookingCalendarId, bookingCalendarSrc } from "@/lib/booking";

const BookingCalendar = () => (
  <div>
    <iframe
      src={bookingCalendarSrc}
      id={bookingCalendarId}
      title="Schedule a consultation with a licensed specialist"
      className="w-full h-[760px] border-0"
    />
    <p className="mt-4 text-center text-sm text-muted-foreground">
      Having trouble loading the calendar?{" "}
      <a href={bookingCalendarSrc} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        Open the booking page
      </a>
    </p>
  </div>
);

export default BookingCalendar;
