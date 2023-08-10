<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 11:32:59
 * @LastEditTime: 2023-04-06 17:18:24
 * @Description:
-->

<template>
  <div class="list-header">
    <el-checkbox v-model="meChecked">我负责的</el-checkbox>
    <el-checkbox v-model="meChecked">已开启的</el-checkbox>
    <el-input placeholder="请输入规则名称" style="width:140px" class="ml-10" v-model="keywork">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button type="plain" class="ml-10" size="mini">
      <i class="iconfont icon-shaixuan mr-5"></i>
    </el-button>
    <el-button type="primary" @click="$emit('addRule')"><i class="el-icon-plus"></i>新建映射规则</el-button>
    <el-button type="plain" icon="el-icon-refresh-right"></el-button>
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
    // const promise = new Promise(function (resolve, reject) {
    // })
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>
