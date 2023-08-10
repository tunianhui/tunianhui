
<template>
  <section class="trashlist">
    <ListHeader title="词根" class="mb-10" @addWordsRoot="addWordsRoot"></ListHeader>

    <div class="table-wrapper">
      <div class="table" v-resize="resizeDom">
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" :height="height" v-loading="loading">
          <el-table-column prop="name" label="词根名称">
          </el-table-column>
          <el-table-column prop="fullName" label="全称">
          </el-table-column>
          <el-table-column prop="abbr" label="缩写">
          </el-table-column>
          <el-table-column prop="desc" label="描述"></el-table-column>
          <el-table-column prop="lastModifierDisplayName" label="最近更新人"></el-table-column>
          <el-table-column prop="lastModifierUserId" label="最近更新时间" width="140"></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
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
    <WordsRootModal v-if="visible" @close="visible = false" :title="wordsRootModalTitle"></WordsRootModal>
  </section>
</template>

<script>
import ListHeader from './list-header.vue'
import pager from '@/mixins/pager'
import WordsRootModal from './modal.vue'
import {
  getWordrootList
} from '@/api/asset/root'
export default {
  name: 'Rule',
  components: {
    ListHeader,
    WordsRootModal
  },
  mixins: [pager],
  data () {
    return {
      form: {
      },
      loading: false,
      tableData: [],
      height: 0,
      wordsRootModalTitle: '',
      visible: false,
      total: 0
    }
  },
  created() {
    this._getWordrootList()
  },
  mounted () { },
  methods: {
    async _getWordrootList() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getWordrootList(), '获取数据失败')
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
      this.wordsRootModalTitle = '编辑词根'
      this.visible = true
    },
    // 新增
    addWordsRoot () {
      this.wordsRootModalTitle = '新增词根'
      this.visible = true
    },
    // 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该词根, 是否继续?', '提示', {
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

</style>
