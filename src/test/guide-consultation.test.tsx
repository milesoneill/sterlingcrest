import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import BlogPage from "@/templates/BlogPage";
import LocationPage from "@/templates/LocationPage";
import InsuranceTypePage from "@/templates/InsuranceTypePage";
import { parseSeoMdx } from "@/lib/parse-seo-mdx";

const renderGuide = (extra: Record<string, unknown> = {}, Template: typeof BlogPage = BlogPage) => {
  const parsed = parseSeoMdx(`---\n${JSON.stringify({
    title: "Guide", slug: "test-guide", template: "blog-page", ...extra,
  })}\n---\n\n**Quick answer:** Read the policy terms.\n\n## Policy details\n\nKeep this educational text.`);
  return renderToStaticMarkup(<MemoryRouter><Template page={{ ...parsed, path: "/resources/test-guide", file: "test-guide.mdx" }} /></MemoryRouter>);
};

for (const [name, Template, defaultClosing] of [
  ["blog", BlogPage, "The right protection starts with the right conversation."],
  ["location", LocationPage, "Final expense help for families in your area."],
  ["insurance", InsuranceTypePage, "Start with the conversation that protects your family."],
] as const) describe(`${name} consultation copy`, () => {
  it("renders article-specific messages once and keeps both booking links", () => {
    const html = renderGuide({
      consultationCta: { heading: "Compare early benefits", body: "Bring your questions to Sterling Crest." },
      closingCta: { heading: "Talk through the details", body: "Your consultation is complimentary." },
    }, Template);
    expect(html.split("Compare early benefits")).toHaveLength(2);
    expect(html.split("Talk through the details")).toHaveLength(2);
    expect(html).toContain("Bring your questions to Sterling Crest.");
    expect(html).toContain("Your consultation is complimentary.");
    expect(html).toContain("Keep this educational text.");
    expect(html.match(/href="\/book"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).not.toContain("Want to see what coverage could look like for you?");
  });

  it("preserves existing messages when a guide has no custom copy", () => {
    const html = renderGuide({}, Template);
    expect(html).toContain("Want to see what coverage could look like for you?");
    expect(html).toContain(defaultClosing);
  });

  it("falls back to existing messages for incomplete or malformed metadata", () => {
    const html = renderGuide({ consultationCta: { heading: "", body: "Unused" }, closingCta: "invalid" }, Template);
    expect(html).toContain("Want to see what coverage could look like for you?");
    expect(html).toContain(defaultClosing);
    expect(html).not.toContain("Unused");
  });
});
