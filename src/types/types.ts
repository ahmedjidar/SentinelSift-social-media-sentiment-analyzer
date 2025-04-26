// types.ts
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