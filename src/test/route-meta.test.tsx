import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { usePageMeta } from "@/lib/page-meta";
import { routeMeta } from "@/lib/route-meta";
import { getSeoPageByPath } from "@/lib/seo-content";
import SeoMdxPage from "@/pages/SeoMdxPage";
import { useLocation } from "react-router-dom";

function MetadataJourney() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  usePageMeta(routeMeta(pathname));
  return <button onClick={() => navigate("/book")}>Book</button>;
}
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("public route metadata", () => {
  it("replaces article metadata when opening booking, without carrying query data into canonical URLs", async () => {
    render(<MemoryRouter initialEntries={["/resources/how-much-does-final-expense-insurance-cost?utm_source=test"]}><MetadataJourney /></MemoryRouter>);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toContain("/resources/how-much");
    fireEvent.click(screen.getByText("Book"));
    await waitFor(() => expect(document.title).toContain("Book a Complimentary Consultation"));
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.sterlingcrestfinancial.com/book");
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe("https://www.sterlingcrestfinancial.com/book");
  });
  it("identifies unknown URLs for noindex and shows a 404 instead of the homepage", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(routeMeta("/resources/does-not-exist").noindex).toBe(true);
    render(<MemoryRouter initialEntries={["/resources/does-not-exist"]}><SeoMdxPage /></MemoryRouter>);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(getSeoPageByPath("/locations/final-expense-insurance-in-florida")).toBeUndefined();
    expect(getSeoPageByPath("/locations/final-expense-insurance-florida")).toBeDefined();
  });
});
