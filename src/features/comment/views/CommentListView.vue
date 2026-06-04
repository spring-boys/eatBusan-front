<script setup lang="ts">
// 댓글 목록 + 작성 페이지 (기능 1세트의 레퍼런스).
// 패턴: store에서 상태/액션을 가져오고, 로딩/에러/빈 상태를 모두 처리한다.
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommentStore } from '../store/commentStore'
import CommentItem from '../components/CommentItem.vue'

// 데모용 고정 postId. 실제로는 라우트 파라미터(useRoute)로 받는다.
const postId = 1

const store = useCommentStore()
const { comments, loading, error } = storeToRefs(store)

const newContent = ref('')

onMounted(() => store.loadComments(postId, 1))

async function submit() {
  if (!newContent.value.trim()) return
  await store.addComment(postId, newContent.value.trim())
  newContent.value = ''
}
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">댓글</h1>

    <!-- 작성 -->
    <div class="d-flex gap-2 mb-6">
      <v-text-field
        v-model="newContent"
        placeholder="댓글을 입력하세요"
        density="comfortable"
        hide-details
        @keyup.enter="submit"
      />
      <v-btn color="primary" :disabled="!newContent.trim()" @click="submit">등록</v-btn>
    </div>

    <!-- 상태별 렌더 -->
    <v-progress-circular v-if="loading" indeterminate color="primary" />
    <v-alert v-else-if="error" type="error" :text="error" />
    <v-alert v-else-if="comments.length === 0" type="info" text="첫 댓글을 남겨보세요." />

    <template v-else>
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @delete="(id) => store.removeComment(postId, id)"
      />
    </template>
  </div>
</template>
