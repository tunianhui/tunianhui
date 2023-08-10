<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:02
 * @LastEditTime: 2020-07-31 17:39:22
 * @Description:
-->
<template>
  <section>
    <el-popover
      ref="nodepopper"
      v-model="visible"
      :placement="placement"
      :trigger="trigger"
      :popper-class="`${popperClass} node-popper`"
      :width="width"
      :offset="offset"
      :visible-arrow="visibleArrow"
      :title="title"
      :content="content"
      :open-delay="300"
      :transition="transition"
      @hide="popperHideHandle"
    >
      <slot></slot>
    </el-popover>
    <div
      class="node-popper-content"
      ref="nodePopRef"
      v-popover:nodepopper
    ></div>
  </section>
</template>

<script>
import {setStyles} from '@/libs/dom'

export default {
  name: 'NodePopper',
  props: {
    node: [Element, null],
    reference: Object,
    title: String,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    content: String,
    offset: Number,
    width: {
      type: Number,
      default: 225
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    popperClass: String,
    transition: String
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    node: {
      immediate: true,
      handler(node) {
        if (node) {
          const {width, height, left, top} = node.getBoundingClientRect()
          setStyles(this.$refs.nodePopRef, {
            width: `${width}px`,
            height: `${height}px`,
            top: `${top}px`,
            left: `${left}px`
          })
        }
        this.visible = !!node
      }
    }
  },
  methods: {
    popperHideHandle() {
      this.visible = !!this.node
    }
  }
}
</script>

<style lang="scss">
.node-popper.el-popper.el-popover {
  padding: 12px;
}

.node-popper-content {
  position: fixed;
  height: 0;
  z-index: 0;
}
</style>
