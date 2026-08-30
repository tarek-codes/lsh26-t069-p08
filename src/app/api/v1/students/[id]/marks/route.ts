import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { SUBJECT_DEFINITIONS, SubjectCode } from "@/engine/types";

const MarkSchema = z.union([
  z.number().min(0).max(100),
  z.literal("AB"),
  z.object({
    theory: z.number().min(0).max(75),
    practical: z.number().min(0).max(25),
  }),
]);

const UpdateMarksBodySchema = z.object({
  marks: z.record(z.string(), MarkSchema),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parseResult = UpdateMarksBodySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid marks payload. Practical subjects require theory 0..75 and practical 0..25. Non-practical subjects require 0..100. Absent requires 'AB'.",
            details: parseResult.error.errors,
          },
        },
        { status: 400 }
      );
    }

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

    // Validate subject codes
    for (const subCode of Object.keys(parseResult.data.marks)) {
      if (!SUBJECT_DEFINITIONS[subCode as SubjectCode]) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_SUBJECT_CODE",
              message: `Unknown subject code: ${subCode}`,
            },
          },
          { status: 400 }
        );
      }
    }

    const updatedStudent = store.updateStudentMarks(id, parseResult.data.marks);
    const updatedResult = store.getStudentResult(id);

    return NextResponse.json({
      success: true,
      data: {
        student: updatedStudent,
        result: updatedResult,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update marks",
        },
      },
      { status: 500 }
    );
  }
}
