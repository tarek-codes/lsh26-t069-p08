import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { syncStore } from "@/lib/store-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await syncStore();
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
