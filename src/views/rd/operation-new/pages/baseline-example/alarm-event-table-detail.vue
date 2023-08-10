<template>
  <el-table :data="tableData" style="width: 100%" class="alarm-event-table-detail">
    <el-table-column prop="alarmNode" label="告警节点">
      <template slot-scope="scope">
        <div style="display: flex;flex-direction: column;">
          <span style="display: flex;">
            <i class="iconfont icon-Vi mr-10 color font-16"></i>
            <OverflowTooltip>{{scope.row.alarmNode}}</OverflowTooltip>
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="alarmReason" label="告警原因"></el-table-column>
    <el-table-column prop="lastAlarmTime" label="最近告警时间"></el-table-column>
    <el-table-column prop="recipient" label="接收人"></el-table-column>
    <el-table-column prop="currentState" label="当前状态">
      <template slot-scope="scope">
        <div>
          <i :class="[currentState[scope.row.currentState].icon, 'mr-5']" :style="{color: currentState[scope.row.currentState].color}"></i>
          <span>{{currentState[scope.row.currentState].name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80" align="right">
      <template>
        <el-tooltip class="item" effect="dark" content="告警事件" placement="top">
          <i class="iconfont icon-baojing cursor font-18 color"></i>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'AlarmEventTableDetail',
  data() {
    return {
      currentState: {
        1: {
          name: '告警完成',
          icon: 'iconfont icon-yikaiqi',
          color: '#4AC059'
        }
      },
      tableData: [
        {
          alarmNode: 'n_466296820283788492',
          alarmReason: '基线预警',
          lastAlarmTime: '2023-05-10 00:00:03',
          recipient: '大炸鹅',
          currentState: '1'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
  color: rgba(46, 116, 255, 1);
}
.cursor {
  cursor: pointer;
}
</style>