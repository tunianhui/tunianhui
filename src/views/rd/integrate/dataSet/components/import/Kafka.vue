
<template>
  <div class="comp-option">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules" label-suffix="：" style="height: 460px;">
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
          <el-form-item label="主题" prop="topic">
            <el-input v-model="form.topic" placeholder="请输入主题" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="键类型" prop="keyType">
            <el-select v-model="form.keyType" placeholder="请选择">
              <el-option v-for="(item, index) in keyTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值类型" prop="valueType">
            <el-select v-model="form.valueType" placeholder="请选择">
              <el-option v-for="(item, index) in valueTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费组ID" prop="groupId">
            <el-input v-model="form.groupId" placeholder="请输入主题" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="消费模式" prop="mode">
            <el-select v-model="form.mode" placeholder="请选择">
              <el-option v-for="(item, index) in modeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据格式" prop="kafkaDataType">
            <el-select v-model="form.kafkaDataType" placeholder="请选择" multiple>
              <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.kafkaDataType === 'text' || form.kafkaDataType === 'csv' " label="字段分隔符" prop="fieldDelimiter">
            <el-input v-model="form.fieldDelimiter" placeholder="请输入" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="高级配置" prop="consumerSetting">
            <el-input v-model="form.consumerSetting" type="textarea" :rows="4" placeholder="你可以在这里输入kafka的特殊参数配置。格式为key=value"></el-input>
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
  mixins: [comMixins],
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        topic: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        keyType: [{ required: true, message: '请选择', trigger: 'change' }],
        valueType: [{ required: true, message: '请选择', trigger: 'change' }],
        kafkaDataType: [{ required: true, message: '请选择', trigger: 'change' }],
        mode: [{ required: true, message: '请选择', trigger: 'change' }],
        fieldDelimiter: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        schemaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      dataTypeList: [],
      keyTypeList: [],
      valueTypeList: [],
      modeList: []
    }
  },
  created () {
  },
  mounted () {
    this.dragSort()
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        dataSourceId: '',
        database: '',
        topic: '',
        groupId: '',
        keyType: '',
        valueType: '',
        kafkaDataType: ['text'],
        fieldDelimiter: '',
        mode: 'latest',
        consumerSetting: '',
        schemaId: '',
        column: []
      }
    },

    async configData () {
      const dictCodes = ['KAFKAREADER_DATATYPE', 'KAFKAREADER_KEYTYPE', 'KAFKAREADER_VALUETYPE', 'KAFKAREADER_OFFSETMODE']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.dataTypeList = results[0].data
      this.keyTypeList = results[1].data
      this.valueTypeList = results[2].data
      this.modeList = results[3].data
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'Kafka'
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
