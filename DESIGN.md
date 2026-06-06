---
name: eatBusan
description: 부산 맛집 후기를 사진 중심으로 공유·탐색하는 모바일 우선 커뮤니티 앱
register: product
colors:
  primary: "#B0234A"
  primary-deep: "#8E1B3A"
  secondary: "#FF3D6A"
  honey: "#E8A53D"
  success: "#15B86B"
  warning: "#E8A53D"
  error: "#DC2626"
  info: "#2C8C8C"
  background: "#FAF6F2"
  surface: "#FFFFFF"
  ink: "#211A17"
  muted: "#6E6661"
  border: "rgba(33, 26, 23, 0.08)"
typography:
  display:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.03em"
  body:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  label:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.01em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "22px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
shell:
  aspectRatio: "9 / 19.5"
  note: "iPhone 비율 디바이스 셸. 페이지 높이를 꽉 채우고 폭은 비율로 derive. 고정 px 폭 아님."
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.surface}"
  pill:
    backgroundColor: "rgba(176, 35, 74, 0.10)"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
    shadow: "0 1px 2px rgba(33,26,23,0.04), 0 6px 16px -10px rgba(33,26,23,0.12)"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "48px"
---

# Design System: eatBusan

> 토큰 값의 1차 출처는 코드(`src/app/vuetify.js`, `src/style.css`)다. 팀 운영용 요약은
> [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md), 재사용 컴포넌트는 [docs/UI_KIT.md](./docs/UI_KIT.md).

## 1. Overview

**Creative North Star: "잘 익은 한 상"**

