import type { ReactNode } from 'react'
import { SearchBar } from '../components/SearchBar'

interface MainLayoutProps {
  children: ReactNode
  searchTerm?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
}

export default function MainLayout({
  children,
  searchTerm = '',
  onSearchChange,
  showSearch = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              포켓몬 도감
            </h1>
            {showSearch && onSearchChange && (
              <div className="flex-1 max-w-md ml-8">
                <SearchBar
                  value={searchTerm}
                  onChange={onSearchChange}
                  placeholder="포켓몬 이름을 검색하세요..."
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
