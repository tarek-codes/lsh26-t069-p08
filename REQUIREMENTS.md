# Requirements Specification — School Result Processing and GPA Engine

## 1. Executive Summary & Problem Context

A secondary school historically calculated student examination results manually using spreadsheets. This manual calculation created high operational overhead and introduced recurring calculation errors due to several intricate, non-linear grading rules:
1. **Dual-Component Pass Constraint (`R-11`)**: Practical subjects (e.g., Physics, Chemistry, Biology, Higher Math, Agriculture) require passing both the theory component ($\ge 25/75$) and the practical component ($\ge 8/25$) independently. A student failing practical with a passing theory mark (or vice versa) fails the subject completely (Grade Point 0.00, Grade F).
2. **Optional Fourth Subject Bonus Threshold (`R-13`, `R-20`)**: The optional fourth subject only contributes grade points in excess of $2.00$ ($GP_{bonus} = \max(0, GP_{optional} - 2.0)$). It does not change the GPA divisor ($6.0$). If the optional GP is $\le 2.00$, it contributes $0.00$.
3. **Compulsory Failure Overrides Good Average (`R-13`)**: A fail in any of the 6 compulsory subjects reduces the student's final GPA to $0.00$ and letter grade to `F`, regardless of how high their uncancelled raw average is.
4. **Subject Absence Handling (`R-12`)**: Absent marks (`AB`) in compulsory subjects cause an immediate subject GP of $0.00$ and overall failure (`F`). An absent optional subject yields $0.00$ bonus without failing the student, but flags the student for office review.
5. **Pre-Publication Checking Lists (`R-29`)**: The administrative office requires an automated verification system before publishing results to review hard-edge cases: low optional scores, practical failures, and absent marks.

This specification defines the complete end-to-end software requirements for an automated, deterministic GPA Engine with full audit traceability and an administrative verification dashboard.

---

## 2. System Objectives

- **100% Rule Compliance**: Implement the exact school grading rules (`R-10`, `R-11`, `R-12`, `R-13`, `R-20`, `R-21`, `R-29`) with zero deviation.
- **Explainable AI / Transparent Auditing**: Every calculated number must have a verifiable step-by-step trace showing the raw input marks, component evaluations, applied rule codes, intermediate points, and final GPA/Grade.
- **Office Verification Workflow**: Provide interactive checking lists categorizing edge-case students before report cards and transcripts are finalized.
- **Comprehensive Seed Dataset**: Deliver at least 60 students across 2 classes (Class 9 & Class 10) featuring at least 8 verified hard-edge edge cases.

---

## 3. Subject Curriculum & Structure

The school curriculum comprises 9 standard subjects. Each student is enrolled in exactly **7 subjects** (6 compulsory + 1 optional fourth subject).

| Subject Code | Subject Name | Subject Type | Has Practical | Theory Max (Pass) | Practical Max (Pass) | Total Marks (Pass) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`BAN`** | Bangla | Compulsory | No | — | — | 100 (33) |
| **`ENG`** | English | Compulsory | No | — | — | 100 (33) |
| **`MAT`** | Mathematics | Compulsory | No | — | — | 100 (33) |
| **`PHY`** | Physics | Compulsory | Yes | 75 (25) | 25 (8) | 100 (33) |
| **`CHE`** | Chemistry | Compulsory | Yes | 75 (25) | 25 (8) | 100 (33) |
| **`BIO`** | Biology | Compulsory | Yes | 75 (25) | 25 (8) | 100 (33) |
| **`HMT`** | Higher Mathematics | Optional Choice | Yes | 75 (25) | 25 (8) | 100 (33) |
| **`AGR`** | Agriculture | Optional Choice | Yes | 75 (25) | 25 (8) | 100 (33) |
| **`REL`** | Religion | Optional Choice | No | — | — | 100 (33) |

> **Note**: Every student must have all 6 compulsory subjects (`BAN`, `ENG`, `MAT`, `PHY`, `CHE`, `BIO`) and exactly one elective fourth subject (`HMT`, `AGR`, or `REL`).

---

## 4. Functional Requirements (FR)

