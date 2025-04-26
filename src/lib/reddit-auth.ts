import axios from 'axios';

export async function getRedditToken() {
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
          username: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID!,
          password: process.env.REDDIT_CLIENT_SECRET!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'NextJS-Sentiment-Analyzer/1.0'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Reddit authentication failed:');
    throw error;
  }
}