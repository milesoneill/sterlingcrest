import { describe, expect, it } from "vitest";
import { listSeoPages } from "@/lib/seo-content";
import { services } from "@/lib/services";
import { renderSitemap, sitemapUrls, SITE_ORIGIN } from "../../scripts/sitemap";

describe("build sitemap", () => {
  it("includes every published guide and service, and discovers a newly published guide", () => {
    const pages = listSeoPages();
    const urls = sitemapUrls(pages.map(page => page.frontmatter), services.map(service => service.slug));
    for (const page of pages) expect(urls).toContain(`${SITE_ORIGIN}${page.path}`);
    for (const service of services) expect(urls).toContain(`${SITE_ORIGIN}/services/${service.slug}`);
    expect(urls).not.toContain(`${SITE_ORIGIN}/locations`);
    expect(urls).not.toContain(`${SITE_ORIGIN}/compare`);
    const next = sitemapUrls([...pages.map(page => page.frontmatter), {
      title: "New guide", template: "blog-page", slug: "newly-published-guide",
    }], services.map(service => service.slug));
    expect(next).toContain(`${SITE_ORIGIN}/resources/newly-published-guide`);
    const xml = new DOMParser().parseFromString(renderSitemap(urls), "application/xml");
    expect(xml.querySelector("parsererror")).toBeNull();
    expect(xml.querySelectorAll("loc").length).toBe(urls.length);
  });

  it("rejects a canonical pointing to the wrong domain before deployment", () => {
    expect(() => sitemapUrls([{
      title: "Guide", template: "blog-page", slug: "guide",
      canonical: "https://sterlingcrest.com/resources/guide",
    }], [])).toThrow(/Canonical does not match/);
  });
});
