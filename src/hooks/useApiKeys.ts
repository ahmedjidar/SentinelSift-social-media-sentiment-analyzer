/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [errors, setErrors] = useState<{ 
    type: 'validation' | 'save' | 'clear' | 'load';
    message: string 
  }[]>([]);

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
        setErrors(prev => [...prev, {
          type: 'load',
          message: 'Failed to load saved keys'
        }]);
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
      setErrors(prev => [...prev, {
        type: 'validation',
        message: `Failed to validate ${service.toUpperCase()} key`
      }]);
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
      setErrors(prev => [...prev, {
        type: 'save',
        message: `Failed to save ${type.toUpperCase()} key`
      }]);
    }
  }, [validateKey, setOpenAISaved, setHfSaved])

  const handleClearKeys = useCallback(async () => {
    try {
      await fetch('/api/keys/clear', { method: 'POST', credentials: 'include' })
      setOpenAIKey('')
      setHfKey('')
    } catch (error) {
      setErrors(prev => [...prev, {
        type: 'clear',
        message: 'Failed to clear API keys'
      }]);
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
    getKeyStatus,
    errors,
    clearError: useCallback((index: number) => {
      setErrors(prev => prev.filter((_, i) => i !== index));
    }, [])
  }
}