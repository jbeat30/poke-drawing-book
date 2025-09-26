// 검색바 props 타입
interface SearchBarProps {
  value: string // 현재 검색어
  onChange: (value: string) => void // 검색어 변경 핸들러
  placeholder?: string // 플레이스홀더 텍스트
}

// 검색바 컴포넌트
export const SearchBar = ({
  value,
  onChange,
  placeholder = '포켓몬 이름을 검색하세요...',
}: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      {/* 검색 입력 필드 */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      {/* 검색 아이콘 */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  )
}
