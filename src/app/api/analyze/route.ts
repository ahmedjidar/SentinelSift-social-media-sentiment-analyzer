/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function POST(req: Request) {
    try {
        const { finalQuery, timeFilter = 'all', limit = 10 } = await req.json();
        const query = finalQuery;
        const token = await getRedditToken();

        // Map time filters to Reddit's t parameter
        const timeMap: { [key: string]: string } = {
            '24h': 'day',
            week: 'week',
            month: 'month',
            year: 'year',
            all: 'all'
        };

        if (!token) throw new Error('Invalid Reddit token');
        if (!query?.trim()) throw new Error('Empty search query');

        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': userAgent
        };

        const searchParams = new URLSearchParams({
            q: query,
            limit: limit.toString(),
            t: timeMap[timeFilter] || 'all'
          });
          
        //   const redditResponse = await fetch(
        //     `https://oauth.reddit.com/search?${searchParams}`,
        //     { headers }
        //   );

        console.log("My Query: ",`https://oauth.reddit.com/search?q=${encodeURIComponent(query)}`+
                     `&limit=${limit}` + `&t=${timeMap[timeFilter] || 'all'}`)

        const redditResponse = await fetch(
            `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}` + `&limit=${limit}` + `&t=${timeMap[timeFilter] || 'all'}`,
            { headers: { Authorization: `Bearer ${token}`, 'User-Agent': userAgent } }
        );

        // Check for HTTP errors first
        if (!redditResponse.ok) {
            const errorText = await redditResponse.text();
            console.error('Reddit API Error:', {
                status: redditResponse.status,
                error: errorText
            });
            throw new Error(`Reddit API Error: ${redditResponse.statusText}`);
        }

        // Then verify content type
        const contentType = redditResponse.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const body = await redditResponse.text();
            throw new Error(`Invalid content type: ${contentType} - Response: ${body.substring(0, 100)}`);
        }

        // Now parse as JSON
        const data = await redditResponse.json();

        // debug
        console.log('Reddit data:', data.data.children);

        const posts: string[] = data.data.children.map(
            (child: any) => (child.data.title + ' ' + child.data.selftext).substring(0, 200)
        );

        // 2. Handle classification with proper API endpoint
        const analysis = await Promise.all(
            posts.map(async (text) => classifyText.call(null, text))
        );

        // 3. Aggregate results
        const counts = { positive: 0, negative: 0, neutral: 0 };
        analysis.forEach(label => {
            const cleanLabel = label.toLowerCase().trim() as keyof typeof counts;
            counts[cleanLabel in counts ? cleanLabel : 'neutral']++;
        });

        // In your route.ts
        return NextResponse.json({
            total: posts.length,
            sentiment: counts,
            posts: data.data.children.map((child: any, index: number) => ({
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
        })

    } catch (error) {
        console.error('Critical error:', error);
        return NextResponse.json(
            { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}