### Module 1: Student & Class Management
- **`FR-01`**: The system shall manage at least two classes (e.g., `Class 9` and `Class 10`).
- **`FR-02`**: The system shall maintain student profiles including Student ID (e.g., `S001`), Full Name, Class, Roll Number, and designated Optional Subject Code (`HMT`, `AGR`, or `REL`).
- **`FR-03`**: The system shall enforce that every student is enrolled in exactly 6 compulsory subjects and exactly 1 optional subject.

### Module 2: Mark Ingestion & Component Validation
- **`FR-04` (Non-Practical Mark Ingestion)**: For non-practical subjects (`BAN`, `ENG`, `MAT`, `REL`), the mark must be either an integer between $0$ and $100$, or the special token `"AB"` (Absent).
- **`FR-05` (Practical Mark Ingestion)**: For practical subjects (`PHY`, `CHE`, `BIO`, `HMT`, `AGR`), the mark must be represented as a composite object `{"theory": 0..75, "practical": 0..25}` or `"AB"` (Absent).
- **`FR-06` (Component Pass Validation — `R-11`)**: 
  - For practical subjects, the theory mark must be $\ge 25$ AND the practical mark must be $\ge 8$.
  - If $theory < 25$ OR $practical < 8$, the subject status is `FAIL`, Grade Point is `0.00`, and Letter Grade is `F`, even if $theory + practical \ge 33$.
- **`FR-07` (Non-Practical Pass Validation)**: For non-practical subjects, the mark must be $\ge 33$. A mark $< 33$ produces subject Grade Point `0.00` and Letter Grade `F`.
- **`FR-08` (Absence Handling — `R-12`)**:
  - If a student has `"AB"` in a compulsory subject, subject GP = `0.00`, subject Grade = `F`, and the mark displayed remains `"AB"` (never converted to numeric 0).
  - If a student has `"AB"` in an optional subject, optional GP = `0.00`, contributing `0.00` bonus points.

### Module 3: Subject Grading Scale (`R-21`)
- **`FR-09`**: When all component pass conditions are met, total subject marks ($0..100$) map to Grade Point (GP) and Letter Grade as follows:
  - $80 \le \text{Mark} \le 100 \implies \text{GP} = 5.0, \text{Grade} = \text{A+}$
  - $70 \le \text{Mark} \le 79 \implies \text{GP} = 4.0, \text{Grade} = \text{A}$
  - $60 \le \text{Mark} \le 69 \implies \text{GP} = 3.5, \text{Grade} = \text{A-}$
  - $50 \le \text{Mark} \le 59 \implies \text{GP} = 3.0, \text{Grade} = \text{B}$
  - $40 \le \text{Mark} \le 49 \implies \text{GP} = 2.0, \text{Grade} = \text{C}$
  - $33 \le \text{Mark} \le 39 \implies \text{GP} = 1.0, \text{Grade} = \text{D}$
  - $0 \le \text{Mark} < 33 \implies \text{GP} = 0.0, \text{Grade} = \text{F}$

### Module 4: GPA Engine & Final Grading (`R-10`, `R-13`)
- **`FR-10` (Optional Subject Bonus Points — `R-13`)**:
  $$\text{Bonus Points} = \max(0, \text{GP}_{\text{optional}} - 2.0)$$
- **`FR-11` (Raw Uncapped GPA Formula — `R-13`)**:
  $$\text{Raw GPA} = \frac{\sum_{i=1}^{6} \text{GP}_{\text{compulsory}, i} + \text{Bonus Points}}{6.0}$$
- **`FR-12` (GPA Capping — `R-13`)**:
  $$\text{Capped GPA} = \min(5.00, \text{Raw GPA})$$
  Formatted and rounded to 2 decimal places.
- **`FR-13` (Compulsory Failure Override — `R-13`)**:
  - If $\exists i \in \{1..6\}$ such that $\text{GP}_{\text{compulsory}, i} = 0.00$ (due to score $<33$, component theory $<25$, component practical $<8$, or `"AB"`), then:
    $$\text{Final GPA} = 0.00, \quad \text{Final Letter Grade} = \text{F}$$
  - The system **must retain and display** the uncancelled Raw GPA in the calculation trace.
