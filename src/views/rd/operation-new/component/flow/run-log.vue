<!--
 * @Author: 大炸鹅
 * @Date: 2023-07-10 14:23:17
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-12 18:05:53
 * @FilePath: \智能数据构建\src\views\rd\operation-new\component\flow\run-log.vue
-->
<template>
  <div class="run-log-wrapper">
    <MonacoEditor :code.sync="log" :readonly="true"></MonacoEditor>
  </div>
</template>

<script>
export default {
  name: 'RunLog',
  data() {
    return {
      keyword: '',
      log: 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz',
      activeNames: ''
    }
  },
}
</script>

<style lang="scss" scoped>
.run-log-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>