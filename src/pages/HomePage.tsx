import { useState, useMemo } from 'react'
import { usePokemonInfiniteList } from '../hooks/usePokemon'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { PokemonCard } from '../components/PokemonCard'
import { SearchBar } from '../components/SearchBar'
import { PokemonModal } from '../components/PokemonModal'

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('') // 검색어 상태
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null) // 선택된 포켓몬 상태
  
  // 무한 스크롤 데이터 가져옴
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePokemonInfiniteList()

  // Promise 반환 함수 래핑
  const handleFetchNextPage = () => {
    void fetchNextPage()
  }

  // 무한 스크롤 훅
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage: handleFetchNextPage,
  })

  // 모든 페이지의 포켓몬 데이터 합침
  const allPokemon = useMemo(() => {
    return data?.pages.flatMap(page => page.results) || []
  }, [data])

  // 검색어로 필터링
  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return allPokemon
    
    return allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allPokemon, searchTerm])

  // 초기 로딩 중일 때 스켈레톤 UI 보여줌
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8">포켓몬 도감</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 제목 */}
        <h1 className="text-4xl font-bold text-white text-center mb-8">포켓몬 도감</h1>
        
        {/* 검색바 */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="포켓몬 이름을 검색하세요..."
        />

        {/* 포켓몬 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              onClick={() => setSelectedPokemon(pokemon.name)}
            />
          ))}
        </div>

        {/* 검색 결과 없을 때 메시지 */}
        {filteredPokemon.length === 0 && searchTerm && (
          <div className="text-center text-white mt-8">
            <p className="text-xl">"{searchTerm}"에 해당하는 포켓몬을 찾을 수 없습니다.</p>
          </div>
        )}

        {/* 무한 스크롤 트리거 요소 */}
        {!searchTerm && (
          <div ref={loadMoreRef} className="flex justify-center mt-8">
            {isFetchingNextPage && (
              <div className="text-white text-lg">더 많은 포켓몬을 불러오는 중...</div>
            )}
          </div>
        )}

        {/* 포켓몬 상세 모달 */}
        <PokemonModal
          pokemonName={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      </div>
    </div>
  )
}
