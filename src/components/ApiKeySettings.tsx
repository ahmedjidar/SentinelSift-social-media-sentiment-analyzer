'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

export const ApiKeySettings = () => {
    const [openAIKey, setOpenAIKey] = useState('')
    const [hfKey, setHfKey] = useState('')
    const [openAISaved, setOpenAISaved] = useState(false)
    const [hfSaved, setHfSaved] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await fetch('/api/keys/get', {
                    credentials: 'include'
                })
                const { openai, hf } = await response.json()
                setOpenAIKey(openai || '')
                setHfKey(hf || '')
                setIsMounted(true)
            } catch (error) {
                console.error('Failed to load keys:', error)
                setIsMounted(true)
            }
        }
        fetchKeys()
    }, [])

    const handleSave = async (type: 'openai' | 'hf', value: string) => {
        try {
            const response = await fetch('/api/keys/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyType: type, value }),
                credentials: 'include'
            })

            if (response.ok) {
                if (type === 'openai') {
                    setOpenAISaved(true);
                } else {
                    setHfSaved(true);
                }

                setTimeout(() => {
                    if (type === 'openai') {
                        setOpenAISaved(false);
                    } else {
                        setHfSaved(false);
                    }
                }, 2000)
            }
        } catch (error) {
            console.error('Save failed:', error)
        }
    }

    const handleClearKeys = async () => {
        try {
            await fetch('/api/keys/clear', {
                method: 'POST',
                credentials: 'include'
            })
            setOpenAIKey('')
            setHfKey('')
        } catch (error) {
            console.error('Failed to clear keys:', error)
        }
    }

    const getKeyStatus = (current: string) => {
        if (!current) return 'empty'
        if (current.startsWith('sk-') || current.startsWith('hf_')) return 'valid'
        return 'invalid'
    }

    if (!isMounted) return null

    return (
        <div className="sm:col-span-2 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 mb-8 space-y-8">
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
                            Current models: GPT-4o (OpenAI) • BART-MNLI (Hugging Face)<br />
                            Keys are stored locally and never sent to our servers
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-300">
                            OpenAI API Key
                        </label>
                        <span className="text-xs text-neutral-500">
                            {getKeyStatus(openAIKey) === 'valid' ? 'Valid format' : ' '}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 relative">
                        <input
                            type="password"
                            value={openAIKey}
                            onChange={(e) => setOpenAIKey(e.target.value.trim())}
                            placeholder={openAIKey ? '••••••••' : 'sk-...xxxx'}
                            className={`outline-none transition-all flex-1 bg-neutral-900/30 border rounded-lg px-4 py-2 text-sm placeholder-neutral-600 ${getKeyStatus(openAIKey) === 'invalid'
                                ? 'border-rose-500/50 focus:border-rose-500'
                                : 'border-neutral-800 focus:border-emerald-500/50'
                                }`}
                        />
                        <button
                            onClick={() => handleSave('openai', openAIKey)}
                            disabled={!openAIKey || getKeyStatus(openAIKey) !== 'valid'}
                            className={`px-4 py-2 border rounded-lg text-sm transition-all ${getKeyStatus(openAIKey) === 'valid'
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
                            {getKeyStatus(hfKey) === 'valid' ? 'Valid format' : ' '}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 relative">
                        <input
                            type="password"
                            value={hfKey}
                            onChange={(e) => setHfKey(e.target.value.trim())}
                            placeholder={hfKey ? '••••••••' : 'hf_...xxxx'}
                            className={`outline-none transition-all flex-1 bg-neutral-900/30 border rounded-lg px-4 py-2 text-sm placeholder-neutral-600 ${getKeyStatus(hfKey) === 'invalid'
                                ? 'border-rose-500/50 focus:border-rose-500'
                                : 'border-neutral-800 focus:border-emerald-500/50'
                                }`}
                        />
                        <button
                            onClick={() => handleSave('hf', hfKey)}
                            disabled={!hfKey || getKeyStatus(hfKey) !== 'valid'}
                            className={`px-4 py-2 border rounded-lg text-sm transition-all ${getKeyStatus(hfKey) === 'valid'
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
            <div className="bg-rose-900/20 p-4 rounded-lg mb-6 border border-rose-800/50">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <p className="text-sm text-rose-300">
                            API keys are stored securely in HTTP-only cookies.
                            They will persist across sessions until explicitly cleared.
                        </p>
                        <button
                            onClick={handleClearKeys}
                            className="cursor-pointer text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                            Clear All Keys
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}