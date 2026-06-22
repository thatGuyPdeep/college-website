import { NextResponse } from "next/server";
import { getMergedDisclosure } from "@/lib/content/public-data";
import { generateDisclosurePdf } from "@/lib/pdf/generate-disclosure";

/** GET /api/disclosure/pdf — UGC mandatory disclosure bundle as PDF */
export async function GET() {
  try {
    const sections = await getMergedDisclosure();
    const pdf = await generateDisclosurePdf(sections);
    const filename = `rkm-narayanpur-disclosure-${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[disclosure/pdf]", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
