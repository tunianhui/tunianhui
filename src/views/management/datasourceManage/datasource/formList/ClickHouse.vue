<!--
 * @Author: 大炸鹅
 * @Date: 2023-08-01 15:33:32
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-04 15:28:36
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\formList\ClickHouse.vue
-->
<template>
  <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="地址" prop="jdbcurl" :rules="{required: true, message: '请输入地址'}">
      <el-input v-model="dialogForm.jdbcurl" placeholder="例如：127.0.0.1:10000，默认使用JDBC协议" @input="input"></el-input>
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
  </el-form>
</template>

<script>
export default {
  name: 'ClickHouse',
  data() {
    return {
      dialogForm: {
        jdbcurl: '',
        jdbcuser: '',
        jdbcpassword: ''
      },
      rules: {}
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.dialogForm = {
          jdbcurl: val.jdbcurl || '',
          jdbcuser: val.jdbcuser || '',
          jdbcpassword: val.jdbcpassword || ''
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
  }
}
</script>