<div align="center">

# School Result Processing & GPA Engine

**Turn a class's raw marks into trustworthy results: grades, GPAs, review lists and printable transcripts, with every calculation explained step by step.**

[![Tests](https://img.shields.io/badge/tests-26%20passing-10b981?style=for-the-badge&logo=vitest&logoColor=white)](#run-the-tests)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSES.md)

<p align="center">
  <a href="#what-it-does">What it does</a> •
  <a href="#a-tour-of-the-app">Tour</a> •
  <a href="#how-grades-are-calculated">Grading</a> •
  <a href="#get-started">Get started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#roadmap">Roadmap</a>
</p>

</div>

---

## What it does

Schools often work out results by hand in spreadsheets, and small slips add up: a student who passed the combined total but failed the practical exam, an absence treated as a zero, a bonus subject counted the wrong way. This project replaces that with one place where teachers and exam controllers can:

- **Enter or import marks** and see grades and GPAs update instantly.
- **See exactly how every GPA was worked out**, step by step, for any student.
- **Catch problem cases before publishing** (low optional-subject scores, practical fails, absences) and sign them off.
- **Print official transcripts** for one student or the whole class.
- **Spot patterns** such as the hardest subject or how the grades spread across a class.

It comes loaded with a 60-student sample school (Class 9 and Class 10), so everything can be tried straight away.

---

## A tour of the app

### Dashboard
A live overview of the school: total students, pass rate, average GPA, compulsory fails and cases needing review, all in colour-coded cards. Below them sit a **Grade Distribution** chart, a **Result Status** breakdown with a pass-rate donut, and the **Grading Scale** at a glance. A live clock and an **All classes / Class 9 / Class 10** switch sit at the top.

### Class Results
A full results table for a class with every subject's marks, total, grade point and final grade. Filter by grade, search by name, ID or roll, and page through the list. Open any student's **Calculation Breakdown** to read a plain-language summary and the full step-by-step working, and print it.

### Checking List
Students who need a second look before results go out, grouped into three lists:

| List | Who is on it |
|:---|:---|
| **Optional subject** | Optional (4th) subject grade point is 2.00 or lower, or the student was absent |
| **Practical fail** | Practical mark below 8 out of 25 in any subject |
| **Absent** | Marked absent in any subject |

Each case can be signed off as verified, or marked as needing a correction, with notes and a timestamp. Counts are by student, so the numbers on the dashboard, the sidebar badge and this page always agree.

### Assign Marks
A fast score editor, built to fit on one screen. Subjects sit two per row, and the final result updates on every keystroke. Practical subjects take theory and practical marks separately, any subject can be marked absent, and changes save automatically in the background. Previous and Next buttons move between students.

### Import Marks
Upload or paste a marks sheet in **CSV** or **JSON** format.

- **Example files to download**: a fully valid sheet and a mixed sheet (valid and invalid rows) in both formats, so the expected layout is clear.
- **Row-by-row checking**: every rejected row shows the row number, the student, the field, the value and how to fix it.
- **Existing students are protected**: for a student who is already in the system only marks can change. If a file changes a name, roll, class, ID or optional subject, those rows are rejected and listed.
- **New students**: need a new ID (the letter `S` followed by at least 3 digits, like `S061`), a valid class and an unused roll number.
- **All or nothing**: a file can only be saved when every row is valid.
- **Confirmation before saving**: a pop-up lists the new students to be added and the students whose marks will be updated. Nothing is saved until you confirm, and results, checking lists and transcripts update straight away.

### Class Summary
Class-level analytics: pass rate, average GPA, grade distribution, the hardest subject with a breakdown of theory fails, practical fails and absences, a subject-by-subject performance table, and a list of students who need support.

### Transcripts
Official-style transcripts, opening on **Single Student** with a quick student picker. Print one student, or switch to **Whole Class** and print every transcript with one student per page. Printed pages are always clean black-on-white, even if you use dark mode.

### Everything else
- **Light and dark themes**, with a toggle in the sidebar.
- **Accessible by design**: labelled inputs, keyboard-friendly controls, clear focus states and screen-reader status messages.
- **Responsive layouts** that work from laptop to tablet.

---

## How grades are calculated

### Marks to grade points

| Marks | Grade | Grade point |
|:---:|:---:|:---:|
| 80 – 100 | A+ | 5.00 |
| 70 – 79 | A | 4.00 |
| 60 – 69 | A- | 3.50 |
| 50 – 59 | B | 3.00 |
| 40 – 49 | C | 2.00 |
| 33 – 39 | D | 1.00 |
| 0 – 32 | F | 0.00 |

### The rules that matter

1. **Practical subjects have two hurdles.** Physics, Chemistry, Biology, Higher Mathematics and Agriculture are marked out of 75 (theory) plus 25 (practical). A student must score at least **25 in theory and at least 8 in practical**. Passing the total alone is not enough; missing either one gives an F for that subject.
2. **General subjects** (Bangla, English, Mathematics, Religion) are out of 100, with a pass mark of 33.
3. **Absent is not zero.** An absence (`AB`) stays visible as `AB` everywhere. It gives 0.00 for the subject and puts the student on the checking list.
4. **Six compulsory subjects** (Bangla, English, Mathematics, Religion, Physics, Chemistry) are added up and divided by 6.
5. **The optional 4th subject is a bonus.** Each student picks Biology, Higher Mathematics or Agriculture. Only points **above 2.00** count as bonus, and the divisor stays at 6:
   `bonus = max(0, optional grade point − 2.00)`
6. **One compulsory fail fails the result.** If any compulsory subject is failed, the final GPA becomes 0.00 (F). The two electives a student did not choose are also checked for failure, but their points are not added to the GPA. The raw GPA is still shown so teachers can see what it would have been.
7. **GPA is capped at 5.00.** A raw GPA above 5.00 is shown as 5.00 (A+).

### Final GPA to letter grade

| Final GPA | Grade |
|:---:|:---:|
| 5.00 | A+ |
| 4.00 – 4.99 | A |
| 3.50 – 3.99 | A- |
| 3.00 – 3.49 | B |
| 2.00 – 2.99 | C |
| 1.00 – 1.99 | D |
| below 1.00 | F |

All arithmetic uses `Decimal.js`, so a GPA never drifts because of the small rounding errors ordinary computer maths can produce.

---

## Get started

**You need:** Node.js 18.18 or newer (20+ recommended) and npm.

```bash
# 1. Install
npm install

# 2. Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The sample school data is loaded automatically, so there is nothing to set up.

```bash
# Production build
npm run build
npm run start
```

### Run the tests

```bash
npm test
```

26 tests cover the grading rules, the two-part practical pass, absences, the optional-subject bonus and eight benchmark student cases.

### Optional: cloud database

Data is kept in memory and resets when the server restarts, which is ideal for trying things out. A ready-made Supabase (PostgreSQL) schema and migration script are included if you want to store results in the cloud:

```bash
npm run migrate:supabase
```

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              Landing page
│   ├── login/                Sign-in page
│   ├── dashboard/
│   │   ├── DashboardClient   Overview cards and charts
│   │   ├── results/          Class results table and calculation breakdown
│   │   ├── checking-lists/   Review lists and sign-off
│   │   ├── marks-entry/      Live score editor
│   │   ├── import/           CSV / JSON import with checks and examples
│   │   ├── analytics/        Class summary
│   │   ├── reports/          Printable transcripts
│   │   └── seed-data/        Sample student explorer
│   └── api/v1/               REST endpoints
├── components/               Sidebar, header, grade badges, modals
├── engine/                   The grading engine (no UI code)
│   ├── rules.ts              Grade, bonus and pass rules
│   ├── calculator.ts         Student and class calculations
│   ├── trace.ts              Step-by-step explanations
│   ├── marks-importer.ts     Marks sheet parsing and checks
│   └── __tests__/            Test suite
├── lib/                      Data store, import rules, theme
└── data/                     60-student sample dataset
```

The grading engine is kept separate from the screens, so the same rules drive the dashboard, the editor, imports and transcripts.

More detail lives in [REQUIREMENTS.md](./REQUIREMENTS.md), [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md), [API-SPECIFICATION.md](./API-SPECIFICATION.md) and [UI-PAGES.md](./UI-PAGES.md).

---

## Built with

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Recharts · Decimal.js · Zod · Vitest · Supabase (optional)

---

## Roadmap

1. **Multi-term results**: combine first term, mid-term and annual exams with weighting, and calculate promotion.
2. **Parent messaging**: send transcripts by SMS or WhatsApp with one click.
3. **Mark sheet scanning**: photograph a paper mark sheet and enter the marks automatically.
4. **Roles and permissions**: separate access for exam controllers, subject teachers, and students or parents.

---

## License

Built for the **LSH26 Hackathon (Problem P08)** by **Team LSH26-T069**.
Released under the [MIT License](./LICENSES.md).
