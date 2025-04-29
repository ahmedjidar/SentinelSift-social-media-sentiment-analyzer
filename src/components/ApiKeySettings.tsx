// components/ApiKeySettings.tsx
'use client'
import { useState } from 'react'
import { Info } from 'lucide-react'

export const ApiKeySettings = () => {
  const [openAIKey, setOpenAIKey] = useState('')
  const [hfKey, setHfKey] = useState('')

  return (
    <div className="sm:col-span-2 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 mb-8">
      {/* Info Card */}
      <div className="bg-neutral-900/70 p-4 rounded-lg mb-6 border border-neutral-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-3">
            <p className="text-sm text-neutral-300">
              For sustained analysis quality, we recommend providing your own API keys. 
              Each month includes <span className="font-medium text-emerald-500">2,586 free MNLI requests</span> 
              (≈25 full analyses) across all users. Heavy usage may require personal keys.
            </p>
            <p className="text-sm text-neutral-400">
              Current models: GPT-4o (OpenAI) • BART-MNLI (Hugging Face)<br />
              Keys are stored locally and never sent to our servers
            </p>
          </div>
        </div>
      </div>

      {/* API Key Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">OpenAI API Key</label>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-...xxxx"
              className="outline-none focus:ring-1 focus:ring-emerald-500 flex-1 bg-neutral-900/30 border border-neutral-800 rounded-lg px-4 py-2 text-sm placeholder-neutral-600 focus:border-emerald-500/50"
            />
            <button
              onClick={() => localStorage.setItem('OPENAI_KEY', openAIKey)}
              className="cursor-pointer px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500 hover:bg-emerald-500/20 transition-colors text-sm"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">HuggingFace API Key</label>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              value={hfKey}
              onChange={(e) => setHfKey(e.target.value)}
              placeholder="hf_...xxxx"
              className="outline-none focus:ring-1 focus:ring-emerald-500 flex-1 bg-neutral-900/30 border border-neutral-800 rounded-lg px-4 py-2 text-sm placeholder-neutral-600 focus:border-emerald-500/50"
            />
            <button
              onClick={() => localStorage.setItem('HF_KEY', hfKey)}
              className="cursor-pointer px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500 hover:bg-emerald-500/20 transition-colors text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}