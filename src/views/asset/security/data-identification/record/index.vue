<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-01 10:22:52
 * @Description:
-->
<template>
  <section class="security-wrapper">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">识别结果</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="识别记录" name="1"></el-tab-pane>
          <el-tab-pane label="识别任务" name="2"></el-tab-pane>
          <!-- <el-tab-pane label="手动添加" name="3"></el-tab-pane> -->
        </el-tabs>
      </div>
      <div v-if="activeName === '1'" class="flex">
        <el-input v-model="searchText" prefix-icon="el-icon-search" clearable placeholder="请输入账号名称" class="ml-10 mr-10"></el-input>
        <el-button icon="iconfont icon-filter" @click="handleFilter">筛选</el-button>
        <el-button @click="clickHistory">上传历史</el-button>
        <el-button type="primary" @click="buttonClick">手动添加</el-button>
        <el-button @click="reshclick" icon="el-icon-refresh-right"></el-button>
      </div>
    </div>

    <template v-if="activeName === '1'">
      <Record2 :showCondition="showCondition" :reshNum="reshNum" :searchText="searchText"></Record2>
    </template>

    <template v-if="activeName === '2'">
      <Task></Task>
    </template>

    <template v-if="activeName === '3'">
      <!-- <Manual></Manual> -->
    </template>
    <History v-if="isHistoryVisible" @closehistory="closehistory"></History>
  </section>
</template>

<script>
import Record2 from './record.vue'
import Task from './task.vue'
import Manual from './manual.vue'
import History from './history'
export default {
  name: 'Record',
  components: {
    Record2,
    Task,
    Manual,
    History
  },
  data () {
    return {
      activeName: '1',
      showCondition: false,
      isHistoryVisible: false,
      reshNum: 1,
      searchText: ''
    }
  },
  created () {

  },
  methods: {
    reshclick () {
      this.reshNum = this.reshNum + 1
    },
    closehistory () {
      this.isHistoryVisible = false
    },
    clickHistory () {
      this.isHistoryVisible = true
    },
    buttonClick () {
      // :to="{ path: '/asset/security/data-identification/record/addittion' }"
      this.$router.push({ path: '/asset/security/data-identification/record/addittion' }) // 这里写个自定义的跳转地址。比如说，你的应用
    },
    handleFilter () {
      this.showCondition = !this.showCondition
    },
    handleClick () {

    }
  }
}
</script>

<style lang="scss">
.security-wrapper {
  height: 100%;
}
</style>
