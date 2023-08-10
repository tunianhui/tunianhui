<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-12 11:09:37
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-12 11:18:13
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\baseline-example\critical-path-table-detail.vue
-->
<template>
  <el-table :data="tableData" style="width: 100%" class="critical-path-table-detail">
    <el-table-column prop="securityObject" label="保障对象">
      <template slot-scope="scope">
        <div style="display: flex;flex-direction: column;">
          <span style="display: flex;">
            <i class="iconfont icon-Vi mr-10 color font-16"></i>
            <OverflowTooltip>{{scope.row.securityObject}}</OverflowTooltip>
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="securityDetail" label="保障详情"></el-table-column>
    <el-table-column prop="SchedulingCycle" label="调度周期"></el-table-column>
    <el-table-column label="定时/预计产出时间">
      <template slot-scope="scope">
        <div style="display: flex;flex-direction: column;">
          <span>{{scope.row.time}}</span>
          <span>{{scope.row.time}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="归属项目/板块">
      <template>
        <div style="display: flex;flex-direction: column;">
          <span></span>
          <span></span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="priority" label="优先级"></el-table-column>
    <el-table-column prop="head" label="负责人"></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'CriticalPathTableDetail',
  data() {
    return {
      tableData: [
        {
          securityObject: 'n_466296820283788492',
          securityDetail: '-',
          SchedulingCycle: '每天',
          time: '2023-05-10 00:00:03',
          priority: '高',
          head: '大炸鹅'
        }
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.color {
  color: rgba(46, 116, 255, 1);
}
</style>