# User Interface & Pages Specification (`UI-PAGES.md`)

## 1. UI/UX Design System & Theme Foundation

The **School Result Processing and GPA Engine** UI is engineered around a **Data-Dense Administrative Dashboard** design system curated via `ui-ux-pro-max`. It prioritizes maximum clarity, high contrast for numerical marks, instant visual hierarchy for pass/fail statuses, and zero-ambiguity explainability.

### 1.1 Color Tokens & Semantic Palette

```css
:root {
  /* Brand & Layout */
  --color-primary: #1E40AF;          /* Deep Indigo / School Navy */
  --color-primary-hover: #1D4ED8;
  --color-on-primary: #FFFFFF;
  --color-secondary: #3B82F6;        /* Bright Slate Blue */
  --color-accent: #D97706;           /* Amber / Office Audit Alert */
  --color-accent-subtle: #FEF3C7;
  --color-background: #F8FAFC;       /* Crisp Cool Slate Light */
  --color-foreground: #0F172A;       /* Slate 900 */
  --color-card: #FFFFFF;
  --color-card-foreground: #0F172A;
  --color-muted: #F1F5F9;
  --color-muted-foreground: #475569;
  --color-border: #E2E8F0;

  /* Status & Grading Semantic Tokens */
  --color-grade-aplus: #047857;      /* Emerald 700 (A+) */
  --color-grade-aplus-bg: #ECFDF5;
  --color-grade-a: #059669;          /* Emerald 600 (A) */
  --color-grade-a-bg: #F0FDF4;
  --color-grade-aminus: #0D9488;      /* Teal 600 (A-) */
  --color-grade-aminus-bg: #F0FDFA;
  --color-grade-b: #2563EB;          /* Blue 600 (B) */
  --color-grade-b-bg: #EFF6FF;
  --color-grade-c: #D97706;          /* Amber 600 (C) */
  --color-grade-c-bg: #FFFBEB;
  --color-grade-d: #EA580C;          /* Orange 600 (D) */
  --color-grade-d-bg: #FFF7ED;
  --color-grade-f: #DC2626;          /* Red 600 (F / Fail) */
  --color-grade-f-bg: #FEF2F2;

  /* Edge Case Alert Tokens */
  --color-alert-practical-fail: #B91C1C; /* Dark Red */
  --color-alert-practical-bg: #FEE2E2;
  --color-alert-absent: #475569;         /* Slate Gray */
  --color-alert-absent-bg: #F1F5F9;
  --color-alert-optional-low: #B45309;   /* Amber Brown */
  --color-alert-optional-bg: #FEF3C7;
  --color-bonus-active: #7C3AED;         /* Purple 600 (Bonus Added) */
  --color-bonus-bg: #F5F3FF;
}
```

### 1.2 Typography Hierarchy
- **Heading & Numbers Font**: `Fira Code` / `Inter Display` (high legibility for marks, roll numbers, GPAs, and rule codes).
- **Body & Controls Font**: `Inter` / `Fira Sans` (smooth readability for administrative notes, audit traces, and tables).

---

## 2. Global Shell & Side Navigation Panel Layout

The application utilizes a persistent, responsive **Admin Side Navigation Panel** on the left with a main content area that routes dynamically between features.

```
+---------------------------------------------------------------------------------------------------------+
|  SCHOOL RESULT PROCESSING AND GPA ENGINE                                                  [Run Engine]   |
+-------------------+-------------------------------------------------------------------------------------+
| [School Crest]    | Breadcrumbs: Dashboard > Class 9 Results                             [Export Data]  |
| Academic Portal   +-------------------------------------------------------------------------------------+
| Academic Yr: 2026 |                                                                                     |
+-------------------+  MAIN VIEWPORT CONTENT AREA                                                         |
| NAVIGATION        |                                                                                     |
| [o] Dashboard     |  (Dynamic routes: Overview, Class Matrix, Audit Trace Drawer,                       |
| [#] Class Results |   Checking Lists, Marks Studio, Seed Benchmarks, Transcripts)                       |
| [!] Checking List |                                                                                     |
|     - Opt <= 2.0  |                                                                                     |
|     - Prac Fail   |                                                                                     |
|     - Absent (AB) |                                                                                     |
|     - Multi-Flag  |                                                                                     |
| [=] Marks Studio  |                                                                                     |
| [*] Seed & Edges  |                                                                                     |
| [p] Transcripts   |                                                                                     |
+-------------------+                                                                                     |
| Admin: Controller |                                                                                     |
| [v] DB: Connected |                                                                                     |
+-------------------+-------------------------------------------------------------------------------------+
```

