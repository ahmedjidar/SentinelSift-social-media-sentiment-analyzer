import { Loader2 } from 'lucide-react'

export const LoadingOverlay = ({ loading, loadingProgress }: { loading: boolean; loadingProgress: number }) =>
    loading && (
        <div className="fixed inset-0 h-full bg-neutral-950/50 backdrop-blur z-50 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                />
            </div>
            <div className="flex items-center space-x-3 text-neutral-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">
                    Analyzing posts ({Math.round(loadingProgress)}%)
                </span>
            </div>
        </div>
    )