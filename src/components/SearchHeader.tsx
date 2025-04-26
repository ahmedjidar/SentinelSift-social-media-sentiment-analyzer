'use client'
import { FC, useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactDOM from 'react-dom'

interface SearchHeaderProps {
  query: string
  loading: boolean
  setQuery: (value: string) => void
  analyzeSentiment: () => void
}

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
      {/* Trigger Button */}
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

        <Button
          onClick={analyzeSentiment}
          disabled={loading}
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-neutral-200 hover:bg-white text-neutral-950 hover:text-neutral-800 rounded-lg font-medium gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing</span>
            </>
          ) : (
            'Evaluate'
          )}
        </Button>
      </div>

      {/* Search Modal */}
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

              {/* Suggestions Dropdown */}
              <div className="border-t border-neutral-800/50 mt-2 pt-2">
                <div className="text-xs text-neutral-500 px-4 py-2">
                  Recent searches
                </div>
                {['Minecraft', 'Gaming', 'Technology'].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      analyzeSentiment();
                      setIsSearchFocused(false);
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