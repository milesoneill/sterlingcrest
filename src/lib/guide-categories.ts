import type { SeoPage } from "./seo-content";

export const GUIDE_CATEGORIES = [
  {
    id: "funeral-costs",
    title: "Funeral Costs & Planning",
    description: "Understand costs and plan a meaningful farewell.",
  },
  {
    id: "choosing-coverage",
    title: "Choosing Coverage",
    description: "Explore insurance, compare options, and know what to ask.",
  },
  {
    id: "health-eligibility",
    title: "Health & Eligibility",
    description: "Learn how health questions can affect your options.",
  },
  {
    id: "managing-policy",
    title: "Managing Your Policy",
    description: "Keep payments, beneficiaries, and policy details up to date.",
  },
  {
    id: "claims-family",
    title: "Claims & Family Support",
    description: "Find practical steps for claims and records after a loss.",
  },
  {
    id: "state-guides",
    title: "State Guides",
    description: "Browse insurance guidance for your state.",
  },
] as const;

export type GuideCategoryId = (typeof GUIDE_CATEGORIES)[number]["id"];
export type GuideCategorySelection = GuideCategoryId | "all";

// Give the current library one reviewed home per article. Fallbacks below keep
// future Factory articles browsable without changing their published URLs.
const CURATED_GUIDES: Record<Exclude<GuideCategoryId, "state-guides">, readonly string[]> = {
  "funeral-costs": [
    "arrange-funeral-by-phone",
    "casket-price-questions",
    "cemetery-costs-checklist",
    "choose-funeral-provider-checklist",
    "cremation-costs-questions",
    "family-funeral-wishes-conversation",
    "funeral-basic-services-fee-questions",
    "funeral-expenses-checklist",
    "funeral-flowers-obituary-cost-questions",
    "funeral-planning-after-moving",
    "funeral-price-list-explained",
    "funeral-transportation-cost-questions",
    "memorial-gathering-cost-checklist",
    "plan-funeral-without-prepaying",
    "prepaid-funeral-plan-questions",
    "share-funeral-plans-with-distant-family",
    "social-security-funeral-costs",
    "veterans-burial-benefits-funeral-planning",
  ],
  "choosing-coverage": [
    "burial-insurance-advertised-prices",
    "burial-insurance-shopping-red-flags",
    "burial-insurance-vs-prepaid-funeral",
    "burial-insurance-vs-savings",
    "can-i-buy-burial-insurance-for-my-parents",
    "check-life-insurance-company-complaints",
    "existing-life-insurance-before-burial-coverage",
    "final-expense-insurance-monthly-budget",
    "final-expense-insurance-quote-checklist",
    "final-expense-insurance-rates-by-age",
    "final-expense-insurance-waiting-period",
    "final-expense-planning-for-couples",
    "final-expense-planning-retirement-checklist",
    "final-expense-planning-when-you-live-alone",
    "how-much-does-final-expense-insurance-cost",
    "how-much-final-expense-insurance-do-i-need",
    "insurance-broker-vs-insurance-company",
    "life-insurance-application-correction-questions",
    "life-insurance-brochure-questions",
    "life-insurance-financial-strength-ratings",
    "life-insurance-illustrations-explained",
    "life-insurance-premium-vs-coverage-amount",
    "multiple-life-insurance-policies",
    "online-burial-insurance-quotes",
    "prepare-final-expense-insurance-application",
    "questions-to-ask-final-expense-insurance-agent",
    "talk-to-parents-about-burial-insurance",
    "verify-life-insurance-agent-before-burial-quote",
    "what-is-final-expense-insurance",
    "why-burial-insurance-quotes-differ",
  ],
  "health-eligibility": [
    "final-expense-insurance-with-diabetes",
    "simplified-issue-vs-guaranteed-issue-final-expense-insurance",
  ],
  "managing-policy": [
    "annual-final-expense-policy-review",
    "burial-insurance-cash-value",
    "burial-insurance-payment-schedule",
    "choose-final-expense-insurance-beneficiary",
    "employer-life-insurance-retirement",
    "fixed-life-insurance-premium",
    "life-insurance-after-divorce",
    "life-insurance-after-losing-spouse",
    "life-insurance-free-look-period",
    "life-insurance-premium-autopay",
    "missed-life-insurance-premium-payment",
    "moving-states-life-insurance",
    "organize-final-expense-insurance-records",
    "paid-up-life-insurance",
    "primary-vs-contingent-life-insurance-beneficiary",
    "read-life-insurance-policy-summary",
    "replacing-burial-insurance-policy",
    "term-life-insurance-ending-final-expenses",
    "update-life-insurance-contact-details",
  ],
  "claims-family": [
    "death-certificate-life-insurance-claim",
    "funeral-home-life-insurance-payment",
    "life-insurance-claim-funeral-expenses",
    "missing-life-insurance-policy-records",
  ],
};

