import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { FC } from 'react'

interface StatsCardProps {
  title: string
  value: number
  trend: 'up' | 'down' | 'meh'
  percentage: number
}

export const StatsCard: FC<StatsCardProps> = ({ title, value, trend, percentage }) => (
  <div className="p-5 rounded-2xl border border-neutral-700 bg-neutral-900/70 hover:bg-neutral-900/50 transition-colors">
    <div className="flex items-center gap-3">
      {/* Icon with subtle interaction */}
      <div className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
        {trend === 'up' ? (
          <TrendingUpIcon className="w-5 h-5 text-emerald-500" />
        ) : trend === 'down' ? (
          <TrendingDownIcon className="w-5 h-5 text-rose-500" />
        ) : (
          <MinusIcon className='w-5 h-5 text-sky-500' />
        )}
      </div>

      {/* Vertical separator */}
      <div className="w-px h-12 bg-neutral-800" />

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold bg-gradient-to-br from-neutral-300 to-neutral-100 bg-clip-text text-neutral-200">
            {percentage}%
          </span>
          <span className="text-sm text-neutral-500">({value})</span>
        </div>
        <p className="text-sm text-neutral-500">{title}</p>
      </div>
    </div>

    {/* Hover glow effect */}
    <div className="absolute inset-0 rounded-xl border border-neutral-700 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
  </div>
)