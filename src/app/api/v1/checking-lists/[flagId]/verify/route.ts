import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";

const VerifyBodySchema = z.object({
  verificationStatus: z.enum(["PENDING", "VERIFIED", "CORRECTION_REQUIRED"]),
  verifiedByUser: z.string().min(1),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ flagId: string }> }
) {
  try {
    const { flagId } = await context.params;
    const body = await request.json();

    const parseResult = VerifyBodySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid verification payload",
            details: parseResult.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const { verificationStatus, verifiedByUser, notes } = parseResult.data;

    const updatedFlag = store.updateFlagVerification(
      flagId,
      verificationStatus,
      verifiedByUser,
      notes
    );

    if (!updatedFlag) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FLAG_NOT_FOUND",
            message: `Checking list flag with ID ${flagId} was not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedFlag,
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
              : "Failed to update verification status",
        },
      },
      { status: 500 }
    );
  }
}
