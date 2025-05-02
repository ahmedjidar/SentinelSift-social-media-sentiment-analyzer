import { CheckCircle, Loader2 } from "lucide-react"

export interface ApiKeyInputProps {
  type: 'openai' | 'hf'
  value: string
  saved: boolean
  status: 'empty' | 'valid' | 'invalid' | 'loading'
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

  const isValid = status === 'valid'
  const isLoading = status === 'loading'
  const isInvalid = status === 'invalid'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-300">
          {label}
        </label>
        <span className="text-xs text-neutral-500">
          {isValid && 'Valid API key'}
          {isLoading && 'Verifying...'}
          {isInvalid && 'Invalid key'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 relative">
        <input
          type="password"
          value={value}
          onChange={(e) => setKey(e.target.value.trim())}
          placeholder={value ? '••••••••' : placeholder}
          className={`focus:ring-1 outline-none transition-all flex-1 bg-neutral-900/30 border rounded-lg px-4 py-2 text-sm placeholder-neutral-600 
            ${isLoading
              ? 'border-emerald-500/30 animate-pulse'
              : isInvalid
                ? 'border-rose-500/50 focus:border-rose-500'
                : 'border-neutral-800 focus:border-emerald-500/50'
            }`}
        />
        <button
          onClick={() => onSave(value)}
          disabled={!value || isLoading}
          className={`px-4 py-2 border rounded-lg text-sm transition-all flex items-center gap-2 ${!value || isLoading
            ? 'bg-neutral-900/10 border-neutral-800/50 text-neutral-600 cursor-not-allowed'
            : isInvalid
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20 cursor-pointer'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer'
            }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : isInvalid ? (
            'Retry'
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  )
}