'use client'

import { FC, useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import ReactDOM from 'react-dom'
import { SearchHeaderProps } from '@/types/types'

export const SearchHeader: FC<SearchHeaderProps> = ({
  query,
  loading,
  setQuery,
  analyzeSentiment
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchFocused])

  return (
    <>
      <div className="relative w-full">
        <div
          onClick={() => setIsSearchFocused(true)}
          className="flex items-center w-full px-6 py-4 rounded-xl bg-neutral-900/70 border border-neutral-700 hover:border-neutral-700/50 transition-all cursor-text shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)]"
        >
          <Search className="w-5 h-5 text-neutral-600 mr-4" />
          <span className="text-neutral-500 text-sm font-light">
            {query || 'Search communities...'}
          </span>
        </div>

        <button
          onClick={() => analyzeSentiment()}
          disabled={loading}
          className="text-sm cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 
                    bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-emerald-600/20 
                    hover:from-emerald-400/30 hover:via-emerald-500/20 hover:to-emerald-600/30 
                    border border-emerald-500/30 hover:border-emerald-400/50
                    text-neutral-100 rounded-lg font-medium gap-2 
                    shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]
                    transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity 
                          bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.3)_0%,transparent_60%)] 
                          animate-sparkle-pulse" 
          />

          <div className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                  Analyzing
                </span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-200 bg-clip-text text-transparent 
                             group-hover:from-emerald-200 group-hover:to-emerald-100 transition-all">
                Evaluate
              </span>
            )}
          </div>
        </button>
      </div>

      {isSearchFocused && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-50 backdrop-blur-sm bg-neutral-950/50"
          onClick={() => setIsSearchFocused(false)}
        >
          <div className="container max-w-2xl mx-auto pt-24">
            <div
              className="relative bg-neutral-900/95 border border-neutral-800/50 rounded-xl shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-4">
                <Search className="w-5 h-5 text-neutral-600 mr-4" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      analyzeSentiment();
                      setIsSearchFocused(false);
                    }
                  }}
                  className="flex-1 bg-transparent py-4 text-neutral-300 placeholder-neutral-600 outline-none text-sm font-light"
                  placeholder="Search communities..."
                  autoComplete="off"
                />

                <button
                  onClick={() => setIsSearchFocused(false)}
                  className="ml-4 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  ESC
                </button>
              </div>

              <div className="border-t border-neutral-800/50 mt-2 pt-2">
                <div className="text-xs text-neutral-500 px-4 py-2">
                  Recent searches
                </div>
                {['Minecraft', 'Gaming', 'Technology'].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setQuery(item)
                      analyzeSentiment(item)
                      setIsSearchFocused(false)
                    }}
                    className="flex items-center px-4 py-3 hover:bg-neutral-800/50 cursor-pointer transition-colors"
                  >
                    <Search className="w-4 h-4 text-neutral-600 mr-3" />
                    <span className="text-neutral-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

