import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertProps } from '@/types/types'

export const CyberAlert = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}: AlertProps) => {
  const typeConfig = {
    success: {
      icon: CheckCircle2,
      gradient: 'from-emerald-400 to-emerald-600',
      border: 'border-emerald-500/30'
    },
    error: {
      icon: AlertCircle,
      gradient: 'from-rose-400 to-rose-600',
      border: 'border-rose-500/30'
    },
    warning: {
      icon: AlertTriangle,
      gradient: 'from-amber-400 to-amber-600',
      border: 'border-amber-500/30'
    },
    info: {
      icon: Info,
      gradient: 'from-purple-400 to-purple-600',
      border: 'border-purple-500/30'
    }
  }

  const { icon: Icon, gradient, border } = typeConfig[type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className={`fixed top-4 right-4 p-4 bg-neutral-900/90 backdrop-blur-lg rounded-xl border ${border} shadow-2xl z-50 min-w-[300px]`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}/20 to-${gradient.split('-')[0]}-500/5 border ${border}`}>
            <Icon className={`w-5 h-5 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-neutral-400">{message}</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800/50 overflow-hidden rounded-b-xl">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000 }}
            className={`h-full bg-gradient-to-r ${gradient}`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}