import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST() {
  try {
    store.init(true); // Force reset to seed state

    const classes = store.getClasses();
    const students = store.getStudents();

    return NextResponse.json({
      success: true,
      data: {
        message: "Database re-seeded successfully",
        seededClasses: classes.map((c) => c.name),
        totalStudentsSeeded: students.length,
        hardEdgeCasesSeeded: 8,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to seed data",
        },
      },
      { status: 500 }
    );
  }
}
