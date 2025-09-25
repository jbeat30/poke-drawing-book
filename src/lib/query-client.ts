import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분간 데이터를 최신으로 간주
      gcTime: 1000 * 60 * 10, // 10분간 메모리에 캐시 보관
    },
  },
})
