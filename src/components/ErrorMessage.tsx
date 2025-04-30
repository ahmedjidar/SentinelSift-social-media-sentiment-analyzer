import { AppError } from '@/types/types'
import { FC } from 'react'

interface ErrorMessageProps {
  error: AppError | null
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null

  const getErrorDetails = () => {
    switch (error.type) {
      case 'RATE_LIMIT':
        return { icon: '⏳', color: 'text-amber-500' }
      case 'AUTH':
        return { icon: '🔑', color: 'text-rose-500' }
      case 'API':
        return { icon: '🌐', color: 'text-blue-500' }
      default:
        return { icon: '⚠️', color: 'text-neutral-500' }
    }
  }

  const { icon, color } = getErrorDetails()

  return (
    <div className={`p-4 rounded-lg border ${color} bg-neutral-900/50`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h3 className="font-medium">{error.type} Error</h3>
          <p className="text-sm opacity-80">{error.message}</p>
        </div>
      </div>
    </div>
  )
}

