<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-04 11:54:05
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-04 13:51:02
 * @FilePath: \数据智能构建\src\views\rd\operation-new\component\check-select.vue
-->
<template>
  <el-select
    v-model="selectValues"
    v-bind="$attrs"
    v-on="$listeners"
    multiple
    :placeholder="placeholder"
    style="width: 50%"
    @change="changeSelect"
    filterable
  >
    <el-option v-if="options.length" label="全选" value="全选">
      <el-checkbox v-model="isSelectAll" @click.prevent.native>全选</el-checkbox>
    </el-option>
    <el-option v-for="item in options" :key="item[props.value]" :label="item[props.label]" :value="item[props.value]">
      <el-checkbox v-model="item.isCheck" @click.prevent.native>{{item[props.label]}}</el-checkbox>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "MultipleSelect",
  inheritAttrs: false,// 似乎设不设置都可以
  model: {
    prop: "initSelectValues",
    event: "change"
  },
  props: {
    initSelectValues: {
      type: Array,
      default: () => []
    },
    // 下拉选项
    options: {
      type: Array,
      default: () => []
    },
    // 选项键值对
    props: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value"
        }
      }
    },
    placeholder: {
      type: String,
      default: "请选择"
    }
  },
  data() {
    return {
      selectValues: [],
      isSelectAll: false
    }
  },
  watch: {
    // 监听（全选，全不选以及checkbox是否勾选）
    selectValues: {
      handler(arr) {
        this.options.forEach(item => {
          if (arr.includes(item[this.props.value])) {
            item.isCheck = true
          } else {
            item.isCheck = false
          }
        })

        if (arr.length === this.options.length) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
        }
        // 强制更新（checkbox回显)
        this.$forceUpdate()
      }
    }
  },
  created() {
    // 回显
    this.selectValues = this.initSelectValues
  },
  methods: {
    changeSelect(val) {
      if (val.includes("全选")) {
        // 说明已经全选了，所以全不选
        if (val.length > this.options.length) {
          this.selectValues = []
        } else {
          this.selectValues = this.options.map(item => item[this.props.value])
        }
      }
      this.$emit("change", this.selectValues)
    }
  }
}
</script>