import { useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { usePokemonDetail, usePokemonSpecies } from '../hooks/usePokemon'
import { SEOHead } from '../layout'
import MainLayout from '../layout/MainLayout'
import { useAppStore } from '../lib/store'
import {
  getKoreanDescription,
  getKoreanName,
  getStatTranslation,
  getTypeColor,
  getTypeTranslation,
  getGenerationTranslation,
} from '../lib/translations'

export const PokemonDetailPage = () => {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()

  // 단일 상태 선택 - useShallow 불필요
  const scrollPosition = useAppStore((state) => state.scrollPosition)

  const { data: pokemon, isLoading, error } = usePokemonDetail(name || '')
  const { data: species } = usePokemonSpecies(name || '')

  // 한국어 데이터 추출
  const koreanName = species ? getKoreanName(species.names) : null
  const koreanDescription = species
    ? getKoreanDescription(species.flavor_text_entries)
    : null
  const generation = species
    ? getGenerationTranslation(species.generation.name)
    : null
  const evolvesFrom = species?.evolves_from_species?.name || null

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate('/', { replace: true })
    // 스크롤 위치 복원
    setTimeout(() => {
      window.scrollTo(0, scrollPosition)
    }, 100)
  }

  // 상세 페이지는 항상 최상단부터 시작
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [name])

  if (isLoading) {
    return (
      <MainLayout showSearch={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">포켓몬 정보를 불러오는 중...</div>
        </div>
      </MainLayout>
    )
  }

  if (error || !pokemon) {
    return (
      <MainLayout showSearch={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl mb-4">
            포켓몬을 찾을 수 없습니다.
          </div>
          <button
            onClick={handleGoBack}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
          >
            돌아가기
          </button>
        </div>
      </MainLayout>
    )
  }

  return (
    <>
      <SEOHead
        title={koreanName || pokemon.name}
        description={
          koreanDescription ||
          `${pokemon.types.map((t) => getTypeTranslation(t.type.name)).join(', ')} 타입 포켓몬 ${koreanName || pokemon.name}의 상세 정보`
        }
        image={
          pokemon.sprites.other['official-artwork'].front_default ||
          pokemon.sprites.front_default ||
          ''
        }
      />

      <MainLayout showSearch={false}>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          돌아가기
        </button>

        {/* 포켓몬 상세 정보 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 이미지 섹션 */}
            <div className="text-center">
              <img
                src={
                  pokemon.sprites.other['official-artwork'].front_default ||
                  pokemon.sprites.front_default ||
                  ''
                }
                alt={koreanName || pokemon.name}
                className="w-64 h-64 mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold mb-2">
                {koreanName || pokemon.name}
              </h1>
              <div className="flex justify-center gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`px-3 py-1 rounded-full text-sm text-white ${getTypeColor(type.type.name)}`}
                  >
                    {getTypeTranslation(type.type.name)}
                  </span>
                ))}
              </div>
              {koreanDescription && (
                <p className="text-white/80 text-sm leading-relaxed">
                  {koreanDescription}
                </p>
              )}
            </div>

            {/* 정보 섹션 */}
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">기본 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/70">높이</span>
                    <p className="font-semibold">{pokemon.height / 10}m</p>
                  </div>
                  <div>
                    <span className="text-white/70">무게</span>
                    <p className="font-semibold">{pokemon.weight / 10}kg</p>
                  </div>
                  <div>
                    <span className="text-white/70">도감 번호</span>
                    <p className="font-semibold">#{pokemon.id}</p>
                  </div>
                  <div>
                    <span className="text-white/70">경험치</span>
                    <p className="font-semibold">
                      {pokemon.base_experience || 'N/A'}
                    </p>
                  </div>
                  {generation && (
                    <div>
                      <span className="text-white/70">세대</span>
                      <p className="font-semibold">{generation}</p>
                    </div>
                  )}
                  {evolvesFrom && (
                    <div>
                      <span className="text-white/70">진화 전</span>
                      <p className="font-semibold">{evolvesFrom}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 능력치 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">능력치</h2>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between mb-1">
                        <span>{getStatTranslation(stat.stat.name)}</span>
                        <span>{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((stat.base_stat / 200) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 특성 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">특성</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, index) => (
                    <span
                      key={`${ability.ability.name}-${index}`}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize"
                    >
                      {ability.ability.name}
                      {ability.is_hidden && ' (숨겨진 특성)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* 기술 (일부만 표시) */}
              <div>
                <h2 className="text-xl font-semibold mb-3">주요 기술</h2>
                <div className="grid grid-cols-2 gap-2">
                  {pokemon.moves.slice(0, 8).map((move, index) => (
                    <span
                      key={`${move.move.name}-${index}`}
                      className="px-2 py-1 bg-white/10 rounded text-sm capitalize text-center"
                    >
                      {move.move.name}
                    </span>
                  ))}
                </div>
                {pokemon.moves.length > 8 && (
                  <p className="text-white/70 text-sm mt-2">
                    총 {pokemon.moves.length}개의 기술을 배울 수 있습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}
