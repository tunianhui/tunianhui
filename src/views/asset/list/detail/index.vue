<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-10">
        <el-breadcrumb-item :to="{ path: prePath }">搜索列表</el-breadcrumb-item>
        <el-breadcrumb-item>资产详情</el-breadcrumb-item>
      </el-breadcrumb>

      <header class="header mb-10 flex-layout">
        <div class="header-left">
          <i :class="['iconfont', logicTypeMapIcon[tableInfo.object_type]]"></i>
          <div class="mt-5">{{tableInfo.object_type | turnTableType}}</div>
        </div>
        <div class="header-right flex-1">
          <div class="top">
            <div class='title mb-10'>
              <span>{{tableInfo.cube_code}}</span>
              <OverflowTooltip>{{tableInfo.cube_name}}</OverflowTooltip>
              <div class="desc">描述：tab01</div>
            </div>
            <div class="options">
              <span class="mr-20">
                <i class="el-icon-lock pr-5"></i>
                <!-- <router-link tag="span" to="/asset/authority/apply">申请权限</router-link> -->
                <span @click="applyclickHandle">申请权限</span>
              </span>
              <span class="mr-20" @click="isCollectClickHandle">
                <i :class="['icon iconfont pr-5 fz', tableInfo.is_collect?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing']"></i>
                <span v-show="tableInfo.is_collect">{{tableInfo.is_collect ? '取消收藏' :'收藏'}}</span>
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

      <el-row :gutter="10" style="height:100% - 90px">
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="left-table">
            <!-- 逻辑表 -->
            <h3 class="mb-10">资产详情</h3>
            <el-tabs v-model="activeName">
              <el-tab-pane label="产出信息" name="output" lazy>
                <OutputInfo></OutputInfo>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="height:100%">
          <AssetInfo :tableInfo="tableInfo"></AssetInfo>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import 'animate.css'
import OutputInfo from './outputInfo'
import AssetInfo from './assetInfo.vue'
import { logicTypeMapIcon } from '@/config/rd-config.js'
import { getDetails, setCollect } from '@/api/asset/map'
import { mapGetters } from 'vuex'
export default {
  name: 'Detail',
  components: {
    AssetInfo,
    OutputInfo
  },
  data () {
    return {
      prePath: '',
      data: {},
      activeName: 'output',
      isCollect: true,
      tableInfo: {},
      tableStructure: [],
      primarysTables: [],
      logicTypeMapIcon,
      loading: 0
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
    next(vm => {
      vm.prePath = from.fullPath
    })
  },
  created () {
    this.data.id = this.cube_id
    this.getBasicInfo()
  },
  methods: {
    // 获取基本信息
    async getBasicInfo () {
      // let cube_id = JSON.parse(this.$route.query.data).cube_id
      this.loading++
      const params = { cube_id: this.cube_id }
      const res = await this.$simpleAsyncTo(getDetails(params), '获取基本信息失败')
      if (res) {
        this.tableInfo = res.tableInfo
        this.tableStructure = res.columns
        this.primarysTables = res.primarys
        // this.tableInfo.object_type = 22 // ---> 11种
        console.log(res, 'tableInfo')
      }
      this.loading--
    },

    // 是否收藏
    async isCollectClickHandle () {
      let isCollect = this.tableInfo.is_collect === 1 ? 0 : 1
      const res = await this.$simpleAsyncTo(setCollect({ id: this.cube_id, isCollect }), '设置收藏失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        this.getBasicInfo()
      }
      // this.tableInfo.is_collect = !this.tableInfo.is_collect
      // this.$message({
      //   type: 'success',
      //   message: this.tableInfo.is_collect ? '收藏成功' : '取消成功'
      // })
    },

    // 物理表信息tab切换
    physicsTabHandle (tab) {
    },

    // 申请权限
    applyclickHandle () {
      // let menu = {}
      // if (this.tableInfo.table_type === 16 || this.tableInfo.table_type === 17 || this.tableInfo.table_type === 18) {
      //   menu = {
      //     path: '/asset/safety/logic-table-apply',
      //     name: this.tableInfo.id + '',
      //     meta: {
      //       name: '申请逻辑表权限',
      //       jump: false,
      //       hideInMenu: false
      //     }
      //   }
      // } else if (this.tableInfo.table_type === 100) {
      //   menu = {
      //     path: '/asset/safety/physical-table-apply',
      //     name: this.tableInfo.id + '',
      //     meta: {
      //       name: '申请物理表权限',
      //       jump: false,
      //       hideInMenu: false
      //     }
      //   }
      // }
      // this.$router.push({path: menu.path})
      // this.setTabList(menu)
      // this.setActiveName(menu.name)
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
}
</style>
