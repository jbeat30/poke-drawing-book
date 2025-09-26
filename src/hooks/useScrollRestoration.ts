import { useCallback } from 'react'
import { useAppStore } from '../lib/store'

// 스크롤 복원 커스텀 훅
export const useScrollRestoration = () => {
  const { scrollPosition, setScrollPosition } = useAppStore()

  // 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    setScrollPosition(window.scrollY)
  }, [setScrollPosition])

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    if (scrollPosition > 0) {
      // DOM 렌더링 완료 후 스크롤 복원
      const restore = () => {
        try {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'instant'
          })
        } catch {
          // 구형 브라우저 호환성
          window.scrollTo(0, scrollPosition)
        }
      }

      // 다음 프레임에서 실행
      requestAnimationFrame(() => {
        requestAnimationFrame(restore)
      })
    }
  }, [scrollPosition])

  // 스크롤 위치 초기화
  const clearScrollPosition = useCallback(() => {
    setScrollPosition(0)
  }, [setScrollPosition])

  // 페이지 최상단으로 이동
  const scrollToTop = useCallback(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [])

  return {
    scrollPosition,
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    scrollToTop,
  }
}
