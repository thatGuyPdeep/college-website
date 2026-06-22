import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { DisclosurePdfDocument } from "@/lib/pdf/disclosure-document";
import type { DisclosureSection } from "@/lib/content/public-data";

export async function generateDisclosurePdf(sections: DisclosureSection[]): Promise<Buffer> {
  const doc = React.createElement(DisclosurePdfDocument, { sections });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(doc as any);
}
