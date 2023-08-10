<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-10">
        <el-breadcrumb-item :to="{path: prePath}">搜索列表</el-breadcrumb-item>
        <el-breadcrumb-item>项目详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="['iconfont', 'iconfont icon-xiangmuquanxianguanli']"></i>
            <div class="mt-5">{{ '23' | turnTableType }}</div>
          </div>
          <div class="header-right flex-1">
            <div class="top">
              <div class="title mb-10">
                <span>{{ asset_basic_data.project_name }}</span>
              </div>
              <div class="project-list">
                <span class="title">业务板块</span>
                <span class="value">{{ asset_basic_data.busin_name }}</span>
              </div>
            </div>
          </div>
        </header>
        <div class="flex-layout" style="height: calc(100% - 100px);">
          <div class="main-left">
            <TableHeader :count="$refs.OutputInfo && $refs.OutputInfo.getCount()" @change="searchTable"></TableHeader>
            <OutputInfo ref="OutputInfo"></OutputInfo>
          </div>
          <div class="side-right ml-10">
            <div class="detail-title">资产详情</div>
            <AssetSetailTitle title="项目概况"></AssetSetailTitle>
            <div class="conttent-box">
              <div class="item-detail">
                <label>总表数</label>
                <div class="value">{{asset_basic_data.table_count || 0}}</div>
              </div>
              <div class="item-detail">
                <label>离线存储量</label>
                <div class="value">{{asset_basic_data.hdfs_size || 0}}</div>
              </div>
            </div>
            <AssetSetailTitle title="基本信息"></AssetSetailTitle>
            <div class="conttent-box">
              <div class="item-detail">
                <label>创建时间</label>
                <div class="value">{{asset_basic_data.create_time}}</div>
              </div>
              <div class="item-detail">
                <label>空间类型</label>
                <div class="value">{{asset_basic_data.space_type}}</div>
              </div>
              <div class="item-detail">
                <label>描述</label>
                <div class="value">{{asset_basic_data.project_desc}}</div>
              </div>
            </div>
            <AssetSetailTitle title="计算引擎"></AssetSetailTitle>
            <div class="conttent-box">
              <div class="item-detail">
                <label>离线计算引擎</label>
                <div class="value">{{asset_basic_data.offline_engine_name}}</div>
              </div>
              <div class="item-detail">
                <label>实时计算引擎</label>
                <div class="value">{{asset_basic_data.real_time_engine_name}}</div>
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
import OutputInfo from './outputInfo'
import AssetInfo from './assetInfo.vue'
import { logicTypeMapIcon } from '@/config/rd-config.js'
import { getDataTableList } from '@/api/asset/list'
import { mapGetters } from 'vuex'
import TableHeader from '../component/table-header.vue'
import AssetSetailTitle from '../component/title.vue'
export default {
  name: 'indicator-detail',
  components: {
    AssetInfo,
    OutputInfo,
    TableHeader,
    AssetSetailTitle
  },
  data () {
    return {
      prePath: '',
      data: {},
      activeName: 'output',
      logicTypeMapIcon,
      loading: 0,
      asset_basic_data: {}
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
    ...mapGetters(['cube_id'])
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.prePath = from.fullPath
    })
  },
  created () {
    this.data.id = this.cube_id
    this.getOutputInfo()
  },
  methods: {
    async getOutputInfo () {
      const params = {
        pageSize: 10,
        pageNo: 1,
        id: this.cube_id
      }
      const res = await this.$simpleAsyncTo(getDataTableList(params))
      if (res) {
        this.asset_basic_data = res.data.basic_data
      }
    },
    searchTable (data) {
      this.$refs.OutputInfo && this.$refs.OutputInfo.getOutputInfo(data)
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
        padding: 15px 20px 20px 20px;
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
