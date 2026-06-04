<script setup>
// 후기 카드 로딩 스켈레톤. 스피너 대신 카드 형태를 유지해 레이아웃 점프를 막는다 (docs/DESIGN.md).
</script>

<template>
  <div class="skeleton" aria-hidden="true">
    <v-skeleton-loader type="image, list-item-avatar, paragraph" />
  </div>
</template>

<style scoped>
.skeleton {
  background: rgb(var(--v-theme-surface));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(var(--v-theme-on-surface), 0.06);
}
.skeleton :deep(.v-skeleton-loader) {
  background: transparent;
}
</style>
