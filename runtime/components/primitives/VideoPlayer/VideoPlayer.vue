<script lang="ts" setup>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/http-streaming'
import { ref, onMounted, onBeforeUnmount, useAttrs } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/VideoPlayer.module.css'

defineOptions({
  name: 'VideoPlayer',
  inheritAttrs: false
})

const videoNode = ref<HTMLVideoElement | null>(null)
let player: ReturnType<typeof videojs> | null = null

defineProps<{
  /**
   * The source URL of the video to play (e.g., an m3u8 stream).
   */
  src: string
}>()

onMounted(() => {
  if (videoNode.value) {
    player = videojs(
      videoNode.value,
      {
        autoplay: true,
        controls: true,
        muted: true,
        playsinline: true,
        responsive: true
      },
      function () {
        const startTimeInSeconds = 8243
        this.currentTime(startTimeInSeconds)
        this.requestFullscreen()
      }
    )
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
  }
})

const attrs = useAttrs()
const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'VideoPlayer')
</script>

<template>
  <video ref="videoNode" :class="[classList, 'video-js']" v-bind="processedAttrs">
    <source :src="src" type="application/vnd.apple.mpegurl" />
  </video>
</template>
