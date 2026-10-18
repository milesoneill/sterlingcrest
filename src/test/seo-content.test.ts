import { describe, expect, it } from "vitest";
import {
  parseFaqMarkdown,
  parseSeoMdx,
  publicPathForTemplate,
  splitBodyAndFaq,
} from "@/lib/parse-seo-mdx";
import { relatedServiceSlug, listGuideIndexPages, listSeoPages } from "@/lib/seo-content";
import { guideHeroImage, resolveGuideImage } from "@/lib/guide-images";

const sample = `---
{
  "title": "What Is Final Expense Insurance?",
  "slug": "what-is-final-expense-insurance",
  "template": "blog-page",
  "description": "A plain-language guide."
}
---

**Quick answer:** Final expense insurance helps with funeral costs.

## What it covers

Body text here.

## Frequently Asked Questions

**Is this burial insurance?**

People often use the names interchangeably.
`;

describe("parseSeoMdx", () => {
  it("keeps article and FAQ schema without marking editorial guides as community Q&A", () => {
    const raw = `---\n${JSON.stringify({
      title: "Guide", slug: "guide", template: "blog-page",
      schema: [{ "@type": "Article" }, { "@type": "QAPage" },
        { "@type": ["WebPage", "QAPage"] }, { "@type": "FAQPage" }],
    })}\n---\n\nAn editorial answer.`;
    expect(parseSeoMdx(raw).frontmatter.schema).toEqual([
      { "@type": "Article" }, { "@type": "FAQPage" },
    ]);
  });

  it("reads factory JSON frontmatter and template", () => {
    const parsed = parseSeoMdx(sample);
    expect(parsed.frontmatter.template).toBe("blog-page");
    expect(parsed.frontmatter.slug).toBe("what-is-final-expense-insurance");
    expect(parsed.aeoAnswer).toMatch(/funeral costs/);
    expect(parsed.body).toContain("What it covers");
    expect(parsed.body).not.toContain("Frequently Asked Questions");
    expect(parsed.faq).toHaveLength(1);
    expect(parsed.faq[0].question).toBe("Is this burial insurance?");
  });

  it("keeps a Sources section after FAQ in the body", () => {
    const parsed = parseSeoMdx(`${sample}

## Sources

- [NAIC](https://content.naic.org)
`);
    expect(parsed.faq).toHaveLength(1);
    expect(parsed.body).toContain("## Sources");
  });

  it("reads optional heroImage from frontmatter", () => {
    const parsed = parseSeoMdx(`---
{
  "title": "Test",
  "slug": "test-guide",
  "template": "blog-page",
  "heroImage": "1234567890-abcdefabcdef"
}
---

Body.
`);
    expect(parsed.frontmatter.heroImage).toBe("1234567890-abcdefabcdef");
  });
});

describe("publicPathForTemplate", () => {
  it("routes each lead-gen template to the right prefix", () => {
    expect(publicPathForTemplate("blog-page", "what-is-final-expense-insurance")).toBe(
      "/resources/what-is-final-expense-insurance"
    );
    expect(publicPathForTemplate("insurance-type-page", "final-expense-insurance")).toBe(
      "/insurance/final-expense-insurance"
    );
    expect(publicPathForTemplate("location-page", "final-expense-insurance-in-florida")).toBe(
      "/locations/final-expense-insurance-in-florida"
    );
  });
});

describe("splitBodyAndFaq", () => {
  it("extracts the factory FAQ markdown shape", () => {
    const { faq } = splitBodyAndFaq(`## Intro

Hello.

## Frequently Asked Questions

**Question one?**

Answer one.

**Question two?**

Answer two.
`);
    expect(faq.map((f) => f.question)).toEqual(["Question one?", "Question two?"]);
  });
});

describe("parseFaqMarkdown", () => {
  it("returns empty for prose without questions", () => {
    expect(parseFaqMarkdown("Just a paragraph.")).toEqual([]);
  });
});

