import { userAgent } from '@/lib/reddit-auth';
import { NextRequest } from 'next/server';
import { ratelimit } from '@/lib/rate-limit';
import { AnalysisError, APIError, AuthError, ValidationError } from '@/lib/errors';

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

export type AvailableKeyOptions = {
    openai?: string;
    hf?: string
}

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
        throw new APIError(`Reddit API Error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
        const body = await response.text();
        throw new ValidationError(`Reddit: Invalid content type: ${contentType} - Response: ${body.substring(0, 100)}`);
    }

    return response.json();
}

export async function providerSelector(apiKeys: AvailableKeyOptions): Promise<string> {
    if (!apiKeys) return String(process.env.USE_FALLBACK_STRATEGY)
    // const useOpenAI = apiKeys?.openai && await validateApiKey('openai', apiKeys.openai)
    // const useHF = apiKeys?.hf && await validateApiKey('hf', apiKeys.hf)

    // const fallbackStrategy = () => {
    //     if (useHF) return 'hf'
    //     if (useOpenAI) return 'openai'
    //     return String(process.env.USE_FALLBACK_STRATEGY)
    // }

    // return fallbackStrategy()

    if (apiKeys.openai) {
        const ok = await validateApiKey('openai', apiKeys.openai);
        if (!ok) {
            throw new APIError(
                'OpenAI key rejected by the API, please re-enter a valid key'
            );
        }
    }
    
    if (apiKeys.hf) {
        const ok = await validateApiKey('hf', apiKeys.hf);
        if (!ok) {
            throw new APIError(
                'Hugging Face key rejected by the API, please re-enter a valid key'
            );
        }
    }

    if (apiKeys.openai) return 'openai';
    if (apiKeys.hf) return 'hf';

    return String(process.env.USE_FALLBACK_STRATEGY);
}

export async function processPosts(
    data: RedditResponse,
    apiKeys: AvailableKeyOptions
): Promise<{ analysis: string[]; counts: SentimentCounts; redditPosts: RedditChild[] }> {
    const redditPosts = data.data.children;

    const posts = redditPosts.map(child =>
        (child.data.title + ' ' + child.data.selftext).substring(0, 200)
    );

    const analysis = await Promise.all(
        posts.map(async (text) => {
            try {
                if (await providerSelector(apiKeys) === 'openai') {
                    return await _OAITextClassifier(text, apiKeys.openai)
                }
                if (await providerSelector(apiKeys) === 'hf') {
                    return await _FB_MNLITextClassifier(text, apiKeys.hf)
                }
                return await _FallbackClassifier(text)
            } catch (error) {
                if (error instanceof AnalysisError) throw error
                throw new APIError('Unexpected API Error. Try clearing the keys and proceed using the fallback model')
            }
        })
    )

    const counts: SentimentCounts = { positive: 0, negative: 0, neutral: 0 };

    analysis.forEach(label => {
        const cleanLabel = label.toLowerCase().trim() as keyof SentimentCounts;
        counts[cleanLabel in counts ? cleanLabel : 'neutral']++;
    });

    return { analysis, counts, redditPosts };
}

// HF inference ZS-classifier
export async function _FB_MNLITextClassifier(text: string, givenApiKey?: string): Promise<string> {
    try {
        const response = await fetch(
            'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${givenApiKey}`,
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

        if (response.status === 401) {
            const error = await response.json();
            throw new AuthError(`HF: facebook/bart-large-mnli: ${error.error?.message || 'Unauthorized'}`);
        }

        if (!response.ok) {
            const error = await response.json();
            throw new APIError('HF: facebook/bart-large-mnli: ' + error.error?.message || 'Classification failed');
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

// OpenAI API 
export async function _OAITextClassifier(text: string, givenApiKey?: string): Promise<string> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${givenApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `Classify text sentiment as JSON: { "sentiment": "positive"|"negative"|"neutral" }`
                    },
                    {
                        role: "user",
                        content: `Text: ${text.substring(0, 1000)}`
                    }
                ],
                temperature: 0.1,
                max_tokens: 50
            })
        });

        if (response.status === 401) {
            const error = await response.json();
            throw new AuthError(`OpenAI: ${error.error?.message || 'Unauthorized'}`);
        }

        if (!response.ok) {
            const error = await response.json();
            throw new APIError('OpenAI: ' + error.error?.message || 'Classification failed');
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

export async function _FallbackClassifier(text: string): Promise<string> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `Classify text sentiment as JSON: { "sentiment": "positive"|"negative"|"neutral" }`
                    },
                    {
                        role: "user",
                        content: `Text: ${text.substring(0, 1000)}`
                    }
                ],
                temperature: 0.1,
                max_tokens: 50
            })
        });

        if (response.status === 401) {
            throw new AuthError(`Fallback Model`);
        }

        if (!response.ok) {
            const error = await response.json();
            throw new APIError('Fallback Model: ' + error.error?.message || 'Classification failed');
        }

        const result = await response.json();
        const classification = JSON.parse(result.choices[0].message.content) as ClassificationResponse;

        return classification.sentiment;

    } catch (error) {
        if (error instanceof AnalysisError) throw error
        throw new APIError('Fallback Model API Error ')
    }
}

export function validateRequest(query: string | undefined, token: string | null) {
    if (!token) throw new ValidationError('Invalid Reddit token');
    if (!query) throw new ValidationError('Empty search query');
}

export function buildSearchParams(query: string, timeFilter: string, limit: number): URLSearchParams {
    return new URLSearchParams({
        q: query,
        limit: limit.toString(),
        t: TIME_FILTER_MAP[timeFilter] || 'all'
    });
}

export async function validateApiKey(service: 'openai' | 'hf', key: string) {
    try {
        if (service === 'openai') {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: { Authorization: `Bearer ${key}` }
            })
            return response.ok
        }

        if (service === 'hf') {
            const response = await fetch('https://huggingface.co/api/whoami-v2', {
                headers: { Authorization: `Bearer ${key}` }
            })
            return response.ok
        }

        return false
    } catch {
        return false
    }
}

export async function rateLimitHandler(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    return success;
}