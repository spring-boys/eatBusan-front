<script setup>
// 댓글 하단 바텀시트. 후기 카드의 댓글 아이콘을 누르면 열린다.
// 댓글 목록 + 작성 + (본인 댓글) 삭제. 상태는 commentStore에서 가져온다.
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommentStore } from '../store/commentStore'
import { formatRelativeTime } from '@/shared/utils/time'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  postId: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue', 'added'])

const store = useCommentStore()
const { comments, loading, error } = storeToRefs(store)

const draft = ref('')
const submitting = ref(false)

watch(
  () => [props.modelValue, props.postId],
  ([open, id]) => {
    if (open && id != null) {
      draft.value = ''
      store.loadComments(id, 1)
    }
  },
  { immediate: true },
)

async function submit() {
  const content = draft.value.trim()
  if (!content || props.postId == null || submitting.value) return
  submitting.value = true
  try {
    await store.addComment(props.postId, content)
    draft.value = ''
    emit('added', props.postId)
  } finally {
    submitting.value = false
  }
}

function removeMine(id) {
  if (props.postId != null) store.removeComment(props.postId, id)
}
</script>

<template>
  <v-bottom-sheet
    :model-value="modelValue"
    attach="#app-shell"
    contained
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="sheet">
      <div class="sheet__grab" aria-hidden="true" />
      <div class="sheet__head">
        <h2 class="sheet__title">
          댓글<span v-if="comments.length" class="sheet__count">{{ comments.length }}</span>
        </h2>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          aria-label="닫기"
          @click="emit('update:modelValue', false)"
        />
      </div>

      <div class="sheet__body">
        <div v-if="loading" class="sheet__state">
          <v-progress-circular indeterminate color="primary" size="26" />
        </div>
        <div v-else-if="error" class="sheet__state">{{ error }}</div>
        <div v-else-if="comments.length === 0" class="sheet__empty">
          <v-icon icon="mdi-comment-text-outline" size="34" class="mb-2" />
          <p>첫 댓글을 남겨보세요.</p>
        </div>
        <ul v-else class="clist">
          <li v-for="c in comments" :key="c.id" class="citem">
            <v-avatar size="32" color="grey-lighten-3" class="citem__av">
              <span class="citem__init">{{ (c.authorNickname || '익').charAt(0) }}</span>
            </v-avatar>
            <div class="citem__main">
              <div class="citem__top">
                <span class="citem__nick">{{ c.authorNickname || '익명' }}</span>
                <span class="citem__time">{{ formatRelativeTime(c.createdAt) }}</span>
              </div>
              <p class="citem__text">{{ c.content }}</p>
            </div>
            <v-btn
              v-if="c.authorNickname === '나'"
              icon="mdi-delete-outline"
              size="x-small"
              variant="text"
              color="error"
              aria-label="댓글 삭제"
              @click="removeMine(c.id)"
            />
          </li>
        </ul>
      </div>

      <div class="sheet__input">
        <v-text-field
          v-model="draft"
          placeholder="댓글을 입력하세요"
          density="comfortable"
          variant="solo-filled"
          flat
          rounded="lg"
          hide-details
          @keyup.enter="submit"
        />
        <v-btn
          icon="mdi-send"
          color="primary"
          :disabled="!draft.trim()"
          :loading="submitting"
          aria-label="댓글 등록"
          @click="submit"
        />
      </div>
    </div>
  </v-bottom-sheet>
</template>

<style scoped>
.sheet {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(24px);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  box-shadow: 0 -12px 40px -16px rgba(16, 24, 40, 0.3);
}
.sheet__grab {
  width: 40px;
  height: 4px;
  border-radius: 9999px;
  background: rgba(var(--v-theme-on-surface), 0.15);
  margin: 8px auto 0;
}
.sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 20px;
}
.sheet__title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
}
.sheet__count {
  margin-left: 6px;
  color: rgb(var(--v-theme-primary));
}

.sheet__body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 4px 20px 8px;
}
.sheet__state,
.sheet__empty {
  text-align: center;
  padding: 40px 0;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 14px;
}

.clist {
  list-style: none;
  margin: 0;
  padding: 0;
}
.citem {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}
.citem__init {
  font-size: 13px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
.citem__main {
  flex: 1 1 auto;
  min-width: 0;
}
.citem__top {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.citem__nick {
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}
.citem__time {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.4);
}
.citem__text {
  margin: 2px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.8);
  word-break: break-word;
}

.sheet__input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}
.sheet__input :deep(.v-text-field) {
  flex: 1 1 auto;
}
</style>
