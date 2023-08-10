<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-row :gutter="10" style="height:100%">
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="left-table">
            <header class="header mb-10 flex-layout">
              <div class="header-left">
                <i :class="['iconfont', logicTypeMapIcon[tableInfo.object_type]]"></i>
                <div>{{tableInfo.object_type | turnTableType}}</div>
              </div>
              <div class="header-right flex-1">
                <div class="top">
                  <div class='title mb-10'>
                    <span>{{tableInfo.cube_code}}</span>
                    <OverflowTooltip style="width:200px">{{tableInfo.cube_name}}</OverflowTooltip>
                    <!-- <span class="ml-5"></span> -->
                  </div>
                  <div class="options">
                    <span class="mr-20">
                      <i class="el-icon-lock pr-5"></i>
                      <!-- <router-link tag="span" to="/asset/authority/apply">申请权限</router-link> -->
                      <span @click="applyclickHandle">申请权限</span>
                    </span>
                    <span class="mr-20" @click="isCollectClickHandle">
                      <i :class="['icon iconfont pr-5 fz', tableInfo.is_collect?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing']"></i>
                      <span v-show="!tableInfo.is_collect">收藏</span>
                      <span v-show="tableInfo.is_collect">取消收藏</span>
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
                <div class="bottom flex-layout">
                  <div class="attr-item pt-10 pr-20" v-for="item in primarysTables" :key="item.element_code">
                    <span class="mr-10">主键：</span>
                    <OverflowTooltip style="width:50px">{{item.element_name}}</OverflowTooltip>
                  </div>
                </div>
              </div>
            </header>
            <!-- 逻辑表 -->
            <el-tabs
              v-model="activeName">
              <el-tab-pane label="表结构" name="table" lazy>
                <TabInfo
                  :tableInfo="tableInfo"
                  :tableStructure="tableStructure"
                  :primarysTables="primarysTables"
                  :tableType="tableInfo.object_type"
                ></TabInfo>
              </el-tab-pane>
              <el-tab-pane label="分区概览" name="zone" lazy>
                <Zone></Zone>
              </el-tab-pane>
              <el-tab-pane label="数据预览" name="dataPreview" lazy>
                <DataPreview></DataPreview>
              </el-tab-pane>
              <el-tab-pane label="产出信息" name="output" lazy>
                <OutputInfo></OutputInfo>
              </el-tab-pane>
              <el-tab-pane label="血缘关系" name="bloodRelation" lazy>
                <Relation :data="data" class="relation-graph"></Relation>
              </el-tab-pane>
            </el-tabs>
            <!-- 物理表 -->
            <!-- <el-tabs v-model="physicsActive"
              @tab-click="physicsTabHandle"
              v-if="tableInfo.object_type!=16 &&
              tableInfo.object_type!=17 &&
              tableInfo.object_type!=18">
              <el-tab-pane label="表结构" name="table" lazy>
                <tabInfo
                  :tableInfo="tableInfo"
                  :tableStructure="tableStructure"
                  :primarysTables="primarysTables"></tabInfo>
              </el-tab-pane>
              <el-tab-pane label="分区概览" name="zone" lazy>
                <PhysicsZone></PhysicsZone>
              </el-tab-pane>
              <el-tab-pane label="数据预览" name="dataPreview" lazy>
                <DataPreview></DataPreview>
              </el-tab-pane>
              <el-tab-pane label="产出信息" name="output1" lazy>
                <OutputInfo :tableData="phySicsTableData"></OutputInfo>
              </el-tab-pane>
              <el-tab-pane label="血缘关系" name="bloodRelation" lazy>
                <Relation :data="data" class="relation-graph"></Relation>
              </el-tab-pane>
            </el-tabs> -->
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="height:100%">
          <div class="info-detail">
            <div class="basic">
              <h3 class="">基本信息</h3>
              <div>
                <span>负责人：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.oper_user}}</OverflowTooltip>
              </div>
              <div>
                <span>创建时间：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.create_time}}</OverflowTooltip>
              </div>
              <div>
                <span>内容描述：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.desc}}</OverflowTooltip>
              </div>
            </div>

            <div class="basic">
              <h3 class="">使用信息</h3>
              <div>
                <span>收藏次数：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.collect_num}}</OverflowTooltip>
              </div>
              <div>
                <span>读取次数：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.read_num}}次</OverflowTooltip>
              </div>
            </div>

            <div class="basic">
              <h3 class="">物理信息</h3>
              <div v-if="tableInfo.object_type!=16&&
                tableInfo.object_type!=17&&
                tableInfo.object_type!=18">
                  <span>表类型：</span>
                  <OverflowTooltip class="basic-info-width">{{tableInfo.table_type | turnTableType}}</OverflowTooltip>
              </div>
              <div>
                <span>存储量：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.storage_num}} B</OverflowTooltip>
              </div>
            </div>
            <div class="basic">
              <h3 class="">变更信息</h3>
              <div>
                <span>DDL变更：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.ddl_change}}</OverflowTooltip>
              </div>
              <div>
                <span>数据变更：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.updata_data}}</OverflowTooltip>
              </div>
              <div>
                <span>最近访问：</span>
                <OverflowTooltip class="basic-info-width">{{tableInfo.lately_visit}}</OverflowTooltip>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
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
// import PhysicsZone from './physiceZone'
import DataPreview from './dataPreview'
import OutputInfo from './outputInfo'
import { logicTypeMapIcon } from '@/config/rd-config.js'
// import BloodRelation from './bloodRelation'
// import Relation from '@c/graph/relation/relation-table.vue'
import Relation from '@c/graph/relation'
import {treeTypes, types} from '@/config/rd-config'
import { getDetails, setCollect } from '@/api/asset/map'
import {mapGetters} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'Detail',
  components: {
    TabInfo,
    Zone,
    // PhysicsZone,
    DataPreview,
    OutputInfo,
    // BloodRelation
    Relation,
    OverflowTooltip
  },
  data() {
    return {
      data: {},
      activeName: 'table',
      physicsActive: 'table',
      isCollect: true,
      seeSelectVisible: false,
      sql_content: '',
      tableInfo: {},
      tableStructure: [],
      primarysTables: [],
      phySicsTableData: [
        {
          task_id: '物理',
          time: '564',
          start_time: '2019-10-23 00:00:44',
          end_time: '2019-10-23 00:00:44'
        }
      ],
      logicTableData: [
        {
          task_id: '逻辑',
          time: '564',
          start_time: '2019-10-23 00:00:44',
          end_time: '2019-10-23 00:00:44'
        }
      ],
      DimensionTable: treeTypes[types.DIMENSIONTABLE],
      FactTable: treeTypes[types.FACTTABLE],
      PolymerTable: treeTypes[types.POLYMERTABLE],
      PhysicalTable: treeTypes[types.PHYSICALTABLE],
      logicTypeMapIcon,
      loading: 0
    }
  },
  filters: {
    turnTableType(v) {
      let a = {
        100: '物理表',
        16: '维度逻辑表',
        17: '事实逻辑表',
        18: '汇总逻辑表'
      }
      return a[v]
    }
  },
  computed: {
    ...mapGetters(['tabList', 'cube_id'])
  },
  created() {
    this.data.id = this.cube_id
    this.getBasicInfo()
  },
  methods: {
    // ...mapMutations({
    //   setTabList: 'SET_TAB_LIST',
    //   setActiveName: 'SET_ACTIVE_NAME'
    // }),
    // 获取基本信息
    async getBasicInfo() {
      // let cube_id = JSON.parse(this.$route.query.data).cube_id
      this.loading++
      const params = {cube_id: this.cube_id}
      const res = await this.$simpleAsyncTo(getDetails(params), '获取基本信息失败')
      if (res) {
        this.tableInfo = res.tableInfo
        this.tableStructure = res.columns
        this.primarysTables = res.primarys
        this.sql_content = res.searchSql
      }
      this.loading--
    },
    // 是否收藏
    async isCollectClickHandle() {
      let isCollect = this.tableInfo.is_collect === 1 ? 0 : 1
      const res = await this.$simpleAsyncTo(setCollect({id: this.cube_id, isCollect}), '设置收藏失败')
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
    physicsTabHandle(tab) {
    },
    // 申请权限
    applyclickHandle() {
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
    },
    // 导出字段
    downloadField() {
      const a = document.createElement('a')
      a.href = `/asset/catalogueDataTable/exportColums?cube_id=${this.cube_id}`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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
    .left-table {
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
            }
            .options {
              font-size: 12px;
              color: $grey4;
              .bgc {
                color: $warning;
              }
              >span {
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
            >tr {
              th:first-child {
                >div {
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
    .info-detail {
      background: $grey10;
      height: 100%;
      padding: 20px;
      .basic {
        border-bottom: 2px solid $grey5;
        padding: 0 10px;
        margin-top: 20px;
        >div {
          margin: 20px 10px;
          font-size: 12px;
          span:first-child {
            color: $grey4;
            text-align: end;
          }
        }
        .basic-info-width {
          width: calc(100% - 80px);
        }
      }
    }
    .el-dialog__body {
      height: 350px;
    }
  }
}
</style>
