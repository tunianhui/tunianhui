<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-23 13:47:11
 * @LastEditTime: 2023-08-08 17:25:58
 * @Description:
-->

<template>
  <section class="detail no-hover">
    <div class="detail-box" v-loading="!!loading">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-10">
        <el-breadcrumb-item :to="{path: '/asset/security/data-identification/record'}">识别任务</el-breadcrumb-item>
        <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content-box-detail">
        <header class="header mb-10 flex-layout">
          <div class="header-left">
            <i :class="['iconfont', 'iconfont icon-xiangmuquanxianguanli']"></i>
            <div class="mt-5">识别任务</div>
          </div>
          <div class="header-right flex-1">
            <div class="top">
              <div class="title mb-10">
                <span>{{ taskDatail.taskName }}</span>
              </div>
              <div class="project-list">
                <span class="title">任务类型</span>
                <span class="value">{{ taskDatail.taskTypeName }}</span>
                <span class="title">任务状态</span>
                <span class="value"><i :class="taskDatail.taskStatusName === '成功' ? 'el-icon-success':'el-icon-close' "></i>{{ taskDatail.taskStatusName }}</span>
                <!-- <span class="title">操作人</span>
                <span class="value">{{ taskDatail.taskTypeName }}</span> -->
                <span class="title">开始时间</span>
                <span class="value">{{ taskDatail.scanStartDate }}</span>
                <span class="title">结束时间</span>
                <span class="value">{{ taskDatail.scanEndDate }}</span>
              </div>
            </div>
          </div>
        </header>
        <div class="main" style="height: calc(100% - 100px);">
          <div class="flex-between mb-10">
            <span>任务识别详情</span>
            <div class="flex">
              <el-input prefix-icon="el-icon-search" v-model="tblName" placeholder="请输入表名称" style="width: 200px" @input="searchChange"></el-input>
              <el-button icon="iconfont icon-filter" @click="handleFilter" class="ml-10">筛选</el-button>
            </div>
          </div>
          <div v-show="showCondition" class="condition-wrapper mb-10">
            <div>
              <el-form :model="form" inline class="form" label-width="110px">
                <el-form-item label="数据板块" class="form-item">
                  <el-select multiple clearable placeholder="请选择数据板块" v-model="form.unitId" @change="selectProject">
                    <el-option v-for="item in businList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属项目 " class="form-item">
                  <el-select clearable placeholder="请选择项目" v-model="form.projectId" @change="changeHandle">
                    <el-option v-for="item in projectList" :key="item.value" :value="item.value" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="扫描状态" class="form-item">
                  <el-checkbox-group v-model="form.tableStatus" clearable @change="clickStatus">
                    <el-checkbox v-for="(item, index) in scanStatusTypeList" :label="item.value" :key="index">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-divider></el-divider>
              <el-tag v-if="form.unitId.length !== 0" :key="1" size="mini" closable class="mr-5" @close="handleClose('1')">数据板块: {{ showUnitId.join('、') }}</el-tag>
              <el-tag v-if="form.projectId" :key="2" size="mini" closable class="mr-5" @close="handleClose('2')">所属项目: {{ showProject }}</el-tag>
              <el-tag v-if="form.tableStatus.length !== 0" :key="3" size="mini" closable class="mr-5" @close="handleClose('3')">扫描状态: {{ showTableStatus.join('、') }}</el-tag>
            </div>
          </div>

          <Swiper ref="tablePageDetail" :cell-width="cellWidth" :collapse="detailCollapse" :fullscreen="fullscreen" @collapse="collapseHandle">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%;" :height="height" v-loading="!!loading">
              <el-table-column prop="tblName" label="表名称" width="250">
                <template slot-scope="{row}">
                  <div class="flex">
                    <span class="icon iconfont icon-yuanbiao-xianxing"></span>
                    <span class="ml-10 cube_name" @click="ClickTblName(row)">{{row.tblName}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="tableStatusName" label="扫描状态">
                <template slot-scope="{row}">
                  <i :class="row.tableStatusName === '成功' ? 'el-icon-success':'el-icon-close' "></i>
                  <span>{{row.tableStatusName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unitName" label="业务板块">
              </el-table-column>
              <el-table-column prop="projectName" label="所属项目">
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="{row}">
                  <el-tooltip class="item" effect="dark" content="查看表识别详情" placement="top">
                    <el-button type="text" @click="ClickTblName(row)"><i class="font-16 color-btn iconfont icon-lishijilu"></i></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <TableDetail :tableData="tableDetailList" :tablRow="tablRow" :totalCount="tableDetailTotal" @sendColumn="sendColumn" @sendTableList="gettableDetail" slot="detail" v-if="isTableShow" :height="height"></TableDetail>
          </Swiper>
          <taskFooter :isShow="isShow" :totalNum="total" @clickJumper="clickJumper" @sendTableList="sendTableList"></taskFooter>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
import Swiper from '@c/swiper.vue'
import TableDetail from './tableDetail'
import taskFooter from './taskFooter.vue'
import {
  getTaskDetail,
  getBusinList,
  getProjectList,
  getScanStatusType,
  getTableDetail
} from '@/api/asset/security.js'

export default {
  name: 'task-detail',
  mixins: [pager],
  components: {
    Swiper,
    TableDetail,
    taskFooter
  },
  data () {
    return {
      cellWidth: 280,
      // fullscreen: true,
      scanTaskId: '',
      taskDatail: {},
      tblName: '',
      tableData: [],
      loading: 0,
      showCondition: false,
      businList: [],
      projectList: [],
      form: {
        unitId: [],
        projectId: '',
        tableStatus: []
      },
      scanStatusTypeList: [],
      showUnitId: [],
      showProject: '',
      showTableStatus: [],
      isTableShow: false,
      detailCollapse: false,
      fullscreen: false,
      tablRow: {},
      height: 100,
      mainHeihgt: 200,
      isShow: false,
      filterData: {
        pageSize: 15,
        pageNo: 1
      },
      pageFilters2: {
        pageSize: 10,
        pageNo: 1
      },
      tableDetailList: [],
      tableDetailTotal: 0,
      columnName: ''
    }
  },
  created () {
    this.getBusinList()
  },
  mounted () {
    this.scanTaskId = this.$route.query.id
    this.taskDatail = this.$route.params
    this.getTableList()
    this.getScanStatusType()
    this.$nextTick(_ => {
      this.mainHeihgt = document.getElementsByClassName('main')[0].offsetHeight
      this.height = this.mainHeihgt - 75
    })
  },
  methods: {
    sendColumn (val) {
      this.columnName = val
      this.getTableDetailData(this.tablRow)
    },
    gettableDetail (val) {
      this.pageFilters2 = val
      this.getTableDetailData(this.tablRow)
    },
    collapseHandle () {
      this.pageFilters = this.filterData
      this.isShow = false
    },
    clickJumper (val) {
      this.pageFilters.pageSize = 15
      this.pageFilters.pageNo = val
      this.getTableList()
    },
    sendTableList (val) {
      // this.filterData = val
      this.pageFilters = val
      if (this.isShow) {
        // ---- 参数
        this.getTableDetailData(this.tablRow)
      } else {
        this.getTableList()
      }
    },
    ClickTblName (row) {
      this.pageFilters = this.filterData
      this.getTableDetailData(row)
      this.tablRow = row
      this.isShow = true
      this.isTableShow = true
      this.$refs.tablePageDetail.visibleDetail()
    },
    changeHandle () {
      this.setHeightFun()
      this.getTableList()
      this.projectList.forEach(item => {
        if (item.value === this.form.projectId) {
          this.showProject = item.name
        }
      })
    },
    handleClose (tag) {
      if (tag === '1') {
        this.showUnitId = []
        this.form.unitId = []
      } else if (tag === '2') {
        this.showProject = ''
        this.form.projectId = ''
      } else {
        this.showTableStatus = []
        this.form.tableStatus = []
      }
      this.setHeightFun()
      this.getTableList()
    },
    clickStatus () {
      this.setHeightFun()
      this.showTableStatus = []
      this.scanStatusTypeList.forEach(item => {
        this.form.tableStatus.forEach(item2 => {
          if (item.value === item2) {
            this.showTableStatus.push(item.name)
          }
        })
      })
      this.getTableList()
    },
    selectProject () {
      this.setHeightFun()
      this.getProjectList()
      this.getTableList()
      this.showUnitId = []
      this.businList.forEach(item => {
        this.form.unitId.forEach(index => {
          if (item.value === index) {
            this.showUnitId.push(item.name)
          }
        })
      })
    },
    setHeightFun () {
      if (this.showCondition) {
        if (this.form.unitId.length !== 0 || this.form.projectId || this.form.tableStatus.length !== 0) {
          this.height = this.mainHeihgt - 257
        } else {
          this.height = this.mainHeihgt - 235
        }
      } else {
        this.height = this.mainHeihgt - 75
      }
    },
    handleFilter () {
      this.showCondition = !this.showCondition
      this.setHeightFun()
    },
    searchChange () {
      this.getTableList()
    },
    async getTableList () {
      const params = {
        scanTaskId: this.scanTaskId,
        tblName: this.tblName,
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        unitId: this.form.unitId + '',
        projectId: this.form.projectId,
        tableStatus: this.form.tableStatus + ''
      }
      this.loading++
      const res = await getTaskDetail(params)
      this.loading--
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    },
    async getBusinList () {
      const res = await getBusinList()
      if (res) {
        this.businList = res.data
      }
    },
    async getProjectList () {
      const params = {
        unitId: this.form.unitId + ''
      }
      const res = await getProjectList(params)
      if (res) {
        this.projectList = res.data
      }
    },
    async getScanStatusType () {
      const res = await getScanStatusType()
      if (res) {
        this.scanStatusTypeList = res.data
      }
    },
    async getTableDetailData (row) {
      const { scanTaskId, tblName, dbName } = row
      const params = {
        scanTaskId,
        tblName,
        dbName,
        searchText: this.columnName,
        ...this.pageFilters2
      }
      const res = await getTableDetail(params)
      if (res && res.data) {
        this.tableDetailList = res.data.totalList
        this.tableDetailTotal = res.data.total
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100%;
  background: $grey8;
  justify-content: center;
  .animated {
    animation-duration: 0.3s;
  }
  .condition-wrapper {
    background-color: #fff;
    padding: 20px 30px;
    :deep(.el-form) {
      .el-form-item {
        width: 48.5%;
        border: 1px solid #dcdfe6;
        padding: 0 10px;
        height: 34px;
        line-height: 28px;
        white-space: nowrap;
      }
      .el-form-item__content {
        width: calc(100% - 110px);
        border-left: 1px solid #dcdfe6;
        padding-left: 10px;
        .el-select {
          width: 100%;
          .el-input__inner {
            border: none;
          }
        }
      }
    }
    .el-divider {
      margin-top: 0px;
      margin-bottom: 5px;
    }
  }
  .detail-box {
    padding: 20px 10px 0px;
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
