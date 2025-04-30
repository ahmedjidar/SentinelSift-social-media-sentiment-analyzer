import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/encryption'

export async function POST(req: Request) {
  try {
    const { keyType, value } = await req.json()
    
    const encryptedValue = await encrypt(value) 
    const cookieName = `secure_${keyType}_key`

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: cookieName,
      value: encryptedValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to store key: ${error}` },
      { status: 500 }
    )
  }
}

