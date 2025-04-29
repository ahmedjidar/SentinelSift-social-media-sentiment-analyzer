'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

export const ApiKeySettings = () => {
    const [openAIKey, setOpenAIKey] = useState('')
    const [hfKey, setHfKey] = useState('')
    const [openAISaved, setOpenAISaved] = useState(false)
    const [hfSaved, setHfSaved] = useState(false)
    const [originalOpenAI, setOriginalOpenAI] = useState('')
    const [originalHF, setOriginalHF] = useState('')

    useEffect(() => {
        const savedOpenAI = localStorage.getItem('OPENAI_KEY') || ''
        const savedHF = localStorage.getItem('HF_KEY') || ''
        setOpenAIKey(savedOpenAI)
        setHfKey(savedHF)
        setOriginalOpenAI(savedOpenAI)
        setOriginalHF(savedHF)
    }, [])

    const handleSave = (type: 'openai' | 'hf', value: string) => {
        try {
            if (type === 'openai') {
                localStorage.setItem('OPENAI_KEY', value)
                setOriginalOpenAI(value)
                setOpenAISaved(true)
                setTimeout(() => setOpenAISaved(false), 2000)
            } else {
                localStorage.setItem('HF_KEY', value)
                setOriginalHF(value)
                setHfSaved(true)
                setTimeout(() => setHfSaved(false), 2000)
            }
        } catch (error) {
            console.error('Failed to save key:', error)
        }
    }

    const getKeyStatus = (current: string, original: string) => {
        if (!current && !original) return 'empty'
        if (current !== original) return 'unsaved'
        if (current.startsWith('sk-') || current.startsWith('hf_')) return 'valid'
        return 'invalid'
    }

    const openAIStatus = getKeyStatus(openAIKey, originalOpenAI)
    const hfStatus = getKeyStatus(hfKey, originalHF)

    return (
        <div className="sm:col-span-2 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 mb-8">
            {/* Security Disclaimer */}
            <div className="bg-rose-900/20 p-4 rounded-lg mb-6 border border-rose-800/50">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <p className="text-sm text-rose-300">
                            API keys are stored in browser storage only. Clear them when using shared devices.
                        </p>
                        <button
                            onClick={() => {
                                localStorage.clear()
                                setOpenAIKey('')
                                setHfKey('')
                            }}
                            className="cursor-pointer text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                            Clear All Keys
                        </button>
                    </div>
                </div>
            </div>

            {/* API Key Inputs */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-300">
                            OpenAI API Key
                        </label>
                        <span className="text-xs text-neutral-500">
                            {openAIStatus === 'valid' && 'Valid format'}
                            {openAIStatus === 'invalid' && 'Invalid key format'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 relative">
                        <input
                            type="password"
                            value={openAIKey}
                            onChange={(e) => setOpenAIKey(e.target.value.trim())}
                            placeholder="sk-...xxxx"
                            className={`outline-none transition-all flex-1 bg-neutral-900/30 border rounded-lg px-4 py-2 text-sm placeholder-neutral-600 ${openAIStatus === 'invalid'
                                    ? 'border-rose-500/50 focus:border-rose-500'
                                    : 'border-neutral-800 focus:border-emerald-500/50'
                                }`}
                        />
                        <button
                            onClick={() => handleSave('openai', openAIKey)}
                            disabled={openAIStatus !== 'unsaved'}
                            className={`px-4 py-2 border rounded-lg text-sm transition-all ${openAIStatus === 'unsaved'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                                    : 'bg-neutral-900/10 border-neutral-800/50 text-neutral-600 cursor-not-allowed'
                                }`}
                        >
                            {openAISaved ? (
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

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-300">
                            HuggingFace API Key
                        </label>
                        <span className="text-xs text-neutral-500">
                            {hfStatus === 'valid' && 'Valid format'}
                            {hfStatus === 'invalid' && 'Invalid key format'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 relative">
                        <input
                            type="password"
                            value={hfKey}
                            onChange={(e) => setHfKey(e.target.value.trim())}
                            placeholder="hf_...xxxx"
                            className={`outline-none transition-all flex-1 bg-neutral-900/30 border rounded-lg px-4 py-2 text-sm placeholder-neutral-600 ${hfStatus === 'invalid'
                                    ? 'border-rose-500/50 focus:border-rose-500'
                                    : 'border-neutral-800 focus:border-emerald-500/50'
                                }`}
                        />
                        <button
                            onClick={() => handleSave('hf', hfKey)}
                            disabled={hfStatus !== 'unsaved'}
                            className={`px-4 py-2 border rounded-lg text-sm transition-all ${hfStatus === 'unsaved'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                                    : 'bg-neutral-900/10 border-neutral-800/50 text-neutral-600 cursor-not-allowed'
                                }`}
                        >
                            {hfSaved ? (
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
            </div>
        </div>
    )
}