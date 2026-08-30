import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { processMarksSheet } from "@/engine/marks-importer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawInput, action = "validate", classId } = body;

    if (!rawInput) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMPTY_PAYLOAD",
            message: "Marks sheet data (CSV, TSV, or JSON) is required.",
          },
        },
        { status: 400 }
      );
    }

    const validationResult = processMarksSheet(rawInput);

    // If user requested to commit/import the valid rows
    if (action === "commit") {
      const classes = store.getClasses();
      const targetClass = classId ? store.getClassById(classId) : classes[0];

      if (!targetClass) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "CLASS_NOT_FOUND",
              message: "Target class was not found.",
            },
          },
          { status: 404 }
        );
      }

      const validStudents = validationResult.acceptedRows.map((r) => r.student);
      const { importedCount, runEntity } = store.bulkImportStudents(
        validStudents,
        targetClass.id
      );

      return NextResponse.json({
        success: true,
        data: {
          committed: true,
          importedCount,
          targetClass: {
            id: targetClass.id,
            name: targetClass.name,
          },
          runEntity,
          validation: validationResult,
        },
      });
    }

    // Default: Validate & Report Rejections
    return NextResponse.json({
      success: true,
      data: validationResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "IMPORT_ERROR",
          message: error instanceof Error ? error.message : "Failed to process marks sheet",
        },
      },
      { status: 500 }
    );
  }
}
