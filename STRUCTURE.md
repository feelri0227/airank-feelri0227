# AI뭐써? — 코드 구조 문서

> 실시간 AI 도구 랭킹 사이트. SNS 트렌드 점수 기반으로 한국 사용자 관점에서 AI 도구를 평가합니다.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Vite + React 18 (plain JS) |
| 스타일링 | CSS 변수 (인라인 스타일, GlobalStyles) |
| 인증 | Firebase Auth (Google OAuth, signInWithPopup) |
| DB | Firebase Firestore (bookmarks 컬렉션) |
| 배포 | Cloudflare Pages (GitHub 자동 배포) |
| 폰트 | Outfit (제목) + Pretendard (본문) |
| 디자인 | Indigo #6366f1 + Cyan #06b6d4 / 라이트·다크 테마 |

---

## 폴더 구조

```
airank-feelri0227/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── scores.json              # GitHub Actions가 갱신하는 실시간 점수
├── scripts/
│   └── fetch-scores.js          # Naver/YouTube/Google/GitHub 점수 수집 스크립트
├── .github/workflows/
│   └── update-scores.yml        # 매일 KST 04:00 자동 실행 크론
└── src/
    ├── main.jsx                 # 앱 진입점 (AuthProvider 래핑)
    ├── App.jsx                  # 루트 컴포넌트 (상태 관리 중심)
    ├── firebase.js              # Firebase 초기화 (auth, provider, db)
    ├── constants/
    │   └── index.js             # NAV_ITEMS, CATEGORIES, LIFE_FILTERS, SORT_OPTIONS, TICKER_ITEMS
    ├── data/
    │   └── tools.js             # TOOLS_DATA (100개), WIZARD_Q1, WIZARD_Q2
    ├── utils/
    │   └── index.js             # getScoreColor, getScoreTextColor, getRankBadge
    ├── context/
    │   └── AuthContext.jsx      # Google 로그인 상태 전역 관리
    ├── styles/
    │   └── GlobalStyles.jsx     # CSS 변수, 키프레임, 반응형 미디어쿼리
    └── components/
        ├── layout/
        │   ├── Navbar.jsx       # 상단 네비게이션 + 로그인 + 북마크 드롭다운
        │   ├── TickerBar.jsx    # 트렌드 뉴스 무한 스크롤 티커
        │   ├── Footer.jsx       # 하단 푸터
        │   └── BackgroundEffects.jsx  # 배경 그라데이션 효과
        ├── ui/
        │   ├── Logo.jsx         # 로고 컴포넌트
        │   └── ThemeToggle.jsx  # 라이트/다크 토글 버튼
        ├── hero/
        │   └── HeroSection.jsx  # 메인 슬로건 + 검색바 + 마법사 버튼
        ├── filters/
        │   └── FilterBar.jsx    # 카테고리·직업군·정렬 필터 바
        ├── tools/
        │   ├── ToolCard.jsx     # AI 도구 카드 (점수·태그·SNS 숫자)
        │   └── SnsScoreBars.jsx # (미사용)
        ├── sidebar/
        │   ├── LeftSidebar.jsx  # 왼쪽 사이드바 (TOP3 + 급상승)
        │   └── RightSidebar.jsx # 오른쪽 사이드바 (뉴스·태그)
        └── modals/
            ├── ToolDetailModal.jsx    # 도구 상세 모달 (점수·기능·북마크·스파크라인)
            ├── WizardModal.jsx        # AI 찾기 3단계 마법사
            ├── CompareModal.jsx       # (미사용)
            └── CompareFloatingBar.jsx # (미사용)
```

---

## 주요 파일 설명

### `src/App.jsx`
앱의 상태 관리 허브.

| 상태 | 설명 |
|------|------|
| `theme` | 라이트/다크 테마 |
| `activeMenu` | 현재 활성 메뉴 |
| `searchQuery` | 검색 입력값 |
| `category` | 카테고리 필터 |
| `lifeFilter` | 직업군 필터 |
| `sortBy` | 정렬 방식 (score/growth/name) |
| `visibleCount` | 현재 표시 중인 카드 수 (더보기) |
| `selectedTool` | 상세 모달에 열린 도구 |
| `tools` | 전체 도구 데이터 (scores.json과 병합) |

- 앱 로드 시 `/scores.json` fetch → tools state에 병합 (실패해도 하드코딩 값 유지)
- `filteredTools`: useMemo로 카테고리·직업군·검색·정렬 필터링
- 초기 visibleCount: 768px 이상 20개, 미만 10개 / 더보기 클릭 시 10씩 증가

---

### `src/constants/index.js`

| 상수 | 내용 |
|------|------|
| `NAV_ITEMS` | 상단 메뉴 7개 (랭킹·도구디렉토리·커뮤니티·갤러리·프롬프트·뉴스·AI게임) |
| `CATEGORIES` | 카테고리 9개 (전체·텍스트·이미지·코딩·영상·오디오·검색·생산성·디자인) |
| `LIFE_FILTERS` | 직업군 7개 (전체·직장인·프리랜서·대학생·크리에이터·마케터·스타트업) |
| `SORT_OPTIONS` | 정렬 3개 (SNS 점수순·성장률순·이름순) |
| `TICKER_ITEMS` | 티커 뉴스 더미 데이터 8개 |

---

### `src/data/tools.js`
100개 AI 도구 데이터. 각 도구의 필드:

