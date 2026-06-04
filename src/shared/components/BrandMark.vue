<script setup>
// eatBusan 앱 마크 (인라인 SVG). 플랫 탱저린 타일 + 헤비 'e' 한 글자.
// 글자는 폰트로 렌더하므로 손으로 그린 패스처럼 깨질 일이 없다.
</script>

<template>
  <svg viewBox="0 0 64 64" fill="none" role="img" aria-label="eatbusan" class="bm">
    <rect width="64" height="64" rx="16" fill="#F2541B" />
    <text
      x="32"
      y="34"
      text-anchor="middle"
      dominant-baseline="central"
      fill="#ffffff"
      font-family="'Pretendard Variable', Pretendard, system-ui, sans-serif"
      font-size="42"
      font-weight="800"
      letter-spacing="-1"
    >
      e
    </text>
  </svg>
</template>

<style scoped>
.bm {
  display: block;
}
</style>
