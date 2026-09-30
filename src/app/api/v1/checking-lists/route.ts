import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { syncStore } from "@/lib/store-sync";
import { CheckingFlagType } from "@/engine/types";

export async function GET(request: NextRequest) {
  try {
    await syncStore();
    const { searchParams } = new URL(request.url);
    const listType = (searchParams.get("listType") || "ALL") as
      | CheckingFlagType
      | "ALL"
      | "MULTI_FLAG";
    const classId = searchParams.get("classId") || undefined;
    const status = searchParams.get("status") as
      | "PENDING"
      | "VERIFIED"
      | "CORRECTION_REQUIRED"
      | undefined;

    let flags = store.getCheckingFlags({
      flagType: listType === "MULTI_FLAG" ? "ALL" : listType,
      classId,
      status,
    });

    if (listType === "MULTI_FLAG") {
      // Group by student and filter for students with >= 2 flags
      const studentFlagMap = new Map<string, typeof flags>();
      for (const f of flags) {
        const arr = studentFlagMap.get(f.studentId) || [];
        arr.push(f);
        studentFlagMap.set(f.studentId, arr);
      }

      const multiFlagStudentIds = new Set(
        Array.from(studentFlagMap.entries())
          .filter(([_, arr]) => arr.length >= 2)
          .map(([id, _]) => id)
      );

      flags = flags.filter((f) => multiFlagStudentIds.has(f.studentId));
    }

    // Summary counts unique students (same basis as the dashboard "Needs Review"),
    // across all lists for the selected class, regardless of the active tab or status filter.
    const allFlags = store.getCheckingFlags({ flagType: "ALL", classId });
    const uniqueStudents = (list: typeof allFlags) =>
      new Set(list.map((f) => f.studentId)).size;
    const summary = {
      totalFlagged: uniqueStudents(allFlags),
      pending: uniqueStudents(allFlags.filter((f) => f.verificationStatus === "PENDING")),
      verified: uniqueStudents(allFlags.filter((f) => f.verificationStatus === "VERIFIED")),
      correctionRequired: uniqueStudents(
        allFlags.filter((f) => f.verificationStatus === "CORRECTION_REQUIRED")
      ),
    };

    return NextResponse.json({
      success: true,
      data: flags,
      summary,
      meta: {
        total: flags.length,
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
              : "Failed to fetch checking lists",
        },
      },
      { status: 500 }
    );
  }
}
