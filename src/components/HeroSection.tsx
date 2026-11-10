import { Link } from "react-router-dom";
import { HeartHandshake, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { heroImage } from "@/lib/images";
import { scheduleConsultationHref } from "@/lib/contact";

const highlights = [
  {
    icon: HeartHandshake,
    title: "Personalized Guidance",
    description: "Insurance solutions tailored to your family's unique goals and priorities.",
  },
  {
    icon: Award,
    title: "Independent Expertise",
    description: "Access to highly rated carriers with confidence and clarity.",
  },
  {
    icon: ShieldCheck,
    title: "Lasting Security",
    description: "Providing protection and peace of mind for years to come.",
  },
];

const HeroSection = () => {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background image */}
      <img
        src={heroImage}
        alt="Modern luxury building entrance at dusk"
        width={1536}
        height={1024}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
      />

      {/* Legibility scrim: dark on the left, image on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/30 lg:to-secondary/15" />
      {/* Top + bottom fades */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-secondary/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary to-transparent" />

      {/* Copy — fills remaining space and centers vertically */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container max-w-7xl mx-auto px-6 pt-32 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-white">
              Protect What Matters.
              <br />
              Build What <span className="text-gold-gradient">Lasts.</span>
            </h1>

            <div className="gold-underline w-16 mt-6 md:mt-8" />

            <p className="mt-6 md:mt-8 text-base md:text-lg leading-relaxed text-white/75 font-sans max-w-lg">
              We’re an independent life insurance brokerage helping families
              compare final expense and mortgage protection coverage.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to={scheduleConsultationHref}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase font-sans hover:bg-gold-light transition-all duration-300"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white text-xs tracking-[0.25em] uppercase font-sans hover:bg-white/10 transition-all duration-300"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slim highlights row — flows below the copy (no overlap on mobile) */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 py-5 md:py-6 md:px-8 first:md:pl-0"
              >
                <item.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" strokeWidth={1.4} />
                <div>
                  <h3 className="font-serif text-base text-white/95">{item.title}</h3>
                  <p className="text-xs text-white/60 font-sans mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
