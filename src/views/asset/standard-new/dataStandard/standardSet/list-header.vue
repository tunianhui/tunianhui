<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 11:32:59
 * @LastEditTime: 2023-04-13 17:42:44
 * @Description:
-->

<template>
  <div class="list-header">
    <div class="page-title">{{ title }}</div>
    <div>
      <el-checkbox v-model="meChecked">我加入的</el-checkbox>
      <el-checkbox v-model="meChecked">我维护的</el-checkbox>
      <el-input placeholder="请输入标准集名称编码" style="width:170px" class="ml-10" v-model="keywork">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" class="ml-10" @click="add"><i class="el-icon-plus"></i>新建标准</el-button>
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
      meChecked: false,
      keywork: ''
    }
  },
  methods: {
    add () {
      this.$emit('add')
    }
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
