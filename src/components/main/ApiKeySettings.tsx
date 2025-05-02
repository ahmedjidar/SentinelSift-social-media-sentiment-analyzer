'use client'

import { InfoBanner } from '../api-keys/InfoBanner'
import { ApiKeyInput } from '../api-keys/ApiKeyInput'
import { SecurityBanner } from '../api-keys/SecurityBanner'
import { UseApiKeysProps } from '@/types/types'

export const ApiKeySettings = ({
    openAIKey,
    setOpenAIKey,
    hfKey,
    setHfKey,
    openAISaved,
    hfSaved,
    isMounted,
    handleSave,
    handleClearKeys,
    getKeyStatus
}: UseApiKeysProps) => {

    if (!isMounted) return null

    return (
        <div className="sm:col-span-2 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 mb-8 space-y-6">
            <InfoBanner />
            <div className='space-y-6'>
                <ApiKeyInput
                    type='openai'
                    value={openAIKey}
                    saved={openAISaved}
                    status={getKeyStatus('openai')}
                    onSave={(value: string) => handleSave('openai', value)}
                    setKey={(value: string) => setOpenAIKey(value)}
                />
                <ApiKeyInput
                    type='hf'
                    value={hfKey}
                    saved={hfSaved}
                    status={getKeyStatus('hf')}
                    onSave={(value: string) => handleSave('hf', value)}
                    setKey={(value: string) => setHfKey(value)}
                />
            </div>
            <SecurityBanner onClear={handleClearKeys} />
        </div>
    )
}
