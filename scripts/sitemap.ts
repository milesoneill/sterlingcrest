import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { parseSeoMdx, publicPathForTemplate, type SeoFrontmatter } from "../src/lib/parse-seo-mdx";
import { services } from "../src/lib/services";

import { SITE_ORIGIN, staticRoutes, routeRedirects } from "../src/lib/site-routes";
export { SITE_ORIGIN };

export function sitemapUrls(pages: SeoFrontmatter[], serviceSlugs: string[]): string[] {
  const paths = [...staticRoutes];
  paths.push(...serviceSlugs.map(slug => `/services/${slug}`));
  for (const page of pages) {
    const publicPath = publicPathForTemplate(page.template, page.slug);
    if (routeRedirects[publicPath]) continue;
    const expected = `${SITE_ORIGIN}${publicPath}`;
    if (page.canonical && page.canonical !== expected) {
      throw new Error(`Canonical does not match published route: ${page.slug}`);
    }
    paths.push(publicPath);
  }
  if (new Set(paths).size !== paths.length) throw new Error("Duplicate sitemap route");
  return paths.map(route => `${SITE_ORIGIN}${route}`).sort();
}

export function renderSitemap(urls: string[]): string {
  const escape = (value: string) => value.replace(/[<>&"']/g, c => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[c]!);
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join("\n") +
    "\n</urlset>\n";
}

export function sitemapPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: "sterling-crest-sitemap",
    apply: "build",
    configResolved(config) { root = config.root; },
    generateBundle() {
      const contentDir = path.join(root, "content/seo");
      const pages = fs.readdirSync(contentDir).filter(file => file.endsWith(".mdx"))
        .map(file => parseSeoMdx(fs.readFileSync(path.join(contentDir, file), "utf8")).frontmatter);
      this.emitFile({ type: "asset", fileName: "sitemap.xml",
        source: renderSitemap(sitemapUrls(pages, services.map(service => service.slug))) });
    },
  };
}
