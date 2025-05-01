'use client'

import { motion } from 'framer-motion'
import { ApiKeySettings } from './ApiKeySettings'
import { AppIdentityCard } from './SourceInfo'

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

export const MotionApiKeySettings = () => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="sm:col-span-2"
    >
        <ApiKeySettings />
    </motion.div>
)

export const MotionAppIdentityCard = () => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        className="sm:col-span-2"
    >
        <AppIdentityCard />
    </motion.div>
)