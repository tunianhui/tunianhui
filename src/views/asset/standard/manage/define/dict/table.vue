<template>
  <div class="dict-table pb-40" v-loading="!!loading">
    <div class="pr-10 pl-10">
      <Head
        ref="head"
        title="数据字典列表"
        style="padding-top: 0"
        actionText="新建数据字典"
        @refesh="refeshHandle"
        @action="addCriterion">
      </Head>
      <FilterFieldCard
      :filterData="factoryFilterData" @confirm="confirm" ref="filterFieldCard"></FilterFieldCard>
      <el-table
        ref="multipleTable"
        :data="tableData"
        class="category-table-list"
        @selection-change="manualHandleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
        ></el-table-column>
        <el-table-column label="名称" width="200px" prop="range_name">
        </el-table-column>
        <el-table-column
          prop="range_code"
          label="编码"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="range_alias"
          label="别名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="catalog_name"
          label="所属分类"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="range_desc"
          label="描述信息"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="150px" align="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              title="查看变更日志"
              class="el-icon-tickets font-16"
              @click="viewLogHandle(scope.row)"
            ></el-button>
            <el-button
              type="text"
              title="编辑"
              class="el-icon-edit-outline font-16"
              @click="editHandle(scope.row)"
            ></el-button>
            <el-button
              type="text"
              title="删除"
              class="icon el-icon-delete font-16"
              @click="delHaandle(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="my-filter-select">
      <div>
        <el-checkbox v-model="allChecked" @change="changeHandle">全选</el-checkbox>
        <el-button
          type="text"
          icon="el-icon-delete"
          class="ml-20"
          @click="batchDel"
          :disabled="disabled"
          >批量删除</el-button>
        <el-button
          type="text"
          icon="el-icon-download"
          class="ml-20"
          @click="batchExport('dict')"
          :disabled="disabled"
          >批量导出</el-button>
        <el-button type="text" icon="el-icon-upload2" class="ml-20" :disabled="disabled" @click="batchUpdate">批量导入</el-button>
      </div>
      <div>已选中<a href="javascript:;">{{curLength}}</a>个</div>
    </div>
    <el-dialog title="上传文件" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelBtn" width="500px">
      <div class="mb-10 upload-file">
        <el-upload
          drag
          :action="uploadUrl"
          ref="upload"
          required
          :auto-upload="false"
          :file-list="fileList"
          :on-change="change"
          :onSuccess="uploadSuccess"
          :onError="uploadError"
          accept="xlsx,xls"
          style="width:100%"
          class="standard-upload"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="width:100%">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div style="text-align:end" class="mt-15">
          <a :href="downloadUrl" download>下载模板</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">导 入</el-button>
      </span>
    </el-dialog>
    <el-dialog title="数据字典变更记录" :visible.sync="visibleDic" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelBtn1" width="650px">
      <el-form
        ref="form"
        label-width="65px"
        label-position="left"
        label-suffix="："
      >
        <el-form-item label="编码" prop="range_code" style="margin-bottom:5px">
          编码
        </el-form-item>
        <el-form-item label="名称" prop="range_code" style="margin-bottom:5px">
          名称
        </el-form-item>
      </el-form>
      <p class="mb-10" style="color:#00A2E8;font-weight:600">变更明细</p>
      <el-table
        ref="multipleTable"
        :data="tableData"
        class="mb-20"
        :max-height="300"
      >
        <el-table-column label="值编码" prop="range_name"></el-table-column>
        <el-table-column label="值名称" prop="range_name"></el-table-column>
        <el-table-column label="值描述" prop="range_name"></el-table-column>
        <el-table-column label="变更时间" prop="range_name"></el-table-column>
        <el-table-column label="变更操作" prop="range_name"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import StandardTable from '@/mixins/standard-table'
import {
  getDictListPage,
  deleteDict,
  batchDeleteDict
} from '@/api/asset/standard/dict.js'
import {getAllCatalog} from '@/api/asset/standard/category.js'
import config from '@/config'
export default {
  name: 'DictTable',
  mixins: [StandardTable],
  data() {
    return {
      metaDataField: [],
      delFetch: deleteDict,
      paramsKey: 'range_id',
      batchDelFetch: batchDeleteDict,
      downloadUrl: `${config.baseurl}/dataDictionary/downTemplate`,
      uploadUrl: `${config.baseurl}/dataDictionary/importFile`,
      visibleDic: false
    }
  },
  async created() {
    this.$root.eventEmitter.on('refreshTable', type => {
      this.getTableList()
    })
    this.loading++
    await this._getMetaDataField()
    this.factoryFilterData = [
      {
        label: '类目',
        id: '类目',
        options: this.metaDataField
      }
    ]
    await this.getTableList()
    this.loading--
  },
  beforeRouteLeave(to, from, next) {
    // 销毁监听的事件
    this.$root.eventEmitter.off('refreshTable')
    next()
  },
  methods: {
    addCriterion() {
      this.setActiveRdEditDialog({
        title: '新建数据字典',
        component: 'DictEditDialig',
        data: {}
      })
    },
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      const params = {
        pageSize: 9999,
        pageNo: 1,
        range_name: keyword,
        catalog_id: ''
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '类目':
            params.catalog_id = e.value
            break
        }
      })
      const res = await this.$simpleAsyncTo(getDictListPage(params), '获取列表失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    // 获取类目
    async _getMetaDataField() {
      const res = await this.$simpleAsyncTo(getAllCatalog({parent_id: '', level: '', type: 3}), '获取数据域失败')
      if (res) {
        this.metaDataField = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    editHandle(row) {
      this.setActiveRdEditDialog({
        title: '编辑数据字典',
        component: 'DictEditDialig',
        data: row
      })
    },
    viewLogHandle() {
      this.visibleDic = true
    },
    cancelBtn1() {
      this.visibleDic = false
    }
  }
}
</script>

<style lang="scss">
.dict-table {
  .my-filter-select {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    line-height: 40px;
    background-color: $grey10;
    width: calc(100% - 280px);
    z-index: 9;
    padding: 0 50px 0 20px;
    box-sizing: border-box;
    >div:last-child {
      font-size: 14px;
    }
  }
  .category-table-list {
    .el-table__header-wrapper {
      .el-table__header {
        .has-gutter{
          tr {
            th:first-child {
              .cell {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
.standard-upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
