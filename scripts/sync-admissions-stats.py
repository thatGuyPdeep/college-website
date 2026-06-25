"""Regenerate lib/content/admissions-2026.ts from the Obsidian admissions export."""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path

try:
    import openpyxl
except ImportError as exc:
    raise SystemExit("pip install openpyxl") from exc

XLSX = Path(
    r"d:\Obsidian Vault\second_brain\Education\Professor"
    r"\RKM-Narainpur-Website-Content\RKM-Narainpur-Admissions-2026.xlsx"
)
OUT = Path(__file__).resolve().parent.parent / "lib" / "content" / "admissions-2026.ts"

SLUG_MAP = {
    "C0001704-BA(BA)": ("ba-humanities", "BA (Bachelor of Arts)"),
    "C0002704-B.Sc Science()": ("bsc-science", "B.Sc Science"),
    "C0003704-B.Sc Life Science()": ("bsc-life-science", "B.Sc Life Science"),
    "C0005704-B.Com()": ("bcom", "B.Com (Bachelor of Commerce)"),
}


def slugify_code(code: str) -> tuple[str, str]:
    return SLUG_MAP.get(code.strip(), (re.sub(r"[^a-z0-9]+", "-", code.lower()).strip("-"), code))


def main() -> None:
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb["Summary"]
    programmes: list[dict] = []
    totals = {"applicationsReceived": 0, "uniqueApplicants": 0}

    for row in ws.iter_rows(min_row=5, values_only=True):
        name, code, _, apps, unique, _ = (row + (None,) * 6)[:6]
        if name == "GRAND TOTAL":
            totals = {"applicationsReceived": int(apps or 0), "uniqueApplicants": int(unique or 0)}
            break
        if not code or not str(code).startswith("C"):
            continue
        slug, label = slugify_code(str(code))
        programmes.append(
            {
                "programme": label,
                "slug": slug,
                "universityCode": str(code),
                "applicationsReceived": int(apps or 0),
                "uniqueApplicants": int(unique or 0),
            }
        )
    wb.close()

    as_of = date.today().strftime("%d %B %Y").lstrip("0")
    lines = [
        "/**",
        " * UG admission application statistics — session 2026–27.",
        " * Auto-generated from RKM-Narainpur-Admissions-2026.xlsx (Summary sheet).",
        " * Re-sync: python scripts/sync-admissions-stats.py",
        " * PII (names, emails, phones) is never published on the public site.",
        " */",
        "",
        'export const ADMISSIONS_SESSION = "2026–27";',
        "",
        f'export const ADMISSIONS_STATS_AS_OF = "{as_of}";',
        "",
        "export type AdmissionProgrammeStat = {",
        "  programme: string;",
        "  slug: string;",
        "  universityCode: string;",
        "  applicationsReceived: number;",
        "  uniqueApplicants: number;",
        "};",
        "",
        "export const ADMISSION_PROGRAMME_STATS: AdmissionProgrammeStat[] = [",
    ]
    for p in programmes:
        lines.append("  {")
        lines.append(f'    programme: "{p["programme"]}",')
        lines.append(f'    slug: "{p["slug"]}",')
        lines.append(f'    universityCode: "{p["universityCode"]}",')
        lines.append(f'    applicationsReceived: {p["applicationsReceived"]},')
        lines.append(f'    uniqueApplicants: {p["uniqueApplicants"]},')
        lines.append("  },")
    lines += [
        "];",
        "",
        "export const ADMISSION_TOTALS = {",
        f"  applicationsReceived: {totals['applicationsReceived']},",
        f"  uniqueApplicants: {totals['uniqueApplicants']},",
        "} as const;",
        "",
        "export function getAdmissionStatBySlug(slug: string): AdmissionProgrammeStat | undefined {",
        "  return ADMISSION_PROGRAMME_STATS.find((p) => p.slug === slug);",
        "}",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(programmes)} programmes, {totals['uniqueApplicants']} unique applicants)")


if __name__ == "__main__":
    main()
