import { ValidationStatusProps } from '@/types/types'
import { Zap, CircuitBoard } from 'lucide-react'

export const CurrentModelsUsed = (
    { status }: ValidationStatusProps
) => {

    const { openai, hf } = status
    const activeModel = openai === 'valid' ? 'OpenAI' :
                        hf === 'valid' ? 'HuggingFace' :
                        'None'

    return (
        <div className="sm:col-span-2 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 space-y-5 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30">
                    <span className="text-2xl bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                        🤖
                    </span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                        Model Runtime
                    </h1>
                    <p className="text-sm text-neutral-400 mt-0.5">
                        Active inference engine status
                    </p>
                </div>
            </div>

            <div className="grid gap-4 text-sm">
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                        <p className="text-neutral-200 flex items-center gap-2">
                            Active Model
                            <span className={`w-2 h-2 rounded-full ${activeModel !== 'None' ? 'bg-green-400' : 'bg-red-400'}`} />
                        </p>
                        <p className="text-neutral-400">
                            {activeModel === 'OpenAI' && 'GPT-4o (128k context)'}
                            {activeModel === 'HuggingFace' && 'facebook/bart-large-mnli'}
                            {activeModel === 'None' && 'No valid API keys detected'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <CircuitBoard className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                        <p className="text-neutral-200">Fallback Model</p>
                        <p className="text-neutral-400">
                            OpenAI GPT-4o
                            <span className="text-xs text-purple-400/80 ml-2">
                                (Always available)
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-neutral-400 pt-4 border-t border-neutral-800/50">
                Model selection prioritizes validated API credentials.
                <span className="text-purple-400/80"> OpenAI</span> takes precedence over
                <span className="text-purple-400/80"> Hugging Face</span> when both services are available.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-800/50">
                {['Priority Engine', 'Fallback Model', 'On-Device'].map((tech) => (
                    <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-neutral-900/50 rounded-md border border-neutral-800 text-neutral-400"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    )
}