<div align="center">

# School Result Processing and GPA Engine

**Enterprise-grade, deterministic school examination result processing system, grading engine, and audit verification platform.**

[![Tests](https://img.shields.io/badge/tests-26%2F26%20passing-10b981?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/tarek-codes/lsh26-t069-p08)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Decimal.js](https://img.shields.io/badge/Precision-Decimal.js-blue?style=for-the-badge)](https://github.com/MikeMcl/decimal.js)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSES.md)

<p align="center">
  <a href="#-key-capabilities">Key Capabilities</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-grading-rules-specification">Grading Rules</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-live-vs-mocked">Live vs Mocked</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

</div>

---

## 🌟 Key Capabilities

### 1. ⚙️ Deterministic Core Calculation Engine
* **6 Compulsory Core Subjects**: Bangla (`BAN`), English (`ENG`), Mathematics (`MAT`), Religion (`REL`), Physics (`PHY`), and Chemistry (`CHE`) evaluated over a strict **`6.0` GPA divisor**.
* **Elective Options**: Student choice of Biology (`BIO`), Higher Mathematics (`HMT`), or Agriculture (`AGR`). Non-chosen electives automatically enforce standard pass constraints.
* **Arbitrary-Precision Arithmetic**: Built with `Decimal.js` to guarantee **0 floating-point rounding errors** across all summations, bonus calculations, and GPA divisions.
* **Rule R-20 (Optional 4th Subject Bonus)**: Contributes points only in excess of 2.00 ($\text{Bonus} = \max(0, \text{GP}_{\text{optional}} - 2.0)$) without altering the $6.0$ divisor.
* **Rule R-11 (Dual-Component Practical Pass Constraint)**: Practical subjects (`PHY`, `CHE`, `BIO`, `HMT`, `AGR`) require passing both Theory ($\ge 25/75$) and Practical ($\ge 8/25$) independently. Failing either component produces Subject GP $0.00$ (`F`).
* **Rule R-13 (Compulsory Failure Override)**: Any compulsory fail overrides the student's Final GPA to $0.00$ (`F`), while preserving the raw uncancelled GPA in the audit trace.
* **Rule R-12 (Absence Handling)**: The `"AB"` token is preserved throughout the engine without being converted to numeric 0.
* **Rule R-13 (GPA Capping)**: Total grade points are capped at the maximum Final GPA of $5.00$ (`A+`).

---

### 2. 📋 Pre-Publication Checking Lists (Rule R-29)
Automated verification rosters for administrative pre-publication review:
* **Optional List (`OPTIONAL_LOW`)**: Students whose optional subject GP is $\le 2.00$ or marked `"AB"`.
* **Practical Fail List (`PRACTICAL_FAIL`)**: Students with practical mark $< 8/25$ in any subject.
* **Absent List (`ABSENT`)**: Students with `"AB"` in any subject.
* **Multi-List Membership & Sign-Off**: Consolidated multi-flag roster with an administrative sign-off workflow recording teacher verification notes and timestamps.

---

### 3. 📥 Marks Sheet Ingestion & Rejection Diagnostics (`/dashboard/import`)
* **Flexible Ingestion**: Upload `.csv`, `.tsv`, `.json`, `.txt` or paste raw tab-separated/comma-separated records.
* **Row-by-Row Rejection Diagnostics**: Flags rejected rows with row number, student identifier, offending column, invalid value, exact rule violation code, and actionable suggested fixes.
* **Accepted Rows Preview**: Computes real-time GPAs and letter grades prior to committing to the database.

---

### 4. 📊 Class Summary & Failure Analytics (`/dashboard/analytics`)
* **Cohort Overview**: Pass rate, average GPA, and interactive grade distribution (`A+` to `F`).
* **Root-Cause Focus Card**: Highlights the #1 worst-performing subject with an immediate breakdown of Theory failures ($< 25$), Practical failures ($< 8$), and Absences.
* **Subject Performance Matrix**: 9-subject academic table showing pass/fail percentages, average scores, and average GP.
* **Academic Intervention Roster**: List of failing students with direct access to step-by-step calculation audit traces.

---

### 5. ✏️ Live Score Editor (`/dashboard/marks-entry`)
* **Instant Recalculation**: Live re-computation of subject grade points, dual-component thresholds, elective bonus, and deterministic final verdict on every keystroke.
* **Smooth UX**: Debounced background persistence, fast student switcher (`← Prev` / `Next →`), and theme-neutral indicators.

---

### 6. 🖨️ Printable Transcripts & Report Hub (`/dashboard/reports`)
* Print-ready vector academic transcripts complete with full step-by-step arithmetic traces.

---

## 📐 Grading Rules Specification

| Rule Code | Description | Standard Formula / Constraint |
|:---|:---|:---|
| **R-10** | Final GPA to Grade Mapping | $5.00 \implies \text{A+}$, $4.00\text{--}4.99 \implies \text{A}$, $3.50\text{--}3.99 \implies \text{A-}$, $3.00\text{--}3.49 \implies \text{B}$, $2.00\text{--}2.99 \implies \text{C}$, $1.00\text{--}1.99 \implies \text{D}$, $<1.00 \implies \text{F}$ |
| **R-11** | Dual Component Pass | Theory $\ge 25/75$ **AND** Practical $\ge 8/25$. Failing either $\implies \text{GP } 0.00 \text{ (F)}$ |
| **R-12** | Absence Handling | Mark = `"AB"` $\implies \text{GP } 0.00 \text{ (F)}$, flag set for audit rosters |
| **R-13** | GPA Divisor & Capping | $\text{Raw GPA} = \frac{\sum \text{Compulsory GPs} + \text{Bonus}}{6.0}$, Capped at $5.00$. Any compulsory fail $\implies \text{Final GPA } 0.00 \text{ (F)}$ |
| **R-20** | 4th Optional Bonus | $\text{Bonus} = \max(0, \text{GP}_{\text{optional}} - 2.0)$ |
| **R-21** | Subject Mark to GP | $80\text{--}100 \implies 5.0$, $70\text{--}79 \implies 4.0$, $60\text{--}69 \implies 3.5$, $50\text{--}59 \implies 3.0$, $40\text{--}49 \implies 2.0$, $33\text{--}39 \implies 1.0$, $0\text{--}32 \implies 0.0$ |
| **R-29** | Audit Checking Lists | Automatic categorization into Optional Low, Practical Fail, and Absentee lists |
| **R-30** | Explainable Trace | Human-readable audit narrative and deterministic trace steps for every candidate |

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: `v18.18.0` or higher (`v20+ LTS` recommended)
* **npm**: `v9+` (or `pnpm` / `yarn`)

### 1. Clone & Install
```bash
git clone https://github.com/tarek-codes/lsh26-t069-p08.git
cd lsh26-t069-p08
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Production Build
```bash
npm run build
npm run start
```

### 4. Run Automated Test Suite
```bash
npm test
```
> Executes all **26 unit tests** covering all rules, dual-component constraints, and the 8 mandatory benchmark edge cases.

### 5. Supabase Database Sync (Optional)
```bash
npm run migrate:supabase
```

---

## 🏛️ System Architecture

```
tarek-mvp/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── layout.tsx                # Root layout with theme provider
│   │   ├── page.tsx                  # Landing page
│   │   ├── login/page.tsx            # Portal authentication
│   │   ├── dashboard/                # Dashboard workspace
│   │   │   ├── page.tsx              # Overview metrics & distribution charts
│   │   │   ├── results/page.tsx      # Class matrix with filters & audit drawer
│   │   │   ├── checking-lists/       # R-29 pre-publication review rosters
│   │   │   ├── marks-entry/          # Real-time score editor
│   │   │   ├── analytics/            # Cohort failure analytics
│   │   │   ├── import/               # Marks ingestion with row diagnostics
│   │   │   ├── reports/              # Printable transcripts & export
│   │   │   └── seed-data/            # Seed data manager
│   │   └── api/v1/                   # REST API route handlers
│   ├── components/                   # Reusable UI component library
│   │   ├── layout/                   # Sidebar, Header, Shell
│   │   ├── common/                   # GradeBadge, StatusBadge, ThemeToggle
│   │   └── results/                  # TraceDrawer, ResultsTable
│   ├── engine/                       # Pure Domain GPA Engine (0 UI dependencies)
│   │   ├── types.ts                  # Domain models & rule codes
│   │   ├── rules.ts                  # Pure rule functions (R-10 to R-29)
│   │   ├── calculator.ts             # Student & class calculation engine
│   │   ├── trace.ts                  # Audit trace narrative builder
│   │   ├── marks-importer.ts         # Ingestion parser & validator
│   │   └── __tests__/                # Vitest test suite (26 unit tests)
│   ├── lib/                          # Database clients, store & theme context
│   └── data/                         # Static JSON dataset of 60 students
├── public/                           # Static assets
└── package.json
```

---

## 🛠️ Live vs. Mocked

| Feature / Subsystem | Implementation Status | Notes |
|:---|:---:|:---|
| **GPA Engine & Rules** | **100% Live & Pure** | Real-time calculation with `Decimal.js` — 0 floating-point drift. |
| **Data Store & Sync** | **100% Live** | In-memory singleton store synchronized with Supabase PostgreSQL. |
| **Marks Sheet Parser** | **100% Live** | CSV, TSV, and JSON parser with row-level validation diagnostics. |
| **Print Hub & Transcripts** | **100% Live** | Vector print engine generating official transcripts. |
| **Teacher Sign-off** | **100% Live** | Persists auditor name, sign-off status, and notes. |
| **Student Photos** | Dynamic CSS/SVG | Initials-based avatar generation. |

---

## 🔮 Roadmap

1. **Multi-Term Cumulative Progression**: Composite weighting (1st Term 30%, Mid-Term 30%, Annual 40%) with automatic promotion calculation.
2. **Automated Parent Communication**: One-click transcript dispatch via SMS and WhatsApp Business API.
3. **OCR Mark Sheet Scanner**: Camera-based tabulation sheet digitizer for direct marks entry.
4. **Granular RBAC**: Role separation for Exam Controllers, Subject Teachers, and Students/Parents.

---

## 📄 License & Declaration

Built for the **LSH26 Hackathon (Problem P08)** by **Team LSH26-T069**.  
Licensed under the [MIT License](./LICENSES.md).
