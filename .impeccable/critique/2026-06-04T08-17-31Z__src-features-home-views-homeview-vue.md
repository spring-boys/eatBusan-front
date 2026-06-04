---
target: src/features/home/views/HomeView.vue
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-06-04T08-17-31Z
slug: src-features-home-views-homeview-vue
---
# Critique: HomeView.vue

## Design Health Score: 26/40 (Acceptable)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | 정적 페이지, "준비 중" 비활성으로 상태 전달 |
| 2 | Match System / Real World | 2 | "둘러보기"가 맛집 피드 아닌 댓글 데모(/comments)로 감 |
| 3 | User Control and Freedom | 3 | 앱바 타이틀 홈 복귀 |
| 4 | Consistency and Standards | 3 | Vuetify 일관 사용 |
| 5 | Error Prevention | 3 | 비활성 버튼으로 미구현 차단 |
| 6 | Recognition Rather Than Recall | 3 | 아이콘 라벨 동반 |
| 7 | Flexibility and Efficiency | 2 | 단일 경로, 가속기 없음 |
| 8 | Aesthetic and Minimalist Design | 2 | 데모 룩 + 동일 카드 그리드 + 사진 0장 |
| 9 | Error Recovery | 3 | 에러 여지 없음 |
| 10 | Help and Documentation | 2 | 없음 (랜딩이라 비치명적) |

## Anti-Patterns Verdict
AI가 만든 것처럼 보임 = YES. 단색 히어로 시트 + mdi-fish 제네릭 아이콘 + 아이콘＋제목＋텍스트 3단 동일 카드 그리드(절대 금지) + 인포 얼럿 플레이스홀더. 사용자 지목 anti-ref "손 안 댄 Vuetify 데모 룩" 그 자체. 결정론적 디텍터는 매치 0건이나, Vuetify 컴포넌트 props라 패턴 스캔 무력(false negative). 브라우저 오버레이는 이 세션 도구 부재로 미생성.

## Overall Impression
작동하고 안 깨지나, 앱 정체성(사진이 주인공)과 정반대인 브로셔. 음식 사진 0장, 가치(후기)는 회색 얼럿 한 줄. 최대 기회: 마케팅 카피 대신 실제 후기 사진을 주인공으로.

## What's Working
1. 카피 톤이 브랜드 보이스에 맞음, 버즈워드 없음.
2. 반응형 구조 견실(cols=12 sm=4), 모바일 우선 골격 OK.
3. 컴포넌트 어휘 일관, 색 토큰 이름으로만 사용(하드코딩 없음).

## Priority Issues
[P1] 사진 0장 — 핵심 원칙(사진이 주인공)과 정면충돌. mdi-fish가 음식 사진 자리 차지. Fix: 히어로/인기후기를 실제 이미지 기반으로. Command: polish/craft.
[P1] 동일 아이콘 카드 3단 그리드 — 절대 금지. Fix: 실제 콘텐츠(후기 프리뷰)로 대체. Command: layout/polish.
[P2] "둘러보기" CTA가 댓글 데모로 감 — 라벨/목적지 불일치(휴리스틱 2). Fix: 피드로 연결. Command: craft 후기 피드 → clarify.
[P2] 가치 역전 — 후기는 플레이스홀더, 기능 설명이 주연. Fix: 후기를 상단 주연으로. Command: layout (+onboard 빈상태).
[P2] 코랄 secondary 버튼 대비 — Vuetify 자동 on-color 의존(불안정). 흰 텍스트 시 ~2.7:1. Fix: on-secondary 명시 또는 secondary-deep(#E64A19). Command: audit/colorize.
[P3] "글쓰기 (준비 중)" 비활성 버튼이 미구현 기능 광고. Fix: 준비 전 비노출.

## Persona Red Flags
Casey(모바일): 주요 CTA가 엄지존(하단) 아님. 스크롤해도 사진/콘텐츠 없음.
Jordan(첫사용자): 보여주는 게 없음(사진/후기 0). "둘러보기" → 댓글 데모로 혼란.
Riley(엣지): "인기 후기"가 영구 정적 플레이스홀더(데이터 연결돼도 안 바뀜). "글쓰기" 영원히 disabled. 빈 상태가 다음 행동 안 가르침.

## Minor Observations
- 두 섹션 헤더 동일 text-h6, 위계 평평. 핵심 섹션(후기)이 시각적으로 가장 약함.
- 히어로 단색 primary 풀블리드 → "큰 색면 자리는 사진" 규칙과 충돌.

## Questions
- 홈이 기능 브로셔여야 하나, 첫 화면이 곧 후기 피드면 안 되나?
- 사진 한 장 없이 사진 중심 앱을 소개할 수 있나?
