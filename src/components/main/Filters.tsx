'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface FiltersProps {
    timeFilter: string
    setTimeFilter: (value: string) => void
    limit: number
    setLimit: (value: number) => void
}

export const Filters = ({
    timeFilter,
    setTimeFilter,
    limit,
    setLimit,
}: FiltersProps) => {
    return (
        <div className="flex gap-3 w-full sm:w-auto">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-1/2 bg-neutral-900/70 border border-neutral-700">
                    <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900/90 text-neutral-200">
                    {['24h', 'Week', 'Month', 'Year', 'All'].map((option) => (
                        <SelectItem
                            key={option}
                            value={option.toLowerCase()}
                            className="hover:bg-neutral-800"
                        >
                            Past {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
                <SelectTrigger className="w-1/2 bg-neutral-900/70 border border-neutral-700">
                    <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900/90 text-neutral-200">
                    {[10, 25, 50, 100].map((num) => (
                        <SelectItem
                            key={num}
                            value={num.toString()}
                            className="hover:bg-neutral-800"
                        >
                            {num} Posts
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}