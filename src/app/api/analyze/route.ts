import { NextResponse } from 'next/server';
import { getRedditToken } from '@/lib/reddit-auth';
import { buildSearchParams, fetchRedditData, getRedditHeaders, processPosts, validateRequest } from '@/app/_utils/apiUtils';
import { ratelimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
        const { success } = await ratelimit.limit(ip)

        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again in a minute.' },
                { status: 429 }
            )
        }
        const { finalQuery, timeFilter = 'all', limit = 10, apiKeys } = await req.json();
        const query = finalQuery?.trim();
        const token = await getRedditToken();

        validateRequest(query, token);

        const searchParams = buildSearchParams(query, timeFilter, limit);
        const data = await fetchRedditData(getRedditHeaders(token), searchParams);
        const { analysis, counts, redditPosts } = await processPosts(data, apiKeys);

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