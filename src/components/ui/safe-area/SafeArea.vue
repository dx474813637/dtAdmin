<template>
  <div
    :class="[
      'safe-area-bottom',
      { 'h-safe': enable },
      className
    ]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ref, onMounted } from "vue"

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"]
}>(), {
  class: ""
})

const emit = defineEmits<{
  (e: "update:enable", value: boolean): void
}>()

const enable = ref(false)
const className = props.class

onMounted(() => {
  // 检测是否为全面屏设备
  const checkSafeArea = () => {
    const hasBottomSafeArea = window.innerHeight > document.documentElement.clientHeight || 
                              window.screen.height - window.innerHeight > 100
    enable.value = hasBottomSafeArea
    emit("update:enable", hasBottomSafeArea)
  }
  
  checkSafeArea()
  window.addEventListener("resize", checkSafeArea)
})
</script>

<style scoped>
.safe-area-bottom {
  width: 100%;
}

.h-safe {
  height: env(safe-area-inset-bottom);
  min-height: 34px;
}
</style>