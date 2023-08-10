<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-02 11:32:59
 * @LastEditTime: 2023-03-03 14:28:35
 * @Description:
-->

<template>
  <div class="list-header">
    <div class="page-title">{{ title }}</div>
    <div>
      <el-checkbox v-model="meChecked">必填属性</el-checkbox>
      <el-input placeholder="请输入属性名称" style="width:160px" class="ml-10" v-model="keywork">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="plain" class="ml-10" size="mini">
        <i class="iconfont icon-shaixuan mr-5"></i>
      </el-button>
      <el-button type="primary" @click="$emit('clickAddAttr')"><i class="el-icon-plus"></i>新建属性</el-button>
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
      keywork: '',
      list: []
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
