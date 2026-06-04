# eatBusan Frontend

Vue 3 + TypeScript + Vuetify 기반 eatBusan 프론트엔드.

## 빠른 시작
```bash
npm install
npm run dev      # http://localhost:5173
```
- 개발 시 `/api` 요청은 Vite proxy가 백엔드(`http://localhost:8081`)로 전달한다.
- 백엔드(eatBusan Spring)를 먼저 띄워두면 실제 데이터로 동작한다.

## 팀 개발 방식 (중요)
이 프로젝트는 **모든 팀원이 동일한 규칙·구조·디자인으로** 개발하도록 문서를 기준으로 삼는다.
각자 Claude Code로 작업하더라도 결과물이 통일되도록:

1. **작업 전 `CLAUDE.md`와 `docs/`를 먼저 본다.** (Claude Code는 `CLAUDE.md`를 자동으로 읽는다)
2. **새 기능은 `src/features/comment/` 템플릿 구조를 모방**해서 만든다.
3. API 형태는 `docs/API_CONTRACT.md`를 기준으로 한다. (백엔드와 다르면 문서를 먼저 합의)
4. 색/간격/폰트는 `docs/DESIGN_SYSTEM.md` 토큰만 사용한다.

> 새 팀원이 이 레포를 클론하고 위 문서대로 Claude Code를 돌리면, 동일한 구조·패턴·디자인의 결과물이 나오는 것을 목표로 한다.

## 폴더 구조
```
src/
  app/        # Vuetify 등 앱 부트스트랩
  router/     # 라우트 정의
  shared/     # 공통 api 클라이언트, 타입, 컴포넌트
  features/   # 기능별 모듈 (comment 가 레퍼런스 템플릿)
```
자세한 규칙은 [docs/CONVENTIONS.md](./docs/CONVENTIONS.md).

## 스택
Vue 3 · TypeScript · Vite · Vuetify · Pinia · Vue Router · Axios
