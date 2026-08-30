import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";

const CalculateRequestSchema = z.object({
  classId: z.string().optional(),
  runCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // Empty body allowed to trigger default calculation
    }

    const parseResult = CalculateRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid calculation request payload",
            details: parseResult.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { classId, runCode } = parseResult.data;

    if (classId) {
      const run = store.runCalculation(classId, runCode);
      if (!run) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "CLASS_NOT_FOUND",
              message: `Class with ID ${classId} was not found`,
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: run,
      });
    }

    // Run for all classes
    const classes = store.getClasses();
    const runs = classes.map((c) => store.runCalculation(c.id));

    return NextResponse.json({
      success: true,
      data: runs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to execute calculation engine",
        },
      },
      { status: 500 }
    );
  }
}
