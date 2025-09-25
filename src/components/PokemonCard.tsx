import { usePokemon } from '../hooks/usePokemon'

// 포켓몬 카드 props 타입
interface PokemonCardProps {
  name: string // 포켓몬 이름
  onClick: () => void // 클릭 핸들러
}

// 포켓몬 카드 컴포넌트
export const PokemonCard = ({ name, onClick }: PokemonCardProps) => {
  const { data: pokemon, isLoading } = usePokemon(name) // 포켓몬 데이터 가져옴

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

  // 타입별 색상 매핑
  const typeColors: Record<string, string> = {
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
  }

  // 이미지 URL 우선순위 정함
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default
  const fallbackImage = '/images/pokemon-placeholder.png' // 대체 이미지

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* 포켓몬 이미지 */}
      <img
        src={imageUrl ?? fallbackImage}
        alt={pokemon.name}
        className="w-24 h-24 mx-auto mb-2"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackImage // 이미지 로드 실패 시 대체 이미지 사용
        }}
      />
      {/* 포켓몬 이름 */}
      <h3 className="text-lg font-semibold text-center capitalize mb-2">{pokemon.name}</h3>
      {/* 포켓몬 타입들 */}
      <div className="flex justify-center gap-1">
        {pokemon.types.map((type) => (
          <span
            key={type.type.name}
            className={`px-2 py-1 rounded-full text-xs text-white ${
              typeColors[type.type.name] ?? 'bg-gray-400'
            }`}
          >
            {type.type.name}
          </span>
        ))}
      </div>
    </div>
  )
}
