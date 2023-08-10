<template>
  <el-dialog title="加入数据表" :visible.sync="visible" @close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="dialog-body" :style="{maxHeight: `${dialogBodyHeight}px`}">
      <p class="mb-10">请选择需要添加到该类目的API</p>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.api_name" placeholder="搜索API名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="join-table">
        <el-table :data="tableList" v-loading="!!loading" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
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
        </el-table>
      </div>
      <div class="clearfix">
        <el-pagination
          class="fr pt-10 pb-10"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pageFilters.pageSize"
          :page-sizes="pageSizes"
          :current-page.sync="pageFilters.pageNo"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 认</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import pager from '@/mixins/pager'
import dialogHeight from '@/mixins/dialog-height'
import OverflowTooltip from '@c/overflow-tooltip'
import {
  apiListPageNoCatalog,
  apiBatchSaveByCatalog
} from '@/api/asset/catalogue'
export default {
  name: 'addApiList',
  props: {
    visible: Boolean,
    catalogId: String
  },
  mixins: [pager, dialogHeight],
  components: {OverflowTooltip},
  data() {
    return {
      loading: 0,
      searchForm: {
        api_name: ''
      },
      tableList: [],
      multipleSelection: []
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getTableList()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this._saveCatalog()
    },
    searchBtn() {
      this.getTableList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getTableList() {
      this.loading++
      let params = {
        ...this.searchForm,
        catalog_id: this.catalogId,
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      const res = await this.$simpleAsyncTo(apiListPageNoCatalog(params), '获取数据失败')
      if (res) {
        this.tableList = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    async _saveCatalog() {
      this.loading++
      let params = {
        api_ids: this.multipleSelection.map(item => {
          return item.api_id
        }),
        catalog_id: this.catalogId
      }
      const res = await this.$simpleAsyncTo(apiBatchSaveByCatalog(params), '获取数据失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改类目成功'
        })
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
.dialog-body {
  overflow: auto;
}
</style>
