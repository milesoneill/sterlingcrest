import type { LucideIcon } from "lucide-react";
import {
  Heart,
  Home,
  Clock,
  Shield,
  Landmark,
  Coins,
} from "lucide-react";

export type ServiceBenefit = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  intro: string;
  whyHeading: string;
  whyBody: string;
  benefits: ServiceBenefit[];
  cardDescription: string;
  heroImage?: string;
  consultationCopy?: string;
  relatedGuides?: {
    heading: string;
    description?: string;
    layout: "inline" | "stack";
    links: { title: string; href: string }[];
  };
};

export const services: Service[] = [
  {
    slug: "final-expense",
    icon: Heart,
    title: "Final Expense Insurance",
    tagline: "Protect Your Family From Unexpected Financial Burdens",
    intro:
      "Final expense insurance is designed to help families navigate one of life's most difficult moments with greater financial confidence. By helping cover funeral expenses, outstanding medical bills, and other final obligations, this coverage can reduce the financial burden placed on loved ones during an already emotional time.",
    whyHeading: "Why Families Consider Final Expense Coverage",
    whyBody:
      "The cost of a funeral and related expenses can place significant financial strain on surviving family members. Final expense insurance provides a dedicated source of funds that can help loved ones focus on what matters most rather than worrying about immediate financial obligations.",
    benefits: [
      {
        title: "Permanent Protection",
        description:
          "Coverage is designed to remain in force for life, providing lasting peace of mind.",
      },
      {
        title: "Predictable Premiums",
        description:
          "Many policies offer fixed premiums that remain consistent over time.",
      },
      {
        title: "Simplified Qualification Options",
        description:
          "Many individuals may qualify without extensive medical requirements.",
      },
      {
        title: "Financial Relief for Loved Ones",
        description:
          "Benefits can help cover funeral expenses, medical bills, and other final costs.",
      },
    ],
    cardDescription:
      "Cover end-of-life costs so your loved ones aren't left with the burden.",
    heroImage: "/images/final-expense-family-at-home.jpg",
    consultationCopy:
      "Schedule a complimentary consultation to discuss your goals and coverage questions.",
    relatedGuides: {
      heading: "Helpful Final Expense Guides",
      layout: "inline",
      links: [
        { title: "Funeral Expenses Checklist", href: "/resources/funeral-expenses-checklist" },
        { title: "How Much Final Expense Insurance Do I Need?", href: "/resources/how-much-final-expense-insurance-do-i-need" },
        { title: "Waiting Periods: What to Check", href: "/resources/final-expense-insurance-waiting-period" },
      ],
    },
  },
  {
    slug: "mortgage-protection",
    icon: Home,
    title: "Mortgage Protection",
    tagline: "Helping Safeguard the Home You've Worked Hard to Build",
    intro:
      "For many families, a home represents security, stability, and years of hard work. Mortgage protection life insurance can help your family manage housing costs after a covered death. We help you review your mortgage, existing life insurance, and budget so you can compare options with confidence.",
    whyHeading: "Why Homeowners Consider Mortgage Protection",
    whyBody:
      "A mortgage is often one of the largest financial commitments a family will ever undertake. Having a plan in place can help protect loved ones from the burden of ongoing housing expenses during a difficult transition.",
    benefits: [
      {
        title: "Protect Your Home",
        description:
          "Provides financial support that can help preserve housing stability for your family.",
      },
      {
        title: "Support Your Family",
        description:
          "A life insurance benefit can help your named beneficiary manage ongoing household costs.",
      },
      {
        title: "Flexible Coverage Options",
        description:
          "Compare benefit amounts, policy terms, and premiums around your goals and budget.",
      },
      {
        title: "Plan With Confidence",
        description:
          "Understand who receives the benefit and what the policy covers before you apply.",
      },
    ],
    cardDescription:
      "Keep your family in their home if the unexpected happens.",
    consultationCopy:
      "Schedule a complimentary consultation to review your mortgage, coverage options, and goals with a licensed professional.",
    relatedGuides: {
      heading: "Helpful Mortgage Protection Guides",
      description: "Learn more about how mortgage protection works and whether it may be a good fit for your family's needs.",
      layout: "stack",
      links: [
        { title: "How Much Mortgage Protection Do I Need?", href: "/resources/how-much-mortgage-protection-insurance-do-i-need" },
        { title: "Mortgage Protection vs. PMI", href: "/resources/mortgage-protection-vs-pmi" },
        { title: "Is Life Insurance Through Work Enough?", href: "/resources/mortgage-protection-employer-life-insurance-gap" },
      ],
    },
  },
  {
    slug: "term-life",
    icon: Clock,
    title: "Term Life Insurance",
    tagline: "Affordable Protection for Life's Most Important Years",
    intro:
      "Term life insurance provides a straightforward and cost-effective way to help protect the people who depend on you financially. Whether you're raising a family, paying off a mortgage, or building toward future goals, term coverage can provide meaningful protection during the years it is needed most.",
    whyHeading: "Why Families Choose Term Life Insurance",
    whyBody:
      "Term life insurance is often the foundation of a sound financial protection strategy because it allows individuals to obtain substantial coverage at an affordable cost.",
    benefits: [
      {
        title: "Cost-Effective Coverage",
        description:
          "Often provides the highest amount of coverage for the lowest premium.",
      },
      {
        title: "Flexible Protection Periods",
        description:
          "Coverage terms can be selected to align with specific financial goals.",
      },
      {
        title: "Income Replacement",
        description:
          "Helps protect your family's financial future should the unexpected occur.",
      },
      {
        title: "Protection for Major Obligations",
        description:
          "Can help provide funds to address mortgages, debts, education costs, and other responsibilities.",
      },
    ],
    cardDescription:
      "Affordable coverage that protects your family for the years that matter most.",
  },
  {
    slug: "whole-life",
    icon: Shield,
    title: "Whole Life Insurance",
    tagline: "Lifelong Protection Designed for Long-Term Security",
    intro:
      "Whole life insurance combines permanent life insurance protection with features designed to support long-term financial planning. For individuals seeking certainty and stability, it can serve as a valuable component of a broader financial strategy.",
    whyHeading: "Why Individuals Consider Whole Life Insurance",
    whyBody:
      "Unlike temporary coverage, whole life insurance is designed to remain in force throughout your lifetime while providing guaranteed benefits and the opportunity to accumulate cash value over time.",
    benefits: [
      {
        title: "Permanent Coverage",
        description: "Designed to provide lifelong protection.",
      },
      {
        title: "Stable Premiums",
        description:
          "Premium payments generally remain consistent throughout the life of the policy.",
      },
      {
        title: "Cash Value Accumulation",
        description:
          "Policies build cash value that may be accessed under certain circumstances.",
      },
      {
        title: "Long-Term Financial Planning",
        description:
          "Can play an important role in legacy and estate planning objectives.",
      },
    ],
    cardDescription:
      "Lifelong protection with guaranteed value that grows over time.",
  },
  {
    slug: "retirement-legacy",
    icon: Landmark,
    title: "Retirement & Legacy Planning",
    tagline: "Building Financial Confidence for the Future",
    intro:
      "Retirement and legacy planning is about more than accumulating assets—it's about creating a strategy that reflects your goals, values, and the future you envision for your family. Thoughtful planning can help provide confidence during retirement while creating opportunities to leave a meaningful legacy.",
    whyHeading: "Why Planning Matters",
    whyBody:
      "A well-structured plan can help address retirement income needs, wealth preservation objectives, and the efficient transfer of assets to future generations.",
    benefits: [
      {
        title: "Retirement Income Strategies",
        description:
          "Create a plan designed to support your desired lifestyle.",
      },
      {
        title: "Legacy Preservation",
        description:
          "Help protect and transfer assets according to your wishes.",
      },
      {
        title: "Long-Term Perspective",
        description: "Align today's decisions with tomorrow's goals.",
      },
      {
        title: "Personalized Guidance",
        description:
          "Strategies built around your unique circumstances and priorities.",
      },
    ],
    cardDescription:
      "Strategies to preserve your wealth and pass it on with confidence.",
  },
  {
    slug: "annuity",
    icon: Coins,
    title: "Annuity Solutions",
    tagline: "Creating Greater Certainty in Retirement",
    intro:
      "Annuities can play an important role in a comprehensive retirement strategy by helping provide reliable income and protection against some of retirement's most common financial concerns.",
    whyHeading: "Why Individuals Consider Annuities",
    whyBody:
      "Many retirees worry about market volatility, unpredictable income, and outliving their savings. Annuity solutions can help address these concerns by providing additional stability and predictability.",
    benefits: [
      {
        title: "Guaranteed Income Options",
        description: "Create a dependable source of retirement income.",
      },
      {
        title: "Protection-Oriented Solutions",
        description:
          "Certain annuities offer features designed to help protect principal.",
      },
      {
        title: "Tax-Deferred Growth Potential",
        description: "Assets can grow tax-deferred until withdrawn.",
      },
      {
        title: "Retirement Confidence",
        description:
          "Provides greater certainty when planning for long-term financial needs.",
      },
    ],
    cardDescription:
      "Reliable, guaranteed income you can count on in retirement.",
  },
];

export const servicesBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service]),
) as Record<string, Service>;

export function getService(slug: string): Service | undefined {
  return servicesBySlug[slug];
}
