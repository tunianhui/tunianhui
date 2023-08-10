<template>
  <div :class="['input-number']">
    <span class="input-number-arrow-top arrow" role="button" @click="reduce">
      <i class="el-icon-arrow-down"></i>
    </span>
    <span class="input-number-arrow-bottom arrow" role="button" @click="plus">
      <i class="el-icon-arrow-up"></i>
    </span>
    <el-input ref="input" v-model.number="displayValue" @input="input" :max="10" :maxlength="maxlength"> </el-input>
  </div>
</template>

<script>
export default {
  name: 'InputNumber',
  props: {
    value: [String, Number],
    data: Object,
    maxlength: {
      type: Number,
      default: 1
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.displayValue = val
      }
    }
  },
  data() {
    return {
      displayValue: ''
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val)
    },
    reduce() {
      this.$emit('reduce')
      // this.data.two = this.data.two - 1
      // this.$emit('input', val)
    },
    plus() {
      this.$emit('plus')
    }
  }
}
</script>

<style lang="scss">
.input-number {
  position: relative;
  display: inline-block;
  width: 80px;
  line-height: 26px;
  .arrow {
    right: 1px;
    border-left: 1px solid #dcdfe6;
    height: auto;
    z-index: 1;
    width: 30px;
    text-align: center;
    position: absolute;
    cursor: pointer;
    background: #f5f7fa;
  }
  &-arrow-top {
    bottom: 1px;
    top: auto;
    left: auto;
    border-right: none;
    line-height: 13px;
    color: #c0c4cc;
    font-size: 13px;
  }
  &-arrow-bottom {
    border-bottom: 1px solid #dcdfe6;
    line-height: 12px;
    top: 1px;
    color: #606266;
    font-size: 13px;
  }
}
</style>
