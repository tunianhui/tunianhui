<template>
  <section class="api-attr">
    <header class="mb-10">属性</header>
    <div class="pr-15 pl-15">
      <el-form :model="apiAttrForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" label-suffix="：">
        <el-form-item label="API ID" prop="id">
          <template>
            <span>{{apiAttrForm.id}}</span>
          </template>
        </el-form-item>
        <el-form-item label="API 名称" prop="api_name">
          <el-input v-if="flag==='add' || flag==='edit'" v-model="apiAttrForm.api_name" maxlength="60" show-word-limit placeholder="支持汉字，数字，英文，下划线，且只能以英文或汉字开头，4~50个字符"></el-input>
          <span v-if="flag==='detail'">{{apiAttrForm.api_name}}</span>
        </el-form-item>
        <el-form-item label="API 分组" prop="api_group">
          <el-select v-model="apiAttrForm.api_group" placeholder="请选择API分组" v-if="flag==='add'||flag==='edit'">
            <el-option :label="item.group_name" :value="item.group_name" v-for="item in apiGroupList" :key="item.group_name"></el-option>
          </el-select>
          <span v-if="flag==='detail'">{{apiAttrForm.api_group_name}}</span>
        </el-form-item>
        <el-form-item label="API Path" prop="api_path">
          <el-input v-if="flag==='add' || flag==='edit'" v-model="apiAttrForm.api_path" maxlength="200" show-word-limit></el-input>
          <span v-if="flag==='detail'">{{apiAttrForm.api_path}}</span>
        </el-form-item>
        <el-form-item label="协议" prop="api_protocol">
          <el-checkbox-group v-model="apiAttrForm.api_protocol" v-if="flag==='add' || flag==='edit'">
            <el-checkbox label="http" name="api_protocol"></el-checkbox>
            <el-checkbox label="https" name="api_protocol"></el-checkbox>
          </el-checkbox-group>
          <span v-if="flag==='detail'">{{apiAttrForm.api_protocol.toString()}}</span>
        </el-form-item>
        <el-form-item label="请求方式" prop="api_request_type">
          <el-select v-model="apiAttrForm.api_request_type" placeholder="请选择请求方式" v-if="flag==='add' || flag==='edit'">
            <el-option label="GET" value="POST"></el-option>
            <el-option label="POST" value="GEt"></el-option>
          </el-select>
          <span v-if="flag==='detail'">{{apiAttrForm.api_request_type}}</span>
        </el-form-item>
        <el-form-item label="返回类型" prop="api_reponse_type">
          <el-select v-model="apiAttrForm.api_reponse_type" placeholder="请选择返回类型" v-if="flag==='add' || flag==='edit'">
            <el-option label="JSON" value="JSON"></el-option>
          </el-select>
          <span v-if="flag==='detail'">{{apiAttrForm.api_reponse_type}}</span>
        </el-form-item>
        <el-form-item label="描述" prop="api_remark">
          <el-input type="textarea" v-model="apiAttrForm.api_remark" maxlength="2000" show-word-limit rows="5" v-if="flag==='add' || flag==='edit'"></el-input>
          <span v-if="flag==='detail'">{{apiAttrForm.api_remark}}</span>
        </el-form-item>
        <el-form-item label="数据源名称" prop="source_name">
          <span>{{apiAttrForm.source_name}}</span>
        </el-form-item>
        <el-form-item label="数据源类型" prop="source_type">
          <span>{{apiAttrForm.source_type}}</span>
        </el-form-item>
        <el-form-item label="API 类型" prop="api_type">
          {{apiAttrForm.api_type}}
        </el-form-item>
        <el-form-item label="负责人" prop="creator">
          {{apiAttrForm.creator}}
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          {{apiAttrForm.create_time}}
        </el-form-item>
        <el-form-item label="最后修改人" prop="update_person">
          {{apiAttrForm.update_person}}
        </el-form-item>
        <el-form-item label="最后修改时间" prop="update_time">
          {{apiAttrForm.update_time}}
        </el-form-item>
        <el-form-item label="sql" prop="sql_template">
          <MonacoEditor style="height: 500px" :code.sync="apiAttrForm.sql_template"></MonacoEditor>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import { getApiGroup } from '@/api/server/server.js'
