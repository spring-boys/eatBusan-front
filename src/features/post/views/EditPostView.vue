<script setup>
// 후기 수정 화면. /posts/:id/edit 라우트 (전체화면, chrome: false).
// 레이아웃은 작성 화면(WritePostView)과 동일하게: 가게 상호명·사진 줄·제목·본문.
// 백엔드 제약:
//  - PATCH /posts/:id 는 title·content 만 반영한다(placeId·이미지 무시).
//  - 사진 추가:  POST   /posts/:id/images (multipart) — 구현됨
//  - 사진 삭제:  DELETE /posts/:id/images/:imageId   — 백엔드 추가 필요(미구현 시 제거만 실패)
//  - 가게(장소) 변경은 백엔드가 무시하므로 칩은 읽기전용으로 상호명만 표시.
// ⚠️ 소유권은 PostDetailView 에서 authorEmail 비교 후 진입(UX 가드).
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostDetailStore } from '../store/postDetailStore'
import { uploadPostImages, deletePostImage } from '../api/postApi'
import { fetchPlace } from '@/features/place/api/placeApi'

const MAX_PHOTOS = 5

const route = useRoute()
const router = useRouter()
const store = usePostDetailStore()
const { post, loading, error } = storeToRefs(store)

const title = ref('')
const content = ref('')
const placeName = ref('')

/** 기존(서버) 이미지 — { id, imageUrl } */
const existingImages = ref([])
/** 사용자가 제거한 기존 이미지 id 목록 */
const removedIds = ref([])
/** 새로 추가한 사진 — { file, url } */
const newPhotos = ref([])
const fileInput = ref(null)

const submitting = ref(false)
const submitError = ref(null)

const photoCount = computed(() => existingImages.value.length + newPhotos.value.length)

onMounted(async () => {
  if (!post.value || String(post.value.id) !== String(route.params.id)) {
    await store.loadPost(route.params.id)
  }
  if (post.value) {
    title.value = post.value.title
    content.value = post.value.content
    existingImages.value = (post.value.images ?? [])
      .filter((img) => img.id != null)
      .map((img) => ({ id: img.id, imageUrl: img.imageUrl }))
    // 가게 상호명 조회 (응답엔 placeId 만 있어 별도 조회)
    if (post.value.placeId) {
      try {
        const place = await fetchPlace(post.value.placeId)
        placeName.value = place?.name ?? ''
      } catch {
        placeName.value = ''
      }
    }
  }
})

function addPhotos(event) {
  const files = Array.from(event.target.files ?? [])
  event.target.value = ''
  for (const file of files) {
    if (photoCount.value >= MAX_PHOTOS) {
      submitError.value = `사진은 최대 ${MAX_PHOTOS}장까지 올릴 수 있어요.`
      break
    }
    newPhotos.value.push({ file, url: URL.createObjectURL(file) })
  }
}

function removeExisting(index) {
  const [img] = existingImages.value.splice(index, 1)
  if (img) removedIds.value.push(img.id)
}

function removeNew(index) {
  URL.revokeObjectURL(newPhotos.value[index].url)
  newPhotos.value.splice(index, 1)
}

onBeforeUnmount(() => {
  newPhotos.value.forEach((p) => URL.revokeObjectURL(p.url))
})

const canSave = computed(() => !!title.value.trim() && !!content.value.trim())

async function submit() {
  const t = title.value.trim()
  const c = content.value.trim()
  if (!t || !c || submitting.value) return
  submitting.value = true
  submitError.value = null

  const id = route.params.id

  // 1) 제목·본문 (PATCH)
  const ok = await store.update({ title: t, content: c })
  if (!ok) {
    submitError.value = store.error ?? '수정에 실패했어요.'
    submitting.value = false
    return
  }

  // 2) 사진 삭제 → 추가
  try {
    for (const imageId of removedIds.value) {
      await deletePostImage(id, imageId)
    }
    if (newPhotos.value.length > 0) {
      await uploadPostImages(id, newPhotos.value.map((p) => p.file))
    }
    // 이미지 변경을 상세에 반영
    if (removedIds.value.length > 0 || newPhotos.value.length > 0) {
      await store.loadPost(id)
    }
  } catch {
    // 제목·본문은 저장됨. 사진만 실패.
    submitError.value = '제목·본문은 저장됐지만 사진 변경에 실패했어요.'
    submitting.value = false
    return
  }

  submitting.value = false
  // 출처(query)를 유지해 저장 후에도 복귀 맥락(가게/피드)이 살아있게 한다.
  router.replace({ name: 'post-detail', params: { id }, query: route.query })
}
</script>

