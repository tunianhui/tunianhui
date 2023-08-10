<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-07-20 10:13:03
 * @LastEditTime: 2022-11-02 17:01:43
-->
<template>
  <div class='file-manage'>
    <div class="upload-box">
      <el-button type="primary" class="action-btn" @click="uploadHandle">上传文件</el-button>
    </div>
    <section class="head" ref="head">
      <div class="head-title font-18">文件管理</div>
    </section>
    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="搜索文件名" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="file_name" label="文件名">
        <template slot-scope="scope">
          <OverflowTooltip class="width">
            <div class="file-name">
              <!-- <el-tag v-if="scope.row.down === '1'" type="success" size="mini">已上线</el-tag>
              <el-tag v-if="scope.row.down === '0'" type="info" size="mini">未上线</el-tag> -->
              <el-button type="text" class="ml-5" @click="_seeHandle(scope.row)">{{scope.row.file_name}}</el-button>
            </div>
          </OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="create_user" label="负责人">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.create_user}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="file_size" label="大小"></el-table-column>
      <el-table-column prop="oper_time" label="更新时间">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.oper_time}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="_editHandle(scope.row)"></i></el-button>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="下线" placement="top">
            <el-button type="text"><i class="el-icon-warning-outline font-16 color-btn" title="下线" @click="_offlineHandle(scope.row)"></i></el-button>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="下载" placement="top">
            <el-button type="text"><i class="el-icon-download font-16 color-btn" title="下载" @click="_downHandle(scope.row)"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="_delHandle(scope.row, 'file')"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    <Dialog :visible="visible" :title="title" :data="curData" @close="close" :textTitle="textTitle" :textDes="textDes" @myConfirm="refreshData">
    </Dialog>
    <Edit :visible="visibleEdit" :row="row" @close="closeEdit" :categoryList="categoryList" @refresh="refresh"></Edit>
    <UploadFile v-if="uploadDialogVisible" :visible="uploadDialogVisible" @cancelBtn="cancelBtn" @confirmBtn="confirmBtn"></UploadFile>
  </div>
</template>

<script>
import mixin from '../mixin'
import pager from '@/mixins/pager'
import Edit from './edit'
import UploadFile from './uploadFile'
import {
  getFileList,
  deleteFile
} from '@/api/asset/catalogue'
export default {
  name: 'CatalogueApiManage',
  props: {},
  mixins: [mixin, pager],
  components: {
    Edit,
    UploadFile
  },
  data () {
    return {
      tableData: [],
      fixed: false,
      loading: 0,
      fileStatusList: [],
      filterData: [],
      uploadDialogVisible: false
    }
  },
  async created () {
    await this._getCategoryList()
    this.filterData = [
      {
        label: '所属类目',
        id: '所属类目',
        options: this.categoryList
      }
    ]
    this.getTableList()
  },
  methods: {
    async getTableList (curFilter = [], keyword = '') {
      this.loading++
      const params = {
        file_name: keyword,
        catalog_id: '',
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '所属类目':
            params.catalog_id = e.value
            break
        }
      })
      // await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getFileList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    uploadHandle () {
      this.uploadDialogVisible = true
    },
    confirmBtn () {
      this.uploadDialogVisible = false
      this.getTableList()
    },
    cancelBtn () {
      this.uploadDialogVisible = false
    },
    _downHandle (row) {
      window.location.href = window.location.origin + '/fileManagement/downFile?file_id=' + row.file_id
    },
    _delHandle (row) {
      this.visible = true
      this.title = '删除记录'
      this.curData = row
      this.textTitle = '是否确认删除该数据？'
      this.textDes = ''
    },
    refreshData () {
      this._deleteFile()
    },
    async _deleteFile () {
      const params = {
        file_id: this.curData.file_id
      }
      const res = await this.$simpleAsyncTo(deleteFile(params), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功',
          showClose: true
        })
        this.close()
      }
    }
  }
}
</script>

<style lang="scss">
.file-manage {
  height: 100%;
  position: relative;
  overflow-y: overlay;
  .head {
    padding-top: 10px;
    padding-bottom: 8px;
  }
  .upload-box {
    position: absolute;
    right: 30px;
    top: 67px;
    .el-button {
      border-radius: 0;
      background-color: $grey10;
      color: $--color-primary;
      border-color: $--color-primary;
    }
    .action-btn.el-button--primary {
      background-color: $--color-primary;
      border-color: $--color-primary;
      color: $grey10;
      &:hover {
        background-color: rgba($--color-primary, 0.8);
        border-color: rgba($--color-primary, 0.8);
      }
    }
  }
}

</style>
