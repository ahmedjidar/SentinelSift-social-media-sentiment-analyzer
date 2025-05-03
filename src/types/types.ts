import { Dispatch, SetStateAction } from 'react'

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

export interface UseApiKeysProps {
  openAIKey: string
  setOpenAIKey: Dispatch<SetStateAction<string>>
  hfKey: string
  setHfKey: Dispatch<SetStateAction<string>>
  openAISaved: boolean
  hfSaved: boolean
  isMounted: boolean
  handleSave: (type: "openai" | "hf", value: string) => Promise<void>
  handleClearKeys: () => Promise<void>
  getKeyStatus: (service: "openai" | "hf") => "valid" | "invalid" | "loading" | "empty"
}

export interface ValidationStatus {
  openai: ServiceState;
  hf: ServiceState;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: () => void
}

export interface ValidationStatusProps {
  status: ValidationStatus;
}

export interface AppError {
  type: ErrorType
  message: string
}

export interface SearchHeaderProps {
  query: string
  loading: boolean
  setQuery: (value: string) => void
  analyzeSentiment: (query?: string) => void
}

export interface StatsCardProps {
  title: string
  value: number
  trend: 'up' | 'down' | 'meh'
  percentage: number
}

export interface PostItemProps {
  post: Post
}

export interface FiltersProps {
  timeFilter: string
  setTimeFilter: (value: string) => void
  limit: number
  setLimit: (value: number) => void
}

export interface ExportReportButtonProps {
  elementId: string
}

export interface ErrorMessageProps {
  error: AppError | null
}

export interface SentimentPieChartProps {
  data: SentimentData
}

export interface ApiKeyInputProps {
  type: 'openai' | 'hf'
  value: string
  saved: boolean
  status: 'empty' | 'valid' | 'invalid' | 'loading'
  onSave: (value: string) => void
  setKey: (value: string) => void
}

export type ServiceState = 'empty' | 'valid' | 'invalid' | 'loading';

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

