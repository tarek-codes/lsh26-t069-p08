# Technology Stack & Setup Guide (`TECHSTACK.md`)

## 1. What Technologies We Use & Why

Here is the simple breakdown of all the tools and technologies used in this project:

| Technology | What it does | Why we chose it (Simple Reason) |
| :--- | :--- | :--- |
| **Next.js 16** (App Router) | Web framework | Fast, modern framework that handles both page rendering and backend API routes in one place. |
| **React 19** | User interface | Builds clean, interactive components for the dashboard, tables, and modal dialogs. |
| **TypeScript 5** | Programming language | Catches errors before running the code and guarantees that student marks and data types are always correct. |
| **Tailwind CSS v4** | Styling | Makes it easy to build a clean, responsive, dark/light themed interface with simple utility classes. |
| **Decimal.js** | Math precision | Computer numbers can have rounding glitches (like `0.1 + 0.2 = 0.30000000000000004`). Decimal.js prevents this so every GPA is 100% exact. |
| **Recharts** | Charts & graphs | Renders easy-to-read bar and pie charts for class grade distributions on the dashboard. |
| **Lucide React** | Icons | Provides clean, modern icons for navigation, warnings, and status badges. |
| **Zod** | Data validation | Checks uploaded student mark files (CSV or JSON) to ensure no invalid marks are accepted. |
| **Vitest** | Automated testing | Automatically tests all grading rules and edge cases in milliseconds to ensure zero bugs. |
| **In-Memory Store + Supabase** | Data storage | Runs instantly in-memory with preloaded seed data, and has Supabase PostgreSQL scripts ready when cloud database storage is needed. |

---

## 2. Project Folder Structure

A simple guide to where files are located:

```
lsh26-t069-p08/
├── src/
│   ├── app/                          # Next.js App Router pages and APIs
│   │   ├── layout.tsx                # App layout (sidebar and header container)
│   │   ├── page.tsx                  # Landing page introducing the app
│   │   ├── globals.css               # Global styles, color tokens, and theme settings
│   │   ├── dashboard/                # Main dashboard pages
│   │   │   ├── page.tsx              # Dashboard home (calls DashboardClient)
│   │   │   ├── DashboardClient.tsx   # Dashboard charts, metrics cards, and filters
│   │   │   ├── results/              # All student results matrix and search
│   │   │   ├── checking-lists/       # Pre-publication verification lists (Review queues)
│   │   │   ├── marks-entry/          # Live spreadsheet-style mark editor
│   │   │   ├── import/               # Bulk CSV/JSON marks file uploader
│   │   │   ├── analytics/            # Class subject failure and performance analytics
│   │   │   ├── reports/              # Printable academic transcripts
│   │   │   └── seed-data/            # Reset and view the 60 seed students
│   │   └── api/v1/                   # REST API endpoints for results, classes, and flags
│   ├── components/                   # Reusable UI components
│   │   ├── checking-lists/           # Modals and sign-off dialogs for review lists
│   │   ├── common/                   # Reusable badges, buttons, and theme toggle
│   │   ├── layout/                   # Sidebar, Header, and Shell containers
│   │   └── results/                  # Calculation audit trace drawer
│   ├── engine/                       # Pure grading & calculation logic
│   │   ├── calculator.ts             # Orchestrates GPA calculation for students and classes
│   │   ├── rules.ts                  # Implementation of all grading rules (R-10 to R-29)
│   │   ├── trace.ts                  # Generates step-by-step human explanations of calculations
│   │   ├── types.ts                  # Data types and rule code constants
│   │   └── marks-importer.ts         # Parsers for CSV/JSON files
│   ├── lib/
│   │   └── store.ts                  # Reactive data store with 60 preloaded seed students
│   └── data/
│       └── seed-students.json        # 60 sample students across Class 9 and Class 10
├── scripts/
│   └── migrate-supabase.ts           # Migration script for Supabase PostgreSQL
├── REQUIREMENTS.md                   # Plain-language requirements and edge case guide
├── RULES.md                          # Plain-language grading rules reference
├── TECHSTACK.md                      # This document (tech stack & setup)
└── package.json                      # Project dependencies and run commands
```

---

## 3. How to Run the Project

### Prerequisites
* **Node.js** version 20 or higher.
* **npm** (comes with Node.js).

### Available Commands

Open your terminal in the project folder and run:

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:3000` |
| `npm run build` | Builds an optimized production version of the application |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Checks code formatting and catches TypeScript errors |
| `npm run test` | Runs all Vitest unit tests to verify grading rule accuracy |
| `npm run test:watch` | Runs unit tests continuously as you edit code |
| `npm run migrate:supabase` | Sets up the database tables in Supabase if using cloud storage |

---

## 4. Environment Variables (`.env.local`)

For standard development, the app works right out of the box with the preloaded in-memory store. 

If you want to connect to a cloud Supabase database, create a `.env.local` file with:

```env
# Optional Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@your-db.supabase.co:5432/postgres

# App Info
NEXT_PUBLIC_APP_NAME="School Result Processing & GPA Engine"
NEXT_PUBLIC_DEFAULT_ACADEMIC_YEAR=2026
```
