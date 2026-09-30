import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { processMarksSheet } from "@/engine/marks-importer";
import { applyExistingRecordRules } from "@/lib/import-rules";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawInput, action = "validate" } = body;

    if (!rawInput) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMPTY_PAYLOAD",
            message: "Marks sheet data (CSV or JSON) is required.",
          },
        },
        { status: 400 }
      );
    }

    const validationResult = applyExistingRecordRules(processMarksSheet(rawInput));

    // If user requested to commit/import the rows
    if (action === "commit") {
      // All-or-nothing: a file with any invalid row cannot be committed.
      if (validationResult.rejectedRows.length > 0 || validationResult.acceptedRows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_ROWS",
              message:
                "Import blocked: every row must be valid. Fix the rejected rows and validate again.",
            },
          },
          { status: 422 }
        );
      }

      // Existing students: marks only. New students: inserted into the class named in the file.
      const inserted: string[] = [];
      const updated: string[] = [];
      const newByClass = new Map<string, typeof validationResult.acceptedRows>();

      for (const row of validationResult.acceptedRows) {
        if (row.action === "UPDATE") {
          store.updateStudentMarks(row.student.id, row.student.marks);
          updated.push(row.student.id);
        } else {
          const cls = store.getClasses().find((c) => c.name === row.student.class);
          if (!cls) continue;
          const list = newByClass.get(cls.id) ?? [];
          list.push(row);
          newByClass.set(cls.id, list);
        }
      }

      for (const [targetClassId, rows] of newByClass) {
        store.bulkImportStudents(rows.map((r) => r.student), targetClassId);
        inserted.push(...rows.map((r) => r.student.id));
      }

      return NextResponse.json({
        success: true,
        data: {
          committed: true,
          insertedCount: inserted.length,
          updatedCount: updated.length,
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
