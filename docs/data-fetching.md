# 데이터 조회 가이드

React Query를 사용한 API 데이터 조회 방법

## 기본 개념

### React Query란?

- 서버 상태 관리 라이브러리
- 데이터 페칭, 캐싱, 동기화 자동 처리
- 로딩, 에러 상태 관리 간편함

## 구현 방법

### 1. 클라이언트 설정

**왜 필요한가?**

- React Query의 전역 설정 담당
- 캐시 정책, 재시도 횟수 등 기본값 설정
- 앱 전체에서 동일한 설정 사용

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분간 데이터를 최신으로 간주
      gcTime: 1000 * 60 * 10, // 10분간 메모리에 캐시 보관
    },
  },
})
```

**어디서 사용?**

```typescript
// src/main.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

### 2. 커스텀 훅 생성

**왜 만드는가?**

- 데이터 조회 로직 재사용
- 컴포넌트에서 간단하게 사용
- 타입 안전성 보장
- 에러 처리 중앙화

**만드는 방법:**

```typescript
// src/hooks/usePokemon.ts
export const usePokemon = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ['pokemon', nameOrId], // 캐시 키 (고유 식별자)
    queryFn: async (): Promise<Pokemon> => {
      const response = await fetch(`${API_BASE}/pokemon/${nameOrId}`)
      if (!response.ok) {
        throw new Error('포켓몬 조회 실패')
      }
      const data = (await response.json()) as Pokemon
      return data
    },
    enabled: !!nameOrId, // nameOrId가 있을 때만 실행
  })
}
```

**커스텀 훅의 장점:**

- 비즈니스 로직과 UI 분리
- 여러 컴포넌트에서 재사용 가능
- 테스트하기 쉬움

### 3. 컴포넌트에서 사용

**사용 방법:**

```typescript
// src/components/PokemonCard.tsx
export const PokemonCard = ({ name }: Props) => {
  const { data: pokemon, isLoading, error } = usePokemon(name)

  if (isLoading) return <div>로딩중...</div>
  if (error) return <div>에러: {error.message}</div>
  if (!pokemon) return null

  return (
    <div>
      <img src={pokemon.sprites.front_default} />
      <h3>{pokemon.name}</h3>
    </div>
  )
}
```

**동작 원리:**

1. 컴포넌트가 마운트되면 `usePokemon` 호출
2. React Query가 `queryKey`로 캐시 확인
3. 캐시에 없으면 `queryFn` 실행해서 API 호출
4. 데이터 받아오는 동안 `isLoading: true`
5. 성공하면 `data`에 결과 저장, 실패하면 `error`에 저장
6. 컴포넌트가 자동으로 리렌더링됨

## 핵심 포인트

- **queryKey**: 캐시 식별자, 배열 형태로 작성
- **queryFn**: 실제 데이터를 가져오는 함수
- **enabled**: 조건부 실행 제어
- **타입 안전성**: TypeScript로 응답 타입 지정

## 상태 관리 자동화

React Query가 자동으로 관리하는 것들:

- **로딩 상태**: `isLoading`, `isFetching`
- **에러 상태**: `error`, `isError`
- **성공 상태**: `data`, `isSuccess`
- **캐싱**: 동일한 데이터 재요청 방지
- **백그라운드 업데이트**: 데이터 자동 갱신

## 실제 사용 예시

```typescript
// 같은 포켓몬을 여러 컴포넌트에서 사용해도 API는 한 번만 호출됨
<PokemonCard name="pikachu" />     // API 호출
<PokemonDetail name="pikachu" />   // 캐시에서 가져옴
<PokemonStats name="pikachu" />    // 캐시에서 가져옴
```
