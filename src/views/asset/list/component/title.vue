<!--
 * @Author: 大炸鹅
 * @Date: 2023-01-07 10:15:02
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-01-07 13:33:09
 * @FilePath: \数据智能构建\src\views\asset\list\component\title.vue
-->
<template>
  <div class="asset-detail-title">
    <span>
      {{title}}
      <span class="border-box"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'AssetSetailTitle',
  props: {
    title: String
  }
}
</script>

<style lang="scss">
.asset-detail-title {
  margin: 10px 0;
  font-size: 14px;
  color: #36393C;
  height: 24px;
  border-bottom: 1px solid #e5eeff;
  >span {
    background: #e5eeff;
    padding: 2px 5px;
    padding-right: 0;
    position: relative;
    height: 100%;
    display: inline-block;
    .border-box {
      position: absolute;
      right: -24px;
      top: 0;
      width: 24px;
      height: 24px;
      background: #e5eeff;
      border: 12px solid #fff;
      border-left: 12px solid #e5eeff;
      border-bottom: 12px solid #e5eeff;
    }
  }
  
}
</style>
