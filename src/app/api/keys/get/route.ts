import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const cookies = request.cookies
    return NextResponse.json({
        openai: cookies.get('secure_openai_key')?.value || '',
        hf: cookies.get('secure_hf_key')?.value || ''
    })
}