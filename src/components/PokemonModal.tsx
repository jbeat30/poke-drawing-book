import { usePokemon } from '../hooks/usePokemon'

// 포켓몬 모달 props 타입
interface PokemonModalProps {
  pokemonName: string | null // 선택된 포켓몬 이름
  onClose: () => void // 모달 닫기 핸들러
}

// 포켓몬 상세 정보 모달 컴포넌트
export const PokemonModal = ({ pokemonName, onClose }: PokemonModalProps) => {
  const { data: pokemon, isLoading } = usePokemon(pokemonName ?? '') // 포켓몬 데이터 가져옴

  if (!pokemonName) return null // 선택된 포켓몬 없으면 렌더링 안 함

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

  // 배경 클릭 시 모달 닫기 핸들러
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold capitalize">{pokemonName}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              type="button"
            >
              ×
            </button>
          </div>

          {/* 로딩 중일 때 스켈레톤 UI */}
          {isLoading ? (
            <div className="animate-pulse">
              <div className="w-48 h-48 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : pokemon ? (
            <div>
              {/* 포켓몬 이미지 */}
              <img
                src={
                  pokemon.sprites.other['official-artwork'].front_default ??
                  pokemon.sprites.front_default ??
                  '/images/poke-placeholder.png'
                }
                alt={pokemon.name}
                className="w-48 h-48 mx-auto mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/poke-placeholder.png'
                }}
              />

              <div className="space-y-4">
                {/* 포켓몬 타입 정보 */}
                <div>
                  <h3 className="font-semibold mb-2">타입</h3>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-3 py-1 rounded-full text-white ${
                          typeColors[type.type.name] ?? 'bg-gray-400'
                        }`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">키</h3>
                    <p>{pokemon.height / 10}m</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">몸무게</h3>
                    <p>{pokemon.weight / 10}kg</p>
                  </div>
                </div>

                {/* 능력치 정보 */}
                <div>
                  <h3 className="font-semibold mb-2">능력치</h3>
                  <div className="space-y-2">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{stat.stat.name}</span>
                          <span>{stat.base_stat}</span>
                        </div>
                        {/* 능력치 바 */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(stat.base_stat / 2, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>포켓몬 정보를 불러올 수 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
