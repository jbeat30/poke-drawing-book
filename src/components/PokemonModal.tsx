import { usePokemon, usePokemonSpecies } from '../hooks/usePokemon'
import {
  getKoreanDescription,
  getKoreanName,
  getStatTranslation,
  getTypeColor,
  getTypeTranslation,
} from '../lib/translations'

// 포켓몬 모달 props 타입
interface PokemonModalProps {
  pokemonName: string | null // 선택된 포켓몬 이름
  onClose: () => void // 모달 닫기 핸들러
}

// 포켓몬 상세 정보 모달 컴포넌트
export const PokemonModal = ({ pokemonName, onClose }: PokemonModalProps) => {
  const { data: pokemon, isLoading } = usePokemon(pokemonName ?? '') // 포켓몬 데이터 가져옴
  const { data: species } = usePokemonSpecies(pokemonName ?? '') // 종족 데이터 가져옴

  if (!pokemonName) return null // 선택된 포켓몬 없으면 렌더링 안 함

  // 한국어 이름과 설명 추출
  const koreanName = species ? getKoreanName(species.names) : null
  const koreanDescription = species
    ? getKoreanDescription(species.flavor_text_entries)
    : null

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
            <h2 className="text-2xl font-bold">{koreanName || pokemonName}</h2>
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
                alt={koreanName || pokemon.name}
                className="w-48 h-48 mx-auto mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/poke-placeholder.png'
                }}
              />

              <div className="space-y-4">
                {/* 포켓몬 설명 */}
                {koreanDescription && (
                  <div>
                    <h3 className="font-semibold mb-2">설명</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {koreanDescription}
                    </p>
                  </div>
                )}

                {/* 포켓몬 타입 정보 */}
                <div>
                  <h3 className="font-semibold mb-2">타입</h3>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-3 py-1 rounded-full text-white ${getTypeColor(type.type.name)}`}
                      >
                        {getTypeTranslation(type.type.name)}
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
                          <span>{getStatTranslation(stat.stat.name)}</span>
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
