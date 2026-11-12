import { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, SearchX, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guideHeroImage, listGuideIndexPages } from "@/lib/seo-content";
import {
  GUIDE_CATEGORIES,
  MORTGAGE_PROTECTION_CATEGORIES,
  categoryCounts,
  collectionCounts,
  filterGuides,
  guideCollection,
  type GuideCategoryId,
  type GuideCollectionId,
} from "@/lib/guide-categories";
import "./resources-index.css";

const COLLECTIONS = [
  {
    id: "final-expense",
    title: "Final Expense Guides",
    label: "Final Expense",
    eyebrow: "Planning for your family",
    description: "Clear answers about funeral costs, coverage options, and planning for your family.",
    image: "/images/guide-collections/final-expense-family-planning.webp",
    href: "/resources/final-expense",
  },
  {
    id: "mortgage-protection",
    title: "Mortgage Protection Guides",
    label: "Mortgage Protection",
    eyebrow: "For homeowners & families",
    description: "Understand mortgage protection, compare coverage, and plan around your family’s needs.",
    image: "/images/guide-collections/mortgage-protection-moving-day.webp",
    href: "/resources/mortgage-protection",
  },
] as const;

const ResourcesIndex = ({ collection }: { collection?: GuideCollectionId }) => {
  const pages = useMemo(() => listGuideIndexPages(), []);
  const collections = useMemo(() => collectionCounts(pages), [pages]);
  const scopedPages = useMemo(() => filterGuides(pages, { collection }), [pages, collection]);
  const counts = useMemo(() => categoryCounts(scopedPages), [scopedPages]);
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);
  const currentCollection = COLLECTIONS.find(item => item.id === collection);
  const isMortgageProtection = collection === "mortgage-protection";
  const topics = isMortgageProtection ? MORTGAGE_PROTECTION_CATEGORIES : GUIDE_CATEGORIES;
  const selectedTopic = topics.find(
    topic => topic.id === searchParams.get("category"),
  );
  const category = selectedTopic?.id ?? "all";
  const query = searchParams.get("q") ?? "";
  const filteredPages = filterGuides(pages, { collection, category, query });
  const hasFilters = category !== "all" || query.trim().length > 0;
  const allLabel = currentCollection ? `All ${currentCollection.label}` : "All Guides";
  const allResultsLabel = currentCollection ? `All ${currentCollection.label} Guides` : "All Guides";
  const searchLabel = selectedTopic ? `Search in ${selectedTopic.title}` : currentCollection ? `Search ${currentCollection.label} guides` : "Search all guides";
  const browseLabel = currentCollection ? `Browse all ${currentCollection.label} guides` : "Browse all guides";
  const resultsTitle = selectedTopic?.title ?? (collection === "mortgage-protection" ? "Explore Mortgage Protection" : allResultsLabel);
  const heroTitle = currentCollection?.title ?? "Guides for Families";

  function scrollToResults() {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    resultsRef.current?.scrollIntoView?.({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function chooseCategory(next: GuideCategoryId | "all") {
    const params = new URLSearchParams(searchParams);
    if (next === "all") params.delete("category");
    else params.set("category", next);
    setSearchParams(params);
    scrollToResults();
  }

  function updateQuery(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("q", next);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("q");
    setSearchParams(params);
  }

  return (
    <div className="guides-page min-h-screen bg-background">
      <Header variant="guides" />
      <main>
      <header className="guides-hero" aria-labelledby="guide-page-heading">
        <div className="guides-hero-scene">
          <img src="/images/guide-collections/family-guides-overlook.webp" alt="" aria-hidden="true" width={2172} height={724} fetchPriority="high" decoding="async" className="guides-hero-image" />
          <div className="guides-hero-shade" />
          <div className="guides-hero-inner">
            <p className="guides-hero-eyebrow">Sterling Crest Guides</p>
            <h1 id="guide-page-heading" className="guides-hero-title font-serif">{heroTitle}</h1>
            <p className="guides-hero-subtitle">Clear answers for your family’s next step.</p>
          </div>
        </div>
      </header>
      <div className="guides-main">
        <div className="guides-container">
          {currentCollection && <Link to="/resources" className="guide-back-link"><ArrowLeft size={18} aria-hidden="true" /> Back to all guides</Link>}
          <section aria-labelledby="guide-page-heading" className="guide-intro">
            <div className="guide-topics-intro">
              <p className="guide-page-subtitle">{collection === "final-expense" ? "Clear answers about final expenses, coverage, and planning for your family." : collection === "mortgage-protection" ? "Understand your options for protecting your family’s home." : "Choose a guide collection to get started."}</p>
              {currentCollection && <p className="guide-collection-total">{scopedPages.length} {scopedPages.length === 1 ? "guide" : "guides"}</p>}
            </div>
            <div className="guide-browse-tools">
              <button type="button" className={`guide-all-button${category === "all" ? " is-selected" : ""}`} aria-pressed={category === "all"} aria-controls="guide-results" onClick={() => chooseCategory("all")}>
                {allLabel}<span aria-hidden="true">·</span><span>{scopedPages.length}</span>
              </button>
              <form className="guide-search-form" role="search" onSubmit={event => { event.preventDefault(); scrollToResults(); }}>
                <label htmlFor="guide-search" className="sr-only">{searchLabel}</label>
                <div className="guide-search-field">
                  <Search size={20} strokeWidth={1.7} aria-hidden="true" />
                  <input id="guide-search" type="search" value={query} onChange={event => updateQuery(event.target.value)} placeholder={`${searchLabel}…`} autoComplete="off" aria-controls="guide-results" />
                  {query && <button type="button" onClick={() => updateQuery("")} aria-label="Clear search"><X size={18} aria-hidden="true" /></button>}
                </div>
              </form>
            </div>
            {query.trim() && <div className="guide-search-feedback">
              <p>{filteredPages.length} {filteredPages.length === 1 ? "guide" : "guides"} found</p>
              <a href="#guide-results" onClick={event => { event.preventDefault(); scrollToResults(); }}>View results <ArrowRight size={15} aria-hidden="true" /></a>
            </div>}
          </section>
          {!currentCollection && <section className="guide-collections" aria-label="Guide collections">
            {COLLECTIONS.map(item => <article className="guide-collection-card" key={item.id}>
              <div className="guide-collection-photo"><img src={item.image} alt="" width={1440} height={600} decoding="async" /></div>
              <div className="guide-collection-copy">
                <p className="guide-eyebrow">{item.eyebrow}</p>
                <h2 className="font-serif">{item.title}</h2>
                <p className="guide-collection-description">{item.description}</p>
                <p className="guide-collection-count">{collections[item.id]} helpful {collections[item.id] === 1 ? "guide" : "guides"}</p>
                <Link className="guide-collection-button" to={item.href}>Explore {item.label}<ArrowRight size={20} aria-hidden="true" /></Link>
              </div>
            </article>)}
          </section>}
          {currentCollection && <section className="guide-topics" aria-labelledby="guide-topics-heading">
            <div className="guide-topics-intro">
              <h2 id="guide-topics-heading" className="guide-topics-title font-serif">Explore a topic</h2>
              <p className="guide-topics-subtitle">Choose a topic to narrow the guides below.</p>
            </div>
            <div className="guide-topic-grid" aria-label="Guide topics">
              {topics.map(topic => <button key={topic.id} type="button" className={`guide-topic-card${category === topic.id ? " is-selected" : ""}`} aria-pressed={category === topic.id} aria-controls="guide-results" aria-label={`${topic.title}, ${counts[topic.id]} guides`} onClick={() => chooseCategory(topic.id)}>
                <span className="guide-topic-photo" aria-hidden="true"><img src={`/images/guide-topics/${topic.id}.webp`} alt="" width={isMortgageProtection ? 429 : 800} height={isMortgageProtection ? 195 : 480} loading="lazy" decoding="async" /></span>
                <span className="guide-topic-body">
                  <span className="guide-topic-title font-serif">{topic.title}</span>
                  <span className="guide-topic-description">{topic.description}</span>
                  <span className="guide-topic-footer"><span>{counts[topic.id]} {counts[topic.id] === 1 ? "guide" : "guides"}</span><span className="guide-topic-action">Explore guides <ArrowRight size={17} aria-hidden="true" /></span></span>
                </span>
              </button>)}
            </div>
          </section>}
          <section ref={resultsRef} id="guide-results" className="guide-results" aria-labelledby="guide-results-heading">
            <div className="guide-results-heading">
              <div>
                <h2 id="guide-results-heading" className="font-serif">{resultsTitle}</h2>
                <p role="status" aria-live="polite" aria-atomic="true">{filteredPages.length} {filteredPages.length === 1 ? "guide" : "guides"}{query.trim() ? ` found for “${query.trim()}”` : collection === "mortgage-protection" ? " to help you understand your options." : " to help you plan your next step."}</p>
              </div>
              {hasFilters && <div className="guide-result-actions">
                {currentCollection && <a className="guide-browse-topics" href="#guide-topics-heading">Browse topics</a>}
                <button type="button" className="guide-reset-button" onClick={clearFilters}>{currentCollection ? allResultsLabel : "Clear filters"}<X size={15} aria-hidden="true" /></button>
              </div>}
            </div>
            {filteredPages.length > 0 ? <ul className="guide-article-grid">
              {filteredPages.map(page => <li key={page.path}>
                <Link to={page.path} className="guide-article-card">
                  <span className="guide-article-photo"><img src={guideHeroImage(page)} alt="" aria-hidden="true" width={800} height={480} loading="lazy" decoding="async" /></span>
                  <div className="guide-article-body">
                    {!currentCollection && <span className="guide-article-topic">{guideCollection(page) === "mortgage-protection" ? "Mortgage Protection" : "Final Expense"}</span>}
                    <h3 className="font-serif">{page.frontmatter.title}</h3>
                    {page.frontmatter.description && <span className="guide-article-description">{page.frontmatter.description}</span>}
                    <span className="guide-article-action">Read guide <ArrowRight size={18} aria-hidden="true" /></span>
                  </div>
                </Link>
              </li>)}
            </ul> : <div className="guide-empty-state">
              <SearchX size={34} strokeWidth={1.3} aria-hidden="true" />
              <h3 className="font-serif">No guides found</h3>
              <p>{currentCollection ? `Try a shorter search or clear the filters to browse all ${currentCollection.label} guides.` : "Try a shorter search or clear the filters to browse all guides."}</p>
              <button type="button" onClick={clearFilters}>{browseLabel}<ArrowRight size={17} aria-hidden="true" /></button>
            </div>}
          </section>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesIndex;
