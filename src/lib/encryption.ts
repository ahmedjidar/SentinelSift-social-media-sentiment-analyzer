export interface EncryptedData {
  iv: string;
  ciphertext: string;
  tag: string;
}

export async function encrypt(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey();

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128
    },
    key,
    data
  );

  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  return bufferToBase64(combined);
}

export async function decrypt(encrypted: string): Promise<string> {
  if(!encrypted) return '';

  const combined = base64ToBuffer(encrypted);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const key = await getCryptoKey();
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

// helper functions
async function getCryptoKey(): Promise<CryptoKey> {
  const rawKey = base64ToBuffer(String(process.env.ENCRYPTION_KEY!));
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufferToBase64(buffer: ArrayBuffer|Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): Uint8Array {
  return new Uint8Array(
    atob(base64)
      .split('')
      .map(c => c.charCodeAt(0))
  );
}
