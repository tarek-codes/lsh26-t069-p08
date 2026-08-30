import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const student = store.getStudentById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "STUDENT_NOT_FOUND",
            message: `Student with ID ${id} was not found`,
          },
        },
        { status: 404 }
      );
    }

    const result = store.getStudentResult(id);

    return NextResponse.json({
      success: true,
      data: {
        student,
        result,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch student",
        },
      },
      { status: 500 }
    );
  }
}
