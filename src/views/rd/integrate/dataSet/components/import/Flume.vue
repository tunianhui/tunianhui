<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-07 13:48:45
 * @LastEditTime: 2023-08-07 11:19:52
 * @Description:
-->

<template>
  <div class="comp-option">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules" label-suffix="：" style="height: 460px;">
      <el-row :gutter="20" class="h100">
        <el-col :span="14" class="left-col h100">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSourceId">
            <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源">
              <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件路径" prop="spoolDir">
            <el-input v-model="form.spoolDir" placeholder="请输入文件路径" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="收集文件规则" prop="includePattern">
            <el-input v-model="form.includePattern" placeholder="请输入" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="忽略文件规则" prop="ignorePattern">
            <el-input v-model="form.ignorePattern" placeholder="请输入" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="删除规则" prop="deletePolicy">
            <el-select v-model="form.deletePolicy" placeholder="请选择">
              <el-option v-for="(item, index) in deletePolicyList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件类型" prop="fileType">
            <el-select v-model="form.fileType" placeholder="请选择">
              <el-option v-for="(item, index) in fileTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.fileType === 'text' || form.fileType === 'csv'" label="字段分隔符" prop="fieldDelimiter">
            <el-input v-model="form.fieldDelimiter" placeholder="请输入字段分隔符" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item v-if="form.fileType === 'text' || form.fileType === 'csv'" label="是否过滤数据" prop="filterLine">
            <el-select v-model="form.filterLine" placeholder="请选择">
              <el-option v-for="(item, index) in filterLineList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="过滤规则" prop="filterPattern">
            <el-input v-model="form.filterPattern" type="textarea" :rows="4" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="right-col h100">
          <el-form-item label="输出字段" prop="schemaId" label-width="100px">
            <el-select v-model="form.schemaId" placeholder="请选择">
              <el-option v-for="(item, index) in schemaList" :key="index" :label="item.schemaName" :value="item.schemaId"></el-option>
            </el-select>
          </el-form-item>
          <el-table :data="form.column" style="width: 100%; height: 380px; overflow: auto;" class="mb-20">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="name" label="字段" />
            <el-table-column prop="type" label="类型" />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getDatasourceList, getdictitemlist, getSchemaList, getSchemaFieldList } from '@/api/rd/data-collection'
export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        deletePolicy: [{ required: true, message: '请选择', trigger: 'change' }],
        fileType: [{ required: true, message: '请选择', trigger: 'change' }],
        filterLine: [{ required: true, message: '请选择', trigger: 'change' }],
        spoolDir: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        schemaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      deletePolicyList: [],
      fileTypeList: [],
      filterLineList: [true, false]
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        dataSourceId: '',
        database: '',
        fileType: '',
        fieldDelimiter: '',
        schemaId: '',
        column: []
      }
    },

    async configData () {
      const dictCodes = ['SPOOLDIRREADER_DELETEPOLICY', 'SPOOLDIRREADER_FILETYPE']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.deletePolicyList = results[0].data
      this.fileTypeList = results[1].data
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'RemoteHost'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.dataSourceList = res.data.datasource
      }
    },

    // Schema信息列表查询
    async getSchemaData () {
      const { project_id } = this.project
      const params = {
        projectId: project_id
      }
      const res = await getSchemaList(params)
      if (res) {
        this.schemaList = res.data.schema
      }
    },

    // 查询Schema字段列表信息
    async getSchemafield (schemaId) {
      const res = await getSchemaFieldList({ schemaId })
      if (res) {
        this.form.column = res.data.field.map(item => {
          return {
            name: item.fieldName, type: item.dataType
          }
        })
      }
    }
  }
}
</script>
