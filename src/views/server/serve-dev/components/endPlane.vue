<template>
  <div class="switch-plane">
    <div class="label">节点ID：</div>
    <el-input v-model="nodeId" placeholder="请输入节点ID"></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodeId: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-plane {
  height: 400px;
  .label {
    color: #666666;
    line-height: 30px;
    letter-spacing: 0.7px;
  }
}
</style>
