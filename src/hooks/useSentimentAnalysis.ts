'use client'

import { useState } from 'react'
import { AppError, ErrorType, SentimentResult } from '@/types/types'

export const useSentimentAnalysis = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SentimentResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [error, setError] = useState<AppError | null>(null)
    const [timeFilter, setTimeFilter] = useState('all')
    const [limit, setLimit] = useState(10)

    const analyzeSentiment = async (currentQuery?: string) => {
        setLoading(true)
        setError(null)
        try {
            const finalQuery = currentQuery || query;
            let progress = 0

            const interval = setInterval(() => {
                progress = Math.min(progress + Math.random() * 10, 95)
                setLoadingProgress(progress)
            }, 1500)

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    finalQuery,
                    timeFilter,
                    limit,
                })
            })

            clearInterval(interval)
            setLoadingProgress(100)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`${errorData.type}:${errorData.error}`)
            }

            const data = await response.json()
            console.log()
            if (data.switched) alert('Fallback activated due to invalid keys');
            setResults(data)

        } catch (err) {
            if (err instanceof Error) {
                const [type, message] = err.message.split(':')
                setError({ type: type as ErrorType, message })
            } else {
                setError({ type: 'INTERNAL', message: 'Unknown error occurred' })
            }
        } finally {
            setLoading(false)
            setLoadingProgress(0)
        }
    }

    const lineData = results ? results.posts
        .sort((a, b) => a.created_utc - b.created_utc)
        .reduce((acc, post, index) => {
            const prev = acc[index - 1] || { positive: 0, negative: 0, neutral: 0 };
            const newEntry = {
                time: new Date(post.created_utc * 1000).toLocaleString('en-US', { timeZone: 'UTC' }), // Convert to milliseconds
                positive: prev.positive + (post.sentiment === 'positive' ? 1 : 0),
                negative: prev.negative + (post.sentiment === 'negative' ? 1 : 0),
                neutral: prev.neutral + (post.sentiment === 'neutral' ? 1 : 0),
            };
            return [...acc, newEntry];
        }, [] as Array<{ time: string; positive: number; negative: number; neutral: number }>)
        : [];

    return {
        query,
        setQuery,
        results,
        loading,
        loadingProgress,
        error,
        timeFilter,
        setTimeFilter,
        limit,
        setLimit,
        analyzeSentiment,
        lineData
    }
}

