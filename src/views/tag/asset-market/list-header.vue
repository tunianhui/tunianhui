<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-02 22:06:58
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-06 09:55:58
 * @FilePath: \数据智能构建\src\views\tag\asset-market\list-header.vue
-->
<template>
  <div class="list-header">
    <el-checkbox v-model="curChecked">当前层级{{title}}</el-checkbox>
    <el-checkbox v-model="meChecked">只看我的</el-checkbox>
    <el-input
      placeholder="请输入内容"
      style="width:200px"
      class="ml-10"
      v-model="keywork">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button type="primary" class="ml-10" size="mini">
      <i class="iconfont icon-shaixuan mr-5"></i>筛选
    </el-button>
    <el-button type="primary">前往新建{{title}}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    <el-dropdown trigger="click">
      <el-button type="primary" class="ml-10" size="mini">
        <i class="iconfont icon-liebiao2 mr-5"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in list" :key="item.label">
          <el-checkbox v-model="item.checked">{{item.label}}</el-checkbox>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
  props: {
    title: String
  },
  data() {
    return {
      curChecked: false,
      meChecked: false,
      keywork: '',
      list: []
    }
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
</style>