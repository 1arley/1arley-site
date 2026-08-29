/**
 * Canvas UI shared utility — rect cache.
 * Lazily reads the element's bounding rect, invalidated on resize.
 */
export interface RectCache {
  readonly current: DOMRect
  destroy: () => void
}

export function createRectCache(element: HTMLElement): RectCache {
  let rect: DOMRect | null = null
  const invalidate = () => {
    rect = null
  }
  const observer = new ResizeObserver(invalidate)
  observer.observe(element)

  return {
    get current(): DOMRect {
      if (!rect) {
        rect = element.getBoundingClientRect()
      }
      return rect
    },
    destroy() {
      observer.disconnect()
      rect = null
    },
  }
}