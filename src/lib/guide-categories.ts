import type { SeoPage } from "./seo-content";
import type { SeoContentPillar } from "./parse-seo-mdx";

export type GuideCollectionId = SeoContentPillar;

export const GUIDE_CATEGORIES = [
  {
    id: "funeral-costs",
    title: "Funeral Costs & Planning",
    description: "Understand costs and plan a meaningful farewell.",
  },
  {
    id: "choosing-coverage",
    title: "Choosing Coverage",
    description: "Compare options and know what to ask.",
  },
  {
    id: "health-eligibility",
    title: "Health & Eligibility",
    description: "Learn how health can affect your options.",
  },
  {
    id: "managing-policy",
    title: "Managing Your Policy",
    description: "Keep your coverage details up to date.",
  },
  {
    id: "claims-family",
    title: "Claims & Family Support",
    description: "Find clear next steps after a loss.",
  },
  {
    id: "state-guides",
    title: "State Guides",
    description: "Explore guidance for your state.",
  },
] as const;

export const MORTGAGE_PROTECTION_CATEGORIES = [
  {
    id: "coverage-basics",
    title: "Coverage Basics",
    description: "Understand what mortgage protection covers and how it compares.",
  },
  {
    id: "coverage-amount-cost",
    title: "Coverage Amount & Cost",
    description: "Estimate how much coverage you need and what affects the price.",
  },
  {
    id: "shopping-applying",
    title: "Shopping & Applying",
    description: "Compare quotes and know what to expect when you apply.",
  },
  {
    id: "household-coverage",
    title: "Protecting Your Household",
    description: "Plan coverage around your partner, family, and existing life insurance.",
  },
  {
    id: "loan-policy-changes",
    title: "Loan & Policy Changes",
    description: "Know when to review coverage after a refinance, move, or loan change.",
  },
  {
    id: "payouts-coverage-limits",
    title: "Payouts & Coverage Limits",
    description: "See how benefits are paid and where coverage has limits.",
  },
] as const;

type FinalExpenseGuideCategoryId = (typeof GUIDE_CATEGORIES)[number]["id"];
type MortgageProtectionGuideCategoryId = (typeof MORTGAGE_PROTECTION_CATEGORIES)[number]["id"];
export type GuideCategoryId = FinalExpenseGuideCategoryId | MortgageProtectionGuideCategoryId;
export type GuideCategorySelection = GuideCategoryId | "all";

