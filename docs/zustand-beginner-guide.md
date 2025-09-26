# Zustand 상태 관리 가이드

---

## 1. 요약

- **간단한 API**: 한 줄로 store 생성 후 바로 사용
- **TypeScript 친화적**: 타입 추론/안전성 우수
- **리렌더링 제어 용이**: 선택적 구독(selector) + 얕은 비교(useShallow)

---

## 2. 기본 사용법

```tsx
import { create } from 'zustand'

// 1) Store 생성
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
}))

// 2) 컴포넌트 사용
function Counter() {
  const { count, increment, decrement } = useStore()
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

---

## 3. 프로젝트 예시 (src/lib/store.ts)

```tsx
import { create } from 'zustand'

interface AppState {
  searchTerm: string
  scrollPosition: number
  filters: Record<string, never>
  sorting: string

  setSearchTerm: (term: string) => void
  setScrollPosition: (position: number) => void
  setFilters: (filters: Record<string, never>) => void
  setSorting: (sorting: string) => void
  resetState: () => void
}

export const useAppStore = create<AppState>((set) => ({
  searchTerm: '',
  scrollPosition: 0,
  filters: {},
  sorting: 'default',

  setSearchTerm: (term) => set({ searchTerm: term }),
  setScrollPosition: (position) => set({ scrollPosition: position }),
  setFilters: (filters) => set({ filters }),
  setSorting: (sorting) => set({ sorting }),
  resetState: () =>
    set({
      searchTerm: '',
      scrollPosition: 0,
      filters: {},
      sorting: 'default',
    }),
}))
```

### 왜 이렇게 설계했는가?

1. **검색어 상태 공유**: 헤더의 검색바와 페이지 컴포넌트 간 상태 동기화
2. **스크롤 위치 보존**: 상세 페이지에서 돌아올 때 이전 위치 복원
3. **필터/정렬 확장성**: 향후 타입별, 세대별 필터링 기능 대비
4. **단순한 구조**: 복잡한 중첩 없이 flat한 상태 구조

---

## 4. 리렌더링 최소화 핵심

### 4.1 왜 불필요한 리렌더링이 생기나?

- `useStore((s) => s)` 같이 **전체 상태를 구독**하면 작은 변화도 모든 구독 컴포넌트를 리렌더링
- **객체/배열을 직접 반환**하는 selector는 매 호출마다 **새 참조**가 되어 변경으로 인식될 수 있음

### 4.2 해결 원칙

1. **필요한 값만** selector로 구독 (가능하면 숫자/문자/boolean 등 원시값)
2. **여러 값**을 한 번에 구독해야 한다면 얕은 비교(`useShallow`)를 써서 참조가 바뀌어도 내용이 같으면 리렌더를 막음

```tsx
// ✅ 여러 값 구독 + 얕은 비교
import { useShallow } from 'zustand/react/shallow'

// ❌ 전체 구독
const store = useAppStore()

// ✅ 단일 값 구독
const searchTerm = useAppStore((s) => s.searchTerm)

const { searchTerm, scrollPosition } = useAppStore(
  useShallow((s) => ({
    searchTerm: s.searchTerm,
    scrollPosition: s.scrollPosition,
  }))
)
```

**정리:** `useShallow`의 **가장 큰 목적**은 "객체/배열 반환 selector가 야기하는 **불필요한 리렌더링** 방지"

---

## 5. 실제 사용 패턴

### 5.1 HomePage에서의 사용

```tsx
export const HomePage = () => {
  const { searchTerm, setSearchTerm } = useAppStore()
  return (
    <MainLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      {/* 목록 */}
    </MainLayout>
  )
}
```

### 5.2 스크롤 위치 관리

```tsx
// 상세로 이동 전
const handlePokemonClick = (name: string) => {
  setScrollPosition(window.scrollY)
  navigate(`/pokemon/${name}`)
}

