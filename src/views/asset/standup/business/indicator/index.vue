<template>
  <div class="indicator">
    <div class="page-title">指标</div>
    <el-card>
      <div class="searchBox mb-15">
        <el-input
          v-model="inputVal"
          prefix-icon="el-icon-search"
          @input="searchChange"
          clearable
          placeholder="请输入关键字搜索"
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="createdClick">新建指标</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
        <el-table-column prop="field_name" show-overflow-tooltip label="字段名称"></el-table-column>
        <el-table-column prop="business_domain_ID" show-overflow-tooltip label="业务域"></el-table-column>
        <el-table-column prop="index_type" show-overflow-tooltip label="指标类型"></el-table-column>
        <el-table-column prop="function" show-overflow-tooltip label="统计函数"></el-table-column>
        <el-table-column prop="if_constraint" show-overflow-tooltip label="是否需要约束条件"></el-table-column>
        <el-table-column prop="constraint_content" show-overflow-tooltip label="约束条件"></el-table-column>
        <el-table-column prop="data_source" show-overflow-tooltip label="数据源"></el-table-column>
        <el-table-column prop="unit_id" show-overflow-tooltip label="单位"></el-table-column>
        <el-table-column prop="data_type" show-overflow-tooltip label="数据类型"></el-table-column>
        <el-table-column prop="float_length" show-overflow-tooltip label="浮点位数"></el-table-column>
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
        :title="isCreated ? '创建指标' : '修改'"
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
          label-width="150px"
          label-suffix="："
          v-loading="dialogLoading"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="字段名称" prop="field_name">
            <el-input v-model="formData.field_name" maxlength="64" show-word-limit></el-input>
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
          <el-form-item label="指标类型" prop="index_type">
            <el-input v-model="formData.index_type" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="统计函数" prop="function">
            <el-input v-model="formData.function" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="是否需要约束条件" prop="if_constraint">
            <el-select v-model="formData.if_constraint" @change="selectChange($event, 'if_constraint')">
              <el-option
                v-for="(item, index) in dictionary.if_constraint"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="约束条件" prop="constraint_content">
            <el-select
              v-model="formData.constraint_content"
              :disabled="!(formData.if_constraint === '是')"
              @change="selectChange($event, 'constraint_content')"
            >
              <el-option
                v-for="(item, index) in dictionary.constraint_content"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源" prop="data_source">
            <el-input v-model="formData.data_source" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit_id">
            <el-select v-model="formData.unit_id" @change="selectChange($event, 'unit_id')">
              <el-option
                v-for="(item, index) in dictionary.unit_id"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据类型" prop="data_type">
            <el-input v-model="formData.data_type" maxlength="64" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="浮点位数" prop="float_length">
            <el-input v-model="formData.float_length" maxlength="64" show-word-limit></el-input>
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
import {listAll, getSelectName, saveIndex, delIndex, editIndex, listIndex} from '@/api/asset/standup/standup.js'
import pager from '@/mixins/pager'
export default {
  name: 'Indicator',
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
        business_domain_ID: '',
        index_type: '',
        function: '',
        if_constraint: '',
        constraint_content: '',
        data_source: '',
        unit_id: '',
        data_type: '',
        float_length: '',
        desc: ''
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        field_name: [{required: true, message: '请输入字段名称', trigger: 'blur'}],
        business_domain_ID: [{required: true, message: '请选择业务域', trigger: 'change'}],
        index_type: [{required: true, message: '请输入指标类型', trigger: 'blur'}],
        function: [{required: true, message: '请输入统计函数', trigger: 'blur'}],
        if_constraint: [{required: true, message: '请选择是否需要约束条件', trigger: 'change'}],
        constraint_content: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.formData.if_constraint === '是') {
                if (value) {
                  callback()
                } else {
                  callback(new Error('请选择约束条件'))
                }
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        data_source: [{required: true, message: '请输入数据源', trigger: 'blur'}],
        unit_id: [{required: true, message: '请选择单位', trigger: 'change'}],
        data_type: [{required: true, message: '请输入数据类型', trigger: 'blur'}],
        float_length: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入浮点位数'))
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
        desc: [{required: true, message: '请输入描述', trigger: 'blur'}]
      },
      dictionary: {
        business_domain_ID: [],
        if_constraint: [
          {id: '是', name: '是'},
          {id: '否', name: '否'}
        ],
        constraint_content: [],
        unit_id: []
      }
    }
  },
  mounted() {
    this.listAll()
    this.getSelectName({num: '1'}).then(res => {
      this.dictionary.business_domain_ID = res
    })
    this.getSelectName({num: '8'}).then(res => {
      this.dictionary.constraint_content = res
    })
    this.getSelectName({num: '4'}).then(res => {
      this.dictionary.unit_id = res
    })
  },
  methods: {
    searchChange() {
      if (this.inputVal) {
        this.listIndex()
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
        business_domain_ID: '',
        index_type: '',
        function: '',
        if_constraint: '',
        constraint_content: '',
        data_source: '',
        unit_id: '',
        data_type: '',
        float_length: '',
        desc: ''
      }
      this.resetForm()
    },
    editClick(row) {
      const {
        name,
        field_name,
        business_domain_ID,
        index_type,
        function: func,
        if_constraint,
        constraint_content,
        data_source,
        unit_id,
        data_type,
        float_length,
        desc
      } = row
      const item1 =
        this.dictionary.business_domain_ID.length > 0
          ? this.dictionary.business_domain_ID.find(item => item.name === business_domain_ID)
          : {}
      const item2 =
        this.dictionary.constraint_content.length > 0
          ? this.dictionary.constraint_content.find(item => item.name === constraint_content)
          : {}
      const item3 =
        this.dictionary.unit_id.length > 0 ? this.dictionary.unit_id.find(item => item.name === unit_id) : {}
      this.formData = {
        name,
        field_name,
        business_domain_ID: item1 ? item1.id : '',
        index_type,
        function: func,
        if_constraint,
        constraint_content: item2 ? item2.id : '',
        data_source,
        unit_id: item3 ? item3.id : '',
        data_type,
        float_length,
        desc
      }
      this.oldFormData = {
        name,
        field_name,
        business_domain_ID,
        index_type,
        function: func,
        if_constraint,
        constraint_content,
        data_source,
        unit_id,
        data_type,
        float_length,
        desc
      }
      this.isCreated = false
      this.dialogVisible = true
      this.dialogLoading = false
      this.resetForm()
    },
    delClick(row) {
      const {
        name,
        field_name,
        business_domain_ID,
        index_type,
        function: func,
        if_constraint,
        constraint_content,
        data_source,
        unit_id,
        data_type,
        float_length,
        desc
      } = row
      this.rowData = {
        name,
        field_name,
        business_domain_ID,
        index_type,
        function: func,
        if_constraint,
        constraint_content,
        data_source,
        unit_id,
        data_type,
        float_length,
        desc
      }
      this.delIndex()
    },
    selectChange(val, flag) {
      if (flag === 'business_domain_ID') {
        this.formData.business_domain_ID = val
      }
      if (flag === 'if_constraint') {
        if (val === '否') {
          this.formData.constraint_content = ''
        }
      }
      if (flag === 'constraint_content') {
        this.formData.constraint_content = val
      }
      if (flag === 'unit_id') {
        this.formData.unit_id = val
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          if (this.isCreated) {
            this.saveIndex()
          } else {
            this.editIndex()
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
        data: JSON.stringify({num: '7'})
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
    async saveIndex() {
      const params = {
        data: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(saveIndex(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async delIndex() {
      const params = {
        data: JSON.stringify(this.rowData)
      }
      const res = await this.$simpleAsyncTo(delIndex(params))
      if (res.flag) {
        this.listAll()
      }
    },
    async editIndex() {
      const params = {
        dataOld: JSON.stringify(this.oldFormData),
        dataNew: JSON.stringify(this.formData)
      }
      const res = await this.$simpleAsyncTo(editIndex(params))
      if (res.flag) {
        this.listAll()
      }
    },
    // 条件查询
    async listIndex() {
      const params = {
        data: this.inputVal
      }
      const res = await this.$simpleAsyncTo(listIndex(params))
      if (res.list) {
        this.tableData = res.list.map(item => {
          return {
            name: item.name,
            field_name: item.field_name,
            business_domain_ID: item.business_domain_ID,
            index_type: item.index_type,
            function: item.function,
            if_constraint: item.if_constraint,
            constraint_content: item.constraint_content,
            data_source: item.data_source,
            unit_id: item.unit_id,
            data_type: item.data_type,
            float_length: item.float_length,
            desc: item.desc
          }
        })
        this.total = res.list.length
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.indicator {
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
