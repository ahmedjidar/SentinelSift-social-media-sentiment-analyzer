import { userAgent } from '@/lib/reddit-auth';

// interfaces & types
export interface RedditPostData {
    title: string;
    selftext: string;
    author: string;
    subreddit: string;
    ups: number;
    num_comments: number;
    created_utc: number;
    permalink: string;
}

export interface RedditChild {
    data: RedditPostData;
}

export interface RedditResponse {
    data: {
        children: RedditChild[];
    };
}

export interface ClassificationResponse {
    sentiment: 'positive' | 'negative' | 'neutral';
}

export type SentimentCounts = {
    positive: number;
    negative: number;
    neutral: number;
};

// constants
export const TIME_FILTER_MAP: Record<string, string> = {
    '24h': 'day',
    week: 'week',
    month: 'month',
    year: 'year',
    all: 'all'
};

// reddit api helpers 
export function getRedditHeaders(token: string): HeadersInit {
    return {
        Authorization: `Bearer ${token}`,
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
    };
}

export async function fetchRedditData(
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

export async function processPosts(
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

// HF inference ZS-classifier
// export async function classifyText(text: string): Promise<string> {
//     try {
//         const response = await fetch(
//             'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
//             {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_TOKEN}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     inputs: text,
//                     parameters: {
//                         candidate_labels: ['positive', 'negative', 'neutral'],
//                         multi_label: false
//                     }
//                 })
//             }
//         );

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.error || 'Classification failed');
//         }

//         const result = await response.json();
//         const scores = result.scores;
//         const labels = result.labels;

//         const maxScore = Math.max(...scores);
//         return labels[scores.indexOf(maxScore)].toLowerCase();
//     } catch (error) {
//         console.error('Classification error:', {
//             text: text.substring(0, 50),
//             error: error instanceof Error ? error.message : 'Unknown'
//         });
//         return 'neutral';
//     }
// }

// ChatGPT API 
export async function classifyText(text: string): Promise<string> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Or gpt-4-turbo for better accuracy
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `Classify text sentiment as JSON: { "sentiment": "positive"|"negative"|"neutral" }`
                    },
                    {
                        role: "user",
                        content: `Text: ${text.substring(0, 1000)}` // Truncate to save tokens
                    }
                ],
                temperature: 0.1, // Reduce randomness
                max_tokens: 50
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'ChatGPT classification failed');
        }

        const result = await response.json();
        const classification = JSON.parse(result.choices[0].message.content) as ClassificationResponse;
        
        return classification.sentiment;

    } catch (error) {
        console.error('Classification error:', {
            text: text.substring(0, 50),
            error: error instanceof Error ? error.message : 'Unknown'
        });
        return 'neutral';
    }
}

export function validateRequest(query: string | undefined, token: string | null) {
    if (!token) throw new Error('Invalid Reddit token');
    if (!query) throw new Error('Empty search query');
}

export function buildSearchParams(query: string, timeFilter: string, limit: number): URLSearchParams {
    return new URLSearchParams({
        q: query,
        limit: limit.toString(),
        t: TIME_FILTER_MAP[timeFilter] || 'all'
    });
}

// Plan 1: local model compatibility test (running and vercel deployment)
// Plan 2: upgrade to pro plan in HF and use the pro model
// Plan 3: if local model is cheap and efficient, use it as a fallback option 
// TO-DO:
    // Add rate limiter
    // Refactor app/page.tsx
    // Deploy to vercel