import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");

    const classes = store.getClasses();
    const targetClass = classId ? store.getClassById(classId) : classes[0];

    if (!targetClass) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CLASS_NOT_FOUND",
            message: "Class was not found",
          },
        },
        { status: 404 }
      );
    }

    const students = store.getStudents({ classId: targetClass.id });
    const transcripts = students.map((s) => {
      const result = store.getStudentResult(s.id);
      return {
        student: {
          id: s.id,
          name: s.name,
          class: s.class,
          roll: s.roll,
          optionalSubject: s.optional,
        },
        result,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        school: "School Result Processing and GPA Engine",
        academicYear: "2026",
        class: targetClass.name,
        exportedAt: new Date().toISOString(),
        totalStudents: transcripts.length,
        transcripts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to export report cards",
        },
      },
      { status: 500 }
    );
  }
}
