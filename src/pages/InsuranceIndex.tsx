import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listSeoPagesByPrefix } from "@/lib/seo-content";

const InsuranceIndex = () => {
  const pages = listSeoPagesByPrefix("/insurance");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 md:pt-32 pb-20">
        <div className="container max-w-3xl mx-auto px-6">
          <p className="text-primary text-[0.7rem] tracking-[0.45em] uppercase font-sans mb-4">
            Coverage
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight">
            Insurance type guides
          </h1>
          <div className="gold-underline w-16 mt-6 mb-8" />
          <p className="text-base md:text-lg text-muted-foreground font-sans mb-12">
            Long-form explainers for each coverage type we help families
            consider. Final expense is our primary focus. For a shorter
            overview, visit{" "}
            <a href="/#services" className="text-primary hover:underline underline-offset-4">
              our services
            </a>
            .
          </p>
          <ul className="space-y-8">
            {pages.map((page) => (
              <li key={page.path} className="border-t border-border pt-8">
                <Link to={page.path} className="group block">
                  <h2 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                    {page.frontmatter.title}
                  </h2>
                  {page.frontmatter.description && (
                    <p className="mt-3 text-muted-foreground font-sans leading-relaxed">
                      {page.frontmatter.description}
                    </p>
                  )}
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

export default InsuranceIndex;