<template>
  <div class="write">
    <header class="write__bar">
      <button class="write__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <span class="write__heading">후기 수정</span>
      <button
        class="write__submit"
        :class="{ 'write__submit--dim': !canSave }"
        type="button"
        :disabled="!canSave || submitting"
        @click="submit"
      >
        <v-progress-circular v-if="submitting" indeterminate size="18" width="2" color="primary" />
        <template v-else>저장</template>
      </button>
    </header>

    <!-- 로딩 -->
    <div v-if="loading && !post" class="write__loading">
      <v-skeleton-loader type="article" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error && !post" class="write__state">
      <v-icon icon="mdi-wifi-off" size="40" class="write__state-icon" />
      <p class="write__state-text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="store.loadPost(route.params.id)">
        다시 시도
      </v-btn>
    </div>

    <div v-else-if="post" class="write__body">
      <!-- 가게 (읽기전용 — 수정 시 변경 불가) -->
      <div class="write__place write__place--on write__place--lock">
        <v-icon icon="mdi-map-marker-outline" size="18" />
        {{ placeName || (post.placeId ? `가게 #${post.placeId}` : '가게 정보 없음') }}
        <v-icon icon="mdi-lock-outline" size="14" class="write__place-ch" />
      </div>

      <!-- 사진 줄 -->
      <div class="write__photo-row">
        <div v-for="(img, i) in existingImages" :key="`old-${img.id}`" class="write__thumb">
          <img :src="img.imageUrl" alt="" />
          <button
            class="write__thumb-x"
            type="button"
            :aria-label="`사진 ${i + 1} 삭제`"
            @click="removeExisting(i)"
          >
            <v-icon icon="mdi-close" size="14" />
          </button>
        </div>

        <div v-for="(p, i) in newPhotos" :key="`new-${p.url}`" class="write__thumb">
          <img :src="p.url" alt="" />
          <button
            class="write__thumb-x"
            type="button"
            :aria-label="`새 사진 ${i + 1} 삭제`"
            @click="removeNew(i)"
          >
            <v-icon icon="mdi-close" size="14" />
          </button>
        </div>

        <button
          v-if="photoCount < MAX_PHOTOS"
          class="write__photos"
          type="button"
          aria-label="사진 추가"
          @click="fileInput?.click()"
        >
          <v-icon icon="mdi-camera-plus-outline" size="26" />
          <span>{{ photoCount > 0 ? `${photoCount}/${MAX_PHOTOS}` : '사진 추가' }}</span>
        </button>
        <input
          ref="fileInput"
          class="write__file"
          type="file"
          accept="image/*"
          multiple
          @change="addPhotos"
        />
      </div>

      <input v-model="title" class="write__title" type="text" maxlength="200" placeholder="제목" />
      <textarea
        v-model="content"
        class="write__content"
        rows="10"
        placeholder="이 가게, 어땠나요? 솔직한 후기를 남겨주세요."
      />

      <p v-if="submitError" class="write__notice">{{ submitError }}</p>
    </div>
  </div>
</template>

<style scoped>
.write {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-background));
}
.write__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding-inline: 14px;
  border-bottom: 1px solid rgba(33, 26, 23, 0.07);
}
.write__back {
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin-left: -4px;
  color: rgba(33, 26, 23, 0.75);
}
.write__heading {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.write__submit {
  border: 0;
  background: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 800;
  color: var(--brand);
  padding: 4px 6px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.write__submit:disabled {
  cursor: default;
}
.write__submit--dim {
  color: rgba(33, 26, 23, 0.3);
}

.write__loading,
.write__state {
  text-align: center;
  padding: 56px 16px;
}
.write__state-icon {
  color: rgba(var(--v-theme-on-surface), 0.3);
  margin-bottom: 12px;
}
.write__state-text {
  margin: 0 0 18px;
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.write__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px calc(20px + env(safe-area-inset-bottom));
}
.write__place {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  border: 1px solid rgba(33, 26, 23, 0.12);
  background: rgb(var(--v-theme-surface));
  border-radius: 9999px;
  padding: 9px 12px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(33, 26, 23, 0.7);
}
.write__place--on {
  border-color: var(--brand);
  color: var(--brand);
  background: var(--brand-tint);
}
.write__place--lock {
  cursor: default;
}
.write__place-ch {
  color: rgba(33, 26, 23, 0.35);
}
.write__photo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.write__thumb {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(33, 26, 23, 0.05);
}
.write__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.write__thumb-x {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  background: rgba(33, 26, 23, 0.6);
  color: rgb(var(--v-theme-surface));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.write__photos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 96px;
  height: 96px;
  border: 1.5px dashed rgba(33, 26, 23, 0.2);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  color: rgba(33, 26, 23, 0.5);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.write__file {
  display: none;
}
.write__title {
  border: 0;
  border-bottom: 1px solid rgba(33, 26, 23, 0.12);
  background: transparent;
  padding: 10px 2px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
  outline: none;
}
.write__content {
  border: 0;
  background: transparent;
  padding: 4px 2px;
  font-size: 15px;
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
  resize: none;
  outline: none;
  font-family: inherit;
  min-height: 220px;
}
.write__title::placeholder,
.write__content::placeholder {
  color: rgba(33, 26, 23, 0.3);
}
.write__notice {
  margin: 0;
  font-size: 13px;
  color: rgb(var(--v-theme-error));
}
</style>
