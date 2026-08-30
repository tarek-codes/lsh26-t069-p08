import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const grade = searchParams.get("grade");
    const search = searchParams.get("search");

    const classes = store.getClasses();

    if (classId === "ALL" || !classId) {
      // Aggregate all classes
      let allResults: any[] = [];
      let totalStudents = 0;
      let passedStudents = 0;
      let failedStudents = 0;
      let sumGPA = 0;
      const gradeDist: Record<string, number> = { "A+": 0, A: 0, "A-": 0, B: 0, C: 0, D: 0, F: 0 };
      const flaggedCount = { optionalLow: 0, practicalFail: 0, absent: 0, total: 0 };

      for (const cls of classes) {
        const run = store.getLatestRun(cls.id);
        if (run) {
          allResults = allResults.concat(run.summary.results);
          totalStudents += run.summary.totalStudents;
          passedStudents += run.summary.passedStudents;
          failedStudents += run.summary.failedStudents;
          sumGPA += run.summary.averageGPA * run.summary.totalStudents;

          for (const [g, count] of Object.entries(run.summary.gradeDistribution)) {
            gradeDist[g] = (gradeDist[g] || 0) + (count as number);
          }

          flaggedCount.optionalLow += run.summary.flaggedCount.optionalLow || 0;
          flaggedCount.practicalFail += run.summary.flaggedCount.practicalFail || 0;
          flaggedCount.absent += run.summary.flaggedCount.absent || 0;
          flaggedCount.total += run.summary.flaggedCount.total || 0;
        }
      }

      let results = allResults;
      if (grade && grade !== "ALL") {
        results = results.filter((r) => r.finalLetterGrade === grade);
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(
          (r) =>
            r.studentName.toLowerCase().includes(q) ||
            r.studentId.toLowerCase().includes(q) ||
            (r.roll && r.roll.toString().includes(q))
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          class: { id: "ALL", name: "All Classes (60 Students)", code: "ALL" },
          runInfo: { status: "PUBLISHED", calculatedAt: new Date().toISOString() },
          summary: {
            totalStudents,
            passedStudents,
            failedStudents,
            passRate: totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 1000) / 10 : 0,
            averageGPA: totalStudents > 0 ? Math.round((sumGPA / totalStudents) * 100) / 100 : 0,
            gradeDistribution: gradeDist,
            flaggedCount,
          },
          results,
        },
        meta: {
          total: results.length,
        },
      });
    }

    const targetClass = store.getClassById(classId);

    if (!targetClass) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CLASS_NOT_FOUND",
            message: "No classes available",
          },
        },
        { status: 404 }
      );
    }

    const latestRun = store.getLatestRun(targetClass.id);
    let results = latestRun ? latestRun.summary.results : [];

    if (grade && grade !== "ALL") {
      results = results.filter((r) => r.finalLetterGrade === grade);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.studentId.toLowerCase().includes(q) ||
          (r.roll && r.roll.toString().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        class: targetClass,
        runInfo: latestRun
          ? {
              runId: latestRun.id,
              runCode: latestRun.runCode,
              calculatedAt: latestRun.calculatedAt,
              status: latestRun.status,
            }
          : null,
        summary: latestRun
          ? {
              totalStudents: latestRun.summary.totalStudents,
              passedStudents: latestRun.summary.passedStudents,
              failedStudents: latestRun.summary.failedStudents,
              passRate: latestRun.summary.passRate,
              averageGPA: latestRun.summary.averageGPA,
              gradeDistribution: latestRun.summary.gradeDistribution,
              flaggedCount: latestRun.summary.flaggedCount,
            }
          : null,
        results,
      },
      meta: {
        total: results.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch results",
        },
      },
      { status: 500 }
    );
  }
}
