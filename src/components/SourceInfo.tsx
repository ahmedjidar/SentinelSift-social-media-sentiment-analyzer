// components/AppIdentityCard.tsx
'use client'
import { Code, GitBranch, User } from 'lucide-react'

export const AppIdentityCard = () => (
  <div className="sm:col-span-2 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 space-y-5 mb-8">
    {/* App Name & Logo */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30">
        <span className="text-2xl bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
          🛡️
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
          SentinelSift
        </h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          Cognitive Community Analysis Suite
        </p>
      </div>
    </div>

    {/* Metadata Grid */}
    <div className="grid gap-3 text-sm">
      <div className="flex items-center gap-2 text-neutral-300">
        <Code className="w-4 h-4 text-emerald-500" />
        <span>v2.1.0</span>
        <span className="text-neutral-500">|</span>
        <span className="text-emerald-400/80">Production</span>
      </div>

      <div className="flex items-center gap-2 text-neutral-300">
        <User className="w-4 h-4 text-emerald-500" />
        <span>Oky Development Collective</span>
      </div>

      <a 
        href="https://github.com/yourusername/sentinelsift" 
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-neutral-300 hover:text-emerald-400 transition-colors"
      >
        <GitBranch className="w-4 h-4 text-emerald-500" />
        <span>github.com/okycodes/sentinelsift</span>
      </a>
    </div>

    {/* Description */}
    <p className="text-sm text-neutral-400 pt-4 border-t border-neutral-800/50">
      SentinelSift employs neuro-symbolic AI to analyze community sentiment patterns, 
      protecting digital ecosystems from cognitive dissonance through adaptive 
      anomaly detection. Licensed under Oky Open Sentiment Agreement v3.
    </p>

    {/* Tech Stack */}
    <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-800/50">
      {['Next.js', 'HuggingFace', 'Redis', 'OpenAI', 'Reddit API'].map((tech) => (
        <span 
          key={tech}
          className="px-2 py-1 text-xs bg-neutral-900/50 rounded-md border border-neutral-800 text-neutral-400"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
)