import NotFound from "./NotFound";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { scheduleConsultationHref } from "@/lib/contact";
import { serviceImages } from "@/lib/images";
import { getService } from "@/lib/services";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getService(slug) : undefined;

  if (!service) {
    return <NotFound />;
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 md:pt-28">
        <div className="relative min-h-[320px] md:min-h-[380px] flex items-end overflow-hidden">
          <img
            src={service.heroImage ?? serviceImages[service.slug]}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover ${service.heroImage ? "object-[72%_center] md:object-center" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/55" />
          <div className="container max-w-4xl mx-auto px-6 pb-12 md:pb-16 relative z-10">
            <Link
              to="/#services"
              className="inline-block text-primary text-xs tracking-[0.3em] uppercase font-sans mb-6 hover:text-primary/80 transition-colors"
            >
              ← All Services
            </Link>
            <div className="flex items-start gap-4">
              <Icon
                className="w-10 h-10 text-primary shrink-0 mt-1"
                strokeWidth={1.3}
              />
              <div>
                <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-3">
                  {service.title}
                </p>
                <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight">
                  {service.tagline}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-20">
        <div className="container max-w-3xl mx-auto px-6">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
            {service.intro}
          </p>
          {service.relatedGuides && (
            <div className="mt-8 text-center">
              <Link
                to={scheduleConsultationHref}
                className="group inline-flex max-w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-sans text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-gold-light sm:px-10"
              >
                Schedule a Consultation
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Complimentary · 15-minute phone call · No obligation
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="container max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            {service.whyHeading}
          </h2>
          <div className="gold-underline w-16 mb-8" />
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
            {service.whyBody}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl mx-auto px-6">
          <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-4 text-center">
            Benefits
          </p>
          <h2 className="font-serif text-2xl md:text-4xl text-foreground text-center mb-12 md:mb-16">
            Why This Coverage <span className="text-gold-gradient">Matters</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
            {service.benefits.map((benefit) => (
              <div key={benefit.title} className="border-l-2 border-primary pl-6">
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-sans">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {service.relatedGuides && (
        <section className="bg-muted/40 py-16 md:py-20" aria-labelledby="service-guides-heading">
          <div className={`container mx-auto px-6 ${service.relatedGuides.layout === "inline" ? "max-w-5xl" : "max-w-3xl"}`}>
            <h2 id="service-guides-heading" className="mb-4 font-serif text-2xl text-foreground md:text-3xl">
              {service.relatedGuides.heading}
            </h2>
            <div className="gold-underline mb-8 w-16" />
            {service.relatedGuides.description && (
              <p className="mb-6 font-sans text-base leading-relaxed text-muted-foreground">
                {service.relatedGuides.description}
              </p>
            )}
            <ul className={service.relatedGuides.layout === "inline" ? "flex flex-col gap-5 md:flex-row md:flex-wrap md:gap-x-8" : "space-y-4"}>
              {service.relatedGuides.links.map((guide) => (
                <li key={guide.href}>
                  <Link
                    to={guide.href}
                    className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-foreground underline decoration-primary/60 underline-offset-4 transition-colors hover:text-primary"
                  >
                    {guide.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">
            Ready to explore {service.title.toLowerCase()}?
          </h2>
          <p className="text-white/70 font-sans mb-10 max-w-xl mx-auto">
            {service.consultationCopy ?? "Schedule a complimentary consultation to discuss your goals and find the protection that's right for you and your family."}
          </p>
          <Link
            to={scheduleConsultationHref}
            className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase font-sans hover:opacity-90 transition-all duration-300"
          >
            Schedule a Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicePage;
