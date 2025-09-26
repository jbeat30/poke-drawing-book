import { create } from 'zustand'

// 상태 타입 정의
interface AppState {
  searchTerm: string
  scrollPosition: number
  selectedType: string
  filters: Record<string, never>
  sorting: string
}

// 액션 타입 정의
interface AppActions {
  setSearchTerm: (term: string) => void
  setScrollPosition: (position: number) => void
  setSelectedType: (type: string) => void
  setFilters: (filters: Record<string, never>) => void
  setSorting: (sorting: string) => void
  resetState: () => void
}

// 전체 Store 타입
type AppStore = AppState & AppActions

// 초기 상태
const initialState: AppState = {
  searchTerm: '',
  scrollPosition: 0,
  selectedType: '',
  filters: {},
  sorting: 'default',
}

// Store 생성
export const useAppStore = create<AppStore>((set) => ({
  // 상태
  ...initialState,

  // 액션
  setSearchTerm: (term) => set({ searchTerm: term }),
  setScrollPosition: (position) => set({ scrollPosition: position }),
  setSelectedType: (type) => set({ selectedType: type }),
  setFilters: (filters) => set({ filters }),
  setSorting: (sorting) => set({ sorting }),
  resetState: () => set(initialState),
}))
