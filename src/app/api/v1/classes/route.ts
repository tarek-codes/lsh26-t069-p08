import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const classes = store.getClasses();
    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch classes",
        },
      },
      { status: 500 }
    );
  }
}
