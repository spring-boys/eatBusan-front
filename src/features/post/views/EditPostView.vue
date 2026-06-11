<script setup>
// 후기 수정 화면. /posts/:id/edit 라우트 (전체화면, chrome: false).
// 백엔드 PATCH /api/posts/:id 는 title·content만 반영한다. 이미지·가게는 읽기전용으로 표시.
// ⚠️ 백엔드는 소유권 검증이 없다. 여기선 UX 가드(PostDetailView 에서 authorEmail 비교 후 진입).
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostDetailStore } from '../store/postDetailStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const store = usePostDetailStore()
const { post, loading, error } = storeToRefs(store)

const title = ref('')
const content = ref('')
const submitting = ref(false)
const submitError = ref(null)

onMounted(async () => {
  // 상세 스토어에 이미 로드된 글이 없으면 새로 로드
  if (!post.value || String(post.value.id) !== String(route.params.id)) {
    await store.loadPost(route.params.id)
  }
  if (post.value) {
    title.value = post.value.title
    content.value = post.value.content
  }
})

async function submit() {
  const t = title.value.trim()
  const c = content.value.trim()
  if (!t || !c || submitting.value) return
  submitting.value = true
  submitError.value = null
  const ok = await store.update({ title: t, content: c })
  submitting.value = false
  if (ok) {
    router.replace({ name: 'post-detail', params: { id: route.params.id } })
  } else {
    submitError.value = store.error ?? '수정에 실패했어요.'
  }
}
</script>

<template>
  <div class="edit">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">후기 수정</h1>
      <v-btn
        color="primary"
        variant="flat"
        rounded="lg"
        size="small"
        :disabled="!title.trim() || !content.trim()"
        :loading="submitting"
        @click="submit"
      >
        저장
      </v-btn>
    </header>

    <!-- 로딩 -->
    <div v-if="loading" class="edit__skeleton">
      <v-skeleton-loader type="article" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error && !post" class="edit__state">
      <v-icon icon="mdi-wifi-off" size="40" class="edit__state-icon" />
      <p class="edit__state-text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="store.loadPost(route.params.id)">
        다시 시도
      </v-btn>
    </div>

    <!-- 편집 폼 -->
    <template v-else-if="post">
      <!-- 가게 이름 (읽기전용 표시) -->
      <div class="edit__readonly-label">가게</div>
      <div class="edit__readonly-val">
        <v-icon icon="mdi-map-marker-outline" size="16" color="primary" />
        {{ post.placeId ? `가게 #${post.placeId}` : '가게 정보 없음' }}
      </div>

      <!-- 이미지 (읽기전용 표시) -->
      <div v-if="post.images && post.images.length > 0" class="edit__imgs">
        <div class="edit__readonly-label">첨부 사진 (수정 불가)</div>
        <div class="edit__thumb-row">
          <v-img
            v-for="img in post.images"
            :key="img.sortOrder"
            :src="img.imageUrl"
            width="72"
            height="72"
            cover
            class="edit__thumb"
            rounded="lg"
          />
        </div>
      </div>

      <div class="edit__divider" />

      <!-- 제목 -->
      <v-text-field
        v-model="title"
        label="제목"
        placeholder="후기 제목을 입력하세요"
        variant="underlined"
        color="primary"
        maxlength="200"
        counter
        class="edit__field"
        @keydown.enter.prevent
      />

      <!-- 본문 -->
      <v-textarea
        v-model="content"
        label="본문"
        placeholder="방문 경험을 자유롭게 적어주세요"
        variant="underlined"
        color="primary"
        auto-grow
        rows="6"
        class="edit__field"
      />

      <!-- 제출 에러 -->
      <p v-if="submitError" class="edit__err">{{ submitError }}</p>
    </template>
  </div>
</template>

<style scoped>
.edit {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: env(safe-area-inset-bottom, 16px);
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
  flex: 1 1 auto;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}

.edit__skeleton,
.edit__state {
  text-align: center;
  padding: 56px 16px;
}
.edit__state-icon {
  color: rgba(var(--v-theme-on-surface), 0.3);
  margin-bottom: 12px;
}
.edit__state-text {
  margin: 0 0 18px;
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.edit__readonly-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}
.edit__readonly-val {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 12px;
}

.edit__imgs {
  margin-bottom: 4px;
}
.edit__thumb-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
  margin-bottom: 12px;
}
.edit__thumb {
  flex-shrink: 0;
  opacity: 0.7;
}

.edit__divider {
  height: 1px;
  background: rgba(var(--v-theme-on-surface), 0.07);
  margin: 8px 0 16px;
}

.edit__field {
  margin-bottom: 4px;
}

.edit__err {
  margin: 8px 0 0;
  font-size: 13px;
  color: rgb(var(--v-theme-error));
}
</style>