### Sidebar Navigation Items & Live Badge Counters:
1. **Overview Dashboard** (`/dashboard`): Home analytics, KPI cards, and grade distributions.
2. **Class Results Matrix** (`/dashboard/results`): Interactive master sheet for Class 9 and Class 10.
3. **Pre-Publication Checking Lists** (`/dashboard/checking-lists`):
   - **Optional $\le 2.0$ Review** (with dynamic badge count: e.g. `[ 5 ]`).
   - **Practical Fail Review** (with dynamic badge count: e.g. `[ 3 ]`).
   - **Absentee Review** (with dynamic badge count: e.g. `[ 2 ]`).
   - **Multi-Flag Review** (with dynamic badge count: e.g. `[ 2 ]`).
4. **Marks Entry Studio** (`/dashboard/marks-entry`): Spreadsheet-like fast grade editor with inline validation.
5. **Seed & Edge-Case Suite** (`/dashboard/seed-data`): 60-student demo loader with quick-jump to all 8 hard-edge cases.
6. **Printable Transcripts** (`/dashboard/reports`): Official grade sheets and student report cards.

---

## 3. Detailed Page Wireframes & Feature Specifications

---

### Page 1: Overview & Analytics Dashboard (`/dashboard`)

#### Purpose:
Provide the school headmaster and examination controller with immediate high-level visibility over cohort performance, overall pass rate, GPA distribution, and active edge-case review alerts.

#### Visual Layout & Components:

```
+---------------------------------------------------------------------------------------------------------+
| DASHBOARD OVERVIEW — ACADEMIC YEAR 2026                               [ Class: Class 9 (All) v ]        |
+---------------------------------------------------------------------------------------------------------+
| [ Total Students ]  | [ Overall Pass Rate ] | [ Average GPA ]     | [ Compulsory Fails ] | [ Flagged Cases ]|
|       60            |       80.0%           |     3.85 / 5.00     |         12           |        10        |
|  Class 9: 30 | C10: 30| Passed: 48 | Fail: 12| Capped at 5.00      | Single Sub Fails: 8  | Need Sign-off    |
+---------------------------------------------------------------------------------------------------------+
| GRADE DISTRIBUTION SUMMARY                                                                              |
|  [ A+ (5.00) ]  ████████████████████ (18 Students - 30.0%)                                              |
|  [ A  (4.00) ]  ███████████████      (14 Students - 23.3%)                                              |
|  [ A- (3.50) ]  ████████             (8 Students  - 13.3%)                                              |
|  [ B  (3.00) ]  ██████               (6 Students  - 10.0%)                                              |
|  [ C  (2.00) ]  ██                   (2 Students  -  3.3%)                                              |
|  [ D  (1.00) ]                       (0 Students  -  0.0%)                                              |
|  [ F  (0.00) ]  ████████████         (12 Students - 20.0% -- 8 due to Compulsory Fail Override)         |
+---------------------------------------------------------------------------------------------------------+
| CRITICAL EDGE CASE ALERTS (PRE-PUBLICATION CHECKS)                                [ Review All Lists -> ]|
| (!) 3 Students failed due to Practical mark < 8 despite passing Theory (Rule R-11)                     |
| (!) 5 Students had Optional 4th Subject GP <= 2.0 (Contributed 0.00 bonus points) (Rule R-20)            |
| (!) 2 Students were marked Absent (AB) in one or more subjects (Rule R-12)                              |
+---------------------------------------------------------------------------------------------------------+
```

#### Key Features:
- **Real-Time KPI Cards**: Total students, pass rate percentage, cohort average GPA, compulsory failure override count, and pending review flags.
- **Visual Grade Histogram**: Color-coded horizontal bars representing students in each letter grade tier.
- **Edge-Case Callout Box**: Immediate alert banners linking directly to the specific checking lists for rapid manual verification.

---

### Page 2: Class Results Matrix (`/dashboard/results`)

#### Purpose:
The primary operational grade matrix. Displays all students in a class with comprehensive subject-by-subject mark breakdowns, theory/practical components, optional bonus additions, and final GPA/Grade calculations.

#### Visual Layout & Table Grid:

