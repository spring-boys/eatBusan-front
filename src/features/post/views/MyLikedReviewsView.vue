<script setup>
// 좋아요한 리뷰. 백엔드 GET /api/posts/likes/my 응답({postId,title,liked})만 사용한다.
// 목록은 제목 + 좋아요 표시만 노출하고, 좋아요 수 등 상세 정보는 상세 화면에서 본다.
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { usePostLikeStore } from '../store/postLikeStore'

const router = useRouter()
const store = usePostLikeStore()
const { myLikedReviews, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadMyLikedReviews()
})

function goDetail(postId) {
  router.push({ name: 'post-detail', params: { id: postId } })
}
</script>

<template>
  <div class="mylikes">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">좋아요한 리뷰</h1>
    </header>

    <div v-if="loading" class="empty">
      <v-progress-circular indeterminate color="primary" size="28" width="3" />
    </div>

    <div v-else-if="error" class="empty">
      <v-icon icon="mdi-wifi-off" size="40" class="empty__ic" />
      <p class="empty__t">{{ error }}</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="store.loadMyLikedReviews()">
        다시 시도
      </v-btn>
    </div>

    <div v-else-if="myLikedReviews.length === 0" class="empty">
      <v-icon icon="mdi-thumb-up-outline" size="40" class="empty__ic" />
      <h2 class="empty__title">좋아요한 리뷰가 아직 없어요</h2>
      <v-btn color="primary" rounded="lg" size="large" class="empty__btn" @click="router.push('/')">
        후기 둘러보기
      </v-btn>
    </div>

    <ul v-else class="list">
      <li v-for="r in myLikedReviews" :key="r.postId">
        <button type="button" class="row" @click="goDetail(r.postId)">
          <h3 class="row__title">{{ r.title }}</h3>
          <span class="row__like" aria-label="좋아요한 리뷰">
            <v-icon icon="mdi-heart" size="16" />
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mylikes {
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
  gap: 10px;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgb(var(--v-theme-surface));
  border: 0;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: var(--depth-1);
  text-align: left;
  cursor: pointer;
  color: inherit;
}
.row__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row__like {
  flex: none;
  display: inline-flex;
  align-items: center;
  color: var(--rose);
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
