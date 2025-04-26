'use client'
import { FC } from 'react'
import html2canvas from 'html2canvas'

interface ExportReportButtonProps {
  elementId: string
}

export const ExportReportButton: FC<ExportReportButtonProps> = ({ elementId }) => {
  const captureScreenshot = () => {
    const chart = document.getElementById(elementId)
    if (chart) {
      html2canvas(chart).then(canvas => {
        const link = document.createElement('a')
        link.download = 'sentiment-analysis.png'
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  return (
    <button
      onClick={captureScreenshot}
      className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
    >
      Export Report
    </button>
  )
}