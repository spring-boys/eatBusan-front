<script setup>
// 좋아요한 맛집. 실제 API를 우선 호출하고, API 미연결 시 placeLike mock fallback을 사용한다.
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { usePlaceLikeStore } from '../store/placeLikeStore'
import { useInfiniteScroll } from '@/shared/composables/useInfiniteScroll'
import BrandMark from '@/shared/components/BrandMark.vue'

const router = useRouter()
const store = usePlaceLikeStore()
const { myLikes, loading, loadingMore, error } = storeToRefs(store)
const { setSentinel } = useInfiniteScroll(() => store.loadMore())

onMounted(() => {
  store.loadMyLikes()
})
</script>

<template>
  <div class="mylikes">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">좋아요한 맛집</h1>
    </header>

    <div v-if="loading" class="empty">
      <v-progress-circular indeterminate color="primary" size="28" width="3" />
    </div>

    <div v-else-if="error" class="empty">
      <v-icon icon="mdi-wifi-off" size="40" class="empty__ic" />
      <p class="empty__t">{{ error }}</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="store.loadMyLikes()">
        다시 시도
      </v-btn>
    </div>

    <div v-else-if="myLikes.length === 0" class="empty">
      <div class="empty__brand" aria-hidden="true">
        <BrandMark />
      </div>
      <h2 class="empty__title">좋아요한 음식점이 아직 없어요</h2>
      <v-btn color="primary" rounded="lg" size="large" class="empty__btn" @click="router.push('/')">
        맛집 둘러보기
      </v-btn>
    </div>

    <template v-else>
      <ul class="list">
        <li v-for="p in myLikes" :key="p.placeLikeId">
          <router-link :to="`/places/${p.placeId}`" class="row">
            <div class="row__info">
              <h3 class="row__name">{{ p.name }}</h3>
              <p class="row__addr">{{ p.address }}</p>
            </div>
            <span class="row__like"> <v-icon icon="mdi-heart" size="15" />{{ p.likeCnt }} </span>
          </router-link>
        </li>
      </ul>
      <div :ref="setSentinel" class="mylikes__sentinel">
        <v-progress-circular v-if="loadingMore" indeterminate color="primary" size="24" width="3" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.mylikes {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.sub-hd {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0 16px;
}
.sub-hd__back {
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin-left: -8px;
  color: rgba(33, 26, 23, 0.75);
}
.sub-hd__title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: var(--depth-1);
  text-decoration: none;
  color: inherit;
}
.row__info {
  flex: 1;
  min-width: 0;
}
.row__name {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row__addr {
  margin: 3px 0 0;
  font-size: 13px;
  color: rgba(33, 26, 23, 0.5);
}
.row__like {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  font-weight: 800;
  color: var(--rose);
}
.empty {
  flex: 1;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 10px 72px;
}
.empty__brand {
  width: min(190px, 74%);
  height: 52px;
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
  opacity: 0.96;
}
.empty__brand :deep(.bm) {
  height: 100%;
  width: auto;
}
.empty__ic {
  color: rgba(33, 26, 23, 0.3);
  margin-bottom: 12px;
}
.empty__title {
  margin: 0 0 22px;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.empty__btn {
  min-width: 176px;
  font-weight: 800;
}
.mylikes__sentinel {
  min-height: 1px;
  display: flex;
  justify-content: center;
  padding: 18px 0 2px;
}
</style>
