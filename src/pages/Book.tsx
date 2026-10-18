import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import { contactPhone, contactPhoneHref } from "@/lib/contact";
const Book = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <section className="relative overflow-hidden bg-secondary pb-8 pt-32 md:pb-9 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,hsl(var(--gold)/0.08)_50%,transparent_65%)]" />
        <div className="container relative z-10 mx-auto max-w-6xl px-6">
          <h1 className="font-serif text-3xl leading-[1.12] text-white sm:text-4xl md:text-[46px]">
            Meet with a Licensed Specialist.
            <br />
            <span className="text-gold-gradient">Plan with confidence.</span>
          </h1>
          <div className="gold-underline mt-4 w-16" />
        </div>
      </section>
      <section id="calendar" className="bg-background px-4 pb-8 pt-8 sm:px-6">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-6 text-center">
            <h2 className="font-serif text-3xl leading-tight text-foreground md:text-[38px]">
              Book your consultation
            </h2>
            <div className="gold-underline mx-auto mt-3 w-14" />
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              15-minute phone call · Monday–Friday, 9 a.m.–6 p.m. Eastern
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">A complimentary, no-obligation conversation about your goals, budget, and coverage questions.</p>
            <a href={contactPhoneHref} className="mt-3 inline-block text-sm text-primary underline underline-offset-4">Prefer to call? {contactPhone}</a>
          </div>
          <div className="overflow-hidden rounded-[5px] border border-border/80 bg-white shadow-[0_14px_40px_-20px_hsl(var(--navy)/0.22)]">
            <BookingCalendar />
          </div>
        </div>
      </section>
    </main>
    <Footer compact />
  </div>
);
export default Book;
