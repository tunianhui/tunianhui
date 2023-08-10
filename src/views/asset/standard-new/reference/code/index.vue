
<template>
  <section class="trashlist">
    <ListHeader title="码表" class="mb-10" @addCodeTable="addCodeTable"></ListHeader>
    <div class="table-wrapper">
      <div class="table" v-resize="resizeDom">
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" :height="height">
          <el-table-column prop="field1" label="码表">
            <template slot-scope="{row}">
              <div class="flex-layout">
                <div class="icon-wrapper">
                  <i class="iconfont icon-luojibiao1 icon"></i>
                </div>
                <div class="name">
                  <div style="color: rgba(44, 116, 255, 1)">{{row.name}}</div>
                  <div style="color: rgba(0,0,0,0.65)">{{row.code}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template>
              <i :class=" true ? 'el-icon-success':'el-icon-close' "></i>
              <span class="ml-5">已发布</span>
            </template>
          </el-table-column>
          <el-table-column prop="valuesCount" label="码值数" width="60">
          </el-table-column>
          <el-table-column prop="ownerDisplayName" label="负责人"></el-table-column>
          <el-table-column label="最近更新人/时间" width="160">
            <template slot-scope="{row}">
              <div>{{row.lastModifierDisplayName}}</div>
              <div>{{row.gmtModified}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="描述"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-tooltip content="查看详情" placement="top">
                <el-button size="mini" type="text" @click="viewInfo">
                  <i class="iconfont icon-shujutancha font-14 color-btn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="查看引用" placement="top">
                <el-button size="mini" type="text" @click="viewQuote">
                  <i class="iconfont icon-yuanbiao-xianxing font-14 color-btn"></i>
                </el-button>
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
    <CodeTableModal v-if="visible" @close="visible = false" :title="codeTableModalTitle" :viewType="viewType"></CodeTableModal>
    <DrawerCodeTable v-if="drawerVisible" @closeDrawer="drawerVisible = false"></DrawerCodeTable>
  </section>
</template>

<script>
import ListHeader from './list-header.vue'
import pager from '@/mixins/pager'
import CodeTableModal from './modal'
import DrawerCodeTable from './drawer'
import {
  getLookuptableList
} from '@/api/asset/reference-code.js'
export default {
  name: 'Rule',
  components: {
    ListHeader,
    CodeTableModal,
    DrawerCodeTable
  },
  mixins: [pager],
  data () {
    return {
      form: {
      },
      loading: false,
      tableData: [],
      height: 0,
      codeTableModalTitle: '',
      visible: false,
      viewType: '',
      drawerVisible: false,
      total: 0
    }
  },
  created() {
    this._getLookuptableList()
  },
  mounted () { },
  methods: {
    async _getLookuptableList() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getLookuptableList(), '获取数据失败')
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
      this.codeTableModalTitle = '编辑自定义码表'
      this.visible = true
      this.viewType = 'edit'
    },
    // 新增
    addCodeTable() {
      this.codeTableModalTitle = '新增自定义码表'
      this.visible = true
      this.viewType = 'add'
    },
    // 查看详情
    viewInfo() {
      this.codeTableModalTitle = '查看自定义码表'
      this.visible = true
      this.viewType = 'view'
    },
    // 删除
    handleDelete (item) {
      this.$confirm('此操作将永久删除该自定义码表, 是否继续?', '提示', {
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
    },
    // 查看引用
    viewQuote(item) {
      this.drawerVisible = true
    }
  }
}
</script>

<style lang="scss">
.trashlist {
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
.icon-wrapper {
  display: flex;
  align-items: center;
  .icon {
    font-size: 20px;
    color: #2e74fe;
  }
}
.name {
  width: calc(100% - 20px);
  margin-left: 10px;
  div {
    line-height: 14px;
  }
}

</style>
