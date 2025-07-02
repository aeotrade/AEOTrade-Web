<template>
  <svg :class="svgClass">
    <use :xlink:href="`#icon-${iconClass ?? 'null'}`"  />
  </svg>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  class?: string
  iconClass: string | null
  width?: number,
  height?: number,
}>(), {
  iconClass: '',
})

const svgClass = computed( () => [
  'svg-icon',
  props.class
])
</script>


<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
