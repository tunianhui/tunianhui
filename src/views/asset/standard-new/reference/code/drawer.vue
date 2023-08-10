<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-06 16:16:24
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-06 16:47:53
 * @FilePath: \数据智能构建\src\views\asset\standard-new\reference\code\drawer.vue
-->
<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    size="40%"
    custom-class="codeTable-drawer"
    @close="closeDrawer"
  >
    <span slot="title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="运营商" name="first"></el-tab-pane>
        <el-tab-pane label="引用信息" name="second"></el-tab-pane>
      </el-tabs>
    </span>
    <NodeData title="数据"></NodeData>
  </el-drawer>
</template>

<script>
import NodeData from '@c/no-data'
export default {
  name: 'DrawerCodeTable',
  components: {
    NodeData
  },
  data() {
    return {
      drawer: true,
      direction: 'rtl',
      activeName: 'first'
    };
  },
  methods: {
    handleClick() {
      console.log('click')
    },
    closeDrawer() {
      this.$emit('closeDrawer')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .codeTable-drawer {
  .el-drawer__header {
    padding: 0!important;
    position: relative;
    border-bottom: none;
    margin-bottom: 0;
    .el-drawer__close-btn {
      position: absolute;
      right: 0;
    }
    .el-tabs__header {
      margin: 0;
      .el-tabs__nav-wrap {
        padding: 0 20px;
      }
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
</style>