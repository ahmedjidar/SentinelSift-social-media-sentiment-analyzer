import axios from 'axios';
import { AuthError } from './errors';

export const userAgent = 'web:social-media-sentiment-analyzer:v1.0 (by /u/Logical-Beginning103)';

let tokenCache: { token: string; expires: number } | null = null;

export async function getRedditToken() {
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache.token;
  }

  try {
    const newToken = await refreshToken();
    tokenCache = {
      token: newToken,
      expires: Date.now() + 3500 * 1000
    };
    return newToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new AuthError('Reddit OAuth (Failed to refresh token)');
    }
  }
}

export async function refreshToken() {
  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'password',
        username: process.env.REDDIT_USERNAME!,
        password: process.env.REDDIT_PASSWORD!,
      }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID!,
          password: process.env.REDDIT_CLIENT_SECRET!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': userAgent,
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      throw new AuthError('Reddit OAuth');
    }
  }
}