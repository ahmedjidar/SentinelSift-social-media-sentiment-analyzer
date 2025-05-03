'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { CyberAlert } from '../alerts/CyberAlert'

export const SecurityBanner = ({ onClear }: { onClear: () => void }) => {
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')

  const handleClear = async () => {
    try {
      await onClear()
      setAlertType('success')
      setShowAlert(true)
    } catch (error) {
      console.error('Error clearing keys:', error)
      setAlertType('error')
      setShowAlert(true)
    }
  }

  return (
    <div className="bg-amber-900/20 p-4 rounded-lg mb-6 border border-amber-800/50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-amber-400">
            API keys are stored securely in HTTP-only cookies.
            They will persist across sessions until explicitly cleared.
          </p>
          <button
            onClick={handleClear}
            className="cursor-pointer text-xs text-amber-500 bg-amber-950/50 hover:text-rose-300 transition-colors px-2 py-1 rounded-sm border border-amber-500/20 hover:border-amber-500/50"
          >
            Clear All Keys
          </button>
        </div>
      </div>

      {showAlert && (
        <CyberAlert
          type={alertType}
          title={alertType === 'success' ? 'Keys Cleared' : 'Clear Failed'}
          message={
            alertType === 'success'
              ? 'All API credentials were successfully removed'
              : 'Failed to clear stored keys - please try again'
          }
          duration={4000}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  )
}