<script setup>
// 내가 작성한 댓글. 백엔드 GET /api/posts/comments/my 가 후기 제목까지 주므로
// 각 항목을 누르면 댓글이 달린 후기 상세로 이동한다.
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMyCommentStore } from '../store/myCommentStore'

const router = useRouter()
const store = useMyCommentStore()
const { myComments, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadMyComments()
})

function goDetail(postId) {
  router.push({ name: 'post-detail', params: { id: postId } })
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="mycomments">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">작성한 댓글</h1>
    </header>

    <div v-if="loading" class="list">
      <div v-for="n in 3" :key="n" class="skel" />
    </div>

    <div v-else-if="error" class="empty">
      <v-icon icon="mdi-wifi-off" size="40" class="empty__ic" />
      <p class="empty__t">{{ error }}</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="store.loadMyComments()">
        다시 시도
      </v-btn>
    </div>

    <div v-else-if="myComments.length === 0" class="empty">
      <v-icon icon="mdi-comment-text-outline" size="40" class="empty__ic" />
      <h2 class="empty__title">작성한 댓글이 아직 없어요</h2>
      <v-btn color="primary" rounded="lg" size="large" class="empty__btn" @click="router.push('/')">
        후기 둘러보기
      </v-btn>
    </div>

    <ul v-else class="list">
      <li v-for="c in myComments" :key="c.id">
        <button class="card" type="button" @click="goDetail(c.postId)">
          <div class="card__post">
            <v-icon icon="mdi-text-box-outline" size="16" class="card__post-ic" />
            <span class="card__post-title">{{ c.postTitle }}</span>
          </div>
          <p class="card__content">{{ c.content }}</p>
          <time class="card__date">{{ formatDate(c.createdAt) }}</time>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mycomments {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
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
  gap: 12px;
}

.card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border: 0;
  border-radius: 16px;
  box-shadow: var(--depth-1);
  cursor: pointer;
  text-align: left;
}
.card__post {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.card__post-ic {
  color: var(--brand);
  flex-shrink: 0;
}
.card__post-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--brand);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__content {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: rgba(33, 26, 23, 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__date {
  font-size: 12px;
  color: rgba(33, 26, 23, 0.45);
}

.skel {
  height: 96px;
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
  flex: 1;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 10px 72px;
}
.empty__ic {
  color: rgba(33, 26, 23, 0.3);
  margin-bottom: 12px;
}
.empty__t {
  margin: 0 0 16px;
  font-size: 15px;
  color: rgba(33, 26, 23, 0.6);
}
.empty__title {
  margin: 0 0 22px;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.empty__btn {
  min-width: 176px;
  font-weight: 800;
}
</style>
