# 캐싱 관리 가이드

React Query의 캐싱 시스템 이해하기

## 캐싱이란?

한 번 가져온 데이터를 메모리에 저장해서 재사용하는 기술

**왜 필요한가?**
- 같은 데이터를 여러 번 요청할 필요 없음
- 빠른 화면 표시
- 네트워크 사용량 절약

## 캐싱 설정

### 기본 설정

```typescript
// src/lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5분간 데이터를 최신으로 간주
      gcTime: 1000 * 60 * 10,    // 10분간 메모리에 캐시 보관
    },
  },
})
```

### 주요 옵션 설명

- **staleTime**: 데이터를 "최신"으로 간주하는 시간
  - 이 시간 내에는 API 호출 안 함
  - 캐시에서 바로 데이터 반환
  
- **gcTime**: 캐시를 메모리에 보관하는 시간
  - 컴포넌트가 사라져도 이 시간만큼 캐시 유지
  - 시간 지나면 메모리에서 삭제

## 캐시 키 전략

### 계층적 키 구조

```typescript
// 개별 포켓몬
queryKey: ['pokemon', nameOrId]

// 포켓몬 목록
queryKey: ['pokemon-infinite-list']
```

**캐시 키 규칙:**
1. 배열 형태로 작성
2. 같은 데이터는 같은 키 사용
3. 다른 파라미터면 다른 키 사용

## 캐시 동작 방식

### 시나리오 1: 첫 번째 요청
```
컴포넌트 → API 호출 → 데이터 받음 → 캐시에 저장 → 화면에 표시
```

### 시나리오 2: 같은 데이터 재요청 (staleTime 내)
```
컴포넌트 → 캐시 확인 → 바로 반환 (API 호출 없음)
```

### 시나리오 3: 같은 데이터 재요청 (staleTime 초과)
```
컴포넌트 → 캐시 데이터 먼저 표시 → 백그라운드에서 API 호출 → 새 데이터로 업데이트
```

## 실제 동작 예시

### 포켓몬 카드 컴포넌트

```typescript
// 첫 번째 피카츄 카드
<PokemonCard name="pikachu" />  // API 호출, 캐시에 저장

// 두 번째 피카츄 카드 (5분 내)
<PokemonCard name="pikachu" />  // 캐시에서 바로 가져옴

// 리자몽 카드
<PokemonCard name="charizard" /> // 새로운 API 호출
```

### 캐시 키별 관리

```typescript
// 각각 다른 캐시로 관리됨
usePokemon('pikachu')    // ['pokemon', 'pikachu']
usePokemon('charizard')  // ['pokemon', 'charizard']
usePokemon(25)           // ['pokemon', 25]
```

## 캐시 상태 확인

React Query DevTools로 캐시 상태 확인 가능:

- **fresh**: staleTime 내, 최신 데이터
- **stale**: staleTime 초과, 오래된 데이터
- **inactive**: 사용하지 않는 캐시
- **fetching**: 데이터 가져오는 중

## 캐시 무효화

필요시 캐시를 강제로 삭제하거나 새로고침:

```typescript
// 특정 포켓몬 캐시 무효화
queryClient.invalidateQueries({ queryKey: ['pokemon', 'pikachu'] })

// 모든 포켓몬 캐시 무효화
queryClient.invalidateQueries({ queryKey: ['pokemon'] })
```

## 메모리 관리

### gcTime 동작

1. 컴포넌트가 언마운트됨
2. gcTime 카운트 시작 (10분)
3. 10분 후 캐시가 메모리에서 삭제
4. 다시 요청하면 새로 API 호출

### 최적화 팁

```typescript
// 자주 사용하는 데이터는 긴 시간 설정
useQuery({
  queryKey: ['pokemon', name],
  staleTime: 1000 * 60 * 10,  // 10분
  gcTime: 1000 * 60 * 30,     // 30분
})
```

## 장점

- **빠른 응답**: 캐시된 데이터 즉시 표시
- **네트워크 절약**: 중복 요청 방지
- **자동 관리**: 복잡한 캐시 로직 불필요
- **백그라운드 업데이트**: 사용자 경험 향상