<template>
  <div class="baseline-example-detail">
    <div class="wrapper">
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
      <div v-loading="loading">
        <div class="content">
          <div class="baseline-detail-title">
            <div class="baseline-detail-title-icon">
              <i class="iconfont icon-jixian"></i>
              <span>基线实例</span>
            </div>
            <div class="baseline-detail-title-data">
              <div class="title-data-top">
                <div class="title-data-top-data">
                  <div class="item">
                    <div class="title-name">
                      <span>青蔷薇</span>
                    </div>
                  </div>
                  <div class="item">
                    <el-tag type="danger">破线</el-tag>
                  </div>
                  <div class="item">
                    <span style="font-size:12px;color:rgba(0,0,0,0.75)">余量 0min</span>
                  </div>
                </div>
                <div class="to-link" @click="toBaselineHandle">
                  <i class="iconfont icon-jixian"></i>
                  查看基线
                </div>
              </div>
              <div class="title-data-bottom">
                <div class="title-data-bottom-item">
                  <div class="title-label">
                    <span>业务日期</span>
                  </div>
                  <div class="content-text">
                    <span>2023-05-09</span>
                  </div>
                </div>
                <div class="title-data-bottom-item">
                  <div class="title-label">
                    <span>负责人</span>
                  </div>
                  <div class="content-text">
                    <span>张三</span>
                  </div>
                </div>
                <div class="title-data-bottom-item">
                  <div class="title-label">
                    <span>优先级</span>
                  </div>
                  <div class="content-text">
                    <span>最高</span>
                  </div>
                </div>
                <div class="title-data-bottom-item">
                  <div class="title-label">
                    <span>基线类型</span>
                  </div>
                  <div class="content-text">
                    <span>天基线</span>
                  </div>
                </div>
                <div class="title-data-bottom-item">
                  <div class="title-label">
                    <span>保障时间</span>
                  </div>
                  <div class="content-text">
                    <span>2023-05-10 00:00:00</span>
                  </div>
                </div>
                <div class="title-data-bottom-item">
                  <div class="title-label">
                    <span>预警时间</span>
                  </div>
                  <div class="content-text">
                    <span>2023-05-10 00:00:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-container instance-info">
            <div class="instance-item">
              <div class="instance-info-title">(预计)最晚实例(1)</div>
              <div class="dataphin-table-box">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="nodeName" label="节点名称">
                    <template>
                      <div style="display: flex;flex-direction: column;">
                        <OverflowTooltip class="cursor c-color">virtual_root_node_4662968202837884928</OverflowTooltip>
                        <span style="display: flex;">
                          <i class="iconfont icon-Vi mr-5 color"></i>
                          <OverflowTooltip>n_466296820283788492</OverflowTooltip>
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="runStatus" label="运行状态">
                    <template slot-scope="scope">
                      <i :class="['mr-5', statusList[scope.row.runStatus].icon]" :style="{color: statusList[scope.row.runStatus].color}"></i>
                      <span>{{statusList[scope.row.runStatus].name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="endTime" label="结束时间">
                    <template slot-scope="scope">
                      <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.endTime}}</OverflowTooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="belongProject" label="归属项目/板块">
                  </el-table-column>
                  <el-table-column prop="head" label="负责人">
                    <template slot-scope="scope">
                      <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.head}}</OverflowTooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="instance-item">
              <div class="instance-info-title">
                当前关键实例(0)
                <el-tooltip class="item" effect="dark" content="关键路径上，未运行成功的最上层实例" placement="top">
                  <i class="iconfont icon-info cursor" style="margin-left:3px;color: rgba(0,0,0,0.4);position: relative;z-index: 9;"></i>
                </el-tooltip>
              </div>
              <el-empty :image-size="60" description="暂无关键节点"></el-empty>
            </div>
          </div>

          <div class="card-container critical-path">
            <div class="card-container-title">
              <span>
                关键路径
                <el-tooltip class="item" effect="dark" content="影响基线保障任务的多条路径中，运行耗时最长的路径。" placement="top">
                  <i class="iconfont icon-info cursor font-14" style="margin-left:3px;color: rgba(0,0,0,0.4);position: relative;z-index: 9;"></i>
                </el-tooltip>
              </span>
              <el-button @click="viewGanttChart">
                查看关键路径甘特图
              </el-button>
            </div>
            <div class="dataphin-table-box">
              <CriticalPathTableDetail></CriticalPathTableDetail>
            </div>
          </div>

          <div class="card-container historical-trend">
            <div class="card-container-title">
              <span>历史运行趋势</span>
            </div>
            <div ref="historicalTrend"></div>
          </div>

          <div class="card-container alarm-event">
            <div class="card-container-title">
              <span>告警事件</span>
            </div>
            <div class="dataphin-table-box">
              <AlarmEventTableDetail></AlarmEventTableDetail>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import CriticalPathTableDetail from './critical-path-table-detail.vue'
