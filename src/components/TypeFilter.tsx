import { POKEMON_TYPES } from '../hooks/usePokemonByType'
import { getTypeColor, getTypeTranslation } from '../lib/translations'

interface TypeFilterProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

export const TypeFilter = ({ selectedType, onTypeChange }: TypeFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white text-lg font-semibold mb-3">타입별 조회</h3>
      <div className="flex flex-wrap gap-2">
        {/* 전체 보기 버튼 */}
        <button
          onClick={() => onTypeChange('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all cursor-pointer select-none ${
            selectedType === ''
              ? 'bg-gray-800 ring-2 ring-white shadow-md'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          style={{ fontKerning: 'none', textRendering: 'optimizeLegibility' }}
        >
          전체
        </button>

        {/* 타입별 필터 버튼 */}
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all cursor-pointer select-none ${getTypeColor(
              type
            )} ${
              selectedType === type
                ? 'ring-2 ring-white shadow-md'
                : 'hover:shadow-sm'
            }`}
            style={{ fontKerning: 'none', textRendering: 'optimizeLegibility' }}
          >
            {getTypeTranslation(type)}
          </button>
        ))}
      </div>
    </div>
  )
}
