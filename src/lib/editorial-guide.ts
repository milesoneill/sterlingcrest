type Section = { title: string; body: string; id: string };
const sectionId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function editorialSections(body: string): Section[] {
  const parts = body.split(/^##\s+(.+)$/gm);
  const sections: Section[] = [];
  for (let i = 1; i < parts.length; i += 2) sections.push({ title: parts[i].trim(), body: (parts[i + 1] ?? "").trim(), id: sectionId(parts[i]) });
  return sections.filter(s => s.title !== "Sources");
}