import AlarmEventTableDetail from './alarm-event-table-detail.vue'
import HistoricalTrend from './historical-trend.js'
export default {
  name: 'BaselineExampleDetail',
  components: {
    OverflowTooltip,
    CriticalPathTableDetail,
    AlarmEventTableDetail
  },
  data() {
    return {
      loading: false,
      statusList: {
        1: { name: '未运行', color: '#ccc', icon: 'iconfont icon-weikaiqi' },
        2: { name: '等待调度资源', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        3: { name: '限流中', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        4: { name: '等待调度时间', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        5: { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        6: { name: '失败', color: '#FF7474', icon: 'el-icon-error' },
        7: { name: '成功', color: '#4AC059', icon: 'iconfont icon-yikaiqi' },
      },
      tableData: [
        {
          name: 1,
          runStatus: 7,
          endTime: '2023-05-10 00:00:00',
          head: '张三',
        }
      ]
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    backHand() {
      this.$emit('back')
    },
    initChart() {
      const chart = new HistoricalTrend({
        container: this.$refs.historicalTrend,
        data: [
          {
            date: '2021-05-05',
            value: '00:00',
            category: '承诺'
          },
          {
            date: '2021-05-06',
            value: '00:00',
            category: '承诺'
          },
          {
            date: '2021-05-07',
            value: '00:00',
            category: '承诺'
          },
          {
            date: '2021-05-08',
            value: '00:00',
            category: '承诺'
          },
          {
            date: '2021-05-05',
            value: '10:00',
            category: '平均'
          },
          {
            date: '2021-05-06',
            value: '10:00',
            category: '平均'
          },
          {
            date: '2021-05-07',
            value: '10:00',
            category: '平均'
          },
          {
            date: '2021-05-08',
            value: '10:00',
            category: '平均'
          }
        ]
      })
      console.log(chart)
      chart.init()
    },
    toBaselineHandle() {
      this.$router.push({
        path: '/rd/operation-new/monitoring-alarm/baseline-monitor',
        query: {
          id: 1
        }
      })
    },
    viewGanttChart() {
      this.$emit('viewGanttChart')
    }
  }
}
</script>

<style lang="scss" scoped>
.baseline-example-detail {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #ebeaef;
  padding: 20px;
  color: #333;
  overflow-x: hidden;
  overflow-y: auto;
  .color {
    color: rgba(46, 116, 255, 1);
  }
  .baseline-detail-title {
    display: flex;
    margin-bottom: 10px;
    .baseline-detail-title-icon {
      min-width: 84px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #2e74ff;
      color: #fff;
      > i {
        font-size: 30px;
        line-height: 1.5;
      }
      > span {
        cursor: default;
        font-weight: 300;
        font-size: 12px;
      }
    }
    .baseline-detail-title-data {
      flex: 1;
      padding-right: 20px;
      height: 100%;
      background-color: #fff;
      .title-data-top {
        display: flex;
        justify-content: space-between;
        height: 24px;
        line-height: 24px;
        margin: 14px 0 14px 20px;
        .title-data-top-data {
          gap: 10px;
          align-items: center;
          display: inline-flex;
          .item {
            .title-name {
              display: flex;
              font-size: 16px;
              align-items: center;
              opacity: .9;
              color: rgba(0,0,0,.9);
            }
          }
        }
        .to-link {
          cursor: pointer;
          color: #2e74ff;
          font-size: 12px;
        }
      }
      .title-data-bottom {
        margin-left: 20px;
        margin-bottom: 10px;
        line-height: 20px;
        display: flex;
        &-item {
          display: flex;
          min-width: 60px;
          max-width: 180px;
          margin-right: 30px;
          .title-label {
            margin-right: 8px;
            color: rgba(0,0,0,0.65);
            > span {
              font-size: 12px;
            }
          }
          .content-text {
            flex: 1;
            > span {
              font-size: 12px;
              color: rgba(0,0,0,0.65);
            }
          }
        }
      }
    }
  }
  .card-container {
    padding: 16px 20px;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .card-container-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .dataphin-table-box {
    width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }
  .instance-info {
    display: flex;
    justify-content: space-between;
    .instance-item {
      flex: 1;
      width: calc(50% - 21px);
    }
    &-title {
      margin-bottom: 10px;
      font-size: 16px;
    }
  }
  .critical-path {
    width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }
  .historical-trend {

  }
  .alarm-event {

  }
  .el-divider--vertical {
    height: auto;
    margin: 0 20px;
    background-color: rgba(0,0,0,0.06);
  }
  ::v-deep {
    .el-table th.el-table__cell {
      background: #fafafa;
      padding: 16px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0,0,0,.7);
      .cell {
        padding: 0;
      }
    }
    .el-empty {
      padding: 0;
    }
  }
}
</style>