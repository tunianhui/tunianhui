<template>
  <div class="flow-wrapper">
    <div v-if="show" class="auto-edit">
      <header class="flex-layout mb-20">
        <span>服务编排</span>
      </header>

      <el-form :label-position="labelPosition" label-width="80px" ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="API 名称" prop="api_name">
          <el-input v-model="form.api_name" placeholder="支持汉字、数字、英文、下划线，且不能以下划线开头" show-word-limit maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="API 分组" prop="api_group">
          <el-select v-model="form.api_group" placeholder="请选择API分组">
            <el-option v-for="item in groupList" :key="item.id" :label="item.group_name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="API Path" prop="api_path">
          <el-input v-model="form.api_path" show-word-limit maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-radio v-model="form.protocol" label="1">http</el-radio>
          <el-radio v-model="form.protocol" label="2">https</el-radio>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返回类型" prop="api_reponse_type">
          <el-select v-model="form.api_reponse_type" placeholder="请选择返回类型">
            <el-option label="JSON" value="JSON"></el-option>
            <el-option label="XML" value="XML"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="api_remark">
          <el-input v-model="form.api_remark" type="textarea" placeholder="请输入" show-word-limit maxlength="2000" rows="5"></el-input>
        </el-form-item>
        <el-form-item prop>
          <div style="text-align:center">
            <el-button type="primary" @click="nextStep('ruleForm')">下一步</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 服务编排 流程编排 -->
    <transition name="fadeinleft" mode="out-in">
      <Flow v-if="!show"></Flow>
    </transition>

    <!-- 请求参数 & 返回参数 右栏采用这里赋值？ -->

  </div>
</template>
<script>
import {
  getApiGroup
} from '@/api/server/server.js'
import Flow from '../../serve-dev/index'
import { mapGetters } from 'vuex'
export default {
  name: 'ArrangeEdit',
  components: { Flow },
  data () {
    return {
      show: true,
      labelPosition: 'right',
      groupList: [],
      form: {
        api_name: '',
        api_group: '',
        api_path: '',
        protocol: '',
        method: '',
        type: '',
        description: ''
      },
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

      // 提交数据
      mockJson: {
        'api_name': '测试流程编排',
        'api_group': 'd9482ac2e74a4e0c9286c4c77cad7436',
        'api_path': '/bp/test5',
        'api_protocol': ['http'],
        'api_request_type': 'POST',
        'api_reponse_type': 'JSON',
        'api_remark': '测试流程编排',
        'projectId': '7a2fda0ca17f4d179820d9c686350af5',
        'version': '1',
        'where': [
          {
            'param_name': 'ipassigntype_id',
            'param_type': 'string',
            'is_require': 'true',
            'demo_value': '1',
            'default_value': '1',
            'remark': '1'
          }
        ],
        'select': [
          {
            'param_name': 'dbl',
            'param_type': 'string',
            'demo_value': '2',
            'remark': '2'
          }
        ],
        'layout': [
          {
            'name': 'c54b15f9384f4924a1edd90c7c196683',
            'taskReferenceName': 'ip',
            'type': 'SIMPLE',
            'inputParameters': { 'ipassigntype_id': '$.begin.ipassigntype_id' },
            'outputParameters': { 'phone_number': '$.data[0].mergeipv4count_last1Day_all' }
          },
          {
            'name': '70ab440aa7ee4ba087ac019bea006a03',
            'taskReferenceName': 'phone',
            'type': 'SIMPLE',
            'inputParameters': { 'phone_number': '$.ip.phone_number' },
            'outputParameters': { 'dbl': '$.data[0].downstream_bytes_last1day' }
          }
        ],
        'flow': 'flow data'
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created () {
    this.getApiGroup()
  },
  methods: {
    // 服务编排
    nextStep (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.show = false
          // 编排保存
        }
      })
    },

    // 取消
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ name: 'arrange' })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-wrapper {
  height: 100%;
  width: 100%;
  background-color: #e8e8e8;
}
.auto-edit {
  padding: 20px;
  height: 100%;
}
</style>
