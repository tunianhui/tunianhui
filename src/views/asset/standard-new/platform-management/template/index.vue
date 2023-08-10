
<template>
  <section class="template-wrapper">
    <ListHeader title="审批模板" class="mb-10" @clickAdd="addTemplate"></ListHeader>

    <div class="table-wrapper">
      <div class="table" v-resize="resizeDom">
        <el-table ref="multipleTable" :data="tableData" :height="height" style="width: 100%">
          <el-table-column label="模板名称">
            <template slot-scope="scope">
              <span>{{scope.row.basicInfo.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <span>{{scope.row.basicInfo.description}}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用场景">
            <template slot-scope="scope">
              <span>{{scope.row.basicInfo.scenarios | filterScenarios}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalNodeSize" label="审批节点数"></el-table-column>
          <el-table-column label="引用情况">
            <template>
              <span style="color: rgba(0,0,0,0.45)">无引用</span>
            </template>
          </el-table-column>
          <el-table-column label="最近更新人">
            <template slot-scope="scope">
              <span>{{scope.row.basicInfo.lastModifier.displayName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="最近更新时间">
            <template slot-scope="scope">
              <span>{{scope.row.basicInfo.lastModifyTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button type="text"><i class="iconfont icon-biaodanliebiao font-14 color-btn" @click="handleView(scope.row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDelete(scope.row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot">
        <el-pagination layout="prev, pager, next, sizes" :pager-count="5" :page-sizes="[10, 20, 30, 40]" :total="total">
        </el-pagination>
      </div>
    </div>
    <AddEditViewModal v-if="visible" :title="modalTitle" @close="visible = false" :viewType="viewType"></AddEditViewModal>
  </section>
</template>

<script>
import ListHeader from './list-header.vue'
import pager from '@/mixins/pager'
import AddEditViewModal from './modal'
import {
  getApprovaltemplateListFuzzySearch
} from '@/api/asset/platform-managemen.js'
import Template from '../../../../plan/work-order/template.vue'
export default {
  name: 'template',
  components: {
    ListHeader,
    AddEditViewModal,
    Template
  },
  mixins: [pager],
  filters: {
    filterScenarios (val) {
      const scenarios = {
        'STANDARD_APPROVAL': '数据标准审批'
      }
      const data = val.map(item => {
        return scenarios[item]
      })
      return data.join('、')
    }
  },
  data () {
    return {
      form: {
      },
      loading: false,
      tableData: [],
      height: 0,
      modalTitle: '',
      visible: false,
      viewType: 'add',
      total: 0
    }
  },
  created() {
    this._getApprovaltemplateListFuzzySearch()
  },
  mounted () { },
  methods: {
    async _getApprovaltemplateListFuzzySearch() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getApprovaltemplateListFuzzySearch(), '获取数据失败')
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading = false
    },
    resizeDom (data) {
      this.height = parseInt(data.height)
    },
    handleClick (val) { },
    searchChange (val) { },
    // 编辑
    handleEdit (item) {
      this.modalTitle = '编辑审批模板'
      this.visible = true
      this.viewType = 'edit'
    },
    // 新增
    addTemplate() {
      this.modalTitle = '新增审批模板'
      this.visible = true
      this.viewType = 'add'
    },
    // 查看
    handleView(item) {
      this.modalTitle = '查看审批模板'
      this.visible = true
      this.viewType = 'view'
    },
    // 删除
    handleDelete() {
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.template-wrapper {
  position: relative;
  height: 100%;
  .table-wrapper {
    height: calc(100% - 40px);
    position: relative;
    flex: 1;
    padding: 10px;
    background: #fff;
    .table {
      height: calc(100% - 40px);
    }
    .foot {
      height: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 15px;
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .input-value {
    width: 200px;
  }
}

</style>
