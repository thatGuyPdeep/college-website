import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PaymentReceiptDocument, type PaymentReceiptData } from "@/lib/pdf/payment-receipt";

export async function generatePaymentReceiptPdf(data: PaymentReceiptData): Promise<Buffer> {
  const doc = React.createElement(PaymentReceiptDocument, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(doc as any);
}
