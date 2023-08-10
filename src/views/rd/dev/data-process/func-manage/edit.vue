<template>
  <SimpleEditDialog
    class="create-function"
    width="550px"
    :title="title"
    :visible="isVisible"
    confirmText="提交"
    @close="close"
    @confirm="confirm"
  >
    <p v-if="filter.status === '1' && title.indexOf('编辑') > -1" style="color: #ca435b" class="mb-15">{{meteFunc.err_msg}}</p>
    <el-form
      ref="form"
      :model="editForm"
      :rules="rules"
      label-width="100px"
      label-position="right"
      label-suffix="："
      v-loading="!!loading"
    >
      <el-form-item label="名称" prop="func_name">
        <el-input v-model="editForm.func_name" placeholder="请输入20字内的名称" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="选择资源" prop="file_id">
        <SelectTree
          :data="sourceData"
          :field="{
            id: 'id',
            label: 'name',
            type: 'node_type',
            parent_id: 'parent_id',
            children: 'child'
          }"
          :defaultProps="{
            children: 'child',
            label: 'label'
          }"
          :curNode="editForm.file_id"
          :curName="editForm.curName"
          :isDirClick="false"
          @visibleChange="visibleChange"
          @nodeClick="selectTreeNodeClick"
          >
          <p style="text-align:center;color: #2253D4;cursor: pointer;" class="mt-10 mb-10 font-14" @click.stop="addSourceData">新建数据源</p>
          </SelectTree>
      </el-form-item>
      <el-form-item label="类名" prop="class_main">
        <el-input v-model="editForm.class_main" placeholder="请输入类名，如test_udf.UDFGETSrcld" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="func_classify">
        <el-select v-model="editForm.func_classify" clearable placeholder=" ">
          <el-option
            v-for="item in funcTypeList"
            :key="item.id"
            :label="item.classify_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="命令格式" prop="func_format">
        <el-input v-model="editForm.func_format" placeholder="请输入命令格式，如bigint weekday （datetime date）" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="使用文档" prop="help_text">
        <el-input
          v-model="editForm.help_text"
          type="textarea"
          :rows="5"
          :placeholder="docPlaceholder"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="选择目录">
        <SelectTree
          :data="treeData"
          :field="{
            id: 'id',
            label: 'name',
            type: 'node_type',
            parent_id: 'parent_id',
            children: 'child'
          }"
          :defaultProps="{
            children: 'child',
            label: 'label'
          }"
          :curNode="editForm.parent_id"
          :isDirClick="true"
          @nodeClick="selectTreeNodeClick1"
          ></SelectTree>
      </el-form-item>
    </el-form>
    <SourceEditDialog :visible.sync="isSourceVisible" title="新建资源" :data={...project}></SourceEditDialog>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {addFuncManage, getSourceData, editFuncManage, getTreeData, queryMetaFuncInfo, getFuncType} from '@/api/rd/func-manage.js'
import SelectTree from './select-tree.vue'
import {mapGetters, mapMutations} from 'vuex'
import SourceEditDialog from '../source-manage/edit'
const docPlaceholder = `请输入500字内描述，着重说明用途、参数介绍、使用用例
简单一段使用用例SQL，如：
select
     get_week_date("20170810",0,2),--获取8月10日本周周二日期
from  cndata.dual`

