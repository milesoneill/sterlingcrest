import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, MessageCircle, ListChecks } from "lucide-react";
import { guideHeroImage, getSeoPageByPath, type SeoPage } from "@/lib/seo-content";
import { MarkdownBody } from "@/lib/markdown";
import { SeoChrome } from "./seo-shared";
import "./editorial-guide.css";
import { editorialSections } from "@/lib/editorial-guide";

function PlainInline({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</>;
}
function GuideBlocks({ markdown }: { markdown: string }) {
  return <>{markdown.split(/\n{2,}/).filter(Boolean).map((block, index) => {
    if (block.startsWith("|")) {
      const rows = block.split("\n").map(row => row.split("|").slice(1, -1).map(cell => cell.trim()));
      const [head, , ...body] = rows;
      return <div className="eg-table-wrap" key={index} tabIndex={0} role="region" aria-label="Example planning notes, horizontally scrollable"><table><caption>Planning example — for illustration only</caption><thead><tr>{head.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{body.map((row, r) => <tr key={r}>{row.map((cell, c) => c === 0 ? <th scope="row" key={c}>{cell}</th> : <td key={c}>{cell}</td>)}</tr>)}</tbody></table></div>;
    }
    if (block.startsWith("> ")) return <aside className="eg-note" key={index}><span>Keep in mind</span><MarkdownBody markdown={block.replace(/^>\s?/gm, "")} /></aside>;
    return <MarkdownBody key={index} markdown={block} />;
  })}</>;
}
function QuoteChecklist({ markdown }: { markdown: string }) {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const items = markdown.split("\n").filter(line => /^- \[ \]/.test(line)).map(line => line.replace(/^- \[ \]\s*/, ""));
  const intro = markdown.split("\n").filter(line => !/^- \[ \]/.test(line)).join("\n").trim();
  return <div>
    {intro && <GuideBlocks markdown={intro} />}
    <div className="eg-checklist">
      <div className="eg-checklist-top"><span><ListChecks size={22} aria-hidden="true" /> Your checklist</span><span aria-live="polite">{checked.size} of {items.length} checked</span></div>
      <div className="eg-checklist-items">{items.map((item, i) => <label className={checked.has(i) ? "eg-check checked" : "eg-check"} key={item}>
        <input type="checkbox" checked={checked.has(i)} onChange={() => setChecked(previous => { const next = new Set(previous); if (next.has(i)) next.delete(i); else next.add(i); return next; })} />
        <span className="eg-check-mark" aria-hidden="true">{checked.has(i) && <Check size={18} />}</span><span><PlainInline text={item} /></span>
      </label>)}</div>
      <p className="eg-checklist-foot">Use the checks to organize your review. They stay on this page and reset when you reload.</p>
    </div>
  </div>;
}
export default function EditorialGuidePage({ page }: { page: SeoPage }) {
  const { frontmatter: meta, body, aeoAnswer, faq } = page;
  const sections = editorialSections(body);
  const minutes = Math.max(1, Math.ceil([meta.summary, aeoAnswer, body, ...faq.map(f => f.question + " " + f.answer)].join(" ").split(/\s+/).length / 200));
  const updated = meta.updatedAt ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(meta.updatedAt)) : null;
  const related = (meta.internalLinks ?? []).map(href => ({ href, page: getSeoPageByPath(href) })).filter(item => item.page).slice(0, 2);
  const navigation = <><p className="eg-nav-label">On this page</p><ol>{sections.map((s, i) => <li key={s.id}><a href={`#${s.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>)}{faq.length > 0 && <li><a href="#common-questions"><span>Q&A</span>Common questions</a></li>}</ol></>;
  return <SeoChrome page={page}><article className="editorial-guide">
    <header className="eg-hero"><img className="eg-hero-image" src={guideHeroImage(page)} alt="" width="1600" height="600" fetchPriority="high" /><div className="eg-hero-overlay" /><div className="eg-shell">
      <Link className="eg-back" to="/resources"><ArrowLeft size={18} aria-hidden="true" /> Guides for Families</Link>
      <p className="eg-eyebrow">Planning guide</p><h1>{meta.title}</h1>
    </div></header>
    <section className="eg-intro"><div className="eg-shell"><p className="eg-deck">{meta.summary ?? meta.description}</p>
      <div className="eg-byline"><span className="eg-monogram" aria-hidden="true">SC</span><div><span>By Sterling Crest Financial Group</span><p><Clock3 size={17} aria-hidden="true" /> {minutes} min read {updated && <><span className="eg-meta-dot">·</span><time dateTime={meta.updatedAt}>Updated {updated}</time></>}</p></div></div>
    </div></section>
    <div className="eg-shell eg-reading-layout">
      <aside className="eg-sidebar"><nav aria-label="Article sections">{navigation}</nav><div className="eg-sidebar-note"><MessageCircle size={25} aria-hidden="true" /><p>Start with your questions.</p><span>A phone consultation is a simple place to discuss your family’s goals and options.</span></div></aside>
      <div className="eg-main">
        <details className="eg-mobile-nav"><summary>On this page <ChevronDown size={16} aria-hidden="true" /></summary><nav aria-label="Article sections on mobile">{navigation}</nav></details>
        {aeoAnswer && <section className="eg-answer" aria-label="Quick answer"><p className="eg-eyebrow">The short answer</p><p data-aeo-answer className="aeo-answer">{aeoAnswer}</p><div className="eg-answer-tags"><span><Check size={14} aria-hidden="true" /> Explore the topic</span><span><Check size={14} aria-hidden="true" /> Ask clear questions</span><span><Check size={14} aria-hidden="true" /> Consider your next step</span></div></section>}
        <section className="eg-inline-help"><h2>{meta.consultationCta?.heading ?? "Want to see what coverage could look like for you?"}</h2><p>{meta.consultationCta?.body ?? "Schedule a complimentary, no-obligation phone consultation with Sterling Crest to discuss your family’s goals and questions."}</p><Link className="eg-book-button" to="/book">Schedule a consultation <ArrowRight size={22} aria-hidden="true" /></Link><span>Complimentary · No obligation</span></section>
        {sections.map((section, index) => <section className="eg-section" id={section.id} key={section.id}>
          <div className="eg-section-title"><span className="eg-section-number">{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2></div>
          <div className="eg-section-copy">{section.body.includes("- [ ]") ? <QuoteChecklist markdown={section.body} /> : <GuideBlocks markdown={section.body} />}</div>
        </section>)}
        {faq.length > 0 && <section className="eg-faq" id="common-questions"><p className="eg-eyebrow">A few more answers</p><h2>Common questions</h2><div>{faq.map(f => <details key={f.question}><summary>{f.question}<ChevronDown size={17} aria-hidden="true" /></summary><p>{f.answer}</p></details>)}</div></section>}
        <section className="eg-consult"><span className="eg-consult-icon"><MessageCircle size={28} aria-hidden="true" /></span><p className="eg-eyebrow">A conversation, at your pace</p><h2>{meta.closingCta?.heading ?? "The right protection starts with the right conversation."}</h2><p>{meta.closingCta?.body ?? "Sterling Crest is an independent insurance brokerage. Schedule a complimentary, no-obligation phone consultation to discuss your goals, budget, and questions."}</p><Link className="eg-book-button" to="/book">Schedule a consultation <ArrowRight size={22} aria-hidden="true" /></Link><span className="eg-consult-small">Complimentary · No obligation</span></section>
        {(meta.sources?.length ?? 0) > 0 && <section className="eg-sources"><h2>Sources & editorial notes</h2><p>The resources below offer consumer information related to this guide. State-specific rules apply in their own jurisdictions.</p><ul>{meta.sources?.map(source => <li key={source.url}><a href={source.url} rel="noreferrer">{source.label}<ArrowRight size={12} aria-hidden="true" /></a></li>)}</ul><p className="eg-disclosure">Sterling Crest Financial Group is an independent insurance brokerage. Policy terms and insurer decisions determine individual coverage. This guide provides general education. A quote is an estimate, not confirmation that coverage is in place.</p></section>}
        {(meta.disclosures?.length ?? 0) > 0 && <section className="eg-disclosures" aria-label="Important information">{meta.disclosures?.map(item => <p key={item}>{item}</p>)}</section>}
      </div>
    </div>
    <section className="eg-related"><div className="eg-shell"><div className="eg-related-heading"><div><p className="eg-eyebrow">Keep learning</p><h2>A little more clarity for your next step.</h2></div><Link to="/resources">All guides <ArrowRight size={14} aria-hidden="true" /></Link></div><div className="eg-related-grid">{related.map(item => <Link to={item.href} className="eg-related-card" key={item.href}><span>Related guide</span><h3>{item.page!.frontmatter.title}</h3><p>{item.page!.frontmatter.description}</p><span className="eg-read-guide">Read the guide <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></div></section>
  </article></SeoChrome>;
}
