<template>
  <div class="condition">
    <div class="page-title">约束条件</div>
    <el-card>
      <div class="searchBox mb-15">
        <el-input
          v-model="inputVal"
          prefix-icon="el-icon-search"
          @input="searchChange"
          clearable
          placeholder="请输入关键字搜索"
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="createdClick">新建约束条件</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
        <el-table-column prop="business_domain_ID" show-overflow-tooltip label="业务域"></el-table-column>
        <el-table-column prop="source_table" show-overflow-tooltip label="来源表"></el-table-column>
        <el-table-column prop="algorithm" show-overflow-tooltip label="算法"></el-table-column>
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
        :title="isCreated ? '创建约束条件' : '修改'"
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
          <el-form-item label="业务域" prop="business_domain_ID">
            <el-select v-model="formData.business_domain_ID" @change="selectChange($event, 'business_domain_ID')">
              <el-option
                v-for="(item, index) in dictionary.business_domain_ID"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源表" prop="source_table">
            <el-input v-model="formData.source_table" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="算法" prop="algorithm">
            <el-input v-model="formData.algorithm" maxlength="64" show-word-limit></el-input>
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
  saveCondition,
  delCondition,
  editCondition,
  listCondition
} from '@/api/asset/standup/standup.js'
import pager from '@/mixins/pager'
export default {
  name: 'Conditon',
  mixins: [pager],
  data() {
    return {
      inputVal: '',
      tableData: [
        {
          name: 'test',
          business_domain_ID: 'test',
          source_table: 'test',
          algorithm: 'test',
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
        business_domain_ID: '',
        source_table: '',
        algorithm: '',
        desc: ''
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        business_domain_ID: [{required: true, message: '请选择业务域', trigger: 'change'}],
        source_table: [{required: true, message: '请输入来源表', trigger: 'blur'}],
        algorithm: [{required: true, message: '请输入算法', trigger: 'blur'}],
        desc: [{required: true, message: '请输入描述', trigger: 'blur'}]
      },
      dictionary: {
        business_domain_ID: []
      }
    }
  },
  mounted() {
    this.listAll()
    this.getSelectName({num: '1'}).then(res => {
      this.dictionary.business_domain_ID = res
    })
  },
  methods: {
    searchChange() {
      if (this.inputVal) {
        this.listCondition()
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
        business_domain_ID: '',
        source_table: '',
        algorithm: '',
        desc: ''
      }
      this.resetForm()
    },
    editClick(row) {
      const {name, business_domain_ID, source_table, algorithm, desc} = row
      const item1 =
        this.dictionary.business_domain_ID.length > 0 ? this.dictionary.business_domain_ID.find(item => item.name === business_domain_ID) : {}
      this.formData = {
        name,
        business_domain_ID: item1 ? item1.id : '',
        source_table,
        algorithm,
        desc
      }
      this.oldFormData = {name, business_domain_ID, source_table, algorithm, desc}
      this.isCreated = false
      this.dialogVisible = true
      this.dialogLoading = false
      this.resetForm()
    },
    delClick(row) {
      const {name, business_domain_ID, source_table, algorithm, desc} = row
      this.rowData = {name, business_domain_ID, source_table, algorithm, desc}
      this.delCondition()
    },
    selectChange(val, flag) {
      if (flag === 'business_domain_ID') {
        this.formData.business_domain_ID = val
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          if (this.isCreated) {
            this.saveCondition()
          } else {
            this.editCondition()
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
        data: JSON.stringify({num: '8'})
      }
      const res = await this.$simpleAsyncTo(listAll(params))
      if (res) {
        this.tableData = res.listAll
        this.total = res.listAll.length
      }
    },
    async getSelectName(data) {
      const params = {
        data: JSON.stringify(data)
      }
      const res = await this.$simpleAsyncTo(getSelectName(params))
      if (res.list) {
        return res.list
      } else {
        return []
      }
    },
    async saveCondition() {
      const params = {
        data: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(saveCondition(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async delCondition() {
      const params = {
        data: JSON.stringify(this.rowData)
      }
      const res = await this.$simpleAsyncTo(delCondition(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async editCondition() {
      const params = {
        dataOld: JSON.stringify(this.oldFormData),
        dataNew: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(editCondition(params))
      if (res.flag) {
        this.listAll()
      }
    },
    // 条件查询
    async listCondition() {
      const params = {
        data: this.inputVal
      }
      const res = await this.$simpleAsyncTo(listCondition(params))
      if (res.list) {
        this.tableData = res.list
        this.total = res.list.length
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.condition {
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
