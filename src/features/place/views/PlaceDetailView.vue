<script setup>
// 식당 상세: 사진 + 정보 + 후기 목록. 후기 카드는 PostCard 재사용.
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlaceDetailStore } from '../store/placeDetailStore'
import PostCard from '@/features/post/components/PostCard.vue'
import CommentSheet from '@/features/comment/components/CommentSheet.vue'

const route = useRoute()
const router = useRouter()
const store = usePlaceDetailStore()
const { place, reviews, loading, error } = storeToRefs(store)

const heroImage = computed(() => place.value?.photos?.[0] ?? place.value?.thumbnailUrl ?? null)
const hasRating = computed(() => Number.isFinite(place.value?.rating))
const metricIcon = computed(() => (hasRating.value ? 'mdi-star' : 'mdi-heart'))
const metricColor = computed(() => (hasRating.value ? 'warning' : 'secondary'))
const metricText = computed(() =>
  hasRating.value ? place.value.rating.toFixed(1) : `좋아요 ${place.value?.likeCount ?? 0}`,
)
// 단건 API(GET /api/places/{id})에는 postCnt가 없어 place.reviewCount는 항상 0 → 로드된 후기 목록 길이가 진실.
const reviewText = computed(() => `후기 ${reviews.value.length || (place.value?.reviewCount ?? 0)}`)

const commentOpen = ref(false)
const commentPostId = ref(null)
function openComments(id) {
  commentPostId.value = id
  commentOpen.value = true
}
function onCommentAdded(id) {
  const target = reviews.value.find((r) => r.id === id)
  if (target) target.commentCount += 1
}

const saved = ref(false)
const toast = ref(false)
const toastText = ref('')
const showToast = (msg) => {
  toastText.value = msg
  toast.value = true
}

function toggleSave() {
  saved.value = !saved.value
  showToast(saved.value ? '저장한 식당에 담았어요' : '저장을 해제했어요')
}

async function share() {
  const title = place.value?.name ?? 'eatBusan'
  if (navigator.share) {
    try {
      await navigator.share({ title, text: `${title} · eatBusan에서 보기` })
    } catch {
      /* 사용자가 공유 취소 — 무시 */
    }
  } else {
    showToast('공유 링크를 준비 중이에요')
  }
}

function back() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

