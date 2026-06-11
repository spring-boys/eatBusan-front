<script setup>
// 후기 쓰기 — 전체화면, 크롬 없음(router meta.chrome=false).
// 가게 상세에서 오면 ?placeId&placeName 으로 가게가 미리 선택되고,
// 직접 들어오면 '가게 선택' 바텀시트(PlacePickerSheet)에서 고른다.
// 등록은 postWriteStore.submit — 사진이 있으면 multipart 로 한 번에 업로드된다.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostWriteStore } from '../store/postWriteStore'
import { usePostFeedStore } from '../store/postFeedStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { USE_MOCK } from '@/shared/api/mockFallback'
import PlacePickerSheet from '../components/PlacePickerSheet.vue'

const MAX_PHOTOS = 5

const route = useRoute()
const router = useRouter()
const store = usePostWriteStore()
const feedStore = usePostFeedStore()
const auth = useAuthStore()
const { submitting, error } = storeToRefs(store)

const placeId = ref(Number(route.query.placeId) || null)
const placeName = ref(typeof route.query.placeName === 'string' ? route.query.placeName : '')
const title = ref('')
const content = ref('')
const notice = ref('')
const pickerOpen = ref(false)
const done = ref(false)

/** @type {import('vue').Ref<{ file: File, url: string }[]>} */
const photos = ref([])
const fileInput = ref(null)

// 작성에는 로그인(이메일)이 필요 — 미로그인이면 세션 복구 후 안 되면 로그인으로
onMounted(async () => {
  if (USE_MOCK) return // mock 모드는 백엔드 없이 화면 확인용 — 인증 생략
  if (auth.isAuthenticated && auth.memberEmail) return
  const ok = await auth.restoreSession()
  if (!ok) router.replace({ path: '/login', query: { redirect: route.fullPath } })
})

function onPlacePicked(picked) {
  placeId.value = picked.placeId
  placeName.value = picked.placeName
  notice.value = ''
}

function addPhotos(event) {
  const files = Array.from(event.target.files ?? [])
  event.target.value = '' // 같은 파일 재선택 허용
  for (const file of files) {
    if (photos.value.length >= MAX_PHOTOS) {
      notice.value = `사진은 최대 ${MAX_PHOTOS}장까지 올릴 수 있어요.`
      break
    }
    photos.value.push({ file, url: URL.createObjectURL(file) })
  }
}

function removePhoto(index) {
  URL.revokeObjectURL(photos.value[index].url)
  photos.value.splice(index, 1)
}

onBeforeUnmount(() => {
  photos.value.forEach((p) => URL.revokeObjectURL(p.url))
})

// 입력이 덜 됐어도 버튼은 누를 수 있게 두고, submit()이 부족한 항목을 안내한다.
// (비활성 버튼은 "왜 안 되는지"를 알려줄 수 없다)
const ready = computed(() => !!placeId.value && !!title.value.trim() && !!content.value.trim())

async function submit() {
  notice.value = ''
  store.clearError()
  if (!placeId.value) {
    notice.value = '후기를 남길 가게를 선택해주세요.'
    pickerOpen.value = true
    return
  }
  if (!title.value.trim() || !content.value.trim()) {
    notice.value = '제목과 내용을 입력해주세요.'
    return
  }

  const created = await store.submit(
    { placeId: placeId.value, title: title.value.trim(), content: content.value.trim() },
    photos.value.map((p) => p.file),
  )
  if (!created) return

  // 피드 캐시를 새로고침해 돌아갔을 때 방금 쓴 글이 바로 보이게 한다
  // ("등록은 됐는데 저장이 안 된 것 같다"로 보이는 원인 = 피드 미갱신)
  feedStore.loadFirst()

  done.value = true
  setTimeout(() => {
    if (window.history.length > 1) router.back()
    else router.push('/')
  }, 900)
}
</script>

<template>
  <div class="write">
    <header class="write__bar">
      <button class="write__back" type="button" aria-label="닫기" @click="router.back()">
        <v-icon icon="mdi-close" size="24" />
      </button>
      <span class="write__heading">후기 쓰기</span>
      <button
        class="write__submit"
        :class="{ 'write__submit--dim': !ready }"
        type="button"
        :disabled="submitting || done"
        @click="submit"
      >
        <v-progress-circular v-if="submitting" indeterminate size="18" width="2" color="primary" />
        <template v-else>등록</template>
      </button>
    </header>

    <div class="write__body">
      <button
        class="write__place"
        :class="{ 'write__place--on': placeId }"
        type="button"
        @click="pickerOpen = true"
      >
        <v-icon icon="mdi-map-marker-outline" size="18" />
        {{ placeName || '가게 선택' }}
        <v-icon icon="mdi-chevron-right" size="18" class="write__place-ch" />
      </button>

      <div class="write__photo-row">
        <div v-for="(p, i) in photos" :key="p.url" class="write__thumb">
          <img :src="p.url" alt="" />
          <button
            class="write__thumb-x"
            type="button"
            :aria-label="`사진 ${i + 1} 삭제`"
            @click="removePhoto(i)"
          >
            <v-icon icon="mdi-close" size="14" />
          </button>
        </div>

        <button
          v-if="photos.length < MAX_PHOTOS"
          class="write__photos"
          type="button"
          aria-label="사진 추가"
          @click="fileInput?.click()"
        >
          <v-icon icon="mdi-camera-plus-outline" size="26" />
          <span>{{ photos.length > 0 ? `${photos.length}/${MAX_PHOTOS}` : '사진 추가' }}</span>
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

      <input v-model="title" class="write__title" type="text" placeholder="제목" />
      <textarea
        v-model="content"
        class="write__content"
        rows="10"
        placeholder="이 가게, 어땠나요? 솔직한 후기를 남겨주세요."
      />

      <p v-if="notice || error" class="write__notice">{{ notice || error }}</p>
    </div>

    <PlacePickerSheet v-model="pickerOpen" @select="onPlacePicked" />

    <v-snackbar :model-value="done" :timeout="2000" location="top" rounded="pill">
      후기가 등록됐어요!
    </v-snackbar>
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
}
.write__submit:disabled {
  color: rgba(33, 26, 23, 0.3);
  cursor: default;
}
.write__submit--dim {
  color: rgba(33, 26, 23, 0.3);
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
  cursor: pointer;
}
.write__place--on {
  border-color: var(--brand);
  color: var(--brand);
  background: var(--brand-tint);
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
}
.write__notice {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--v-theme-error));
}
</style>
