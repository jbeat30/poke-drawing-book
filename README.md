# 포켓몬 도감 미니

React + TypeScript + Vite로 만든 포켓몬 도감 앱

## 주요 기능

- 포켓몬 목록 조회 (무한 스크롤)
- 포켓몬 검색
- 포켓몬 상세 정보 모달
- 반응형 디자인

## 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **상태 관리**: React Query (TanStack Query)
- **빌드 도구**: Vite
- **API**: PokeAPI

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 학습 가이드

초심자를 위한 상세한 가이드 문서:

- [데이터 조회 가이드](./docs/data-fetching.md)
- [캐싱 관리 가이드](./docs/caching.md)
- [무한 스크롤 구현](./docs/infinite-scroll.md)
- [컴포넌트 구조](./docs/components.md)

## 폴더 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── hooks/         # 커스텀 훅
├── pages/         # 페이지 컴포넌트
├── types/         # TypeScript 타입 정의
└── lib/           # 유틸리티 및 설정
```
