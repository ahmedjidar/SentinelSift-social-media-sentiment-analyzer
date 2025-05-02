'use client'

import { useState, useEffect, useCallback } from 'react'

export const useApiKeys = () => {
  const [openAIKey, setOpenAIKey] = useState('')
  const [hfKey, setHfKey] = useState('')
  const [openAISaved, setOpenAISaved] = useState(false)
  const [hfSaved, setHfSaved] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [validationStatus, setValidationStatus] = useState<{
    openai: 'valid' | 'invalid' | 'loading' | 'empty';
    hf: 'valid' | 'invalid' | 'loading' | 'empty';
  }>({
    openai: 'empty',
    hf: 'empty'
  });

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch('/api/keys/get', { credentials: 'include' })
        const { openai, hf } = await response.json()

        setOpenAIKey(openai || '')
        setHfKey(hf || '')

        setValidationStatus(prev => ({
          ...prev,
          openai: openai ? 'valid' : 'empty',
          hf: hf ? 'valid' : 'empty'
        }))

      } catch (error) {
        console.error('Failed to load keys:', error)
      } finally {
        setIsMounted(true)
      }
    }
    fetchKeys()
  }, [])

  const validateKey = useCallback(async (service: "openai" | "hf", key: string) => {
    if (!key) return 'empty';

    try {
      setValidationStatus(prev => ({ ...prev, [service]: 'loading' }));

      const response = await fetch('/api/keys/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, key })
      });

      if (!response.ok) throw new Error('Validation request failed');

      const { valid } = await response.json();
      const status = valid ? 'valid' : 'invalid';

      setValidationStatus(prev => ({ ...prev, [service]: status }));
      return status;

    } catch (error) {
      console.error("Validation error:", error);
      setValidationStatus(prev => ({ ...prev, [service]: 'invalid' }));
      return 'invalid';
    }
  }, []);

  const handleSave = useCallback(async (type: 'openai' | 'hf', value: string) => {
    try {
      const status = await validateKey(type, value);

      if (status === 'valid') {
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
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }, [validateKey, setOpenAISaved, setHfSaved])

  const handleClearKeys = useCallback(async () => {
    try {
      await fetch('/api/keys/clear', { method: 'POST', credentials: 'include' })
      setOpenAIKey('')
      setHfKey('')
    } catch (error) {
      console.error('Failed to clear keys:', error)
    }
  }, [])

  const getKeyStatus = useCallback((service: "openai" | "hf") => {
    return validationStatus[service];
  }, [validationStatus]);

  return {
    openAIKey,
    setOpenAIKey,
    hfKey,
    setHfKey,
    openAISaved,
    hfSaved,
    validationStatus,
    validateKey,
    isMounted,
    handleSave,
    handleClearKeys,
    getKeyStatus
  }
}