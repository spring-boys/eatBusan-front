<script setup>
// 내가 쓴 후기 — 목업(UI only). 샘플 데이터로 레이아웃만 보여준다.
// TODO(AI 연동): 로그인 사용자의 후기 목록을 postApi 로 로드(백엔드에 사용자별 목록 엔드포인트 추가 필요 —
//   현재는 GET /api/posts 전체만 존재. API_CONTRACT 'Post' 참고). loading/error/빈 상태 처리.
import { useRouter } from 'vue-router'

const router = useRouter()

// 목업 샘플
const posts = [
  { id: 1, title: '전포 카페거리 티라미수 인생샷', place: '카페 노을', likeCount: 12, commentCount: 3, createdAt: '2026-06-01' },
  { id: 2, title: '서면 불막창 곱창 또 갔다', place: '서면 불막창', likeCount: 8, commentCount: 1, createdAt: '2026-05-28' },
]
</script>

<template>
  <div class="myposts">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">내가 쓴 후기</h1>
    </header>

    <div v-if="posts.length === 0" class="empty">
      <v-icon icon="mdi-pencil-outline" size="40" class="empty__ic" />
      <p class="empty__t">아직 남긴 후기가 없어요</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="router.push('/write')">
        첫 후기 쓰기
      </v-btn>
    </div>

    <ul v-else class="list">
      <li v-for="p in posts" :key="p.id">
        <router-link :to="`/places/${p.id}`" class="card">
          <h3 class="card__title">{{ p.title }}</h3>
          <div class="card__meta">
            <span class="card__place">{{ p.place }}</span>
            <span class="card__dot">·</span>
            <span>{{ p.createdAt }}</span>
          </div>
          <div class="card__stats">
            <span><v-icon icon="mdi-heart" size="14" />{{ p.likeCount }}</span>
            <span><v-icon icon="mdi-comment-outline" size="14" />{{ p.commentCount }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sub-hd {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0 16px;
}
.sub-hd__back {
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin-left: -8px;
  color: rgba(33, 26, 23, 0.75);
}
.sub-hd__title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card {
  display: block;
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--depth-1);
  text-decoration: none;
  color: inherit;
}
.card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.card__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: rgba(33, 26, 23, 0.5);
}
.card__place {
  font-weight: 700;
  color: var(--brand-deep);
}
.card__stats {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(33, 26, 23, 0.55);
}
.card__stats span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.card__stats .v-icon {
  color: var(--rose);
}

.empty {
  text-align: center;
  padding: 56px 16px;
}
.empty__ic {
  color: rgba(33, 26, 23, 0.22);
  margin-bottom: 12px;
}
.empty__t {
  margin: 0 0 18px;
  font-size: 15px;
  font-weight: 700;
  color: rgba(33, 26, 23, 0.6);
}
</style>
