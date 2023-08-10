<!--
 * @Author: YONG
 * @Date: 2023-06-05 15:01:08
 * @LastEditors: YONG
 * @LastEditTime: 2023-06-05 16:21:26
-->
<template>
  <div class="header">
    <!-- left -->
    <div class="flex">
      <!-- 标题 -->
      <div class="page-title mr-20" v-if="title">{{title}}</div>
      <!-- tabs -->
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane :name="item.value" v-for="item in tabs" :key="item.value">
          <span slot="label">
            <span>{{item.label}}</span>
            <span v-if="showCount">（{{item.total}}）</span>
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
  name: 'page-Header',
  props: {
    active: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => []
    },
    // 是否显示数字
    showCount: {
      type: Boolean,
      default: false
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
      this.$emit('change', this.activeTab)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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
