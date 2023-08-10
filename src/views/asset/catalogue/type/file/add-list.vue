<template>
  <el-dialog title="加入数据表" :visible.sync="visible" @close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="dialog-body" :style="{maxHeight: `${dialogBodyHeight}px`}">
      <p class="mb-10">请选择需要添加到该类目的文件</p>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.file_name" placeholder="搜索文件名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="join-table">
        <el-table :data="tableList" v-loading="!!loading" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="file_name" label="文件名">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.file_name}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="create_user" label="负责人">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.create_user}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="file_size" label="大小"></el-table-column>
          <el-table-column prop="file_desc" label="文件描述">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.file_desc}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="oper_time" label="更新时间">
            <template slot-scope="scope">
              <OverflowTooltip class="width">{{scope.row.oper_time}}</OverflowTooltip>
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
  fileListPageNoCatalog,
  fileBatchSaveByCatalog
} from '@/api/asset/catalogue'
export default {
  name: 'addFileList',
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
        file_name: ''
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
      const res = await this.$simpleAsyncTo(fileListPageNoCatalog(params), '获取数据失败')
      if (res) {
        this.tableList = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    async _saveCatalog() {
      this.loading++
      let params = {
        file_ids: this.multipleSelection.map(item => {
          return item.file_id
        }),
        catalog_id: this.catalogId
      }
      const res = await this.$simpleAsyncTo(fileBatchSaveByCatalog(params), '获取数据失败')
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

<style scoped lang="scss">
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
</style>
