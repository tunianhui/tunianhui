<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-05 10:56:47
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-07 10:14:09
 * @FilePath: \dataphin\src\views\rd\operation-new\component\page-table-layout.vue
-->
<template>
  <div :class="['page-table-layout', showDag ? 'active' : '']" :style="{height: height ? `${height}px` : '100%'}" ref="pageTableLayout">
    <div class="left" v-show="showLeft" :style="{width: showDag ? `${width}px` : null, height: height ? height : '100%'}">
      <slot name="left"></slot>
    </div>
    <div :class="['right', showLeft ? '' : 'active']" v-show="showDag">
      <slot name="right"></slot>
      <div class="switch">
        <span @click="leftClickHange">
          <i class="el-icon-caret-left"></i>
        </span>
        <span @click="rightClickHange">
          <i class="el-icon-caret-right"></i>
        </span>
      </div>
      <!-- <div class="hand-drag" @mousedown.stop="mousedown" @mouseup.stop="handleUp" v-if="showLeft">
        <span></span>
        <span></span>
        <span></span>
      </div> -->
    </div>
  </div>
</template>


<script>
import { on, off } from '@/libs/dom'
  export default {
    name: 'PageTableLayout',
    props: {
      showDag: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        showLeft: true,
        width: 350
      }
    },
    methods: {
      leftClickHange() {
        this.$emit('leftClickHange')
        this.showLeft = true
      },
      rightClickHange() {
        this.showLeft = !this.showLeft
      },
      mousedown(e) {
        e.preventDefault()
        on(document, 'mousemove', this.handleMove)
      },
      handleMove(e) {
        this.width = e.pageX - 57
        if (this.width < 345) {
          this.width = 350
          this.handleUp(e)
        }        
      },
      handleUp(e) {
        e.preventDefault()
        off(document, 'mousemove', this.handleMove)
      },
    }
  }
</script>

<style lang="scss" scoped>
.page-table-layout {
  width: 100%;
  // height: 100%;
  &.active {
    display: flex;
    .left {
      // width: 300px;
      // width: 0;
    }
    .right {
      flex: 1;
      width: 0;
      background: #fff;
      border-left: 1px solid rgba($color: #000000, $alpha: 0.15);
      position: relative;
      &.avtive {
        // width: 300px;
        height: 100%;
        flex: initial;
        border-left: none;
      }
      .switch {
        position: absolute;
        left: -16px;
        top: 40%;
        z-index: 9999;
        >span {
          color: rgba($color: #000000, $alpha: 0.45);
          height: 40px;
          background: #eee;
          display: inline-block;
          line-height: 40px;
          cursor: pointer;
          &:first-child {
            border-radius: 4px 0 0 4px;
            border-right: 1px solid rgba($color: #000000, $alpha: 0.15);
          }
          &:last-child {
            border-radius: 0 4px 4px 0;
            border-left: 1px solid rgba($color: #000000, $alpha: 0);
          }
        }
      }
      .hand-drag {
        position: absolute;
        width: 16px;
        height: 30px;
        display: flex;
        flex-direction: column;
        left: -8px;
        top: 40%;
        background: #eee;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        >span {
          width: 3px;
          height: 2px;
          background: rgba($color: #000000, $alpha: 0.45);
          margin-bottom: 2px;
        }
      }
    }
  }
}
</style>
