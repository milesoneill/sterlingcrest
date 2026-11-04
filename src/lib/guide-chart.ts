export type GuideChartFormat = "currency" | "number" | "percent";
export type GuideChartData = {
  title: string;
  description?: string;
  format: GuideChartFormat;
  items: { label: string; value: number }[];
  note: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const boundedText = (value: unknown, limit: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= limit;

/** Chart content is editorial data, never executable markup or a chart-library config. */
export function parseGuideChart(source: string): GuideChartData | null {
  if (source.length > 16000) return null;
  let value: unknown;
  try { value = JSON.parse(source); } catch { return null; }
  if (!isRecord(value) || Object.keys(value).some(key => !["title", "description", "format", "items", "note"].includes(key))) return null;
  if (!boundedText(value.title, 160) || !boundedText(value.note, 600)) return null;
  if (value.description !== undefined && !boundedText(value.description, 600)) return null;
  if (value.format !== "currency" && value.format !== "number" && value.format !== "percent") return null;
  if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 6) return null;
  const items: GuideChartData["items"] = [];
  for (const item of value.items) {
    if (!isRecord(item) || Object.keys(item).some(key => key !== "label" && key !== "value") || !boundedText(item.label, 120)) return null;
    if (typeof item.value !== "number" || !Number.isFinite(item.value) || item.value < 0 || item.value > 1_000_000_000_000) return null;
    if (value.format === "percent" && item.value > 100) return null;
    items.push({ label: item.label.trim(), value: item.value });
  }
  return {
    title: value.title.trim(),
    description: typeof value.description === "string" ? value.description.trim() : undefined,
    format: value.format,
    items,
    note: value.note.trim(),
  };
}

export function formatGuideChartValue(value: number, format: GuideChartFormat): string {
  const options: Intl.NumberFormatOptions = { maximumFractionDigits: 20 };
  if (format === "currency") Object.assign(options, { style: "currency", currency: "USD", minimumFractionDigits: 0 });
  const formatted = new Intl.NumberFormat("en-US", options).format(value);
  return format === "percent" ? `${formatted}%` : formatted;
}

export function guideChartBarWidth(value: number, maximum: number): number {
  return maximum > 0 ? (value / maximum) * 100 : 0;
}

type GuideBlock = { type: "markdown" | "chart"; content: string };

/** Preserve fenced chart data even when an editor pretty-prints JSON with blank lines. */
export function splitGuideBlocks(markdown: string): GuideBlock[] {
  const blocks: GuideBlock[] = [];
  let lines: string[] = [];
  let inChart = false;
  const flushMarkdown = () => {
    blocks.push(...lines.join("\n").split(/\n{2,}/).map(content => content.trim()).filter(Boolean).map(content => ({ type: "markdown" as const, content })));
    lines = [];
  };
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    if (!inChart && /^```guide-chart\s*$/.test(line)) {
      flushMarkdown();
      inChart = true;
    } else if (inChart && /^```\s*$/.test(line)) {
      blocks.push({ type: "chart", content: lines.join("\n") });
      lines = [];
      inChart = false;
    } else {
      lines.push(line);
    }
  }
  // An unfinished chart fence must not expose its JSON to readers.
  if (!inChart) flushMarkdown();
  return blocks;
}
