# 컴포넌트 구조 가이드

React 컴포넌트 설계와 구조 이해하기

## 실제 폴더 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── PokemonCard.tsx     # 포켓몬 카드
│   ├── SearchBar.tsx       # 검색바
│   └── PokemonModal.tsx    # 상세 모달
├── pages/              # 페이지 컴포넌트
│   └── HomePage.tsx        # 메인 페이지
├── hooks/              # 커스텀 훅
│   ├── usePokemon.ts       # 포켓몬 데이터 훅
│   └── useInfiniteScroll.ts # 무한 스크롤 훅
├── types/              # 타입 정의
│   └── pokemon.ts          # 포켓몬 타입
└── lib/                # 설정 및 유틸리티
    └── query-client.ts     # React Query 설정
```

## 컴포넌트 분류

### 1. 페이지 컴포넌트

전체 화면을 담당하는 최상위 컴포넌트

```typescript
// src/pages/HomePage.tsx
export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null)

  const { data, fetchNextPage, hasNextPage } = usePokemonInfiniteList()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-8">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      {/* 포켓몬 카드 그리드 */}
      <PokemonModal pokemonName={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  )
}
```

### 2. UI 컴포넌트

재사용 가능한 작은 단위 컴포넌트

#### PokemonCard

```typescript
// src/components/PokemonCard.tsx
interface PokemonCardProps {
  name: string
  onClick: () => void
}

export const PokemonCard = ({ name, onClick }: PokemonCardProps) => {
  const { data: pokemon, isLoading } = usePokemon(name)

  if (isLoading) return <SkeletonCard />
  if (!pokemon) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-4" onClick={onClick}>
      <img src={pokemon.sprites.front_default} />
      <h3>{pokemon.name}</h3>
    </div>
  )
}
```

#### SearchBar

```typescript
// src/components/SearchBar.tsx
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
```

## 컴포넌트 설계 원칙

### 1. 단일 책임 원칙

각 컴포넌트는 하나의 역할만 담당

- `PokemonCard`: 포켓몬 카드 표시
- `SearchBar`: 검색 입력
- `PokemonModal`: 상세 정보 모달

### 2. Props 타입 정의

```typescript
interface PokemonCardProps {
  name: string // 필수 props
  onClick: () => void // 이벤트 핸들러
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string // 선택적 props
}
```

### 3. 조건부 렌더링 패턴

```typescript
// 로딩 상태
if (isLoading) return <div className="animate-pulse">...</div>

// 데이터 없음
if (!pokemon) return null

// 정상 렌더링
return <PokemonCard />
```

## 상태 관리 패턴

### 1. 로컬 상태 (useState)

컴포넌트 내부에서만 사용

```typescript
const [searchTerm, setSearchTerm] = useState('')
const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null)
```

### 2. 서버 상태 (React Query)

API에서 가져오는 데이터

```typescript
const { data: pokemon, isLoading } = usePokemon(name)
const { data, fetchNextPage } = usePokemonInfiniteList()
```

### 3. Props로 상태 전달

부모에서 자식으로 데이터와 이벤트 전달

```typescript
// 부모 컴포넌트
<PokemonCard name="pikachu" onClick={() => setSelectedPokemon("pikachu")} />

// 자식 컴포넌트에서 받기
const PokemonCard = ({ name, onClick }: PokemonCardProps) => { ... }
```

## 이벤트 처리

### 이벤트 핸들러 네이밍

```typescript
const handleClick = () => { ... }
const handleSearch = (term: string) => { ... }
const handleClose = () => { ... }
```

### 모달 배경 클릭 처리

```typescript
// src/components/PokemonModal.tsx
const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.target === e.currentTarget) {
    onClose()
  }
}
```

## 스타일링

### Tailwind CSS 클래스 사용

```typescript
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
  <img className="w-24 h-24 mx-auto mb-2" />
  <h3 className="text-lg font-semibold text-center capitalize">
</div>
```

### 조건부 스타일링

```typescript
className={`px-2 py-1 rounded-full text-xs text-white ${
  typeColors[type.type.name] ?? 'bg-gray-400'
}`}
```

## 커스텀 훅 활용

### 데이터 조회 훅

```typescript
// src/hooks/usePokemon.ts
export const usePokemon = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: async () => { ... },
    enabled: !!nameOrId,
  })
}
```

### 무한 스크롤 훅

```typescript
// src/hooks/useInfiniteScroll.ts
export const useInfiniteScroll = ({ hasNextPage, fetchNextPage }) => {
  // Intersection Observer 로직
  return { loadMoreRef }
}
```

## 컴포넌트 재사용성

### Props 인터페이스 설계

```typescript
interface PokemonCardProps {
  name: string
  onClick: () => void
  className?: string // 추가 스타일링 가능
  showTypes?: boolean // 타입 표시 여부 선택
}
```

### 기본값 설정

```typescript
export const SearchBar = ({
  value,
  onChange,
  placeholder = "포켓몬 이름을 검색하세요..."
}: SearchBarProps) => { ... }
```
