import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { syncStore } from "@/lib/store-sync";
import { replaceAllStudents } from "@/lib/persistence";

export async function POST() {
  try {
    await syncStore();
    store.init(true); // Force reset to seed state

    await replaceAllStudents(store.getStudents());

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
