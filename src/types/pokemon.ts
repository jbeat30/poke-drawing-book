// 포켓몬 데이터 타입
export interface Pokemon {
  id: number // 포켓몬 ID
  name: string // 포켓몬 이름
  sprites: {
    front_default: string | null // 기본 이미지 URL
    other: {
      'official-artwork': {
        front_default: string | null
      }
    }
  }
  types: Array<{
    type: {
      name: string // 타입 이름 (불, 물, 풀 등)
    }
  }>
  height: number // 키
  weight: number // 몸무게
  base_experience: number | null // 기본 경험치
  stats: Array<{
    base_stat: number // 기본 능력치
    stat: {
      name: string // 능력치 이름
    }
  }>
  abilities: Array<{
    ability: {
      name: string // 특성 이름
    }
    is_hidden: boolean // 숨겨진 특성 여부
  }>
  moves: Array<{
    move: {
      name: string // 기술 이름
    }
  }>
}

// 포켓몬 목록 아이템 타입
export interface PokemonListItem {
  name: string // 포켓몬 이름
  url: string // API URL
}

// 포켓몬 목록 응답 타입
export interface PokemonListResponse {
  results: PokemonListItem[] // 포켓몬 목록
  count: number // 전체 개수
  next: string | null // 다음 페이지 URL
  previous: string | null // 이전 페이지 URL
}

// 포켓몬 종족 정보 타입
export interface PokemonSpecies {
  id: number
  name: string
  names: Array<{
    name: string
    language: {
      name: string
    }
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }>
  generation: {
    name: string
  }
  evolves_from_species: {
    name: string
  } | null
}

// 타입별 포켓몬 응답 타입
export interface PokemonTypeResponse {
  id: number
  name: string
  pokemon: Array<{
    pokemon: {
      name: string
      url: string
    }
    slot: number
  }>
}
