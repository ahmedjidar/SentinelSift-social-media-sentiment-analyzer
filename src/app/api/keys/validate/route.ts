import { validateApiKey } from "@/app/_utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { service, key } = await req.json();

        if (!service || !key) {
            return NextResponse.json(
                { error: "Missing service or key" },
                { status: 400 }
            );
        }

        const isValid = await validateApiKey(service, key);

        return NextResponse.json({
            success: true,
            valid: isValid,
            service
        });

    } catch (error) {
        console.error("Validation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}