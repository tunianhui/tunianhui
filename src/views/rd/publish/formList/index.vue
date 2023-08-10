<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-05-05 14:33:48
 * @Description: 表单列表
-->
<template>
  <section class="form-list">
    <div class="space-between mb-10">
      <div class="page-title">表单设计</div>
      <div>
        <div class="flex">
          <el-input v-model="formName"
                    prefix-icon="el-icon-search"
                    @input="searchChange"
                    clearable
                    placeholder="请输入表单名称"
                    class="mr-10"></el-input>
          <el-button type="primary"
                     icon="el-icon-plus"
                     @click="handleAdd">添加数据源</el-button>
        </div>
      </div>
    </div>

    <el-card>
      <el-table :data="tableData"
                style="width: 100%"
                v-loading="!!loading">
        <el-table-column prop="formName"
                         label="表单名称"
                         min-width="200">
        </el-table-column>
        <el-table-column prop="field2"
                         label="创建人">
        </el-table-column>
        <el-table-column prop="field3"
                         label="创建时间"></el-table-column>
        <el-table-column prop="field4"
                         label="内容"
                         min-width="80"></el-table-column>
        <el-table-column label="操作"
                         width="80">
          <template slot-scope="{row}">
            <el-tooltip class="item"
                        effect="dark"
                        content="编辑"
                        placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn"
                   @click="handleEdit(row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="删除"
                        placement="top">
              <el-button type="text"><i class="el-icon-delete font-14 color-btn"
                   @click="handleDel(row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10"
                   background
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-size="pageFilters.pageSize"
                   :page-sizes="pageSizes"
                   :current-page.sync="pageFilters.pageNo"
                   layout="total, prev, pager, next"
                   :total="total"></el-pagination>
  </section>
</template>

<script>
import {
  getFormList,
  delForm
} from '@/api/rd/publish/form.js'
import pager from '@/mixins/pager'
export default {
  name: 'ItemManageMetadata',
  components: {},
  mixins: [pager],
  data () {
    return {
      formName: '',
      loading: 0,
      total: 0,
      tableData: [
        {
          formName: '物理权限表',
          field2: 'test001',
          field3: '2022-05-05',
          field4: '数据源'
        }
      ]
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 新增表单
    handleAdd () {
      this.$router.push({ path: '/rd/publish/form' })
    },

    // 编辑
    handleEdit (item) {
      sessionStorage.setItem(item.id, item.formJson)
      this.$router.push({ path: '/rd/publish/form', query: { id: item.id, formName: item.formName } })
    },

    handleDel (item) {
      this.$confirm('此操作将永久删除该表单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(item)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async delItem (item) {
      const res = await this.$simpleAsyncTo(delForm({ id: item.id }))
      if (res.flag) {
        this.$message({
          message: '删除成功',
          type: 'warning'
        })
      }
    },

    // 筛选
    searchChange (val) {
      this.formName = val
      this.getList()
    },

    // 获取表单列表
    async getList () {
      const res = await this.$simpleAsyncTo(getFormList())
      if (res.flag) {
        this.tableData = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
