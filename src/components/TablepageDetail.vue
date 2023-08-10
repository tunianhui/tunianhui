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
      <div :class="['tablepage-detail-collapse', cur_fullscreen ? 'full' : '']" @click="fullscreenHandle" :style="{top: `${height/2}px`}">
        <i class="el-icon-d-arrow-left" style="background-color: #A7A7A7; height: 20px;"></i>
      </div>
      <div class="tablepage-detail-close" @click="collapseHandle">
        <!-- <i class="el-icon-d-arrow-right"></i> -->
        <i class="el-icon-close" style="background-color:#A7A7A7; width: 15px; height: 17px; border-radius: 30% 0 0 30%;"></i>
      </div>
    </div>
  </div>
</template>

<script>
// import func from 'vue-editor-bridge'
export default {
  name: 'TablepageDetail',
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 300
    },
    cellWidth: {
      type: Number,
      default: 345
    },
    fullscreen: Boolean,
    wheelHeight: Number,
  },
  data() {
    return {
      cur_collapse: this.collapse,
      cur_fullscreen: this.fullscreen,
      setslot: 0,
    }
  },
  computed: {
    mainWidth() {
      if (this.cur_fullscreen) return `calc(100% - 180px)`
      return this.cur_collapse ? '50%' : 0
      // return this.cur_collapse ? `calc(100% - 180px)` : 0

    },
  },
  watch: {
    collapse(val) {
      this.cur_collapse = this.collapse
    },
    fullscreen(val) {
      this.cur_fullscreen = val
    },
  },
  mounted() {
    this.$nextTick(_ => {
      // window.addEventListener('wheel', function() {
      // })
    })
  },
  methods: {
    visibleDetail() {
      this.cur_collapse = true
      this.$emit('update:collapse', this.cur_collapse)
    },
    collapseHandle() {
      this.cur_collapse = !this.cur_collapse
      this.$emit('collapse', this.cur_collapse)
      this.$emit('update:collapse', this.cur_collapse)
    },
    fullscreenHandle() {
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
    .iconfont{
        color: #A7A7A7;
    }
    position: fixed;
    // position: absolute;
    right: 0;
    top: 0;
    // bottom: 0;
    width: 0;
    // height: 100%;
    // box-shadow: -3px 0 12px rgba(0, 0, 0, 0.3);
    border-top: 1px solid #ddd;
    box-shadow: -3px 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    // border: 1px solid #ddd;
    transition: all 0.3s ease-in-out;
    background-color: #fff;
    z-index: 1;
    .detail-page {
      background-color: #F8F8FA;
      height: 100%;
      .detail-slot {
        background-color: #F8F8FA;
        height: 100%;
      }
    }
    .tablepage-detail-collapse, .tablepage-detail-close {
      position: absolute;
      width: 14px;
      height: 34px;
      line-height: 34px;
      // background-color: @init;
      color: #fff;
      cursor: pointer;
      z-index: 2;
    }
    .tablepage-detail-collapse {
      left: 0;
      // top: 30%;
      transform: translateY(-50%);
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      &.full i{
        width: 12px;
        // height: 20px;
        transform: rotate(180deg);
      }
    }
    .tablepage-detail-close {
      left: -14px;
      top: 0;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
  }
}
</style>
