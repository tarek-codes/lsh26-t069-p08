# Technology Stack & Environment Specification (`TECHSTACK.md`)

## 1. Core Technology Choices

| Layer / Concern | Technology Selection | Version / Standard | Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | **`16.3.3`** | Fullstack framework with React 19, App Router, Server Actions, and native Route Handlers for high performance and clean architecture. |
| **Frontend UI** | **React** | **`19.x`** | Component-driven declarative UI with React Server Components (RSC) and fast client interactions. |
| **Database** | **PostgreSQL** | **`18` (via Supabase)** | Enterprise-grade relational database providing ACID compliance, check constraints, foreign keys, and sub-millisecond query performance. |
| **Database Client** | **Supabase JS / `@supabase/ssr`** | **`2.x`** | Type-safe database queries, real-time subscriptions, and connection pooling. |
| **Language** | **TypeScript** | **`5.x`** | End-to-end type safety, strict null checking, and zero-runtime-overhead interfaces for the core GPA Engine. |
| **Styling & Design System** | **Tailwind CSS / CSS Variables** | **`v4.x`** | Modern, responsive styling with custom CSS tokens, dark/light theme support, and zero runtime overhead. |
| **Icons** | **Lucide React** | **`0.4x`** | Clean, accessible vector icons for admin metrics, checking list badges, and status indicators. |
| **Schema Validation** | **Zod** | **`3.x`** | Runtime data validation on mark entries, API payloads, and query parameters. |
| **Calculation Engine** | **Pure TypeScript + Decimal.js** | **`10.x`** | High-precision arithmetic preventing IEEE-754 floating point drift during GPA division and rounding. |
| **Unit & Integration Testing** | **Vitest** | **`2.x`** | Blazing-fast test runner for 100% unit test coverage of all grading rules (`R-10`, `R-11`, `R-12`, `R-13`, `R-20`, `R-21`, `R-29`). |
| **Package Manager** | **pnpm / npm** | **Node.js `20+ LTS`** | Fast, deterministic dependency management. |

---

## 2. Directory Layout & Module Structure

```
tarek-mvp/
├── .agents/                          # Customization skills & agents
├── src/
│   ├── app/                          # Next.js 16.3.3 App Router
│   │   ├── layout.tsx                # Root layout with sidebar navigation
│   │   ├── page.tsx                  # Landing / Dashboard redirect
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Overview metrics & distribution charts
│   │   │   ├── results/
│   │   │   │   ├── page.tsx          # Class results matrix with filters
│   │   │   │   └── [studentId]/      # Individual student transcript view
│   │   │   ├── checking-lists/
│   │   │   │   ├── page.tsx          # Pre-publication verification dashboard
│   │   │   │   ├── optional/         # Optional <= 2.0 review tab
│   │   │   │   ├── practical/        # Practical fail < 8 review tab
│   │   │   │   ├── absent/           # Absentee review tab
│   │   │   │   └── multi-flag/       # Multi-flag review summary tab
│   │   │   ├── marks-entry/          # Mark entry and batch editor
│   │   │   ├── seed-data/            # Seed data manager & 8 edge-case suite
│   │   │   └── reports/              # Printable transcripts & export
│   │   └── api/
│   │       └── v1/                   # RESTful API route handlers
│   ├── components/                   # Reusable UI component library
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx           # Admin side navigation panel
│   │   │   ├── Header.tsx            # Context bar & class switcher
│   │   │   └── Shell.tsx             # Responsive dashboard layout container
│   │   ├── dashboard/
│   │   │   ├── MetricCards.tsx       # Key metrics summary
│   │   │   └── GradeDistribution.tsx # Visual breakdown chart
│   │   ├── results/
│   │   │   ├── ResultsTable.tsx      # Main student grade matrix
│   │   │   ├── GradeBadge.tsx        # Styled letter grade badge
│   │   │   └── TraceDrawer.tsx       # Audit trace slideover modal
│   │   ├── checking-lists/
│   │   │   ├── FlaggedTable.tsx      # Filterable checking list table
│   │   │   └── SignoffModal.tsx      # Administrative verification dialog
│   │   └── ui/                       # Low-level accessible primitives
│   ├── engine/                       # Pure Domain GPA Engine
│   │   ├── types.ts                  # Domain interfaces & rule codes
│   │   ├── rules.ts                  # Formal rule implementations (R-10 to R-29)
│   │   ├── calculator.ts             # Student & class calculation orchestrator
│   │   ├── trace.ts                  # Step-by-step narrative builder
│   │   └── __tests__/
│   │       ├── rules.test.ts         # Edge case unit tests
│   │       └── engine.test.ts        # Comprehensive test suite
│   ├── lib/
│   │   ├── db.ts                     # Supabase client initialization
│   │   ├── seed.ts                   # 60-student dataset loader with 8 hard edge cases
│   │   └── utils.ts                  # Helper utilities and formatters
│   └── data/
│       └── seed-students.json        # Static JSON dataset of 60 students
├── public/                           # Static assets, school crest, fonts
├── REQUIREMENTS.md                   # Full requirements specification
├── RULES.md                          # Authoritative business rules specification
├── DATA-MODEL.md                     # Database schema & PostgreSQL DDL
├── SYSTEM-ARCHITECTURE.md            # System design & sequence diagrams
├── API-SPECIFICATION.md              # REST & Server Action specifications
├── TECHSTACK.md                      # Technology stack & setup guide
├── package.json                      # Project dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
└── next.config.ts                    # Next.js 16.3.3 configuration
```

---

## 3. Environment Configuration (`.env.local`)

```env
# Supabase PostgreSQL Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database Direct Connection (for migrations)
DATABASE_URL=postgresql://postgres.your-project-id:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.your-project-id:password@aws-0-region.pooler.supabase.com:5432/postgres

# Application Settings
NEXT_PUBLIC_APP_NAME="School Result Processing and GPA Engine"
NEXT_PUBLIC_DEFAULT_ACADEMIC_YEAR=2026
```

---

## 4. Standard NPM Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "seed": "tsx src/lib/seed.ts"
  }
}
```
