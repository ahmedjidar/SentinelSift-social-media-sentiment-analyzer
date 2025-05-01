'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const SentimentLineChart = ({ data }: { data: Array<{ 
  time: string;
  positive: number;
  negative: number;
  neutral: number;
}> }) => {
  return (
    <div className="h-64 mt-4 px-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 40, left: 0, bottom: 15 }}>
        <CartesianGrid 
          strokeDasharray="1 1" 
          stroke="#1F2937" 
          strokeOpacity={0.3}
        />
        <XAxis
          dataKey="time"
          type="category"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit'
          })}
          stroke="#545454"
          strokeWidth={1}
          tick={{ fill: '#e5e5e5' }}
          tickMargin={12}
          fontSize={14}
        />
        <YAxis 
          stroke="#545454" 
          strokeWidth={1}
          tick={{ fill: '#e5e5e5' }}
          tickMargin={12}
          fontSize={14}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#171717',
            border: '1px solid #1F2937',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '14px'
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
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
            <span className="text-neutral-300 capitalize">{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="#10B981"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="#EF4444"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="#1484CD"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
  );
};