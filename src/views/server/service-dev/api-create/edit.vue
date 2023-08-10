<template>
  <section class="create api-server-detail">
    <header class="header mb-20">
      <span class>生成 API</span>
      <el-button type="primary" class="mb-10" v-if="!show" @click="releaseApiHandle">发布</el-button>
    </header>
    <div style="padding:0 30px;" class="create-api">
      <transition name="fadeinleft" mode="out-in">
        <el-form :model="apiCreateForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：" v-if="show">
          <el-form-item label="API 名称" prop="api_name">
            <el-input v-model="apiCreateForm.api_name" maxlength="60" show-word-limit placeholder="支持汉字，数字，英文，下划线，且不能以下划线开头"></el-input>
          </el-form-item>
          <el-form-item label="API 分组" prop="api_group">
            <el-select v-model="apiCreateForm.api_group" placeholder="请选择API分组">
              <el-option :label="item.group_name" :value="item.id" v-for="item in groupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="API Path" prop="api_path">
            <el-input v-model="apiCreateForm.api_path" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="协议" prop="api_protocol">
            <el-checkbox-group v-model="apiCreateForm.api_protocol">
              <el-checkbox label="http" name="api_protocol"></el-checkbox>
              <el-checkbox label="https" name="api_protocol"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="请求方式" prop="api_request_type">
            <el-select v-model="apiCreateForm.api_request_type" placeholder="请选择请求方式">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返回类型" prop="api_reponse_type">
            <el-select v-model="apiCreateForm.api_reponse_type" placeholder="请选择返回类型">
              <el-option label="JSON" value="JSON"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="api_remark">
            <el-input type="textarea" v-model="apiCreateForm.api_remark" maxlength="2000" show-word-limit rows="10"></el-input>
          </el-form-item>
          <el-form-item prop>
            <div style="text-align:center">
              <el-button type="primary" @click="nextStep('ruleForm')">下一步</el-button>
              <el-button @click="resetForm('ruleForm')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </transition>

      <transition name="fadeinleft" mode="out-in">
        <el-form :model="writeSqlForm" :rules="rulesWriteSqlForm" ref="writeSqlForm" label-width="130px" class="demo-ruleForm" label-suffix="：" v-show="!show">
          <el-form-item label-width="0">
            <div style="text-algin:start" class="font-size">选择表</div>
          </el-form-item>
          <el-form-item label="数据源类型" prop="source_type">
            <el-select v-model="writeSqlForm.source_type" placeholder="请选择数据源类型">
              <el-option :label="item.label" :value="item.value" v-for="item in dataSourceTypeList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源名称" prop="source_name">
            <el-select v-model="writeSqlForm.source_name" placeholder="请选择数据源" style="width:50%">
              <el-option :label="item.data_source_name" :value="item.data_source_name" v-for="item in dataSource" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div style="text-algin:start" class="font-size">环境配置</div>
          </el-form-item>
          <el-form-item label="超时时间" prop="time_out">
            <el-input v-model.number="writeSqlForm.time_out" style="width:30%" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            <span>ms</span>
          </el-form-item>
          <el-form-item label-width="0">
            <div style="text-algin:start;justify-content: space-between;" class="font-size flex-layout sql">
              <span>编写查询sql</span>
              <el-button type="primary" @click="getGenerateParams">生成参数</el-button>
            </div>
          </el-form-item>
          <el-form-item label-width="0" style="height:50%">
            <MonacoEditor style="height: 200px" :code.sync="writeSqlForm.sql_template"></MonacoEditor>
          </el-form-item>
        </el-form>
      </transition>
    </div>

    <!-- <div :class="['api-detail active-create', detailShow?'width': '']" ref="detail" v-if="!show">
      <el-tabs tab-position="right" style="height: 200px;" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="请求参数" name="query">
          <RequestParams :whereList="whereList" :flag="flag" @editRow="editRow"></RequestParams>
        </el-tab-pane>
        <el-tab-pane label="请求参数" name="query">
          <RequestParams :whereList="whereList" :flag="flag" @editRow="editRow"></RequestParams>
        </el-tab-pane>
        <el-tab-pane label="返回参数" name="reponse">
          <Return :selectList="selectList" :flag="flag" @editRow="editRow"></Return>
        </el-tab-pane>
      </el-tabs>
    </div> -->

  </section>
</template>

