import { useCallback, useEffect, useRef } from 'react'

// 무한 스크롤 훅 props 타입
interface UseInfiniteScrollProps {
  hasNextPage: boolean // 다음 페이지 존재 여부
  isFetchingNextPage: boolean // 다음 페이지 로딩 중인지 여부
  fetchNextPage: () => void // 다음 페이지 가져오는 함수
}

// 무한 스크롤 훅
export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null) // DOM 요소 직접 참조
  const loadMoreRef = useRef<HTMLDivElement | null>(null) // 스크롤 감지할 div 요소 참조

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries // 첫 번째 요소 추출
      // isIntersecting: 요소가 뷰포트에 보이는지 확인하는 Web API 속성
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    // IntersectionObserver: 요소가 뷰포트에 들어오는지 감지하는 Web API
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1, // threshold: 요소의 10%가 보일 때 콜백 실행
    })

    observerRef.current.observe(element) // 요소 관찰 시작

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect() // 관찰 중단
      }
    }
  }, [handleObserver])

  return { loadMoreRef }
}
