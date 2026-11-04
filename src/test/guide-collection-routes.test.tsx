import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContent } from "@/App";
import { getSeoPageByPath } from "@/lib/seo-content";
import { routeMeta } from "@/lib/route-meta";

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));

beforeAll(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => cleanup());

describe("Public guide collection routes", () => {
  it.each([
    ["/resources/final-expense", "Search Final Expense guides", "Final Expense Insurance Guides"],
    ["/resources/mortgage-protection", "Search Mortgage Protection guides", "Mortgage Protection Insurance Guides"],
  ])("renders %s as an indexable collection with its own canonical, including a search URL", (path, searchLabel, title) => {
    const meta = routeMeta(path);
    expect(meta.noindex).toBe(false);
    expect(meta.canonical).toBe(`https://www.sterlingcrestfinancial.com${path}`);
    expect(meta.title).toContain(title);
    expect(getSeoPageByPath(path)).toBeUndefined();
    render(<MemoryRouter initialEntries={[`${path}?q=insurance&utm_source=collection-test`]}><AppContent /></MemoryRouter>);
    expect(screen.getByRole("searchbox", { name: searchLabel })).toHaveValue("insurance");
    expect(screen.queryByText("404")).not.toBeInTheDocument();
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `https://www.sterlingcrestfinancial.com${path}`);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute("content", "website");
  });

  it("keeps an existing guide on its original dynamic article path and article metadata", () => {
    const path = "/resources/mortgage-protection-vs-pmi";
    const article = getSeoPageByPath(path)!;
    expect(article.frontmatter.canonical).toBe(`https://www.sterlingcrestfinancial.com${path}`);
    render(<MemoryRouter initialEntries={[path]}><AppContent /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: article.frontmatter.title })).toBeInTheDocument();
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `https://www.sterlingcrestfinancial.com${path}`);
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute("content", "article");
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });
});