const categoryBySlug = new Map<string, GuideCategoryId>(
  Object.entries(CURATED_GUIDES).flatMap(([category, slugs]) =>
    slugs.map((slug) => [slug, category as GuideCategoryId] as const),
  ),
);

const normalize = (text: string): string =>
  text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function guideCategory(page: SeoPage): GuideCategoryId {
  // Location/condition templates describe intent more reliably than keywords
  // such as "cost" appearing in a health or state guide's title.
  if (page.frontmatter.template === "location-page" || page.path.startsWith("/locations/")) {
    return "state-guides";
  }
  if (page.frontmatter.template === "condition-page") return "health-eligibility";

  const curated = categoryBySlug.get(page.frontmatter.slug);
  if (curated) return curated;

  const text = normalize(`${page.frontmatter.slug} ${page.frontmatter.title}`).replace(/[-_]/g, " ");
  if (/\b(?:diabetes|copd|afib|stroke|heart disease|cancer|health|eligibility|underwriting|medical)\b/.test(text)) {
    return "health-eligibility";
  }
  if (/\b(?:claim|claims|death certificate|after a death|after a loss|missing policy)\b/.test(text)) {
    return "claims-family";
  }
  if (/\b(?:funeral|cremation|casket|cemetery|memorial|obituary|flowers)\b/.test(text) &&
      !/\b(?:insurance|coverage|policy|premium|quote)\b/.test(text)) {
    return "funeral-costs";
  }
  if (/\b(?:autopay|beneficiar\w*|missed payment|policy review|policy change|renewal|cash value|paid up|free look|replace|replacing|update|moving states)\b/.test(text)) {
    return "managing-policy";
  }
  return "choosing-coverage";
}

export function categoryCounts(pages: readonly SeoPage[]): Record<GuideCategoryId, number> {
  const counts = Object.fromEntries(GUIDE_CATEGORIES.map(({ id }) => [id, 0])) as Record<GuideCategoryId, number>;
  for (const page of pages) counts[guideCategory(page)] += 1;
  return counts;
}

function searchWords(page: SeoPage): string[] {
  const headings = [...page.body.matchAll(/^#{2,3}\s+(.+)$/gm)]
    .map((match) => match[1])
    .filter((heading) => !/^(?:sources|frequently asked questions)\b/i.test(heading));
  const text = [page.frontmatter.title, page.frontmatter.description, page.frontmatter.primaryQuestion, ...headings]
    .filter(Boolean).join(" ");
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
}

export function filterGuides<T extends SeoPage>(
  pages: readonly T[],
  { category = "all", query = "" }: { category?: GuideCategorySelection; query?: string } = {},
): T[] {
  const queryWords = normalize(query).split(/[^a-z0-9]+/).filter(Boolean);
  return pages.filter((page) => {
    if (category !== "all" && guideCategory(page) !== category) return false;
    if (queryWords.length === 0) return true;
    const words = searchWords(page);
    return queryWords.every((queryWord) => words.some((word) => word.startsWith(queryWord)));
  });
}
