
<template>
  <div class="comp-option">
    <el-form ref="form" label-width="140px" :model="form" :rules="rules" label-suffix="：" style="height: 460px;">
      <el-row :gutter="20" class="h100">
        <el-col :span="13" class="left-col h100">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSourceId">
            <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源" @change="dataSourceChange">
              <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表别名" prop="tableAlias">
            <el-input v-model="form.tableAlias" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="hdfs路径" prop="path">
            <el-input v-model="form.path" placeholder="请输入路径"></el-input>
          </el-form-item>
          <el-form-item label="文件类型" prop="fileType">
            <el-select v-model="form.fileType" placeholder="请选择文件类型">
              <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.fileType === 'text'||form.fileType === 'csv' " label="字段分隔符" prop="fieldDelimiter">
            <el-input v-model="form.fieldDelimiter" placeholder="请输入" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="文件编码" prop="encoding">
            <el-select v-model="form.encoding" placeholder="请选择文件编码">
              <el-option v-for="(item, index) in encodingList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="压缩格式" prop="compressType">
            <el-select v-model="form.compressType" placeholder="请选择压缩格式">
              <el-option v-for="(item, index) in compressTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据内容起始行" prop="startLine">
            <el-input v-model="form.startLine" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" class="right-col h100">
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
        path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        compressType: [{ required: true, message: '请选择', trigger: 'change' }],
        fileType: [{ required: true, message: '请选择', trigger: 'change' }],
        fieldDelimiter: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        startLine: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        encoding: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        schemaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      encodingList: [
        { itemValue: 'UTF-8', itemCode: 'UTF-8' },
        { itemValue: 'GBK', itemCode: 'GBK' }
      ],
      dataTypeList: [],
      compressTypeList: []
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
        tableAlias: '',
        path: '',
        fileType: 'text',
        fieldDelimiter: ',',
        compressType: 'none',
        encoding: 'UTF-8',
        schemaId: '',
        startLine: 1,
        column: []
      }
    },

    async configData () {
      const dictCodes = ['HDFSREADER_DATATYPE', 'HDFSREADER_COMPRESSTYPE']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.dataTypeList = results[0].data
      this.compressTypeList = results[1].data
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'HDFS'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.dataSourceList = res.data.datasource
      }
    },

    // Schema信息列表查询
    async getSchemaData () {
      const { project_id } = this.project
      const res = await getSchemaList({ projectId: project_id })
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
<style scoped lang="scss">
.filter-wrapper {
  text-align: right;
  span {
    font-size: 12px;
    color: #c0c0ff;
    cursor: pointer;
  }
}
</style>
