import { getSeoPageByPath } from "./seo-content";
import { getService } from "./services";
import { SITE_ORIGIN } from "./site-routes";
export const HOME_DESCRIPTION = "Independent life insurance guidance for final expense, mortgage protection, and family protection. Book a complimentary consultation with Sterling Crest Financial Group.";
export function routeMeta(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const article = getSeoPageByPath(path);
  const service = path.startsWith("/services/") ? getService(path.slice(10)) : undefined;
  const defaults: Record<string, [string, string]> = {
    "/": ["Sterling Crest Financial Group | Life Insurance Guidance", HOME_DESCRIPTION],
    "/book": ["Book a Complimentary Consultation", "Schedule a complimentary, no-obligation 15-minute phone consultation with a licensed Sterling Crest specialist. Weekdays, 9 a.m.–6 p.m. Eastern."],
    "/resources": ["Guides for Families", "Explore Final Expense and Mortgage Protection guides, with clear answers for your family's next step from Sterling Crest Financial Group."],
    "/resources/final-expense": ["Final Expense Insurance Guides", "Explore final expense insurance, funeral costs, coverage choices, policy details, and family support in clear guides from Sterling Crest Financial Group."],
    "/resources/mortgage-protection": ["Mortgage Protection Insurance Guides", "Understand life insurance for mortgage protection, compare coverage choices, and plan for your family's home with guides from Sterling Crest Financial Group."],
    "/insurance": ["Insurance Coverage", "Explore life insurance coverage and speak with a licensed Sterling Crest specialist about your family's needs."],
    "/privacy-policy": ["Privacy Policy", "Read how Sterling Crest Financial Group handles your information."],
    "/terms-of-service": ["Terms of Service", "Read the terms for using the Sterling Crest Financial Group website."],
  };
  const known = !!(article || service || defaults[path]);
  const title = article?.frontmatter.title ?? service?.title ?? defaults[path]?.[0] ?? "Page Not Found";
  return {
    title: title.includes("Sterling Crest") ? title : `${title} | Sterling Crest Financial Group`,
    description: article?.frontmatter.description ?? service?.cardDescription ?? defaults[path]?.[1] ?? "The requested page could not be found. Explore our guides or book a consultation.",
    canonical: `${SITE_ORIGIN}${path}`,
    noindex: !known,
    isArticle: !!article,
  };
}