// Give the current library one reviewed home per article. Fallbacks below keep
// future Factory articles browsable without changing their published URLs.
const CURATED_GUIDES: Record<Exclude<FinalExpenseGuideCategoryId, "state-guides">, readonly string[]> = {
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

const CURATED_MORTGAGE_GUIDES: Record<MortgageProtectionGuideCategoryId, readonly string[]> = {
  "coverage-basics": [
    "what-is-mortgage-protection-insurance",
    "mortgage-protection-vs-pmi",
    "homeowners-insurance-vs-mortgage-protection",
    "va-loan-vs-veterans-mortgage-life-insurance",
  ],
  "coverage-amount-cost": [
    "how-much-mortgage-protection-insurance-do-i-need",
    "choosing-life-insurance-term-for-mortgage",
    "mortgage-protection-life-insurance-cost-factors",
    "level-vs-decreasing-mortgage-protection",
  ],
  "shopping-applying": [
    "mortgage-protection-quote-checklist",
    "mortgage-protection-no-medical-exam",
    "mortgage-protection-before-or-after-closing",
    "mortgage-protection-letter-after-closing",
  ],
  "household-coverage": [
    "mortgage-protection-life-insurance-both-spouses",
    "mortgage-protection-unmarried-co-buyers",
    "mortgage-protection-employer-life-insurance-gap",
    "term-life-insurance-for-mortgage-protection",
  ],
  "loan-policy-changes": [
    "mortgage-protection-adjustable-rate-mortgage-payment",
    "mortgage-protection-heloc-second-mortgage",
    "mortgage-protection-after-refinancing-or-moving",
    "mortgage-protection-term-life-conversion-deadline",
  ],
  "payouts-coverage-limits": [
    "life-insurance-payout-mortgage-payoff-or-cash",
    "what-happens-to-mortgage-when-borrower-dies",
    "mortgage-protection-insurance-beneficiary",
    "mortgage-protection-disability-job-loss",
  ],
};

const categoryBySlug = new Map<string, FinalExpenseGuideCategoryId>(
  Object.entries(CURATED_GUIDES).flatMap(([category, slugs]) =>
    slugs.map((slug) => [slug, category as FinalExpenseGuideCategoryId] as const),
  ),
);

const mortgageCategoryBySlug = new Map<string, MortgageProtectionGuideCategoryId>(
  Object.entries(CURATED_MORTGAGE_GUIDES).flatMap(([category, slugs]) =>
    slugs.map((slug) => [slug, category as MortgageProtectionGuideCategoryId] as const),
  ),
);

const normalize = (text: string): string =>
  text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Use approved article metadata first; older guides retain a stable fallback. */
export function guideCollection(page: SeoPage): GuideCollectionId {
  if (page.frontmatter.contentPillar === "final-expense" || page.frontmatter.contentPillar === "mortgage-protection") {
    return page.frontmatter.contentPillar;
  }
  // Classify the article's subject, not its body links or source citations.
  const identity = normalize([
    page.frontmatter.slug,
    page.frontmatter.title,
    page.frontmatter.targetKeyword,
    page.frontmatter.primaryQuestion,
  ].filter(Boolean).join(" ")).replace(/[-_]/g, " ");
  return /\b(?:mortgage|pmi|mpi)\b|\bhome loan\b/.test(identity)
    ? "mortgage-protection"
    : "final-expense";
}

export function collectionCounts(pages: readonly SeoPage[]): Record<GuideCollectionId, number> {
  const counts: Record<GuideCollectionId, number> = { "final-expense": 0, "mortgage-protection": 0 };
  for (const page of pages) counts[guideCollection(page)] += 1;
  return counts;
}

function guideTopicText(page: SeoPage): string {
  return normalize(`${page.frontmatter.slug} ${page.frontmatter.title}`).replace(/[-_]/g, " ");
}

function mortgageGuideCategory(page: SeoPage): MortgageProtectionGuideCategoryId {
  const curated = mortgageCategoryBySlug.get(page.frontmatter.slug);
  if (curated) return curated;

  const text = guideTopicText(page);
  if (/\b(?:payouts?|beneficiar\w*|claims?|after a death|borrower dies|job loss|disability)\b/.test(text)) {
    return "payouts-coverage-limits";
  }
  if (/\b(?:refinanc\w*|moving|heloc|second mortgage|adjustable rate|conversion|convert|policy review)\b/.test(text)) {
    return "loan-policy-changes";
  }
  if (/\b(?:quotes?|apply|applying|applications?|closing|medical exam|underwriting)\b/.test(text)) {
    return "shopping-applying";
  }
  if (/\b(?:costs?|premiums?|budget|coverage amount|how much|term length|decreasing)\b/.test(text)) {
    return "coverage-amount-cost";
  }
  if (/\b(?:spouses?|co borrowers?|partners?|employer|group life|household)\b/.test(text)) {
    return "household-coverage";
  }
  return "coverage-basics";
}

export function guideCategory(page: SeoPage): GuideCategoryId {
  if (guideCollection(page) === "mortgage-protection") return mortgageGuideCategory(page);
  // Location/condition templates describe intent more reliably than keywords
  // such as "cost" appearing in a health or state guide's title.
  if (page.frontmatter.template === "location-page" || page.path.startsWith("/locations/")) {
    return "state-guides";
  }
  if (page.frontmatter.template === "condition-page") return "health-eligibility";

  const curated = categoryBySlug.get(page.frontmatter.slug);
  if (curated) return curated;

  const text = guideTopicText(page);
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
  const counts = Object.fromEntries(
    [...GUIDE_CATEGORIES, ...MORTGAGE_PROTECTION_CATEGORIES].map(({ id }) => [id, 0]),
  ) as Record<GuideCategoryId, number>;
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
  { collection, category = "all", query = "" }: {
    collection?: GuideCollectionId;
    category?: GuideCategorySelection;
    query?: string;
  } = {},
): T[] {
  const queryWords = normalize(query).split(/[^a-z0-9]+/).filter(Boolean);
  return pages.filter((page) => {
    if (collection && guideCollection(page) !== collection) return false;
    if (category !== "all" && guideCategory(page) !== category) return false;
    if (queryWords.length === 0) return true;
    const words = searchWords(page);
    return queryWords.every((queryWord) => words.some((word) => word.startsWith(queryWord)));
  });
}
