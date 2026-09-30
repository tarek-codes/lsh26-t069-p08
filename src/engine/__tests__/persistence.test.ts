import { describe, it, expect, vi, beforeEach } from "vitest";

// Minimal in-memory stand-in for the Supabase client (tables keyed by primary key).
const tables: Record<string, Map<string, any>> = {};
const keyOf = (t: string, row: any) =>
  t === "marks" ? `${row.student_id}|${row.subject_code}` : row.id;

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (t: string) => {
      tables[t] ??= new Map();
      const api: any = {
        upsert: async (rows: any) => {
          for (const r of ([] as any[]).concat(rows)) tables[t].set(keyOf(t, r), { ...(tables[t].get(keyOf(t, r)) ?? {}), ...r });
          return { error: null };
        },
        select: () => ({
          order: () => ({
            range: async (from: number, to: number) => ({
              data: [...tables[t].values()].slice(from, to + 1),
              error: null,
            }),
          }),
        }),
      };
      return api;
    },
  }),
}));

describe("saving to and loading from the database", () => {
  beforeEach(() => {
    for (const k of Object.keys(tables)) delete tables[k];
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://db.test";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test";
    vi.resetModules();
  });

  it("keeps edited marks, including absences and practical marks, after a restart", async () => {
    const { store } = await import("../../lib/store");
    const { saveStudents, loadSnapshot } = await import("../../lib/persistence");

    const s = store.updateStudentMarks("S002", { BAN: 33, ENG: "AB", PHY: { theory: 40, practical: 9 } })!;
    await saveStudents([s]);

    // "Restart": a brand-new store that only knows what the database holds
    vi.resetModules();
    const fresh = (await import("../../lib/store")).store;
    const snap = (await (await import("../../lib/persistence")).loadSnapshot())!;
    fresh.hydrate(snap.students, snap.flags);

    const marks = fresh.getStudentById("S002")!.marks;
    expect(marks.BAN).toBe(33);
    expect(marks.ENG).toBe("AB");
    expect(marks.PHY).toEqual({ theory: 40, practical: 9 });
    expect(fresh.getStudents().length).toBe(1);
    void loadSnapshot;
  });
});
