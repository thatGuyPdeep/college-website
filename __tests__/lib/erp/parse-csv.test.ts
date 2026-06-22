import { describe, expect, it } from "vitest";
import { parseCsv, csvRowsToObjects } from "@/lib/erp/parse-csv";

describe("parseCsv", () => {
  it("parses simple rows", () => {
    const rows = parseCsv("a,b,c\n1,2,3\n");
    expect(rows).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("handles quoted commas", () => {
    const rows = parseCsv('name,note\n"Smith, J",hello\n');
    expect(rows[1]).toEqual(["Smith, J", "hello"]);
  });

  it("maps rows to objects", () => {
    const objs = csvRowsToObjects(parseCsv("Student Email,Roll Number\na@x.com,001\n"));
    expect(objs[0].student_email).toBe("a@x.com");
    expect(objs[0].roll_number).toBe("001");
  });
});
