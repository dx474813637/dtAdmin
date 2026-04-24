<script setup lang="ts">
import type { ScrollAreaRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit, useScroll  } from "@vueuse/core"
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaViewport,
} from "reka-ui"
import { cn } from "@/lib/utils"
import ScrollBar from "./ScrollBar.vue"
const viewportRef = ref<HTMLElement | null>(null)
// 解构出滚动相关的响应式数据
const { arrivedState, directions, isScrolling } = useScroll(viewportRef)
const props = defineProps<ScrollAreaRootProps & { class?: HTMLAttributes["class"] }>()
const delegatedProps = reactiveOmit(props, "class")

watch(() => arrivedState.bottom, (isBottom) => {
  if (isBottom) {
    console.log('滚动到了底部，加载更多数据...')
  }
})

// 监听抵达顶部状态
watch(() => arrivedState.top, (isTop) => {
  if (isTop) {
    console.log('滚动到了顶部')
  }
})
</script>

<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    v-bind="delegatedProps"
    :class="cn('relative', props.class)"
  >
    <ScrollAreaViewport 
      ref="viewportRef"
      data-slot="scroll-area-viewport"
      class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
