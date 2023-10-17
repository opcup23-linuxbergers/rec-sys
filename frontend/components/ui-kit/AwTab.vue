<script setup lang="ts">
import {inject} from 'vue'

const props = defineProps({
  title: String,
})

const selectedTitle = inject("selectedTitle")
</script>

<template>
  <div class="tab-content" v-show="title == selectedTitle">
    <slot/>
  </div>
</template>

<style scoped lang="scss">
.tab-content {
  transition: 0.4s all ease-out;
}
</style>