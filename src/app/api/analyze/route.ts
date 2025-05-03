import { NextRequest, NextResponse } from 'next/server';
import { getRedditToken } from '@/lib/reddit-auth';
import { AvailableKeyOptions, buildSearchParams, fetchRedditData, getRedditHeaders, processPosts, rateLimitHandler, validateRequest } from '@/app/_utils/apiUtils';
import { decrypt } from '@/lib/encryption';
import { AnalysisError, RateLimitError } from '@/lib/errors';

export async function POST(req: NextRequest) {
    try {
        // redis rate limiting 
        const success = rateLimitHandler(req);
        if(!success) throw new RateLimitError();

        const cookies = req.cookies;
        const encryptedOpenAI = cookies.get('secure_openai_key')?.value;
        const encryptedHF = cookies.get('secure_hf_key')?.value;

        const [openAIKey, hfKey] = await Promise.all([
            encryptedOpenAI ? decrypt(encryptedOpenAI) : Promise.resolve(''),
            encryptedHF ? decrypt(encryptedHF) : Promise.resolve('')
        ]);

        const apiKeys: AvailableKeyOptions = {
            openai: openAIKey,
            hf: hfKey
        }

        const { finalQuery, timeFilter = 'all', limit = 10 } = await req.json();
        const query = finalQuery?.trim();
        const token = await getRedditToken();

        validateRequest(query, token);

        const searchParams = buildSearchParams(query, timeFilter, limit);
        const data = await fetchRedditData(getRedditHeaders(token), searchParams);
        const { analysis, counts, redditPosts, switched } = await processPosts(data, apiKeys);

        return NextResponse.json({
            total: redditPosts.length,
            sentiment: counts,
            switched,
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
        if (error instanceof AnalysisError) {
            return NextResponse.json(
                { error: error.message, type: error.type },
                { status: error.statusCode }
            )
        }

        console.error('Unhandled error:', error)
        return NextResponse.json(
            { error: 'Internal server error', type: 'INTERNAL' },
            { status: 500 }
        )
    }
}