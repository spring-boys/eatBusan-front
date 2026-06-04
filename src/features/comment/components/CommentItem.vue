<script setup lang="ts">
// 댓글 1건 표시 컴포넌트. 스타일 값은 하드코딩하지 않고 Vuetify 컴포넌트/토큰 사용.
import type { CommentResponse } from '../types/comment'

defineProps<{ comment: CommentResponse }>()
const emit = defineEmits<{ (e: 'delete', id: number): void }>()
</script>

<template>
  <v-card variant="outlined" class="mb-2">
    <v-card-text class="d-flex justify-space-between align-start">
      <div>
        <div class="text-body-1">{{ comment.content }}</div>
        <div class="text-caption text-medium-emphasis mt-1">
          {{ new Date(comment.createdAt).toLocaleString() }}
        </div>
      </div>
      <v-btn
        icon="mdi-delete"
        size="small"
        variant="text"
        color="error"
        @click="emit('delete', comment.id)"
      />
    </v-card-text>
  </v-card>
</template>