```
+---------------------------------------------------------------------------------------------------------+
| CLASS RESULTS MATRIX                                  [ Filter: All Grades v ] [ Search Student/Roll ]  |
| Active Class: Class 9 (30 Students)                   [ Export CSV ] [ Run Batch Recalculation ]       |
+------+------+---------------+------+-----+-----+-----+----------+----------+----------+----------+-----+
| Roll | Code | Student Name  | Opt  | BAN | ENG | MAT | PHY(T+P) | CHE(T+P) | BIO(T+P) | 4th(T+P) | Bonus|
+------+------+---------------+------+-----+-----+-----+----------+----------+----------+----------+-----+
| 01   | S001 | Kamal Begum   | AGR  | 75  | 69  | 84  | 52+19=71 | 54+19=73 | 64+19=83 | 56+18=74 |+1.00|
| 02   | S002 | Lamia Islam   | AGR  | 50  | 48  | 39  | 21+ 6=27!| 30+14=44 | 24+14=38!| 27+ 9=36 | 0.00|
| 03   | S003 | Urmi Akter    | AGR  | 90  | 77  | 96  | 58+24=82 | 74+20=94 | 75+24=99 | 66+21=87 |+3.00|
| 04   | S004 | Imran Sultana | HMT  | 83  | 100 | 32! | 75+25=100| 70+19=89 | 63+25=88 | 65+21=86 |+3.00|
| 05   | S005 | Rafi Rahman   | HMT  | 100 | 100 | 86  | 57+25=82 | 24+20=44!| 60+24=84 | 69+21=90 |+3.00|
+------+------+---------------+------+-----+-----+-----+----------+----------+----------+----------+-----+
| (Continuation of columns: Raw GPA | Capped GPA | Status | Final GPA | Grade | Actions )                     |
| ... S001 -> Raw: 4.17 | Final: 4.17 | PASSED | [ 4.17 ] [ A  ] | [ View Trace ] [ Edit ]                |
| ... S002 -> Raw: 1.83 | Final: 0.00 | FAILED | [ 0.00 ] [ F  ] | [ View Trace ] [ Edit ] (Prac Fail)    |
| ... S003 -> Raw: 5.50 | Final: 5.00 | PASSED | [ 5.00 ] [ A+ ] | [ View Trace ] [ Edit ] (Capped)       |
| ... S004 -> Raw: 4.67 | Final: 0.00 | FAILED | [ 0.00 ] [ F  ] | [ View Trace ] [ Edit ] (MAT Fail)     |
| ... S005 -> Raw: 4.67 | Final: 0.00 | FAILED | [ 0.00 ] [ F  ] | [ View Trace ] [ Edit ] (CHE Th Fail)  |
+---------------------------------------------------------------------------------------------------------+
```

#### Visual Cell Encoding Rules:
- **Red Highlight with Exclamation (`21+ 6=27!`)**: Indicates component failure ($\text{Theory} < 25$ or $\text{Practical} < 8$) triggering `R-11`.
- **Amber Cell (`32!`)**: Indicates non-practical mark below pass mark $33$.
- **Slate Cell (`AB`)**: Indicates absence in subject.
- **Purple Pill (`+3.00` / `+1.00`)**: Indicates active optional 4th subject bonus points added to numerator.
- **Status Badges**:
  - `[ 5.00 A+ ]`: Emerald badge.
  - `[ 0.00 F  ]`: Ruby red badge with hover tooltip detailing exact failure cause (e.g., *"Failed MAT (32/100)"* or *"Failed PHY Practical (6/25)"*).

---

### Page 3: Student Audit Trace Modal / Drawer (`/dashboard/results/[studentId]`)

#### Purpose:
Provide complete mathematical transparency and auditability. Renders the exact chain of rules that evaluated the student's mark into their final grade.

#### Wireframe Breakdown:

