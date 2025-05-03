import { StatsCardProps } from '@/types/types'
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { FC } from 'react'

export const StatsCard: FC<StatsCardProps> = ({ title, value, trend, percentage }) => (
  <div className="group p-5 rounded-2xl border border-neutral-800 bg-neutral-900/70 hover:bg-gradient-to-br hover:from-neutral-900/50 hover:to-neutral-900/20 transition-all duration-300 relative overflow-hidden">
    <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[rgba(34,197,94,0.15)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-500" />
    
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="flex items-center gap-3 relative z-10">
      <div className={`p-2 rounded-lg ${
        trend === 'up' ? 'bg-emerald-500/20 border border-emerald-500/30' :
        trend === 'down' ? 'bg-rose-500/20 border border-rose-500/30' :
        'bg-sky-500/20 border border-sky-500/30'
      }`}>
        {trend === 'up' ? (
          <TrendingUpIcon className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
        ) : trend === 'down' ? (
          <TrendingDownIcon className="w-6 h-6 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
        ) : (
          <MinusIcon className='w-6 h-6 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]' />
        )}
      </div>

      <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />

      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-bold bg-gradient-to-br from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            {percentage}%
          </span>
          <span className="text-sm text-neutral-400 font-mono">{value}</span>
        </div>
        <p className="text-sm text-neutral-400 font-medium">{title}</p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800 overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${
          trend === 'up' ? 'bg-emerald-500' :
          trend === 'down' ? 'bg-rose-500' :
          'bg-sky-500'
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
)