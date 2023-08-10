<template>
  <div class="term-group">
    <div class="page-title">术语组</div>
    <el-card>
      <div class="searchBox mb-15">
        <el-input
          v-model="inputVal"
          prefix-icon="el-icon-search"
          @input="searchChange"
          clearable
          placeholder="请输入关键字搜索"
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="createdClick">新建术语组</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
        <el-table-column prop="desc" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column prop label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editClick(scope.row)"
              class="mr-10"
              title="编辑"
              icon="font-16 el-icon-edit-outline"
            ></el-button>
            <SimpleConfirm @confirm="delClick(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-20 pagerBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageFilters.pageNo"
          :page-sizes="pageSizes"
          :page-size="pageFilters.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <el-dialog
        :title="isCreated ? '创建术语组' : '修改'"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}"
      >
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="100px"
          label-suffix="："
          v-loading="dialogLoading"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="formData.desc" maxlength="64" show-word-limit></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('publicFieldsData')">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  listAll,
  getSelectName,
  saveTermGroup,
  delTermGroup,
  editTermGroup,
  listTermGroup
} from '@/api/asset/standup/standup.js'
import pager from '@/mixins/pager'
export default {
  name: 'TermGroup',
  mixins: [pager],
  data() {
    return {
      inputVal: '',
      tableData: [
        {
          name: 'test',
          desc: 'test'
        }
      ],
      rowData: {},
      tableLoading: false,
      dialogVisible: false,
      dialogLoading: false,
      isCreated: true,
      oldFormData: {},
      formData: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        desc: [{required: true, message: '请输入描述', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.listAll()
  },
  methods: {
    searchChange() {
      if (this.inputVal) {
        this.listTermGroup()
      } else {
        this.listAll()
      }
    },
    createdClick() {
      this.isCreated = true
      this.dialogVisible = true
      this.dialogLoading = false
      this.formData = {
        name: '',
        desc: ''
      }
      this.resetForm()
    },
    editClick(row) {
      const {name, desc} = row
      this.formData = {
        name,
        desc
      }
      this.oldFormData = {name, desc}
      this.isCreated = false
      this.dialogVisible = true
      this.dialogLoading = false
      this.resetForm()
    },
    delClick(row) {
      const {name, desc} = row
      this.rowData = {name, desc}
      this.delTermGroup()
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (this.isCreated) {
            this.saveTermGroup()
          } else {
            this.editTermGroup()
          }
        }
      })
    },
    resetForm() {
      this.$refs.form && this.$refs.form.resetFields()
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 查询全部数据
    async listAll() {
      const params = {
        data: JSON.stringify({num: '2'})
      }
      const res = await this.$simpleAsyncTo(listAll(params))
      if (res) {
        this.tableData = res.listAll
        this.total = res.listAll.length
      }
    },
    async getSelectName() {
      const params = {}
      const res = await this.$simpleAsyncTo(getSelectName(params))
      if (res) {
        console.log(res)
      }
    },
    async saveTermGroup() {
      const params = {
        data: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(saveTermGroup(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async delTermGroup() {
      const params = {
        data: JSON.stringify(this.rowData)
      }
      const res = await this.$simpleAsyncTo(delTermGroup(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async editTermGroup() {
      const params = {
        dataOld: JSON.stringify(this.oldFormData),
        dataNew: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(editTermGroup(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async listTermGroup() {
      const params = {
        data: this.inputVal
      }
      const res = await this.$simpleAsyncTo(listTermGroup(params))
      if (res.list) {
        this.tableData = res.list
        this.total = res.list.length
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.term-group {
  .searchBox {
    float: right;
    display: flex;
    & * {
      // flex: 1;
      margin: 0 4px;
    }
  }
}
</style>
