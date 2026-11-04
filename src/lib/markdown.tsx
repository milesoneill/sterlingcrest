import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean; start?: number };

export function splitMarkdownBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  const chunks = markdown.trim().split(/\n{2,}/);
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const heading = trimmed.match(/^##\s+(.+)$/);
    if (heading && !trimmed.includes("\n")) {
      blocks.push({ type: "heading", text: heading[1].trim() });
      continue;
    }
    const lines = trimmed.split("\n");
    if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
      blocks.push({
        type: "list",
        items: lines.map((l) => l.trim().replace(/^[-*]\s+/, "")),
      });
      continue;
    }
    if (lines.every((l) => /^\d{1,9}\.\s+/.test(l.trim()))) {
      blocks.push({
        type: "list",
        ordered: true,
        start: Number(lines[0].trim().match(/^(\d+)\./)![1]),
        items: lines.map((l) => l.trim().replace(/^\d{1,9}\.\s+/, "")),
      });
      continue;
    }
    blocks.push({ type: "paragraph", text: trimmed.replace(/\n/g, " ") });
  }
  return blocks;
}

export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={key++} className="font-medium text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3] && match[4]) {
      const href = match[4];
      if (href.startsWith("/")) {
        parts.push(
          <Link
            key={key++}
            to={href}
            className="text-primary underline-offset-4 hover:underline"
          >
            {match[3]}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={key++}
            href={href}
            className="text-primary underline-offset-4 hover:underline"
            rel="noreferrer"
          >
            {match[3]}
          </a>
        );
      }
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function MarkdownBody({ markdown }: { markdown: string }) {
  const blocks = splitMarkdownBlocks(markdown);
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="font-serif text-2xl md:text-3xl text-foreground pt-6"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          const items = block.items.map((item, index) => <li key={index}><Inline text={item} /></li>);
          return block.ordered ? (
            <ol key={i} start={block.start} className="list-decimal pl-6 space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground font-sans">{items}</ol>
          ) : (
            <ul key={i} className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground font-sans">{items}</ul>
          );
        }
        return (
          <p
            key={i}
            className="text-base md:text-lg leading-relaxed text-muted-foreground font-sans"
          >
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