```
+---------------------------------------------------------------------------------------------------------+
| AUDIT TRACE: S004 — IMRAN SULTANA                                                        [ Print ] [ X ]|
| Class: Class 9  |  Roll: 04  |  Optional Subject: HMT (Higher Mathematics)                              |
+---------------------------------------------------------------------------------------------------------+
| FINAL RESULT VERDICT                                                                                    |
| [ FINAL GPA: 0.00 ]   [ FINAL GRADE: F ]   [ STATUS: FAILED (COMPULSORY OVERRIDE) ]                     |
|                                                                                                         |
| > AUDIT NARRATIVE:                                                                                      |
|   "Student scored high marks in 5 subjects and optional HMT (producing uncancelled Raw GPA of 4.67 A),  |
|   but scored 32 in compulsory subject MAT (Passing threshold is 33). Under School Grading Rule R-13, a   |
|   fail in any compulsory subject reduces the final GPA to 0.00 and Letter Grade to F."                  |
+---------------------------------------------------------------------------------------------------------+
| STEP 1: COMPULSORY SUBJECTS EVALUATION (6 SUBJECTS)                                                     |
| 1. BAN (Bangla)      : Mark = 83/100  -> GP = 5.00 (A+)  [Rule R-21: RULE_SUB_GRADE_A_PLUS]              |
| 2. ENG (English)     : Mark = 100/100 -> GP = 5.00 (A+)  [Rule R-21: RULE_SUB_GRADE_A_PLUS]              |
| 3. MAT (Mathematics) : Mark = 32/100  -> GP = 0.00 (F)   [Rule R-21: RULE_SUB_GRADE_F]  *** FAILED ***   |
| 4. PHY (Physics)     : Th 75, Pr 25 (Tot 100) -> GP = 5.00 (A+) [Rule R-11: RULE_PRAC_COMPONENT_PASS]   |
| 5. CHE (Chemistry)   : Th 70, Pr 19 (Tot 89)  -> GP = 5.00 (A+) [Rule R-11: RULE_PRAC_COMPONENT_PASS]   |
| 6. BIO (Biology)     : Th 63, Pr 25 (Tot 88)  -> GP = 5.00 (A+) [Rule R-11: RULE_PRAC_COMPONENT_PASS]   |
| ------------------------------------------------------------------------------------------------------- |
| Sum of 6 Compulsory Grade Points = 5.0 + 5.0 + 0.0 + 5.0 + 5.0 + 5.0 = 25.00                           |
+---------------------------------------------------------------------------------------------------------+
| STEP 2: OPTIONAL FOURTH SUBJECT EVALUATION                                                              |
| - Subject: HMT (Higher Mathematics) | Marks: Theory 65/75, Practical 21/25 (Total: 86/100)             |
| - Base Subject Grade Point: GP = 5.00 (A+) [Rule R-21]                                                  |
| - Bonus Calculation: max(0, 5.00 - 2.00) = +3.00 Bonus Grade Points [Rule R-20: RULE_OPT_BONUS_ACTIVE]|
+---------------------------------------------------------------------------------------------------------+
| STEP 3: RAW UNPRECEDENTED GPA ARITHMETIC                                                                |
|   Formula : (Sum of Compulsory GPs + Optional Bonus) / 6.0                                              |
|   Equation: (25.00 + 3.00) / 6.0 = 28.00 / 6.0 = 4.6667 -> 4.67 (Letter Grade: A)                      |
+---------------------------------------------------------------------------------------------------------+
| STEP 4: COMPULSORY FAILURE OVERRIDE CHECK                                                               |
|   Condition: Does student have any compulsory subject with GP == 0.00?                                 |
|   Evaluation: YES — Subject MAT has GP = 0.00 (Score 32 < 33).                                          |
|   Result: Compulsory failure override triggered [Rule R-13: RULE_COMPULSORY_FAIL_OVERRIDE].             |
|   Final GPA is forced from 4.67 to 0.00. Final Letter Grade is forced to F.                             |
+---------------------------------------------------------------------------------------------------------+
```

---

### Page 4: Pre-Publication Office Checking Lists (`/dashboard/checking-lists`)

#### Purpose:
Administrative verification hub before issuing published marks. Allows teachers to inspect and sign off on all students impacted by edge-case rules.

#### Tabbed Interface:
1. **Tab 1: Optional $\le 2.0$ Review List**:
   - Shows students whose optional subject gave $0.00$ bonus points.
   - Highlights if the student was absent (`"AB"`) or had a low score ($\le 49$).
2. **Tab 2: Practical Fail Review List**:
   - Shows students who failed the practical portion ($< 8/25$) of any science/optional subject.
   - Shows Theory mark alongside Practical mark to easily catch data entry inversion errors (e.g. entered 7 instead of 17).
3. **Tab 3: Absentee Review List**:
   - Shows all students marked `"AB"` with subject code and exam date.
4. **Tab 4: Multi-Flag Review Summary**:
   - Lists students who trigger 2 or more of the above lists for priority review.

#### Verification Action Workflow:
- Each row contains a **`[ Verify / Sign-Off ]`** button.
- Clicking opens a verification dialog where the teacher can select:
  - `Verified Correct` (Script confirmed)
  - `Under Review`
  - `Correction Required` (Triggers edit mark flow)
- Stores teacher name and timestamp in the audit database.

---

### Page 5: Mark Entry Studio (`/dashboard/marks-entry`)

#### Purpose:
High-speed mark entry interface with instant validation against school grading constraints.

#### Key Features:
- **Split Component Inputs**: For practical subjects (`PHY`, `CHE`, `BIO`, `HMT`, `AGR`), the UI presents two adjacent number fields: `[ Th: __ /75 ]` and `[ Pr: __ /25 ]`.
- **Single Component Inputs**: For non-practical subjects (`BAN`, `ENG`, `MAT`, `REL`), presents `[ Mark: __ /100 ]`.
- **One-Click Absent Toggle**: Dedicated `[ AB ]` chip next to each field to mark the student absent without manual text entry.
- **Instant Visual Feedback**:
  - Typing `Theory < 25` shows an amber warning tag `Theory Fail`.
  - Typing `Practical < 8` shows a red warning tag `Prac Fail (<8)`.
  - Out-of-bounds numbers ($>75$, $>25$, $>100$, $<0$) are blocked immediately.

