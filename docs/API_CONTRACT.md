# API Contract (eatBusan)

> **백엔드와 프론트가 공유하는 유일한 API 기준.** 코드와 이 문서가 다르면 → **먼저 이 문서에서 합의** 후 양쪽을 맞춘다.
> 이 문서는 백엔드 레포(`../eatBusan`)의 Controller/DTO를 직접 읽고 채운 실제 계약이다 (2026-06-06 기준).
>
> 표기: `🟢 구현됨` / `🟡 일부/미완` / `🔴 미정`

- Base URL (dev): `http://localhost:8081` — 프론트는 Vite proxy(`/api` → 8081)로 호출(같은 출처).
- 공통 prefix: `/api`

### 인증 방식 (중요)
- **access token**: 로그인 성공 응답의 **`Authorization` 헤더**에 `Bearer <token>` 으로 내려온다. 프론트는 이걸 저장(localStorage)했다가 요청마다 `Authorization: Bearer <token>` 로 보낸다.
- **refresh token**: **HttpOnly 쿠키 `EBRefreshToken`** (path `/`). 자동 전송되므로 axios `withCredentials: true` 필요. `/api/members/refresh` 가 쿠키로 새 access token을 재발급(다시 Authorization 헤더).
- 보호 엔드포인트는 서버가 `@LoginMember` 로 토큰에서 memberId 추출. 토큰 없음/만료 → 401 → 프론트는 refresh 후 1회 재시도(`src/shared/api/client.js`).
- ⚠️ 운영(별도 도메인) 시: CORS `allowCredentials=true` + `Access-Control-Expose-Headers: Authorization` 필요(프론트가 응답 헤더의 토큰을 읽어야 함). dev는 프록시라 무관.

### 페이지네이션 (엔드포인트마다 다름 — 주의)
- Post 목록: **페이지네이션 없음**(전체 반환).
- Comment 목록: **커서**(`cursor`, `size`) → `{items, nextCursor, hasNext}`.
- Place 목록: **오프셋**(`page` 0부터, `size`) → Spring `Page` 래퍼.
- PlaceLike 내 목록: **커서**(`lastId`, `size`) → 배열.

---

## Auth / Member  🟢 구현됨
`/api/members` (MemberController)

| 동작 | Method | Path | 인증 | Body |
|------|--------|------|------|------|
| 회원가입 | POST | `/api/members/join` | - | `{email, password}` |
| 로그인 | POST | `/api/members/login` | - | `{email, password}` |
| 로그아웃 | POST | `/api/members/logout` | ✅ | - |
| 토큰 재발급 | POST | `/api/members/refresh` | 쿠키 | - |

- **회원가입**: 성공 201 (`Location: /api/members/{id}`), 본문 없음. 이메일 중복 시 에러(MEMBER_DUPLICATE).
- **로그인**: 성공 200, 본문 없음. access token은 **응답 `Authorization` 헤더**, refresh token은 **쿠키 `EBRefreshToken`**. 실패 401(AUTH_INVALID_LOGIN). `email`은 형식 검증(@Email).
- **로그아웃**: refresh 쿠키 무효화 + 서버 refresh 삭제.
- **재발급**: refresh 쿠키 필요. 성공 204 + 새 access token(Authorization 헤더). 쿠키 없음/불일치 → 에러.

```jsonc
// 요청 body (회원가입/로그인 공통 형태)
{ "email": "user@busan.com", "password": "********" }
```
> 프론트 스캐폴드: `src/features/auth/{types,api,store}`, 토큰 처리 `src/shared/api/client.js`.

---

## Post  🟢 구현됨
`/api/posts` (PostController)

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 목록(전체) | GET | `/api/posts` | - |
| 단건 | GET | `/api/posts/{postId}` | - |
| 작성 | POST | `/api/posts` | ✅ |
| 수정 | PATCH | `/api/posts/{postId}` | ✅ |
| 삭제 | DELETE | `/api/posts/{postId}` | ✅ |

**요청 body (PostRequireDto — 작성/수정 공통)**
```jsonc
{ "userId": 1, "placeId": 7, "email": "user@busan.com", "title": "해운대 맛집", "content": "..." }
```
**응답 (PostResponseDto)**
```jsonc
{
  "postId": 1, "userId": 1, "placeId": 7, "email": "user@busan.com",
  "title": "해운대 맛집", "content": "...",
  "viewCount": 10, "likeCount": 12, "commentCount": 3,
  "createdAt": "2026-06-04T10:00:00", "updatedAt": "2026-06-04T10:00:00"
}
```
- 목록은 `PostResponseDto[]` (페이지네이션 없음). 삭제 204.
- ⚠️ **프론트 불일치**: `src/features/post/types/post.js` 의 `PostResponse`(`id`/`authorNickname`/`thumbnailUrl`/`liked` 등)는 **프론트 제안 초안**이라 백엔드와 필드가 다르다. 실제 연동 시 백엔드 필드(`postId`, `email`, …)에 맞춰 매핑하거나 백엔드 DTO에 닉네임/대표이미지 추가를 합의해야 한다.

