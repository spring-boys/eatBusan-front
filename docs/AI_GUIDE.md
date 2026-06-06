# AI 개발 가이드 (eatBusan Frontend)

> **이 레포에서 코드를 만드는 모든 AI(Claude·Cursor·Copilot·Codex·Gemini 등)와 사람**을 위한 단일 작업 지침.
> 팀원마다 다른 AI로, 기능(API)별로 따로 개발해도 **하나의 앱처럼 일관되게** 나오도록 하는 게 목적이다.
> 핵심 한 줄: **"새로 발명하지 말고, 이미 있는 뼈대를 모방하라."**

---

## 0. 시작 전 반드시 읽을 순서

1. [docs/CONVENTIONS.md](./CONVENTIONS.md) — 스택·폴더·네이밍·Do/Don't (구조의 기준)
2. [docs/API_CONTRACT.md](./API_CONTRACT.md) — 요청/응답 형태 (**추측 금지**, 유일한 기준)
3. [docs/DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — 색·폰트·간격·레이아웃 토큰/규칙
4. [docs/UI_KIT.md](./UI_KIT.md) — 이미 있는 재사용 컴포넌트·패턴 (재사용 1순위)
5. **레퍼런스 코드**: `src/features/comment/`(기능 템플릿), `src/features/place/`(실제 적용 예)

스택은 고정이다: **Vue 3 `<script setup>` + JavaScript(ESM) + Vite + Vuetify + Pinia + Vue Router + Axios.**
바꾸지 않는다. TypeScript·다른 UI 라이브러리·다른 상태관리 도입 ❌.

---

## 1. 작업 분담 원칙 (여러 AI가 동시에)

- **1 AI = 1 feature 폴더.** 한 사람/AI는 `src/features/<자기기능>/` 안에서만 새 파일을 만든다.
- **공유 영역은 손대기 전에 합의.** `src/shared/`, `src/app/`, `src/router/index.js`, `src/style.css`,
  `docs/*`는 여러 기능이 공유한다. 여기를 바꿔야 하면 **추가(append)** 위주로, PR 설명에 이유를 적고 리뷰받는다.
  - 라우트는 자기 기능 것만 `router/index.js`에 **추가**(기존 줄 수정 ❌).
  - 디자인 토큰(색/폰트)을 새로 만들지 않는다. 필요하면 팀에 제안 → `vuetify.js`/`style.css`에서 한 번만.
- **API 계약이 먼저.** 담당 API의 요청/응답이 `API_CONTRACT.md`에 없으면, 코드부터 짜지 말고
  계약 문서에 형태를 먼저 적고(팀/백엔드 확인) 그걸 기준으로 `types/`를 만든다.

---

## 2. 새 기능 만들기 레시피 (`comment` 그대로 모방)

`src/features/<feature>/` 아래 **항상 같은 5폴더**:

```
features/<feature>/
  types/      <feature>.js      # JSDoc @typedef 로 요청/응답 DTO 정의
  api/        <feature>Api.js   # API 호출 함수 (axios 직접 호출 ❌, shared client 경유)
              mock<Feature>.js  # 백엔드 전 개발용 mock 데이터 (선택)
  store/      <feature>Store.js # pinia store — loading/error 상태 포함
  components/ <Feature>*.vue    # 이 기능 전용 컴포넌트
  views/      <Feature>View.vue # 라우터에 붙는 페이지
```

**순서대로 만든다:**

1. **types** — `API_CONTRACT.md`를 보고 `XxxResponse`/`XxxRequest`를 JSDoc typedef로.
   ```js
   /** @typedef {Object} CommentResponse
    *  @property {number} id
    *  @property {string} content ... */
   ```
2. **api** — 동사로 시작하는 함수만. 반드시 `@/shared/api/client`(axios 인스턴스) 사용.
   ```js
   import client from '@/shared/api/client'
   export const fetchComments = (postId) => client.get(`/posts/${postId}/comments`).then(r => r.data)
   ```
   (백엔드 전이면 `mockXxx.js`를 import 해 Promise로 흉내. 함수 시그니처는 실서버와 동일하게.)
3. **store** — `defineStore('<feature>', () => { ... })`. **`loading`·`error` ref를 항상 둔다.**
   비동기는 try/catch로 error 채우고 finally로 loading 내린다. (예: `placeListStore.js`)
4. **components** — UI는 [UI_KIT.md](./UI_KIT.md)의 토큰·패턴으로. 새 색/간격 만들지 말 것.
5. **views** — store를 `storeToRefs`로 구독, 로딩=스켈레톤 / 에러=재시도 / 빈상태=다음행동 안내 / 정상=목록.
6. **router** — `router/index.js`에 자기 라우트 한 줄 **추가**(lazy import).

---

## 3. 화면을 만들 때 (디자인 일관성)

- **레이아웃은 iPhone 비율 디바이스 셸 안 1열.** 데스크탑 그리드로 넓히지 않는다. 자세히는 DESIGN_SYSTEM §5.
- **색은 토큰 이름으로만.** `color="primary"` / `var(--brand)`. `#`핫코드 직접 입력 ❌.
  - 허니·로즈는 본문 텍스트 ❌ (대비). 별점·아이콘·배지·좋아요에만.
- **사진이 주인공.** 후기/장소 카드는 음식 사진이 폭을 꽉 채우게. 작은 썸네일로 가두지 않는다.
- **상태 4종은 기본**: 로딩(스켈레톤)·에러(재시도)·빈 상태(안내+버튼)·정상. 하나라도 빠지면 미완성.
- **이미 있는 패턴 재사용**: 세그먼트 컨트롤, pill, 리스트 행, 히어로 카드, 바텀시트, 빈 상태 →
  새로 디자인하기 전에 UI_KIT.md에서 같은 역할이 있는지 먼저 본다.

---

## 4. 제출 전 셀프 체크리스트 (PR마다)

- [ ] 새 파일이 전부 `features/<내기능>/` 또는 합의된 공유 영역 안에 있다
- [ ] axios를 컴포넌트에서 직접 부르지 않았다 (api/ 함수 경유)
- [ ] 요청/응답이 `types/`에 JSDoc typedef로 정의돼 있고 `API_CONTRACT.md`와 일치
- [ ] 색/간격/폰트 **하드코딩 없음** — 토큰만 사용 (`#`, 임의 px 검색해 확인)
- [ ] 새 디자인 토큰을 임의로 추가하지 않았다
- [ ] 로딩·에러·빈 상태·정상 4가지를 모두 처리
- [ ] 폰 셸 폭에서 깨지지 않는다 (제목 오버플로 없음, 터치 타깃 ≥44px)
- [ ] `prefers-reduced-motion` 대안이 있다 (애니메이션을 넣었다면)
- [ ] `npm run build` 통과, `npm run format` 적용
- [ ] 컴포넌트 한 파일 200줄 넘으면 분리 고려

---

## 5. 다른 AI 도구에 이 가이드 적용하기

내용은 위 docs가 **단일 출처**다. 각 도구의 진입 파일은 **이 docs를 가리키는 얇은 포인터**로만 둔다(내용 복붙 ❌, 드리프트 방지).

| 도구 | 자동으로 읽는 파일 | 조치 |
|------|------|------|
| Claude Code | `CLAUDE.md` | 이미 docs 순서 참조 ✅ |
| Codex / Cursor / Windsurf / Gemini CLI 등 | `AGENTS.md` | 이미 docs 순서 참조 ✅ (대부분 AGENTS.md 표준 지원) |
| GitHub Copilot | `.github/copilot-instructions.md` | 필요 시 생성 — "먼저 `docs/AI_GUIDE.md`를 읽어라" 한 줄 + 절대 규칙 요약 |
| Gemini (gemini.md 방식) | `GEMINI.md` | 필요 시 생성 — AGENTS.md/AI_GUIDE.md를 가리킴 |

**채팅형 AI(웹 UI 등)에 붙여 쓰는 프롬프트 템플릿:**

```
너는 eatBusan 프론트엔드(Vue3 <script setup> + JS + Vite + Vuetify + Pinia) 레포에서 작업한다.
코드를 짜기 전에 docs/AI_GUIDE.md, docs/CONVENTIONS.md, docs/DESIGN_SYSTEM.md, docs/UI_KIT.md,
docs/API_CONTRACT.md를 그대로 따른다. 새 기능은 src/features/comment/ 구조를 모방해
src/features/<기능>/ 안에서만 만든다. axios 직접 호출 금지(api/ 함수 경유), 색/간격/폰트는
토큰 이름으로만(하드코딩 금지), 레이아웃은 폰 셸 1열, 로딩/에러/빈상태/정상 4상태를 모두 처리.
지금 맡은 기능: <기능명>. 관련 API: <API_CONTRACT.md의 항목>. 모르는 형태는 추측하지 말고 질문해라.
```

---

## 6. 막혔을 때

- API 형태 모름 → `API_CONTRACT.md` 확인 → 없으면 **질문**(추측 코드 금지).
- 디자인 결정 애매 → `DESIGN_SYSTEM.md` + `PRODUCT.md` 톤 참고 → 그래도 애매하면 질문.
- 공유 파일을 크게 바꿔야 함 → 작은 PR로 분리하고 팀 리뷰.
- "이런 컴포넌트 있나?" → 먼저 `UI_KIT.md`와 `src/shared/`, 인접 feature를 검색.
