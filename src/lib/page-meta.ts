import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_ORIGIN } from "./site-routes";
export function usePageMeta(opts: { title: string; description?: string; canonical?: string; noindex?: boolean }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = opts.title.includes("Sterling Crest") ? opts.title : `${opts.title} | Sterling Crest Financial Group`;
    document.title = title;
    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const canonical = opts.canonical ?? `${SITE_ORIGIN}${pathname.replace(/\/$/, "") || "/"}`;
    for (const name of ["description", "twitter:description"]) setMeta(name, opts.description ?? "");
    setMeta("og:description", opts.description ?? "", "property");
    setMeta("og:title", title, "property"); setMeta("twitter:title", title);
    setMeta("og:url", canonical, "property");
    setMeta("og:type", /\/(resources|locations|insurance)\/.+/.test(pathname) ? "article" : "website", "property");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", canonical);
    if (opts.noindex) setMeta("robots", "noindex, follow");
    else document.querySelector('meta[name="robots"]')?.remove();
  }, [opts.title, opts.description, opts.canonical, opts.noindex, pathname]);
}
