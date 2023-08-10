<template>
  <div class="error-offline-example">
    <div class="offline-stat mt-10 mb-10">
      <span>离线实例排行</span>
      <span>
        <el-select v-model="value" placeholder="请选择" class="mr-10 suctom-select" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button slot="reference">
          <i class="iconfont icon-shaixuan"></i>
        </el-button>
      </span>
    </div>
    <div class="run-statistics-wrapper">
      <div class="run-statistics-left">
        <div
          :class="['item-wrapper', activeRunStatusTab === item.value ? 'active' : '']"
          v-for="item in runStatusList"
          :key="item.value"
          @click="selectRunStatus(item.value)"
        >
          <div class="item">
            <div>
              <i :class="['iconfont', item.icon]"></i>
              <span>{{item.label}}</span>
            </div>
            <div>
              {{item.desc}}
            </div>
          </div>
        </div>
        <div class="line" :style="{top: activeRunStatusTab === '1' ? '0' : 'calc((100% + 10px) / 2)'}"></div>
      </div>
      <div class="run-statistics-right">
        <div class="right-top-radio">
          <div class="">
            <span>排行列表：</span>
            <span>
              <el-radio-group v-model="rankingType" v-if="activeRunStatusTab === '1'">
                <el-radio :label="1">按失败次数</el-radio>
                <el-radio :label="2">按失败次数占比</el-radio>
              </el-radio-group>
              <el-radio-group v-model="rankingType1" v-else>
                <el-radio :label="1">按平均运行时长</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div>
            <el-button
              type="default"
              size="mini"
              class="ml-10">
                <i class="iconfont icon-biaodanliebiao"></i>
                查看注释
              </el-button>
              <el-button type="default" size="mini"> <i class="el-icon-download"></i> 下载csv</el-button>
          </div>
        </div>
        <div class="ranking-table">
          <RankingTable :tableDataList="tableDataList1" v-if="tableDataList1.length" :columns="currentColumns"></RankingTable>
          <div class="tips" v-if="tableDataList1.length">
            <i class="iconfont icon-tip"></i>
            <span>仅所有taskrun状态为运行成功的节点纳入统计范围</span>
          </div>
          <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:50px"></el-empty>
        </div>
      </div>
    </div>

    <div class="offline-stat mt-20 mb-20">
      <span>报警排行</span>
      <span>
        <el-button slot="reference">
          <i class="iconfont icon-biaodanliebiao"></i>
          查看注释
        </el-button>
        <el-button slot="reference">
          告警中心
        </el-button>
      </span>
    </div>
    <div class="warn-body">
      <div class="warn-title">
        <span>运行超时报警</span>
        <span>
          <el-date-picker
            v-model="time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button slot="reference" class="ml-10">
            <i class="iconfont icon-xiazai"></i>
            下载CSV
          </el-button>
        </span>
      </div>
      <div>
        <RankingTable :columns="warnColimns" :tableDataList="warnTableDataList" v-if="warnTableDataList.length">
          <template slot="action">
            <el-tooltip class="item" effect="dark" content="查看生产任务" placement="top">
              <el-button type="text" size="mini">
                <i class="iconfont icon-shujutancha font-16"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看监控配置" placement="top">
              <el-button type="text" size="mini">
                <i class="iconfont icon-shezhi font-16"></i>
              </el-button>
            </el-tooltip>
          </template>
        </RankingTable>
        <div class="tips" v-if="warnTableDataList.length">
          <i class="iconfont icon-tip"></i>
          <span>按照所选报警时间范围内运行超时报警次数降序排列。您可点击查看该任务详情活监控配置，并根据报警详情决定是否修改相应配置</span>
        </div>
        <el-empty description="暂无数据" v-else :image="require('@/assets/images/nodata.png')" style="margin-top:50px"></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import RankingTable from '../tables.vue'
