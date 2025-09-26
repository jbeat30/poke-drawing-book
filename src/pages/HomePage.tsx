import React, { memo, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { PokemonCard } from '../components/PokemonCard'
import { TypeFilter } from '../components/TypeFilter'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { usePokemonInfiniteList } from '../hooks/usePokemon'
import { usePokemonByTypeInfinite } from '../hooks/usePokemonByType'
import {
  usePokemonWithKorean,
  type PokemonWithKorean,
} from '../hooks/usePokemonWithKorean'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import MainLayout from '../layout/MainLayout'
import { useAppStore } from '../lib/store'

// 로딩 스켈레톤 컴포넌트
const LoadingSkeleton = memo(() => (
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
))

LoadingSkeleton.displayName = 'LoadingSkeleton'

// 포켓몬 목록 컴포넌트
const PokemonList = memo(
  ({
    pokemonList,
    onPokemonClick,
    searchTerm,
    selectedType,
    loadMoreRef,
    isFetchingNextPage,
    isLoading,
  }: {
    pokemonList: PokemonWithKorean[]
    onPokemonClick: (name: string) => void
    searchTerm: string
    selectedType: string
    loadMoreRef: React.RefObject<HTMLDivElement | null>
    isFetchingNextPage: boolean
    isLoading: boolean
  }) => {
    if (isLoading) {
      return <LoadingSkeleton />
    }

    return (
      <>
        {/* 포켓몬 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pokemonList.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              onClick={() => onPokemonClick(pokemon.name)}
            />
          ))}
        </div>

        {/* 검색 결과 없을 때 메시지 */}
        {pokemonList.length === 0 && (searchTerm || selectedType) && (
          <div className="text-center text-white mt-8">
            <p className="text-xl">
              {searchTerm
                ? `"${searchTerm}"에 해당하는 포켓몬을 찾을 수 없습니다.`
                : `선택한 타입에 해당하는 포켓몬을 찾을 수 없습니다.`}
            </p>
          </div>
        )}

        {/* 무한 스크롤 트리거 요소 (검색어가 없을 때만) */}
        {!searchTerm && (
          <div ref={loadMoreRef} className="flex justify-center mt-8">
            {isFetchingNextPage && (
              <div className="text-white text-lg">
                더 많은 포켓몬을 불러오는 중...
              </div>
            )}
          </div>
        )}
      </>
    )
  }
)

PokemonList.displayName = 'PokemonList'

export const HomePage = () => {
  const navigate = useNavigate()
  const { saveScrollPosition, restoreScrollPosition } = useScrollRestoration()

  const { searchTerm, selectedType, setSearchTerm, setSelectedType } =
    useAppStore(
      useShallow((state) => ({
        searchTerm: state.searchTerm,
        selectedType: state.selectedType,
        setSearchTerm: state.setSearchTerm,
        setSelectedType: state.setSelectedType,
      }))
    )

  // 전체 목록 무한 스크롤
  const {
    data: allData,
    fetchNextPage: fetchNextAll,
    hasNextPage: hasNextAll,
    isFetchingNextPage: isFetchingNextAll,
    isLoading: isLoadingAll,
  } = usePokemonInfiniteList()

  // 타입별 무한 스크롤
  const {
    data: typeData,
    fetchNextPage: fetchNextType,
    hasNextPage: hasNextType,
    isFetchingNextPage: isFetchingNextType,
    isLoading: isLoadingType,
  } = usePokemonByTypeInfinite(selectedType)

  // 현재 사용할 데이터와 함수들 결정
  const currentFetchNext = selectedType ? fetchNextType : fetchNextAll
  const currentHasNext = selectedType ? hasNextType : hasNextAll
  const currentIsFetching = selectedType
    ? isFetchingNextType
    : isFetchingNextAll
  const currentIsLoading = selectedType ? isLoadingType : isLoadingAll

  // Promise 반환 함수 래핑
  const handleFetchNextPage = () => {
    void currentFetchNext()
  }

  // 무한 스크롤 훅
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: currentHasNext,
    isFetchingNextPage: currentIsFetching,
    fetchNextPage: handleFetchNextPage,
  })

  // 현재 표시할 포켓몬 목록
  const currentPokemonList = useMemo(() => {
    if (selectedType) {
      return typeData?.pages.flatMap((page) => page.results) || []
    } else {
      return allData?.pages.flatMap((page) => page.results) || []
    }
  }, [selectedType, typeData, allData])

  // 한국어 이름 추가
  const { pokemonWithKorean } = usePokemonWithKorean(currentPokemonList)

  // 검색어로 필터링 (영어 + 한국어)
  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return pokemonWithKorean

    const lowerSearchTerm = searchTerm.toLowerCase()
    return pokemonWithKorean.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(lowerSearchTerm) ||
        (pokemon.koreanName && pokemon.koreanName.includes(searchTerm))
    )
  }, [pokemonWithKorean, searchTerm])

  // 타입 필터 변경 핸들러
  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setSearchTerm('') // 타입 변경 시 검색어 초기화
  }

  // 포켓몬 클릭 핸들러
  const handlePokemonClick = (name: string) => {
    saveScrollPosition()
    navigate(`/pokemon/${name}`)
  }

  // 컴포넌트 마운트 시 스크롤 위치 복원
  useEffect(() => {
    restoreScrollPosition()
  }, [restoreScrollPosition])

  return (
    <MainLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      {/* 타입 필터 */}
      <TypeFilter selectedType={selectedType} onTypeChange={handleTypeChange} />

      {/* 포켓몬 목록 */}
      <PokemonList
        pokemonList={filteredPokemon}
        onPokemonClick={handlePokemonClick}
        searchTerm={searchTerm}
        selectedType={selectedType}
        loadMoreRef={loadMoreRef}
        isFetchingNextPage={currentIsFetching}
        isLoading={currentIsLoading}
      />
    </MainLayout>
  )
}
