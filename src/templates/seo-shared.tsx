import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { scheduleConsultationHref } from "@/lib/contact";
import { getSeoPageByPath } from "@/lib/seo-content";
import { getService } from "@/lib/services";
import type { SeoPage } from "@/lib/seo-content";
import type { SeoConsultationCta, SeoFaq } from "@/lib/parse-seo-mdx";

export function SeoChrome({
  page,
  children,
}: {
  page: SeoPage;
  children: ReactNode;
}) {
  const { frontmatter } = page;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {frontmatter.schema?.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }}
        />
      ))}
      {children}
      <Footer />
    </div>
  );
}

export function GuideHero({
  image,
  backTo,
  backLabel,
  eyebrow,
  title,
  tall = false,
}: {
  image: string;
  backTo: string;
  backLabel: string;
  eyebrow: ReactNode;
  title: string;
  tall?: boolean;
}) {
  return (
    <section className="relative pt-24 md:pt-28">
      <div
        className={`relative flex items-end overflow-hidden ${
          tall ? "min-h-[320px] md:min-h-[400px]" : "min-h-[320px] md:min-h-[380px]"
        }`}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/55" />
        <div className="container max-w-4xl mx-auto px-6 pb-12 md:pb-16 relative z-10">
          <Link
            to={backTo}
            className="inline-block text-primary text-xs tracking-[0.3em] uppercase font-sans mb-6 hover:text-primary/80 transition-colors"
          >
            {backLabel}
          </Link>
          {typeof eyebrow === "string" ? (
            <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-3">
              {eyebrow}
            </p>
          ) : (
            eyebrow
          )}
          <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

export function AeoAnswer({
  answer,
  eyebrow = "Quick answer",
}: {
  answer: string;
  eyebrow?: string;
}) {
  return (
    <div
      data-aeo-answer
      className="aeo-answer border-l-2 border-primary bg-card pl-6 pr-6 py-6 md:py-8"
    >
      <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-3">
        {eyebrow}
      </p>
      <p className="text-base md:text-lg leading-relaxed text-foreground/85 font-sans">
        {answer}
      </p>
    </div>
  );
}

export function InlineConsultCta({ copy }: { copy?: SeoConsultationCta }) {
  return (
    <div className="bg-secondary text-secondary-foreground px-6 py-8 md:py-10 text-center">
      <h2 className="font-serif text-xl md:text-2xl text-white mb-3">
        {copy?.heading ?? "Want to see what coverage could look like for you?"}
      </h2>
      <p className="text-white/70 font-sans text-sm md:text-base mb-6 max-w-lg mx-auto">
        {copy?.body ?? "Speak with a licensed specialist for a complimentary, no-obligation consultation."}
      </p>
      <Link
        to={scheduleConsultationHref}
        className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase font-sans hover:opacity-90 transition-all duration-300"
      >
        Schedule a Consultation
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

/** Quick answer (when present) plus top-of-guide consultation CTA for all SEO guides. */
export function GuideIntro({
  aeoAnswer,
  className,
  consultationCta,
}: {
  aeoAnswer: string | null;
  className?: string;
  consultationCta?: SeoConsultationCta;
}) {
  return (
    <div
      className={`container max-w-3xl mx-auto px-6 mb-12${className ? ` ${className}` : ""}`}
    >
      {aeoAnswer && <AeoAnswer answer={aeoAnswer} />}
      <div className={aeoAnswer ? "mt-6" : undefined}>
        <InlineConsultCta copy={consultationCta} />
      </div>
    </div>
  );
}

export function FaqSection({ faq }: { faq: SeoFaq[] }) {
  if (!faq.length) return null;
  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="container max-w-3xl mx-auto px-6">
        <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-4">
          Questions
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faq.map((item) => (
            <div key={item.question} className="border-t border-border pt-6">
              <h3 className="font-serif text-xl text-foreground mb-3">
                {item.question}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground font-sans">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConsultCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
      <div className="container max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">
          {heading}
        </h2>
        <p className="text-white/70 font-sans mb-10 max-w-xl mx-auto">{body}</p>
        <Link
          to={scheduleConsultationHref}
          className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase font-sans hover:opacity-90 transition-all duration-300"
        >
          Schedule a Consultation
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export function Disclosures({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="py-10">
      <div className="container max-w-3xl mx-auto px-6">
        {items.map((d) => (
          <p
            key={d}
            className="text-xs leading-relaxed text-muted-foreground/80 font-sans"
          >
            {d}
          </p>
        ))}
      </div>
    </section>
  );
}

export function RelatedLinks({ hrefs }: { hrefs?: string[] }) {
  const { pathname } = useLocation();
  const links = [...new Set(hrefs ?? [])].filter(href => href !== pathname);
  if (!links.length) return null;
  return (
    <nav className="mt-12 flex flex-wrap gap-4">
      {links.map((href) => (
        <Link
          key={href}
          to={href}
          className="text-xs tracking-[0.25em] uppercase font-sans text-foreground/70 hover:text-primary transition-colors"
        >
          {href === "/book" ? "Book a consultation" : getSeoPageByPath(href)?.frontmatter.title ?? getService(href.replace("/services/", ""))?.title ?? "Explore coverage"}
        </Link>
      ))}
    </nav>
  );
}
