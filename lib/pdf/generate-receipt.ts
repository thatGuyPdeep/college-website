import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { AdmissionReceiptDocument } from "@/lib/pdf/admission-receipt";
import type { Application } from "@/lib/supabase/types";

export async function generateAdmissionPdf(
  app: Application & { programs?: { name?: string } }
): Promise<Buffer> {
  const doc = React.createElement(AdmissionReceiptDocument, { app });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(doc as any);
}
