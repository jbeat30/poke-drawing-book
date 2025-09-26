# 페이지 이동 가이드

## 왜 React Router가 필요한가?

### 일반 웹사이트 vs React 앱

```
일반 웹사이트:
- 페이지마다 별도 HTML 파일
- 링크 클릭 시 서버에서 새 페이지 다운로드
- 페이지 전체가 새로고침됨

React 앱 (SPA):
- 하나의 HTML 파일에서 모든 페이지 처리
- 링크 클릭 시 JavaScript로 화면만 바뀜
- 빠르고 부드러운 사용자 경험
```

**React Router = React 앱에서 페이지 이동을 관리해주는 도구**

## 기본 개념 이해하기

### 1. 라우터(Router) - 전체 관리자

```tsx
// 앱 전체를 감싸서 페이지 이동 기능을 활성화
<BrowserRouter>
  <App />
</BrowserRouter>
```

### 2. 라우트(Route) - 페이지 정의

```tsx
// "이 주소로 오면 이 컴포넌트를 보여줘"
<Route path="/" element={<HomePage />} />           // 메인 페이지
<Route path="/pokemon/pikachu" element={<DetailPage />} />  // 상세 페이지
```

### 3. 네비게이션 - 페이지 이동 방법

```tsx
// 방법 1: 링크 클릭 (HTML의 <a> 태그와 비슷)
;<Link to="/pokemon/pikachu">피카츄 보기</Link>

// 방법 2: 버튼 클릭이나 함수에서 이동
const navigate = useNavigate()
navigate('/pokemon/pikachu') // 피카츄 페이지로 이동
```

## 우리 프로젝트 구조 이해하기

### 현재 페이지 구성

```
/ (홈페이지)
├── 포켓몬 목록 표시
├── 검색 기능
└── 포켓몬 클릭 → 상세 페이지로 이동

/pokemon/:name (상세 페이지)
├── 선택한 포켓몬의 자세한 정보
├── 뒤로가기 버튼
└── 뒤로가기 → 홈페이지로 돌아감
```

### 실제 코드에서 보기

**1. 라우터 설정 (src/App.tsx)**

```tsx
function App() {
  return (
    <BrowserRouter>
      {' '}
      {/* 1. 전체 앱을 라우터로 감싸기 */}
      <Routes>
        {' '}
        {/* 2. 페이지들을 모아두는 컨테이너 */}
        <Route path="/" element={<HomePage />} /> {/* 홈페이지 */}
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />{' '}
        {/* 상세페이지 */}
      </Routes>
    </BrowserRouter>
  )
}
```

**2. 페이지 이동하기 (HomePage에서)**

```tsx
const navigate = useNavigate() // 페이지 이동 도구 가져오기

const handlePokemonClick = (pokemonName) => {
  // 포켓몬 카드 클릭 시 상세 페이지로 이동
  navigate(`/pokemon/${pokemonName}`) // 예: /pokemon/pikachu
}
```

**3. 뒤로가기 구현 (DetailPage에서)**

```tsx
const navigate = useNavigate()

const handleGoBack = () => {
  navigate('/') // 홈페이지로 돌아가기
}
```

## 주소창의 비밀 - URL 파라미터

### :name이 뭔가요?

```tsx
<Route path="/pokemon/:name" element={<PokemonDetailPage />} />
```

- `:name`은 **변수**
- `/pokemon/pikachu` → name = "pikachu"
- `/pokemon/charizard` → name = "charizard"

### 페이지에서 이 값 사용하기

```tsx
function PokemonDetailPage() {
  const { name } = useParams() // URL에서 name 값 가져오기

  console.log(name) // "pikachu" 또는 "charizard"

  // 이 name으로 포켓몬 정보 가져오기
  const pokemon = usePokemonDetail(name)
}
```

## 레이아웃 시스템 - 공통 부분 관리

### 문제: 모든 페이지에 똑같은 헤더가 필요

```tsx
// ❌ 각 페이지마다 헤더를 복사-붙여넣기 (비효율적)
function HomePage() {
  return (
    <div>
      <header>포켓몬 도감</header> {/* 중복 */}
      <main>홈페이지 내용</main>
    </div>
  )
}

function DetailPage() {
  return (
    <div>
      <header>포켓몬 도감</header> {/* 중복 */}
      <main>상세페이지 내용</main>
    </div>
  )
}
```

### 해결: MainLayout 컴포넌트 만들기

```tsx
// ✅ 공통 부분을 하나의 컴포넌트로 만들기
function MainLayout({ children, showSearch = true }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      {/* 헤더 - 모든 페이지에 공통 */}
      <header className="sticky top-0">
        <h1>포켓몬 도감</h1>
        {showSearch && <SearchBar />} {/* 검색바는 선택적 */}
      </header>

      {/* 메인 내용 - 페이지마다 다름 */}
      <main>
        {children} {/* 여기에 각 페이지 내용이 들어감 */}
      </main>
    </div>
  )
}
```

