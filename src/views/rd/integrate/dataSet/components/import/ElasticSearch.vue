
<template>
  <div class="comp-option">
    <el-row :gutter="20" class="h100">
      <el-col :span="12" class="left-col h100">
        <el-form ref="form" label-width="120px" :model="form" :rules="rules" label-suffix="：">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSourceId">
            <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源" @change="dataSourceChange">
              <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="索引文档" prop="index">
            <el-select v-model="form.index" placeholder="请选择" @change="indexChange">
              <el-option v-for="(item, index) in documentList" :key="index" :label="item.indexName" :value="item.indexId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.version !== '7'" label="索引文档类型" prop="type">
            <el-select v-model="form.type" clearable placeholder="请选择">
              <el-option v-for="(item, index) in documentTypeList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表别名" prop="tableAlias">
            <el-input v-model="form.tableAlias" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="批量条数" prop="batchSize">
            <el-input v-model="form.batchSize" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="查询" prop="query">
            <el-input v-model="form.query" type="textarea" :rows="6" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="right-col h100">
        <div class="header">
          <span>输出字段</span>
        </div>
        <el-table row-key="name" ref="singleTable" :data="form.column" style="width: 100%; height: 380px; overflow: auto;cursor: move;" class="mb-20">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text" @click="handdleDel(scope.row, scope.$index)"><i class="el-icon-delete font-14 color-btn"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="移动" placement="top">
                <el-button type="text"><i class="iconfont icon-move font-14 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getDatasourceList, getesindexlist, getesindextypelist, getesindexfieldlist } from '@/api/rd/data-collection'
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
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        index: [{ required: true, message: '请选择', trigger: 'change' }],
        tableAlias: [{ required: true, message: '请输入', trigger: ['change', 'blur'] }],
        batchSize: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      documentList: [],
      documentTypeList: []
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
        dataSourceId: '', // 数据源
        database: '',
        index: '',
        version: '',
        tableAlias: '',
        batchSize: 1024, // 批量条数
        query: '',
        column: [] // 输出字段
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
