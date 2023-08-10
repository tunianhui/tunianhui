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
            <div class="label-title">表名</div>
            <el-select v-model="searchFormLeft.cube_id" clearable placeholder="请选择表名" filterable @change="changeCube">
              <el-option v-for="item in cubeInfoList" :key="item.cube_id" :label="`${item.cube_code}(${item.cube_name})`" :value="item.cube_id"></el-option>
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
            <el-table-column show-overflow-tooltip prop="element_code" label="字段名称" width="300">
              <template slot-scope="{row}">
                <div class="flex-layout">
                  <div class="icons mr-10">
                    <i :class="['iconfont icon-code-guanjianci']"></i>
                  </div>
                  <div class="name">
                    <div>
                      <OverflowTooltip v-if="row.element_code">{{row.element_code}}</OverflowTooltip>
                    </div>
                    <div>
                      <OverflowTooltip class="item-detail" v-if="row.element_code">({{row.element_name}})</OverflowTooltip>
                      <OverflowTooltip class="item-detail" v-else>{{row.element_name}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="element_type" label="字段类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="busin_name" label="归属板块"></el-table-column>
            <el-table-column show-overflow-tooltip prop="is_used" label="是否使用"></el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_user" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_time" label="创建时间"></el-table-column>
          </el-table>
        </div>
        <el-pagination class="fr pt-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import {
  getProjectInfo,
  getFieldList,
  getCubeInfo
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
        cube_id: ''
      },
      tableList: [],
      projectInfoList: [],
      cubeInfoList: []
    }
  },
  created () {
  },
  mounted () {
    this.updateData()
  },
  methods: {
    initParams () {
      return {
        pageNo: '1',
        pageSize: '10',
        project_id: '',
        cube_id: ''
      }
    },

    updateData () {
      this.getProjectList()
      this.getCubeInfoData()
      this.getTableList()
    },

    // 左侧项目下拉
    async getProjectList () {
      const res = await this.$simpleAsyncTo(getProjectInfo({ keyword: this.keyword }), '获取项目失败')
      if (res) {
        this.projectInfoList = res.data
      }
    },

    async getCubeInfoData (params) {
      if (params) {
        params.keyword = this.keyword
      }

      const res5 = await this.$simpleAsyncTo(getCubeInfo(params || {}), '获取表名失败')
      if (res5) {
        this.cubeInfoList = res5.data
      }
    },

    async changeProject (val) {
      this.searchFormLeft.cube_id = ''
      const params = {
        project_id: val,
        keyword: this.keyword
      }
      this.getCubeInfoData(params)
      this.getTableList()
    },

    changeCube () {
      this.getTableList()
    },

    changeFieldSearch () {
      this.getTableList()
    },

    resetHandle () {
      this.searchFormLeft = this.initParams()
      this.getTableList()
    },

    // 获取结果列表
    async getTableList () {
      const { project_id, field_search, cube_id } = this.searchFormLeft
      const tempParams = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize,
        keyword: this.keyword,
        project_id,
        field_search,
        cube_id
      }
      const res = await this.$simpleAsyncTo(getFieldList(tempParams), '获取列表失败')
      if (res) {
        this.total = res.data.total_records
        this.tableList = res.data.field_data
      }
    },

    async handleCurrentChange (val) {
      this.pageFilters.pageNo = val
      this.getTableList()
    }
  }
}
</script>
<style lang="scss" scoped>
$leftWidth: 360px;
.search-wrapper {
  height: 100%;
}
.search-result {
  padding: 0 10px 10px 10px;
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
