import { SmilePlus } from 'lucide-react'

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center space-y-6 min-h-[60vh]">
    <SmilePlus size={64} className="text-neutral-500" />
    <div className="text-center space-y-3">
      <h2 className="text-lg font-medium text-neutral-200">
        {`Let's Analyze Sentiment!`}
      </h2>
      <p className="text-neutral-500">
        Search for communities to begin your analysis
      </p>
    </div>
  </div>
)