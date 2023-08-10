<template>
  <div class="switch-plane">
    <div class="label">节点ID：</div>
    <el-input v-model="nodeId" placeholder="请输入节点ID"></el-input>
    <div class="label">双击连接分支节点，然后设置分支条件</div>
    <div class="button" @click="handleClick">设置分支条件</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodeId: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('setOptions')
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
  .button {
    height: 34px;
    color: #409eff;
    line-height: 34px;
    text-align: center;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #409eff;
  }
}
</style>
