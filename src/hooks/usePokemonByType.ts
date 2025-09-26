import { useInfiniteQuery } from '@tanstack/react-query'
import type { PokemonListItem, PokemonTypeResponse } from '../types/pokemon'

const API_BASE = 'https://pokeapi.co/api/v2'

// 타입별 포켓몬 무한 스크롤 조회 훅
export const usePokemonByTypeInfinite = (typeName: string) => {
  return useInfiniteQuery({
    queryKey: ['pokemon-by-type-infinite', typeName],
    queryFn: async ({
      pageParam = 0,
    }): Promise<{
      results: PokemonListItem[]
      hasMore: boolean
    }> => {
      if (!typeName) return { results: [], hasMore: false }

      const response = await fetch(`${API_BASE}/type/${typeName}`)
      if (!response.ok) throw new Error('Type fetch failed')

      const data: PokemonTypeResponse = await response.json()

      // 전체 포켓몬 목록에서 페이징 처리
      const allPokemon = data.pokemon.map(({ pokemon }) => ({
        name: pokemon.name,
        url: pokemon.url,
      }))

      const startIndex = pageParam
      const endIndex = startIndex + 30
      const results = allPokemon.slice(startIndex, endIndex)
      const hasMore = endIndex < allPokemon.length

      return { results, hasMore }
    },
    enabled: !!typeName,
    staleTime: 1000 * 60 * 60, // 1시간 캐시
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      return allPages.length * 30
    },
    initialPageParam: 0,
  })
}

// 사용 가능한 포켓몬 타입 목록
export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type PokemonType = (typeof POKEMON_TYPES)[number]
