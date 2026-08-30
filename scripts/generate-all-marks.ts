import fs from "fs";
import path from "path";
import seedStudents from "../src/data/seed-students.json";

// 6 Compulsory Core: BAN, ENG, MAT, REL, PHY, CHE
// 1 Chosen 4th Optional Subject: BIO, HMT, or AGR
const optionalChoices = ["BIO", "HMT", "AGR"];

const updatedStudents = seedStudents.map((s: any, idx: number) => {
  const currentMarks = s.marks || {};

  // Assign optional choice from BIO, HMT, AGR
  let opt = s.optional;
  if (!optionalChoices.includes(opt)) {
    opt = optionalChoices[idx % optionalChoices.length];
  }

  // Base marks for all subjects
  let bioMark = currentMarks.BIO || { theory: 60, practical: 20 }; // 80 (A+)
  let hmtMark = currentMarks.HMT || { theory: 58, practical: 20 }; // 78 (A)
  let agrMark = currentMarks.AGR || { theory: 56, practical: 20 }; // 76 (A)
  let relMark = currentMarks.REL || 85;

  // Specific deterministic benchmark edge cases:
  if (s.id === "S001") {
    // S001: Compulsory MAT fail (30 < 33), optional HMT (70+22=92 A+), REL passed (90)
    opt = "HMT";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 70, practical: 22 };
    agrMark = { theory: 60, practical: 20 };
    relMark = 90;
  } else if (s.id === "S002") {
    // S002: Compulsory PHY practical fail (65+6=71, practical < 8), optional AGR (26+14=40)
    opt = "AGR";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 55, practical: 20 };
    agrMark = { theory: 26, practical: 14 };
    relMark = 80;
  } else if (s.id === "S003") {
    // S003: Compulsory CHE theory fail (24+20=44, theory < 25), optional HMT (60+20=80)
    opt = "HMT";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
    relMark = 85;
  } else if (s.id === "S004") {
    // S004: Optional AGR with GP 2.0 (26+14=40 GP 2.00, bonus 0.00), all compulsory 85 A+
    opt = "AGR";
    agrMark = { theory: 26, practical: 14 }; // 40 C (GP 2.00)
    bioMark = { theory: 65, practical: 20 }; // 85 A+
    hmtMark = { theory: 65, practical: 20 }; // 85 A+
    relMark = 85;
  } else if (s.id === "S005") {
    // S005: Optional HMT (65+20=85 A+ GP 5.0 bonus +3.0), all compulsory 75 A (Sum 24.0 -> GPA (24+3)/6 = 4.50 A)
    opt = "HMT";
    bioMark = { theory: 55, practical: 20 };
    hmtMark = { theory: 65, practical: 20 }; // 85 A+
    agrMark = { theory: 55, practical: 20 };
    relMark = 75;
  } else if (s.id === "S006") {
    // S006: Optional AGR (70+22=92 A+ bonus +3.0), all compulsory 90+ A+ (Sum 30.0 -> Raw GPA 5.50 -> Capped 5.00 A+)
    opt = "AGR";
    bioMark = { theory: 70, practical: 22 };
    agrMark = { theory: 70, practical: 22 }; // 92 A+
    hmtMark = { theory: 70, practical: 22 };
    relMark = 90;
  } else if (s.id === "S007") {
    // S007: Compulsory BAN Absent ("AB"), optional BIO (60+20=80)
    opt = "BIO";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
    relMark = 85;
  } else if (s.id === "S008") {
    // S008: Optional HMT Absent ("AB"), all compulsory passed 80 A+ -> GPA 5.00 A+
    opt = "HMT";
    hmtMark = "AB";
    bioMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
    relMark = 80;
  }

  const marks = {
    BAN: currentMarks.BAN ?? 80,
    ENG: currentMarks.ENG ?? 80,
    MAT: currentMarks.MAT ?? 80,
    REL: relMark,
    PHY: currentMarks.PHY ?? { theory: 60, practical: 20 },
    CHE: currentMarks.CHE ?? { theory: 60, practical: 20 },
    BIO: bioMark,
    HMT: hmtMark,
    AGR: agrMark,
  };

  return {
    ...s,
    optional: opt,
    marks,
  };
});

fs.writeFileSync(
  path.join(__dirname, "../src/data/seed-students.json"),
  JSON.stringify(updatedStudents, null, 2)
);

console.log("✅ Seed dataset updated: BAN, ENG, MAT, REL, PHY, CHE are compulsory, optional is BIO, HMT, or AGR.");

