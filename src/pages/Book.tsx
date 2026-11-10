import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import { contactPhone, contactPhoneHref } from "@/lib/contact";
const Book = () => {
  useEffect(() => {
    // Scope the LeadConnector welcome prompt to this page without closing the chat.
    const promptStyle = document.createElement("style");
    promptStyle.textContent = ".lc_text-widget--prompt { display: none !important; }";
    const hideWelcomePrompt = () => {
      document.querySelector("chat-widget")?.shadowRoot?.append(promptStyle);
    };

    window.addEventListener("LC_chatWidgetLoaded", hideWelcomePrompt);
    hideWelcomePrompt();
    return () => {
      window.removeEventListener("LC_chatWidgetLoaded", hideWelcomePrompt);
      promptStyle.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-secondary pb-5 pt-28 md:pb-9 md:pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,hsl(var(--gold)/0.08)_50%,transparent_65%)]" />
          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <h1 className="font-serif text-2xl leading-[1.12] text-white sm:text-3xl md:text-[46px]">
              Meet with a Licensed Specialist.
              <span className="text-gold-gradient hidden md:block">Plan with confidence.</span>
            </h1>
            <div className="gold-underline mt-3 w-16 md:mt-4" />
          </div>
        </section>
        <section id="calendar" className="bg-background px-4 pb-8 pt-5 sm:px-6 md:pt-8">
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-4 text-center md:mb-6">
              <h2 className="font-serif text-2xl leading-tight text-foreground md:text-[38px]">
                Book your consultation
              </h2>
              <div className="gold-underline mx-auto mt-3 hidden w-14 md:block" />
              <p className="mt-2 text-sm text-muted-foreground md:mt-4 md:text-base">
                <span className="md:hidden">Complimentary </span>15-minute phone call
                <span className="block md:inline"><span className="hidden md:inline"> · </span>Monday–Friday, 9 a.m.–6 p.m. Eastern</span>
              </p>
              <p className="mx-auto mt-3 hidden max-w-xl text-sm text-muted-foreground md:block">A complimentary, no-obligation conversation about your goals, budget, and coverage questions.</p>
              <a href={contactPhoneHref} className="mt-2 inline-block text-sm text-primary underline underline-offset-4 md:mt-3">Prefer to call? {contactPhone}</a>
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
};
export default Book;
