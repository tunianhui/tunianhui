<template>
  <div class="info">
    <div class="flex-between">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="searchForm.project_id" placeholder="所属数据库">
            <el-option v-for="item in dataBaseList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="searchForm.status" placeholder="表状态">
            <el-option v-for="item in dics.status_tag" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-input v-model="searchForm.cube_name" placeholder="搜索表名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="join-data" type="primary" @click="addDataTable">加入数据表</el-button>
      </div>
    </div>
    <div class="info-table">
      <el-table :data="tableData" v-loading="!!loading" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}">
        <el-table-column prop="cube_name" label="表名">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.cube_name}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="oper_user" label="负责人">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.oper_user}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="dataType" label="数据类型"></el-table-column>
        <el-table-column prop="project_code" label="所在数据库">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.project_code}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="更新时间">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.create_time}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改类目" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="修改类目" @click="editHandle(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    <Modify v-if="visibleModify" :visible="visibleModify" :row="row" type="table" @close="closeModify" @refresh="refresh"></Modify>
    <AddList v-if="visibleAdd" :visible="visibleAdd" :catalogId="catalogId" @close="closeAdd" @refresh="refreshAdd"></AddList>
  </div>
</template>

<script>
import Modify from '../modify'
import AddList from './add-list'
import listMixin from '../list-mixin'
import pager from '@/mixins/pager'
import OverflowTooltip from '@c/overflow-tooltip'
import {
  tableListPageByCatalog
} from '@/api/asset/catalogue'
import {
  getProjectList
} from '@/api/plan/physical-datasource'
export default {
  name: 'tableList',
  mixins: [pager, listMixin],
  components: { OverflowTooltip, Modify, AddList },
  props: {
    catalogId: String
  },
  data () {
    return {
      loading: 0,
      searchForm: {
        cube_name: '',
        project_id: ''
      },
      fixed: false,
      tableData: [],
      visibleAdd: false
    }
  },
  watch: {
    catalogId: function (val) {
      this.getTableList()
    }
  },
  created () {
    this._getProjectList()
  },
  mounted () {
    this.getTableList()
  },
  methods: {
    async getTableList () {
      this.loading++
      let params = {
        ...this.searchForm,
        catalog_id: this.catalogId,
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      const res = await this.$simpleAsyncTo(tableListPageByCatalog(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    addDataTable () {
      this.visibleAdd = true
    },
    closeAdd () {
      this.visibleAdd = false
    },
    refreshAdd () {
      this.visibleAdd = false
      this.getTableList()
    },
    // 所属数据库
    async _getProjectList () {
      const res = await this.$simpleAsyncTo(getProjectList(), '获取失败')
      if (res) {
        this.dataBaseList = res.data.map(item => {
          return {
            id: item.id,
            label: item.project_code
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.join-table {
  max-height: 400px;
  overflow: auto;
}

</style>