// 후기 쓰기 — 현재 가게가 선택된 상태로 작성 화면 진입
function writeReview() {
  const id = Number(place.value?.id)
  // 백엔드 응답이 비정상이면 id가 NaN — 깨진 placeId로 작성 화면에 보내지 않는다
  if (!Number.isFinite(id) || !place.value?.name) {
    showToast('가게 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    return
  }
  router.push({
    name: 'write',
    query: { placeId: id, placeName: place.value.name },
  })
}

watch(
  () => route.params.id,
  (id) => store.load(Number(id)),
  { immediate: true },
)
</script>

<template>
  <div class="detail">
    <!-- 로딩 -->
    <div v-if="loading" class="detail__loading">
      <v-skeleton-loader type="image" class="mb-4" />
      <v-skeleton-loader type="article" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="state">
      <v-icon icon="mdi-wifi-off" size="40" class="state__icon" />
      <p class="state__text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="store.load(Number(route.params.id))">
        다시 시도
      </v-btn>
    </div>

    <template v-else-if="place">
      <!-- 히어로 (편집형: 이름 오버레이) -->
      <div class="hero">
        <v-img v-if="heroImage" :src="heroImage" :alt="place.name" :aspect-ratio="4 / 3" cover />
        <div v-else class="hero__ph"><v-icon icon="mdi-storefront-outline" size="48" /></div>
        <div class="hero__scrim"></div>
        <button class="hero__back" type="button" aria-label="뒤로" @click="back">
          <v-icon icon="mdi-chevron-left" size="26" />
        </button>
        <div class="hero__body">
          <span class="hero__cat">{{ place.category }}</span>
          <h1 class="hero__name">{{ place.name }}</h1>
          <div class="hero__rating">
            <v-icon :icon="metricIcon" size="17" :color="metricColor" aria-hidden="true" />
            <strong>{{ metricText }}</strong>
            <span class="hero__rev">{{ reviewText }}</span>
            <span v-if="place.priceRange" class="hero__price">· {{ place.priceRange }}</span>
          </div>
        </div>
      </div>

      <!-- 식당 정보 -->
      <section class="info">
        <p class="info__addr">
          <v-icon icon="mdi-map-marker-outline" size="16" aria-hidden="true" />{{ place.address }}
        </p>

        <div class="info__actions">
          <button class="act" :class="{ 'act--on': saved }" type="button" @click="toggleSave">
            <v-icon :icon="saved ? 'mdi-bookmark' : 'mdi-bookmark-outline'" size="20" />
            <span>저장</span>
          </button>
          <button class="act" type="button" @click="share">
            <v-icon icon="mdi-share-variant-outline" size="20" />
            <span>공유</span>
          </button>
          <button class="act" type="button" @click="showToast('길찾기는 곧 만나요')">
            <v-icon icon="mdi-directions" size="20" />
            <span>길찾기</span>
          </button>
        </div>
      </section>

      <!-- 후기 -->
      <section class="reviews">
        <div class="reviews__head">
          <h2 class="reviews__title">
            후기 <span class="reviews__count">{{ reviews.length }}</span>
          </h2>
          <v-btn
            variant="tonal"
            color="primary"
            size="small"
            rounded="lg"
            prepend-icon="mdi-pencil"
            @click="writeReview"
          >
            후기 쓰기
          </v-btn>
        </div>

        <div v-if="reviews.length === 0" class="reviews__empty">
          <p>첫 후기를 남겨보세요.</p>
        </div>
        <div v-else class="reviews__list">
          <PostCard
            v-for="review in reviews"
            :key="review.id"
            :post="review"
            @like="store.toggleReviewLike"
            @comment="openComments"
          />
        </div>
      </section>
    </template>

    <CommentSheet v-model="commentOpen" :post-id="commentPostId" @added="onCommentAdded" />

    <v-snackbar v-model="toast" :timeout="2000" location="top" rounded="pill" class="toast">
      {{ toastText }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.detail {
  margin: -16px -20px 0;
}
.hero {
  position: relative;
  background: rgba(31, 26, 23, 0.05);
  color: #fff;
}
.hero__ph {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  color: rgba(31, 26, 23, 0.25);
}
.hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(20, 12, 8, 0) 42%, rgba(20, 12, 8, 0.82) 100%);
}
.hero__body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 20px 22px;
}
.hero__cat {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
}
.hero__name {
  margin: 3px 0 8px;
  font-size: clamp(26px, 7.5vw, 34px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  text-wrap: balance;
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.35);
}
.hero__rating {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}
.hero__rating strong {
  font-weight: 800;
}
.hero__rev,
.hero__price {
  color: rgba(255, 255, 255, 0.8);
}
.hero__back {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  color: #191f28;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transition: transform 160ms ease;
}
.hero__back:active {
  transform: scale(0.92);
}

.info {
  padding: 18px 20px 8px;
  background: #ffffff;
}
.info__addr {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(31, 26, 23, 0.62);
}
.info__actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}
.act {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: #faf6f2;
  padding: 11px 0;
  font-size: 12px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.62);
  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  transition:
    color 160ms ease,
    background 160ms ease,
    transform 160ms ease;
}
.act:active {
  transform: scale(0.96);
}
.act--on {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.09);
  border-color: rgba(var(--v-theme-primary), 0.25);
}

.reviews {
  padding: 18px 20px;
}
.reviews__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.reviews__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.reviews__count {
  color: #b0234a;
}
.reviews__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.reviews__empty {
  text-align: center;
  padding: 32px 0;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 14px;
}

.state {
  text-align: center;
  padding: 56px 16px;
}
.state__icon {
  color: rgba(var(--v-theme-on-surface), 0.3);
  margin-bottom: 12px;
}
.state__text {
  margin: 0 0 18px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
.detail__loading {
  padding: 16px 20px;
}
</style>
