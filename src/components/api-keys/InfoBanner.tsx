'use client'

import { Info } from "lucide-react"

export const InfoBanner = () => {
    return (
        <div className="bg-neutral-900/70 p-4 rounded-lg mb-6 border border-neutral-800">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-3">
                    <p className="text-sm text-neutral-300">
                        For sustained analysis quality, we recommend providing your own API keys.
                        Each month includes <span className="font-medium text-emerald-500">2,586 free MNLI requests </span>
                        (≈ 25 full analyses) across all users. Heavy usage may require personal keys.
                    </p>
                    <p className="text-sm text-neutral-400">
                        Current models: GPT-4o (OpenAI) • BART-MNLI (Hugging Face).<br />
                        <br />
                        <span className='underline'>Keys are stored encrypted, protected by a strict SameSite policy, and never exposed in plaintext.</span>
                    </p>
                </div>
            </div>
        </div>
    )
}