<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 11:32:59
 * @LastEditTime: 2023-04-06 09:35:49
 * @Description:
-->

<template>
  <div class="list-header">
    <div class="page-title">{{ title }}</div>
    <div>
      <el-input placeholder="请输入模板名称" style="width:140px" class="mr-10" v-model="keywork">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" @click="$emit('clickAdd')"><i class="el-icon-plus"></i>新建审批模板</el-button>
      <el-button type="plain" icon="el-icon-refresh-right"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
  props: {
    title: String
  },
  data () {
    return {
      keywork: ''
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
