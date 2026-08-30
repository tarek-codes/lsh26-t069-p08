# Hackathon Evaluation Record & Submission Manifest (P08)

- **Team ID:** `LSH26-T069`
- **Problem ID:** `P08` — School Result Processing & Deterministic GPA Engine
- **Repository Name:** `lsh26-t069-p08`
- **Live Deployment URL:** `https://lsh26-t069-p08.vercel.app` (Local: `http://localhost:3000`)
- **Event Start Code:** `LSH26-8490-C900`
- **Repository Created Before Release:** `No`
- **Licenses Reference:** [`LICENSES.md`](./LICENSES.md)

---

## 1. Problem Solving Approach & Architecture

We designed and implemented an enterprise-grade, deterministic GPA Engine and audit verification platform compliant with 100% of the national secondary school grading rules (`R-10` through `R-30`).

### Core Architecture Pillars:
1. **Pure Deterministic Calculation Engine (`src/engine/`)**:
   - Zero floating-point drift using `decimal.js`.
   - Strictly enforces the 6 compulsory subjects (`BAN`, `ENG`, `MAT`, `REL`, `PHY`, `CHE`) with a fixed **`6.0` GPA divisor**.
   - Evaluates the student's chosen elective (`BIO`, `HMT`, or `AGR`) using Rule `R-20`: $\max(0, \text{GP} - 2.0)$ bonus points.
   - Dual-component pass constraint (`R-11`): Theory $\ge 25/75$ AND Practical $\ge 8/25$.
   - Compulsory failure override (`R-13`): Any compulsory fail produces GPA $0.00$ (`F`), while logging uncancelled raw GPA in the audit trace.
2. **Transparent Explainability (`R-30`)**:
   - Step-by-step arithmetic narrative for every student record accessible via an interactive slide-over audit drawer.
3. **Administrative Pre-Publication Checking Lists (`R-29`)**:
   - Automated categorization into Optional List ($\text{GP} \le 2.0$ or `"AB"`), Practical Fail List ($< 8$), and Absent List (`"AB"`).
   - Sign-off verification workflow with auditor notes.
4. **Marks Sheet Ingestion & Diagnostic Rejection Engine (`/dashboard/import`)**:
   - Ingests CSV, TSV, or JSON data and validates row-by-row.
   - Rejects malformed rows with exact column, value, rule code, and suggested fix, while allowing one-click commit of valid rows.
5. **Class Performance & Failure Analytics (`/dashboard/analytics`)**:
   - Cohort pass rate, interactive grade distribution, and prominent focus on the **Subject that Failed the Most Students** with root-cause breakdown.

---

## 2. Requirements Compliance Matrix

| Rule / Requirement | Description | Status | Verification Evidence / Source File |
| :--- | :--- | :---: | :--- |
| **`R-10`** | Final GPA to Letter Grade Mapping Scale | **Complete** | [`src/engine/rules.ts`](./src/engine/rules.ts) (`mapGPAToLetterGrade`) |
| **`R-11`** | Dual-Component Pass Constraint (Theory $\ge 25$, Practical $\ge 8$) | **Complete** | [`src/engine/rules.ts`](./src/engine/rules.ts) (`evaluateSubjectMark`) |
| **`R-12`** | Absence Token (`AB`) Handling | **Complete** | [`src/engine/rules.ts`](./src/engine/rules.ts) (`evaluateSubjectMark`) |
| **`R-13`** | Compulsory Failure Override & GPA Capping at 5.00 | **Complete** | [`src/engine/calculator.ts`](./src/engine/calculator.ts) (`calculateStudentGPA`) |
| **`R-20`** | Optional 4th Subject Bonus ($\max(0, \text{GP}-2.0)$) | **Complete** | [`src/engine/rules.ts`](./src/engine/rules.ts) (`calculateOptionalBonus`) |
| **`R-21`** | Subject Total Mark (0-100) to GP/Grade Mapping Scale | **Complete** | [`src/engine/rules.ts`](./src/engine/rules.ts) (`mapTotalMarkToGrade`) |
| **`R-29`** | Pre-Publication Checking Lists (3 Core Lists + Multi-List) | **Complete** | [`src/engine/rules.ts`](./src/engine/rules.ts) & [`/dashboard/checking-lists`](./src/app/dashboard/checking-lists/page.tsx) |
| **`R-30`** | Explainable Per-Student Audit Trace Steps | **Complete** | [`src/engine/trace.ts`](./src/engine/trace.ts) & [`TraceDrawer.tsx`](./src/components/results/TraceDrawer.tsx) |
| **`IMPORT`** | Marks Sheet Ingestion with Row Rejection Diagnostics | **Complete** | [`src/engine/marks-importer.ts`](./src/engine/marks-importer.ts) & [`/dashboard/import`](./src/app/dashboard/import/page.tsx) |
| **`ANALYTICS`** | Class Summary, Pass Rate, Grade Distribution, Most Failed Subject | **Complete** | [`/api/v1/analytics`](./src/app/api/v1/analytics/route.ts) & [`/dashboard/analytics`](./src/app/dashboard/analytics/page.tsx) |

---

## 3. Benchmark Hard-Edge Test Cases (Seed Dataset)

All 8 mandatory benchmark edge cases are implemented deterministically and verified via automated unit tests:

1. **`EDGE-01` (`S001`)**: Compulsory Failure (MAT score 30 $< 33$) overrides high average marks $\implies \text{GPA} = 0.00$ (`F`).
2. **`EDGE-02` (`S002`)**: Practical Failure in PHY (Theory 65 $\ge 25$, Practical 6 $< 8$, Total 71) $\implies \text{Subject GP} = 0.00$ (`F`), flagged on *Practical Fail List*.
3. **`EDGE-03` (`S003`)**: Theory Failure in CHE (Theory 24 $< 25$, Practical 20 $\ge 8$, Total 44) $\implies \text{Subject GP} = 0.00$ (`F`).
4. **`EDGE-04` (`S004`)**: Optional Subject with $\text{GP} \le 2.00$ (AGR total 40 $\implies \text{GP} = 2.00$) yields $0.00$ bonus points; flagged on *Optional List*.
5. **`EDGE-05` (`S005`)**: Optional Subject with $\text{GP} = 5.00$ (HMT total 85) adds $(5.00 - 2.00) = +3.00$ bonus points; elevates overall GPA to $4.50$ (`A`).
6. **`EDGE-06` (`S006`)**: High scores produce Raw GPA $5.50 \implies$ Capped at the maximum Final GPA of $5.00$ (`A+`).
7. **`EDGE-07` (`S007`)**: Compulsory Absent (`BAN: AB`) $\implies \text{GPA} = 0.00$ (`F`), flagged on *Absent List*.
8. **`EDGE-08` (`S008`)**: Optional Absent (`HMT: AB`) $\implies 0.00$ bonus points, student passes on compulsory subjects, flagged on *Absent List* and *Optional List*.

---

## 4. Team Contributions

- **Tarek (`@tarek-codes`)**:
  - Full-stack system architecture and Next.js 15 App Router implementation.
  - Core calculation engine, Decimal.js arithmetic integration, and 26/26 unit tests.
  - Pre-publication checking list engine, multi-criteria classifier, and sign-off modal.
  - Marks sheet ingestion parser with row-by-row rejection diagnostics.
  - Class Summary & failure analytics dashboard.
  - Supabase PostgreSQL schema migration and synchronization.

---

## 5. Declaration

The information above is complete and truthful to the best of the team's knowledge.
