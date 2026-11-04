import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GuideChart from "@/components/GuideChart";
import { GuideBlocks } from "@/templates/EditorialGuidePage";
import { formatGuideChartValue, parseGuideChart, splitGuideBlocks } from "@/lib/guide-chart";

const example = {
  title: "An example of the funding gap",
  description: "Illustration using the planning example above.",
  format: "currency",
  items: [
    { label: "Planned expenses", value: 5000 },
    { label: "Money set aside", value: 2000 },
    { label: "Gap to plan for", value: 3000 },
  ],
  note: "Hypothetical planning amounts, not cremation prices, an insurance quote, or a recommended benefit.",
};

it("rejects malformed, unsupported or misleading chart payloads without rendering raw JSON", () => {
  const invalid = [
    "{bad JSON}",
    JSON.stringify({ ...example, format: "pie" }),
    JSON.stringify({ ...example, items: [{ label: "Negative", value: -10 }] }),
    JSON.stringify({ ...example, items: [{ label: "Not a number", value: "5000" }] }),
    JSON.stringify({ ...example, items: Array(7).fill(example.items[0]) }),
    JSON.stringify({ ...example, items: [{ label: "x".repeat(121), value: 1 }] }),
    JSON.stringify({ ...example, note: "" }),
    JSON.stringify({ ...example, format: "percent", items: [{ label: "Share", value: 101 }] }),
    '{"title":"Infinite","format":"number","items":[{"label":"Amount","value":1e999}],"note":"Example."}',
  ];
  invalid.forEach(source => expect(parseGuideChart(source)).toBeNull());
  render(<GuideBlocks markdown={'Before the illustration.\n\n```guide-chart\n{"private":"invalid"}\n```\n\nAfter the illustration.'} />);
  expect(screen.getByText("Before the illustration.")).toBeInTheDocument();
  expect(screen.getByText("After the illustration.")).toBeInTheDocument();
  expect(screen.queryByRole("figure")).not.toBeInTheDocument();
  expect(screen.queryByText(/private|invalid/)).not.toBeInTheDocument();
});

it("uses one zero-based scale and exposes every amount without relying on bar colors", () => {
  const chart = parseGuideChart(JSON.stringify(example))!;
  const { container } = render(<GuideChart chart={chart} />);
  const figure = screen.getByRole("figure", { name: example.title });
  const rows = within(figure).getAllByRole("listitem");
  expect(rows.map(row => row.textContent)).toEqual(["Planned expenses$5,000", "Money set aside$2,000", "Gap to plan for$3,000"]);
  expect(Array.from(container.querySelectorAll<HTMLElement>(".eg-chart-bar"), bar => bar.style.width)).toEqual(["100%", "40%", "60%"]);
  expect(figure.querySelector(".eg-chart-axis")).toHaveTextContent("$0$5,000");
  expect(within(figure).getByText(example.note)).toBeInTheDocument();
});

it("keeps all-zero values empty and formats fractional values without changing their meaning", () => {
  const chart = parseGuideChart(JSON.stringify({ ...example, items: [{ label: "No money set aside", value: 0 }] }))!;
  const { container } = render(<GuideChart chart={chart} />);
  expect(container.querySelector<HTMLElement>(".eg-chart-bar")!.style.width).toBe("0%");
  expect(screen.getByText("All values are $0")).toBeInTheDocument();
  expect(formatGuideChartValue(45.25, "currency")).toBe("$45.25");
  expect(formatGuideChartValue(12.5, "percent")).toBe("12.5%");
});

it("preserves chart position and surrounding text when fenced JSON has blank lines", () => {
  const markdown = `First paragraph.\n\n\`\`\`guide-chart\n${JSON.stringify(example, null, 2).replace('  "description"', '\n  "description"')}\n\`\`\`\n\nLast paragraph.`;
  const blocks = splitGuideBlocks(markdown);
  expect(blocks.map(block => block.type)).toEqual(["markdown", "chart", "markdown"]);
  expect(parseGuideChart(blocks[1].content)?.items).toEqual(example.items);
  expect(splitGuideBlocks('Before.\n\n```guide-chart\n{"unfinished":true}')).toEqual([{ type: "markdown", content: "Before." }]);
});

it("labels factual comparison tables truthfully and preserves headers, links and keyboard scrolling", () => {
  render(<MemoryRouter><GuideBlocks markdown={"| Coverage | Who it protects |\n| --- | --- |\n| **PMI** | Your lender |\n| Individual life insurance | [Your next step](/book) |"} /></MemoryRouter>);
  const region = screen.getByRole("region", { name: "Article information, horizontally scrollable" });
  expect(region).toHaveAttribute("tabindex", "0");
  const table = within(region).getByRole("table", { name: "At a glance" });
  expect(within(table).getAllByRole("columnheader")).toHaveLength(2);
  expect(within(table).getByRole("rowheader", { name: "PMI" }).querySelector("strong")).not.toBeNull();
  expect(within(table).getByRole("link", { name: "Your next step" })).toHaveAttribute("href", "/book");
  expect(screen.queryByText(/for illustration only/)).not.toBeInTheDocument();
});