// 복귀 시 복원
useEffect(() => {
  if (scrollPosition > 0) {
    setTimeout(() => window.scrollTo(0, scrollPosition), 100)
  }
}, [scrollPosition])
```

### 5.3 상세 페이지로부터 복귀

```tsx
export const PokemonDetailPage = () => {
  const scrollPosition = useAppStore((s) => s.scrollPosition)

  const handleGoBack = () => {
    navigate('/', { replace: true })
    setTimeout(() => window.scrollTo(0, scrollPosition), 100)
  }
}
```

---

## 6. 확장 패턴 (왜/언제/주의사항)

### 6.1 데이터 저장: `persist` 미들웨어

**왜 필요한가?**

- 새로고침하거나 앱을 다시 켜도 **사용자 설정이 그대로 남아있게** 하기 위해 (예: 다크모드, 최근 검색어)

**언제 쓰나?**

- **사용자 설정이나 가벼운 데이터**에 적합 (큰 리스트 데이터, 비밀번호 같은 민감 정보는 비권장)

**주의사항**

- 기본적으로 브라우저 저장소(`localStorage`)에 저장됨. 서버 렌더링(SSR) 환경에선 접근 시점 주의
- 데이터 구조가 바뀌면 **버전 관리(version)** 옵션 사용
- **비밀번호나 토큰** 저장 금지, **용량이 큰 데이터** 저장 지양

**간단 예시**

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Prefs = {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

export const usePrefStore = create<Prefs>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (t) => set({ theme: t }),
    }),
    {
      name: 'pref-store', // 브라우저 저장소에서 사용할 키 이름
      version: 1, // 데이터 구조 변경 시 버전 업
    }
  )
)
```

---

### 6.2 복잡한 로직: `get()` 사용

**왜 필요한가?**

- 액션 안에서 **현재 상태를 읽고** 그 값에 따라 **다음 상태를 계산**하기 위해

**언제 쓰나?**

- 단순 대입이 아니라 **조건/파생 로직**이 필요한 경우

**주의사항**

- `get()`은 **store 내부 로직(액션)에서만 사용** 권장
  컴포넌트 렌더링 중에는 `useStore(selector)`로 구독
- 여러 번 set 하는 복잡한 로직은 **불변성/원자성** 고려

**간단 예시**

```tsx
import { create } from 'zustand'

type CartState = {
  items: { id: string; qty: number }[]
  add: (id: string) => void
  remove: (id: string) => void
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (id) => {
    const items = get().items
    const exists = items.find((i) => i.id === id)
    if (exists) {
      set({
        items: items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
      })
    } else {
      set({ items: [...items, { id, qty: 1 }] })
    }
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
}))
```

---

### 6.3 여러 값 구독: `useShallow`

**왜 필요한가?**

- selector가 **객체/배열**을 반환하면 참조가 매번 달라져 **리렌더링이 과도**해질 수 있음

**언제 쓰나?**

- **둘 이상**의 값을 한 번에 구독해야 할 때
- 또는 **배열 매핑** 같은 연산으로 새 배열을 반환할 때

**주의사항**

- 가장 안전한 방법은 **각 값을 개별로 구독**하는 것
- `useShallow`는 얕은 비교만 수행하므로 **깊은 중첩 객체**에는 부적절

**간단 예시**

```tsx
import { useShallow } from 'zustand/react/shallow'

// 여러 값 반환 + 얕은 비교
const { a, b } = useStore(useShallow((s) => ({ a: s.a, b: s.b })))

// 배열 반환 + 얕은 비교
const names = useStore(useShallow((s) => s.list.map((i) => i.name)))

// 가장 권장: 개별 구독
const a = useStore((s) => s.a)
const b = useStore((s) => s.b)
```

---

## 7. Context API와 비교(간단 요약)

- **Context**: Provider 중첩, 전역 리렌더링 이슈 → 복잡해지기 쉬움
- **Zustand**: 단일 store + selector로 간결, 리렌더 제어 쉬움

---

## 8. 체크리스트

- [ ] 필요한 값만 selector로 구독한다
- [ ] 여러 값 반환 시 `useShallow`로 **불필요한 리렌더링**을 막는다
- [ ] 도메인별 store 분리로 응집도/가독성을 높인다
- [ ] 영속 상태는 `persist`로, 민감/대용량은 저장하지 않는다
- [ ] 액션에서 현재 상태가 필요하면 `get()`을 사용한다 (컴포넌트에선 X)
