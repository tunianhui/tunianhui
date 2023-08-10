<!--
 * @Author: 大炸鹅
 * @Date: 2023-01-07 15:21:47
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-03-06 18:53:23
 * @FilePath: \数据智能构建\src\views\asset\list\component\tabs.vue
-->
<template>
  <div class="asset-tabs-box">
    <div class="custom">
      <slot name="tab-right"></slot>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      
      <el-tab-pane :label="tab.label" :name="tab.value" v-for="tab in tabs" :key="tab.value" lazy>
        <slot :name="tab.value"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'AssetTabsBox',
  props: {
    tabs: Array
  },
  data() {
    return {
      activeName: this.tabs[0].value
    }
  },
  methods: {
    handleClick(tab) {
      this.$emit('changeTab', this.activeName)
    }
  }
}
</script>

<style lang="scss">
.asset-tabs-box {
  height: 100%;
  width: 100%;
  position: relative;
  .el-tabs {
    height: 100%;
    
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content {
      height: calc(100% - 40px);
      
    }
  }
  .custom {
    position: absolute;
    z-index: 9;
    top: 10px;
    right: 0;
  }
}
</style>