<script>
import RequestParams from '../../layout/right-sidebar/request-params.vue'
import Return from '../../layout/right-sidebar/return.vue'
import {
  getDataSource,
  getApiGroup,
  getSaveApi,
  getGenerateParams
} from '@/api/server/server.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Create',
  components: {
    RequestParams,
    Return
  },
  props: {
    // 编辑参数回写
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['project']),
    dataSource () {
      return this.dataSourceList.filter(e => {
        return e.data_source_type === this.writeSqlForm.source_type
      })
    }
  },
  data () {
    return {
      flag: '',
      detailShow: false,
      show: true,
      activeName: '',
      currentName: '',
      dataSourceList: [],
      groupList: [],
      whereList: [],
      selectList: [],
      apiCreateForm: {
        api_name: '',
        api_path: '',
        api_group: '',
        api_protocol: [],
        api_request_type: '',
        api_reponse_type: '',
        api_remark: ''
      },
      writeSqlForm: {
        source_type: '',
        source_name: '',
        // api_mem: '',
        overtime: '',
        time_out: '',
        sql_template: ''
      },
      rowData: {},
      rules: {
        api_name: [
          { required: true, message: '请输入API名称' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message:
              'API名称至多60个字符，允许中、文数字、字母、下划线, 不能以下划线开头或结尾',
            trigger: ['blur', 'change']
          }
        ],
        api_path: [
          { required: true, message: '请输入API路径' },
          {
            pattern: /^(\/\w+)+/,
            message: '输入以/开头的路径，如/abc',
            trigger: ['blur', 'change']
          }
        ],
        api_group: [
          { required: true, message: '请选择分组', trigger: ['blur', 'change'] }
        ],
        api_request_type: [
          {
            required: true,
            message: '请选择请求方式',
            trigger: ['blur', 'change']
          }
        ],
        api_reponse_type: [
          {
            required: true,
            message: '请选择返回类型',
            trigger: ['blur', 'change']
          }
        ],
        api_protocol: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个协议',
            trigger: 'change'
          }
        ],
        api_remark: [
          { required: true, message: '请填写API描述信息', trigger: 'blur' }
        ]
      },
      rulesWriteSqlForm: {
        source_type: [
          {
            required: true,
            message: '请选择数据源类型',
            trigger: ['blur', 'change']
          }
        ],
        // source_name: [
        //   { required: true, message: '请选择数据源名称', trigger: ['blur', 'change'] }
        // ],
        // api_mem: [
        //   {required: true, message: '请选择内存', trigger: ['blur', 'change']}
        // ],
        time_out: [
          { required: true, message: '请输入超时时间', trigger: ['blur', 'change'] },
          // {type: 'number', message: '超时时间必须为数字值'}
          { pattern: /^[0-9]/g, message: '超时时间必须为数字值' }
        ]
      },
      dataSourceTypeList: [
        { label: 'MySQL', value: 'MySQL' },
        { label: 'Oracle', value: 'Oracle' },
        // {label: 'HDFS', value: 'HDFS'},
        // {label: 'FTP', value: 'FTP'},
        { label: 'Hive', value: 'Hive' },
        // {label: 'ElasticSearch', value: 'ElasticSearch'},
        { label: 'Presto', value: 'Presto' },
        { label: 'ClickHouse', value: 'ClickHouse' },
        { label: 'TiDB', value: 'TiDB' },
        { label: 'Phoenix', value: 'Phoenix' }
      ],
      sqlWhereList: []
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler (val) {
        if (JSON.stringify(val) !== JSON.stringify({})) {
          this.rowData = val
          this.flag = 'edit'
          // this.apiCreateForm.api_name = val.api_name
          // this.apiCreateForm.api_group = val.api_group
          // this.apiCreateForm.api_path = val.api_path
          // this.apiCreateForm.api_protocol = val.api_protocol
          // this.apiCreateForm.api_request_type = val.api_request_type
          // this.apiCreateForm.api_reponse_type = val.api_reponse_type
          // this.apiCreateForm.api_remark = val.api_remark
          // this.writeSqlForm.source_type = val.source_type
          // this.writeSqlForm.source_name = val.source_name
          // // this.writeSqlForm.api_mem = val.api_mem
          // this.writeSqlForm.overtime = val.overtime
          // this.writeSqlForm.time_out = val.time_out
          // this.writeSqlForm.sql_template = this.decrypt(val.sql_template)
          // this.whereList = val.where
          // this.selectList = val.select
        } else {
          this.rowData = val
          this.flag = 'add'
        }
      }
    },
    'writeSqlForm.sql_template': {
      deep: true,
      handler (val) {
        // this.getGenerateParams()
        // if (JSON.stringify(this.sqlWhereList) !== JSON.stringify(this.getExecStrs(val).where)) {
        //   let arr = []
        //   if (this.sqlWhereList.length !== 0) {
        //     this.sqlWhereList.forEach(e => {
        //       this.getExecStrs(val).where.forEach(i => {
        //         if (e !== i) {
        //           arr.push({param_name: i})
        //         }
        //       })
        //     })
        //   } else {
        //     this.getExecStrs(val).where.forEach(e => {
        //       arr.push({param_name: e})
        //     })
        //   }
        //   this.whereList = this.whereList.concat(arr)
        //   this.sqlWhereList = this.getExecStrs(val).where
        // }
      }
    }
  },
  created () {
    this.getApiGroup()
  },
  methods: {
    nextStep (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.show = false
          this.getDataSource()
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      // name: `new_create_${id++}`
      // this.tabStore.commit('remove', name)
      this.$router.push({ name: 'apiCreate' })
    },
    async getDataSource () {
      const params = {
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(
        getDataSource(params),
        '获取数据源失败'
      )
      if (res) {
        this.dataSourceList = res.data
      }
    },
    async getApiGroup () {
      const params = { id: this.project.project_id }
      const res = await this.$simpleAsyncTo(
        getApiGroup(params),
        '获取分组列表失败'
      )
      if (res) {
        this.groupList = res.data
      }
    },
    releaseApiHandle () {
      this.$refs['writeSqlForm'].validate(async valid => {
        if (valid) {
          let sourceId = this.dataSourceList.filter(e => {
            return e.data_source_name === this.writeSqlForm.source_name
          })
          let data_source_id
          if (sourceId.length !== 0) {
            data_source_id = sourceId[0].id
          } else {
            data_source_id = ''
          }
          const params = {
            id: this.rowData.id || '',
            ...this.apiCreateForm,
            ...this.writeSqlForm,
            project_id: this.project.project_id,
            data_source_id,
            where: this.whereList,
            select: this.selectList
          }
          params.sql_template = params.sql_template ? this.encrypt(params.sql_template) : ''
          this.globalLoading()
          const res = await this.$simpleAsyncTo(getSaveApi(params), '发布失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '发布成功'
            })
            this.$router.push({ path: '/server/api-dev/dev' })
          }
          this.globalLoading().close()
        }
      })
    },
    async getGenerateParams () {
      const params = {
        sql: this.writeSqlForm.sql_template,
        select: this.selectList,
        where: this.whereList
      }
      const res = await this.$simpleAsyncTo(
        getGenerateParams(params),
        '获取数据失败'
      )
      if (res.data.generate) {
        this.whereList = res.data.where
        this.selectList = res.data.select
        this.$message({
          type: 'success',
          message: '参数生成成功'
        })
        // this.whereList = this.whereList.concat(this.newSqlAttrList(res.data.where, this.whereList))
        // this.selectList = this.selectList.concat(this.newSqlAttrList(res.data.select, this.selectList))
      } else {
        this.$message({
          type: 'error',
          message: '参数生成失败'
        })
      }
    },
    editRow (data) {
      if (data.flag === 'where') {
        this.whereList = data.data
      } else {
        this.selectList = data.data
      }
    },
    handleClick (tab) {
      if (tab.name === this.currentName) {
        this.detailShow = !this.detailShow
      } else {
        this.detailShow = true
      }
      this.currentName = tab.name
    },
    // getExecStrs (str) {
    //   let reg = /\$\{(.+?)\}/g
    //   let list = []
    //   let result = null
    //   do {
    //     result = reg.exec(str)
    //     result && list.push(result[1])
    //   } while (result)
    //   let newstr = str.replace(/\s/g, '')
    //   let start = newstr.indexOf('select') + 'select'.length
    //   let end = newstr.indexOf('from')
    //   newstr = newstr.slice(start, end).split(',')
    //   let a = []
    //   for (let i = 0; i < newstr.length; i++) {
    //     a.push(newstr[i].split('.')[1])
    //   }
    //   return {select: a, where: list}
    // }
    newSqlAttrList (newArr, oldArr) {
      var result = []
      for (var i = 0; i < newArr.length; i++) {
        var obj = newArr[i]
        var num = obj.param_name
        var flag = false
        for (var j = 0; j < oldArr.length; j++) {
          var aj = oldArr[j]
          var n = aj.param_name
          if (n === num) {
            flag = true
            break
          }
        }
        if (!flag) {
          result.push(obj)
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scope>
.create {
  // height: 100%;
  padding: 20px;
  background-color: #e8e8e8;
  .header {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    .el-button {
      margin-right: 30px;
    }
  }
  .create-api {
    .font-size {
      font-size: 16px;
      border-bottom: 1px solid $grey6;
    }
  }
}
</style>
