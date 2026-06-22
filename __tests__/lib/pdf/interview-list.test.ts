import { describe, it, expect } from "vitest";
import { generateInterviewListPdf } from "@/lib/pdf/generate-interview-list";

describe("generateInterviewListPdf", () => {
  it("returns a non-empty PDF buffer", async () => {
    const pdf = await generateInterviewListPdf([
      {
        name:            "Dr. Example",
        email:           "example@test.com",
        phone:           "9999999999",
        vacancy:         "Professor – CS",
        qualifications:  "Ph.D.",
        experienceYears: "10",
        status:          "shortlisted",
        applied:         "01/01/2026",
      },
    ]);
    expect(pdf.length).toBeGreaterThan(500);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  });
});
