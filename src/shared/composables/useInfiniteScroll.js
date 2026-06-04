// 무한 스크롤 공통 컴포저블. 센티넬 엘리먼트가 뷰포트에 근접하면 콜백을 호출한다.
// 함수 ref(setSentinel)를 반환하므로 템플릿에서 :ref="setSentinel" 로 바인딩한다.
import { onBeforeUnmount } from 'vue'

/**
 * @param {() => void} onLoadMore 센티넬이 노출되면 호출되는 콜백 (다음 페이지 로드 등)
 * @param {string} [rootMargin] 미리 로드를 시작할 여유 거리 (기본 400px)
 */
export function useInfiniteScroll(onLoadMore, rootMargin = '400px 0px') {
  /** @type {IntersectionObserver | null} */
  let observer = null

  /** @param {Element | import('vue').ComponentPublicInstance | null} el */
  function setSentinel(el) {
    observer?.disconnect()
    observer = null
    if (el instanceof Element) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onLoadMore()
        },
        { rootMargin },
      )
      observer.observe(el)
    }
  }

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { setSentinel }
}
