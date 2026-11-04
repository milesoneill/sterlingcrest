import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MarkdownBody } from "@/lib/markdown";

it("renders ordered steps as a numbered list, retaining order, emphasis and consultation links", () => {
  render(<MemoryRouter><MarkdownBody markdown={"Before the steps.\n\n1. Keep your **coverage active**.\n2. Your beneficiary files a claim.\n3. [Discuss your plan](/book).\n\nAfter the steps."} /></MemoryRouter>);
  const list = screen.getByRole("list");
  expect(list.tagName).toBe("OL");
  expect(within(list).getAllByRole("listitem").map(item => item.textContent)).toEqual(["Keep your coverage active.", "Your beneficiary files a claim.", "Discuss your plan."]);
  expect(within(list).getByText("coverage active").tagName).toBe("STRONG");
  expect(within(list).getByRole("link", { name: "Discuss your plan" })).toHaveAttribute("href", "/book");
  expect(screen.getByText("Before the steps.")).toBeInTheDocument();
  expect(screen.getByText("After the steps.")).toBeInTheDocument();
});

it("keeps bullet lists unordered and preserves a numbered sequence starting later", () => {
  render(<MarkdownBody markdown={"- Amount of coverage\n- Ongoing premium\n\n3. Insurer reviews the claim.\n4. Payment follows approval."} />);
  const lists = screen.getAllByRole("list");
  expect(lists.map(list => list.tagName)).toEqual(["UL", "OL"]);
  expect(lists[1]).toHaveAttribute("start", "3");
  expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(2);
});
