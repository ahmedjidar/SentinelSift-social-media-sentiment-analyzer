import { CheckCircle } from "lucide-react"

export interface ApiKeyInputProps {
    type: 'openai' | 'hf'
    value: string
    saved: boolean
    status: 'empty' | 'valid' | 'invalid'
    onSave: (value: string) => void
    setKey: (value: string) => void
}

export const ApiKeyInput = ({
    type,
    value,
    saved,
    status,
    onSave,
    setKey,
}: ApiKeyInputProps) => {
    const label = type === 'openai' ? 'OpenAI API Key' : 'HuggingFace API Key'
    const placeholder = type === 'openai' ? 'sk-...xxxx' : 'hf_...xxxx'
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-300">
                    {label}
                </label>
                <span className="text-xs text-neutral-500">
                    {status === 'valid' ? 'Valid format' : ' '}
                </span>
            </div>
            <div className="flex flex-wrap gap-2 relative">
                <input
                    type="password"
                    value={value}
                    onChange={(e) => setKey(e.target.value.trim())}
                    placeholder={value ? '••••••••' : placeholder}
                    className={`focus:ring-1 focus:ring-emerald-500 focus:bg-neutral-900 outline-none transition-all flex-1 bg-neutral-900/30 border rounded-lg px-4 py-2 text-sm placeholder-neutral-600 ${status === 'invalid'
                        ? 'border-rose-500/50 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-emerald-500/50'
                        }`}
                />
                <button
                    onClick={() => onSave(value)}
                    disabled={!value || status !== 'valid'}
                    className={`px-4 py-2 border rounded-lg text-sm transition-all ${status === 'valid'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer'
                        : 'bg-neutral-900/10 border-neutral-800/50 text-neutral-600 cursor-not-allowed'
                        }`}
                >
                    {saved ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Saved
                        </span>
                    ) : (
                        'Save'
                    )}
                </button>
            </div>
        </div>
    )
}