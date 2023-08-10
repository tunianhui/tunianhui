<template>
  <div ref="outerWrapper" :class="wrapperClasses">
    <div v-if="isHorizontal" :class="`${prefix}-horizontal`">
      <div :style="{right: `${anotherOffset}%`}" class="left-pane" :class="paneClasses">
        <slot name="left" />
      </div>
      <div :class="`${prefix}-trigger-con`" :style="{left: `${tempOffset}%`}" @mousedown="handleMousedown">
        <slot name="trigger">
          <trigger ref="trigger" mode="vertical" :visible="showTrigger" />
        </slot>
      </div>
      <div :style="{left: `${offset}%`}" class="right-pane" :class="paneClasses">
        <slot name="right" />
      </div>
    </div>
    <div v-else :class="`${prefix}-vertical`">
      <div :style="{bottom: `${anotherOffset}%`}" class="top-pane" :class="paneClasses">
        <slot name="top" />
      </div>
      <div :class="`${prefix}-trigger-con`" :style="{top: `${tempOffset}%`}" @mousedown="handleMousedown">
        <slot name="trigger">
          <trigger ref="trigger" mode="horizontal" :visible="showTrigger" />
        </slot>
      </div>
      <div :style="{top: `${offset}%`}" class="bottom-pane" :class="paneClasses">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
import {on, off, removeClass, addClass} from '@/libs/dom'
import Trigger from './trigger.vue'
import './style.scss'

/*
 * left mode 为 horizontal 时可用，左边面板
 * right mode 为 horizontal 时可用，右边面板
 * top mode 为 vertical 时可用，上边面板
 * bottom mode 为 vertical 时可用，下边面板
 * trigger 自定义分割拖拽节点
 */
export default {
  name: 'Split',
  components: {
    Trigger
  },
  props: {
    // 面板位置，可以是 0~1 代表百分比，或具体数值的像素，可用 v-model 双向绑定
    value: {
      type: [Number, String],
      default: 0.5
    },
    mode: {
      validator(value) {
        return ['horizontal', 'vertical'].includes(value)
      },
      default: 'horizontal'
    },
    min: {
      type: [Number, String],
      default: '40px'
    },
    max: {
      type: [Number, String],
      default: '40px'
    },
    showTrigger: Boolean
  },
  /**
   * Events
   * @on-move-start
   * @on-moving 返回值：事件对象，但是在事件对象中加入了两个参数：atMin(当前是否在最小值处), atMax(当前是否在最大值处)
   * @on-move-end
   */
  data() {
    return {
      prefix: 'split',
      offset: 0,
      oldOffset: 0,
      tempOffset: 0,
      isMoving: false
    }
  },
  computed: {
    wrapperClasses() {
      return [`${this.prefix}-wrapper`, this.isMoving ? 'no-select' : '']
    },
    paneClasses() {
      return [
        `${this.prefix}-pane`,
        {
          [`${this.prefix}-pane-moving`]: this.isMoving
        }
      ]
    },
    isHorizontal() {
      return this.mode === 'horizontal'
    },
    anotherOffset() {
      return 100 - this.offset
    },
    valueIsPx() {
      return typeof this.value === 'string'
    },
    offsetSize() {
      return this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
    },
    computedMin() {
      return this.getComputedThresholdValue('min')
    },
    computedMax() {
      return this.getComputedThresholdValue('max')
    }
  },
  watch: {
    value(val) {
      this.setOffset()
    }
  },
  created() {
    // this.debounceMouseDown = this.$debounce(_ => this.handleMousedown(e), 100)
  },
  mounted() {
    this.$nextTick(() => {
      this.setOffset()
    })
    on(window, 'resize', this.setOffset)
  },
  beforeDestroy() {
    off(window, 'resize', this.setOffset)
  },
  methods: {
    px2percent(numerator, denominator) {
      return parseFloat(numerator) / parseFloat(denominator)
    },
    getComputedThresholdValue(type) {
      const size = this.$refs.outerWrapper[this.offsetSize]
      let val = 0

      let m = this[type]
      if (type === 'max') {
        if (typeof m === 'string') {
          m = `${size - parseFloat(m)}px`
        } else {
          m = 1 - m
        }
      }
      if (this.valueIsPx) {
        val = typeof m === 'string' ? m : size * m
      } else {
        val = typeof m === 'string' ? this.px2percent(m, size) : m
      }
      return val
    },
    getMin(value1, value2) {
      return this.valueIsPx ? `${Math.min(parseFloat(value1), parseFloat(value2))}px` : Math.min(value1, value2)
    },
    getMax(value1, value2) {
      return this.valueIsPx ? `${Math.max(parseFloat(value1), parseFloat(value2))}px` : Math.max(value1, value2)
    },
    getAnotherOffset(value) {
      return this.valueIsPx ? `${this.$refs.outerWrapper[this.offsetSize] - parseFloat(value)}px` : 1 - value
    },
    handleMove(e) {
      const pageOffset = this.isHorizontal ? e.pageX : e.pageY
      const offset = pageOffset - this.initOffset
      const outerWidth = this.$refs.outerWrapper[this.offsetSize]
      let value = this.valueIsPx
        ? `${parseFloat(this.oldOffset) + offset}px`
        : this.px2percent(outerWidth * this.oldOffset + offset, outerWidth)
      const anotherValue = this.getAnotherOffset(value)
      if (parseFloat(value) <= parseFloat(this.computedMin)) {
        value = this.getMax(value, this.computedMin)
      }

      if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) {
        value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax))
      }

      e.atMin = this.value === this.computedMin
      e.atMax = this.valueIsPx
        ? this.getAnotherOffset(this.value) === this.computedMax
        : this.getAnotherOffset(this.value).toFixed(5) === this.computedMax.toFixed(5)
      this.tempOffset = this.computeOffset(value)
      this.tempValue = value

      this.$emit('on-moving', e)
    },
    handleUp() {
      this.isMoving = false
      this.tempValue && this.$emit('input', this.tempValue)
      !this.showTrigger && this.triggerClass(false)
      off(document, 'mousemove', this.handleMove)
      off(document, 'mouseup', this.handleUp)
      this.$emit('on-move-end')
    },
    handleMousedown(e) {
      this.initOffset = this.isHorizontal ? e.pageX : e.pageY
      this.oldOffset = this.value
      this.isMoving = true
      !this.showTrigger && this.triggerClass(true)
      on(document, 'mousemove', this.handleMove)
      on(document, 'mouseup', this.handleUp)
      this.$emit('on-move-start')
    },
    computeOffset(value) {
      value = value || this.value
      const v = this.valueIsPx ? this.px2percent(value, this.$refs.outerWrapper[this.offsetSize]) : value

      return (v * 10000) / 100
    },
    triggerClass(visible) {
      const $trigger = this.$refs.trigger
      const klass = 'is-visible'
      if ($trigger) {
        const el = $trigger.$el
        visible ? addClass(el, klass) : removeClass(el, klass)
      }
    },
    setOffset() {
      this.offset = this.computeOffset()
      this.tempOffset = this.offset
    }
  }
}
</script>
