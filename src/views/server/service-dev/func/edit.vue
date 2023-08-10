<template>
  <section class="create func-server-detail">
    <header class="flex-layout mb-20">
      <span class>新建Python函数</span>
    </header>

    <div style="padding:0 30px;" class="create-func">
      <transition name="fadeinleft" mode="out-in">
        <el-form :model="createForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：" v-if="show">
          <el-form-item label="函数名称" prop="func_name">
            <el-input v-model="createForm.func_name" maxlength="256" show-word-limit placeholder="函数名称"></el-input>
          </el-form-item>
          <el-form-item label="函数模板" prop="func_template">
            <el-select v-model="createForm.func_template" placeholder="请选择函数模板">
              <el-option label="Python3 Standard v1" value="Python3 Standard v1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行环境" prop="func_environment">
            <el-select v-model="createForm.func_environment" placeholder="请选择运行环境">
              <el-option label="Python 3.0" value="Python 3.0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="函数描述" prop="func_remark">
            <el-input type="textarea" v-model="createForm.func_remark" maxlength="512" show-word-limit rows="5"></el-input>
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
            <div style="text-algin:start" class="font-size">编辑代码</div>
          </el-form-item>
          <el-form-item label-width="0">
            <MonacoEditor style="height: 250px" :code.sync="writeSqlForm.sql_template"></MonacoEditor>
          </el-form-item>

          <el-form-item label-width="0">
            <div style="text-algin:start" class="font-size">环境配置</div>
          </el-form-item>
          <el-form-item label="超时时间" prop="time_out">
            <el-input v-model.number="writeSqlForm.time_out" style="width:30%" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          </el-form-item>

          <!-- 测试 & 发布 -->
          <!-- <el-form-item label-width="0">
            <div style="text-algin:start" class="font-size">运行日志/运行结果</div>
          </el-form-item> -->

          <!-- <div class="content">
            <div>
              运行状态：执行成功
            </div>
            <div>响应时间(RT):1ms</div>
            <div>输入参数：</div>
          </div> -->
        </el-form>
      </transition>
    </div>
  </section>
</template>

<script>
import {
  getDataSource
} from '@/api/server/server.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Func',
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
        func_name: '',
        func_template: '',
        func_environment: '',
        func_remark: ''
      },
      writeSqlForm: {
        source_type: '',
        source_name: '',
        overtime: '',
        time_out: '',
        sql_template: ''
      },
      rowData: {},
      rules: {
        func_name: [
          { required: true, message: '请输入函数名称' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message:
              '函数名称至多60个字符，允许中、文数字、字母、下划线, 不能以下划线开头或结尾',
            trigger: ['blur', 'change']
          }
        ],
        func_template: [
          { required: true, message: '请选择分组', trigger: ['blur', 'change'] }
        ],
        func_environment: [
          { required: true, message: '请选择分组', trigger: ['blur', 'change'] }
        ],
        func_remark: [
          { required: true, message: '请填写函数描述信息', trigger: 'blur' }
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
        time_out: [
          { required: true, message: '请输入超时时间', trigger: ['blur', 'change'] },
          // {type: 'number', message: '超时时间必须为数字值'}
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
          this.createForm.func_name = val.func_name
          this.createForm.func_remark = val.func_remark
          this.whereList = val.where
          this.selectList = val.select
        } else {
          this.rowData = val
          this.flag = 'add'
        }
      }
    }
  },
  created () {

  },
  methods: {
    // 函数
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
      this.$router.push({ name: 'func' })
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

    releasefuncHandle () {
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
          this.globalLoading().close()
        }
      })
    },
    async getGenerateParams () {

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
  height: 100%;
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
  .create-func {
    .font-size {
      font-size: 16px;
      border-bottom: 1px solid $grey6;
    }
  }
}
</style>
