import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId") || undefined;
    const className = searchParams.get("className") || undefined;
    const search = searchParams.get("search") || undefined;
    const optionalSubject = searchParams.get("optionalSubject") || undefined;

    const students = store.getStudents({
      classId,
      className,
      search,
      optionalSubject,
    });

    return NextResponse.json({
      success: true,
      data: students,
      meta: {
        total: students.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch students",
        },
      },
      { status: 500 }
    );
  }
}
