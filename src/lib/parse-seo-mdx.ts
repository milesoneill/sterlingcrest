export type SeoSource = { label: string; url: string };
export type SeoFaq = { question: string; answer: string };
export type SeoConsultationCta = { heading: string; body: string };

export type SeoFrontmatter = {
  title: string;
  guideLayout?: "editorial";
  summary?: string;
  updatedAt?: string;
  slug: string;
  description?: string;
  canonical?: string;
  template: string;
  lane?: string;
  targetState?: string | null;
  targetKeyword?: string;
  briefId?: string;
  primaryQuestion?: string;
  schema?: unknown[];
  disclosures?: string[];
  internalLinks?: string[];
  sources?: SeoSource[];
  generatedAt?: string;
  /** Optional hero/thumbnail image URL or Unsplash photo id from SEO Factory. */
  heroImage?: string;
  consultationCta?: SeoConsultationCta;
  closingCta?: SeoConsultationCta;
};

export type ParsedSeoMdx = {
  frontmatter: SeoFrontmatter;
  body: string;
  aeoAnswer: string | null;
  faq: SeoFaq[];
};

export const TEMPLATE_PATH_PREFIX: Record<string, string> = {
  "blog-page": "/resources",
  "comparison-page": "/resources",
  "faq-cluster": "/resources",
  "condition-page": "/resources",
  "insurance-type-page": "/insurance",
  "location-page": "/locations",
};

export function publicPathForTemplate(template: string, slug: string): string {
  const prefix = TEMPLATE_PATH_PREFIX[template] ?? "/resources";
  const clean = slug
    .replace(/^\/+/, "")
    .replace(/\.(mdx|md)$/i, "")
    .replace(/^(resources|insurance|locations)\//, "");
  return `${prefix}/${clean}`;
}

export function parseSeoMdx(raw: string): ParsedSeoMdx {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("SEO MDX is missing JSON/YAML frontmatter.");
  }
  const frontmatter = parseFrontmatter(match[1]);
  const { body, aeoAnswer, faq } = splitBodyAndFaq(match[2].trim());
  return { frontmatter, body, aeoAnswer, faq };
}

function parseFrontmatter(block: string): SeoFrontmatter {
  const trimmed = block.trim();
  const data = trimmed.startsWith("{")
    ? (JSON.parse(trimmed) as Record<string, unknown>)
    : parseLooseYaml(trimmed);
  const slug = String(data.slug ?? "").replace(/^\/+/, "");
  const title = String(data.title ?? "Untitled");
  const template = String(data.template ?? "blog-page");
  return {
    title,
    guideLayout: data.guideLayout === "editorial" ? "editorial" : undefined,
    summary: typeof data.summary === "string" ? data.summary : undefined,
    updatedAt: typeof data.updatedAt === "string" && !Number.isNaN(Date.parse(data.updatedAt)) ? data.updatedAt : undefined,
    slug,
    description: data.description ? String(data.description) : undefined,
    canonical: data.canonical ? String(data.canonical) : undefined,
    template,
    lane: data.lane ? String(data.lane) : undefined,
    targetState: (data.targetState as string | null | undefined) ?? null,
    targetKeyword: data.targetKeyword ? String(data.targetKeyword) : undefined,
    briefId: data.briefId ? String(data.briefId) : undefined,
    primaryQuestion: data.primaryQuestion ? String(data.primaryQuestion) : undefined,
    // Editorial guides do not accept user-submitted answers. QAPage is for
    // community Q&A; keep the Article and FAQPage metadata instead.
    schema: Array.isArray(data.schema) ? data.schema.filter(block => {
      if (!block || typeof block !== "object") return true;
      const type = (block as Record<string, unknown>)["@type"];
      return type !== "QAPage" && !(Array.isArray(type) && type.includes("QAPage"));
    }) : undefined,
    disclosures: Array.isArray(data.disclosures)
      ? data.disclosures.map(String)
      : undefined,
    internalLinks: Array.isArray(data.internalLinks)
      ? data.internalLinks.map(String)
      : undefined,
    sources: Array.isArray(data.sources)
      ? (data.sources as SeoSource[])
      : undefined,
    generatedAt: data.generatedAt ? String(data.generatedAt) : undefined,
    heroImage: data.heroImage ? String(data.heroImage) : undefined,
    consultationCta: parseConsultationCta(data.consultationCta),
    closingCta: parseConsultationCta(data.closingCta),
  };
}

function parseConsultationCta(value: unknown): SeoConsultationCta | undefined {
  if (!value || typeof value !== "object") return undefined;
  const { heading, body } = value as Record<string, unknown>;
  if (typeof heading !== "string" || typeof body !== "string") return undefined;
  if (!heading.trim() || !body.trim()) return undefined;
  return { heading: heading.trim(), body: body.trim() };
}

function parseLooseYaml(block: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const line of block.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) out[key] = value;
  }
  return out;
}

export function splitBodyAndFaq(markdown: string): {
  body: string;
  aeoAnswer: string | null;
  faq: SeoFaq[];
} {
  let rest = markdown.trim();
  let aeoAnswer: string | null = null;
  const quick = rest.match(/^\*\*Quick answer:\*\*\s*([\s\S]*?)(?:\n{2,}|$)/i);
  if (quick) {
    aeoAnswer = quick[1].trim();
    rest = rest.slice(quick[0].length).trim();
  }

  const faqHeading = /^##\s+Frequently Asked Questions\s*$/im;
  const faqIdx = rest.search(faqHeading);
  let faq: SeoFaq[] = [];
  if (faqIdx !== -1) {
    const afterHeading = rest.slice(faqIdx).replace(faqHeading, "");
    const nextSection = afterHeading.search(/\n##\s+/);
    const faqBlock =
      nextSection === -1 ? afterHeading : afterHeading.slice(0, nextSection);
    const trailing =
      nextSection === -1 ? "" : afterHeading.slice(nextSection).trim();
    rest = [rest.slice(0, faqIdx).trim(), trailing].filter(Boolean).join("\n\n");
    faq = parseFaqMarkdown(faqBlock.trim());
  }

  return { body: rest, aeoAnswer, faq };
}

export function parseFaqMarkdown(block: string): SeoFaq[] {
  const chunks = block.split(/\n(?=\*\*)/);
  const faq: SeoFaq[] = [];
  for (const chunk of chunks) {
    const m = chunk.match(/^\*\*(.+?)\*\*\s*\n+([\s\S]+)$/);
    if (!m) continue;
    faq.push({
      question: m[1].trim(),
      answer: m[2].trim(),
    });
  }
  return faq;
}
