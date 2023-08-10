<!--
 * @Author: 大炸鹅
 * @Date: 2023-07-25 15:34:16
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-25 15:41:25
 * @FilePath: \智能数据构建\src\views\layout\help-drawer-header.vue
-->
<template>
  <div class="drawer-header">
    <div class="header-title">{{title}}</div>
    <div class="header-operate">
      <slot name="operate"></slot>
      <i class="el-icon-close" @click="$emit('close')"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpDrawerHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-header {
  height: 55px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  // cursor: move;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  .header-title {

  }
  .header-operate {
    > i {
      font-size: 16px;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>