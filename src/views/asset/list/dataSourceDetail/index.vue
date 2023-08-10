<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-10">
        <el-breadcrumb-item :to="{ path: prePath }">搜索列表</el-breadcrumb-item>
        <el-breadcrumb-item>数据源详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="['iconfont', 'iconfont icon-shujuyuanquanxianguanli']"></i>
            <div class="mt-5">{{'24' | turnTableType}}</div>
          </div>
          <div class="header-right flex-1">
            <div class="top">
              <div class='title mb-10'>
                <span>{{asset_basic_data.data_source_name}}</span>
              </div>
              <div class="options mb-10">
                <span class="mr-20">
                  <i class="el-icon-key pr-5"></i>
                  <span @click="applyclickHandle">申请权限</span>
                </span>
              </div>
              <div class="project-list">
                <span class="title">存储类型</span>
                <span class="value">MAX_COMPUTE</span>
                <span class="title">用途</span>
                <span class="value">实时和离线</span>
                <span class="title">环境</span>
                <span class="value">生产环境</span>
              </div>
            </div>
          </div>
        </header>
        <div class="flex-layout" style="height: calc(100% - 100px);">
          <div class="main-left">
            
            <AssetTabsBox :tabs="tabs" @changeTab="changeTab">
              
              <template slot="read">
                <TableHeader :isShowCount="false" @change="searchTable" class="mt-5 mb-5" :title="activeTabName"></TableHeader>
                <ReadInfo></ReadInfo>
              </template>
              <template slot="write">
                <TableHeader :isShowCount="false" @change="searchTable" class="mt-5 mb-5" :title="activeTabName"></TableHeader>
                <WriteInfo></WriteInfo>
              </template>
             
            </AssetTabsBox>
          </div>
          <div class="side-right ml-10">
            <AssetSetailTitle title="基本信息"></AssetSetailTitle>
            <div class="conttent-box">
              <div class="item-detail">
                <label>负责人</label>
                <div class="value">{{tableInfo.oper_user}}</div>
              </div>
              <div class="item-detail">
                <label>创建时间</label>
                <div class="value">{{tableInfo.oper_time}}</div>
              </div>
              <div class="item-detail">
                <label>描述</label>
                <div class="value">{{tableInfo.data_source_desc }}</div>
              </div>
            </div>
            <AssetSetailTitle title="使用信息"></AssetSetailTitle>
            <div class="conttent-box">
              <div class="item-detail">
                <label>读取任务</label>
                <div class="value">0</div>
              </div>
              <div class="item-detail">
                <label>写入任务</label>
                <div class="value">1</div>
              </div>
            </div>
            <AssetSetailTitle title="变更信息"></AssetSetailTitle>
            <div class="conttent-box">
              <div class="item-detail">
                <label>更新时间</label>
                <div class="value">{{tableInfo.oper_time}}</div>
              </div>
              <div class="item-detail">
                <label>最新时间</label>
                <div class="value">{{tableInfo.oper_time}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import 'animate.css'
import ReadInfo from './readInfo'
import WriteInfo from './writeInfo'
import AssetInfo from './assetInfo.vue'
import { logicTypeMapIcon } from '@/config/rd-config.js'
import { getDataSourceDetail } from '@/api/asset/list'
import { mapGetters } from 'vuex'
import AssetSetailTitle from '../component/title.vue'
import TableHeader from '../component/table-header.vue'
import AssetTabsBox from '../component/tabs.vue'
export default {
  name: 'indicator-detail',
  components: {
    AssetInfo,
    ReadInfo,
    WriteInfo,
    AssetSetailTitle,
    TableHeader,
    AssetTabsBox
  },
  data () {
    return {
      connect_info: {},
      prePath: '',
      data: {},
      activeName: 'read',
      tableInfo: {},
      logicTypeMapIcon,
      loading: 0,
      tabs: [
        {
          label: '读取任务',
          value: 'read'
        },
        {
          label: '写入任务',
          value: 'write'
        }
      ],
      activeTabName: '任务列表',
      activeTab: 'read'
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
        26: '指标'
      }
      return a[v]
    }
  },
  computed: {
    ...mapGetters(['cube_id', 'asset_basic_data']),
    connectInfoData () {
      if (this.connect_info) {
        let arr = Object.entries(this.connect_info).map(([key, value]) => {
          return {
            name: key,
            value
          }
        })
        return arr
      } else {
        return []
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prePath = from.fullPath
    })
  },
  created () {
    this.getDetailInfo()
  },
  methods: {
    //
    async getDetailInfo () {
      const res = await this.$simpleAsyncTo(getDataSourceDetail({ id: this.cube_id }), '获取基本信息失败')
      if (res) {
        this.connect_info = res.data.connect_info
        this.tableInfo = res.data
      }
    },

    // 是否收藏
    async isCollectClickHandle () {
    },

    // 申请权限
    applyclickHandle () {

    },
    searchTable (data) { },
    changeTab (data) {
      this.activeTab = data
      if (data === 'read') {
        this.activeTabName = '任务列表'
      } else {
        this.activeTabName = '数据表列表'
      }
    }
  }
}
</script>
<style lang="scss">
.detail {
  .animated {
    animation-duration: .3s;
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
          .project-list {
            .title {
              font-size: 14px;
            }
            .value {
              font-size: 12px;
              color: $grey4;
              margin-left: 10px;
              margin-right: 30px;
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
    .project-survey {
      background: $grey10;
      padding: 20px;
      margin-bottom: 10px;
      .cont-box {
        height: calc(100% - 32px);
        .item {
          .label {
            width: 140px;
            display: inline-block;
            vertical-align: middle;
          }
          .value {
            width: calc(100% - 140px);
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
        }
      }
    }
    .el-dialog__body {
      height: 350px;
    }
  }
  .detail-box {
    .content-box-detail {
      // display: flex;
      position: relative;
      height: calc(100% - 25px);
      .header {
        // flex: 1;
      }
      .main-left {
        flex: 1;
        background: #fff;
        padding: 0 20px;
        width: 0;
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
        .conttent-box {
          margin-bottom: 35px;
          .item-detail {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin: 8px 0;
            label {
              width: 120px;
              color: #76797d;
            }
            .value {
              flex: 1;
              color: #121314;
              width: 0;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}

</style>
