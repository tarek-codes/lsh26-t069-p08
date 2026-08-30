import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ALL_SUBJECTS, SUBJECT_DEFINITIONS, SubjectCode } from "@/engine/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId") || "ALL";

    const classes = store.getClasses();
    let targetStudents: any[] = [];
    let className = "All Classes (Cohort)";

    if (classId === "ALL" || !classId) {
      targetStudents = store.getStudents();
    } else {
      const cls = store.getClassById(classId);
      if (cls) {
        className = cls.name;
        targetStudents = store.getStudents({ classId: cls.id });
      }
    }

    // Evaluate all student results
    const evaluatedResults = targetStudents.map((s) => {
      const res = store.getStudentResult(s.id);
      return {
        student: s,
        result: res,
      };
    });

    const totalStudents = evaluatedResults.length;
    const passedStudents = evaluatedResults.filter((r) => r.result?.isPassed).length;
    const failedStudents = totalStudents - passedStudents;
    const passRate = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 1000) / 10 : 0;

    const sumGPA = evaluatedResults.reduce((acc, r) => acc + (r.result?.finalGPA || 0), 0);
    const averageGPA = totalStudents > 0 ? Math.round((sumGPA / totalStudents) * 100) / 100 : 0;

    // Grade Distribution
    const gradeDistribution: Record<string, { count: number; percentage: number }> = {
      "A+": { count: 0, percentage: 0 },
      A: { count: 0, percentage: 0 },
      "A-": { count: 0, percentage: 0 },
      B: { count: 0, percentage: 0 },
      C: { count: 0, percentage: 0 },
      D: { count: 0, percentage: 0 },
      F: { count: 0, percentage: 0 },
    };

    evaluatedResults.forEach((r) => {
      const g = r.result?.finalLetterGrade || "F";
      if (gradeDistribution[g]) {
        gradeDistribution[g].count++;
      }
    });

    for (const key of Object.keys(gradeDistribution)) {
      gradeDistribution[key].percentage =
        totalStudents > 0
          ? Math.round((gradeDistribution[key].count / totalStudents) * 1000) / 10
          : 0;
    }

    // Subject-by-Subject Analytics
    const subjectStats: Record<
      string,
      {
        code: SubjectCode;
        name: string;
        isCompulsory: boolean;
        isPractical: boolean;
        appeared: number;
        passed: number;
        failed: number;
        failRate: number;
        passRate: number;
        theoryFails: number;
        practicalFails: number;
        absents: number;
        totalScoreSum: number;
        gpSum: number;
        averageScore: number;
        averageGP: number;
        failingStudents: { id: string; name: string; roll?: number; reason: string }[];
      }
    > = {};

    for (const code of ALL_SUBJECTS) {
      const def = SUBJECT_DEFINITIONS[code];
      subjectStats[code] = {
        code,
        name: def.name,
        isCompulsory: def.isCompulsory,
        isPractical: def.isPractical,
        appeared: 0,
        passed: 0,
        failed: 0,
        failRate: 0,
        passRate: 0,
        theoryFails: 0,
        practicalFails: 0,
        absents: 0,
        totalScoreSum: 0,
        gpSum: 0,
        averageScore: 0,
        averageGP: 0,
        failingStudents: [],
      };
    }

    evaluatedResults.forEach((r) => {
      const evals = r.result?.subjectEvaluations || [];
      evals.forEach((sub) => {
        const stat = subjectStats[sub.code];
        if (!stat) return;

        stat.appeared++;
        stat.gpSum += sub.gradePoint;

        if (typeof sub.totalMark === "number") {
          stat.totalScoreSum += sub.totalMark;
        }

        if (sub.isPassed) {
          stat.passed++;
        } else {
          stat.failed++;
          let reason = "";

          if (sub.isAbsent) {
            stat.absents++;
            reason = "Absent (AB)";
          } else if (sub.isPractical && sub.practicalMark !== undefined && sub.practicalMark < 8) {
            stat.practicalFails++;
            reason = `Practical Fail (${sub.practicalMark}/25 < 8)`;
          } else if (sub.isPractical && sub.theoryMark !== undefined && sub.theoryMark < 25) {
            stat.theoryFails++;
            reason = `Theory Fail (${sub.theoryMark}/75 < 25)`;
          } else {
            reason = `Mark below pass threshold 33 (Total: ${sub.totalMark})`;
          }

          stat.failingStudents.push({
            id: r.student.id,
            name: r.student.name,
            roll: r.student.roll,
            reason,
          });
        }
      });
    });

    // Finalize subject averages and identify worst subject
    let mostFailedSubject = subjectStats["BAN"];
    let maxFails = -1;

    for (const code of ALL_SUBJECTS) {
      const stat = subjectStats[code];
      if (stat.appeared > 0) {
        stat.failRate = Math.round((stat.failed / stat.appeared) * 1000) / 10;
        stat.passRate = Math.round((stat.passed / stat.appeared) * 1000) / 10;
        stat.averageScore = Math.round((stat.totalScoreSum / stat.appeared) * 10) / 10;
        stat.averageGP = Math.round((stat.gpSum / stat.appeared) * 100) / 100;
      }

      if (stat.failed > maxFails) {
        maxFails = stat.failed;
        mostFailedSubject = stat;
      }
    }

    // Failing Students List with summary of failing subjects
    const failingStudentsRoster = evaluatedResults
      .filter((r) => !r.result?.isPassed)
      .map((r) => ({
        id: r.student.id,
        name: r.student.name,
        roll: r.student.roll,
        class: r.student.class,
        optional: r.student.optional,
        finalGPA: r.result?.finalGPA || 0,
        finalGrade: r.result?.finalLetterGrade || "F",
        failingSubjects: (r.result?.subjectEvaluations || [])
          .filter((s) => !s.isPassed)
          .map((s) => ({
            code: s.code,
            name: s.name,
            reason: s.failureReason || s.explanation,
            isCompulsory: s.isCompulsory,
          })),
      }));

    return NextResponse.json({
      success: true,
      data: {
        className,
        classId,
        summary: {
          totalStudents,
          passedStudents,
          failedStudents,
          passRate,
          averageGPA,
        },
        mostFailedSubject: {
          code: mostFailedSubject.code,
          name: mostFailedSubject.name,
          failedCount: mostFailedSubject.failed,
          appearedCount: mostFailedSubject.appeared,
          failRate: mostFailedSubject.failRate,
          theoryFails: mostFailedSubject.theoryFails,
          practicalFails: mostFailedSubject.practicalFails,
          absents: mostFailedSubject.absents,
          isCompulsory: mostFailedSubject.isCompulsory,
          failingStudents: mostFailedSubject.failingStudents,
        },
        gradeDistribution,
        subjectMatrix: Object.values(subjectStats),
        failingStudentsRoster,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ANALYTICS_ERROR",
          message: error instanceof Error ? error.message : "Failed to calculate analytics",
        },
      },
      { status: 500 }
    );
  }
}
