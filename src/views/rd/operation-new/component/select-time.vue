<template>
  <div class="select-quick-time">
    <div class="quick-item-wrapper">
      <div :class="['item', active === index ? 'date-checked' : '', showDateBorder ? '' : 'bg']" v-for="(item, index) in options" :key="item.value" @click="clickHandle(item, index)">
        <div class="text" :style="{'min-width': item.minWidth}">
          <span>{{item.label}}</span>
        </div>
        <el-divider direction="vertical"></el-divider>
      </div>
      <el-date-picker
        :style="{width: width}"
        v-model="value"
        :type="typeView"
        placeholder="选择日期"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :class="[showDateBorder ? 'not-border' : '']"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectQuickTime',
  inheritAttrs: false,
  model: {
    prop: "initSelectValues",
    event: "change"
  },
  props: {
    initSelectValues: {
      type: [Array, String],
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    valueFormat: {
      type: String,
      default: () => 'yyyy-MM-dd'
    },
    typeView: {
      type: String,
      default: () => 'daterange'
    },
    width: {
      type: String,
      default: () => '100%'
    },
    showDateBorder: {
      type: Boolean,
      default: () => true
    }
  },
  watch: {
    initSelectValues: {
      handler(val) {
        this.value = val
      },
      deep: true
    }
  },
  data() {
    return {
      value: [],
      active: null
    }
  },
  created() {
    this.value = this.initSelectValues
  },
  methods: {
    clickHandle(item, index) {
      if (item.fn) {
        this.value = item.fn()
      }
      this.active = index
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-quick-time {
  .quick-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 28px;
      cursor: pointer;
      background: #fff;
      &.bg {
        background: #f8f8fa;
        border-top: 1px solid #DCDFE6;
        border-bottom: 1px solid #DCDFE6;
        &:first-child {
          border-left: 1px solid #DCDFE6;
        }
      }
      .text {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        min-width: 50px;
        padding: 0 12px;
        font-size: 12px;
      }
      &.date-checked {
        background-color: #409eff;
        color: #fff;
        border-radius: 2px;
      }
    }
  }
  ::v-deep {
    .el-divider--vertical {
      height: 100%;
      margin: 0;
    }
    .el-date-editor {
      width: 100%;
      flex: auto;
      background: #f8f8fa;
      border: none;
      > input {
        border: none;
        background: #f8f8fa;
      }
      &.not-border {
        background: #fff;
        border: none;
        > input {
          border: none;
          background: #fff;
        }
      }
    }
  }
}
</style>