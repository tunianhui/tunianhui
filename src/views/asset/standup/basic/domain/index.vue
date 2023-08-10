<template>
  <div class="domain">
    <div class="page-title">业务域</div>
    <el-card>
      <div class="searchBox mb-15">
        <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键字搜索"></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="createdClick">新建业务域</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
        <el-table-column prop="level" show-overflow-tooltip label="级别"></el-table-column>
        <el-table-column prop="desc" show-overflow-tooltip label="描述"></el-table-column>
        <el-table-column prop label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)" class="mr-10" title="编辑" icon="font-16 el-icon-edit-outline"></el-button>
            <SimpleConfirm @confirm="delClick(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-20 pagerBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageFilters.pageNo" :page-sizes="pageSizes" :page-size="pageFilters.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>

      <el-dialog :title="isCreated ? '创建业务域' : '修改'" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
        <el-form ref="form" :model="formData" :rules="rules" label-width="100px" label-suffix="：" v-loading="dialogLoading">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-input v-model="formData.level" maxlength="64" show-word-limit></el-input>
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
  saveBusinessDomain,
  delBusinessDomain,
  editBusinessDomain,
  listBusinessDomain
} from '@/api/asset/standup/standup.js'
import pager from '@/mixins/pager'
export default {
  name: 'Domain',
  mixins: [pager],
  data () {
    return {
      inputVal: '',
      tableData: [
        {
          name: 'test',
          level: 'test',
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
        level: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        level: [{ required: true, message: '请输入级别', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.listAll()
  },
  methods: {
    searchChange () {
      if (this.inputVal) {
        this.listBusinessDomain()
      } else {
        this.listAll()
      }
    },
    createdClick () {
      this.isCreated = true
      this.dialogVisible = true
      this.dialogLoading = false
      this.formData = { name: '', level: '', desc: '' }
      this.resetForm()
    },
    editClick (row) {
      const { name, level, desc } = row
      this.formData = {
        name,
        level,
        desc
      }
      this.oldFormData = { name, level, desc }
      this.isCreated = false
      this.dialogVisible = true
      this.dialogLoading = false
      this.resetForm()
    },
    delClick (row) {
      const { name, level, desc } = row
      this.rowData = { name, level, desc }
      this.delBusinessDomain()
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          if (this.isCreated) {
            this.saveBusinessDomain()
          } else {
            this.editBusinessDomain()
          }
        }
      })
    },
    resetForm () {
      this.$refs.form && this.$refs.form.resetFields()
    },
    handleClose () {
      this.dialogVisible = false
    },
    // 查询全部数据
    async listAll () {
      const params = {
        data: JSON.stringify({ num: '1' })
      }
      const res = await this.$simpleAsyncTo(listAll(params))
      if (res) {
        this.tableData = res.listAll
        this.total = res.listAll.length
      }
    },
    async getSelectName () {
      const params = {}
      const res = await this.$simpleAsyncTo(getSelectName(params))
      if (res) {
        console.log(res)
      }
    },
    async saveBusinessDomain () {
      const params = {
        data: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(saveBusinessDomain(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async delBusinessDomain () {
      const params = {
        data: JSON.stringify(this.rowData)
      }
      const res = await this.$simpleAsyncTo(delBusinessDomain(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async editBusinessDomain () {
      const params = {
        dataOld: JSON.stringify(this.oldFormData),
        dataNew: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(editBusinessDomain(params))
      if (res.flag) {
        this.listAll()
      }
    },
    // 条件查询
    async listBusinessDomain () {
      const params = {
        data: this.inputVal
      }
      const res = await this.$simpleAsyncTo(listBusinessDomain(params))
      if (res.list) {
        this.tableData = res.list
        this.total = res.list.length
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.domain {
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
