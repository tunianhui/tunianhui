<template>
  <div class="info">
    <div class="flex-between">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.api_name" placeholder="搜索API名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="join-data" type="primary" @click="addList">加入API列表</el-button>
      </div>
    </div>
    <div class="info-table">
      <el-table :data="tableData" v-loading="!!loading" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}">
        <el-table-column prop="api_name" label="API名">
          <template slot-scope="scope">
            <OverflowTooltip class="width">
              <div class="name">
                <el-tag v-if="scope.row.status === '1'" type="success" size="mini">上线</el-tag>
                <el-tag v-if="scope.row.status === '0'" type="danger" size="mini">下线</el-tag>
                <el-button type="text" class="ml-5" @click="_seeHandle(scope.row)">{{scope.row.api_name}}</el-button>
              </div>
            </OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="负责人">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.creator}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.update_time}}</OverflowTooltip>
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
    <Modify v-if="visibleModify" :visible="visibleModify" :row="row" type="api" @close="closeModify" @refresh="refresh"></Modify>
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
  apiListPageByCatalog
} from '@/api/asset/catalogue'
export default {
  name: 'apiList',
  mixins: [pager, listMixin],
  components: { OverflowTooltip, Modify, AddList },
  props: {
    catalogId: String
  },
  data () {
    return {
      loading: 0,
      searchForm: {
        api_name: ''
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
      const res = await this.$simpleAsyncTo(apiListPageByCatalog(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    addList () {
      this.visibleAdd = true
    },
    closeAdd () {
      this.visibleAdd = false
    },
    refreshAdd () {
      this.visibleAdd = false
      this.getTableList()
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
