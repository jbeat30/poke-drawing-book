# 무한 스크롤 구현 가이드

무한 스크롤은 **두 가지 기술의 조합**으로 구현됩니다:
1. **React Query의 useInfiniteQuery** - 데이터 관리
2. **Intersection Observer** - 화면 감지

## 1부: 데이터 관리 (useInfiniteQuery)

### 역할
- 여러 페이지 데이터를 하나로 관리
- 자동 캐싱 및 중복 요청 방지
- 로딩/에러 상태 관리

### 구현

```typescript
// src/hooks/usePokemon.ts
export const usePokemonInfiniteList = () => {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite-list'],
    queryFn: async ({ pageParam = 0 }): Promise<PokemonListResponse> => {
      const response = await fetch(`${API_BASE}/pokemon?limit=20&offset=${pageParam}`)
      const data = await response.json() as PokemonListResponse
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * 20 // 로드된 총 개수
      return totalLoaded < 1302 ? totalLoaded : undefined // 1302개 제한 (PokeAPI 전체 포켓몬 수)
    },
    initialPageParam: 0,
  })
}
```

**1302 제한 이유**: PokeAPI에는 총 1302개의 포켓몬이 있음 -> 이 숫자를 넘으면 더 이상 데이터가 없으므로 `undefined` 반환해서 요청 중단.

### 반환되는 데이터 구조

```typescript
{
  pages: [
    { results: [포켓몬1-20] },   // 첫 페이지
    { results: [포켓몬21-40] },  // 둘째 페이지
  ],
  pageParams: [0, 20]           // 각 페이지 offset
}
```

## 2부: 화면 감지 (Intersection Observer)

### 역할
- 특정 요소가 화면에 나타나는지 감지
- 화면에 나타나면 다음 페이지 요청 트리거

### 구현

```typescript
// src/hooks/useInfiniteScroll.ts
export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1, // 10% 보일 때 트리거
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  return { loadMoreRef }
}
```

## 3부: 두 기술 연결하기

### 컴포넌트에서 조합

```typescript
// src/pages/HomePage.tsx
export const HomePage = () => {
  // 1부: 데이터 관리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePokemonInfiniteList()

  // Promise 처리
  const handleFetchNextPage = () => {
    void fetchNextPage()
  }

  // 2부: 화면 감지
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage: handleFetchNextPage,
  })

  // 모든 페이지 데이터 합치기
  const allPokemon = useMemo(() => {
    return data?.pages.flatMap(page => page.results) || []
  }, [data])

  return (
    <div>
      {/* 포켓몬 카드들 */}
      {allPokemon.map((pokemon) => (
        <PokemonCard key={pokemon.name} name={pokemon.name} />
      ))}

      {/* 감지 요소 - 이 div가 화면에 보이면 다음 페이지 로드 */}
      {!searchTerm && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          {isFetchingNextPage && (
            <div className="text-white text-lg">더 많은 포켓몬을 불러오는 중...</div>
          )}
        </div>
      )}
    </div>
  )
}
```

## 동작 흐름

### 1단계: 초기 로드
- `usePokemonInfiniteList()` 호출
- 첫 페이지 (20개) 데이터 로드

### 2단계: 사용자 스크롤
- 사용자가 페이지 끝까지 스크롤
- `loadMoreRef` div가 화면에 나타남

### 3단계: 감지 및 요청
- Intersection Observer가 div 감지
- `fetchNextPage()` 자동 호출
- 다음 20개 데이터 로드

### 4단계: 데이터 병합
- 새 데이터가 `pages` 배열에 추가
- `flatMap`으로 하나의 배열로 합침
- 화면에 40개 포켓몬 표시

### 5단계: 반복
- 2-4단계 반복하며 계속 로드
- 1302개 도달하면 자동 중단

## 핵심 분리 포인트

| 기술 | 담당 역할 | 핵심 기능 |
|------|----------|----------|
| **useInfiniteQuery** | 데이터 관리 | 캐싱, 상태 관리, API 호출 |
| **Intersection Observer** | 화면 감지 | 스크롤 감지, 트리거 실행 |