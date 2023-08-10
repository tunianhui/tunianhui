<template>
  <div class="dimension">
    <div class="page-title">维度</div>
    <el-card>
      <div class="searchBox mb-15">
        <el-input
          v-model="inputVal"
          prefix-icon="el-icon-search"
          @input="searchChange"
          clearable
          placeholder="请输入关键字搜索"
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="createdClick">新建维度</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
        <el-table-column prop="field_name" show-overflow-tooltip label="字段名"></el-table-column>
        <el-table-column prop="group_name" show-overflow-tooltip label="所属组"></el-table-column>
        <el-table-column prop="data_type" show-overflow-tooltip label="数据类型"></el-table-column>
        <el-table-column prop="field_length" show-overflow-tooltip label="字段长度"></el-table-column>
        <el-table-column prop="max_value" show-overflow-tooltip label="最大值"></el-table-column>
        <el-table-column prop="min_value" show-overflow-tooltip label="最小值"></el-table-column>
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
        :title="isCreated ? '创建维度' : '修改'"
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
          <el-form-item label="字段名" prop="field_name">
            <el-input v-model="formData.field_name" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="所属组" prop="group_name">
            <el-select v-model="formData.group_name" @change="selectChange($event, 'group_name')">
              <el-option
                v-for="(item, index) in dictionary.group_name"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据类型" prop="data_type">
            <el-input v-model="formData.data_type" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="字段长度" prop="field_length">
            <el-input v-model="formData.field_length" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="最大值" prop="max_value">
            <el-input v-model="formData.max_value" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="最小值" prop="min_value">
            <el-input v-model="formData.min_value" maxlength="64" show-word-limit></el-input>
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
import {listAll, getSelectName, saveDim, delDim, editDim, listDim} from '@/api/asset/standup/standup.js'
import pager from '@/mixins/pager'
export default {
  name: 'Dimension',
  mixins: [pager],
  data() {
    return {
      inputVal: '',
      tableData: [],
      rowData: {},
      tableLoading: false,
      dialogVisible: false,
      dialogLoading: false,
      isCreated: true,
      oldFormData: {},
      formData: {
        name: '',
        field_name: '',
        group_name: '',
        data_type: '',
        field_length: '',
        max_value: '',
        min_value: '',
        desc: ''
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        field_name: [{required: true, message: '请输入字段名', trigger: 'blur'}],
        group_name: [{required: true, message: '请选择所属组', trigger: 'change'}],
        data_type: [{required: true, message: '请输入数据类型', trigger: 'blur'}],
        field_length: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入字段长度'))
              } else {
                if (/^\d+$/.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入数字'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        max_value: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入最大值'))
              } else {
                if (/^-?\d+$/.test(Number(value))) {
                  if (Number(this.formData.min_value) > Number(value)) {
                    callback(new Error('最大值不得小于最小值'))
                  } else {
                    callback()
                  }
                } else {
                  callback(new Error('请输入数字'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        min_value: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入最小值'))
              } else {
                if (/^-?\d+$/.test(Number(value))) {
                  if (Number(value) > Number(this.formData.max_value)) {
                    callback(new Error('最小值不得大于最大值'))
                  } else {
                    callback()
                  }
                } else {
                  callback(new Error('请输入数字'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        desc: [{required: true, message: '请输入描述', trigger: 'blur'}]
      },
      dictionary: {
        group_name: []
      }
    }
  },
  mounted() {
    this.listAll()
    this.getSelectName({num: '5'}).then(res => {
      this.dictionary.group_name = res
    })
  },
  methods: {
    searchChange() {
      if (this.inputVal) {
        this.listDim()
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
        field_name: '',
        group_name: '',
        data_type: '',
        field_length: '',
        max_value: '',
        min_value: '',
        desc: ''
      }
      this.resetForm()
    },
    editClick(row) {
      const {name, field_name, group_name, data_type, field_length, max_value, min_value, desc} = row
      const item1 =
        this.dictionary.group_name.length > 0 ? this.dictionary.group_name.find(item => item.name === group_name) : {}
      this.formData = {
        name,
        field_name,
        group_name: item1 ? item1.id : '',
        data_type,
        field_length,
        max_value,
        min_value,
        desc
      }
      this.oldFormData = {name, field_name, group_name, data_type, field_length, max_value, min_value, desc}
      this.isCreated = false
      this.dialogVisible = true
      this.dialogLoading = false
      this.resetForm()
    },
    delClick(row) {
      const {name, field_name, group_name, data_type, field_length, max_value, min_value, desc} = row
      this.rowData = {name, field_name, group_name, data_type, field_length, max_value, min_value, desc}
      this.delDim()
    },
    selectChange(val, flag) {
      if (flag === 'group_name') {
        this.formData.group_name = val
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          if (this.isCreated) {
            this.saveDim()
          } else {
            this.editDim()
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
        data: JSON.stringify({num: '6'})
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
    async saveDim() {
      const params = {
        data: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(saveDim(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async delDim() {
      const params = {
        data: JSON.stringify(this.rowData)
      }
      const res = await this.$simpleAsyncTo(delDim(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async editDim() {
      const params = {
        dataOld: JSON.stringify(this.oldFormData),
        dataNew: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(editDim(params))
      if (res.flag) {
        this.listAll()
      }
    },
    // 条件查询
    async listDim() {
      const params = {
        data: this.inputVal
      }
      const res = await this.$simpleAsyncTo(listDim(params))
      if (res.list) {
        this.tableData = res.list
        this.total = res.list.length
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dimension {
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
