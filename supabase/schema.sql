-- ==============================================================================
-- School Result Processing & GPA Engine - PostgreSQL Supabase Schema
-- ==============================================================================

-- 1. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    academic_year TEXT NOT NULL DEFAULT '2026',
    last_calculated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    roll INTEGER,
    optional_subject TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Marks Table
CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    theory_mark NUMERIC(5,2),
    practical_mark NUMERIC(5,2),
    is_absent BOOLEAN NOT NULL DEFAULT FALSE,
    total_mark NUMERIC(5,2),
    grade_point NUMERIC(3,2) NOT NULL DEFAULT 0.00,
    letter_grade TEXT NOT NULL DEFAULT 'F',
    is_passed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, subject_code)
);

-- 4. Calculation Runs Table
CREATE TABLE IF NOT EXISTS public.calculation_runs (
    id TEXT PRIMARY KEY,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    run_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    summary_data JSONB NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Checking Flags Table
CREATE TABLE IF NOT EXISTS public.checking_flags (
    id TEXT PRIMARY KEY,
    calculation_run_id TEXT,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_code TEXT NOT NULL,
    student_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    flag_type TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    trigger_reason TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM',
    verification_status TEXT NOT NULL DEFAULT 'PENDING',
    verified_by TEXT,
    notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checking_flags ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read access (or authenticated)
CREATE POLICY "Public Read Classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Read Marks" ON public.marks FOR SELECT USING (true);
CREATE POLICY "Public Read Runs" ON public.calculation_runs FOR SELECT USING (true);
CREATE POLICY "Public Read Flags" ON public.checking_flags FOR SELECT USING (true);

-- Allow full access for service role and mutations
CREATE POLICY "Full Access Classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Full Access Students" ON public.students FOR ALL USING (true);
CREATE POLICY "Full Access Marks" ON public.marks FOR ALL USING (true);
CREATE POLICY "Full Access Runs" ON public.calculation_runs FOR ALL USING (true);
CREATE POLICY "Full Access Flags" ON public.checking_flags FOR ALL USING (true);
