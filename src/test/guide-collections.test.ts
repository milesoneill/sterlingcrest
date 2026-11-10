import { describe, expect, it } from "vitest";
import { collectionCounts, filterGuides, guideCollection } from "@/lib/guide-categories";
import { listGuideIndexPages, type SeoPage } from "@/lib/seo-content";
import { parseSeoMdx } from "@/lib/parse-seo-mdx";

const guides = listGuideIndexPages();
const example = guides.find((page) => page.frontmatter.slug === "what-is-final-expense-insurance")!;
const sample = (frontmatter: Partial<SeoPage["frontmatter"]>, body = "A family planning guide."): SeoPage => ({
  ...example,
  frontmatter: { ...example.frontmatter, contentPillar: undefined, ...frontmatter },
  body,
});

describe("Guide collections", () => {
  it("keeps all 139 published links and partitions them into 115 Final Expense and 24 Mortgage Protection guides", () => {
    const counts = collectionCounts(guides);
    const finalExpense = filterGuides(guides, { collection: "final-expense" });
    const mortgage = filterGuides(guides, { collection: "mortgage-protection" });
    expect(guides).toHaveLength(139);
    expect(counts).toEqual({ "final-expense": 115, "mortgage-protection": 24 });
    expect(finalExpense).toHaveLength(115);
    expect(mortgage).toHaveLength(24);
    expect(new Set([...finalExpense, ...mortgage].map((page) => page.path)).size).toBe(139);
    expect([...finalExpense, ...mortgage].map((page) => page.path).sort()).toEqual(guides.map((page) => page.path).sort());
    expect(mortgage.map((page) => page.frontmatter.slug)).toContain("mortgage-protection-insurance-beneficiary");
    expect(finalExpense.map((page) => page.frontmatter.slug)).toContain("choose-final-expense-insurance-beneficiary");
    expect(filterGuides(guides)).toEqual(guides);
  });

  it("retains only validated content-pillar metadata and honors it before name heuristics", () => {
    const parse = (contentPillar: string) => parseSeoMdx(`---\n${JSON.stringify({ title: "An unfamiliar topic", slug: "future-guide", template: "blog-page", contentPillar })}\n---\n\n## A guide\n\nUseful explanation.`).frontmatter;
    expect(parse("mortgage-protection").contentPillar).toBe("mortgage-protection");
    expect(parse("final-expense").contentPillar).toBe("final-expense");
    expect(parse("unrecognized").contentPillar).toBeUndefined();
    expect(guideCollection(sample({ slug: "neutral-new-guide", title: "A Future Family Question", contentPillar: "mortgage-protection" }))).toBe("mortgage-protection");
    expect(guideCollection(sample({ slug: "mortgage-mentioned-in-title", title: "Mortgage Questions", contentPillar: "final-expense" }))).toBe("final-expense");
  });

  it("keeps legacy and future guides browsable without treating every life-insurance topic as Mortgage Protection", () => {
    expect(guideCollection(sample({ slug: "new-mortgage-protection-question", title: "Protecting a Home Loan" }))).toBe("mortgage-protection");
    expect(guideCollection(sample({ slug: "pmi-basics", title: "What Is PMI?" }))).toBe("mortgage-protection");
    expect(guideCollection(sample({ slug: "future-term-policy", title: "Understanding Term Life Insurance" }))).toBe("final-expense");
    expect(guideCollection(sample({ slug: "family-planning", title: "Final Expense Planning" }, "## Mortgage protection\n\nAn incidental mention is not the guide's main intent."))).toBe("final-expense");
  });

  it("scopes a shared insurance search and intersects a Final Expense topic without leaking other products", () => {
    const before = guides.map((page) => page.path);
    for (const collection of ["final-expense", "mortgage-protection"] as const) {
      const matches = filterGuides(guides, { collection, query: " insurance " });
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((page) => guideCollection(page) === collection)).toBe(true);
    }
    const claims = filterGuides(guides, { collection: "final-expense", category: "claims-family", query: "death" });
    expect(claims.map((page) => page.frontmatter.slug)).toContain("death-certificate-life-insurance-claim");
    expect(claims.every((page) => guideCollection(page) === "final-expense")).toBe(true);
    expect(filterGuides(guides, { collection: "mortgage-protection", category: "health-eligibility" })).toEqual([]);
    expect(guides.map((page) => page.path)).toEqual(before);
  });
});