import {getErrorStatistics} from '@/api/rd/operation-new/error-statistics'
import {mapGetters} from 'vuex'
export default {
  name: 'ErrorOfflineExample',
  components: {
    RankingTable
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      value: '',
      options: [],
      runStatusList: [
        {
          icon: 'icon-shishijiankong',
          label: '运行状态统计',
          desc: '对于运行失败次数或失败占比过高的节点，建议您检查对应任务及其上下游依赖关系配置，避免影响下游数据产出',
          value: '1'
        },
        {
          icon: 'icon-yunhangshichang',
          label: '运行时长统计',
          desc: '对于运行时长过长的节点，建议您检查任务详情及对应资源组配置，以决定是否需要对改任务进行优化',
          value: '2'
        }
      ],
      activeRunStatusTab: '1',
      rankingType: 1,
      rankingType1: 1,
      warnColimns: [
         {
          label: '排行',
          prop: 'index',
          width: 60,
          type: 'index',
          slot: 'index'
        },
        {
          label: '节点名称',
          prop: 'nodeName',
          slot: 'nodeName'
        },
        {
          label: '超时报警数',
          prop: 'runFailCount',
          width: 130,
          align: 'right'
        },
        {
          label: '运行总次数',
          prop: 'resourceGroup',
          width: 130,
        },
        {
          label: '运行超时次数占比',
          prop: 'resourceGroup1',
          width: 130,
        },
        {
          label: '最近3天平均运行时长',
          prop: 'currentOwner1',
          width: 160,
        },
        {
          label: '当前负责人',
          prop: 'currentOwner',
          width: 130,
        },
        {
          label: '操作',
          slot: 'action',
          width: 100,
        }
      ],
      runStatusStatistics: [
        {
          label: '排行',
          prop: 'index',
          width: 60,
          type: 'index',
          slot: 'index'
        },
        {
          label: '节点名称',
          prop: 'nodeName',
          slot: 'nodeName'
        },
        {
          label: '失败次数',
          prop: 'resourceGroup',
          width: 130,
          align: 'right'
        },
        {
          label: '节点编码',
          prop: 'process_definition_code',
          width: 130,
        },
        {
          label: '负责人',
          prop: 'user_name',
          width: 130,
        },
      ],
      runTimeStatistics: [
        {
          label: '排行',
          prop: 'index',
          width: 60,
          type: 'index',
          slot: 'index'
        },
        {
          label: '节点名称',
          prop: 'nodeName',
          slot: 'nodeName'
        },
        {
          label: '平均运行时长',
          prop: 'resourceGroup',
          width: 130,
          align: 'right'
        },
        {
          label: '运行时长秒数',
          prop: 'runTime',
          width: 130,
        },
        {
          label: '负责人',
          prop: 'user_name',
          width: 130,
        },
      ],
      currentColumns: [],
      tableDataList1: [],
      warnTableDataList: [
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 1, index: 1, value: 90, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 2, index: 2, value: 70, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 3, index: 3, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 4, index: 4, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 5, index: 5, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 6, index: 6, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 7, index: 7, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 8, index: 8, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 9, index: 9, value: 50, customValue: '2' },
        { nodeName: '-', priority: '高', currentOwner: '-', resourceGroup: '-', id: 10, index: 10, value: 50, customValue: '2' },
      ],
      time: '',
      statisticsData: {},
    }
  },
  async created() {
    await this.getOfflineExample()
    this.total = 0
    this.initData()
  },
  methods: {
    selectRunStatus(value) {
      this.activeRunStatusTab = value
      this.total = 0
      this.initData()
    },
    initData() {
      if (this.activeRunStatusTab === '1') {
        this.currentColumns = this.runStatusStatistics
        const total = this.statisticsData.statusList.reduce((total, item) => {
          return total + Number(item.errorCount)
        }, 0)
        this.tableDataList1 = this.statisticsData.statusList.map((d, index) => {
          return {
            index: index + 1,
            nodeName: d.name,
            value: Number(d.errorCount) / total * 100,
            customValue: d.errorCount,
            process_definition_code: d.process_definition_code,
            user_name: d.user_name,
          }
        })
      } else {
        this.currentColumns = this.runTimeStatistics
        const total = this.statisticsData.runTimeList.reduce((total, item) => {
          return total + Number(item.runTime)
        }, 0)
        this.tableDataList1 = this.statisticsData.runTimeList.map((d, index) => {
          return {
            id: index + 1,
            index: index + 1,
            nodeName: d.name,
            value: Number(d.runTime) / total * 100,
            customValue: d.duration,
            process_definition_code: d.process_definition_code,
            runTime: d.runTime,
            user_name: d.user_name,
          }
        })
      }
    },
    // 获取离线实例排行
    async getOfflineExample() {
      const params = {
        projectId: this.project.project_id,
        bizDate: this.time
      }
      const res = await this.$simpleAsyncTo(getErrorStatistics(params), '获取离线实例排行')
      if (res) {
        this.statisticsData = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss.scss';
</style>