<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-10">
        <el-breadcrumb-item :to="{ path: prePath }">搜索列表</el-breadcrumb-item>
        <el-breadcrumb-item>数据表详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="['iconfont', logicTypeMapIcon[tableInfo.object_type]]"></i>
            <div class="mt-5">{{tableInfo.object_type | turnTableType}}</div>
          </div>
          <div class="header-right flex-1">
            <div class="top">
              <div class='title mb-10'>
                <span>{{tableInfo.cube_code}}</span>
                <!-- <OverflowTooltip>{{tableInfo.cube_name}}</OverflowTooltip> -->
                <div class="desc">描述：{{tableInfo.cube_name}}</div>
              </div>
              <div class="options">
                <span class="mr-20">
                  <i class="el-icon-lock pr-5"></i>
                  <span @click="applyclickHandle">申请权限</span>
                </span>
                <span class="mr-20" @click="isCollectClickHandle">
                  <i :class="['icon iconfont pr-5 fz', tableInfo.is_collect?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing']"></i>
                  <span>{{tableInfo.is_collect ? '取消收藏' :'收藏'}}</span>
                </span>
                <span class="mr-20" @click="downloadField">
                  <i class="icon iconfont icon-bianji1 pr-5"></i>
                  <span>导出字段</span>
                </span>
                <span class="mr-20" @click="seeSelectVisible=true">
                  <i class="icon iconfont icon-bianji1 pr-5"></i>
                  <span>查看select语句</span>
                </span>
              </div>
            </div>
            <div v-if="false" class="bottom flex-layout">
              <div class="attr-item pt-10 pr-20" v-for="item in primarysTables" :key="item.element_code">
                <span class="mr-10">主键：</span>
                <OverflowTooltip style="width:50px">{{item.element_name}}</OverflowTooltip>
              </div>
            </div>
          </div>
        </header>
        <div class="flex-layout" style="height: calc(100% - 100px);">
          <div class="main-left" v-resize="resizeDom">
            <div class="tabs-wrapper">
              <div class="tabs-head">
                <ul>
                  <li
                    :class="[item.value === topActiveTab ? `active index${topActiveTab}` : '']"
                    v-for="(item, index) in topTabs"
                    :key="item.value"
                    @click="topTabClick(item)"
                  >{{item.label}}
                    <span style="position: absolute;right: 0;" v-if="index !== 3"><el-divider direction="vertical"></el-divider></span>
                  </li>
                </ul>
              </div>
              <div class="tabs-body">
                <template v-if="topActiveTab === '0'">
                  <AssetTabsBox :tabs="tabs" @changeTab="changeTab">
                    <template slot="table">
                      <TabInfo
                        :widthHeightData="widthHeightData"
                        :tableInfo="tableInfo"
                        :tableStructure="tableStructure"
                        :primarysTables="primarysTables"
                        :tableType="tableInfo.object_type"
                      ></TabInfo>
                    </template>
                    <template slot="zone">
                      <Zone></Zone>
                    </template>
                    <template slot="output">
                      <OutputInfo :widthHeightData="widthHeightData" :tableInfo="tableInfo"></OutputInfo>
                    </template>
                    <template slot="dataPreview">
                      <DataPreview :widthHeightData="widthHeightData"></DataPreview>
                    </template>
                    
                  </AssetTabsBox>
                </template>
                <template v-if="topActiveTab === '1'">
                  <Relation :data="data" class="relation-graph" style="padding-top:20px"></Relation>
                </template>
                <template v-if="topActiveTab === '2'">
                  <AssetTabsBox :tabs="tabsAffect" @changeTab="changeTabAffect">
                    <div slot="tab-right">
                      <el-checkbox v-model="checked" :true-label="1" :false-label="2">请展示直接下游表</el-checkbox>
                    </div>
                    <template slot="table">
                      <AffectTable :widthHeightData="widthHeightData" :tableInfo="tableInfo" :checked="checked"></AffectTable>
                    </template>
                    <template slot="sync">
                      <AffectSyncTable :widthHeightData="widthHeightData" :tableInfo="tableInfo" :checked="checked"></AffectSyncTable>
                    </template>
                    
                  </AssetTabsBox>
                </template>
                <template v-if="topActiveTab === '3'">
                  <UseExplain :widthHeightData="widthHeightData" :tableInfo="tableInfo"></UseExplain>
                </template>
              </div>
            </div>
          </div>
          <div class="side-right ml-10">
            <div class="detail-title">资产信息</div>
            <AssetInfo :tableInfo="tableInfo"></AssetInfo>
          </div>
        </div>
      </div>

      <!-- 查看select语句 -->
      <el-dialog title="查看select语句" :visible.sync="seeSelectVisible" width="60%" :close-on-click-modal="false">
        <MonacoEditor readonly :code.sync="sql_content" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="seeSelectVisible = false">取 消</el-button>
          <el-button type="primary" @click="seeSelectVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import 'animate.css'
