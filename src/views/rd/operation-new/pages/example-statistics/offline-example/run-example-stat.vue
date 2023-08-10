<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-19 10:22:45
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-19 10:58:07
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\example-statistics\offline-example\run-example-stat.vue
-->
<template>
  <div class="run-example-stat">
    <div class="top-title">
      <div class="title">{{title}}</div>
      <div class="btns">
        <el-button type="default" size="mini"> <i class="el-icon-download"></i> 下载csv</el-button>
      </div>
    </div>
    <RankingTable v-bind="$attrs"></RankingTable>
  </div>
</template>

<script>
import RankingTable from './ranking'
export default {
  name: 'RunExampleStat',
  components: {
    RankingTable
  },
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped>
.run-example-stat {
  padding: 5px 15px 15px 15px;
  .top-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>