### 각 페이지에서 사용하기

```tsx
// 홈페이지 - 검색바 있음
function HomePage() {
  return (
    <MainLayout showSearch={true}>
      <div>포켓몬 목록...</div>
    </MainLayout>
  )
}

// 상세페이지 - 검색바 없음
function DetailPage() {
  return (
    <MainLayout showSearch={false}>
      <div>포켓몬 상세정보...</div>
    </MainLayout>
  )
}
```

## 사용자 경험 개선하기

### 1. 스크롤 위치 기억하기

**문제**: 홈페이지에서 스크롤 내리고 포켓몬 클릭 → 상세페이지 → 뒤로가기 하면 맨 위로 올라가있음

**해결**: 스크롤 위치를 저장해두고 돌아올 때 복원

```tsx
// 홈페이지에서
const handlePokemonClick = (name) => {
  setScrollPosition(window.scrollY) // 현재 스크롤 위치 저장
  navigate(`/pokemon/${name}`)
}

// 상세페이지에서 돌아올 때
const handleGoBack = () => {
  navigate('/')
  setTimeout(() => {
    window.scrollTo(0, scrollPosition) // 저장된 위치로 복원
  }, 100)
}
```

### 2. 검색어 유지하기

**문제**: 검색하고 포켓몬 클릭 → 뒤로가기 하면 검색어가 사라짐

**해결**: 검색어를 전역 상태로 관리 (Zustand 사용)

```tsx
// 검색어를 앱 전체에서 공유
const { searchTerm, setSearchTerm } = useAppStore()

// 홈페이지에서 검색
<SearchBar value={searchTerm} onChange={setSearchTerm} />

// 상세페이지에서 돌아와도 검색어 그대로 유지됨
```

## 동적 SEO - 검색엔진 최적화

### 문제: 모든 페이지 제목이 똑같음

```html
<!-- 홈페이지든 상세페이지든 항상 같음 -->
<title>포켓몬 도감 미니</title>
```

### 해결: 페이지별로 다른 제목 설정

```tsx
// 홈페이지
<SEOHead />
// → <title>포켓몬 도감 미니</title>

// 피카츄 상세페이지
<SEOHead title="피카츄" />
// → <title>피카츄 | 포켓몬 도감 미니</title>
```

## 실제 사용 예시

### 포켓몬 카드 클릭했을 때 일어나는 일

```tsx
// 1. 사용자가 피카츄 카드 클릭
;<PokemonCard onClick={() => handlePokemonClick('pikachu')} />

// 2. 클릭 핸들러 실행
const handlePokemonClick = (name) => {
  setScrollPosition(window.scrollY) // 현재 위치 저장
  navigate(`/pokemon/${name}`) // /pokemon/pikachu로 이동
}

// 3. React Router가 URL 변경 감지
// 4. PokemonDetailPage 컴포넌트 렌더링
// 5. useParams()로 "pikachu" 값 추출
// 6. 피카츄 데이터 로딩 및 화면 표시
```

### 뒤로가기 버튼 클릭했을 때

```tsx
// 1. 뒤로가기 버튼 클릭
;<button onClick={handleGoBack}>돌아가기</button>

// 2. 핸들러 실행
const handleGoBack = () => {
  navigate('/', { replace: true }) // 홈페이지로 이동
  setTimeout(() => {
    window.scrollTo(0, scrollPosition) // 이전 스크롤 위치로 복원
  }, 100)
}

// 3. 홈페이지 렌더링
// 4. 검색어와 스크롤 위치 복원
// 5. 사용자는 이전 상태 그대로 확인
```

## 자주 하는 실수와 해결법

### 1. 새로고침하면 404 에러

**원인**: 서버가 `/pokemon/pikachu` 경로를 모름
**해결**: Vite 설정에서 모든 경로를 index.html로 리다이렉트

### 2. 뒤로가기가 작동하지 않음

**원인**: `navigate('/', { replace: true })` 사용
**해결**: 히스토리 스택 관리 이해하기

### 3. 페이지 이동 시 스크롤이 맨 위로 안 감

**원인**: React Router는 자동으로 스크롤을 맨 위로 이동시키지 않음
**해결**: `useEffect`로 수동 처리

```tsx
useEffect(() => {
  window.scrollTo(0, 0) // 페이지 이동 시 맨 위로
}, [pathname]) // 경로가 바뀔 때마다 실행
```

## 정리

1. **React Router** = React 앱에서 페이지 이동을 관리하는 도구
2. **BrowserRouter** = 전체 앱을 감싸는 관리자
3. **Route** = "이 주소면 이 페이지 보여줘"
4. **useNavigate** = 함수에서 페이지 이동하기
5. **useParams** = 주소창에서 변수 값 가져오기
6. **MainLayout** = 공통 부분을 재사용하는 컴포넌트
7. **상태 관리** = 페이지 이동해도 데이터 유지하기
