import { MarkdownBody } from "@/lib/markdown";
import { guideHeroImage, type SeoPage } from "@/lib/seo-content";
import {
  ConsultCta,
  Disclosures,
  FaqSection,
  GuideHero,
  GuideIntro,
  RelatedLinks,
  SeoChrome,
} from "./seo-shared";

const BlogPage = ({ page }: { page: SeoPage }) => {
  const { frontmatter, body, aeoAnswer, faq } = page;
  const hero = guideHeroImage(page);

  return (
    <SeoChrome page={page}>
      <article>
        <GuideHero
          image={hero}
          backTo="/resources"
          backLabel="← Guides"
          eyebrow="Guide"
          title={frontmatter.title}
        />

        <GuideIntro
          aeoAnswer={aeoAnswer}
          className="pt-12 md:pt-16"
          consultationCta={frontmatter.consultationCta}
        />

        <section className="pb-16 md:pb-20">
          <div className="container max-w-3xl mx-auto px-6">
            <MarkdownBody markdown={body} />
            <RelatedLinks hrefs={frontmatter.internalLinks} />
          </div>
        </section>

        <FaqSection faq={faq} />
        <ConsultCta
          heading={frontmatter.closingCta?.heading ?? "The right protection starts with the right conversation."}
          body={frontmatter.closingCta?.body ?? "Schedule a complimentary consultation to talk through final expense coverage and any other protection your family may need."}
        />
        <Disclosures items={frontmatter.disclosures} />
      </article>
    </SeoChrome>
  );
};

export default BlogPage;
