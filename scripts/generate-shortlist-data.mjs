#!/usr/bin/env node
/** One-off: regenerate lib/content/admissions-shortlist-first.ts from Obsidian export */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const INPUT = "D:/Obsidian Vault/second_brain/Education/Professor/RKM-Narainpur-Website-Content/Programme Name Application Id Student De.txt";
const OUTPUT = join(process.cwd(), "lib/content/admissions-shortlist-first.ts");

const PROG_LABELS = {
  "C0001704-BA(BA)": "BA",
  "C0002704-B.Sc Science()": "B.Sc Science",
  "C0003704-B.Sc Life Science()": "B.Sc Life Science",
  "C0005704-B.Com()": "B.Com",
};

const SKIP = new Set(["Preview", "Document", "Add / Remove Merit List"]);
const lines = readFileSync(INPUT, "utf8").split(/\r?\n/);
const seen = new Set();
const records = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (SKIP.has(line) || line.startsWith("Programme Name\t")) continue;
  const m = line.match(/^[\t ]*(C\d{7}-[^\t]+)\t(A\d+)\t(.+)$/);
  if (!m) continue;
  const programmeCode = m[1].trim();
  const applicationId = m[2];
  const name = m[3].trim().replace(/\b\w/g, (c) => c.toUpperCase());
  if (seen.has(applicationId)) continue;
  seen.add(applicationId);
  records.push({
    applicationId,
    name,
    programme: PROG_LABELS[programmeCode] ?? programmeCode,
    programmeCode,
  });
}

const body = `/** First admission shortlist — session 2026-27 (unique applicants by application ID). */
export type ShortlistStudent = {
  applicationId: string;
  name: string;
  programme: string;
  programmeCode: string;
};

export const SHORTLIST_META = {
  title: "1st List of Shortlisted Students",
  session: "2026-27",
  publishedAt: "2026-06-22",
  href: "/admissions/shortlist",
} as const;

export const ADMISSIONS_SHORTLIST_FIRST: ShortlistStudent[] = ${JSON.stringify(records, null, 2)};

export const SHORTLIST_COUNT = ${records.length};
`;

writeFileSync(OUTPUT, body, "utf8");
console.log(`Wrote ${records.length} students to ${OUTPUT}`);
