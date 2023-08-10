
<template>
  <section class="create api-server-detail">
    <header class="flex-layout mb-20">
      <span class>注册 API</span>
    </header>

    <div style="padding:0 30px;" class="create-api">
      <transition name="fadeinleft" mode="out-in">
        <el-form :model="createForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：" v-if="show">
          <el-form-item label="API 名称" prop="api_name">
            <el-input v-model="createForm.api_name" maxlength="60" show-word-limit placeholder="支持汉字，数字，英文，下划线，且不能以下划线开头"></el-input>
          </el-form-item>
          <el-form-item label="API 分组" prop="api_group">
            <el-select v-model="createForm.api_group" placeholder="请选择API分组">
              <el-option :label="item.group_name" :value="item.id" v-for="item in groupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="API Path" prop="api_path">
            <el-input v-model="createForm.api_path" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="协议" prop="api_protocol">
            <el-checkbox-group v-model="createForm.api_protocol">
              <el-checkbox label="http" name="api_protocol"></el-checkbox>
              <el-checkbox label="https" name="api_protocol"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="请求方式" prop="api_request_type">
            <el-select v-model="createForm.api_request_type" placeholder="请选择请求方式">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返回类型" prop="api_reponse_type">
            <el-select v-model="createForm.api_reponse_type" placeholder="请选择返回类型">
              <el-option label="JSON" value="JSON"></el-option>
              <el-option label="XML" value="XML"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="api_remark">
            <el-input type="textarea" v-model="createForm.api_remark" maxlength="2000" show-word-limit rows="10"></el-input>
          </el-form-item>
          <el-form-item prop>
            <div style="text-align:center">
              <el-button type="primary" @click="nextStep('ruleForm')">下一步</el-button>
              <el-button @click="resetForm('ruleForm')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </transition>

      <!-- Sql -->
      <transition name="fadeinleft" mode="out-in">
        <el-form :model="writeSqlForm" :rules="rulesWriteSqlForm" ref="writeSqlForm" label-width="130px" class="demo-ruleForm" label-suffix="：" v-show="!show">
          <div class="btn-wrapper">
            <el-button type="primary" @click="publish">发布</el-button>
          </div>
          <el-form-item label-width="0">
            <div style="text-algin:start" class="font-size">后端服务定义</div>
          </el-form-item>
          <el-form-item label="后台服务 Host" prop="host">
            <el-input v-model="writeSqlForm.host"></el-input>
            <div class="tips mb-10">以http://或https://开头，并且不包含Path</div>
          </el-form-item>
          <el-form-item label="后台服务 Path" prop="Path">
            <el-input v-model="writeSqlForm.path" maxlength="200"></el-input>
            <div class="tips">支持英文，数字，下划线，连接符(-)，且只能/开头，不超过200字符</div>
            <div class="tips">后台服务Path中若包含请求参数中的Parameter Path，参数要放在[]中，如/user/[userid]</div>
          </el-form-item>
          <el-form-item label="超时时间" prop="time_out">
            <el-input v-model.number="writeSqlForm.time_out" style="width:30%" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            <span>ms</span>
          </el-form-item>
          <el-form-item label-width="0">
            <div style="text-algin:start;justify-content: space-between;" class="font-size flex-layout sql">
              <span>返回内容定义</span>
            </div>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="tips mb-10">返回内容示例：</div>
            <MonacoEditor style="height: 200px" :code.sync="writeSqlForm.resultSample"></MonacoEditor>
            <div class="tips">支持填写正常返回示例和异常返回示例，以供API调用者参考和编写API返回结果解析代码</div>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="tips mb-10">错误代码定义：</div>
            <MonacoEditor style="height: 200px" :code.sync="writeSqlForm.errCodeSample"></MonacoEditor>
            <div class="tips">错误定义此处填写API调用时的错误信息及解决方案，以便API调用者在遇到错误时，能够自行查找错误原因并解决。</div>
          </el-form-item>
        </el-form>
      </transition>
    </div>

    <!-- 请求参数 & 返回参数 右栏采用这里赋值？ -->

  </section>
</template>

<script>
import {
  getDataSource,
  getApiGroup,
  getSaveApi,
  getGenerateParams
} from '@/api/server/server.js'
import { mapGetters } from 'vuex'
export default {
  name: 'RegisterEdit',
  components: {
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
      createForm: {
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
        overtime: '',
        time_out: '',
        sql_template: '',
        resultSample: '', // 返回内容示例
        errCodeSample: '' // 错误代码定义
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
        resultSample: [
          { required: true, message: '请填写API描述信息', trigger: 'blur' }
        ],
        source_type: [
          {
            required: true,
            message: '请选择数据源类型',
            trigger: ['blur', 'change']
          }
        ],
        time_out: [
          { required: true, message: '请输入超时时间', trigger: ['blur', 'change'] },
          { pattern: /^[0-9]/g, message: '超时时间必须为数字值' }
        ]
      },
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
          // this.createForm.api_name = val.api_name
          // this.createForm.api_group = val.api_group
          // this.createForm.api_path = val.api_path
          // this.createForm.api_protocol = val.api_protocol
          // this.createForm.api_request_type = val.api_request_type
          // this.createForm.api_reponse_type = val.api_reponse_type
          // this.createForm.api_remark = val.api_remark
          // this.whereList = val.where
          // this.selectList = val.select
        } else {
          this.rowData = val
          this.flag = 'add'
        }
      }
    }
  },
  created () {
    this.getApiGroup()
  },
  methods: {
    // 注册API --> 下一步 生成API
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
      this.$router.push({ name: 'api-register' })
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
            ...this.createForm,
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

    // 发布
    async publish () { },

    // 生成参数
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
  .btn-wrapper {
    display: flex;
    justify-content: flex-end;
  }
  .tips {
    font-size: 12px;
    color: #666;
  }
}
</style>
