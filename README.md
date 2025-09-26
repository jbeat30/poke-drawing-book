# 포켓몬 도감 미니

React + TypeScript + Vite로 만든 한국어 지원 포켓몬 도감 앱

## 주요 기능

- 포켓몬 목록 조회 (무한 스크롤)
- 한국어/영어 통합 검색
- 포켓몬 상세 정보 모달 및 페이지
- 한국어 현지화 (이름, 설명, 타입, 능력치)
- 타입별 색상 시스템
- 반응형 디자인
- 스크롤 위치 복원

## 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **상태 관리**: React Query (TanStack Query), Zustand
- **빌드 도구**: Vite
- **API**: PokeAPI (pokemon + pokemon-species)
- **라우팅**: React Router
- **SEO**: @dr.pogodin/react-helmet

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format
```

## 학습 가이드

초심자를 위한 상세한 가이드 문서:

### 기본 개념

- [데이터 조회 가이드](./docs/data-fetching.md) - React Query 사용법
- [무한 스크롤 구현](./docs/infinite-scroll.md) - useInfiniteQuery 활용

### 고급 기능

- [상태 관리](./docs/zustand-beginner-guide.md) - Zustand를 활용한 전역 상태
- [페이지 네비게이션](./docs/page-navigation-guide.md) - React Router와 스크롤 복원
- [SEO 최적화](./docs/seo-guide.md) - react-helmet을 활용한 메타 태그 관리

## 폴더 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
│   ├── PokemonCard.tsx      # 포켓몬 카드
│   ├── PokemonModal.tsx     # 포켓몬 상세 모달
│   └── SearchBar.tsx        # 검색 바
├── hooks/         # 커스텀 훅
│   ├── usePokemon.ts        # 포켓몬 데이터 조회
│   ├── usePokemonWithKorean.ts  # 한국어 이름 추가
│   └── useInfiniteScroll.ts # 무한 스크롤
├── pages/         # 페이지 컴포넌트
│   ├── HomePage.tsx         # 메인 페이지
│   └── PokemonDetailPage.tsx # 상세 페이지
├── types/         # TypeScript 타입 정의
│   └── pokemon.ts           # 포켓몬 관련 타입
├── lib/           # 유틸리티 및 설정
│   ├── translations.ts      # 번역 및 색상 시스템
│   ├── store.ts            # Zustand 스토어
│   └── query-client.ts     # React Query 설정
└── layout/        # 레이아웃 컴포넌트
    ├── MainLayout.tsx      # 메인 레이아웃
    └── SEOHead.tsx         # SEO 헤더
```

## 주요 특징

### 한국어 현지화

- PokeAPI의 `pokemon-species` 엔드포인트 활용
- 포켓몬 이름, 설명, 타입, 능력치 한국어 지원
- 영어/한국어 통합 검색 기능

### 성능 최적화

- React Query로 효율적인 데이터 캐싱
- 무한 스크롤로 점진적 로딩
- 스크롤 위치 복원으로 UX 개선

### 타입 안전성

- TypeScript 엄격 모드
- `as const` 패턴으로 리터럴 타입 활용
- 헬퍼 함수로 런타임 에러 방지

## 개발자

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: TanStack Query, Zustand
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify 권장
