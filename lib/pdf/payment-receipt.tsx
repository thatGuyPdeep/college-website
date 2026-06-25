import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page:     { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  header:   { textAlign: "center", marginBottom: 16 },
  title:    { fontSize: 16, fontWeight: "bold", color: "#0D2660" },
  subtitle: { fontSize: 9, color: "#666", marginTop: 4 },
  receiptNo:{ textAlign: "center", fontSize: 12, fontWeight: "bold", color: "#C8201A", marginVertical: 12 },
  row:      { flexDirection: "row", borderBottom: "0.5pt solid #eee", padding: 8 },
  label:    { width: "42%", color: "#555" },
  value:    { width: "58%", fontWeight: "bold" },
  footer:   { marginTop: 24, fontSize: 8, color: "#888", textAlign: "center" },
});

export type PaymentReceiptData = {
  applicationNo: string | null;
  applicantName: string;
  amount: number;
  paidAt: string;
  orderId: string | null;
  paymentId: string | null;
};

export function PaymentReceiptDocument({ data }: { data: PaymentReceiptData }) {
  const rows: [string, string][] = [
    ["Application No.", data.applicationNo ?? "—"],
    ["Applicant", data.applicantName],
    ["Amount Paid", `₹${data.amount}`],
    ["Payment Date", new Date(data.paidAt).toLocaleString("en-IN")],
    ["Razorpay Order ID", data.orderId ?? "—"],
    ["Razorpay Payment ID", data.paymentId ?? "—"],
  ];

  return (
    <Document title={`Payment Receipt ${data.applicationNo ?? ""}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ramakrishna Mission Vivekananda College, Narayanpur</Text>
          <Text style={styles.subtitle}>Admission Application Fee — Payment Receipt</Text>
        </View>
        <Text style={styles.receiptNo}>RECEIPT</Text>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
        <Text style={styles.footer}>
          This is a computer-generated receipt. For queries contact rkm.narainpur@gmail.com · 07781-252251
        </Text>
      </Page>
    </Document>
  );
}
