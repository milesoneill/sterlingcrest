import { Link } from "react-router-dom";
import { MarkdownBody } from "@/lib/markdown";
import { getService } from "@/lib/services";
import { guideHeroImage, relatedServiceSlug, type SeoPage } from "@/lib/seo-content";
import {
  ConsultCta,
  Disclosures,
  FaqSection,
  GuideHero,
  GuideIntro,
  RelatedLinks,
  SeoChrome,
} from "./seo-shared";

const InsuranceTypePage = ({ page }: { page: SeoPage }) => {
  const { frontmatter, body, aeoAnswer, faq } = page;
  const serviceSlug = relatedServiceSlug(frontmatter.slug);
  const service = serviceSlug ? getService(serviceSlug) : undefined;
  const hero = guideHeroImage(page);
  const isFinalExpense = serviceSlug === "final-expense";

  return (
    <SeoChrome page={page}>
      <GuideHero
        image={hero}
        backTo="/insurance"
        backLabel="← Coverage guides"
        eyebrow={service?.title ?? "Insurance"}
        title={frontmatter.title}
      />

      <GuideIntro aeoAnswer={aeoAnswer} className="pt-12 md:pt-16" consultationCta={frontmatter.consultationCta} />

      <section className="pb-16 md:pb-20">
        <div className="container max-w-3xl mx-auto px-6">
          <MarkdownBody markdown={body} />
          {service && (
            <p className="mt-10 text-sm text-muted-foreground font-sans">
              Looking for a shorter overview? See our{" "}
              <Link
                to={`/services/${service.slug}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {service.title.toLowerCase()}
              </Link>{" "}
              page.
            </p>
          )}
          <RelatedLinks hrefs={frontmatter.internalLinks} />
        </div>
      </section>

      <FaqSection faq={faq} />
      <ConsultCta
        heading={frontmatter.closingCta?.heading ?? (
          isFinalExpense
            ? "Ready to talk through final expense coverage?"
            : "Start with the conversation that protects your family."
        )}
        body={frontmatter.closingCta?.body ?? (
          isFinalExpense
            ? "Schedule a complimentary consultation to discuss funeral costs, qualification, and coverage options — with no obligation."
            : "Most families start with final expense planning, then decide whether additional coverage belongs in the picture. A complimentary consultation can help you sort that out."
        )}
      />
      <Disclosures items={frontmatter.disclosures} />
    </SeoChrome>
  );
};

export default InsuranceTypePage;
