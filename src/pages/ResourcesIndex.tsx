import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guidesIndexHeroImage } from "@/lib/images";
import { guideHeroImage, listGuideIndexPages } from "@/lib/seo-content";

const ResourcesIndex = () => {
  const pages = listGuideIndexPages();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-24 md:pt-28">
        <div className="relative min-h-[360px] md:min-h-[440px] flex items-end overflow-hidden">
          <img
            src={guidesIndexHeroImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/35" />
          <div className="container max-w-4xl mx-auto px-6 pb-12 md:pb-16 relative z-10">
            <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-4">
              Resources
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Guides for Families
            </h1>
            <div className="gold-underline w-16 mt-6 mb-6" />
            <p className="text-base md:text-lg text-white/75 font-sans leading-relaxed max-w-2xl">
              Educational articles on life insurance, financial protection, and
              the decisions that help families plan with confidence — including
              state-specific location guides. When you&apos;re ready, a
              complimentary consultation is the next step.
            </p>
          </div>
        </div>
      </section>

      <main className="py-16 md:py-20">
        <div className="container max-w-4xl mx-auto px-6">
          <ul className="divide-y divide-border">
            {pages.map((page) => (
              <li key={page.path} className="py-10 first:pt-0 last:pb-0">
                <Link
                  to={page.path}
                  className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
                >
                  <div className="w-full sm:w-44 md:w-52 shrink-0 aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={guideHeroImage(page)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h2 className="font-serif text-xl md:text-2xl text-foreground leading-snug group-hover:text-primary transition-colors">
                      {page.frontmatter.title}
                    </h2>
                    {page.frontmatter.description && (
                      <p className="mt-3 text-muted-foreground font-sans leading-relaxed text-sm md:text-base">
                        {page.frontmatter.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 mt-5 text-primary text-[0.65rem] tracking-[0.3em] uppercase font-sans">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesIndex;