```js
{
  id,        // 고유 번호
  cat,       // 카테고리 (text/image/code/video/audio/search/productivity/design)
  icon,      // 이모지 (favicon 실패 시 폴백)
  name,      // 도구 이름
  free,      // 무료 여부 (boolean)
  desc,      // 한 줄 설명
  url,       // 공식 사이트 URL
  features,  // 핵심 기능 5개 (배열)
  tags,      // 태그 배열 (무료/유료 포함이나 카드에는 미표시)
  score,     // SNS 종합 점수 (0~100)
  change,    // 7일 변화율 (%)
  sns: { naver, youtube, google, github },  // 플랫폼별 점수
  life,      // 해당 직업군 배열
}
```

**카테고리별 도수**: 텍스트(16) · 이미지(14) · 코딩(12) · 영상(12) · 오디오(9) · 검색(7) · 생산성(19) · 디자인(11)

---

### `src/utils/index.js`

| 함수 | 설명 |
|------|------|
| `getScoreColor(score)` | 점수 구간별 그라데이션 색상 (점수 바용) |
| `getScoreTextColor(score)` | 점수 구간별 단색 (텍스트용) |
| `getRankBadge(rank)` | 1→🥇 2→🥈 3→🥉 4+→숫자 |

---

### `src/firebase.js`
Firebase 초기화. `auth`, `provider`(GoogleAuthProvider), `db`(Firestore) export.

- 프로젝트 ID: `airank-9c19a`
- Firestore 리전: `asia-northeast3` (서울)

---

### `src/context/AuthContext.jsx`
Google 로그인 상태를 전역 관리.

- `signInWithPopup` 사용 (signInWithRedirect는 Cloudflare Pages 크로스오리진 스토리지 문제로 사용 불가)
- `user`, `loading`, `login()`, `logout()` 제공

---

## 컴포넌트 상세

### `Navbar.jsx`
- 로그인 전: Google 로그인 버튼
- 로그인 후: 프로필 사진 + 이름 클릭 시 드롭다운
  - 북마크 목록 (Firestore 실시간 fetch)
  - 북마크 클릭 → `onOpenTool` 콜백으로 ToolDetailModal 오픈
  - 로그아웃 버튼

### `FilterBar.jsx`
3행 레이아웃 (모바일 최적화):
1. **카테고리** — 가로 스크롤 pill 버튼
2. **직업군** — 가로 스크롤 gold pill 버튼
3. **정렬** — 우측 정렬 (SNS 점수순 / 성장률순 / 이름순)

### `ToolCard.jsx`
카드 구성 (위→아래):
1. favicon(28px) + 도구명 + 메달(rank badge)
2. 설명 (2줄 클램프)
3. 종합 점수 + 태그 + ▲/▼ 변화율
4. 점수 바 (5px)
5. SNS 숫자: 네이버(초록) · YouTube(빨강) · Google(파랑) · GitHub(보라)

- 아이콘: `https://www.google.com/s2/favicons?domain=...&sz=64`, 실패 시 이모지 폴백

### `ToolDetailModal.jsx`
카드 클릭 시 열리는 상세 모달:
- ♥/♡ 북마크 버튼 (Firestore 연동)
- favicon(40px) + 이름 + 랭크 배지
- 7일 추이 스파크라인 (SVG, tool.id 기반 의사난수)
- 종합 점수 + 변화율
- SNS 플랫폼별 점수 바
- 핵심 기능 5개
- 태그 목록
- 공식 사이트 바로가기 링크

---

## 점수 시스템

### 공식
```
score = 네이버×0.25 + YouTube×0.25 + Google×0.25 + GitHub×0.25
```

### 데이터 수집 파이프라인
| 단계 | 내용 |
|------|------|
| 수집 | `scripts/fetch-scores.js` — Naver DataLab API, YouTube Trends, Google Trends, GitHub API |
| 스케줄 | GitHub Actions 크론, 매일 UTC 19:00 (KST 04:00) |
| 저장 | `public/scores.json` |
| 적용 | 앱 로드 시 fetch → tools state 병합 |

- YouTube/Google Trends: 영어 키워드 + 한국어 키워드 각각 수집 후 평균
- 비활성 플랫폼은 나머지에 가중치 재분배
- 필요 Secrets: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`

---

## 반응형 레이아웃

| 브레이크포인트 | 변화 |
|----------------|------|
| 1100px 이하 | 왼쪽 사이드바 숨김, 오른쪽 사이드바 표시 |
| 768px 이하 | Navbar 가로 스크롤, FilterBar 가로 스크롤 |

---

## 배포

- **GitHub**: `feelri0227/airank-feelri0227` (branch: main)
- **Cloudflare Pages**: https://airank-feelri0227.pages.dev/
- push → 자동 빌드·배포
- 빌드 명령: `npm run build` / 출력: `dist/`

---

## Firebase 설정 주의사항

- `signInWithRedirect`는 Cloudflare Pages에서 동작 안 함 → `signInWithPopup` 사용
- Firestore 북마크: `bookmarks` 컬렉션, 문서 ID = `${uid}_${toolId}`
- 현재 테스트 모드 (30일 후 보안 규칙 업데이트 필요)
- Firebase 콘솔 → Authentication → 승인된 도메인에 `airank-feelri0227.pages.dev` 등록 필수
