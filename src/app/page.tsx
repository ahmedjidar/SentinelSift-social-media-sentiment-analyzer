'use client'
import { useState } from 'react'
import { SentimentResult } from '@/types/types'
import {
  SearchHeader,
  ErrorMessage,
  StatsCard,
  PostItem,
  ExportReportButton
} from '@/components/index'
import { SentimentLineChart } from '@/components/SentimentLineChart'
import { Loader2, SmilePlus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// refactor heavy components (page.tsx, route.ts)
// add rate limiter

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SentimentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
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
        body: JSON.stringify({ finalQuery, timeFilter, limit })
      })

      clearInterval(interval)
      setLoadingProgress(100)

      if (!response.ok) throw new Error('Analysis failed (API might be down, try again later)')
      if (response.status === 429) throw new Error('Rate limit exceeded, please try again later')
      if (response.status === 403) throw new Error('Forbidden: Invalid API key or token')
      if (response.status === 500) throw new Error('Internal server error, please try again later')
      if (response.status === 400) throw new Error('Bad request, please check your input')
      if (response.status === 404) throw new Error('Not found, please check your input')
        
      const data = await response.json()
      setResults(data)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
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

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SearchHeader
            query={query}
            loading={loading}
            setQuery={setQuery}
            analyzeSentiment={analyzeSentiment}
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-1/2 bg-neutral-900/70 border border-neutral-700">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900/90 text-neutral-200">
                {['24h', 'Week', 'Month', 'Year', 'All'].map((option) => (
                  <SelectItem
                    key={option}
                    value={option.toLowerCase()}
                    className="hover:bg-neutral-800"
                  >
                    Past {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="w-1/2 bg-neutral-900/70 border border-neutral-700">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900/90 text-neutral-200">
                {[10, 25, 50, 100].map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="hover:bg-neutral-800"
                  >
                    {num} Posts
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <ErrorMessage error={error} />

        {!results && !loading && (
          <div className="flex flex-col items-center justify-center space-y-6 min-h-[60vh]">
            <SmilePlus
              size={64}
              className='text-neutral-500'
            />
            <div className="text-center space-y-3">
              <h2 className="text-lg font-medium text-neutral-200">
                {`Let's Analyze Sentiment!`}
              </h2>
              <p className="text-neutral-500">
                Search for communities to begin your analysis
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 h-full bg-neutral-950/50 backdrop-blur z-50 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="flex items-center space-x-3 text-neutral-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">
                Analyzing posts ({Math.round(loadingProgress)}%)
              </span>
            </div>
          </div>
        )}

        {results && results.sentiment && (
          <div id="sentiment-chart" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
              <StatsCard
                title="Positive Sentiment"
                value={results.sentiment.positive}
                percentage={Math.round((results.sentiment.positive / results.total) * 100)}
                trend={results.sentiment.positive > 0 ? 'up' : 'down'}
              />
              <StatsCard
                title="Negative Sentiment"
                value={results.sentiment.negative}
                percentage={Math.round((results.sentiment.negative / results.total) * 100)}
                trend={results.sentiment.negative > 0 ? 'down' : 'up'}
              />
              <StatsCard
                title="Neutral Sentiment"
                value={results.sentiment.neutral}
                percentage={Math.round((results.sentiment.neutral / results.total) * 100)}
                trend={'meh'}
              />
              <div className='flex items-center justify-center p-5 rounded-2xl border border-neutral-700 bg-neutral-900/70 hover:bg-neutral-900/50 transition-colors'>
                <div className='flex items-center pl-4 gap-3'>
                  <div className='space-y-1'>
                    <p className='text-2xl font-bold text-neutral-200'>{results.total}</p>
                    <p className='text-sm text-neutral-500'>Total Analyzed Posts</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Visualization Section */}
            <div className="w-full flex items-center justify-between">
              {/* Graph Here */}
              <div className="w-full rounded-2xl bg-neutral-900/50 border border-neutral-700">
                <SentimentLineChart data={lineData} />
              </div>
            </div>

            {/* Post List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Analyzed Posts</h3>
              {results.posts.map((post, index) => (
                <PostItem key={index} post={post} />
              ))}
            </div>

            {/* needs fixes */}
            <ExportReportButton elementId="sentiment-chart" />
          </div>
        )}
      </div>
    </main>
  )
}

