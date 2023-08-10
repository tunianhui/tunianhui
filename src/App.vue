<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-08-19 09:53:45
 * @LastEditTime: 2023-07-20 14:57:30
 * @Description:
-->
<template>
  <div id="app">
    
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  @extend .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  @extend .size;
}
</style>
