import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { render, routes } from "../.prerender/entry-server.js";
const template = await fs.readFile("dist/index.html", "utf8");
const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const known = new Set(routes);
for (const route of [...routes, "/404"]) {
  const { html, meta, sourceFile } = render(route);
  const fingerprint = sourceFile ? createHash("sha256").update(await fs.readFile(path.join("content/seo", path.basename(sourceFile)))).digest("hex") : null;
  // Validate actual rendered article anchors, including body links and related links.
  if (route.startsWith("/resources/") || route.startsWith("/insurance/") || route.startsWith("/locations/")) {
    for (const match of html.matchAll(/href="([^"#]+)[^"]*"/g)) {
      const href = match[1].split(/[?#]/)[0];
      if (href.startsWith("/") && !href.startsWith("//") && !known.has(href)) throw Error(`Broken article link: ${route} -> ${href}`);
    }
  }
  let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`);
  page = page.replace(/<meta (?:name|property)="(?:description|og:title|og:description|og:url|og:type|twitter:title|twitter:description)"[^>]*>/g, "");
  const tags = [
    `<meta name="description" content="${escape(meta.description)}">`,
    `<link rel="canonical" href="${escape(meta.canonical)}">`,
    `<meta property="og:title" content="${escape(meta.title)}">`,
    `<meta property="og:description" content="${escape(meta.description)}">`,
    `<meta property="og:url" content="${escape(meta.canonical)}">`,
    `<meta property="og:type" content="${route.includes("/resources/") || route.includes("/locations/") || route.includes("/insurance/") ? "article" : "website"}">`,
    `<meta name="twitter:title" content="${escape(meta.title)}">`,
    `<meta name="twitter:description" content="${escape(meta.description)}">`,
    ...(fingerprint ? [`<meta name="seo-content-sha256" content="${fingerprint}">`] : []),
    ...(meta.noindex ? ['<meta name="robots" content="noindex, follow">'] : []),
  ];
  page = page.replace("</head>", tags.join("\n") + "\n</head>");
  const output = path.join("dist", route === "/" ? "index.html" : route.slice(1) + ".html");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, page);
}
console.log(`Prerendered ${routes.length} routes and a 404 page; article links verified.`);
