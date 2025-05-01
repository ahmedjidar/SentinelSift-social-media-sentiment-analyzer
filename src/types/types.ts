export interface Post {
  title: string
  content: string
  sentiment: string
  author: string
  subreddit: string
  upvotes: number
  comments: number
  created_utc: number
  url: string
}

export interface SentimentResult {
  total: number
  sentiment: {
    positive: number
    negative: number
    neutral: number
  }
  posts: Post[]
}

export type SentimentData = {
  name: string
  value: number
}[]

export type LineData = {
  time: string;
  positive: number;
  negative: number;
  neutral: number;
}[]

export type ErrorType =
  | 'RATE_LIMIT'
  | 'AUTH'
  | 'API'
  | 'VALIDATION'
  | 'INTERNAL'
  | null

export interface AppError {
  type: ErrorType
  message: string
}