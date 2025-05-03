'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const SentimentLineChart = ({ data }: {
  data: Array<{
    time: string;
    positive: number;
    negative: number;
    neutral: number;
  }>
}) => {
  return (
    <div className="h-64 mt-4 px-2 relative group">
      <div className="absolute inset-0 rounded-xl border border-emerald-500/20 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 40, left: 0, bottom: 15 }}>
          <defs>
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="2 4"
            stroke="#1F2937"
            strokeOpacity={0.2}
            vertical={false}
          />

          <XAxis
            dataKey="time"
            type="category"
            tickFormatter={(time) => new Date(time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}
            stroke="#3f3f46"
            strokeWidth={0.5}
            tick={{
              fill: '#a1a1aa',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            tickLine={{ stroke: '#3f3f46' }}
            tickMargin={12}
          />

          <YAxis
            stroke="#3f3f46"
            strokeWidth={0.5}
            tick={{
              fill: '#a1a1aa',
              fontSize: 12,
              fontFamily: 'monospace'
            }}
            tickLine={{ stroke: '#3f3f46' }}
            tickMargin={12}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              backdropFilter: 'blur(4px)',
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            labelStyle={{ color: '#FFF', fontSize: '14px', fontWeight: 'bold' }}
            itemStyle={{ color: '#FFF', padding: 0 }}
          />

          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              paddingBottom: '10px',
              fontSize: '14px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            formatter={(value) => (
              <span className="text-neutral-300 capitalize px-3 py-1">{value}</span>
            )}
          />

          <Line
            type="monotone"
            dataKey="positive"
            stroke="url(#positiveGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: '#34d399',
              stroke: '#059669',
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.5))' }
            }}
          />

          <Line
            type="monotone"
            dataKey="negative"
            stroke="url(#negativeGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: '#f87171',
              stroke: '#dc2626',
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 0 6px rgba(248, 113, 113, 0.5))' }
            }}
          />

          <Line
            type="monotone"
            dataKey="neutral"
            stroke="url(#neutralGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: '#7dd3fc',
              stroke: '#0ea5e9',
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 0 6px rgba(125, 211, 252, 0.5))' }
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};