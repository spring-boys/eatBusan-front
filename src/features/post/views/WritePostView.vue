<script setup>
// 후기 쓰기 — 목업(UI only). 전체화면, 크롬 없음(router meta.chrome=false).
// TODO(AI 연동): submit 을 features/post/api/postApi.js 의 createPost(body) 로 연결.
//   body = { userId, placeId, email, title, content } (백엔드 PostRequireDto). 사진 업로드는 Post Image API 확정 후.
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const placeName = ref('')
const title = ref('')
const content = ref('')
const notice = ref('')

function submit() {
  notice.value = ''
  if (!title.value || !content.value) {
    notice.value = '제목과 내용을 입력해주세요.'
    return
  }
  notice.value = '목업 화면이에요. 실제 등록은 postApi.createPost 연동 예정입니다.'
}
</script>

<template>
  <div class="write">
    <header class="write__bar">
      <button class="write__back" type="button" aria-label="닫기" @click="router.back()">
        <v-icon icon="mdi-close" size="24" />
      </button>
      <span class="write__heading">후기 쓰기</span>
      <button class="write__submit" type="button" @click="submit">등록</button>
    </header>

    <div class="write__body">
      <button class="write__place" type="button">
        <v-icon icon="mdi-map-marker-outline" size="18" />
        {{ placeName || '가게 선택' }}
        <v-icon icon="mdi-chevron-right" size="18" class="write__place-ch" />
      </button>

      <button class="write__photos" type="button" aria-label="사진 추가">
        <v-icon icon="mdi-camera-plus-outline" size="26" />
        <span>사진 추가</span>
      </button>

      <input v-model="title" class="write__title" type="text" placeholder="제목" />
      <textarea
        v-model="content"
        class="write__content"
        rows="10"
        placeholder="이 가게, 어땠나요? 솔직한 후기를 남겨주세요."
      />

      <p v-if="notice" class="write__notice">{{ notice }}</p>
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
.write__place-ch {
  color: rgba(33, 26, 23, 0.35);
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
