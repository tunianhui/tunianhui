<!--
 * @Author: 大炸鹅
 * @Date: 2023-01-07 09:41:19
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-01-07 15:44:34
 * @FilePath: \数据智能构建\src\views\asset\list\component\table-header.vue
-->
<template>
  <div class="table-header">
    <div class="title">
      {{title}}
      <span v-if="isShowCount"> ({{ count || 0 }})</span>
    </div>
    <div class="search">
      <el-input
        v-if="isEearchShow"
        v-model="key_search"
        prefix-icon="el-icon-search"
        @input="searchChange"
        clearable
        placeholder="请输入搜索关键字"
        class="ml-10 mr-10"
      ></el-input>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    isShowCount: {
      type: Boolean,
      default: () => true
    },
    count: [Number, String],
    isEearchShow: {
      type: Boolean,
      default: () => true
    },
    title: {
      type: String,
      default: () => '数据列表'
    }
  },
  data() {
    return {
      key_search: ''
    }
  },
  methods: {
    searchChange() {
      this.$emit('change', this.key_search)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .title {
    color: #586069;
    font-size: 14px;
    font-weight: 600;
  }
  .search {
    ::v-deep .el-input .el-input__inner {
      border: none;
      border-bottom: 1px solid $grey7;
      border-radius: 0;
      height: 30px;
    }
  }
}
</style>
