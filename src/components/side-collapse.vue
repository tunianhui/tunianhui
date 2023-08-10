<template lang="html">
  <section class="side-collapse"
    :class="[{'collapsed': curCollapse}, 'collapse__' + placement]"
    :style="{width: !curCollapse ? width : 0, 'min-width': !curCollapse ? minWidth : 0, height: height}"
  >
    <div class="sc-content">
      <slot></slot>
    </div>
    <div class="sc-collapse"
      :class="[collapseClass, shape]"
      @click="collapseHandle"
    >
      <div class="sc-collapse-wrapper" :class="bgStyle">
        <i :class="'el-icon-d-arrow-' + reversePos"></i>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ToggleCollapse',
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      defalut: '200px'
    },
    height: {
      type: String,
      defalut: '100%'
    },
    minWidth: {
      type: String,
      default: ''
    },
    collapseClass: {
      type: String,
      default: ''
    },
    shape: {
      type: String,
      default: 'rectangle' // rectangle | trapezoid
    },
    // inside: Boolean,
    placement: {
      type: String,
      default: 'right'
      // [
      // 'right-top', 'right', 'right-bottom'
      // 'left-top, left', 'left-bottom',
      // 'top-left', 'top', 'top-right', 暂不支持
      // 'bottom-left', 'bottom', 'bottom-right', 暂不支持
      // ]
    }
  },
  data() {
    return {
      pos: '',
      reversePos: '',
      curCollapse: this.collapse || false
    }
  },
  // watch: {
  //   collapse(value) {
  //     this.curCollapse = value;
  //   }
  // },
  computed: {
    bgStyle() {
      return !this.curCollapse
        ? `sc-collapse-wrapper__${this.pos}`
        : `sc-collapse-wrapper__${this.reversePos}`
    }
  },
  created() {
    this.pos = this.placement.indexOf('-') > -1 ? this.placement.substring(0, this.placement.indexOf('-')) : this.placement
    this.reversePos = this.pos === 'left' ? 'right' : 'left'
  },
  methods: {
    collapseHandle() {
      this.curCollapse = !this.curCollapse
      this.$emit('update:collapse', this.curCollapse)
    }
  }
}
</script>

<style lang="scss" scoped>
.side-collapse {
  position: relative;
  height: 100%;
  transition: all 0.3s linear;

  $BgPrimary: #4d4d4d;
  $BgHover: #404040;

  .sc-content {
    height: 100%;
    overflow: hidden;
  }
  .sc-collapse {
    position: absolute;
    cursor: pointer;
    z-index: 10;
    transition: all 0.1s ease, 0.1s ease;

    .sc-collapse-wrapper {
      // width: 0;
      // height: 32px;
      // line-height: 32px;
      transition: all 0.1s ease, 0.1s ease;
      i {
        transition: all 0.1s ease, 0.1s ease;
        color: #ccc;
      }
      &:hover {
        i {
          color: #fff;
        }
      }
    }
  }

  .trapezoid {
    // $collapseWidth: 32px;
    // $collapseHeight: 32px;
    .sc-collapse-wrapper {
      width: 0;
      height: 32px;
      line-height: 32px;
    }
    // trapezoid 梯形css
    .sc-collapse-wrapper__left,
    .sc-collapse-wrapper__right {
      border-bottom: 9px solid transparent;
      border-top: 9px solid transparent;
    }
    .sc-collapse-wrapper__left {
      border-left: 13px solid $BgPrimary;
      i {
        margin-left: -13px;
      }
      &:hover {
        border-left-width: 17px;
        border-left-color: $BgHover;
      }
    }
    .sc-collapse-wrapper__right {
      border-right: 13px solid $BgPrimary;
      &:hover {
        border-right-width: 17px;
        border-right-color: $BgHover;
      }
    }
  }
  .rectangle {
    .sc-collapse-wrapper {
      width: 16px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-color: $BgPrimary;
      &:hover {
        background-color: $BgHover;
      }
    }
    .sc-collapse-wrapper__right {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .sc-collapse-wrapper__left {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  &.collapse__left-top {
    .sc-collapse {
      left: 0;
      top: 0;
    }
  }

  &.collapse__left {
    .sc-collapse {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &.collapse__left-bottom {
    .sc-collapse {
      left: 0;
      bottom: 0;
    }
  }
  &.collapse__right-top {
    .sc-collapse {
      right: 0;
      top: 0;
    }
  }
  &.collapse__right {
    .sc-collapse {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &.collapse__right-bottom {
    .sc-collapse {
      right: 0;
      bottom: 0;
    }
  }

  &.collapsed {
    &.collapse__right-top,
    &.collapse__right,
    &.collapse__right-bottom {
      .sc-collapse {
        left: 0;
        .sc-collapse-wrapper-right {
          i {
            margin-left: -13px;
            transform: rotate(180deg);
          }
        }
      }
    }
    &.collapse__left-top,
    &.collapse__left,
    &.collapse__left-bottom {
      .sc-collapse {
        left: -13px;
        .sc-collapse-wrapper-left {
          i {
            transform: rotate(180deg);
          }
        }

        &.trapezoid {
          &:hover {
            left: -17px;
          }
        }
        &.rectangle {
          left: -16px;
          &:hover {
            left: -16px;
          }
        }
      }
    }
  }
}
</style>