---

### Page 6: Seed Dataset & 8 Hard-Edge Case Navigator (`/dashboard/seed-data`)

#### Purpose:
Demonstrates full system compliance with the 60-student dataset and gives judges and administrators instant 1-click access to verify each of the 8 hard-edge test cases.

#### Interactive Edge Case Showcase Cards:

| Card ID | Title | Summary & Rule Demonstration | Quick Action |
| :--- | :--- | :--- | :--- |
| **`EDGE-01`** | **Compulsory Fail / High Avg** | S004 Imran Sultana: High average (Raw GPA 4.67 A), failed MAT (32/100) -> Final GPA 0.00 F. | `[ Inspect Trace ]` |
| **`EDGE-02`** | **Practical Fail / High Theory** | S002 Lamia Islam: PHY Theory 65/75 (High Pass), Practical 6/25 (Fail $< 8$) -> Subject GP 0.00 F. | `[ Inspect Trace ]` |
| **`EDGE-03`** | **Theory Fail / High Practical** | S005 Rafi Rahman: CHE Theory 24/75 (Fail $< 25$), Practical 20/25 (Pass) -> Subject GP 0.00 F. | `[ Inspect Trace ]` |
| **`EDGE-04`** | **Optional GP $\le 2.0$ (Zero Bonus)**| S007 Lamia Begum: Optional REL 42 (GP 2.00) -> Adds 0.00 bonus points. | `[ Inspect Trace ]` |
| **`EDGE-05`** | **Optional GP $> 2.0$ (Active Bonus)** | S001 Kamal Begum: Optional AGR GP 4.00 -> Adds $(4.0 - 2.0) = +2.00$ bonus points (+0.33 GPA). | `[ Inspect Trace ]` |
| **`EDGE-06`** | **GPA Capping at 5.00** | S003 Urmi Akter: All 6 Compulsory A+ (30.0) + Optional A+ (Bonus +3.0) -> Raw GPA 5.50 capped to 5.00 A+. | `[ Inspect Trace ]` |
| **`EDGE-07`** | **Absent in Compulsory Subject** | S015 Tanvir Begum: Absent (`AB`) in BAN -> GP 0.00 F, Final GPA 0.00 F. Appears on Absent list. | `[ Inspect Trace ]` |
| **`EDGE-08`** | **Absent in Optional 4th Subject** | S018 Mehedi Hasan: Absent (`AB`) in HMT -> Bonus 0.00, passes overall on 6 compulsory subjects. | `[ Inspect Trace ]` |

---

### Page 7: Academic Transcripts & Printable Report Cards (`/dashboard/reports`)

#### Purpose:
Generates print-optimized (A4 portrait) and PDF-exportable student report cards and class-wide gazette sheets.

#### Transcript Document Layout:
- **Header**: Official School Examination Header, Student Name, Roll Number, Class, Academic Year 2026.
- **Grades Table**: 7 rows (6 compulsory + 1 optional) listing Theory Mark, Practical Mark, Total Mark, Grade Point, and Subject Letter Grade.
- **Summary Section**:
  - Total Compulsory Points: `25.00 / 30.00`
  - Optional Subject 4th Bonus: `+3.00` (from HMT GP 5.00)
  - Calculated Raw GPA: `4.67`
  - **Final GPA**: `5.00` (or `0.00 F` with explanatory footnote if compulsory fail occurred)
  - **Final Letter Grade**: `A+` / `A` / `A-` / `B` / `C` / `D` / `F`
- **Signatures**: Class Teacher Signature, Examination Controller Signature, Headmaster Seal.

---

## 4. Accessibility & Interaction Design Guidelines

1. **Keyboard Accessibility**: Full `Tab` / `Shift+Tab` focus order across all data tables, filter dropdowns, and audit drawers.
2. **Screen Reader Optimization**: ARIA attributes on all grade badges (`aria-label="Grade A Plus, Grade Point 5.0"`), and live regions for calculation state updates.
3. **Contrast Compliance**: All text and badge combinations maintain at least $4.5:1$ contrast ratio against light backgrounds (WCAG 2.1 AA).
4. **Motion Safety**: Respects `prefers-reduced-motion` media queries; drawer animations gracefully degrade to instant opacity fades.
