import { usePokemon, usePokemonSpecies } from '../hooks/usePokemon'
import {
  getKoreanName,
  getTypeColor,
  getTypeTranslation,
} from '../lib/translations'

// 포켓몬 카드 props 타입
interface PokemonCardProps {
  name: string // 포켓몬 이름
  onClick: () => void // 클릭 핸들러
}

// 포켓몬 카드 컴포넌트
export const PokemonCard = ({ name, onClick }: PokemonCardProps) => {
  const { data: pokemon, isLoading } = usePokemon(name) // 포켓몬 데이터 가져옴
  const { data: species } = usePokemonSpecies(name) // 종족 데이터 가져옴

  // 한국어 이름 추출
  const koreanName = species ? getKoreanName(species.names) : null

  // 로딩 중일 때 스켈레톤 UI 보여줌
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
      </div>
    )
  }

  if (!pokemon) return null // 데이터 없으면 렌더링 안 함

  // 이미지 URL 우선순위 정함
  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default
  const fallbackImage = '/images/poke-placeholder.png' // 대체 이미지

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* 포켓몬 이미지 */}
      <img
        src={imageUrl ?? fallbackImage}
        alt={koreanName || pokemon.name}
        className="w-24 h-24 mx-auto mb-2"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackImage // 이미지 로드 실패 시 대체 이미지 사용
        }}
      />
      {/* 포켓몬 이름 */}
      <h3 className="text-lg font-semibold text-center mb-2">
        {koreanName || pokemon.name}
      </h3>
      {/* 포켓몬 타입들 */}
      <div className="flex justify-center gap-2 flex-wrap">
        {pokemon.types.map((type) => (
          <span
            key={type.type.name}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm select-none ${getTypeColor(type.type.name)}`}
            style={{
              fontKerning: 'none',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {getTypeTranslation(type.type.name)}
          </span>
        ))}
      </div>
    </div>
  )
}
