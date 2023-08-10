<template>
  <!-- <div :class="['tablepage-detail', {'is-collapse': cur_collapse}]" :style="{height: `${height}px`}" @wheel.stop="WheelEvent"> -->
  <div :class="['tablepage-detail', {'is-collapse': cur_collapse}]" :style="{height: `${height}px`}">
    <div class="tablepage-detail-table">
      <slot></slot>
    </div>
    <div class="tablepage-detail-main" :style="{width: mainWidth}" v-show="cur_collapse">
      <div class="detail-page">
        <slot class="detail-slot" name="detail"></slot>
      </div>
      <div class="tablepage-detail-close" @click="collapseHandle">
        <i class="icon el-icon-caret-right"></i>
      </div>
      <!-- :style="{top: `${height/2}px`}" -->
      <!-- cur_fullscreen ? 'full' : '' -->
      <div :class="['tablepage-detail-collapse']" @click="fullscreenHandle">
        <i class="icon el-icon-caret-left"></i>
      </div>
    </div>
  </div>
</template>

<script>
// import func from 'vue-editor-bridge'
export default {
  name: 'swiper',
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number
      // default: 300
    },
    cellWidth: {
      type: Number,
      default: 345
    },
    fullscreen: Boolean,
    wheelHeight: Number
  },
  data () {
    return {
      cur_collapse: this.collapse,
      cur_fullscreen: this.fullscreen,
      setslot: 0
    }
  },
  computed: {
    mainWidth () {
      // if (this.cur_fullscreen) return `calc(100% - 180px)`
      if (this.cur_fullscreen) return `100%`
      return this.cur_collapse ? `calc(100% - 250px)` : 0
      // return this.cur_collapse ? `calc(100% - 180px)` : 0
    }
  },
  watch: {
    collapse (val) {
      this.cur_collapse = this.collapse
    },
    fullscreen (val) {
      this.cur_fullscreen = val
    }
  },
  mounted () {
    this.$nextTick(_ => {
      // window.addEventListener('wheel', function() {
      // })
    })
  },
  methods: {
    visibleDetail () {
      this.cur_collapse = true
      this.$emit('update:collapse', this.cur_collapse)
    },
    collapseHandle () {
      this.cur_collapse = !this.cur_collapse
      this.$emit('collapse', this.cur_collapse)
      // this.$emit('update:collapse', this.cur_collapse)
    },
    fullscreenHandle () {
      this.cur_fullscreen = !this.cur_fullscreen
      this.$emit('isFull', this.cur_fullscreen)
    }
  }
}
</script>

  <style lang="less">
.tablepage-detail {
  position: relative;

  &.is-collapse {
    // .tablepage-detail-main {
    //   width: calc(~"100% - 300px");
    // }
  }
  .tablepage-detail-table {
  }
  .tablepage-detail-main {
    margin-top: 50px;
    .iconfont {
      color: #a7a7a7;
    }
    //   position: fixed;
    position: absolute;
    right: 0;
    top: -50px;
    //   bottom: 50;
    width: 0;
    // height: 100%;
    // box-shadow: -3px 0 12px rgba(0, 0, 0, 0.3);
    border-top: 1px solid #ddd;
    box-shadow: -3px 2px 4px 0 rgba(0, 0, 0, 0.12),
      0 0 6px 0 rgba(0, 0, 0, 0.04);
    // border: 1px solid #ddd;
    transition: all 0.3s ease-in-out;
    background-color: #fff;
    z-index: 1;
    .detail-page {
      background-color: #f8f8fa;
      height: 100%;
      .detail-slot {
        background-color: #f8f8fa;
        height: 100%;
      }
    }
    .tablepage-detail-collapse,
    .tablepage-detail-close {
      position: absolute;
      width: 16px;
      height: 34px;
      line-height: 34px;
      // background-color: @init;
      color: #fff;
      // cursor: pointer;
      z-index: 2;
      // top: 50%;
      left: -8px;
    }
    .tablepage-detail-collapse {
      top: 50%;
      // left: 0;
      // top: 30%;
      // transform: translateY(-50%);
      // border-top-right-radius: 6px;
      // border-bottom-right-radius: 6px;
      .iconfont {
        background-color: #2e74ff;
        color: #fff;
      }
      background-color: #2e74ff;
    }
    .tablepage-detail-close {
      top: calc(50% - 34px);
      background-color: #eee;
      // border-top-left-radius: 6px;
      // border-bottom-left-radius: 6px;
    }
  }
}
</style>
