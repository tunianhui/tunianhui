<template>
  <div :class="classes">
    <div :class="barConClasses">
      <i :class="`${prefix}-bar`" v-once v-for="i in 8" :key="`trigger-${i}`"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trigger',
  props: {
    mode: String,
    visible: Boolean
  },
  data() {
    return {
      prefix: 'split-trigger',
      initOffset: 0
    }
  },
  computed: {
    isVertical() {
      return this.mode === 'vertical'
    },
    classes() {
      return [
        this.prefix,
        this.isVertical
          ? `${this.prefix}-vertical`
          : `${this.prefix}-horizontal`,
        {'is-visible': this.visible}
      ]
    },
    barConClasses() {
      return [
        `${this.prefix}-bar-con`,
        this.isVertical ? 'vertical' : 'horizontal'
      ]
    }
  }
}
</script>
