<template>
  <section class="api-server">
    <header class="flex-layout mb-20">
      <span>API服务</span>
    </header>
    <div class="api-server-content">
      <div class="server-search mb-20">
        <el-form :inline="true" :model="formSearchApi" class="demo-form-inline">
          <el-form-item>
            <div slot="label">
              <span>请选API分组</span>
            </div>
            <el-select v-model="formSearchApi.servunit_group_id" placeholder="请选择分组" @change="selectGroupChange" clearable>
              <el-option :label="item.group_name" :value="item.id" v-for="item in apiGroupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="api-name ml-20">
            <el-input v-model="formSearchApi.api_name" placeholder="请输入API名称关键字" @input="apiNameChange">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" v-loading="!!loading" style="width: 100%">
        <el-table-column prop="api_name" label="API名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="servunit_group_name" label="API分组" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="api_remark" label="API描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="app_num" show-overflow-tooltip>
          <template slot="header">
            <span>服务情况</span>
          </template>
          <template slot-scope="scope">
            应用数：{{scope.row.app_num}}
          </template>
        </el-table-column>
        <el-table-column prop="publish_info" label="发布信息">
          <template slot-scope="scope">
            <div>
              <OverflowTooltip class="width">负责人：{{scope.row.publish_person}}</OverflowTooltip>
              <OverflowTooltip class="width">发布时间：{{scope.row.publish_time}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="document" label="文档说明" width="120">
          <template slot-scope="scope">
            <el-button @click="apiDocumentCheck(scope.row)" type="text" size="small">API文档</el-button>
          </template>
        </el-table-column>
        <el-table-column label="申请状态">
          <template slot-scope="scope">
            <el-button @click="apiApplyHandle(scope.row)" type="text" size="small">立即申请</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="fr pt-10" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
    <ApiDocument v-if="visible" :id="id" @close="close"></ApiDocument>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import {
  getApimarketList,
  getApiGroup
} from '@/api/server/server.js'
import pager from '@/mixins/pager'
import { mapGetters } from 'vuex'
import ApiDocument from './api-document'
export default {
  name: 'APIServe',
  mixins: [pager],
  components: {
    ApiDocument,
    OverflowTooltip
  },
  data () {
    return {
      loading: 0,
      formSearchApi: {
        servunit_group_id: '',
        api_name: ''
      },
      tableData: [],
      apiGroupList: [],
      visible: false,
      id: ''
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created () {
    this.getTableList()
    this.getGroupList()
  },
  methods: {
    async getTableList () {
      this.loading++
      const params = {
        servunit_group_id: this.formSearchApi.servunit_group_id,
        api_name: this.formSearchApi.api_name,
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      const res = await this.$simpleAsyncTo(getApimarketList(params), '获取列表失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    async getGroupList () {
      let params = {
        id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getApiGroup(params), '获取分组列表失败')
      if (res) {
        this.apiGroupList = res.data
      }
    },
    selectGroupChange (val) {
      this.formSearchApi.servunit_group_id = val
      this.pageFilters.pageNo = 1
      this.getTableList()
    },
    apiNameChange (val) {
      this.formSearchApi.api_name = val
      this.pageFilters.pageNo = 1
      this.getTableList()
    },
    apiDocumentCheck (row) {
      this.visible = true
      this.id = row.id
    },
    apiApplyHandle (row) {
      this.$router.push({ name: 'api-grant', params: row })
    },
    close () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.api-server {
  header {
    justify-content: space-between;
  }
  $height: calc(100% - 150px);
  .api-server-content {
    .server-search {
      height: 70px;
      background: $grey8;
      display: flex;
      align-items: center;
      padding: 0 20px;
      .el-form-item--mini.el-form-item {
        margin-bottom: 0;
      }
      .api-name {
        margin-left: 50px;
        .el-input__inner {
          background: $grey8;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid $grey7;
          width: 120%;
        }
      }
    }
  }
  .width {
    width: calc(100% - 10px);
  }
}
</style>
