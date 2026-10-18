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

function locationLabel(page: SeoPage): string {
  const state = page.frontmatter.targetState;
  if (state) return state;
  const kw = page.frontmatter.targetKeyword ?? "";
  const m = kw.match(/\bin\s+(.+)$/i);
  return m?.[1] ?? "your area";
}

const LocationPage = ({ page }: { page: SeoPage }) => {
  const { frontmatter, body, aeoAnswer, faq } = page;
  const place = locationLabel(page);
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

        <GuideIntro aeoAnswer={aeoAnswer} className="pt-12 md:pt-16" consultationCta={frontmatter.consultationCta} />

        <section className="pb-16 md:pb-20">
          <div className="container max-w-3xl mx-auto px-6">
            <MarkdownBody markdown={body} />
            <RelatedLinks hrefs={frontmatter.internalLinks} />
          </div>
        </section>

        <FaqSection faq={faq} />
        <ConsultCta
          heading={frontmatter.closingCta?.heading ?? `Final expense help for families in ${place}.`}
          body={frontmatter.closingCta?.body ?? "Sterling Crest serves clients nationwide. Schedule a complimentary consultation to talk through coverage — no local office visit required."}
        />
        <Disclosures items={frontmatter.disclosures} />
      </article>
    </SeoChrome>
  );
};

export default LocationPage;
