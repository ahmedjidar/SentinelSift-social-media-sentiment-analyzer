'use client'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { SentimentData, SentimentPieChartProps } from '@/types/types'

const COLORS = ['#10B981', '#EF4444', '#3B82F6']

export const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ data }) => (
  <PieChart width={400} height={300}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      paddingAngle={2}
      dataKey="value"
    >
    {data.map((_: SentimentData[number], index: number) => (
      <Cell key={index} fill={COLORS[index]} stroke="none" />
    ))}
    </Pie>
    <Tooltip
      contentStyle={{
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '8px'
      }}
    />
  </PieChart>
)