export default {
  name: 'CreateFunction',
  mixins: [editDialog],
  components: {
    SelectTree,
    SourceEditDialog
  },
  props: {
    callback: Function,
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      loading: 0,
      docPlaceholder,
      resourcesOptions: [
        {label: '资源', value: 'ziyuan1'}
      ],
      funcTypeList: [],
      directoryList: [
        {label: '用户自定义', value: 'custom'}
      ],
      editForm: {
        func_name: '',
        file_id: '',
        class_main: '',
        func_classify: '',
        func_format: '',
        help_text: '',
        parent_id: ''
      },
      rules: {
        func_name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {
            pattern: /^[a-zA-Z_]([a-zA-Z_0-9]+)?$/,
            trigger: ['blur', 'change'],
            message: '函数名称只能以字母或者下划线开头，包含数字，字母，下划线'
          }
        ],
        file_id: [
          {required: true, message: '请选择资源', trigger: 'change'}
        ],
        class_main: [
          {required: true, message: '请输入类名', trigger: 'blur'}
          // {
          //   pattern: /^[a-z0-9_]+\.+[a-zA-Z0-9]+$/,
          //   trigger: ['blur', 'change'],
          //   message: '请输入正确格式'
          // }
        ],
        func_classify: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        func_format: [
          {required: true, message: '请输入命令格式', trigger: 'blur'}
          // {
          //   pattern: /^[a-zA-Z0-9_][a-zA-Z0-9\u4e00-\u9fa5]*$/,
          //   trigger: ['blur', 'change'],
          //   message: '请输入正确格式'
          // }
        ],
        help_text: [
          {required: true, message: '请填写使用文档', trigger: 'blur'}
        ]
      },
      sourceData: [],
      treeData: [],
      meteFunc: {},
      isSourceVisible: false
    }
  },
  async created() {
    this.loading++
    await this.getSourceData()
    await this._getTreeData()
    await this._getFuncType()
    if (this.title.indexOf('编辑') > -1) {
      await this._queryMetaFuncInfo()
      this.editForm.func_name = this.meteFunc.func_name
      this.editForm.file_id = this.meteFunc.file_id
      this.editForm.class_main = this.meteFunc.class_main
      this.editForm.func_classify = this.meteFunc.func_classify
      this.editForm.help_text = this.meteFunc.help_text
      this.editForm.parent_id = this.meteFunc.parent_id
      this.editForm.func_format = this.meteFunc.func_format
    }
    this.loading--
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading++
          const params = {
            ...this.editForm,
            project_id: this.project.project_id
          }
          let fn = null, msg = ''
          if (this.title.indexOf('新建') > -1) {
            fn = addFuncManage
            msg = '新建'
          } else {
            params.id = this.filter.id
            fn = editFuncManage
            msg = '编辑'
          }
          const res = await this.$simpleAsyncTo(fn(params), '新建失败')
          if (res) {
            this.$message({
              type: 'success',
              message: `${msg}函数管理成功！！!`
            })
            this.$root.eventEmitter.emit('refresh')
            this.close()
          }
          this.loading--
        }
      })
    },
    async getSourceData() {
      const {
        project_id
      } = this.project
      const res = await this.$simpleAsyncTo(
        getSourceData({
          project_id,
          folder_type: '4'
        }),
        '获取列表失败'
      )
      if (res) {
        this.sourceData = [res.data]
      }
    },
    visibleChange(val) {
      if (val) {
        this.getSourceData()
      }
    },
    selectTreeNodeClick(data) {
      this.editForm.file_id = data.id
    },
    selectTreeNodeClick1(data) {
      this.editForm.parent_id = data.id
    },
    // 获取目录列表
    async _getTreeData() {
      const {
        project_id
      } = this.project
      const res = await this.$simpleAsyncTo(
        getTreeData({
          project_id,
          folder_type: '3'
        }),
        '获取列表失败'
      )
      if (res) {
        this.treeData = []
        this.recursionTreeData([res.data], this.treeData)
      }
    },
    recursionTreeData(source, target) {
      source.forEach(item => {
        const {node_type, child} = item
        const treeItem = {
          ...item
        }
        if (child && child.length) {
          treeItem.child = []
          this.recursionTreeData(child, treeItem.child)
        }
        if (node_type === '0') {
          target.push(treeItem)
        }
      })
    },
    // 查询函数
    async _queryMetaFuncInfo() {
      const res = await this.$simpleAsyncTo(queryMetaFuncInfo({id: this.filter.id}), '获取函数信息失败')
      if (res) {
        this.meteFunc = res.data
      }
    },
    // 函数类型
    async _getFuncType() {
      const res = await this.$simpleAsyncTo(getFuncType({id: this.filter.id}), '获取类型失败')
      if (res) {
        this.funcTypeList = res.data
      }
    },
    addSourceData() {
      // this.setActiveRdEditDialog({
      //   title: '新建资源',
      //   component: 'SourceManageEdit',
      //   data: {...this.project}
      // })
      this.isSourceVisible = true
    }
  }
}
</script>

<style lang="scss">
</style>
