import { NextResponse } from 'next/server';
import { getRedditToken } from '@/lib/reddit-auth';
import { userAgent } from '@/lib/reddit-auth';

async function classifyText(text: string): Promise<string> {
    try {
        const response = await fetch(
            'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: text,
                    parameters: {
                        candidate_labels: ['positive', 'negative', 'neutral'],
                        multi_label: false
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Classification failed');
        }

        const result = await response.json();
        const scores = result.scores;
        const labels = result.labels;

        const maxScore = Math.max(...scores);
        return labels[scores.indexOf(maxScore)].toLowerCase();
    } catch (error) {
        console.error('Classification error:', {
            text: text.substring(0, 50),
            error: error instanceof Error ? error.message : 'Unknown'
        });
        return 'neutral';
    }
}

// export async function POST(req: Request) {
//     try {
//         const { finalQuery, timeFilter = 'all', limit = 10 } = await req.json();
//         const query = finalQuery;
//         const token = await getRedditToken();

//         const timeMap: { [key: string]: string } = {
//             '24h': 'day',
//             week: 'week',
//             month: 'month',
//             year: 'year',
//             all: 'all'
//         };

//         if (!token) throw new Error('Invalid Reddit token');
//         if (!query?.trim()) throw new Error('Empty search query');

//         const headers = {
//             Authorization: `Bearer ${token}`,
//             'User-Agent': userAgent,
//             'Content-Type': 'application/json'
//         };

//         const searchParams = new URLSearchParams({
//             q: query,
//             limit: limit.toString(),
//             t: timeMap[timeFilter] || 'all'
//           });

//           const redditResponse = await fetch(
//             `https://oauth.reddit.com/search?${searchParams}`,
//             { headers }
//           );

//         if (!redditResponse.ok) {
//             const errorText = await redditResponse.text();
//             console.error('Reddit API Error:', {
//                 status: redditResponse.status,
//                 error: errorText
//             });
//             throw new Error(`Reddit API Error: ${redditResponse.statusText}`);
//         }

//         const contentType = redditResponse.headers.get('content-type');
//         if (!contentType?.includes('application/json')) {
//             const body = await redditResponse.text();
//             throw new Error(`Invalid content type: ${contentType} - Response: ${body.substring(0, 100)}`);
//         }

//         const data = await redditResponse.json();

//         // debug
//         console.log('Reddit data:', data.data.children);

//         const posts: string[] = data.data.children.map(
//             (child: any) => (child.data.title + ' ' + child.data.selftext).substring(0, 200)
//         );

//         const analysis = await Promise.all(
//             posts.map(async (text) => classifyText.call(null, text))
//         );

//         const counts = { positive: 0, negative: 0, neutral: 0 };
//         analysis.forEach(label => {
//             const cleanLabel = label.toLowerCase().trim() as keyof typeof counts;
//             counts[cleanLabel in counts ? cleanLabel : 'neutral']++;
//         });

//         return NextResponse.json({
//             total: posts.length,
//             sentiment: counts,
//             posts: data.data.children.map((child: any, index: number) => ({
//                 title: child.data.title,
//                 content: child.data.selftext,
//                 sentiment: analysis[index],
//                 author: child.data.author,
//                 subreddit: child.data.subreddit,
//                 upvotes: child.data.ups,
//                 comments: child.data.num_comments,
//                 created_utc: child.data.created_utc,
//                 url: `https://reddit.com${child.data.permalink}`
//             }))
//         })

//     } catch (error) {
//         console.error('Critical error:', error);
//         return NextResponse.json(
//             { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
//             { status: 500 }
//         );
//     }
// }

interface RedditPostData {
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  ups: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
}

interface RedditChild {
  data: RedditPostData;
}

interface RedditResponse {
  data: {
    children: RedditChild[];
  };
}

type SentimentCounts = {
  positive: number;
  negative: number;
  neutral: number;
};

const TIME_FILTER_MAP: Record<string, string> = {
  '24h': 'day',
  week: 'week',
  month: 'month',
  year: 'year',
  all: 'all'
};

function getHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': userAgent,
    'Content-Type': 'application/json'
  };
}

async function fetchRedditData(
  headers: HeadersInit,
  searchParams: URLSearchParams
): Promise<RedditResponse> {
  const response = await fetch(
    `https://oauth.reddit.com/search?${searchParams}`,
    { headers }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Reddit API Error:', {
      status: response.status,
      error: errorText
    });
    throw new Error(`Reddit API Error: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const body = await response.text();
    throw new Error(`Invalid content type: ${contentType} - Response: ${body.substring(0, 100)}`);
  }

  return response.json();
}

async function processPosts(
  data: RedditResponse
): Promise<{ analysis: string[]; counts: SentimentCounts; redditPosts: RedditChild[] }> {
  const redditPosts = data.data.children;

  const posts = redditPosts.map(child =>
    (child.data.title + ' ' + child.data.selftext).substring(0, 200)
  );

  const analysis = await Promise.all(posts.map(text => classifyText(text)));
  const counts: SentimentCounts = { positive: 0, negative: 0, neutral: 0 };

  analysis.forEach(label => {
    const cleanLabel = label.toLowerCase().trim() as keyof SentimentCounts;
    counts[cleanLabel in counts ? cleanLabel : 'neutral']++;
  });

  return { analysis, counts, redditPosts };
}

export async function POST(req: Request) {
  try {
    const { finalQuery, timeFilter = 'all', limit = 10 } = await req.json();
    const query = finalQuery?.trim();
    const token = await getRedditToken();

    if (!token) throw new Error('Invalid Reddit token');
    if (!query) throw new Error('Empty search query');

    const searchParams = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      t: TIME_FILTER_MAP[timeFilter] || 'all'
    });

    const data = await fetchRedditData(getHeaders(token), searchParams);
    const { analysis, counts, redditPosts } = await processPosts(data);

    return NextResponse.json({
      total: redditPosts.length,
      sentiment: counts,
      posts: redditPosts.map((child, index) => ({
        title: child.data.title,
        content: child.data.selftext,
        sentiment: analysis[index],
        author: child.data.author,
        subreddit: child.data.subreddit,
        upvotes: child.data.ups,
        comments: child.data.num_comments,
        created_utc: child.data.created_utc,
        url: `https://reddit.com${child.data.permalink}`
      }))
    });

  } catch (error) {
    console.error('Critical error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}