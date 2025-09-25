import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Pokemon, PokemonListResponse } from '../types/pokemon';


const API_BASE = 'https://pokeapi.co/api/v2' // 포켓몬 API 기본 URL

// 커스텀 에러 타입
interface ApiError extends Error {
  status?: number
}

// API 에러 생성 함수
const createApiError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError
  error.status = status
  return error
}

// 무한 스크롤용 포켓몬 목록 훅
export const usePokemonInfiniteList = () => {
  return useInfiniteQuery({
    queryKey: ['pokemon-infinite-list'], // 쿼리 키
    queryFn: async ({ pageParam = 0 }): Promise<PokemonListResponse> => {
      try {
        const response = await fetch(`${API_BASE}/pokemon?limit=20&offset=${pageParam}`)
        if (!response.ok) {
          throw createApiError('포켓몬 목록 조회 실패함', response.status)
        }
        const data = (await response.json()) as PokemonListResponse
        return data
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
        throw createApiError('알 수 없는 오류 발생함')
      }
    },
    getNextPageParam: (_lastPage, allPages) => {
      const totalLoaded = allPages.length * 20 // 로드된 총 개수
      return totalLoaded < 1302 ? totalLoaded : undefined // 1302개 제한 (PokeAPI 전체 포켓몬 수)
    },
    initialPageParam: 0, // 초기 페이지 파라미터
  })
}

// 개별 포켓몬 정보 조회 훅
export const usePokemon = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ['pokemon', nameOrId], // 쿼리 키
    queryFn: async (): Promise<Pokemon> => {
      try {
        // API 호출
        const response = await fetch(`${API_BASE}/pokemon/${nameOrId}`)
        if (!response.ok) {
          throw createApiError(`포켓몬 조회 실패함: ${nameOrId}`, response.status)
        }
        const data = await response.json() as Pokemon
        return data
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
        throw createApiError(`알 수 없는 오류 발생함: ${nameOrId}`)
      }
    },
    enabled: !!nameOrId, // nameOrId가 있을 때만 실행
  })
}