- **`FR-14` (Final Letter Grade Scale — `R-10`)**:
  - $\text{GPA} = 5.00 \implies \text{A+}$
  - $4.00 \le \text{GPA} < 5.00 \implies \text{A}$
  - $3.50 \le \text{GPA} < 4.00 \implies \text{A-}$
  - $3.00 \le \text{GPA} < 3.50 \implies \text{B}$
  - $2.00 \le \text{GPA} < 3.00 \implies \text{C}$
  - $1.00 \le \text{GPA} < 2.00 \implies \text{D}$
  - $\text{GPA} = 0.00 \text{ or Compulsory Fail} \implies \text{F}$

### Module 5: Per-Student Audit Trace (`R-30`)
- **`FR-15`**: For every student, the engine must produce an immutable calculation trace containing:
  - Student identity (ID, Name, Class, Roll).
  - Subject-by-subject evaluation breakdown (Subject code, raw theory/practical/AB mark, total mark, component status, subject GP, subject letter grade, and specific rule code applied).
  - List of failing compulsory subjects (if any) explicitly highlighted as the root cause of overall failure.
  - Optional subject breakdown (Optional GP, bonus point calculation step, rule applied).
  - GPA arithmetic breakdown ($\text{Sum of Compulsory GPs}$, $\text{Bonus Points Added}$, $\text{Divisor} = 6.0$, $\text{Raw GPA}$, $\text{Capped GPA}$, $\text{Failure Override Status}$, $\text{Final GPA}$, $\text{Final Grade}$).

### Module 6: Pre-Publication Office Checking Lists (`R-29`)
- **`FR-16` (Checking List Generation)**: The system must automatically populate three dedicated verification lists prior to final result publication:
  1. **Optional Review List**: Every student whose optional subject GP is $\le 2.00$ (including `"AB"` where GP = $0.00$).
  2. **Practical Fail Review List**: Every student who scored $< 8$ in the practical component of any subject (compulsory or optional).
  3. **Absentee Review List**: Every student with an `"AB"` mark in any subject (compulsory or optional).
- **`FR-17` (Multi-List Membership)**: A student meeting multiple conditions must appear in all corresponding checking lists and on a unified Multi-Flag Review Summary.
- **`FR-18` (Office Verification Actions)**: Teachers and administrators can view the student trace directly from checking lists, mark items as `Verified`, `Under Review`, or `Correction Required`, and attach administrative sign-off notes.

### Module 7: Admin Dashboard & User Interface
- **`FR-19` (Side Navigation Panel)**: Persistent sidebar navigation routing to:
  - **Overview / Metrics Dashboard**: Total students, pass rate, GPA distribution (A+, A, A-, B, C, D, F), flagged count.
  - **Class Results Matrix**: Interactive table showing Class 9 / Class 10 student results with subject-level breakdown and GPA/Grade.
  - **Student Detail & Audit Trace**: Dedicated view/modal with human-readable calculation step breakdown.
  - **Pre-Publication Checking Lists**: Tabbed interface for Optional $\le 2.0$, Practical Fail, Absentee, and Multi-Flag review.
  - **Mark Entry & Ingestion**: Form/grid interface to input and edit student marks with instant validation.
  - **Seed Data & Engine Runner**: One-click database re-seed, batch calculation runner, and benchmark test suite.
  - **Export & Print Transcripts**: Clean, printable student academic transcripts and summary mark sheets.

---

## 5. Required Seed Dataset & 8 Hard-Edge Cases

The system must include a seeded dataset of at least **60 students** across **Class 9 and Class 10** containing at least the following 8 documented hard-edge cases:

