// Downloadable example marks sheets for the Import Marks page.
// CSV and JSON versions are generated from the same rows so they always agree.

const SUBJECTS = ["BAN", "ENG", "MAT", "REL", "PHY", "CHE", "BIO", "HMT", "AGR"] as const;
const PRACTICAL = new Set(["PHY", "CHE", "BIO", "HMT", "AGR"]);

type Row = {
  id: string;
  name: string;
  roll: number;
  class: string;
  optional: string;
  marks: Record<string, string | number>;
};

const m = (
  ban: string | number, eng: string | number, mat: string | number, rel: string | number,
  phy: string, che: string, bio: string, hmt: string, agr: string
) => ({ BAN: ban, ENG: eng, MAT: mat, REL: rel, PHY: phy, CHE: che, BIO: bio, HMT: hmt, AGR: agr });

const VALID_ROWS: Row[] = [
  { id: "S061", name: "Ayesha Siddika", roll: 31, class: "Class 9", optional: "HMT", marks: m(82, 78, 85, 90, "62+22", "58+20", "65+21", "68+24", "60+20") },
  { id: "S062", name: "Mustafizur Rahman", roll: 32, class: "Class 9", optional: "BIO", marks: m(75, 80, 72, 85, "55+19", "60+22", "64+23", "55+18", "58+20") },
  { id: "S063", name: "Fatima Tuz Zohra", roll: 33, class: "Class 9", optional: "AGR", marks: m(88, 86, 92, 95, "68+24", "66+23", "70+25", "65+22", "72+25") },
  { id: "S064", name: "Rafiul Islam", roll: 34, class: "Class 9", optional: "BIO", marks: m("AB", 70, 66, 74, "50+17", "52+18", "58+20", "54+19", "56+18") },
];

// Rows 1, 2 and 7 are valid; the rest each break one rule (see MIXED_NOTES).
const MIXED_ROWS: Row[] = [
  { id: "S081", name: "Tanvir Ahmed", roll: 41, class: "Class 9", optional: "BIO", marks: m(85, 80, 75, 90, "60+20", "60+20", "60+20", "60+20", "60+20") },
  { id: "S082", name: "Nusrat Jahan", roll: 42, class: "Class 9", optional: "HMT", marks: m(78, 82, 88, 91, "64+21", "61+19", "59+20", "66+22", "62+20") },
  { id: "S083", name: "Abdur Rahim", roll: 43, class: "Class 9", optional: "CHEM", marks: m(85, 80, 75, 90, "60+20", "60+20", "60+20", "60+20", "60+20") },
  { id: "S084", name: "Nayeem Hasan", roll: 44, class: "Class 9", optional: "BIO", marks: m(85, 80, 75, 90, "82+20", "60+20", "60+20", "60+20", "60+20") },
  { id: "S085", name: "", roll: 45, class: "Class 9", optional: "AGR", marks: m(85, 80, 75, 90, "60+20", "60+20", "60+20", "60+20", "60+20") },
  { id: "S086", name: "Mahmudul Hasan", roll: 46, class: "Class 9", optional: "BIO", marks: m(85, 115, 75, 90, "60+20", "60+20", "60+20", "60+20", "60+20") },
  { id: "S087", name: "Rina Khatun", roll: 47, class: "Class 9", optional: "AGR", marks: m(90, 84, 79, 88, "63+22", "60+21", "66+23", "61+20", "64+22") },
];

export const MIXED_NOTES = [
  "Row 3 (S083): optional subject CHEM is not allowed — use BIO, HMT or AGR",
  "Row 4 (S084): Physics theory 82 is above the maximum of 75",
  "Row 5 (S085): student name is missing",
  "Row 6 (S086): English mark 115 is above 100",
];

const HEADER = ["id", "name", "roll", "class", "optional", ...SUBJECTS].join(",");

const toCsv = (rows: Row[]) =>
  [HEADER, ...rows.map((r) => [r.id, r.name, r.roll, r.class, r.optional, ...SUBJECTS.map((s) => r.marks[s])].join(","))].join("\n") + "\n";

// Practical subjects become { theory, practical } objects in JSON.
const toJson = (rows: Row[]) =>
  JSON.stringify(
    rows.map((r) => ({
      ...r,
      marks: Object.fromEntries(
        SUBJECTS.map((s) => {
          const v = r.marks[s];
          if (PRACTICAL.has(s) && typeof v === "string" && v.includes("+")) {
            const [theory, practical] = v.split("+").map(Number);
            return [s, { theory, practical }];
          }
          return [s, v];
        })
      ),
    })),
    null,
    2
  ) + "\n";

export type SampleFile = {
  id: string;
  title: string;
  description: string;
  filename: string;
  mime: string;
  content: string;
  tone: "valid" | "mixed";
  format: "CSV" | "JSON";
};

export const SAMPLE_FILES: SampleFile[] = [
  {
    id: "valid-csv", title: "Valid sheet", format: "CSV", tone: "valid",
    description: "4 students, all rows pass. Practical subjects use Theory+Practical (62+22); AB marks an absence.",
    filename: "sample-valid-marks.csv", mime: "text/csv", content: toCsv(VALID_ROWS),
  },
  {
    id: "valid-json", title: "Valid sheet", format: "JSON", tone: "valid",
    description: "Same 4 students as JSON. Practical subjects are { theory, practical } objects.",
    filename: "sample-valid-marks.json", mime: "application/json", content: toJson(VALID_ROWS),
  },
  {
    id: "mixed-csv", title: "Mixed sheet", format: "CSV", tone: "mixed",
    description: "7 rows: 3 valid and 4 invalid, to show how rejected rows are reported.",
    filename: "sample-mixed-marks.csv", mime: "text/csv", content: toCsv(MIXED_ROWS),
  },
  {
    id: "mixed-json", title: "Mixed sheet", format: "JSON", tone: "mixed",
    description: "The same 7 rows as JSON, with the same 4 problems.",
    filename: "sample-mixed-marks.json", mime: "application/json", content: toJson(MIXED_ROWS),
  },
];

export const DEFAULT_SAMPLE = SAMPLE_FILES[2].content;