describe("relatedServiceSlug", () => {
  it("maps SEO slugs back to branded service pages", () => {
    expect(relatedServiceSlug("final-expense-insurance-in-florida")).toBe("final-expense");
    expect(relatedServiceSlug("mortgage-protection-guide")).toBe("mortgage-protection");
  });
});

describe("listSeoPages", () => {
  it("loads stub MDX for all three lead-gen templates", () => {
    const pages = listSeoPages();
    const templates = new Set(pages.map((p) => p.frontmatter.template));
    expect(templates.has("blog-page")).toBe(true);
    expect(templates.has("insurance-type-page")).toBe(true);
    expect(templates.has("location-page")).toBe(true);
    expect(pages.some((p) => p.path === "/resources/what-is-final-expense-insurance")).toBe(true);
    expect(pages.some((p) => p.path === "/insurance/final-expense-insurance")).toBe(true);
    expect(pages.some((p) => p.path === "/locations/final-expense-insurance-in-florida")).toBe(true);
  });
});

describe("listGuideIndexPages", () => {
  it("merges resource guides and location pages for the Guides index", () => {
    const pages = listGuideIndexPages();
    expect(pages.some((p) => p.path.startsWith("/resources/"))).toBe(true);
    expect(pages.some((p) => p.path.startsWith("/locations/"))).toBe(true);
    expect(pages.some((p) => p.path.startsWith("/insurance/"))).toBe(false);
    for (const page of pages) {
      expect(page.path).toMatch(/^\/(resources|locations)\//);
    }
  });
});

describe("resolveGuideImage", () => {
  it("resolves a hero/thumbnail image for every Guides index page", () => {
    const pages = listGuideIndexPages();
    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) {
      expect(guideHeroImage(page)).toMatch(/^https:\/\/images\.unsplash\.com\//);
    }
  });

  it("uses frontmatter heroImage when provided", () => {
    expect(
      resolveGuideImage({
        slug: "any-slug",
        template: "blog-page",
        heroImage: "https://example.com/custom.jpg",
      })
    ).toBe("https://example.com/custom.jpg");
  });

  it("infers cost-topic imagery for unpublished slugs", () => {
    const image = resolveGuideImage({
      slug: "how-much-burial-insurance-costs",
      template: "blog-page",
      targetKeyword: "burial insurance cost",
    });
    expect(image).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });

  it("assigns distinct images to heart disease and stroke guides", () => {
    const heart = resolveGuideImage({
      slug: "final-expense-insurance-with-heart-disease",
      template: "condition-page",
      targetKeyword: "final expense insurance with heart disease",
    });
    const stroke = resolveGuideImage({
      slug: "final-expense-insurance-with-stroke",
      template: "condition-page",
      targetKeyword: "final expense insurance with stroke",
    });
    expect(heart).toContain("photo-1559757148-5c350d0d3c56");
    expect(stroke).toContain("photo-1612349317150-e413f6a5b16d");
    expect(heart).not.toBe(stroke);
  });

  it("resolves heart disease guide to a working Unsplash hero", () => {
    const image = resolveGuideImage({
      slug: "final-expense-insurance-with-heart-disease",
      template: "condition-page",
      targetKeyword: "final expense insurance with heart disease",
    });
    expect(image).toContain("photo-1559757148-5c350d0d3c56");
  });

  it("ignores removed Unsplash ids in frontmatter", () => {
    const image = resolveGuideImage({
      slug: "final-expense-insurance-with-heart-disease",
      template: "condition-page",
      heroImage:
        "https://images.unsplash.com/photo-1631217868264-e3b3675f68d8?auto=format&fit=crop&w=900&q=80",
    });
    expect(image).toContain("photo-1559757148-5c350d0d3c56");
  });

  it("assigns distinct images to new condition guides", () => {
    const copd = resolveGuideImage({
      slug: "final-expense-insurance-with-emphysema",
      template: "condition-page",
      targetKeyword: "final expense insurance with emphysema",
    });
    const diabetes = resolveGuideImage({
      slug: "final-expense-insurance-with-type-2-diabetes",
      template: "blog-page",
      targetKeyword: "final expense insurance with type 2 diabetes",
    });
    expect(copd).not.toBe(diabetes);
  });
});
