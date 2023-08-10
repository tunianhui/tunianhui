
<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="130px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="主机数据源" prop="hostDataSourceId">
        <el-select v-model="form.hostDataSourceId" placeholder="请选择数据源">
          <el-option v-for="(item, index) in hostDataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件路径" prop="path">
        <el-input v-model="form.path" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="文件前缀" prop="filePrefix">
        <el-input v-model="form.filePrefix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input v-model="form.fileSuffix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="标志文件后缀" prop="flagSuffix">
        <el-input v-model="form.flagSuffix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件策略" prop="dealStrategy">
        <el-select v-model="form.dealStrategy" placeholder="请选择">
          <el-option v-for="(item, index) in dealStrategyList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.dealStrategy === 'rename'" label="改名后缀" prop="renameSuffix">
        <el-input v-model="form.renameSuffix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item v-if="form.dealStrategy === 'move'" label="移动路径" prop="path2">
        <el-input v-model="form.path2" placeholder=""></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getDatasourceList, getdictitemlist } from '@/api/rd/data-collection'

export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        hostDataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        path: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        dealStrategy: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      hostDataSourceList: [],
      dealStrategyList: []
    }
  },
  created () {

  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        hostDataSourceId: '',
        path: '',
        filePrefix: '',
        fileSuffix: '',
        flagSuffix: '',
        dealStrategy: 'none'
      }
    },

    async configData () {
      const dictCodes = ['FILEREADER_DEALSTRATEGY']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.dealStrategyList = results[0].data
    },

    // 数据源列表
    async getDataSource () {
      this.getHostDataSource()
    },

    // 主机数据源列表
    async getHostDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'RemoteHost'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.hostDataSourceList = res.data.datasource
      }
    }
  }
}
</script>
