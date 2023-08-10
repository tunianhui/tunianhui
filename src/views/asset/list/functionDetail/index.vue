<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-10">
        <el-breadcrumb-item :to="{ path: prePath }">搜索列表</el-breadcrumb-item>
        <el-breadcrumb-item>函数详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="['iconfont', 'iconfont icon-hanshu2']"></i>
            <div class="mt-5">{{'22' | turnTableType}}</div>
          </div>
          <div class="header-right flex-1">
            <div class="top">
              <div class='title mb-10'>
                <span>{{asset_basic_data.func_name}}</span>
              </div>
              <div class="options mb-10">
                <span class="mr-20">
                  <i class="el-icon-lock pr-5"></i>
                  <span @click="applyclickHandle">申请权限</span>
                </span>
                <span class="mr-20" @click="isCollectClickHandle">
                  <i :class="['icon iconfont pr-5 fz', 'icon-wujiaoxingxingxingshoucang bgc']"></i>
                  <span>{{'取消收藏'}}</span>
                </span>
              </div>
              <div class="project">
                <span>所属项目</span>
                <span class="value">{{ asset_basic_data.project_name }}</span>
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
          <div class="main-left">
            <AssetTabsBox :tabs="tabs" @changeTab="changeTab">
              <template slot="output">
                <FuncReference :asset_basic_data="asset_basic_data"></FuncReference>
              </template>
            </AssetTabsBox>
          </div>
          <div class="side-right ml-10">
            <div class="detail-title">资产信息</div>
            <AssetInfo :asset_basic_data="asset_basic_data"></AssetInfo>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import 'animate.css'
import FuncReference from './funcReference'
import AssetInfo from './assetInfo.vue'
import { logicTypeMapIcon } from '@/config/rd-config.js'
import { getFuncDetail } from '@/api/asset/list'
import { mapGetters } from 'vuex'
import AssetTabsBox from '../component/tabs.vue'
export default {
  name: 'indicator-detail',
  components: {
    AssetInfo,
    FuncReference,
    AssetTabsBox
  },
  data () {
    return {
      prePath: '',
      data: {},
      activeName: 'output',
      primarysTables: [],
      logicTypeMapIcon,
      loading: 0,
      asset_basic_data: {},
      tabs: [
        {
          label: '函数引用',
          value: 'output'
        }
      ]
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
  created () {
    this.data.id = this.cube_id
    this.getDetail()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prePath = from.fullPath
    })
  },
  methods: {
    async getDetail () {
      const res = await this.$simpleAsyncTo(getFuncDetail({ id: this.cube_id }), '获取列表失败')
      if (res) {
        this.asset_basic_data = res.data.basic_data
      }
    },

    // 是否收藏
    async isCollectClickHandle () {

    },

    // 申请权限
    applyclickHandle () {

    },
    changeTab (data) {
      this.activeName = data
    }

  }
}
</script>
<style lang="scss" scoped>
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
          .project {
            font-size: 14px;
            .value {
              margin-left: 20px;
              color: #8c8c8c;
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
      }
    }
  }
}
</style>
