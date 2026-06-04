---
name: eatBusan
description: 부산 맛집 후기를 사진 중심으로 공유·탐색하는 모바일 우선 커뮤니티 앱
colors:
  primary: "#0277BD"
  primary-deep: "#01579B"
  secondary: "#FF7043"
  secondary-deep: "#E64A19"
  success: "#43A047"
  warning: "#FB8C00"
  error: "#E53935"
  info: "#039BE5"
  background: "#FAFAFA"
  surface: "#FFFFFF"
  ink: "#1A1A1A"
  muted: "#666666"
  border: "#E0E0E0"
typography:
  display:
    fontFamily: "Roboto, system-ui, 'Segoe UI', sans-serif"
    fontSize: "2.125rem"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Roboto, system-ui, 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "Roboto, system-ui, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Roboto, system-ui, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto, system-ui, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-outlined:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  card-outlined:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "48px"
---

# Design System: eatBusan

## 1. Overview

**Creative North Star: "맑은 바다 한 컷"**

eatBusan은 낮의 부산 해변처럼 밝고 산뜻한 화면 위에서, 사용자가 올린 음식 사진 한 컷이 주인공이 되는 시스템이다. 바다 블루(#0277BD)가 신뢰와 위치·정보의 축을 잡고, 코랄(#FF7043)이 식욕과 반응(좋아요·태그)의 포인트를 찍는다. UI 자체는 조용한 무대다. 테두리·여백·플랫한 표면이 사진을 가두지 않고 받쳐주며, 색은 행동(주요 버튼, 현재 선택, 상태)에만 쓰고 장식으로 흩뿌리지 않는다.

이 시스템이 명시적으로 거부하는 것: **관공서 지자체 관광 사이트의 딱딱한 정보 나열**, **손 안 댄 Material 기본 데모 룩**(기본 그림자·기본 카드 그리드 그대로), **쿠폰·배너 범벅의 커머스/배달앱 화면**, **음식 앱답지 않게 차갑고 채도 없는 B2B SaaS 톤**. 친구가 "여기 가봤는데 괜찮더라" 하고 사진 한 장 보여주는 가벼운 설렘이 기준이고, 행정 문체나 과장 마케팅 카피는 둘 다 아니다.

**Key Characteristics:**
- 사진이 화면에서 가장 강한 요소; 크롬은 사진을 받치는 무대
- 밝은 표면(#FAFAFA / #FFFFFF) + 절제된 바다 블루·코랄 포인트
- 기본은 플랫·테두리 중심, 그림자는 상태(hover/focus)에만
- 모바일 우선: 한 손 도달, 최소 44px 터치 타깃
- 색은 행동과 상태에만, 장식 금지

## 2. Colors

밝은 중립 표면 위에서 바다 블루가 구조를, 코랄이 식욕과 반응의 포인트를 맡는 2-색 시스템이다.

### Primary
- **바다 블루 (Coastal Blue, #0277BD)**: 앱 바, 주요 버튼(작성·등록·확인), 링크, 로딩 인디케이터, 현재 선택 상태. 흰 텍스트와 대비 4.8:1로 본문 AA 통과. 신뢰·위치·정보의 축.
- **딥 블루 (Deep Tide, #01579B)**: primary 버튼의 hover/pressed 상태. 정적 상태에서는 쓰지 않는다.

### Secondary
- **코랄 (Busan Coral, #FF7043)**: 식욕·반응의 포인트. 좋아요 아이콘(활성), 기능 강조 아이콘, 배지, 코랄 칩. 식욕을 돋우는 따뜻함을 이 색 하나로 낸다.
- **딥 코랄 (Deep Coral, #E64A19)**: 코랄 위에 **흰 텍스트**가 올라가야 하는 경우(텍스트 버튼 등)에만 사용. 순수 #FF7043은 흰 텍스트 대비가 ~2.7:1로 AA에 미달하므로 텍스트 운반용으로 쓰지 않는다.

### Neutral
- **잉크 (Ink, #1A1A1A)**: 본문·제목 텍스트. 코랄 표면 위 텍스트도 이 색(대비 6.5:1).
- **뮤트 (Muted, #666666)**: 보조 텍스트·캡션·타임스탬프(`text-medium-emphasis`). 흰 배경 대비 5.7:1. 이보다 더 옅게 내리지 않는다.
- **배경 (Canvas, #FAFAFA)**: 앱 본문 배경. 흰 카드와 미묘한 단차를 만든다.
- **표면 (Surface, #FFFFFF)**: 카드·입력·시트 표면.
- **보더 (Hairline, #E0E0E0)**: outlined 카드·입력의 1px 테두리, 구분선.

### Named Rules
**The Action-Only Color Rule.** 바다 블루와 코랄은 행동·선택·상태에만 쓴다. 배경을 칠하거나 섹션을 구분하려고 색을 뿌리는 것은 금지. 큰 색면이 필요하면 그 자리는 사진이 차지한다.

**The Coral-Text Rule.** 코랄(#FF7043) 위 텍스트는 항상 잉크(#1A1A1A). 흰 텍스트가 꼭 필요하면 색을 딥 코랄(#E64A19)로 내린다. 순수 코랄 + 흰 텍스트 조합은 금지.

## 3. Typography

**Display / Body Font:** Roboto (with system-ui, 'Segoe UI', sans-serif fallback)
**Mono Font:** 사용 안 함 (코드·데이터 표시 화면 없음)

**Character:** 한 가지 잘 조율된 산세리프(Roboto)가 제목·버튼·라벨·본문·캡션을 모두 운반한다. 디스플레이용 별도 서체를 두지 않는다. 위계는 서체 대비가 아니라 크기·굵기 대비로 만든다(Material 타입 스케일 기반). 음식 앱은 사진이 화면의 표정이므로, 타이포는 또렷하고 중립적으로 비켜선다.

### Hierarchy
- **Display** (700, 2.125rem / 34px, line-height 1.18): 페이지 최상단 제목. Vuetify `text-h4 font-weight-bold`. 한 화면에 하나.
- **Headline** (500, 1.25rem / 20px, line-height 1.3): 섹션 제목. Vuetify `text-h6`.
- **Title** (500, 1rem / 16px): 카드 제목, 리스트 항목 제목. Vuetify `text-subtitle-1` / `v-card-title`.
- **Body** (400, 1rem / 16px, line-height 1.5): 본문. 산문은 한 줄 65–75ch 이내. Vuetify `text-body-1`.
- **Label** (500, 0.875rem / 14px, letter-spacing 0.01em): 버튼·칩·보조 텍스트. Vuetify `text-body-2` / 버튼 라벨. 캡션은 `text-caption text-medium-emphasis`.

### Named Rules
**The One-Family Rule.** Roboto 한 종으로 통일한다. 디스플레이 서체·장식 서체를 추가하지 않는다. 위계는 크기·굵기로만.

**The No-Shout Rule.** 본문에 대문자 문장 금지. 대문자는 짧은 라벨·배지(≤4단어)에만. 제목은 34px(2.125rem)를 넘기지 않는다.

## 4. Elevation

기본은 **플랫**이다. 카드·입력·시트는 정적 상태에서 그림자 없이 1px 테두리(#E0E0E0)와 배경 단차(#FAFAFA 본문 vs #FFFFFF 표면)로 깊이를 표현한다. 그림자는 오직 **상태 변화에 대한 응답**으로만 등장한다: 카드 hover, 들어 올린 메뉴/다이얼로그, 포커스. Material 기본 카드의 상시 드롭섀도(`elevation`)를 그대로 쓰는 순간이 "데모 룩"이며, 이 시스템에서는 실패다.

### Shadow Vocabulary
- **Hover Lift** (`box-shadow: 0 6px 16px -4px rgba(2, 119, 189, 0.18)`): 후기 카드·기능 카드 hover 시. 바다 블루 기를 머금은 부드러운 들림.
- **Overlay** (`box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.22)`): 다이얼로그·메뉴 등 본문 위로 떠오른 레이어.

### Named Rules
**The Flat-By-Default Rule.** 표면은 쉴 때 플랫하다. 그림자는 상태(hover·elevation·focus)에 대한 응답으로만 나타난다. 상시 그림자가 보이면 그 카드는 잘못 만들어진 것이다.

## 5. Components

모든 인터랙티브 컴포넌트는 default·hover·focus·active·disabled·loading 상태를 갖춘다. Vuetify 컴포넌트를 쓰되 기본값에 머물지 않고, 위 토큰·규칙으로 조율한다. 화면 간 같은 역할의 컨트롤은 같은 모양을 유지한다.

### Buttons
- **Shape:** 살짝 둥근 모서리(4px). 높이 44px(터치 타깃 최소치).
- **Primary:** 바다 블루(#0277BD) 배경 + 흰 텍스트. 작성·등록·확인 등 주요 행동. Vuetify `color="primary"`.
- **Secondary:** 코랄(#FF7043) 배경 + **잉크 텍스트**(흰 텍스트 금지, Coral-Text Rule). 보조 강조 행동. 흰 텍스트가 필요하면 `secondary-deep`.
- **Outlined / Text:** 흰 배경 + 바다 블루 테두리/텍스트. 낮은 위계 행동·취소.
- **Hover / Focus:** primary는 딥 블루(#01579B)로, 150–200ms 전환. focus-visible은 2px 바다 블루 아웃라인 + 2px offset.
- **Disabled:** 채도를 빼고 회색조로. 비활성 상태에 풀채도 색 금지.

### Chips
- **Style:** pill 형태(9999px). 코랄 칩은 `secondary` 채움 + 잉크 텍스트, 또는 코랄 테두리 + 코랄 텍스트(연한 코랄 배경 rgba 위).
- **State:** 선택은 채움, 비선택은 테두리. 색만이 아니라 채움 여부로도 구분.

### Cards / Containers
- **Corner Style:** 8px(`rounded="lg"` / `rounded.md`). Hero 시트도 동일.
- **Background:** 흰 표면(#FFFFFF), 본문 배경은 #FAFAFA.
- **Shadow Strategy:** Elevation 참조 — 기본 플랫·테두리, hover 시 Hover Lift.
- **Border:** 1px #E0E0E0(`variant="outlined"`).
- **Internal Padding:** 16px(`pa-4`). 카드 사이 간격 8–16px.
- **후기 카드:** 사진이 카드 폭을 꽉 채우고(상단), 텍스트는 그 아래 16px 패딩. 사진을 작은 썸네일로 가두지 않는다.

### Inputs / Fields
- **Style:** 흰 배경, 1px 테두리, 4px 라운드, 높이 48px. Vuetify `v-text-field` / `v-textarea`.
- **Focus:** 테두리가 바다 블루로 전환 + 얇은 글로우. placeholder는 뮤트(#666)로 대비 유지(옅은 회색 금지).
- **Error:** 테두리·헬퍼 텍스트 error(#E53935). 에러는 색과 텍스트를 함께.

### Navigation
- **Top App Bar:** 바다 블루(#0277BD) 배경 + 흰 텍스트, `density="comfortable"`. 좌측 "eatBusan" 타이틀이 홈 링크. 모바일에서 동일 바 유지, 필요 시 하단 탭/햄버거로 확장.

### Loading & Empty States
- **Loading:** 콘텐츠 자리에는 스피너가 아니라 **스켈레톤**(사진 자리·텍스트 자리 형태 유지)을 우선. 짧은 액션 피드백에만 `v-progress-circular`.
- **Empty:** "아무것도 없음"이 아니라 다음 행동을 가르친다. 예: "첫 후기를 남겨보세요" + 작성 버튼.

## 6. Do's and Don'ts

### Do:
- **Do** 음식 사진을 화면에서 가장 큰·강한 요소로 둔다. 후기 카드는 사진이 폭을 꽉 채우게 한다.
- **Do** 색(바다 블루·코랄)은 주요 행동·현재 선택·상태에만 쓴다(Action-Only Color Rule).
- **Do** 코랄 위 텍스트는 잉크(#1A1A1A)로, 흰 텍스트가 필요하면 딥 코랄(#E64A19)로 내린다(Coral-Text Rule).
- **Do** 표면은 기본 플랫·1px 테두리, 그림자는 hover/focus 상태에만(Flat-By-Default Rule).
- **Do** Roboto 한 종으로 통일하고 위계는 크기·굵기로 만든다(One-Family Rule).
- **Do** 터치 타깃 최소 44px, 모바일 한 손 조작을 먼저 고려한다.
- **Do** 로딩은 스켈레톤, 빈 상태는 다음 행동을 가르치는 카피로.
- **Do** 모션은 150–250ms 상태 전환 위주. `prefers-reduced-motion`에 크로스페이드/즉시 전환 대안을 둔다.

### Don't:
- **Don't** 손 안 댄 Material 기본 데모 룩으로 두지 않는다 — 상시 드롭섀도 카드, 기본 elevation, 똑같은 아이콘+제목+텍스트 카드 그리드 반복 금지.
- **Don't** 관공서 지자체 관광 사이트식 딱딱한 정보 나열 레이아웃을 만들지 않는다.
- **Don't** 쿠폰·배너·팝업으로 후기와 사진 사이를 끊는 커머스/배달앱 화면을 만들지 않는다.
- **Don't** 음식 앱을 차갑고 채도 없는 B2B SaaS 톤으로 만들지 않는다.
- **Don't** 순수 코랄(#FF7043) 위에 흰 텍스트를 올리지 않는다(대비 ~2.7:1, AA 미달).
- **Don't** 보조 텍스트를 #666보다 더 옅게 내리지 않는다(대비 확보).
- **Don't** 1px를 초과하는 좌/우 컬러 스트라이프 보더, 그라디언트 텍스트, 장식용 글래스모피즘, 모든 섹션 위 대문자 eyebrow를 쓰지 않는다.
- **Don't** 색만으로 상태(좋아요·에러 등)를 전달하지 않는다 — 아이콘/형태/텍스트를 함께 쓴다.
