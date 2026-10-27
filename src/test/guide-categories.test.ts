import { describe, expect, it } from "vitest";
import { listGuideIndexPages, type SeoPage } from "../lib/seo-content";
import { GUIDE_CATEGORIES, categoryCounts, filterGuides, guideCategory } from "../lib/guide-categories";

const guides = listGuideIndexPages();
const guide = (slug: string): SeoPage => {
  const found = guides.find((page) => page.frontmatter.slug === slug);
  if (!found) throw new Error(`Expected current guide: ${slug}`);
  return found;
};

describe("Guide browsing categories", () => {
  it("gives every indexed guide exactly one category and keeps every article link", () => {
    const counts = categoryCounts(guides);
    const grouped = GUIDE_CATEGORIES.flatMap(({ id }) => {
      const selected = filterGuides(guides, { category: id });
      expect(counts[id]).toBe(selected.length);
      return selected;
    });
    expect(grouped.length).toBe(guides.length);
    expect(new Set(grouped.map((page) => page.path)).size).toBe(guides.length);
    expect(grouped.map((page) => page.path).sort()).toEqual(guides.map((page) => page.path).sort());
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(guides.length);
    expect(filterGuides(guides)).toEqual(guides);
  });

  it("keeps practical funeral budgets separate from insurance prices and policy payments", () => {
    for (const slug of ["funeral-flowers-obituary-cost-questions", "cremation-costs-questions", "casket-price-questions", "social-security-funeral-costs", "veterans-burial-benefits-funeral-planning"]) {
      expect(guideCategory(guide(slug))).toBe("funeral-costs");
    }
    expect(guideCategory(guide("how-much-does-final-expense-insurance-cost"))).toBe("choosing-coverage");
    expect(guideCategory(guide("life-insurance-premium-autopay"))).toBe("managing-policy");
    expect(guideCategory(guide("death-certificate-life-insurance-claim"))).toBe("claims-family");
  });

  it("recognizes state and health intent before cost keywords", () => {
    const sample = guide("funeral-expenses-checklist");
    expect(guideCategory({ ...sample, path: "/locations/example", frontmatter: { ...sample.frontmatter, slug: "funeral-costs-example", template: "location-page" } })).toBe("state-guides");
    expect(guideCategory({ ...sample, frontmatter: { ...sample.frontmatter, slug: "diabetes-funeral-costs", template: "condition-page" } })).toBe("health-eligibility");
    expect(guideCategory(guide("final-expense-insurance-with-diabetes"))).toBe("health-eligibility");
  });

  it("lets a reader search across case, accents, partial words, and extra spacing", () => {
    const results = filterGuides(guides, { query: "  FUNÉRAL   flow  " });
    expect(results.map((page) => page.frontmatter.slug)).toContain("funeral-flowers-obituary-cost-questions");
    expect(filterGuides(guides, { query: "  " })).toEqual(guides);
    expect(filterGuides(guides, { query: "flower xylophone" })).toEqual([]);
  });

  it("combines category and query without changing the original alphabetical list", () => {
    const paths = guides.map((page) => page.path);
    const results = filterGuides(guides, { category: "funeral-costs", query: "flower" });
    expect(results.map((page) => page.frontmatter.slug)).toContain("funeral-flowers-obituary-cost-questions");
    expect(results.every((page) => guideCategory(page) === "funeral-costs")).toBe(true);
    expect(filterGuides(guides, { category: "state-guides", query: "xylophone" })).toEqual([]);
    expect(guides.map((page) => page.path)).toEqual(paths);
  });

  it("finds meaningful section headings but never matches citation URLs", () => {
    const original = guide("what-is-final-expense-insurance");
    const sample = { ...original, body: "## A helpful comparison\n\nText.\n\n## Sources\n\n[Vendor](https://example.com/secret-source-key)" };
    expect(filterGuides([sample], { query: "helpful comparison" })).toEqual([sample]);
    expect(filterGuides([sample], { query: "secret source key" })).toEqual([]);
  });

  it("keeps a future article browsable and recognizes common new topic types", () => {
    const original = guide("what-is-final-expense-insurance");
    const future = (slug: string, title: string): SeoPage => ({ ...original, frontmatter: { ...original.frontmatter, slug, title } });
    expect(guideCategory(future("new-insurance-topic", "A New Insurance Question"))).toBe("choosing-coverage");
    expect(guideCategory(future("diabetes-and-insurance", "A New Diabetes Question"))).toBe("health-eligibility");
    expect(guideCategory(future("claim-status", "Checking a Claim"))).toBe("claims-family");
    expect(guideCategory(future("memorial-costs", "Memorial Costs"))).toBe("funeral-costs");
    expect(guideCategory(future("update-your-beneficiary", "Update Your Beneficiary"))).toBe("managing-policy");
  });
});
