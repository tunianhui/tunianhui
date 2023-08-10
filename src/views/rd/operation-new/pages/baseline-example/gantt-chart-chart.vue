<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-12 15:13:29
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-12 15:43:42
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\baseline-example\gantt-chart-chart.vue
-->
<template>
  <div class="gantt-chart-chart">
    <div style="height: 28px; display: flex; align-items: center;" class="mb-15">
      <span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <span style="color: rgba(46,116,255,1);cursor: pointer;font-size:12px" @click="backHand">基线实例</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span style="font-size:12px">基线实例详情</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </div>
    <div class="baseline-gantt-content"></div>
  </div>
</template>

<script>
export default {
  name: 'GanttChartChart',
  methods: {
    backHand() {
      this.$emit('back')
    },
  }
}
</script>

<style lang="scss" scoped>
.gantt-chart-chart {
  width: 100%;
  height: 100%;
  padding: 10px 20px 20px 20px;
  color: #333;
  .baseline-gantt-content {
    
  }
}
</style>