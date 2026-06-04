# API Contract (eatBusan)

> **백엔드와 프론트가 공유하는 유일한 API 기준.** 프론트 레포가 분리돼도 이 문서를 동기화한다.
> 코드와 이 문서가 다르면 → **먼저 이 문서에서 합의**한 뒤 양쪽 코드를 맞춘다.
>
> 표기: `🟢 구현됨` / `🟡 설계됨(미구현)` / `🔴 미정` / `❓확인 필요`(백엔드 DTO 확인 후 채움)

- Base URL (dev): `http://localhost:8081`
- 공통 prefix: `/api`
- 인증: 보호된 엔드포인트는 `Authorization` 헤더에 access token. (`@LoginMember`로 서버가 memberId 추출)
- 페이지네이션: 쿼리 `page`(1부터), `size`. (커서 방식 전환 시 이 문서 갱신)

---

## 공통 응답/에러 형태  ❓확인 필요
백엔드의 공통 응답 래퍼(`ApiResponse` 등) 유무와 에러 바디 형태를 확인해서 채운다.
```jsonc
// 에러 예시 (확인 후 확정)
{ "status": 400, "message": "...", "code": "..." }
```

---

## Auth / Member  ❓확인 필요
`MemberController`, `auth/` 확인 후 작성.
- [ ] 회원가입
- [ ] 로그인 (토큰 발급 형태)
- [ ] 로그아웃
- [ ] 토큰 재발급

---

## Post  🟢 구현됨 (필드 상세 ❓확인 필요 — PostRequireDto/PostResponseDto)

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 목록 | GET | `/api/posts` | - |
| 단건 | GET | `/api/posts/{postId}` | - |
| 작성 | POST | `/api/posts` | ✅ |
| 수정 | PATCH | `/api/posts/{postId}` | ✅ |
| 삭제 | DELETE | `/api/posts/{postId}` | ✅ |

```jsonc
// PostResponse (프론트 제안 초안 — 백엔드 PostResponseDto 확정 시 동기화)
{
  "id": 1,
  "title": "해운대 맛집",
  "content": "...",
  "thumbnailUrl": "https://...s3.../posts/1/thumb.jpg", // 대표 이미지(없으면 null)
  "authorNickname": "부산토박이",
  "authorProfileUrl": "https://...",                     // 없으면 null
  "viewCount": 10,
  "commentCount": 3,
  "likeCount": 12,
  "liked": false,                                        // 인증 시 현재 사용자 좋아요 여부(목록선 생략 가능)
  "createdAt": "2026-06-04T10:00:00"
  // memberId/placeId 등 추가 필드 ❓확인 필요
}
```

> **목록 페이지네이션**: 프론트는 `GET /api/posts?page=1&size=8` (page 1부터)로 호출하고 **`PostResponse[]` 배열 응답**을 가정한다(댓글 목록과 동일 형태). 백엔드가 Spring `Page` 래퍼(`content`/`totalElements`/...)를 반환하면 `features/post/api/postApi.ts`의 매핑만 수정한다.
> 프론트 타입 정의: `src/features/post/types/post.ts`.

---

## Post Image  🟡 설계됨(미구현, 오늘 작업 예정)

| 동작 | Method | Path | 인증 | Content-Type |
|------|--------|------|------|--------------|
| 이미지 업로드(여러 장) | POST | `/api/posts/{postId}/images` | ✅ | `multipart/form-data` |

- 요청: `files` (multiple `MultipartFile`)
- 응답: 업로드된 이미지 URL 목록 (형태 확정 예정)
```jsonc
{ "images": [ { "id": 1, "imageUrl": "https://...s3.../posts/1/uuid.jpg" } ] }
```
- 저장: S3 업로드 → `post_image` 테이블(1:N)에 URL 저장

---

## Comment  🟡 설계됨 (매퍼 완료, Service/Controller 작업 중)

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 작성 | POST | `/api/posts/{postId}/comments` | ✅ |
| 목록(페이지네이션) | GET | `/api/posts/{postId}/comments?page=1&size=10` | - |
| 수정 | PATCH | `/api/posts/{postId}/comments/{commentId}` | ✅ |
| 삭제(소프트) | DELETE | `/api/posts/{postId}/comments/{commentId}` | ✅ |

**작성/수정 요청 body**
```jsonc
{ "content": "댓글 내용" }   // content: 필수, 공백 불가
```

**목록 응답** (현재 백엔드 `PostCommentDto` 기준)
```jsonc
[
  { "id": 12, "content": "맛있어요", "createdAt": "2026-06-04T10:00:00" }
]
// ⚠️ 작성자(닉네임/프로필) 필요 시 백엔드 DTO에 추가 후 이 문서 갱신
```

> 참고: 권한 체크는 서버가 `memberId`(토큰)로 수행. 본인 댓글이 아니면 수정/삭제 시 0건 → 에러 응답(형태 ❓확인 필요).

---

## Post Like  🟢 구현됨

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 좋아요 토글 | POST | `/api/posts/{postId}/likes` | ✅ |

- 응답: `PostLikeResponse` (현재 상태 포함 — 토글이라 200으로 일괄 처리)
```jsonc
// 프론트 제안 초안 — 백엔드 확정 시 동기화
{ "liked": true, "likeCount": 13 }
```

---

## Place  🟡 프론트 제안 초안 (백엔드/카카오 연동 확정 시 동기화)

| 동작 | Method | Path | 인증 |
|------|--------|------|------|
| 주변 식당 목록 | GET | `/api/places` | - |
| 식당 단건 | GET | `/api/places/{placeId}` | - |
| 식당 후기 목록 | GET | `/api/places/{placeId}/posts` | - |

```jsonc
// PlaceResponse (프론트 제안 초안)
{
  "id": 1,
  "name": "해운대 골목 돼지국밥",
  "category": "한식",
  "thumbnailUrl": "https://...",   // 없으면 null
  "photos": ["https://...", "..."], // 상세용
  "rating": 4.6,
  "reviewCount": 182,
  "likeCount": 142,
  "address": "부산 해운대구 구남로 12",
  "priceRange": "1만원 이하",
  "lat": 35.1587,
  "lng": 129.1601
}
```

> 거리 정렬은 클라이언트가 현재 위치(브라우저 geolocation) 기준으로 계산한다(`src/shared/utils/geo.js`). 서버가 거리/카테고리 필터를 제공하면 쿼리로 전환.
> 프론트 타입: `src/features/place/types/place.js`. 식당 후기는 `PostResponse[]` (후기 = Post).

---

## 갱신 규칙
- 백엔드 DTO가 바뀌면 **이 문서를 같이 PR**에 포함.
- `❓확인 필요` 항목은 해당 기능 작업 시 실제 DTO를 보고 채운다.
