'use client'

import { CyberAlert } from './CyberAlert'

export const ErrorHandler = ({
    errors,
    clearError,
    }: {
    errors: { type: "validation" | "save" | "clear" | "load"; message: string }[]
    clearError: (index: number) => void
}) => {
  return (
    <>
      {errors.map((error, index) => (
        <CyberAlert
          key={index}
          type={error.type === 'validation' || error.type === 'save' ? 'error' : 'warning'}
          title={error.type.toUpperCase()}
          message={error.message}
          duration={5000}
          onClose={() => clearError(index)}
        />
      ))}
    </>
  )
}