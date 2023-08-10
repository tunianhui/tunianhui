<!--
 * @Author: 大炸鹅
 * @Date: 2023-08-01 11:42:45
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-04 15:43:23
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\formList\Elasticsearch.vue
-->
<template>
  <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <template v-if="version.indexOf('5') > -1 || version.indexOf('6') > -1">
      <el-form-item
        label="HTTP地址"
        prop="http_urls"
        :rules="{required: true, message: '请输入HTTP地址'}"
      >
        <el-input v-model="dialogForm.http_urls" placeholder="例如127.0.0.1:9200,可填写多个地址，用英文逗号分隔" @input="input"></el-input>
      </el-form-item>
      <el-form-item
        label="TCP地址"
        prop="tcp_urls"
        :rules="{required: true, message: '请输入TCP地址'}"
      >
        <el-input v-model="dialogForm.tcp_urls" placeholder="例如127.0.0.1:9300,可填写多个地址，用英文逗号分隔" @input="input"></el-input>
      </el-form-item>
      <el-form-item
        label="集群名称"
        prop="cluster_name"
        :rules="{required: true, message: '请输入集群名称'}"
      >
        <el-input v-model="dialogForm.cluster_name" placeholder="请输入集群名称" @input="input"></el-input>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item
        label="HTTP地址"
        prop="http_urls"
        :rules="{required: true, message: '请输入HTTP地址'}"
      >
        <el-input v-model="dialogForm.http_urls" placeholder="例如127.0.0.1:9200,可填写多个地址，用英文逗号分隔" @input="input"></el-input>
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="jdbcuser"
        :rules="{required: true, message: '请输入用户名'}">
        <el-input v-model="dialogForm.jdbcuser" placeholder="请输入用户名" @input="input"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="jdbcpassword"
        :rules="{required: true, message: '请输入密码'}">
        <el-input
          @input="input"
          type="password"
          autocomplete="new-password"
          v-model="dialogForm.jdbcpassword"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="集群名称"
        prop="cluster_name"
        :rules="{required: true, message: '请输入集群名称'}"
      >
        <el-input v-model="dialogForm.cluster_name" placeholder="请输入集群名称" @input="input"></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: 'Elasticsearch',
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      dialogForm: {
        http_urls: '',
        tcp_urls: '',
        cluster_name: ''
      },
      rules: {}
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    version: String
  },
  watch: {
    value: {
      handler(val) {
        if (this.version.indexOf('5') > -1 || this.version.indexOf('6') > -1) {
          this.dialogForm = {
            http_urls: val.http_urls || '',
            tcp_urls: val.tcp_urls || '',
            cluster_name: val.cluster_name || ''
          }
        } else {
          this.dialogForm = {
            http_urls: val.http_urls || '',
            jdbcuser: val.jdbcuser || '',
            jdbcpassword: val.jdbcpassword || '',
            cluster_name: val.cluster_name || ''
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    input(val) {
      this.$emit('change', this.dialogForm)
    }
  },
  created() {
    this.dialogForm = this.value
    this.rules = {
      http_urls: [
        { required: true, message: '请输入HTTP地址', trigger: ['blur', 'change'] }
      ],
      tcp_urls: [
        { required: true, message: '请输入TCP地址', trigger: ['blur', 'change'] }
      ],
      cluster_name: [
        { required: true, message: '请输入集群名称', trigger: ['blur', 'change'] }
      ]
    }
  },

}
</script>