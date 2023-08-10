<template>
  <div class="search-wrapper">
    <section class="search-result flex-layout">
      <div class="left-condition">
        <div class="condition-box">
          <div>
            <div class="screen">
              <span class="filter-text">条件筛选</span>
              <span @click="resetHandle" class="refresh-opt"><i class="el-icon-refresh-right"></i> 重置</span>
            </div>
            <div class="label-title">项目</div>
            <el-select v-model="searchFormLeft.project_id" clearable placeholder="请选择项目" filterable @change="changeProject">
              <el-option v-for="item in projectInfoList" :key="item.project_id" :label="`${item.project_code}(${item.project_name})`" :value="item.project_id"></el-option>
            </el-select>
            <div class="label-title">维度</div>
            <el-select v-model="searchFormLeft.dim_id" clearable placeholder="请选择维度" filterable @change="changeDim">
              <el-option v-for="item in dimInfoList" :key="item.dim_id" :label="`${item.dim_code}(${item.dim_name})`" :value="item.dim_id"></el-option>
            </el-select>
            <div class="label-title">事实逻辑表</div>
            <el-select v-model="searchFormLeft.logic_fact_id" clearable placeholder="请选择事实逻辑表" filterable @change="changeFactLogic">
              <el-option v-for="item in factInfoList" :key="item.logic_fact_id" :label="`${item.logic_fact_code}(${item.logic_fact_name})`" :value="item.logic_fact_id"></el-option>
            </el-select>
            <div class="label-title">原子指标</div>
            <el-select v-model="searchFormLeft.atomic_id" clearable placeholder="请选择原子指标" filterable @change="changeAtomic">
              <el-option v-for="item in atomicInfoList" :key="item.atomic_id" :label="`${item.atomic_code}(${item.atomic_name})`" :value="item.atomic_id"></el-option>
            </el-select>
            <div class="label-title">汇总表</div>
            <el-select v-model="searchFormLeft.sum_id" clearable placeholder="请选择汇总表" filterable @change="changeSum">
              <el-option v-for="item in sumInfoList" :key="item.sum_id" :label="`${item.sum_code}(${item.sum_name})`" :value="item.sum_id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="right-result flex-1">
        <div class="list-title flex-layout">
          <div class="flex-1">
            结果列表
          </div>
        </div>
        <div class="table-list">
          <el-table :data="tableList" style="width: 100%">
            <el-table-column show-overflow-tooltip label="指标名" width="350">
              <template slot-scope="{row}">
                <div class="flex-layout" @click="detailsCheckHandle(row)">
                  <div class="icons mr-10">
                    <i :class="['iconfont icon-tubiao-zhexiantu']"></i>
                  </div>
                  <div class="name">
                    <div>
                      <OverflowTooltip v-if="row.derivative_code">{{row.derivative_code}}</OverflowTooltip>
                    </div>
                    <div>
                      <OverflowTooltip class="item-detail" v-if="row.derivative_code">({{row.derivative_name}})</OverflowTooltip>
                      <OverflowTooltip class="item-detail" v-else>{{row.derivative_name}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="project_name" label="所属项目">
              <template slot-scope="{row}">
                <span class="project">{{ row.project_name }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="dim_name" label="维度"></el-table-column>
            <el-table-column show-overflow-tooltip prop="atomic_name" label="原子指标"></el-table-column>
            <el-table-column show-overflow-tooltip prop="logic_fact_name" label="事实逻辑表"></el-table-column>
            <el-table-column show-overflow-tooltip prop="sum_name" label="汇总表"></el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_user" label="创建人"></el-table-column>
          </el-table>
        </div>
        <el-pagination class="fr pt-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { iconMapColor } from '@/config/rd-config.js'
import pager from '@/mixins/pager'
import {
  getDeriveList,
  getProjectInfo,
  getDimInfo,
  getAtomicInfo,
  getFactLogicInfo,
  getSumLogicInfo
} from '@/api/asset/list'
export default {
  name: 'SearchResult',
  mixins: [pager],
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      searchFormLeft: {
        project_id: '',
        dim_id: '',
        atomic_id: '',
        logic_fact_id: '',
        sum_id: ''
      },
      tableList: [],
      projectInfoList: [],
      dimInfoList: [],
      atomicInfoList: [],
      factInfoList: [],
      sumInfoList: [],
      iconMapColor,
      pageFilters: {
        pageSize: 10,
        pageNo: 1 // 前台分页使用
      }
    }
  },
  created () {
    this.updateData()
  },
  methods: {
    ...mapMutations({
      setAssetBasicData: 'SET_ASSET_BASIC_DATA',
      setCubeId: 'SET_CUBE_ID'
    }),

    updateData () {
      this.getProjectList()
      this.getDimInfoData()
      this.getAtomicInfoData()
      this.getFactLogicInfoData()
      this.getSumLogicInfoData()
      this.getTableList()
    },

    initParams () {
      return {
        pageNo: '1',
        pageSize: '10',
        project_id: '',
        dim_id: '',
        sum_id: '',
        logic_fact_id: '',
        atomic_id: '',
        cube_id: ''
      }
    },

    // 左侧项目下拉
    async getProjectList () {
      const res = await this.$simpleAsyncTo(getProjectInfo({ keyword: this.keyword }), '获取项目失败')
      if (res) {
        this.projectInfoList = res.data
      }
    },

    async getDimInfoData (params) {
      if (params) {
        params.keyword = this.keyword
      }

      const res = await this.$simpleAsyncTo(getDimInfo(params || {}), '获取维度失败')
      if (res) {
        this.dimInfoList = res.data
      }
    },

    async getAtomicInfoData (params) {
      if (params) {
        params.keyword = this.keyword
      }
      const res = await this.$simpleAsyncTo(getAtomicInfo(params || {}), '获取原子指标失败')
      if (res) {
        this.atomicInfoList = res.data
      }
    },

    async getFactLogicInfoData (params) {
      if (params) {
        params.keyword = this.keyword
      }
      const res = await this.$simpleAsyncTo(getFactLogicInfo(params || {}), '获取事实逻辑失败')
      if (res) {
        this.factInfoList = res.data
      }
    },

    async getSumLogicInfoData (params) {
      if (params) {
        params.keyword = this.keyword
      }
      const res4 = await this.$simpleAsyncTo(getSumLogicInfo(params || {}), '获取汇总逻辑失败')
      if (res4) {
        this.sumInfoList = res4.data
      }
    },

    async changeProject (val) {
      this.searchFormLeft.dim_id = ''
      this.searchFormLeft.atomic_id = ''
      this.searchFormLeft.logic_fact_id = ''
      this.searchFormLeft.sum_id = ''
      const params = {
        project_id: val,
        keyword: this.keyword
      }
      this.getDimInfoData(params)
      this.getAtomicInfoData(params)
      this.getFactLogicInfoData(params)
      this.getSumLogicInfoData(params)
      this.getTableList()
    },
    async changeDim (val) {
      this.searchFormLeft.atomic_id = ''
      this.searchFormLeft.sum_id = ''
      const params = {
        project_id: this.searchFormLeft.project_id,
        dim_id: val,
        logic_fact_id: this.searchFormLeft.logic_fact_id
      }
      const params2 = {
        project_id: this.searchFormLeft.project_id,
        dim_id: val
      }
      this.getAtomicInfoData(params)
      this.getSumLogicInfoData(params2)
      this.getTableList()
    },
    async changeFactLogic (val) {
      const params = {
        project_id: this.searchFormLeft.project_id,
        dim_id: this.searchFormLeft.dim_id,
        logic_fact_id: val
      }
      this.searchFormLeft.atomic_id = ''
      this.getAtomicInfoData(params)
      this.getTableList()
    },
    changeAtomic () {
      this.getTableList()
    },
    changeSum () {
      this.getTableList()
    },

    resetHandle () {
      this.searchFormLeft = this.initParams()
      this.getTableList()
    },

    // 获取结果列表
    async getTableList () {
      const { project_id, dim_id, sum_id, logic_fact_id, atomic_id } = this.searchFormLeft
      const tempParams1 = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize,
        keyword: this.keyword,
        project_id,
        dim_id,
        sum_id,
        logic_fact_id,
        atomic_id
      }
      const res = await this.$simpleAsyncTo(getDeriveList(tempParams1), '获取列表失败')
      if (res) {
        this.total = res.data.total_records
        this.tableList = res.data.derive_data
      }
    },

    detailsCheckHandle (val) {
      localStorage.setItem('keyword', this.keyword)
      this.$router.push({ name: 'indicator-detail' })
      this.setCubeId(val.id)
      this.setAssetBasicData(val)
    },

    handleCurrentChange (val) {
      this.pageFilters.pageNo = val
      this.getTableList()
    }
  }
}
</script>
<style lang="scss" scoped>
$leftWidth: 360px;
.project {
  color: #4266dd;
}
.search-wrapper {
  height: 100%;
}
.item-detail {
  font-size: 12px;
  color: #666;
}
.search-result {
  padding: 0 10px 10px 10px;
  height: calc(100% - 100px);
  min-height: calc(100% - 100px);
  background-color: $grey8;
  height: 100%;
  .iconfont {
    margin-right: 5px;
    color: #39c254;
  }
  .left-condition {
    width: $leftWidth;
    background: #fff;
    padding: 20px;
    .screen {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 14px;
      .refresh-opt {
        cursor: pointer;
      }
    }
  }
  .right-result {
    padding: 0 0 0 10px;
    .list-title {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      margin: 10px 0;
      i {
        font-size: 16px;
        cursor: pointer;
      }
    }
    .table-list {
      background: $grey10;
      padding: 20px 20px 0 20px;
      margin-bottom: 10px;
      height: calc(100% - 160px);
      overflow: auto;
      .icons {
        display: flex;
        align-items: center;
        i {
          font-size: 28px;
          // color: $warning;
        }
      }
      .name {
        font-size: 14px;
        cursor: pointer;
        width: calc(100% - 20px);
        > h4 {
          span {
            width: calc(100% - 20px);
          }
        }
      }
      .info {
        font-size: 12px;
        > div {
          width: 33.33333%;
          span {
            width: calc(100% - 80px);
            color: $grey2;
          }
        }
      }
    }
    .color {
      color: $grey4;
    }
  }
}
</style>
