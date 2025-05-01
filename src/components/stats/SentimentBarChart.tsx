'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SentimentData } from '@/types/types'

export const SentimentBarChart: React.FC<{ data: SentimentData }> = ({ data }) => (
  <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
    <h3 className="text-neutral-300 font-medium mb-4">Sentiment Breakdown</h3>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="#262626" 
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tick={{ fill: '#737373' }}
            tickLine={{ stroke: '#404040' }}
          />
          <YAxis 
            axisLine={false}
            tick={{ fill: '#737373' }}
            tickLine={{ stroke: '#404040' }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
            itemStyle={{ color: '#e5e5e5' }}
            cursor={false}
          />
          <Bar 
            dataKey="value" 
            fill="url(#gradient)"
            radius={[6, 6, 0, 0]}
            barSize={32}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#525252" />
              <stop offset="100%" stopColor="#404040" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)