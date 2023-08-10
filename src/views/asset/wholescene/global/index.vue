<template>
  <section class="global dark-loading" v-loading="threeLoading || dataLoading">
    <div class="graph" ref="graph" v-three.tween.orbit="threeOpt"></div>
    <!-- <div ref="global"></div> -->

    <div :class="['chart-tip global-tip', collapse && 'collapsed']">
      <div class="chart-tip-wrapper">
        <p class="p">
          <span class="label">总数据量：</span>
          <span class="value">{{ globalData.storage_sum }}{{ globalData.storage_unit }}</span>
        </p>
        <div v-if="globalData.list" class="tip-list">
          <p class="progress-item" v-for="item in globalData.list" :key="item.project_name">
            <span class="label">{{ item.project_name }}</span>
            <el-progress :percentage="Number(item.percentage * 100)" :show-text="false" color="#288AC2"></el-progress>
            <span class="value">
              {{ item.storage_use }}{{ item.storage_unit }}&nbsp;&nbsp;
              <span class="per">{{ (item.percentage * 100).toFixed(2) }}%</span>
            </span>
          </p>
        </div>
        <p class="p">
          <span class="label">总任务数：</span>
          <span class="value">{{ globalData.task_sum }}</span>
        </p>
        <p class="p">
          <span class="label">总数据表数：</span>
          <span class="value">{{ globalData.cube_sum }}</span>
        </p>
        <p class="p">
          <span class="label">总项目数：</span>
          <span class="value">{{ globalData.project_sum }}</span>
        </p>
        <p class="p">
          <span class="label">计算资源总量：</span>
          <span class="value">{{ globalData.memory_total }}</span>
        </p>
        <p class="p">
          <span class="label">已消耗资源：</span>
          <span class="value">{{ globalData.memory_used }}</span>
        </p>
      </div>

      <div :class="['collapse collapse-arrow', collapse && 'collapsed']" @click="collapseHandle">
        <i class="icon el-icon-caret-right"></i>
      </div>
    </div>

    <!-- <SideCollapse class="chart-tip global-tip" :collapse.sync="collapse" placement="left" width="300px" height="auto">
      <div class="chart-tip-wrapper">
        <p>总数据量：<span>{{data.dataCount}}</span></p>
        <div v-if="data.list">
          <p class="progress-item" v-for="item in data.list" :key="item.name">
            <span class="label">{{item.name}}：</span>
            <el-progress
              :percentage="Number(item.percentage)"
              :show-text="false"
              color="#288AC2"
            ></el-progress>
            <span class="value">
              {{item.value}}{{item.storage_unit}}&nbsp;&nbsp;
              <span class="per">{{item.percentage}}%</span>
            </span>
          </p>
        </div>
        <p>总任务数：<span>{{data.taskCount}}</span></p>
        <p>总数据表数：<span>{{data.tableCount}}</span></p>
        <p>总项目数：<span>{{data.projectCount}}</span></p>
      </div>
    </SideCollapse>-->
    <div class="chart-tip graphic-tip" ref="graphicTip" v-if="activeGraphic">
      <div class="chart-tip-wrapper">
        <p>
          <span class="label">项目名称：</span>
          <span class="value">{{ activeGraphic.project_name }}</span>
        </p>
        <p>
          <span class="label">计算消耗：</span>
          <span class="value">{{ activeGraphic.used_memory
            }}</span>
        </p>
        <p>
          <span class="label">计算资源总量：</span>
          <span class="value">{{ activeGraphic.capacity_memory
            }}</span>
        </p>
        <p>
          <span class="label">队列名称：</span>
          <span class="value">{{ activeGraphic.queue_name
            }}</span>
        </p>
        <p>
          <span class="label">存储量：</span>
          <span class="value">{{ activeGraphic.storage_use
            }}{{ activeGraphic.storage_unit }}</span>
        </p>
        <p>
          <span class="label">归属业务板块：</span>
          <span class="value">{{ activeGraphic.busin_name }}</span>
        </p>
        <p>
          <span class="label">总表数：</span>
          <span class="value">{{ activeGraphic.cube_num }}</span>
        </p>
        <p>
          <span class="label">Tidb表数：</span>
          <span class="value">{{ activeGraphic.tidb_num }}</span>
        </p>
        <p>
          <span class="label">Hive表数：</span>
          <span class="value">{{ activeGraphic.hive_num }}</span>
        </p>
        <p>
          <span class="label">Es表数：</span>
          <span class="value">{{ activeGraphic.es_num }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getPanoramicOverviewInfo,
  getBusinessPlateViewInfo
} from '@/api/asset/wholescene'
import GlobalChart from './global-chart.js'
import mixin from '../global-mixin'
// import SideCollapse from '@/components/side-collapse'

