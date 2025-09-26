import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { PokemonCard } from '../components/PokemonCard'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { usePokemonInfiniteList } from '../hooks/usePokemon'
import MainLayout from '../layout/MainLayout'
import { useAppStore } from '../lib/store'

export const HomePage = () => {
  const navigate = useNavigate()

  const { searchTerm, scrollPosition, setSearchTerm, setScrollPosition } =
    useAppStore(
      useShallow((state) => ({
        searchTerm: state.searchTerm,
        scrollPosition: state.scrollPosition,
        setSearchTerm: state.setSearchTerm,
        setScrollPosition: state.setScrollPosition,
      }))
    )

  // 무한 스크롤 데이터 가져옴
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePokemonInfiniteList()

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
    return data?.pages.flatMap((page) => page.results) || []
  }, [data])

  // 검색어로 필터링
  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return allPokemon

    return allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allPokemon, searchTerm])

  // 포켓몬 클릭 핸들러
  const handlePokemonClick = (name: string) => {
    // 현재 스크롤 위치 저장
    setScrollPosition(window.scrollY)
    // 상세 페이지로 이동
    navigate(`/pokemon/${name}`)
  }

  // 컴포넌트 마운트 시 스크롤 위치 복원
  useEffect(() => {
    if (scrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo(0, scrollPosition)
      }, 100)
    }
  }, [scrollPosition])

  // 초기 로딩 중일 때 스켈레톤 UI 보여줌
  if (isLoading) {
    return (
      <MainLayout showSearch={false}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="w-24 h-24 bg-white/20 rounded mx-auto mb-2"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      {/* 포켓몬 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            onClick={() => handlePokemonClick(pokemon.name)}
          />
        ))}
      </div>

      {/* 검색 결과 없을 때 메시지 */}
      {filteredPokemon.length === 0 && searchTerm && (
        <div className="text-center text-white mt-8">
          <p className="text-xl">
            "{searchTerm}"에 해당하는 포켓몬을 찾을 수 없습니다.
          </p>
        </div>
      )}

      {/* 무한 스크롤 트리거 요소 */}
      {!searchTerm && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          {isFetchingNextPage && (
            <div className="text-white text-lg">
              더 많은 포켓몬을 불러오는 중...
            </div>
          )}
        </div>
      )}
    </MainLayout>
  )
}
