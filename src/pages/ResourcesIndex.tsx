import { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, SearchX, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guidesIndexHeroImage } from "@/lib/images";
import { guideHeroImage, listGuideIndexPages } from "@/lib/seo-content";
import {
  GUIDE_CATEGORIES,
  categoryCounts,
  filterGuides,
  guideCategory,
  type GuideCategoryId,
} from "@/lib/guide-categories";
import "./resources-index.css";

const ResourcesIndex = () => {
  const pages = useMemo(() => listGuideIndexPages(), []);
  const counts = useMemo(() => categoryCounts(pages), [pages]);
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);
  const selectedTopic = GUIDE_CATEGORIES.find(
    (topic) => topic.id === searchParams.get("category"),
  );
  const category = selectedTopic?.id ?? "all";
  const query = searchParams.get("q") ?? "";
  const filteredPages = filterGuides(pages, { category, query });
  const hasFilters = category !== "all" || query.trim().length > 0;

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
    <div className="min-h-screen bg-background">
      <Header variant="guides" />

      <section className="guides-hero">
        <div className="guides-hero-scene">
          <img
            src={guidesIndexHeroImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
          />
          <div className="guides-hero-shade" />
          <div className="guides-hero-inner">
            <p className="guides-hero-eyebrow">
              Resources
            </p>
            <h1 className="guides-hero-title font-serif">
              Guides for Families
            </h1>
            <div className="guides-hero-rule" />
            <p className="guides-hero-subtitle">
              Clear answers for your family’s next step.
            </p>
          </div>
        </div>
      </section>

      <main className="guides-main">
        <div className="guides-container">
          <section aria-labelledby="guide-topics-heading" className="guide-topics">
            <div className="guide-topics-intro">
              <p className="guide-eyebrow">A little clarity, one topic at a time</p>
              <h2 id="guide-topics-heading" className="guide-topics-title font-serif">
                What would you like help with?
              </h2>
              <p className="guide-topics-subtitle">
                Explore a topic or find an answer.
              </p>
            </div>

            <div className="guide-browse-tools">
              <button
                type="button"
                className={`guide-all-button${category === "all" ? " is-selected" : ""}`}
                aria-pressed={category === "all"}
                aria-controls="guide-results"
                onClick={() => chooseCategory("all")}
              >
                All Guides
                <span aria-hidden="true">·</span>
                <span>{pages.length}</span>
              </button>

              <form className="guide-search-form" role="search" onSubmit={(event) => {
                event.preventDefault();
                scrollToResults();
              }}>
                <label htmlFor="guide-search" className="sr-only">
                  {selectedTopic ? `Search in ${selectedTopic.title}` : "Search all guides"}
                </label>
                <div className="guide-search-field">
                  <Search size={19} strokeWidth={1.7} aria-hidden="true" />
                  <input
                    id="guide-search"
                    type="search"
                    value={query}
                    onChange={(event) => updateQuery(event.target.value)}
                    placeholder={selectedTopic ? "Search this topic…" : "Search guides…"}
                    autoComplete="off"
                    aria-controls="guide-results"
                  />
                  {query && (
                    <button type="button" onClick={() => updateQuery("")} aria-label="Clear search">
                      <X size={18} strokeWidth={1.7} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {query.trim() && (
              <div className="guide-search-feedback">
                <p>{filteredPages.length} {filteredPages.length === 1 ? "guide" : "guides"} found</p>
                <a href="#guide-results" onClick={(event) => {
                  event.preventDefault();
                  scrollToResults();
                }}>
                  View results <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}

            <div className="guide-topic-grid" aria-label="Guide topics">
              {GUIDE_CATEGORIES.map((topic) => {
                const selected = category === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    className={`guide-topic-card${selected ? " is-selected" : ""}`}
                    aria-pressed={selected}
                    aria-controls="guide-results"
                    aria-label={`${topic.title}, ${counts[topic.id]} guides`}
                    onClick={() => chooseCategory(topic.id)}
                  >
                    <span className="guide-topic-photo" aria-hidden="true">
                      <img
                        src={`/images/guide-topics/${topic.id}.webp`}
                        alt=""
                        width={800}
                        height={480}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="guide-topic-body">
                      <span className="guide-topic-copy">
                        <span className="guide-topic-title font-serif">{topic.title}</span>
                        <span className="guide-topic-description">{topic.description}</span>
                      </span>
                      <span className="guide-topic-footer">
                        <span>{counts[topic.id]} {counts[topic.id] === 1 ? "guide" : "guides"}</span>
                        <span className="guide-topic-action">
                          Explore guides <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section ref={resultsRef} id="guide-results" className="guide-results" aria-labelledby="guide-results-heading">
            <div className="guide-results-heading">
              <div>
                <h2 id="guide-results-heading" className="font-serif text-2xl md:text-3xl">
                  {selectedTopic?.title ?? "All Guides"}
                </h2>
                <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 text-sm text-muted-foreground">
                  {filteredPages.length} {filteredPages.length === 1 ? "guide" : "guides"}
                  {query.trim() ? ` found for “${query.trim()}”` : " to help you plan your next step"}
                </p>
              </div>
              {hasFilters && (
                <div className="guide-result-actions">
                  <a className="guide-browse-topics" href="#guide-topics-heading">Browse topics</a>
                  <button type="button" className="guide-reset-button" onClick={clearFilters}>
                    Clear filters <X size={15} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

          {filteredPages.length > 0 ? (
          <ul className="divide-y divide-border">
            {filteredPages.map((page) => (
              <li key={page.path} className="py-10 first:pt-0 last:pb-0">
                <Link
                  to={page.path}
                  className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
                >
                  <div className="w-full sm:w-44 md:w-52 shrink-0 aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={guideHeroImage(page)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="guide-article-topic">
                      {GUIDE_CATEGORIES.find((topic) => topic.id === guideCategory(page))?.title}
                    </p>
                    <h3 className="font-serif text-xl md:text-2xl text-foreground leading-snug group-hover:text-primary transition-colors">
                      {page.frontmatter.title}
                    </h3>
                    {page.frontmatter.description && (
                      <p className="mt-3 text-muted-foreground font-sans leading-relaxed text-sm md:text-base">
                        {page.frontmatter.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 mt-5 text-primary text-[0.65rem] tracking-[0.3em] uppercase font-sans">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          ) : (
            <div className="guide-empty-state">
              <SearchX size={34} strokeWidth={1.3} aria-hidden="true" />
              <h3 className="font-serif text-2xl">No guides found</h3>
              <p>Try a shorter search or clear the filters to browse all guides.</p>
              <button type="button" onClick={clearFilters}>Browse all guides <ArrowRight size={17} aria-hidden="true" /></button>
            </div>
          )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesIndex;

