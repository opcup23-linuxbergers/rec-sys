<script setup lang="ts">
import {useSlots} from 'vue'

const slots = useSlots()
const tabTitles = ref(slots.default?.().map((tab) => tab.props.title))
const selectedTitle = ref(tabTitles.value[0])

provide("selectedTitle", selectedTitle)
</script>

<template>
  <div>
    <div class="tabs">
      <ul class="tabs-header">
        <li class="tabs-header-item"
            v-for="title in tabTitles"
            :key="title"
            :class="{selected: selectedTitle == title}"
            @click="selectedTitle = title"
        >
          <span>{{ title }}</span>
        </li>
      </ul>
    </div>
    <slot/>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/main.scss' as *;

.tabs {
  padding: 20px 0 10px;
}

.tabs-header {
  display: flex;
  align-items: center;
  gap: 10px 5px;
}

.tabs-header-item {
  display: inline-block;
  text-align: center;
  text-justify: auto;
  padding: 5px;
  border-radius: 20px;
  border: 1px solid $primary-color-light;
  list-style-type: none;
  user-select: none;
  transition: 0.4s all ease-out;
  & span {
    font-size: 16px;
  }
}

.selected {
  border: 1px solid $primary-color;
}
</style>