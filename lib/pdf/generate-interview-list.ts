import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { InterviewListDocument, type InterviewListRow } from "@/lib/pdf/interview-list";

export async function generateInterviewListPdf(rows: InterviewListRow[]): Promise<Buffer> {
  const generatedAt = new Date().toLocaleString("en-IN");
  const doc = React.createElement(InterviewListDocument, { rows, generatedAt });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(doc as any);
}
