<!--
 * @Author: 大炸鹅
 * @Date: 2023-08-01 17:00:03
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-08 16:34:26
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\formList\Hive.vue
-->
<template>
  <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
    <div>集群配置</div>
    <el-form-item
      label="Name Node"
      prop="name_nodes"
      :rules="{required: true, message: '请输入Name Node'}"
    >
      <el-input
        @input="input"
        v-model="dialogForm.name_nodes"
        placeholder="如：hostname:port或者ip:port；支持多项配置，分号分隔"
      ></el-input>
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
    <div>Hive配置</div>
    <el-form-item
      label="JDBC URL"
      prop="jdbcurl"
      :rules="{required: true, message: '请输入hive的JDBC连接地址，如host:port/db'}"
    >
      <el-input
        @input="input"
        v-model="dialogForm.jdbcurl"
        placeholder="请输入hive的JDBC连接地址，如host:port/db"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="用户名"
      prop="jdbcuser"
    >
      <el-input v-model="dialogForm.jdbcuser" placeholder="请输入用户名" @input="input"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        type="jdbcpassword"
        autocomplete="new-password"
        v-model="dialogForm.jdbcpassword"
        @input="input"
        placeholder="请输入鉴权密码，为保证任务正常执行，请确保有所需数据权限"
      ></el-input>
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
    <div>元数据库配置</div>
    <el-form-item
      label="数据库类型"
      prop="meta_type"
      :rules="[{required: true, message: '请选择元数据库类型'}]"
    >
      <el-select v-model="dialogForm.meta_type" @change="input">
        <el-option
          v-for="(item,index) in databaseTypeList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="JDBC URL"
      prop="metajdbcurl"
      :rules="{required: true, message: '请输入JDBC URL'}"
    >
      <el-input
        v-model="dialogForm.metajdbcurl"
        @input="input"
        placeholder="请输入JDBC连接地址，如jdbc:mysql://host:port/dbname"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="用户名"
      prop="metajdbcuser"
      @input="input"
      :rules="{required: true, message: '请输入鉴权用户名，为保证任务正常执行，请确保有所需数据权限'}"
    >
      <el-input v-model="dialogForm.metajdbcuser" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="metajdbcpassword" :rules="{required: true, message: '请输入密码'}">
      <el-input
        type="password"
        @input="input"
        autocomplete="new-password"
        v-model="dialogForm.metajdbcpassword"
        placeholder="请输入鉴权密码，为保证任务正常执行，请确保有所需数据权限"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Hive',
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
        this.initDialogForm(val)
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      krb5pathList: [],
      keytabpathList: [],
      databaseTypeList: [{label: 'MySQL', value: 'MySQL'}],
      dialogForm: {
        name_nodes: '',
        Kerberosenable: '0',
        krb5type: '0',
        keytabtype: '0',
        krb5path: '',
        keytabpath: '',
        jdbcurl: '',
        jdbcuser: '',
        jdbcpassword: '',
        loginkeytab: '',
        principal: '',
        meta_type: '',
        metajdbcurl: '',
        metajdbcuser: '',
        metajdbcpassword: ''
      },
      rules: {}
    }
  },
  methods: {
    // 初始化dialogForm
    initDialogForm(data) {
      this.dialogForm.name_nodes = data.name_nodes || ''
      this.dialogForm.Kerberosenable = data.Kerberosenable || '0'
      this.dialogForm.krb5type = data.krb5type || '0'
      this.dialogForm.keytabtype = data.keytabtype || '0'
      this.dialogForm.krb5path = data.krb5path || ''
      this.dialogForm.keytabpath = data.keytabpath || ''
      this.dialogForm.jdbcurl = data.jdbcurl || ''
      this.dialogForm.jdbcuser = data.jdbcuser || ''
      this.dialogForm.jdbcpassword = data.jdbcpassword || ''
      this.dialogForm.loginkeytab = data.loginkeytab || ''
      this.dialogForm.principal = data.principal || ''
      this.dialogForm.meta_type = data.meta_type || ''
      this.dialogForm.metajdbcurl = data.metajdbcurl || ''
      this.dialogForm.metajdbcuser = data.metajdbcuser || ''
      this.dialogForm.metajdbcpassword = data.metajdbcpassword || ''
      this.krb5pathList = data.krb5pathList || []
      this.keytabpathList = data.keytabpathList || []
    },
    krb5pathUpSuccess() {},
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
    input() {
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList
      })
    }
  }
}
</script>