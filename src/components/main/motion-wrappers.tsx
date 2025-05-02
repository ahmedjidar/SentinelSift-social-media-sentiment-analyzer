'use client'

import { motion } from 'framer-motion'
import { ApiKeySettings } from './ApiKeySettings'
import { AppIdentityCard } from './SourceInfo'
import { InferenceEngineStatus } from './InferenceEngineStatus'
import { UseApiKeysProps, ValidationStatusProps } from '@/types/types'

export const mainVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
}

export const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

export const MotionApiKeySettings = ({
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
}: UseApiKeysProps) => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="sm:col-span-2"
    >
        <ApiKeySettings 
            openAIKey={openAIKey}
            setOpenAIKey={setOpenAIKey}
            hfKey={hfKey}
            setHfKey={setHfKey}
            openAISaved={openAISaved}
            hfSaved={hfSaved}
            isMounted={isMounted}
            handleSave={handleSave}
            handleClearKeys={handleClearKeys}
            getKeyStatus={getKeyStatus}
        />
    </motion.div>
)

export const MotionAppIdentityCard = ({
    status
}: ValidationStatusProps) => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      className="sm:col-span-2"
    >
      <AppIdentityCard />
      <InferenceEngineStatus status={status} />
    </motion.div>
  )