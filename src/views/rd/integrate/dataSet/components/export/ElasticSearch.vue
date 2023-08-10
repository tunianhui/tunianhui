<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-14 14:55:34
 * @LastEditTime: 2023-08-08 14:10:51
 * @Description:
-->

<template>
  <div class="comp-option-three">
    <div class="item-title">基本设置</div>
    <el-form ref="form" label-width="120px" :model="form" :rules="rules" label-suffix="：">
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
          <el-form-item label="索引文档" prop="index">
            <el-select v-model="form.index" placeholder="请选择" @change="indexChange">
              <el-option v-for="(item, index) in documentList" :key="index" :label="item.indexName" :value="item.indexId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表别名" prop="tableAlias">
            <el-input v-model="form.tableAlias" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.version !== '7'" label="索引文档类型" prop="type">
            <el-select v-model="form.type" clearable placeholder="请选择">
              <el-option v-for="(item, index) in documentTypeList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加载策略" prop="writeMode">
            <el-select v-model="form.writeMode" placeholder="">
              <el-option v-for="(item, index) in writeModeList" :key="index" :label="item.itemCode" :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段分隔符" prop="fieldDelimiter">
            <el-input v-model="form.fieldDelimiter" placeholder="" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <div class="item-title">字段映射</div>
    <el-row :gutter="30" style="height: calc(100% - 140px);">
      <el-col :span="8" class="left-col h100">
        <div class="header">
          <span>输入字段</span>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.inputColumn" style="width: 100%; height: 210px; overflow: auto;" class="mb-20">
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
        </el-table>
      </el-col>
      <el-col :span="8" class="right-col h100">
        <div class="header">
          <span class="mr-10">输出字段</span>
          <el-button type="primary" class="iconfont icon-filter font-14" @click="manageField">字段管理</el-button>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.outputColumn" style="width: 100%; height: 210px; overflow: auto;" class="mb-20">
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text" @click="handdleDel(scope.row, scope.$index)"><i class="el-icon-delete font-14 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
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
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.mappingColumn" style="width: 100%; height: 210px; overflow: auto;" class="mb-20">
          <el-table-column prop="inputName" label="字段1" />
          <el-table-column prop="outputName" label="字段2" />
        </el-table>
      </el-col>
    </el-row>

    <!-- 字段管理 -->
    <el-dialog title="字段管理" append-to-body :visible.sync="dialogVisible" width="765px">
      <el-transfer :titles="['未选的输入字段', '已选的输入字段']" filterable filter-placeholder="请输入搜索关键词" v-model="fieldData" :data="form.inputColumn" :props="{ key: 'name', label: 'type' }">
        <template slot-scope="{ option }">
          <div class="space-between">
            <span>{{option.name}}</span>
            <span>{{option.type}}</span>
          </div>
        </template>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handdleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getDatasourceList, getdictitemlist, getesindexlist, getesindextypelist, getesindexfieldlist } from '@/api/rd/data-collection'
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
        index: [{ required: true, message: '请选择', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        writeMode: [{ required: true, message: '请选择', trigger: 'change' }],
        tableId: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }],
        tableAlias: [{ required: true, message: '请输入', trigger: ['change', 'blur'] }]
      }
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
        version: '',
        fieldDelimiter: '',
        writeMode: 'upsert',
        mappingMethod: 'samename',
        inputColumn: [], // 根据上游的输入，为您展示输入字段
        outputColumn: [], // 输出字段
        mappingColumn: [] // 映射关系
      }
    },

    dataSourceChange (val) {
      this.getDocumentList()
      this.getDocumentTypeList()
      this.getFieldList()
      this.form.version = this.dataSourceList.find(ele => ele.dataSourceId === val).esVersion
    },

    indexChange (val) {
      this.getDocumentTypeList()
      this.getFieldList()
    },

    async configData () {
      const taskType = localStorage.getItem('taskType') || '3'
      let dictCodes = ['ELASTICSEARCHWRITER_WRITEMODE']
      if (taskType === '5') {
        dictCodes = ['ELASTICSEARCHWRITER_SPARKPROCEDURE_WRITEMODE']
      }
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.writeModeList = results[0].data
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'ElasticSearch'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.dataSourceList = res.data.datasource
        if (this.form.dataSourceId) {
          this.getDocumentList()
          this.getDocumentTypeList()
          this.getFieldList()
          this.form.version = this.dataSourceList.find(ele => ele.dataSourceId === this.form.dataSourceId).esVersion
        }
      }
    },

    async getDocumentList () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceId: this.form.dataSourceId
      }
      const res = await getesindexlist(params)
      if (res) {
        this.documentList = res.data.index
      }
    },

    async getDocumentTypeList () {
      const params = {
        dataSourceId: this.form.dataSourceId,
        indexId: this.form.index
      }
      const res = await getesindextypelist(params)
      if (res) {
        this.documentTypeList = res.data.esType
      }
    },

    // 输出字段
    async getFieldList () {
      const params = {
        dataSourceId: this.form.dataSourceId,
        indexId: this.form.index
      }
      const res = await getesindexfieldlist(params)
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