| Case ID | Student Name | Target Hard Edge | Key Mark Profile | Expected Result & Trace Output |
| :--- | :--- | :--- | :--- | :--- |
| **`EDGE-01`** | Arif Hossain | Compulsory Fail with High Average | BAN 85, ENG 88, MAT 30 (Fail), PHY 70+20=90, CHE 65+20=85, BIO 68+22=90, HMT 70+22=92 (GP 5.0) | Raw uncancelled GPA: **4.67 (A)**; Final GPA: **0.00 (F)**. Trace flags `MAT (30 < 33)` as root cause of failure. |
| **`EDGE-02`** | Tanvir Ahmed | Practical Fail with High Theory Mark | PHY: Theory **65/75** (Pass), Practical **7/25** (Fail $< 8$). All other subjects passed with A+. | PHY GP: **0.00 (F)**. Final GPA: **0.00 (F)**. Trace shows `PHY Practical 7 < 8` failed subject despite Theory 65. |
| **`EDGE-03`** | Nusrat Jahan | Theory Fail with High Practical Mark | CHE: Theory **22/75** (Fail $< 25$), Practical **24/25** (Pass). Total marks = 46. | CHE GP: **0.00 (F)**. Final GPA: **0.00 (F)**. Trace shows `CHE Theory 22 < 25` failed subject despite Total 46. |
| **`EDGE-04`** | Sakib Al Hasan | Optional GP $\le 2.0$ (Zero Bonus) | Optional AGR: Theory 26, Practical 14 (Total 40, GP 2.0). All compulsory subjects passed with 5.0. | Optional GP = 2.00; Bonus = $\max(0, 2.0 - 2.0) = \mathbf{0.00}$. Final GPA = $30.0 / 6 = \mathbf{5.00 (A+)}$. Flagged on **Optional List**. |
| **`EDGE-05`** | Mehedi Hasan | Optional GP $> 2.0$ (Active Bonus) | Compulsory GPs: 4.0, 4.0, 4.0, 4.0, 4.0, 4.0 (Sum = 24.0). Optional HMT: 85 (GP 5.0). | Bonus = $5.0 - 2.0 = \mathbf{3.0}$. Final GPA = $(24.0 + 3.0)/6 = \mathbf{4.50 (A)}$. (Without bonus: 4.00 A). |
| **`EDGE-06`** | Farhana Akter | GPA Capping at 5.00 | Compulsory GPs: 5.0, 5.0, 5.0, 5.0, 5.0, 5.0 (Sum = 30.0). Optional AGR: 85 (GP 5.0). | Raw GPA = $(30.0 + 3.0)/6 = \mathbf{5.50}$. Final Capped GPA = $\mathbf{5.00 (A+)}$. Trace notes `Capped from 5.50 to 5.00`. |
| **`EDGE-07`** | Sadia Islam | Absent in Compulsory Subject | BAN: `"AB"`. All other subjects 80+ (A+). | BAN GP = **0.00 (F)**. Final GPA = **0.00 (F)**. Flagged on **Absentee List** (`BAN: AB`). |
| **`EDGE-08`** | Rashedul Karim | Absent in Optional Subject | All 6 Compulsory passed (Sum GP = 27.0). Optional HMT: `"AB"`. | Optional GP = **0.00**; Bonus = **0.00**. Final GPA = $27.0/6 = \mathbf{4.50 (A)}$. Flagged on **Absentee List** and **Optional List**. |

---

## 6. Non-Functional Requirements (NFR)

- **`NFR-01` (Determinism)**: Calculation results must be 100% pure and deterministic. The same student mark input must produce identical results and trace outputs across all executions.
- **`NFR-02` (Precision & Rounding)**: Floating point operations must avoid precision drift. Grade points and GPAs must be evaluated using standard IEEE-754 / decimal arithmetic rounded to 2 decimal places.
- **`NFR-03` (Performance)**: The calculation engine must evaluate 1,000 students in less than 100 milliseconds.
- **`NFR-04` (Audit Immutability)**: Calculation run records and traces must be stored with timestamps and calculation version hashes.
- **`NFR-05` (Accessibility & Usability)**: The admin dashboard must conform to WCAG 2.1 AA standards, featuring high-contrast text, full keyboard navigation, and responsive layouts for desktop and mobile viewports.
- **`NFR-06` (Data Integrity)**: The PostgreSQL database must enforce foreign key integrity, check constraints on mark boundaries ($0..75$, $0..25$, $0..100$), and atomic transactions for mark updates.
