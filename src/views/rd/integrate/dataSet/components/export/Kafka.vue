<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-14 14:55:34
 * @LastEditTime: 2023-07-27 15:25:46
 * @Description:
-->

<template>
  <div class="comp-option-three">
    <div class="item-title">基本设置</div>
    <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据源" prop="dataSourceId">
            <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源" @change="dataSourceChange">
              <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主题" prop="topic">
            <el-input v-model="form.topic" placeholder="请输入主题" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="键类型" prop="keyType">
            <el-select v-model="form.keyType" placeholder="">
              <el-option v-for="(item, index) in keyTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="值类型" prop="valueType">
            <el-select v-model="form.valueType" placeholder="请选择">
              <el-option v-for="(item, index) in valueTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据格式" prop="kafkaDataType">
            <el-select v-model="form.kafkaDataType" placeholder="">
              <el-option v-for="(item, index) in kafkaDataTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 当数据类型为text或csv时，需要指定数据字段的分隔符 -->
          <el-form-item v-if="form.kafkaDataType === 'text' || form.kafkaDataType === 'csv'" label="分隔符" prop="fieldDelimiter">
            <el-input v-model="form.fieldDelimiter" placeholder="" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="压缩条数" prop="compressSize">
            <el-input v-model="form.compressSize" placeholder="请输入" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高级配置" prop="producerSetting">
            <el-input type="textarea" v-model="form.producerSetting" placeholder="" :rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <div class="item-title">字段映射</div>
    <el-row :gutter="30" style="height: calc(100% - 180px);">
      <el-col :span="8" class="left-col h100">
        <div class="header">
          <span>输入字段</span>
        </div>
        <el-table :data="form.inputColumn" style="width: 100%; height: 210px; overflow: auto;" class="mb-20">
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
        </el-table>
      </el-col>
      <el-col :span="8" class="right-col h100">
        <div class="mb-10">
          <span class="mr-10">输出字段</span>
          <el-select v-model="form.schemaId" placeholder="请选择" style="width: 200px;">
            <el-option v-for="(item, index) in schemaList" :key="index" :label="item.schemaName" :value="item.schemaId"></el-option>
          </el-select>
        </div>
        <el-table :data="form.outputColumn" style="width: 100%; height: 210px; overflow: auto;" class="mb-20">
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
        </el-table>
      </el-col>
      <el-col :span="8" class="center-col h100">
        <div class="header">
          <span class="mr-10">映射关系</span>
          <el-select v-model="form.mappingMethod" placeholder="" style="width: 100px;">
            <el-option label="同名映射" value="samename"></el-option>
            <el-option label="同行映射" value="sameline"></el-option>
          </el-select>
        </div>
        <el-table :data="form.mappingColumn" style="width: 100%; height: 210px; overflow: auto;" class="mb-20">
          <el-table-column prop="inputName" label="字段1" />
          <el-table-column prop="outputName" label="字段2" />
        </el-table>
      </el-col>
    </el-row>
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
          { required: true, message: '请输入话题', trigger: 'blur' }
        ],
        fieldDelimiter: [
          { required: true, message: '请输入分隔符', trigger: 'blur' }
        ],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        kafkaDataType: [{ required: true, message: '请选择', trigger: 'change' }],
        keyType: [{ required: true, message: '请选择', trigger: 'change' }],
        valueType: [{ required: true, message: '请选择', trigger: 'change' }],
        keyStrategy: [{ required: true, message: '请选择', trigger: 'change' }],
        tableId: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }]
      },
      kafkaDataTypeList: [],
      keyTypeList: [],
      valueTypeList: [],
      keyStrategyList: [],
      writeModeList: [],
      schemaList: []
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
        topic: '',
        kafkaDataType: '',
        fieldDelimiter: '',
        compressSize: '1000',
        writeMode: '',
        keyType: '',
        valueType: '',
        keyStrategy: '',
        keyContent: '',
        producerSetting: '',
        schemaId: '', // --->
        mappingMethod: 'samename',
        inputColumn: [], // 根据上游的输入，为您展示输入字段
        outputColumn: [], // 输出字段
        mappingColumn: [] // 映射关系
      }
    },

    async configData () {
      const dictCodes = ['KAFKAWRITER_DATATYPE', 'KAFKAWRITER_KEYTYPE', 'KAFKAWRITER_VALUETYPE', 'KAFKAWRITER_KEYSTRATEGY']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.kafkaDataTypeList = results[0].data
      this.keyTypeList = results[1].data
      this.valueTypeList = results[2].data
      this.keyStrategyList = results[3].data
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

    dataSourceChange (val) {
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
        this.form.outputColumn = res.data.field.map(item => {
          return {
            name: item.fieldName, type: item.dataType
          }
        })
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.item-title {
  font-weight: bold;
}
</style>
