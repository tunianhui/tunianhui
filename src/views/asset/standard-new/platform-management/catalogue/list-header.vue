<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-02 11:32:59
 * @LastEditTime: 2023-03-03 17:22:02
 * @Description:
-->

<template>
  <div class="list-header">
    <div class="page-title">{{ title }}</div>
    <div>
      <el-input placeholder="请输入目录名称/编码" style="width:160px" class="mr-10" v-model="keywork">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" @click="$emit('clickAddCatelogue')"><i class="el-icon-plus"></i>新建一级目录</el-button>
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
