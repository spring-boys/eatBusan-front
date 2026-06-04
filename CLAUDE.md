# eatBusan Frontend — Claude / 개발 가이드

> 이 파일은 Claude Code가 매 세션 자동으로 읽는다. **코드를 작성하기 전에 반드시 아래 문서를 따른다.**
> 팀 전원이 같은 규칙·구조·디자인으로 개발하기 위한 단일 기준이다.

## 먼저 읽을 문서 (우선순위 순)
1. **[docs/CONVENTIONS.md](./docs/CONVENTIONS.md)** — 스택, 폴더 구조, 네이밍, Do/Don't (가장 중요)
2. **[docs/API_CONTRACT.md](./docs/API_CONTRACT.md)** — 백엔드 API 요청/응답 형태 (추측 금지, 이 문서가 기준)
3. **[docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)** — 색/간격/폰트/Vuetify 사용 규칙

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
- 스타일 값 하드코딩 ❌ — Vuetify 컴포넌트/테마 토큰 사용
- 타입은 JSDoc(`@typedef`)로. 응답/요청은 `types/`에 JSDoc typedef 정의
- API 형태가 불명확하면 추측하지 말고 `docs/API_CONTRACT.md` 확인, 없으면 사용자에게 질문
- import 경로는 `@/` 별칭 사용 (`@/shared/api/client`)

## 명령어
- `npm run dev` — 개발 서버 (http://localhost:5173, `/api` → Spring 8081 프록시)
- `npm run build` — Vite 프로덕션 빌드
- `npm run format` — Prettier 포맷

## 백엔드
- Spring Boot, dev: `http://localhost:8081`
- 인증: `Authorization` 헤더에 access token (인터셉터 자동 주입)
