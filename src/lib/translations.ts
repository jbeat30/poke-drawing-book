// 포켓몬 타입 한국어 번역
export const typeTranslations: Record<string, string> = {
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
}

// 능력치 한국어 번역
export const statTranslations: Record<string, string> = {
  hp: 'HP',
  attack: '공격',
  defense: '방어',
  'special-attack': '특수공격',
  'special-defense': '특수방어',
  speed: '스피드',
}

// 세대 한국어 번역
export const generationTranslations: Record<string, string> = {
  'generation-i': '1세대',
  'generation-ii': '2세대',
  'generation-iii': '3세대',
  'generation-iv': '4세대',
  'generation-v': '5세대',
  'generation-vi': '6세대',
  'generation-vii': '7세대',
  'generation-viii': '8세대',
  'generation-ix': '9세대',
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
