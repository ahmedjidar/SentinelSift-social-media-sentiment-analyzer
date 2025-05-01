import { useState, useEffect, useCallback } from 'react'

export const useApiKeys = () => {
  const [openAIKey, setOpenAIKey] = useState('')
  const [hfKey, setHfKey] = useState('')
  const [openAISaved, setOpenAISaved] = useState(false)
  const [hfSaved, setHfSaved] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch('/api/keys/get', { credentials: 'include' })
        const { openai, hf } = await response.json()
        setOpenAIKey(openai || '')
        setHfKey(hf || '')
      } catch (error) {
        console.error('Failed to load keys:', error)
      } finally {
        setIsMounted(true)
      }
    }
    fetchKeys()
  }, [])

  const handleSave = useCallback(async (type: 'openai' | 'hf', value: string) => {
    try {
      const response = await fetch('/api/keys/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyType: type, value }),
        credentials: 'include'
      })

      if (response.ok) {
        const setter = type === 'openai' ? setOpenAISaved : setHfSaved
        setter(true)
        setTimeout(() => setter(false), 2000)
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }, [])

  const handleClearKeys = useCallback(async () => {
    try {
      await fetch('/api/keys/clear', { method: 'POST', credentials: 'include' })
      setOpenAIKey('')
      setHfKey('')
    } catch (error) {
      console.error('Failed to clear keys:', error)
    }
  }, [])

  const getKeyStatus = useCallback((current: string) => {
    if (!current) return 'empty'
    if (current.startsWith('sk-') || current.startsWith('hf_')) return 'valid'
    return 'invalid'
  }, [])

  return {
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
  }
}