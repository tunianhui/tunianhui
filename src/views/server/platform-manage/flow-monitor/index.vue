<template>
  <div class="page-flow-monitor">
    <h3 class="page-title">编排流程监控</h3>
    <div class="top">
      <el-table :data="appData"
                style="width: 100%">
        <el-table-column prop="appId"
                         label="APP_ID"> </el-table-column>
        <el-table-column prop="appName"
                         label="API编码名称"> </el-table-column>
        <el-table-column prop="beginTime"
                         label="运行开始时间">
        </el-table-column>
        <el-table-column prop="endTime"
                         label="运行结束时间时间">
        </el-table-column>
        <el-table-column prop="duration"
                         label="运行时长"> </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-tabs v-model="activeName">
        <el-tab-pane label="编排流程监控"
                     name="first">
          <flow></flow>
        </el-tab-pane>
        <el-tab-pane label="任务明细"
                     name="second">
          <el-table :data="taskData"
                    style="width: 100%">
            <el-table-column prop="taskName"
                             label="任务名称">
            </el-table-column>
            <el-table-column prop="taskType"
                             label="任务类型">
            </el-table-column>
            <el-table-column prop="beginTime"
                             label="开始时间">
            </el-table-column>
            <el-table-column prop="endTime"
                             label="结束时间时间">
            </el-table-column>
            <el-table-column prop="status"
                             label="状态"> </el-table-column>
            <el-table-column prop="lastTime"
                             label="最后编辑时间">
            </el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)"
                           type="primary"
                           size="mini">明细日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="输入输出"
                     name="third">输入输出</el-tab-pane>
        <el-tab-pane label="JSON"
                     name="fourth">JSON</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Flow from './flow.vue'
export default {
  components: {
    Flow
  },
  data () {
    return {
      appData: [
        {
          appId: 'qwqw3qwqwytuuytf5rdgh1ddht32fd1f',
          appName: '域名后缀分布',
          beginTime: '2021-11-13 22:22:22',
          endTime: '2021-11-15 22:22:22',
          duration: '316S'
        }
      ],
      activeName: 'first',
      taskData: [
        {
          taskName: 'leaderRatify',
          taskType: 'api',
          beginTime: '2021-05-13 22：22:22',
          endTime: '2021-10-10 22：22:22',
          status: 'COMPLETED',
          lastTime: 'COMPLETED'
        },
        {
          taskName: 'leaderRatify',
          taskType: 'api',
          beginTime: '2021-05-13 22：22:22',
          endTime: '2021-10-10 22：22:22',
          status: 'COMPLETED',
          lastTime: 'COMPLETED'
        }
      ]
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-flow-monitor {
  height: 100%;
  .page-title {
    font-size: 24px;
    color: #333;
    font-weight: 400;
  }
  .top {
    height: 88px;
    background-color: #fff;
  }
  .bottom {
    height: calc(100% - 170px);
    background-color: #fff;
    margin-top: 20px;
    padding: 0 20px;
  }
}
</style>

<style lang="scss">
.page-flow-monitor {
  .el-tabs {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 70px);
  }
  .el-tab-pane {
    height: 100%;
  }
}
</style>
