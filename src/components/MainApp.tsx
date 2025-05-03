'use client'

import { motion } from 'framer-motion'
import { ErrorMessage, SearchHeader } from "@/components/index"
import { EmptyState } from "@/components/main/EmptyState"
import { Filters } from "@/components/main/Filters"
import { LoadingOverlay } from "@/components/main/LoadingOverlay"
import { ResultsView } from "@/components/main/ResultsView"
import { useSentimentAnalysis } from "@/hooks/useSentimentAnalysis"
import { childVariants, mainVariants, MotionApiKeySettings, MotionAppIdentityCard } from "@/components/main/motion-wrappers"
import { useApiKeys } from '@/hooks/useApiKeys'
import { ErrorHandler } from './alerts/ErrorHandler'

export default function MainApp() {
  const {
    query,
    setQuery,
    results,
    loading,
    loadingProgress,
    error,
    timeFilter,
    setTimeFilter,
    limit,
    setLimit,
    analyzeSentiment,
    lineData } = useSentimentAnalysis()

  const {
    openAIKey,
    setOpenAIKey,
    hfKey,
    setHfKey,
    openAISaved,
    hfSaved,
    isMounted,
    handleSave,
    handleClearKeys,
    getKeyStatus,
    validationStatus,
    errors,
    clearError,
  } = useApiKeys()

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={mainVariants}
      className="main-container min-h-screen bg-neutral-950 text-neutral-100 p-8 sm:grid sm:grid-cols-8 gap-4"
    >
      <ErrorHandler 
        errors={errors}
        clearError={clearError}
      />

      <MotionApiKeySettings 
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

      <div className="sm:col-span-4 space-y-4">
        <motion.div variants={childVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SearchHeader
            query={query}
            loading={loading}
            setQuery={setQuery}
            analyzeSentiment={analyzeSentiment}
          />
        </motion.div>

        <motion.div variants={childVariants}>
          <Filters
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            limit={limit}
            setLimit={setLimit}
          />
        </motion.div>

        <motion.div variants={childVariants}>
          <ErrorMessage error={error} />
        </motion.div>

        {!results && !loading && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <EmptyState />
          </motion.div>
        )}

        <LoadingOverlay
          loading={loading}
          loadingProgress={loadingProgress}
        />

        {results && results.sentiment && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ResultsView
              results={results}
              lineData={lineData}
            />
          </motion.div>
        )}
      </div>

      <MotionAppIdentityCard status={validationStatus}/>
    </motion.main>
  )
}