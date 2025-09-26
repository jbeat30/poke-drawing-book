// 포켓몬 타입별 색상
export const TypeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
} as const

// 포켓몬 타입 한국어 번역
export const typeTranslations = {
  normal: '노말',
  fire: '불꽃',
  water: '물',
  electric: '전기',
  grass: '풀',
  ice: '얼음',
  fighting: '격투',
  poison: '독',
  ground: '땅',
  flying: '비행',
  psychic: '에스퍼',
  bug: '벌레',
  rock: '바위',
  ghost: '고스트',
  dragon: '드래곤',
  dark: '어둠',
  steel: '강철',
  fairy: '페어리',
} as const

// 능력치 한국어 번역
export const statTranslations = {
  hp: 'HP',
  attack: '공격',
  defense: '방어',
  'special-attack': '특수공격',
  'special-defense': '특수방어',
  speed: '스피드',
} as const

// 세대 한국어 번역
export const generationTranslations = {
  'generation-i': '1세대',
  'generation-ii': '2세대',
  'generation-iii': '3세대',
  'generation-iv': '4세대',
  'generation-v': '5세대',
  'generation-vi': '6세대',
  'generation-vii': '7세대',
  'generation-viii': '8세대',
  'generation-ix': '9세대',
} as const

// 타입 색상 가져오기 함수
export const getTypeColor = (typeName: string): string => {
  return TypeColors[typeName as keyof typeof TypeColors] || TypeColors.normal
}

// 타입 번역 가져오기 함수
export const getTypeTranslation = (typeName: string): string => {
  return typeTranslations[typeName as keyof typeof typeTranslations] || typeName
}

// 능력치 번역 가져오기 함수
export const getStatTranslation = (statName: string): string => {
  return statTranslations[statName as keyof typeof statTranslations] || statName
}

// 세대 번역 가져오기 함수
export const getGenerationTranslation = (generationName: string): string => {
  return (
    generationTranslations[
      generationName as keyof typeof generationTranslations
    ] || generationName
  )
}

// Species에서 한국어 이름 추출
export const getKoreanName = (
  names: Array<{ name: string; language: { name: string } }>
) => {
  const koreanName = names.find((name) => name.language.name === 'ko')
  return koreanName?.name || null
}

// Species에서 한국어 설명 추출
export const getKoreanDescription = (
  flavorTexts: Array<{
    flavor_text: string
    language: { name: string }
    version: { name: string }
  }>
) => {
  const koreanTexts = flavorTexts.filter((text) => text.language.name === 'ko')
  return koreanTexts.length > 0
    ? koreanTexts[0].flavor_text.replace(/\n/g, ' ')
    : null
}
