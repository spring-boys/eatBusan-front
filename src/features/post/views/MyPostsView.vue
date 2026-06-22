<script setup>
// 내가 다녀온 맛집 = 내가 작성한 후기 목록. 백엔드 GET /api/posts/my 로 로그인 사용자의 후기를 로드한다.
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMyPostStore } from '../store/myPostStore'

const router = useRouter()
const store = useMyPostStore()
const { myPosts, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadMyPosts()
})

function goDetail(id) {
  router.push({ name: 'post-detail', params: { id } })
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="myposts">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">내가 다녀온 맛집</h1>
    </header>

    <div v-if="loading" class="list">
      <div v-for="n in 3" :key="n" class="skel" />
    </div>

    <div v-else-if="error" class="empty">
      <v-icon icon="mdi-wifi-off" size="40" class="empty__ic" />
      <p class="empty__t">{{ error }}</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="store.loadMyPosts()">
        다시 시도
      </v-btn>
    </div>

    <div v-else-if="myPosts.length === 0" class="empty">
      <v-icon icon="mdi-map-marker-check-outline" size="40" class="empty__ic" />
      <p class="empty__t">아직 다녀온 맛집 기록이 없어요</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="router.push('/write')">
        맛집 기록하기
      </v-btn>
    </div>

    <ul v-else class="list">
      <li v-for="p in myPosts" :key="p.id">
        <button class="card" type="button" @click="goDetail(p.id)">
          <div v-if="p.thumbnailUrl" class="card__media">
            <v-img :src="p.thumbnailUrl" :alt="p.title" :aspect-ratio="16 / 9" cover />
          </div>
          <h3 class="card__title">{{ p.title }}</h3>
          <p class="card__excerpt">{{ p.content }}</p>
          <div class="card__meta">
            <span>{{ formatDate(p.createdAt) }}</span>
          </div>
          <div class="card__stats">
            <span><v-icon icon="mdi-heart" size="14" />{{ p.likeCount }}</span>
            <span><v-icon icon="mdi-comment-outline" size="14" />{{ p.commentCount }}</span>
          </div>
        </button>
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
  width: 100%;
  display: block;
  text-align: left;
  border: 0;
  cursor: pointer;
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--depth-1);
  color: inherit;
}
.card__media {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}
.card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.card__excerpt {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(33, 26, 23, 0.7);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: rgba(33, 26, 23, 0.5);
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

.skel {
  height: 120px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    rgba(33, 26, 23, 0.05) 25%,
    rgba(33, 26, 23, 0.09) 37%,
    rgba(33, 26, 23, 0.05) 63%
  );
  background-size: 400% 100%;
  animation: skel 1.4s ease infinite;
}
@keyframes skel {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
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
