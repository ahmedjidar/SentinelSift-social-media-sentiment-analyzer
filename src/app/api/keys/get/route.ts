import { decrypt } from "@/lib/encryption"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const decryptedValues = await Promise.all([
        request.cookies.get('secure_openai_key')?.value,
        request.cookies.get('secure_hf_key')?.value
    ].map(async (value) => {
        if (!value) return null
        try {
            const decryptedValue = await decrypt(value)
            return decryptedValue
        } catch (error) {
            console.error('Decryption error:', error)
            return null
        }
    }
    ))
    return NextResponse.json({
        openai: decryptedValues[0] || null,
        hf: decryptedValues[1] || null
    })
}