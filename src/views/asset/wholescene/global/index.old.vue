<template>
  <section class="global dark-loading" v-loading="threeLoading || dataLoading">
    <div class="graph" ref="graph" v-three.tween.gui.stats.orbit="threeOpt"></div>
    <!-- <div ref="global"></div> -->

    <div :class="['chart-tip global-tip', collapse && 'collapsed']">
      <div class="chart-tip-wrapper">
        <p>
          总数据量：
          <span>{{data.dataCount}}</span>
        </p>
        <div v-if="data.list">
          <p class="progress-item" v-for="item in data.list" :key="item.name">
            <span class="label">{{item.name}}：</span>
            <el-progress :percentage="Number(item.percent)" :show-text="false" color="#288AC2"></el-progress>
            <span class="value">
              {{item.value}}{{item.unit}}&nbsp;&nbsp;
              <span class="per">{{item.percent}}%</span>
            </span>
          </p>
        </div>
        <p>
          总任务数：
          <span>{{data.taskCount}}</span>
        </p>
        <p>
          总数据表数：
          <span>{{data.tableCount}}</span>
        </p>
        <p>
          总项目数：
          <span>{{data.projectCount}}</span>
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
              :percentage="Number(item.percent)"
              :show-text="false"
              color="#288AC2"
            ></el-progress>
            <span class="value">
              {{item.value}}{{item.unit}}&nbsp;&nbsp;
              <span class="per">{{item.percent}}%</span>
            </span>
          </p>
        </div>
        <p>总任务数：<span>{{data.taskCount}}</span></p>
        <p>总数据表数：<span>{{data.tableCount}}</span></p>
        <p>总项目数：<span>{{data.projectCount}}</span></p>
      </div>
    </SideCollapse>-->
    <div class="chart-tip graphic-tip" ref="graphicTip" v-if="activeGraphic && activeGraphic.info">
      <div class="chart-tip-wrapper">
        <p>
          <span class="label">业务板块：</span>
          <span class="value">{{activeGraphic.info.board}}</span>
        </p>
        <p>
          <span class="label">计算消耗：</span>
          <span class="value">{{activeGraphic.info.consume}}{{activeGraphic.unit}}</span>
        </p>
        <p>
          <span class="label">存储量：</span>
          <span class="value">{{activeGraphic.info.storeCount}}</span>
        </p>
        <p>
          <span class="label">项目数：</span>
          <span class="value">{{activeGraphic.info.projectCount}}</span>
        </p>
        <p>
          <span class="label">总表数：</span>
          <span class="value">{{activeGraphic.info.tableCount}}</span>
        </p>
        <p>
          <span class="label">维度模型数：</span>
          <span class="value">{{activeGraphic.info.dmCount}}</span>
        </p>
        <p>
          <span class="label">事实模型数：</span>
          <span class="value">{{activeGraphic.info.fmCount}}</span>
        </p>
        <p>
          <span class="label">主题模型数：</span>
          <span class="value">{{activeGraphic.info.themeCount}}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { getGlobalData } from '@/api/asset/wholescene'
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
      data: {},
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
    this._getGlobalData()
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
    async _getGlobalData () {
      this.dataLoading = true
      const res = await this.$simpleAsyncTo(getGlobalData(), '获取数据失败')
      if (res) {
        this.data = res.data
        // !this.threeLoading && this.drawGraphicsPromise()
        !this.threeLoading && this.drawGraphicsAsync()
      }
      this.dataLoading = false
    }
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
  .global-tip {
    $width: 300px;
    // position: relative;
    width: $width;
    bottom: 0;
    right: 0;
    transition: $transition;
    position: absolute;

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
