import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "./App";
import { listSeoPages } from "./lib/seo-content";
import { services } from "./lib/services";
import { routeMeta } from "./lib/route-meta";
import { staticRoutes } from "./lib/site-routes";
export const routes = [...staticRoutes, ...services.map(s => `/services/${s.slug}`), ...listSeoPages().map(p => p.path), "/compare"];
export function render(url: string) {
  return { html: renderToString(<StaticRouter location={url}><AppContent /></StaticRouter>), meta: routeMeta(url) };
}