---

## Post Like  🟢 구현됨
| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 좋아요 토글 | POST | `/api/posts/{postId}/likes` | ✅ |

응답 `PostLikeResponse` (토글, 200):
```jsonc
{ "liked": true, "likeCount": 13 }
```

---

## Comment  🟢 구현됨 (커서 기반)
`/api/posts/{postId}/comments` (PostCommentController)

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 목록(커서) | GET | `/api/posts/{postId}/comments?cursor={id}&size=10` | - |
| 작성 | POST | `/api/posts/{postId}/comments` | ✅ |
| 수정 | PATCH | `/api/posts/{postId}/comments/{commentId}` | ✅ |
| 삭제 | DELETE | `/api/posts/{postId}/comments/{commentId}` | ✅ |

**작성/수정 body**: `{ "content": "댓글 내용" }` (공백 불가)
**목록 응답 (PostCommentPageResponse)**
```jsonc
{
  "items": [ { "id": 12, "content": "맛있어요", "createdAt": "2026-06-04T10:00:00" } ],
  "nextCursor": 7,
  "hasNext": true
}
```
- ⚠️ **프론트 불일치**: 현재 `src/features/comment` 는 **오프셋(`page`/`size`) + 배열 응답**을 가정한다. 실제 연동 시 **커서(`cursor`) + `{items,nextCursor,hasNext}`** 로 맞춰야 한다. 작성자 닉네임/프로필이 필요하면 백엔드 `PostCommentDto` 확장 합의.

---

## Place  🟡 일부 (구역코드 기반 + 카카오 검색 미완)
`/api/places` (PlaceController)

| 동작 | Method | Path | 인증 | 비고 |
|------|--------|------|------|------|
| 구역별 목록 | GET | `/api/places/{areaCode}?page=0&size=10` | - | `Page<PlaceResponseDto>` (오프셋, page 0부터) |
| 카카오 검색 | GET | `/api/places/search` | - | 🟡 미완(현재 mock 좌표 하드코딩) |

**응답 (PlaceResponseDto)**
```jsonc
{ "id": 1, "address": "부산 ...", "area_cde": "26350", "name": "○○국밥", "phone": "051-...", "url": "http://place.map.kakao.com/..." }
```
- ⚠️ **프론트 불일치**: `src/features/place/types/place.js` 의 `PlaceResponse`(`category`/`rating`/`reviewCount`/`thumbnailUrl`/`lat`/`lng` 등)는 **프론트 제안 초안**이며 백엔드엔 없다(백엔드는 id/address/areaCode/name/phone/url만). 또 프론트는 `GET /api/places`(구역코드 없음)를 호출 중이라 실제 엔드포인트(`/{areaCode}`)와 다르다. 별점·카테고리·좌표가 필요하면 백엔드/카카오 연동 확정 후 합의. (현재 프론트는 `VITE_USE_MOCK=true` 시드로 동작.)

---

## Place Like  🟢 구현됨 (커서 기반)
`/api` (PlaceLikeController)

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 좋아요 | POST | `/api/places/{placeId}/likes` | ✅ |
| 좋아요 취소 | DELETE | `/api/places/{placeId}/likes` | ✅ |
| 내가 좋아요한 식당 | GET | `/api/places/likes/my?lastId={placeLikeId}&size=10` | ✅ |

- 좋아요: 201 (`Location: /api/places/likes/{id}`), 본문 없음. 취소: 204.
- 내 목록(커서, `lastId` 이후 `size`개) 응답 `PlaceLikeDetailResponseDto[]`:
```jsonc
[
  { "placeLikeId": 3, "placeId": 11, "code": "12345", "name": "○○갈비",
    "address": "부산 해운대구 ...", "areaCode": "26350", "phone": "051-...",
    "url": "http://place.map.kakao.com/...", "likeCnt": 320 }
]
```
> 프론트 스캐폴드: `src/features/placeLike/{types,api,store}`.

---

## Post Image  🔴 미구현
설계만 존재(`/api/posts/{postId}/images`, multipart). 백엔드 미구현. 후기 사진은 이 API 확정 후 연동.

---

## 공통 응답/에러 형태  🟡 확인 필요
전역 예외는 `EBException` + `ErrorCode` 기반. 에러 바디 직렬화 형태(필드명)는 `global/exception` 확인 후 확정해 채운다.
```jsonc
// 예상 형태 (확정 전)
{ "status": 400, "message": "...", "code": "..." }
```

---

## 갱신 규칙
- 백엔드 DTO가 바뀌면 **이 문서를 같이 PR**에 포함.
- 프론트 타입(`features/*/types`)·API 함수(`features/*/api`)는 이 문서를 기준으로 맞춘다.
