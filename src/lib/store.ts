import { create } from 'zustand'

// 상태 타입 정의
interface AppState {
  searchTerm: string
  scrollPosition: number
  filters: Record<string, never>
  sorting: string
}

// 액션 타입 정의
interface AppActions {
  setSearchTerm: (term: string) => void
  setScrollPosition: (position: number) => void
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
  setFilters: (filters) => set({ filters }),
  setSorting: (sorting) => set({ sorting }),
  resetState: () => set(initialState),
}))
