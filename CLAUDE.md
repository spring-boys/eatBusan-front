# eatBusan Frontend — Claude / 개발 가이드

> 이 파일은 Claude Code가 매 세션 자동으로 읽는다. **코드를 작성하기 전에 반드시 아래 문서를 따른다.**
> 팀 전원이 같은 규칙·구조·디자인으로 개발하기 위한 단일 기준이다.

## 먼저 읽을 문서 (우선순위 순)
0. **[docs/AI_GUIDE.md](./docs/AI_GUIDE.md)** — AI 작업 지침: 작업 분담·기능 레시피·셀프 체크리스트. **여기부터 본다.**
1. **[docs/CONVENTIONS.md](./docs/CONVENTIONS.md)** — 스택, 폴더 구조, 네이밍, Do/Don't
2. **[docs/API_CONTRACT.md](./docs/API_CONTRACT.md)** — 백엔드 API 요청/응답 형태 (추측 금지, 이 문서가 기준)
3. **[docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)** — 색/간격/폰트/Vuetify 토큰·규칙 (**가넷 #B0234A + 허니**, 주황 아님)
4. **[docs/UI_KIT.md](./docs/UI_KIT.md)** — 이미 있는 재사용 컴포넌트·패턴 (새로 만들기 전에 확인, 재사용 1순위)

## 레퍼런스 템플릿 (모방의 기준)
새 기능을 만들 땐 **`src/features/comment/` 구조와 패턴을 그대로 모방**한다:
```
features/comment/
  types/      # 요청/응답 타입
  api/        # API 호출 함수 (axios 직접 호출 금지)
  store/      # pinia store (loading/error 상태 포함)
  components/ # 전용 컴포넌트
  views/      # 라우터 페이지
```

## 절대 규칙 (요약)
- 스택 고정: Vue 3 `<script setup>` + **JavaScript(ESM)** + Vite + **Vuetify** + Pinia + Vue Router + Axios
- API 호출은 `features/<f>/api/`의 함수로만. 컴포넌트에서 axios 직접 호출 ❌
- 스타일 값 하드코딩 ❌ — Vuetify 테마 토큰/CSS 변수 이름으로만 (`color="primary"`, `var(--brand)`)
- 색은 **가넷 #B0234A(primary) + 허니 #E8A53D + 로즈 #FF3D6A**. 주황(#F2541B) 재도입 ❌
- 레이아웃은 **폰 셸(440px) 1열** — 데스크탑 그리드로 넓히지 않는다
- 타입은 JSDoc(`@typedef`)로. 응답/요청은 `types/`에 JSDoc typedef 정의
- API 형태가 불명확하면 추측하지 말고 `docs/API_CONTRACT.md` 확인, 없으면 사용자에게 질문
- import 경로는 `@/` 별칭 사용 (`@/shared/api/client`)
- 새 기능은 `src/features/<기능>/` 안에서만. 공유 영역(`shared/`,`app/`,`router`,`style.css`,`docs/`)은 추가 위주 + 리뷰

## 명령어
- `npm run dev` — 개발 서버 (http://localhost:5173, `/api` → Spring 8081 프록시)
- `npm run build` — Vite 프로덕션 빌드
- `npm run format` — Prettier 포맷

## 백엔드
- Spring Boot, dev: `http://localhost:8081`
- 인증: `Authorization` 헤더에 access token (인터셉터 자동 주입)