eatBusan은 따뜻한 아이보리 화면 위에서 사용자가 올린 음식 사진 한 컷이 주인공이 되는 모바일 웹앱이다.
**딥 가넷(#B0234A — 와인·자두·고추장 톤)** 이 행동과 식욕의 축을 잡고, **허니 골드(#E8A53D)** 가 별점·포인트를,
**로즈(#FF3D6A)** 가 좋아요·반응을 찍는다. UI는 조용한 무대다. 테두리·여백·플랫한 표면이 사진을 가두지 않고
받쳐주며, 색은 행동·선택·상태에만 쓰고 장식으로 흩뿌리지 않는다.

이 시스템이 명시적으로 거부하는 것: **주황 탠저린 톤**(과거 안 — '테이블링' 등 주황 식당앱과 정체성이 겹쳐 폐기),
**관공서 관광 사이트의 딱딱한 정보 나열**, **손 안 댄 Material 기본 데모 룩**, **배너·팝업 범벅의 커머스/배달앱 화면**,
**채도 없는 B2B SaaS 톤**. 친구가 "여기 가봤는데 괜찮더라" 하고 사진 한 장 보여주는 가벼운 설렘이 기준이다.

**Key Characteristics:**
- 사진이 화면에서 가장 강한 요소; 크롬은 사진을 받치는 무대
- 따뜻한 아이보리 표면(#FAF6F2 / #FFFFFF) + 절제된 가넷·허니·로즈 포인트
- 모바일 웹앱: **iPhone 비율(9:19.5) 디바이스 셸**, 페이지 높이를 꽉 채우고 폭은 비율로 derive
- 기본 플랫·테두리 중심, 그림자는 상태(hover/elevation)에만
- 한 손 도달, 최소 44px 터치 타깃

## 2. Colors

따뜻한 아이보리 표면 위에서 가넷이 구조·행동을, 허니가 포인트를, 로즈가 반응을 맡는다.

### Primary — 가넷 (Garnet, #B0234A)
앱의 메인 행동(작성·등록·확인), 링크, 현재 선택, 강조. 흰 텍스트와 대비 AA 통과. **딥 가넷(#8E1B3A)** 은
hover/pressed 및 틴트 배경 위 텍스트용.

### Accent — 허니 골드 (Honey, #E8A53D)
별점, 포인트 강조 아이콘. ⚠️ 흰 배경에서 **본문 텍스트로 쓰지 않는다**(대비 미달). 아이콘·큰 라벨·채움 배지에만.

### Reaction — 로즈 (Rose, #FF3D6A)
좋아요/하트 등 반응. 가넷과 구분되는 따뜻한 핑크레드. 본문 텍스트 ❌(아이콘·채움 위 흰 텍스트만).

### Neutral
- **잉크 (Ink, #211A17)**: 본문·제목. 아이보리/흰 위 대비 충분.
- **뮤트 (#6E6661 ≈ ink 62%)**: 보조 텍스트·캡션. 이보다 옅게 내리지 않는다.
- **배경 (#FAF6F2)** / **표면 (#FFFFFF)** / **보더 (ink 8%)**.

### Named Rules
**Action-Only Color Rule.** 가넷·허니·로즈는 행동·선택·상태·별점에만. 배경을 칠하거나 섹션을 나누려고 색을 뿌리지 않는다. 큰 색면은 사진이 차지한다.
**Contrast Rule.** 본문은 잉크로 ≥4.5:1. 허니·로즈는 텍스트 운반 금지. 가넷 틴트(10%) 위 텍스트는 딥 가넷으로.

## 3. Typography

**Font:** Pretendard 한 종(폴백 system-ui). 디스플레이용 별도 서체 없음. 위계는 크기·굵기 대비로만.

### Hierarchy
- **Display** (800, ~34px, lh 1.12, ls -0.045em): 페이지 최상단 제목. 한 화면에 하나.
- **Headline** (700, 20px): 섹션 제목.
- **Title** (700, 16~18px, ls -0.03em): 카드/항목 제목.
- **Body** (400, 16px, lh 1.5): 본문. 산문 65–75ch.
- **Label** (700, 14px): 버튼·칩·탭. 캡션은 뮤트.

### Named Rules
**One-Family Rule.** Pretendard 한 종. **No-Shout Rule.** 본문 대문자 문장 금지; 제목 letter-spacing ≥ -0.045em.

## 4. Elevation

기본은 **플랫**. 카드·입력·시트는 정적 상태에서 그림자 없이 1px 테두리(ink 8%)와 배경 단차(#FAF6F2 vs #FFFFFF)로 깊이를 낸다. 그림자는 **상태 응답**으로만.

### Shadow Vocabulary
- **Depth-1** (`0 1px 2px rgba(33,26,23,.04), 0 6px 16px -10px rgba(33,26,23,.12)`): 카드 기본/리스트.
- **Depth-2** (`0 2px 6px rgba(33,26,23,.05), 0 16px 32px -14px rgba(33,26,23,.18)`): 떠오른 시트·메뉴.
- **Glass**: 셸 크롬(상단바·하단탭)에만 `backdrop-filter`. 장식용 글래스 카드 ❌.

### Named Rule
**Flat-By-Default Rule.** 표면은 쉴 때 플랫. 상시 머터리얼 드롭섀도가 보이면 잘못 만든 것.

## 5. Layout — 모바일 웹앱(폰 셸)

- 콘텐츠는 **iPhone 비율(9:19.5) 디바이스 셸** 안. 페이지 높이를 꽉 채우고 폭은 비율로 derive, 내부 스크롤(`.viewport`). 데스크탑은 바깥이 중립 배경. 골격은 `src/App.vue`.
- 새 페이지는 셸 안에서 **1열로 쌓는다**. `<v-container><v-row><v-col>` 데스크탑 그리드로 펼치지 않는다.
- 상단바: 좌측 로고(홈), 우측 **로그인**(`/login`). 하단 탭: **홈 / 둘러보기 / 마이페이지** 고정. 터치 타깃 ≥44px. 전체화면 페이지는 `meta.chrome=false`.
- 후기/장소 카드는 사진이 폭을 꽉 채운다(작은 썸네일로 가두지 않음).

## 6. Components

Vuetify 컴포넌트를 토큰·규칙으로 조율해 쓴다. 같은 역할의 컨트롤은 화면 간 같은 모양. 구체 재사용 단위는 [docs/UI_KIT.md](./docs/UI_KIT.md).

### Buttons
- 모서리 8px(`rounded="lg"`), 높이 44px. **Primary**: 가넷 + 흰 텍스트(`color="primary"`). hover 딥 가넷.
- **Outlined/Text**: 흰 배경 + 가넷 테두리/텍스트. focus-visible 2px 가넷 아웃라인.
- **Disabled**: 회색조. 비활성에 풀채도 색 ❌.

### Pills / Chips
- pill(9999px): 가넷 틴트 배경 + 딥 가넷 텍스트(보조 액션). 칩 선택은 채움, 비선택은 테두리/틴트.

### Cards / Containers
- 모서리 16~22px, 흰 표면, 본문 배경 #FAF6F2. 기본 플랫 + Depth-1, hover lift. 패딩 16px.
- 후기 카드: 사진이 폭을 꽉 채우고 텍스트는 아래.

### Inputs
- `v-text-field variant="solo-filled"`, 높이 48px, 8px 라운드. focus 가넷 테두리. placeholder는 뮤트(옅은 회색 ❌). error는 색+텍스트 함께.

### Navigation
- **상단바**: 좌측 `BrandMark` 로고(홈 링크), 우측 위치. 스크롤 시 글래스 강조.
- **하단탭**: 홈/둘러보기/마이페이지. 현재 탭 가넷.

### Loading & Empty
- **로딩**: 콘텐츠 자리 **스켈레톤**, 짧은 액션만 `v-progress-circular`.
- **빈 상태**: "없음" ❌ → 다음 행동을 가르치는 카피 + 버튼.

## 7. Do / Don't

**Do** — 사진을 가장 크게; 색은 행동·선택·상태·별점에만; 가넷 틴트 위 텍스트는 딥 가넷; 표면 기본 플랫; Pretendard 한 종; 폰 셸 1열; 터치 ≥44px; 로딩=스켈레톤·빈상태=안내; 모션 150–250ms + reduced-motion 대안.

**Don't** — 주황 탠저린 재도입; Material 기본 데모 룩(상시 드롭섀도·똑같은 카드 그리드); 관공서식 정보 나열; 배너·팝업 범벅; 채도 없는 B2B SaaS 톤; 허니·로즈 본문 텍스트; 뮤트보다 옅은 보조 텍스트; 사이드 스트라이프 보더·그라디언트 텍스트·장식 글래스·모든 섹션 대문자 eyebrow; 색만으로 상태 전달.
