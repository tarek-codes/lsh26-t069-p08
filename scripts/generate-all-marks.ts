import fs from "fs";
import path from "path";
import seedStudents from "../src/data/seed-students.json";

// Helper to generate marks for all 9 subjects
// 7 Compulsory Core (BAN, ENG, MAT, REL, PHY, CHE, AGR)
// 1 Compulsory Non-Chosen Elective (if BIO chosen -> HMT compulsory; if HMT chosen -> BIO compulsory)
// 1 Chosen 4th Optional Subject (BIO or HMT)
const updatedStudents = seedStudents.map((s: any, idx: number) => {
  const currentMarks = s.marks || {};
  
  // Set optional to only BIO or HMT (if was AGR, alternate based on index)
  let opt = s.optional;
  if (opt === "AGR" || !opt) {
    opt = idx % 2 === 0 ? "BIO" : "HMT";
  }

  // Base marks for electives
  let bioMark = currentMarks.BIO || { theory: 55, practical: 20 }; // 75 (A)
  let hmtMark = currentMarks.HMT || { theory: 58, practical: 20 }; // 78 (A)
  let agrMark = currentMarks.AGR || { theory: 56, practical: 20 }; // 76 (A)

  // Edge cases specific overrides:
  if (s.id === "S001") {
    // S001: Failed MAT (30), optional HMT (70+22=92 A+), BIO and AGR passed
    opt = "HMT";
    bioMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 70, practical: 22 };
  } else if (s.id === "S002") {
    // S002: PHY practical fail (65+6=71, prac<8), optional BIO (60+20=80 A+)
    opt = "BIO";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 55, practical: 20 };
    agrMark = { theory: 55, practical: 20 };
  } else if (s.id === "S003") {
    // S003: CHE theory fail (24+20=44, th<25), optional BIO (60+20=80 A+)
    opt = "BIO";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
  } else if (s.id === "S004") {
    // S004: optional BIO with GP 2.0 (theory 26, prac 14 = 40 GP 2.00, bonus 0.00), all compulsory 85 A+
    opt = "BIO";
    bioMark = { theory: 26, practical: 14 }; // 40 C (GP 2.00)
    hmtMark = { theory: 65, practical: 20 }; // 85 A+
    agrMark = { theory: 65, practical: 20 }; // 85 A+
  } else if (s.id === "S005") {
    // S005: optional HMT (65+20=85 A+ GP 5.0 bonus +3.0), all compulsory 75 A
    opt = "HMT";
    bioMark = { theory: 55, practical: 20 }; // 75 A
    agrMark = { theory: 55, practical: 20 }; // 75 A
    hmtMark = { theory: 65, practical: 20 }; // 85 A+
  } else if (s.id === "S006") {
    // S006: optional BIO (70+22=92 A+ bonus +3.0), all compulsory 90+ A+ -> Capped at 5.00
    opt = "BIO";
    bioMark = { theory: 70, practical: 22 }; // 92 A+
    hmtMark = { theory: 70, practical: 22 }; // 92 A+
    agrMark = { theory: 70, practical: 22 }; // 92 A+
  } else if (s.id === "S007") {
    // S007: Compulsory BAN Absent ("AB"), optional BIO (60+20=80)
    opt = "BIO";
    bioMark = { theory: 60, practical: 20 };
    hmtMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
  } else if (s.id === "S008") {
    // S008: Optional HMT Absent ("AB"), all compulsory passed 80 A+
    opt = "HMT";
    hmtMark = "AB";
    bioMark = { theory: 60, practical: 20 };
    agrMark = { theory: 60, practical: 20 };
  }

  const marks = {
    BAN: currentMarks.BAN ?? 80,
    ENG: currentMarks.ENG ?? 80,
    MAT: currentMarks.MAT ?? 80,
    REL: currentMarks.REL ?? 80,
    PHY: currentMarks.PHY ?? { theory: 60, practical: 20 },
    CHE: currentMarks.CHE ?? { theory: 60, practical: 20 },
    AGR: agrMark,
    BIO: bioMark,
    HMT: hmtMark,
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

console.log("✅ Seed dataset updated: AGR is compulsory, 4th optional is BIO or HMT, and all 9 subject marks populated.");