export default {
  name: 'Global',
  mixins: [mixin],
  components: {
    // SideCollapse
  },
  data () {
    return {
      threeOpt: {
        background: 0x020109,
        beforeTrender: this.beforeTrender,
        trender: this.trender
      },
      globalData: {},
      graphicData: null,
      // fontUrl: '/t-sources/fonts/MicrosoftYaHei_Regular.json',
      trackColor: 0x222222, // 轨道颜色
      trackInnerSize: 40,
      // 装饰圆数量
      decorateCount: 250,
      // 装饰圆的间距
      decorateGap: 80,
      decorateMinSize: 2,
      decorateMaxSize: 8,
      animationDuration: 1500,
      speed: 0.01,
      isRotate: true,
      activeGraphic: null,
      threeLoading: false,
      dataLoading: false,
      // collapsed: false
      collapse: false
    }
  },
  mounted () {
    this.$refs.global && (this.globalChart = new GlobalChart(this.$refs.global))
    this.readyHandle()
    this.getGlobalData()
    this.getGraphicData()
  },
  beforeDestroy () {
    this.global && this.global.tdestroy()
  },
  methods: {
    collapseHandle () {
      this.collapse = !this.collapse
    },
    readyHandle () {
      this.threeLoading = true
      this.eventEmitter.on('ready', _ => {
        !this.dataLoading && this.drawGraphicsAsync()
        this.threeLoading = false
      })
    },
    async getGlobalData () {
      this.dataLoading = true
      const res = await this.$simpleAsyncTo(
        getPanoramicOverviewInfo(),
        '获取数据失败'
      )
      if (res) {
        this.globalData = res.data
      }
      this.dataLoading = false
    },
    async getGraphicData () {
      this.dataLoading = true
      const res = await this.$simpleAsyncTo(
        getBusinessPlateViewInfo(),
        '获取数据失败'
      )
      if (res) {
        this.graphicData = res.data.map(item => {
          item.name = item.busin_name
          item.value = item.storage_use
          return item
        })
        !this.threeLoading && this.drawGraphicsAsync()
      }
      this.dataLoading = false
    }
    // async _getGlobalData() {
    //   this.dataLoading = true
    //   const res = await this.$simpleAsyncTo(getGlobalData(), '获取数据失败')
    //   if (res) {
    //     this.data = res.data
    //     // !this.threeLoading && this.drawGraphicsPromise()
    //     !this.threeLoading && this.drawGraphicsAsync()
    //   }
    //   this.dataLoading = false
    // }
  }
}
</script>

<style lang="scss">
.global {
  @import '@/assets/css/chart-tip.scss';
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .graph {
    overflow: hidden;
  }
  .global-tip.global-tip {
    $width: 340px;
    // position: relative;
    width: $width;
    bottom: 0;
    right: 0;
    transition: $transition;
    position: absolute;

    .chart-tip-wrapper {
      .p {
        font-size: 13px;
        color: $grey9;
        .value {
          color: lighten($--color-primary, 10%);
        }
        .label {
          display: inline-block;
          width: 95px;
        }
      }
    }

    .tip-list {
      height: 140px;
      overflow: auto;
    }

    &.collapsed {
      right: -$width;
    }
    .collapse.collapse-arrow {
      position: absolute;
      top: 50%;
      left: -10px;
      transform: translateY(-50%);
      width: 10px;
      height: 50px;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      background-color: $sideMenu;
      color: $grey10;
      font-size: 12px;
      text-align: center;
      z-index: 2;
      cursor: pointer;

      &.collapsed {
        i {
          transform: rotate(180deg);
          margin-left: -50%;
          margin-top: -75%;
        }
      }
      i {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
</style>
