import { FC } from 'react'

interface ErrorMessageProps {
  error: string | null
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => (
  error && (
    <div className="p-4 rounded-xl bg-red-900/30 border border-red-800/50">
      <span className="text-red-300">⚠️ Error:</span>
      <span className="text-red-400 ml-2">{error}</span>
    </div>
  )
)