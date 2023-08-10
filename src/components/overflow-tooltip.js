import Vue from 'vue'
import {on, off, setStyles} from '@/libs/dom'

/*
  import OverflowTooltip from '@c/overflow-tooltip'
  <OverflowTooltip popper-class="dark-popper" width="100px"> test test test test </OverflowTooltip>
  <OverflowTooltip>
    <span style="width: 100px;">test test test test</span>
  </OverflowTooltip>
*/
export default {
  // extends: Tooltip,
  name: 'OverflowTooltip',
  inheritAttrs: false,
  props: {
    maxWidth: Number,
    width: Number,
    placement: {
      type: String,
      default: 'top'
    },
    popperClass: {
      type: String,
      default: 'dark-popper'
    }
  },
  data() {
    return {
      visibleTooltip: false,
      tooltipContent: ''
    }
  },
  beforeCreate() {
    if (this.$isServer) return
    this.tooltipVM = new Vue({
      data: {node: ''},
      render(h) {
        return this.node
      }
    }).$mount()
  },
  created() {
    this.activateTooltip = this.$debounce(tooltip => {
      tooltip.handleShowPopper()
    }, 50)
  },
  render(h) {
    if (this.tooltipVM) {
      this.tooltipVM.node = (
        <el-tooltip
          ref="tooltip"
          placement={this.placement}
          content={this.tooltipContent}
          popper-class={this.popperClass}
          v-bind={this.$attrs}
          v-on={this.$listeners}
        />
      )
    }

    return this.getFirstElement()
  },
  mounted() {
    setStyles(this.$el, {
      display: `inline-block`,
      width: `${this.width}px`,
      maxWidth: `${this.maxWidth}px`,
      overflow: `hidden`,
      textOverflow: `ellipsis`,
      whiteSpace: `nowrap`,
      verticalAlign: 'bottom'
    })
    on(this.$el, 'mouseenter', this.handlerMouseEnter)
    on(this.$el, 'mouseleave', this.handlerMouseLeave)
    on(window, 'resize', this.visibleTipHandle)
  },
  beforeDestroy() {
    off(window, 'resize', this.visibleTipHandle)
  },
  methods: {
    getFirstElement() {
      const slots = this.$slots.default
      if (!Array.isArray(slots)) return null
      let slot = slots[0] || {},
        element = null
      if (!slot.tag && !slot.isComment) {
        element = <span>{slot.text}</span>
      } else if (slot.tag) {
        element = slot
      }
      return element
    },
    handlerMouseEnter() {
      const range = document.createRange()
      range.setStart(this.$el, 0)
      range.setEnd(this.$el, this.$el.childNodes.length)
      const rangeWidth = range.getBoundingClientRect().width

      const tooltip = this.$refs.tooltip

      if (Math.round(rangeWidth) > this.$el.offsetWidth && tooltip) {
        this.tooltipContent = this.$el.innerText || this.el.textContent
        tooltip.referenceElm = this.$el
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
        tooltip.doDestroy()
        tooltip.setExpectedState(true)
        this.activateTooltip(tooltip)
      }
    },
    handlerMouseLeave() {
      const tooltip = this.$refs.tooltip
      if (tooltip) {
        tooltip.setExpectedState(false)
        tooltip.handleClosePopper()
      }
    }
  }
}
