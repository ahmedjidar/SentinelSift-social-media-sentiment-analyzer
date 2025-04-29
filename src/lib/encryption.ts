// lib/encryption.ts
import { webcrypto } from 'crypto'

export interface EncryptedData {
  iv: string
  ciphertext: string
  tag: string
}

export async function encrypt(text: string): Promise<string> {
  const iv = webcrypto.getRandomValues(new Uint8Array(12))
  const key = await getCryptoKey()
  
  const encrypted = await webcrypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128
    },
    key,
    new TextEncoder().encode(text)
  )

  const ciphertext = new Uint8Array(encrypted)
  const tag = ciphertext.slice(-16)
  const data = ciphertext.slice(0, -16)

  return JSON.stringify({
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(data),
    tag: bufferToBase64(tag)
  })
}

export async function decrypt(encrypted: string): Promise<string> {
  const { iv, ciphertext, tag } = JSON.parse(encrypted)
  const key = await getCryptoKey()
  
  const data = new Uint8Array([
    ...base64ToBuffer(ciphertext),
    ...base64ToBuffer(tag)
  ])

  const decrypted = await webcrypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToBuffer(iv)
    },
    key,
    data
  )

  return new TextDecoder().decode(decrypted)
}

// Helpers
async function getCryptoKey(): Promise<CryptoKey> {
  const rawKey = base64ToBuffer(process.env.ENCRYPTION_KEY!)
  return webcrypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

function bufferToBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString('base64')
}

function base64ToBuffer(base64: string): Uint8Array {
  return Buffer.from(base64, 'base64')
}

