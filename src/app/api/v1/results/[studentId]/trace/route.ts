import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await context.params;
    const student = store.getStudentById(studentId);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "STUDENT_NOT_FOUND",
            message: `Student with ID ${studentId} was not found`,
          },
        },
        { status: 404 }
      );
    }

    const result = store.getStudentResult(studentId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESULT_NOT_FOUND",
            message: `No calculation result available for student ${studentId}`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.name,
          class: student.class,
          roll: student.roll,
          optional: student.optional,
        },
        evaluation: {
          compulsoryGPsSum: result.compulsoryGPsSum,
          optionalGP: result.optionalGP,
          optionalBonusGP: result.optionalBonusGP,
          rawGPA: result.rawGPA,
          cappedGPA: result.cappedGPA,
          hasCompulsoryFail: result.hasCompulsoryFail,
          failingCompulsorySubjects: result.failingCompulsorySubjects,
          finalGPA: result.finalGPA,
          finalLetterGrade: result.finalLetterGrade,
          isPassed: result.isPassed,
          checkingFlags: result.checkingFlags,
          traceNarrative: result.traceNarrative,
          traceSteps: result.traceSteps,
          subjects: result.subjectEvaluations,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch student trace",
        },
      },
      { status: 500 }
    );
  }
}
