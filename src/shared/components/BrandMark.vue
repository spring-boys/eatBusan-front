<script setup>
// eatBusan 워드마크 로크업 (인라인 SVG).
// "eatBusan" 글자 아래로 가넷 곡선이 흐른다. (혓바닥 모티프는 제거됨.)
</script>

<template>
  <svg viewBox="0 0 300 82" fill="none" role="img" aria-label="eatBusan" class="bm">
    <!-- 워드마크: eat(잉크) + Busan(가넷) -->
    <text
      x="10"
      y="50"
      font-family="'Pretendard Variable', Pretendard, system-ui, sans-serif"
      font-size="46"
      font-weight="800"
      letter-spacing="-2"
    >
      <tspan fill="#211A17">eat</tspan><tspan fill="#B0234A">Busan</tspan>
    </text>

    <!-- 단어 전체 아래로 흐르는 곡선 -->
    <path
      d="M14 67 C70 80 140 80 196 65"
      stroke="#B0234A"
      stroke-width="6"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.bm {
  display: block;
  height: 100%;
  width: auto;
}
</style>
