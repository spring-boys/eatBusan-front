# UI Kit — 재사용 컴포넌트·패턴 카탈로그 (eatBusan)

> **새로 만들기 전에 여기부터 본다.** 같은 역할의 컴포넌트/패턴이 이미 있으면 그걸 재사용·모방한다.
> 목적: 여러 사람·AI가 따로 개발해도 버튼 하나, 빈 상태 하나까지 같은 모양으로 나오게 하는 것.
> 토큰(색/폰트/간격) 정의는 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)에 있다. 여기선 **조립된 UI 단위**를 다룬다.

---

## 1. 앱 셸 (레이아웃 골격)

**`src/App.vue`** — 모든 화면이 이 안에 들어간다. 새 페이지는 셸을 다시 만들지 말고 `router-view`로 들어오게만 한다.
셸은 **iPhone 비율(9:19.5) 디바이스**로, 페이지 높이를 꽉 채우고 폭은 비율로 derive된다(고정 px 폭 아님).

| 부분 | 클래스 | 역할 |
|------|--------|------|
| 디바이스 | `.device` | iPhone 비율 셸. flex 컬럼, `overflow:hidden`. 모바일=전체화면, 데스크탑=세로 폰 |
| 상단바 | `.appbar` | 좌측 로고(`BrandMark`, 홈 링크), 우측 **로그인** 버튼(`/login`). 스크롤 시 그림자 |
| 본문 | `.viewport` | **내부 스크롤 영역.** `router-view` 컨테이너 — **여기에 1열로 콘텐츠를 쌓는다** |
| 하단탭 | `.bottomnav` | 홈 / 둘러보기 / 마이페이지 (3개 고정) |

- 상단바·하단탭은 셸 안에 flex로 고정(`flex:0 0 auto`), 본문만 스크롤. `z-index`: 바 = 10.
- 전체화면 페이지(로그인 등)는 라우트 `meta: { chrome: false }` → 상단바·하단탭 숨김. 예: `features/auth/views/LoginView.vue`.

---

## 2. 공통 컴포넌트 (`src/shared/`)

| 컴포넌트 | 위치 | 용도 |
|------|------|------|
| `BrandMark` | `shared/components/BrandMark.vue` | 워드마크 로고(eatBusan + 곡선 + 혓바닥). 브랜드 표기는 이걸 쓴다 |
| `useInfiniteScroll` | `shared/composables/useInfiniteScroll.js` | 목록 무한 스크롤 |
| `formatDistance` | `shared/utils/geo.js` | 거리(m) → "320m"/"1.2km" 표기. 위치 계산도 여기 |
| time 유틸 | `shared/utils/time.js` | 상대 시간 표기 |
| `client` | `shared/api/client.js` | **모든 API의 axios 인스턴스** (토큰 주입·에러 처리). api/는 이걸 import |

---

## 3. 재사용 UI 패턴 (코드 모방 기준)

각 패턴은 아래 파일을 **그대로 모방**해 만든다. 색·간격은 절대 새로 정하지 않는다.

### 세그먼트 컨트롤 (모드 토글)
- 기준: `features/place/views/PlaceListView.vue` `.segment` / `.seg-btn`
- 용도: 2~3개 상호배타 모드 전환(내 주변 / 지역별 처럼). 탭바와 혼동 금지.

### Pill 버튼 (보조 액션·필터)
- 기준: `PlaceListView.vue` `.locpill` / `.distpill` (가넷 틴트 배경 + `--brand-deep` 텍스트)
- 용도: 위치 켜기, 지역 선택 같은 인라인 보조 행동.

### 리스트 행 (항목 한 줄)
- 기준: `features/place/components/PlaceListItem.vue`
- 구성: 순위 → 썸네일(정사각) → 제목·별점·메타 → chevron. 탭 시 상세 이동.

### 히어로/피처드 카드 (1위 강조)
- 기준: `features/place/components/PlaceFeaturedCard.vue`
- 구성: 큰 사진 + scrim 그라데이션 + 좌상단 태그 + 하단 제목/별점. 목록 맨 위 1개에만.

### 후기/피드 카드
- 기준: `features/post/components/PostCard.vue` (+ `PostCardSkeleton.vue`)
- 사진 중심. 좋아요(로즈)·댓글 진입 포함.

### 바텀시트 (선택·입력 오버레이)
- 기준: `features/place/components/DistrictSheet.vue`, `features/comment/components/CommentSheet.vue`
- 용도: 모바일 선택/입력. **모달보다 바텀시트 우선.** 핸들 + 헤더(제목+닫기) + 내용 구조.
- ⚠️ **필수: `attach="#app-shell"` + `contained`.** Vuetify 오버레이는 기본적으로 `<body>`에 `position:fixed`로 붙어
  디바이스 셸 폭을 무시하고 화면 전체로 퍼진다. `v-bottom-sheet`/`v-dialog`/`v-menu` 등 모든 오버레이는
  이 두 prop을 줘서 셸(`#app-shell`) 안에 가두고 폭을 셸에 맞춘다. 안 주면 데스크탑에서 가로로 삐져나온다.

### 칩/배지
- 기준: DistrictSheet의 `.dist-btn--on`(채움=선택), PlaceListItem의 `.place__district`(틴트 배지)
- 선택은 채움, 비선택은 테두리/틴트. 색만이 아니라 채움 여부로도 구분.

---

## 4. 상태 화면 (4종 — 모든 목록/페이지 필수)

| 상태 | 기준 패턴 | 규칙 |
|------|------|------|
| 로딩 | `PlaceListView.vue` `.skel-*` + `<v-skeleton-loader>` | 콘텐츠 자리 형태 유지. 스피너로 때우지 않기 |
| 에러 | `PlaceListView.vue` `.state` (아이콘+문구+재시도 버튼) | 재시도 액션 필수 |
| 빈 상태 | `PlaceListView.vue` `.state` / `MyPageView.vue` | "없음" ❌ → **다음 행동을 가르치는** 카피+버튼 |
| 정상 | 목록/카드 | 사진 중심, 1열 |

빈 상태 카피 예: "첫 후기를 남겨보세요", "OO에 아직 등록된 가게가 없어요 → 지역 바꾸기".

---

## 5. 아이콘·이미지

- 아이콘: **MDI**(`<v-icon icon="mdi-...">`)로 통일. 다른 아이콘셋 혼용 ❌.
- 강조 아이콘 색은 토큰(`color="primary"`/`warning`). 별점 = 허니(`#E8A53D`).
- 이미지는 `<v-img>` (aspect-ratio + cover). placeholder/대체 박스를 항상 둔다(`PlaceListItem`의 `*-ph` 참고).

---

## 6. 새 패턴이 정말 필요할 때

위에 같은 역할이 없을 때만 새로 만든다. 그때도:
1. 토큰(색/간격/폰트)은 DESIGN_SYSTEM의 기존 값으로.
2. 두 번 이상 쓰일 것 같으면 `shared/components/`로 추출하고 이 문서에 한 줄 추가.
3. 상태 4종·터치 타깃·reduced-motion을 갖춘다.
