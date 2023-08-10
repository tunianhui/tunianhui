<!--
 * @Author: 大炸鹅
 * @Date: 2023-08-01 16:35:43
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-04 16:08:29
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\formList\Hdfs.vue
-->
<template>
  <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
    <el-form-item label="DefaultFS" prop="jdbcurl" :rules="{required: true, message: '请输入defaultFS'}">
      <el-input v-model="dialogForm.jdbcurl" placeholder="格式：hdfs://ServerIP:Port" @input="input"></el-input>
    </el-form-item>
    <el-form-item label="Kerberos" prop="Kerberosenable" :rules="{required: true, message: 'Kerberosenable'}">
      <el-radio-group v-model="dialogForm.Kerberosenable" @change="changeKerberosenable">
        <el-radio label="1">开启</el-radio>
        <el-radio label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Krb5文件" prop="krb5path" v-if="dialogForm.Kerberosenable !== '0'">
      <el-upload
        v-if="dialogForm.krb5type === '0'"
        style="display:inline-block"
        action=""
        :limit="1"
        :auto-upload="false"
        :on-success="krb5pathUpSuccess"
        :onChange="krb5pathUploadChange"
        :file-list="krb5pathList">
        <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
      </el-upload>
      <el-input
        v-if="dialogForm.krb5type === '1'"
        v-model="dialogForm.krb5path"
        placeholder="请输入krb5path地址"
        @input="input"
        style="width: 60%"
      ></el-input>
      <el-button type="text" class="ml-10" @click="krb5typeClick">切换为KDC地址配置</el-button>
      <p v-if="!krb5pathList.length">{{dialogForm.krb5path}}</p>
    </el-form-item>
    <el-form-item label="Keytab文件" prop="keytabpath" v-if="dialogForm.Kerberosenable !== '0'">
      <el-upload
        v-if="dialogForm.keytabtype === '0'"
        style="display:inline-block"
        action=""
        :limit="1"
        :auto-upload="false"
        :on-success="keytabpathUpSuccess"
        :onChange="keytabpathUploadChange"
        :file-list="keytabpathList">
        <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
      </el-upload>
      <el-input
        v-if="dialogForm.keytabtype === '1'"
        v-model="dialogForm.keytabpath"
        @input="input"
        placeholder="请输入keytabpath地址"
        style="width: 60%"
      ></el-input>
      <el-button type="text" class="ml-10" @click="keytabpathClick">切换为KDC地址配置</el-button>
      <p v-if="!keytabpathList.length">{{dialogForm.keytabpath}}</p>
    </el-form-item>
    <el-form-item label="hive.login.keytab" prop="loginkeytab" :rules="{required: true, message: '请输入'}" v-if="dialogForm.Kerberosenable !== '0'">
      <el-input
        v-model="dialogForm.loginkeytab"
        @input="input"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
    <el-form-item label="hive.principal" prop="principal" :rules="{required: true, message: '请输入'}" v-if="dialogForm.Kerberosenable !== '0'">
      <el-input
        v-model="dialogForm.principal"
        @input="input"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Hdfs',
  data() {
    return {
      krb5pathList: [],
      keytabpathList: [],
      dialogForm: {
        jdbcurl: '',
        Kerberosenable: '0',
        krb5type: '0',
        keytabtype: '0',
        krb5path: '',
        keytabpath: '',
        loginkeytab: '',
        principal: ''
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
        // this.dialogForm = val
        this.dialogForm.jdbcurl = val.jdbcurl || ''
        this.dialogForm.Kerberosenable = val.Kerberosenable || '0'
        this.dialogForm.krb5type = val.krb5type || '0'
        this.dialogForm.keytabtype = val.keytabtype || '0'
        this.dialogForm.krb5path = val.krb5path || ''
        this.dialogForm.keytabpath = val.keytabpath || ''
        this.dialogForm.loginkeytab = val.loginkeytab || ''
        this.dialogForm.principal = val.principal || ''
        this.krb5pathList = val.krb5pathList || []
        this.keytabpathList = val.keytabpathList || []
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    input(val) {
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    },
    changeKerberosenable(val) {
      this.krb5pathList = []
      this.dialogForm.krb5path = ''
      this.dialogForm.keytabpath = ''
      this.keytabpathList = []
      this.dialogForm.loginkeytab = ''
      this.dialogForm.principal = ''
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    },
    krb5pathUpSuccess() {},
    krb5pathUploadChange(file, fileList) {
      this.krb5pathList = fileList
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    },
    krb5typeClick() {
      this.dialogForm.krb5path = ''
      this.krb5pathList = []
      if (this.dialogForm.krb5type === '0') {
        this.dialogForm.krb5type = '1'
      } else {
        this.dialogForm.krb5type = '0'
      }
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    },
    keytabpathUpSuccess() {},
    keytabpathUploadChange(file, filelist) {
      this.keytabpathList = filelist
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    },
    keytabpathClick() {
      this.dialogForm.keytabpath = ''
      this.keytabpathList = []
      if (this.dialogForm.keytabtype === '0') {
        this.dialogForm.keytabtype = '1'
      } else {
        this.dialogForm.keytabtype = '0'
      }
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    },
  }
}
</script>