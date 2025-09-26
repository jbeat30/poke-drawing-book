# SEO 작업 가이드

## 현재 프로젝트 SEO 구현

### 사용 라이브러리: @dr.pogodin/react-helmet v3.0.4

react-helmet-async의 React 19 호환성 문제로 인해 선택한 커뮤니티 대안 라이브러리

### 프로젝트 구조

```
src/
├── layout/
│   ├── SEOHead.tsx     # SEO 메타태그 컴포넌트
│   └── index.ts        # export 관리
├── App.tsx             # SEOHead 사용
└── main.tsx            # HelmetProvider 설정
```

## 현재 구현 코드

### 1. Provider 설정 (src/main.tsx)

```tsx
import { HelmetProvider } from '@dr.pogodin/react-helmet'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)
```

### 2. SEOHead 컴포넌트 (src/layout/SEOHead.tsx)

```tsx
import { Helmet } from '@dr.pogodin/react-helmet'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function SEOHead({
  title,
  description = 'React + TypeScript로 만든 포켓몬 도감 앱. 포켓몬 검색, 상세 정보 조회 기능을 제공합니다.',
  image = '/images/poke-og.png',
  url,
}: SEOHeadProps) {
  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Helmet
      title={title || '포켓몬 도감 미니'}
      titleTemplate={title ? '%s | 포켓몬 도감 미니' : '%s'}
      meta={[
        { name: 'description', content: description },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        {
          property: 'og:title',
          content: title ? `${title} | 포켓몬 도감 미니` : '포켓몬 도감 미니',
        },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: currentUrl },
        { property: 'og:type', content: 'website' },

        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: title ? `${title} | 포켓몬 도감 미니` : '포켓몬 도감 미니',
        },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ]}
      link={[{ rel: 'canonical', href: currentUrl }]}
    />
  )
}
```

### 3. App에서 사용 (src/App.tsx)

```tsx
import { SEOHead } from './layout'

function App() {
  return (
    <>
      <SEOHead />
      <HomePage />
    </>
  )
}
```

## @dr.pogodin/react-helmet 핵심 사용법

### 기본 구조

```tsx
<Helmet
  title="페이지 제목"
  titleTemplate="%s | 사이트명"
  meta={[
    { name: 'description', content: '설명' },
    { property: 'og:title', content: '제목' },
  ]}
  link={[{ rel: 'canonical', href: 'URL' }]}
/>
```

### 주요 Props

- **title**: 페이지 제목
- **titleTemplate**: 제목 템플릿 (`%s`는 title로 치환)
- **meta**: 메타태그 배열
- **link**: 링크 태그 배열
- **script**: 스크립트 태그 배열

### SSR 지원

- **CSR**: 클라이언트에서 동적 메타태그 업데이트
- **SSR**: 서버에서 초기 HTML에 메타태그 포함
- **Hydration**: 클라이언트에서 서버 렌더링된 메타태그 인계

## 사용법

### 기본 페이지 (현재 구현)

```tsx
<SEOHead />
```

- Title: "포켓몬 도감 미니"
- Description: 기본 설명
- Image: "/images/poke-og.png"

### 동적 페이지 (포켓몬 상세)

```tsx
<SEOHead
  title="피카츄"
  description="전기타입 포켓몬 피카츄의 상세 정보"
  image="/images/pokemon/pikachu.jpg"
  url="/pokemon/pikachu"
/>
```

- Title: "피카츄 | 포켓몬 도감 미니" (titleTemplate 적용)

### 검색 결과 페이지

```tsx
<SEOHead
  title={`"${searchQuery}" 검색 결과`}
  description={`포켓몬 도감에서 "${searchQuery}" 검색 결과 ${results.length}개`}
/>
```

## react-helmet-async를 사용하지 않는 이유

### React 19 호환성 문제

**GitHub 이슈:** https://github.com/staylor/react-helmet-async/issues/254

**발생했던 문제:**

1. React 19 peer dependency 경고
2. 메타태그가 DOM에 정상적으로 렌더링되지 않음
3. 개발 서버 재시작 후에도 일부 메타태그 누락

**실제 에러:**

```
WARN Issues with peer dependencies found
└─┬ react-helmet-async 2.0.5
  └── ✕ unmet peer react@"^16.6.0 || ^17.0.0 || ^18.0.0": found 19.1.1
```

### @dr.pogodin/react-helmet 선택 이유

**GitHub 이슈 #254에서 언급된 커뮤니티 대안:**

- react-helmet-async 업데이트 중단으로 인한 포크 버전
- React 19 호환성 문제 해결
- 기존 react-helmet과 동일한 API 제공
- Props 기반 선언적 방식
- SSR/CSR 모두 지원
- titleTemplate 등 고급 기능 지원

> 추가 고려사항: React 19부터 네이티브로 메타태그를 지원하므로, 간단한 사용 사례에서는 라이브러리 없이도 구현 가능. 고급 기능(동적 업데이트, SSR)이 필요할 경우 유지

## 고급 기능

### 조건부 메타태그

```tsx
<Helmet
  meta={[
    { name: 'description', content: description },
    ...(isArticle ? [{ property: 'og:type', content: 'article' }] : []),
    ...(publishDate
      ? [{ property: 'article:published_time', content: publishDate }]
      : []),
  ]}
/>
```

### 스크립트 태그 추가

```tsx
<Helmet
  script={[
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '포켓몬 도감 미니',
      }),
    },
  ]}
/>
```

## 검증 방법

### 개발 환경에서 확인

1. `pnpm dev` 실행
2. 브라우저 개발자 도구 → Elements → `<head>` 태그 확인
3. 다음 메타태그들이 존재하는지 확인:
   - `<title>포켓몬 도감 미니</title>`
   - `<meta name="description" content="...">`
   - `<meta property="og:title" content="...">`
   - `<meta name="twitter:card" content="summary_large_image">`

### 외부 도구로 검증

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **Google Rich Results Test:** https://search.google.com/test/rich-results

## 트러블슈팅

### titleTemplate이 적용되지 않을 때

- `title` prop이 전달되었는지 확인
- `titleTemplate`에 `%s` 플레이스홀더가 있는지 확인

### SSR 환경에서 메타태그 누락

- `window` 객체 체크 추가: `typeof window !== 'undefined'`
- 서버에서 HelmetProvider context 설정 확인

## 참고 자료

- **@dr.pogodin/react-helmet 공식 문서:** https://github.com/birdofpreyru/react-helmet
- **GitHub 이슈 #254:** https://github.com/staylor/react-helmet-async/issues/254
- **React 19 릴리즈 노트:** https://react.dev/blog/2024/04/25/react-19
- **Open Graph 프로토콜:** https://ogp.me/
- **Twitter Cards 가이드:** https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
