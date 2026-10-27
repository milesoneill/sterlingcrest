import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import ResourcesIndex from "@/pages/ResourcesIndex";
import { listGuideIndexPages } from "@/lib/seo-content";

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));

function NavigationEvidence() {
  const location = useLocation();
  const navigate = useNavigate();
  return <>
    <span data-testid="location">{location.pathname}{location.search}</span>
    <button onClick={() => navigate(-1)}>Browser back</button>
  </>;
}

function showGuides(url = "/resources") {
  return render(<MemoryRouter initialEntries={[url]}>
    <ResourcesIndex />
    <NavigationEvidence />
  </MemoryRouter>);
}

function articlePaths(): string[] {
  return screen.queryAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "")
    .filter((href) => /^\/(?:resources|locations)\//.test(href));
}

function category(title: string) {
  return screen.getByRole("button", { name: new RegExp(`^${title}, \\d+ guides$`) });
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => cleanup());

describe("Guides browsing journey", () => {
  it("keeps the complete existing article library and original links available in All Guides", () => {
    showGuides();
    const publishedPaths = listGuideIndexPages().map((page) => page.path).sort();
    expect(articlePaths().sort()).toEqual(publishedPaths);
    expect(new Set(articlePaths()).size).toBe(publishedPaths.length);
    expect(screen.getByRole("button", { name: /^All Guides/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("searchbox", { name: "Search all guides" })).toHaveValue("");
  });

  it("lets readers reach the expected articles through all six topic cards", () => {
    showGuides();
    const journeys = [
      ["Funeral Costs & Planning", "/resources/funeral-flowers-obituary-cost-questions"],
      ["Choosing Coverage", "/resources/online-burial-insurance-quotes"],
      ["Health & Eligibility", "/resources/final-expense-insurance-with-diabetes"],
      ["Managing Your Policy", "/resources/life-insurance-premium-autopay"],
      ["Claims & Family Support", "/resources/death-certificate-life-insurance-claim"],
      ["State Guides", "/locations/final-expense-insurance-florida"],
    ];
    for (const [title, path] of journeys) {
      fireEvent.click(category(title));
      expect(category(title)).toHaveAttribute("aria-pressed", "true");
      expect(articlePaths()).toContain(path);
      expect(articlePaths().length).toBeLessThan(listGuideIndexPages().length);
      expect(screen.getByRole("searchbox", { name: `Search in ${title}` })).toBeInTheDocument();
    }
    expect(articlePaths().every((path) => path.startsWith("/locations/"))).toBe(true);
  });

  it("combines a topic with a case-insensitive, whitespace-tolerant search and explains an empty result", () => {
    showGuides();
    fireEvent.click(category("Funeral Costs & Planning"));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "   FLOWERS   " } });
    expect(articlePaths()).toContain("/resources/funeral-flowers-obituary-cost-questions");
    expect(articlePaths()).not.toContain("/resources/casket-price-questions");
    fireEvent.click(category("Health & Eligibility"));
    expect(articlePaths()).toEqual([]);
    expect(screen.getByRole("heading", { name: "No guides found" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("0 guides found");
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(category("Health & Eligibility")).toHaveAttribute("aria-pressed", "true");
    expect(articlePaths()).toContain("/resources/final-expense-insurance-with-diabetes");
  });

  it("can broaden a search to All Guides, then clear both filters to restore the full library", () => {
    showGuides("/resources?category=claims-family&q=flowers");
    expect(articlePaths()).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: /^All Guides/ }));
    expect(screen.getByRole("searchbox", { name: "Search all guides" })).toHaveValue("flowers");
    expect(articlePaths()).toContain("/resources/funeral-flowers-obituary-cost-questions");
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(articlePaths()).toHaveLength(listGuideIndexPages().length);
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/resources$/);
  });

  it("honors a shareable category/search URL and recovers from a search with no matches", () => {
    showGuides("/resources?category=claims-family&q=death");
    expect(category("Claims & Family Support")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("searchbox")).toHaveValue("death");
    expect(articlePaths()).toContain("/resources/death-certificate-life-insurance-claim");
    expect(articlePaths()).not.toContain("/resources/funeral-flowers-obituary-cost-questions");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "no-such-subject-zzzz" } });
    fireEvent.click(screen.getByRole("button", { name: "Browse all guides" }));
    expect(articlePaths()).toHaveLength(listGuideIndexPages().length);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("restores the previous browsing state with browser back and does not create a history entry per search edit", async () => {
    showGuides();
    fireEvent.click(category("Funeral Costs & Planning"));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "flowers" } });
    expect(articlePaths()).toContain("/resources/funeral-flowers-obituary-cost-questions");
    fireEvent.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent(/^\/resources$/));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(articlePaths()).toHaveLength(listGuideIndexPages().length);
  });

  it("falls back to All Guides for an unknown category instead of hiding articles", () => {
    showGuides("/resources?category=unknown-topic");
    expect(screen.getByRole("button", { name: /^All Guides/ })).toHaveAttribute("aria-pressed", "true");
    expect(articlePaths()).toHaveLength(listGuideIndexPages().length);
  });
});