import TabInfo from './table-info/index'
import Zone from './zone'
import DataPreview from './dataPreview'
import OutputInfo from './outputInfo'
import AssetInfo from './assetInfo.vue'
import { logicTypeMapIcon } from '@/config/rd-config.js'
import Relation from '@c/graph/relation'
import { getDetails, setCollect } from '@/api/asset/map'
import { mapGetters } from 'vuex'
import TableHeader from '../component/table-header.vue'
import AssetSetailTitle from '../component/title.vue'
import AssetTabsBox from '../component/tabs.vue'
import AffectTable from './affect-table.vue'
import AffectSyncTable from './affect-sync-table.vue'
import UseExplain from './use-explain.vue'
export default {
  name: 'dataTable-detail',
  components: {
    AssetInfo,
    TabInfo,
    Zone,
    DataPreview,
    OutputInfo,
    Relation,
    TableHeader,
    AssetSetailTitle,
    AssetTabsBox,
    AffectTable,
    AffectSyncTable,
    UseExplain
  },
  data () {
    return {
      prePath: '',
      data: {},
      activeName: 'table',
      isCollect: true,
      seeSelectVisible: false,
      sql_content: '',
      tableInfo: {},
      tableStructure: [],
      primarysTables: [],
      logicTypeMapIcon,
      loading: 0,
      tabs: [
        {
          label: '表结构',
          value: 'table'
        },
        {
          label: '分区概览',
          value: 'zone'
        },
        {
          label: '产出信息',
          value: 'output'
        },
        {
          label: '数据预览',
          value: 'dataPreview'
        },
        // {
        //   label: '血缘关系',
        //   value: 'bloodRelation'
        // }
      ],
      tabsAffect: [
        {
          label: '数据表影响',
          value: 'table'
        },
        {
          label: '集成同步影响',
          value: 'sync'
        }
      ],
      activeTab: 'table',
      affectActiveTab: 'table',
      widthHeightData: {},
      topTabs: [
        {
          label: '信息',
          value: '0'
        },
         {
          label: '血缘',
          value: '1'
        },
         {
          label: '影响',
          value: '2'
        },
        {
          label: '使用说明',
          value: '3'
        }
      ],
      topActiveTab: '0',
      checked: 1
    }
  },
  filters: {
    turnTableType (v) {
      let a = {
        100: '物理表',
        11: '物理表',
        50: '物理表',
        10: '维度逻辑表',
        16: '维度逻辑表',
        17: '事实逻辑表',
        18: '汇总逻辑表',
        19: '元表',
        20: '镜像表',
        21: '字段',
        22: '函数',
        23: '项目',
        24: '数据源',
        25: '数据服务',
        26: '指标',
        42: '标签表'
      }
      return a[v]
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created () {
    this.data.id = this.cube_id
    this.data.source_type = this.$route.query.source_type
    this.getBasicInfo()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prePath = from.fullPath
    })
  },
  methods: {
    resizeDom (data) {
      this.widthHeightData = data
    },
    topTabClick(item) {
      this.topActiveTab = item.value
    },
    // 获取基本信息
    async getBasicInfo () {
      this.loading++
      const params = { cube_id: this.cube_id, source_type: this.$route.query.source_type, project_code: this.$route.query.project_code }
      const res = await this.$simpleAsyncTo(getDetails(params), '获取基本信息失败')
      if (res) {
        this.tableInfo = {
          ...res.tableInfo,
          phyInfo: res.phyInfo,
          useInfo: res.useInfo,
          changeInfo: res.changeInfo
        }
      
        this.tableStructure = res.columns
        this.primarysTables = res.primarys
        this.sql_content = res.searchSql
      }
      this.loading--
    },

    // 是否收藏
    async isCollectClickHandle () {
      let isCollect = this.tableInfo.is_collect === 1 ? 0 : 1
      const params = {
        id: this.cube_id, isCollect,
        source_type: this.$route.query.source_type,
        project_code: this.$route.query.project_code
      }
      const res = await this.$simpleAsyncTo(setCollect(params), '设置收藏失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        this.getBasicInfo()
      }
    },

    // 申请权限
    applyclickHandle () {

    },

    // 导出字段
    downloadField () {
      const a = document.createElement('a')
      a.href = `/asset/catalogueDataTable/exportColums?cube_id=${this.cube_id}&source_type=${this.$route.query.source_type}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    changeTab (data) {
      this.activeTab = data
    },
    changeTabAffect(data) {
      this.affectActiveTab = data
    }
  }
}
</script>
<style lang="scss">
.detail {
  .animated {
    animation-duration: 0.3s;
  }
  width: 100%;
  height: 100%;
  background: $grey8;
  justify-content: center;
  .detail-box {
    padding: 20px 10px;
    height: 100%;
    overflow-y: auto;
    .header {
      height: 90px;
      background: $grey10;
      .header-left {
        display: flex;
        flex-basis: 80px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #a186ff;
        font-size: 12px;
        color: $grey10;
        i {
          font-size: 22px;
        }
      }
      .header-right {
        padding: 10px 20px;
        .top {
          .title {
            font-size: 16px;
            .desc {
              font-size: 12px;
              color: $grey4;
              margin-top: 5px;
            }
          }
          .options {
            font-size: 12px;
            color: $grey4;
            .bgc {
              color: $warning;
            }
            > span {
              cursor: pointer;
            }
          }
        }
        .bottom {
          .attr-item {
            font-size: 12px;
            color: $grey3;
          }
        }
      }
    }
    .left-table {
      background: $grey10;
      height: 100%;
      padding: 20px;
      .el-tabs {
        background: $grey10;
        .el-tabs__nav-scroll {
          padding: 0 0 0 20px;
        }
        .b-r {
          .el-table__row {
            td:first-child {
              border-right: 1px solid $grey7;
            }
          }
          .has-gutter {
            > tr {
              th:first-child {
                > div {
                  display: none;
                }
              }
            }
          }
        }
        .relation-graph {
          height: 500px;
        }
      }
      .fz {
        font-size: 16px;
      }
    }
    .el-dialog__body {
      height: 350px;
    }
  }
  .detail-box {
    .content-box-detail {
      position: relative;
      height: calc(100% - 25px);
      .main-left {
        flex: 1;
        width: 0;
        .tabs-wrapper {
          height: 100%;
          width: 100%;
          $tabHeight: 40px;
          .tabs-head {
            >ul {
              height: $tabHeight;
              display: flex;
              align-items: center;
              > li {
                height: 100%;
                line-height: $tabHeight;
                flex: 1;
                text-align: center;
                font-size: 14px;
                color: rgba($color: #000000, $alpha: 0.7);
                cursor: pointer;
                position: relative;
                &.active {
                  background: #fff;
                  &::after {
                    content: '';
                    position: absolute;
                    width: 0px;
                    height: 0px;
                    background: #fff;
                    border: ($tabHeight / 2) solid #fff;
                    right: -($tabHeight / 2);
                    border-top-color: #f5f5f5;
                    border-right-color: #f5f5f5;
                  }
                  &::before {
                    content: '';
                    position: absolute;
                    width: 0px;
                    height: 0px;
                    background: #fff;
                    border: ($tabHeight / 2) solid #fff;
                    left: -($tabHeight / 2);
                    border-left-color: #f5f5f5;
                    border-bottom-color: #f5f5f5;
                  }
                  &.index0 {
                    &::before {
                      display: none;
                    }
                  }
                  &.index1 {
                    &::before {
                      border-bottom-color: #fff;
                      border-top-color: #f5f5f5;
                    }
                  }
                  &.index2 {
                    &::before {
                      border-bottom-color: #fff;
                      border-top-color: #f5f5f5;
                    }
                  }
                  &.index3 {
                    &::after {
                      display: none;
                    }
                    &::before {
                      border-bottom-color: #fff;
                      border-top-color: #f5f5f5;
                    }
                  }
                }
              }
            }
          }
          .tabs-body {
            height: calc(100% - #{$tabHeight});
            background: #fff;
            padding: 0 20px;
            overflow: overlay;
          }
        }
      }
      .side-right {
        width: 375px;
        background: #fff;
        padding: 15px 20px 20px 20px;
        height: 100%;
        overflow: auto;
        .detail-title {
          font-size: 15px;
          color: #586069;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
