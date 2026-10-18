import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Compare from "./pages/Compare.tsx";
import Book from "./pages/Book.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import SeoMdxPage from "./pages/SeoMdxPage.tsx";
import ResourcesIndex from "./pages/ResourcesIndex.tsx";
import InsuranceIndex from "./pages/InsuranceIndex.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

import { routeMeta } from "./lib/route-meta";
import { usePageMeta } from "./lib/page-meta";
import { routeRedirects } from "./lib/site-routes";

function RouteMetadata() { const { pathname } = useLocation(); usePageMeta(routeMeta(pathname)); return null; }

export const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <>
        <RouteMetadata />
        <ScrollToTop />
        <Routes>
          {Object.entries(routeRedirects).map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
          <Route path="/" element={<Index />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/book" element={<Book />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/resources" element={<ResourcesIndex />} />
          <Route path="/resources/:slug" element={<SeoMdxPage />} />
          <Route path="/insurance" element={<InsuranceIndex />} />
          <Route path="/insurance/:slug" element={<SeoMdxPage />} />
          <Route path="/locations/:slug" element={<SeoMdxPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => <BrowserRouter><AppContent /></BrowserRouter>;
export default App;
