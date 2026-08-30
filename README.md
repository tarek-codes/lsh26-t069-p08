# School Result Processing & Deterministic GPA Engine (P08)

An enterprise-grade, deterministic school examination result processing system, grading engine, and audit verification platform built for secondary schools. Designed to completely eliminate manual spreadsheet calculation errors and ensure 100% compliance with national secondary education grading policies (`R-10`, `R-11`, `R-12`, `R-13`, `R-20`, `R-21`, `R-29`, `R-30`).

---

## 🌟 Key Capabilities & Features

### 1. **Deterministic Core Calculation Engine**
- **6 Compulsory Core Subjects**: Bangla (`BAN`), English (`ENG`), Mathematics (`MAT`), Religion (`REL`), Physics (`PHY`), and Chemistry (`CHE`) evaluated over a strict **`6.0` GPA divisor**.
- **3 Optional Elective Choices**: Biology (`BIO`), Higher Mathematics (`HMT`), or Agriculture (`AGR`).
- **Rule R-20 (Optional 4th Subject Bonus)**: Contributes grade points only in excess of $2.00$ ($\text{Bonus} = \max(0, \text{GP}_{\text{optional}} - 2.0)$) without modifying the $6.0$ divisor.
- **Rule R-11 (Dual-Component Practical Pass Constraint)**: Practical subjects (`PHY`, `CHE`, `BIO`, `HMT`, `AGR`) require passing both Theory ($\ge 25/75$) and Practical ($\ge 8/25$) independently. Failing either component produces Subject GP $0.00$ (`F`), even if total score $\ge 33$.
- **Rule R-13 (Compulsory Failure Override)**: A fail in any of the 6 compulsory subjects instantly reduces the final GPA to $0.00$ (`F`), while preserving the raw uncancelled GPA in the audit trace.
- **Rule R-12 (Absence Handling)**: The `"AB"` token is preserved throughout the engine without being converted to numeric 0.
- **Rule R-13 (GPA Capping)**: Total grade points are capped at the maximum Final GPA of $5.00$ (`A+`).

### 2. **Pre-Publication Checking Lists (Rule R-29)**
Automated three-tier verification roster for administrative pre-publication review:
1. **Optional List (`OPTIONAL_LOW`)**: Students whose optional subject GP is $\le 2.00$ or marked `"AB"`.
2. **Practical Fail List (`PRACTICAL_FAIL`)**: Students with practical mark $< 8/25$ in any subject.
3. **Absent List (`ABSENT`)**: Students with `"AB"` in any subject.
4. **Multi-List Membership & Sign-Off**: Students can appear on multiple checking lists. Includes an audit sign-off modal with teacher verification notes and timestamps.

### 3. **Marks Sheet Ingestion & Rejection Diagnostics (`/dashboard/import`)**
- Supports file upload (`.csv`, `.tsv`, `.json`, `.txt`) and direct raw data pasting.
- **Row-by-Row Rejection Diagnostics**: Reports rejected rows with row number, student ID/name, offending column, invalid value, exact rule code, and suggested fix.
- **Accepted Rows Preview**: Displays computed GPAs and letter grades before one-click committing to the database.

### 4. **Class Summary & Failure Analytics (`/dashboard/analytics`)**
- **Overall Pass Rate & Average GPA**: High-level cohort overview with visual progress bars.
- **Subject That Failed The Most Students**: High-visibility focus card identifying the #1 worst-performing subject, complete with root-cause breakdown (Theory $< 25$, Practical $< 8$, Absent).
- **Interactive Grade Distribution Chart**: Visual distribution of `A+`, `A`, `A-`, `B`, `C`, `D`, `F`.
- **Subject Performance Matrix**: 9-subject academic table showing pass/fail percentages, average scores, and average GP.
- **Academic Intervention Roster**: List of failing students with direct access to their calculation audit traces.

### 5. **Live Mark Entry (`/dashboard/marks-entry`)**
- Single full-width editor with an integrated student selector dropdown and `← Prev` / `Next →` navigation.
- Dynamic highlighting: 4th Optional subject is styled with a distinct purple gradient, glowing ring, and `★ 4th OPTIONAL` badge.
- Instant recalculation of subject GPs, component pass statuses, and final GPA.

### 6. **Student Transcripts & Print Hub (`/dashboard/reports`)**
- Printable official Academic Transcripts with complete step-by-step arithmetic traces.

---

## 🚀 How to Run the Application

### Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9+ or **pnpm** / **yarn**

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/tarek-codes/lsh26-t069-p08.git
cd lsh26-t069-p08
npm install
```

### 2. Running Locally in Development Mode
Start the Next.js development server on `http://localhost:3000`:
```bash
npm run dev
```

### 3. Running Production Build
Build and launch the optimized production server:
```bash
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Automated Unit Tests
Run the comprehensive test suite verifying all 26 engine rules and edge cases:
```bash
npm test
```

### 5. Migrating / Syncing Data to Supabase
To synchronize all classes, students, 540 subject marks, and checking list flags to Supabase:
```bash
npm run migrate:supabase
```

---

## 🛠️ What is Mocked vs. Live

| Layer / Feature | Live Implementation | Mocked / Simulated |
| :--- | :--- | :--- |
| **GPA Engine & Rules** | **100% Live & Pure**: Real-time evaluation using `decimal.js` with zero floating point drift. | None. |
| **Cohort & Student Store** | **Live Singleton Store & Supabase Sync**: In-memory store cached across requests, backed by Supabase PostgreSQL tables. | None. |
| **Marks Sheet Parser** | **Live Ingestion**: Real-time CSV/TSV/JSON parser with field-level rule validation. | None. |
| **Print Hub & Transcripts** | **Live HTML5 Print Engine**: Generates print-ready vector transcripts. | None. |
| **Student Photos** | Avatar initials generated dynamically via CSS/SVG. | Physical photo CDN integration. |
| **Teacher Sign-off** | **Live State Mutation**: Records auditor name, sign-off status, and notes. | Hardware biometrics / digital PKI signature card. |

---

## 🔮 What We Would Build Next (Roadmap)

1. **Multi-Term Cumulative Aggregation**:
   - Composite weighting of 1st Term (30%), Mid-Term (30%), and Annual Exam (40%) with automatic promotion rosters.
2. **Automated Parent Communication Hub**:
   - Integration with SMS gateways (e.g., Twilio / local SMS) and WhatsApp Business API to dispatch student result cards with one click.
3. **Mobile Camera OCR Mark Sheet Scanner**:
   - Optical Mark Recognition (OMR) scanner allowing teachers to take a photo of physical tabulation sheets and automatically populate the `/dashboard/import` interface.
4. **Role-Based Access Control (RBAC)**:
   - Dedicated authentication portals for **Exam Controllers** (Full publish/edit rights), **Subject Teachers** (Assigned subject marks entry only), and **Students/Parents** (Read-only transcript view via Roll/Registration verification).
5. **Historical Trend Analytics**:
   - Year-over-year subject performance tracking to evaluate teacher efficacy and institutional subject passing trends across multiple academic years.
