import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ResourcesIndex from "@/pages/ResourcesIndex";
import { listGuideIndexPages } from "@/lib/seo-content";
import { guideCollection } from "@/lib/guide-categories";

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
    <Routes>
      <Route path="/resources" element={<ResourcesIndex />} />
      <Route path="/resources/final-expense" element={<ResourcesIndex collection="final-expense" />} />
      <Route path="/resources/mortgage-protection" element={<ResourcesIndex collection="mortgage-protection" />} />
    </Routes>
    <NavigationEvidence />
  </MemoryRouter>);
}

const collectionPaths = new Set(["/resources/final-expense", "/resources/mortgage-protection"]);
function articlePaths(): string[] {
  return screen.queryAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "")
    .filter((href) => /^\/(?:resources|locations)\//.test(href) && !collectionPaths.has(href));
}
function category(title: string) {
  return screen.getByRole("button", { name: new RegExp(`^${title}, \\d+ guides$`) });
}
function expectOnlyCollection(collection: "final-expense" | "mortgage-protection") {
  const expected = listGuideIndexPages().filter((page) => guideCollection(page) === collection).map((page) => page.path).sort();
  expect(articlePaths().sort()).toEqual(expected);
}

beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });
afterEach(() => cleanup());

describe("Guides collection browsing", () => {
  it("shows both collection links above the complete 139-guide library and lets a reader return to it", () => {
    showGuides();
    const publishedPaths = listGuideIndexPages().map((page) => page.path).sort();
    const finalExpenseLink = screen.getByRole("link", { name: /Explore Final Expense/ });
    const mortgageLink = screen.getByRole("link", { name: /Explore Mortgage Protection/ });
    expect(finalExpenseLink).toHaveAttribute("href", "/resources/final-expense");
    expect(mortgageLink).toHaveAttribute("href", "/resources/mortgage-protection");
    const firstArticle = document.querySelector("a.guide-article-card")!;
    expect(finalExpenseLink.compareDocumentPosition(firstArticle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(mortgageLink.compareDocumentPosition(firstArticle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(articlePaths().sort()).toEqual(publishedPaths);
    expect(articlePaths()).toHaveLength(139);
    expect(new Set(articlePaths()).size).toBe(139);
    expect(screen.getByRole("button", { name: /^All Guides.*139/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("searchbox", { name: "Search all guides" })).toHaveValue("");
    expect(screen.queryByRole("button", { name: /^Funeral Costs & Planning,/ })).not.toBeInTheDocument();
    fireEvent.click(finalExpenseLink);
    expectOnlyCollection("final-expense");
    expect(screen.getByRole("link", { name: "Back to all guides" })).toHaveAttribute("href", "/resources");
    fireEvent.click(screen.getByRole("link", { name: "Back to all guides" }));
    expect(articlePaths()).toHaveLength(139);
    fireEvent.click(screen.getByRole("link", { name: /Explore Mortgage Protection/ }));
    expectOnlyCollection("mortgage-protection");
  });

  it("keeps all six topic counts and filters inside the 115-guide Final Expense collection", () => {
    showGuides("/resources/final-expense");
    expectOnlyCollection("final-expense");
    expect(screen.getByRole("searchbox", { name: "Search Final Expense guides" })).toHaveValue("");
    const journeys = [
      ["Funeral Costs & Planning", 26, "/resources/funeral-flowers-obituary-cost-questions"],
      ["Choosing Coverage", 49, "/resources/online-burial-insurance-quotes"],
      ["Health & Eligibility", 9, "/resources/final-expense-insurance-with-diabetes"],
      ["Managing Your Policy", 23, "/resources/life-insurance-premium-autopay"],
      ["Claims & Family Support", 6, "/resources/death-certificate-life-insurance-claim"],
      ["State Guides", 2, "/locations/final-expense-insurance-florida"],
    ] as const;
    for (const [title, count, path] of journeys) {
      expect(category(title)).toHaveAttribute("aria-label", `${title}, ${count} guides`);
      fireEvent.click(category(title));
      expect(category(title)).toHaveAttribute("aria-pressed", "true");
      expect(articlePaths()).toHaveLength(count);
      expect(articlePaths()).toContain(path);
      expect(screen.getByRole("searchbox", { name: `Search in ${title}` })).toBeInTheDocument();
      expect(articlePaths()).not.toContain("/resources/mortgage-protection-insurance-beneficiary");
    }
    expect(articlePaths().every((path) => path.startsWith("/locations/"))).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "All Final Expense Guides" }));
    expectOnlyCollection("final-expense");
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/resources\/final-expense$/);
  });

  it("combines a Final Expense topic and normalized search, then clears the query without discarding the topic", () => {
    showGuides("/resources/final-expense");
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
    expect(articlePaths()).toHaveLength(9);
    expect(articlePaths()).toContain("/resources/final-expense-insurance-with-diabetes");
  });

  it("opens a shareable Final Expense URL and resets to that collection rather than leaking Mortgage Protection", () => {
    showGuides("/resources/final-expense?category=claims-family&q=death");
    expect(category("Claims & Family Support")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("searchbox")).toHaveValue("death");
    expect(articlePaths()).toContain("/resources/death-certificate-life-insurance-claim");
    expect(articlePaths()).not.toContain("/resources/funeral-flowers-obituary-cost-questions");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "no-such-subject-zzzz" } });
    fireEvent.click(screen.getByRole("button", { name: "Browse all Final Expense guides" }));
    expectOnlyCollection("final-expense");
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("lets readers browse Mortgage Protection topics and share a topic-specific search", () => {
    const view = showGuides("/resources/mortgage-protection");
    expect(screen.getByRole("heading", { name: "Explore a topic" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /, 4 guides$/ })).toHaveLength(6);
    fireEvent.click(category("Coverage Basics"));
    expect(category("Coverage Basics")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("location")).toHaveTextContent("/resources/mortgage-protection?category=coverage-basics");
    expect(articlePaths()).toHaveLength(4);
    expect(articlePaths()).toContain("/resources/mortgage-protection-vs-pmi");
    expect(screen.getByRole("link", { name: "Browse topics" })).toHaveAttribute("href", "#guide-topics-heading");

    fireEvent.click(screen.getByRole("button", { name: "All Mortgage Protection 24" }));
    expect(category("Coverage Basics")).toHaveAttribute("aria-pressed", "false");
    expectOnlyCollection("mortgage-protection");
    view.unmount();

    showGuides("/resources/mortgage-protection?category=coverage-basics&q=pmi");
    expect(screen.getByRole("searchbox", { name: "Search in Coverage Basics" })).toHaveValue("pmi");
    expect(articlePaths().sort()).toEqual([
      "/resources/mortgage-protection-vs-pmi",
      "/resources/what-is-mortgage-protection-insurance",
    ]);
  });

  it("searches Mortgage Protection directly, ignores a stale Final Expense category and resets only its 24 guides", () => {
    showGuides("/resources/mortgage-protection?category=health-eligibility&q=pmi");
    expect(screen.getByRole("searchbox", { name: "Search Mortgage Protection guides" })).toHaveValue("pmi");
    expect(articlePaths()).toContain("/resources/mortgage-protection-vs-pmi");
    expect(screen.queryByRole("button", { name: /^Health & Eligibility,/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Funeral Costs & Planning,/ })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "insurance" } });
    expect(articlePaths().length).toBeGreaterThan(0);
    const mortgagePaths = new Set(listGuideIndexPages().filter((page) => guideCollection(page) === "mortgage-protection").map((page) => page.path));
    expect(articlePaths().every((path) => mortgagePaths.has(path))).toBe(true);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "diabetes" } });
    expect(articlePaths()).toEqual([]);
    expect(screen.getByRole("heading", { name: "No guides found" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Browse all Mortgage Protection guides" }));
    expectOnlyCollection("mortgage-protection");
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("restores the previous scoped browsing state with browser back instead of making one entry per search edit", async () => {
    showGuides("/resources/final-expense");
    fireEvent.click(category("Funeral Costs & Planning"));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "flowers" } });
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "FLOWERS" } });
    expect(articlePaths()).toContain("/resources/funeral-flowers-obituary-cost-questions");
    fireEvent.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent(/^\/resources\/final-expense$/));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expectOnlyCollection("final-expense");
  });

  it("supports the root's legacy category URLs and safely ignores an unknown topic", () => {
    const view = showGuides("/resources?category=funeral-costs&q=flowers");
    expect(articlePaths()).toContain("/resources/funeral-flowers-obituary-cost-questions");
    expect(articlePaths()).not.toContain("/resources/mortgage-protection-vs-pmi");
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(articlePaths()).toHaveLength(139);
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/resources$/);
    view.unmount();
    showGuides("/resources/final-expense?category=unknown-topic");
    expect(screen.getByRole("button", { name: /^All Final Expense.*115/ })).toHaveAttribute("aria-pressed", "true");
    expectOnlyCollection("final-expense");
  });

  it("searches both products from All Guides and recovers from a root search with no matches", () => {
    showGuides();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search all guides" }), { target: { value: "insurance" } });
    const matches = new Set(articlePaths());
    const visibleCollections = new Set(listGuideIndexPages().filter((page) => matches.has(page.path)).map(guideCollection));
    expect(visibleCollections).toEqual(new Set(["final-expense", "mortgage-protection"]));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "no-such-subject-zzzz" } });
    expect(articlePaths()).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "Browse all guides" }));
    expect(articlePaths()).toHaveLength(139);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
});
