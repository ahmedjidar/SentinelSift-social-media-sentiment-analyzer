import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('secure_openai_key')
    response.cookies.delete('secure_hf_key')
    return response
  }