
<template>
  <div class="comp-option">
    <el-row :gutter="20" class="h100">
      <el-col :span="14" class="left-col h100">
        <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSourceId">
            <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源" @change="dataSourceChange">
              <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输入表" prop="tableId">
            <el-select v-model="form.tableId" placeholder="请选择数据表" @change="tableChange">
              <el-option v-for="(item, index) in dataSourceTableList" :key="index" :label="item.tableName" :value="item.tableId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表别名" prop="tableAlias">
            <el-input v-model="form.tableAlias" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item v-if="partitionKeyList.length" label="分区" prop="partitionKey">
            <div class="partitionKey-item" v-for="(item, index) in partitionKeyList" :key="index">
              <span class="mr-5" style="width:50px">{{item.fieldName}}</span>
              <span class="mr-10">=</span>
              <el-input v-model="item.value" placeholder="请输入"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="输入过滤" prop="filterWhere">
            <div>
              <div class="filter-wrapper">
                <span @click="selectFilterType">{{filterType ? '切换到配置模式':'切换到脚本模式'}}</span>
              </div>
              <el-input v-if="filterType" v-model="form.filterWhere" type="textarea" :rows="4" placeholder="填写输入对象的筛选条件，支持带参数，如ds=${bizdate}"></el-input>
              <div v-else>
                <div class="item">
                  <el-row :gutter="5" v-for="(item,index) in form.filterCriterion" :key="index">
                    <el-col :span="4">
                      <!-- :prop="'filterCriterion.' + index + '.andOrNot'" :rules="{required: true, message: '必填', trigger: ['blur','change']}" -->
                      <el-form-item label="" label-width='0px' :key="item.key">
                        <el-select v-model="item.andOrNot" placeholder="">
                          <el-option v-for="item in andOrNotList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-select v-model="item.leftParenthese" placeholder="">
                        <el-option v-for="item in leftParentheseList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      <el-select v-model="item.columnName" placeholder="">
                        <el-option v-for="(item, index) in columList" :key="index" :label="item.fieldName" :value="item.fieldName"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4">
                      <el-select v-model="item.operator" placeholder="">
                        <el-option v-for="item in operatorList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="item.columnValue"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-select v-model="item.rightParenthese" placeholder="">
                        <el-option v-for="item in rightParentheseList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="1">
                      <el-button type="text" icon="el-icon-delete" @click="handleDelConfig(item,index)"></el-button>
                    </el-col>
                  </el-row>
                </div>
                <el-button type="primary" @click="addConfig">增加</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="10" class="right-col h100">
        <div class="header">
          <span>输出字段</span>
          <el-button type="primary" class="iconfont icon-filter font-14" @click="manageField">字段管理</el-button>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
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

    <!-- 字段管理 -->
    <el-dialog title="字段管理" append-to-body :visible.sync="dialogVisible" width="765px">
      <el-transfer :titles="['未选的输入字段', '已选的输入字段']" filterable filter-placeholder="请输入搜索关键词" v-model="fieldData" :data="fieldList" :props="{ key: 'fieldName', label: 'desc' }">
        <template slot-scope="{ option }">
          <div class="space-between">
            <span>{{option.fieldName}}</span>
            <span>{{option.dataType}}</span>
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
import { getDatasourceList, getdictitemlist } from '@/api/rd/data-collection'

export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      form: {
        // partitionKey: {
        //   ds: '2023-04-10',
        //   hour: '05'
        // }
      },
      rules: {
        name: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        tableId: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }],
        tableAlias: [{ required: true, message: '请输入', trigger: ['change', 'blur'] }]
      }
    }
  },
  created () {
  },
  mounted () {
    this.dragSort()
  },
  watch: {
    partitionKeyList: {
      deep: true,
      handler (val) {
        this.form.partitionKey = this.arrayToObject(val)
      }
    }
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        dataSourceId: '', // 数据源
        database: '',
        tableId: '', // 表  ---> 注意： 单选/多选 数据类型不一致
        tableAlias: '',
        partitionKey: {},
        filterWhere: '',
        filterCriterion: [],
        column: [] // 输出字段
      }
    },

    arrayToObject (arr) {
      let newObj = {}
      for (let i = 0; i < arr.length; i++) {
        let element = arr[i]
        let key = element['fieldName']
        let value = element['value']
        if (newObj[key]) {
          newObj[key] = Math.max(newObj[key], value)
        } else {
          newObj[key] = value
        }
      }
      return newObj
    },

    async configData () {
      const dictCodes = ['FILTER_ANDORNOTTYPE', 'FILTER_LEFTPARENTHESE', 'FILTER_RIGHTPARENTHESE', 'FILTER_OPERATOR']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.andOrNotList = results[0].data.map(ele => ele.itemValue)
      this.leftParentheseList = results[1].data.map(ele => ele.itemValue)
      this.rightParentheseList = results[2].data.map(ele => ele.itemValue)
      this.operatorList = results[3].data.map(ele => ele.itemValue)
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'Hive'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.dataSourceList = res.data.datasource
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
.partitionKey-item {
  display: flex;
}
</style>