import { mapGetters } from 'vuex'
export default {
  name: 'ApiAttr',
  props: {
    rowData: {
      type: Object,
      default: () => { }
    },
    flag: {
      type: String
    }
  },
  watch: {
    rowData: {
      handler (val) {
        if (JSON.stringify(val) !== JSON.stringify({})) {
          // this.apiAttrForm.id = val.id
          // this.apiAttrForm.api_name = val.api_name
          // this.apiAttrForm.api_group = val.api_group
          // this.apiAttrForm.api_group_name = val.api_group_name
          // this.apiAttrForm.api_path = val.api_path
          // this.apiAttrForm.api_protocol = val.api_protocol
          // this.apiAttrForm.api_request_type = val.api_request_type
          // this.apiAttrForm.api_reponse_type = val.api_reponse_type
          // this.apiAttrForm.api_remark = val.api_remark
          // this.apiAttrForm.api_type = val.api_type
          // this.apiAttrForm.creator = val.creator
          // this.apiAttrForm.create_time = val.create_time
          // this.apiAttrForm.update_person = val.update_person
          // this.apiAttrForm.update_time = val.update_time
          // this.apiAttrForm.sql_template = val.sql_template
          // this.apiAttrForm.source_name = val.source_name
          // this.apiAttrForm.source_type = val.source_type
        }
      },
      deep: true,
      immediate: true
    },
    apiAttrForm: {
      handler (val) {
        this.$emit('editRow', { data: val, flag: 'attr' })
      },
      deep: true
    }
  },
  data () {
    return {
      apiAttrForm: {
        id: '',
        api_name: '',
        api_group: '',
        api_group_name: '',
        api_path: '',
        api_protocol: [],
        api_request_type: '',
        api_reponse_type: '',
        api_remark: '',
        api_type: '',
        creator: '',
        create_time: '',
        update_person: '',
        update_time: '',
        sql_template: ''
      },
      rules: {
        api_name: [
          { required: true, message: '请输入API名称' },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: 'API名称至多60个字符，允许中、文数字、字母、下划线, 不能以下划线开头或结尾',
            trigger: ['blur', 'change']
          }
        ],
        api_group: [
          { required: true, message: '请输入API路径' },
          {
            pattern: /^(\/\w+)+/,
            message: '输入以/开头的路径，如/abc',
            trigger: ['blur', 'change']
          }
        ],
        api_path: [
          { required: true, message: '请选择分组', trigger: ['blur', 'change'] }
        ],
        api_request_type: [
          { required: true, message: '请选择请求方式', trigger: ['blur', 'change'] }
        ],
        api_reponse_type: [
          { required: true, message: '请选择返回类型', trigger: ['blur', 'change'] }
        ],
        api_protocol: [
          { type: 'array', required: true, message: '请至少选择一个协议', trigger: 'change' }
        ],
        api_remark: [
          { required: true, message: '请填写API描述信息', trigger: 'blur' }
        ]
      },
      apiGroupList: []
    }
  },
  computed: {
    ...mapGetters([
      'project'
    ])
  },
  created () {
    this.getApiGroup()
  },
  methods: {
    async getApiGroup () {
      const params = { project_id: this.project.project_id }
      const res = await this.$simpleAsyncTo(getApiGroup(params), '获取分组列表失败')
      if (res) {
        this.apiGroupList = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.api-attr {
  height: 100%;
  overflow-y: auto;
  header {
    border-bottom: 1px solid $grey5;
    padding: 10px 20px;
    font-weight: 900;
  }
}
</style>
