import { useQueries } from '@tanstack/react-query'
import { getKoreanName } from '../lib/translations'
import type { PokemonListItem, PokemonSpecies } from '../types/pokemon'

const API_BASE = 'https://pokeapi.co/api/v2'

// 한국어 이름이 포함된 포켓몬 아이템 타입
export interface PokemonWithKorean extends PokemonListItem {
  koreanName?: string
}

// 포켓몬 목록에 한국어 이름 추가하는 훅
export const usePokemonWithKorean = (pokemonList: PokemonListItem[]) => {
  const queries = useQueries({
    queries: pokemonList.map((pokemon) => ({
      queryKey: ['pokemon-species', pokemon.name],
      queryFn: async (): Promise<PokemonSpecies> => {
        const response = await fetch(
          `${API_BASE}/pokemon-species/${pokemon.name}`
        )
        if (!response.ok) throw new Error('Species fetch failed')
        return response.json()
      },
      staleTime: 1000 * 60 * 60, // 1시간 캐시
    })),
  })

  // 한국어 이름이 추가된 포켓몬 목록 반환
  const pokemonWithKorean: PokemonWithKorean[] = pokemonList.map(
    (pokemon, index) => {
      const speciesData = queries[index]?.data
      const koreanName = speciesData
        ? getKoreanName(speciesData.names) || undefined
        : undefined

      return {
        ...pokemon,
        koreanName,
      }
    }
  )

  const isLoading = queries.some((query) => query.isLoading)

  return { pokemonWithKorean, isLoading }
}
