<!--
 * @Author: YONG
 * @Date: 2023-06-05 15:01:08
 * @LastEditors: YONG
 * @LastEditTime: 2023-06-05 14:59:46
-->
<template>
  <div class="header">
    <!-- left -->
    <div class="flex">
      <div class="page-title mr-20" v-if="title">{{title}}</div>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane :name="item.value" v-for="item in tabs" :key="item.value">
          <span slot="label">
            {{item.label}}
            <span v-if="showCount">({{item.total}})</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- right -->
    <div>
      <div class="flex">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    // 是否显示数字
    showCount: {
      type: Boolean,
      default: () => true
    },
    active: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeTab: this.active
    }
  },
  created () {
  },
  methods: {
    handleClick (tab) {
      this.activeTab = tab.name
      this.$emit('tab-click', tab)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  // padding-bottom: 2px;
  border-bottom: 1px solid #d9d9d9;
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs__item) {
    padding: 0 10px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
}
</style>
