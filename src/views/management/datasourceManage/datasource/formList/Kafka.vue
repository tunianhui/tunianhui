<!--
 * @Author: 大炸鹅
 * @Date: 2023-08-04 16:09:37
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-07 21:01:00
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\formList\Kafka.vue
-->
<template>
  <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
    <el-form-item
      label="连接地址"
      prop="http_urls"
      :rules="{required: true, message: '请输入连接地址'}"
    >
      <el-input v-model="dialogForm.http_urls" placeholder="请填写kafka集群地址，如ip:port,ip:port,ip:port" @input="input"></el-input>
    </el-form-item>
    <el-form-item
      label="Zookeeper地址"
      prop="zookeeper"
      :rules="{required: true, message: '请输入连接地址'}"
    >
      <el-input v-model="dialogForm.zookeeper" placeholder="请填写zookeeper" @input="input"></el-input>
    </el-form-item>
    <el-form-item label="认证方式" prop="auth_method" :rules="{required: true, message: '认证方式'}">
      <el-radio-group v-model="dialogForm.auth_method" @change="changeKerberosenable">
        <el-radio label="0">无认证</el-radio>
        <el-radio label="1">Kerberos</el-radio>
        <el-radio label="2">用户名+密码</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="dialogForm.auth_method == '1'">
      <el-form-item label="Krb5文件" prop="krb5path">
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
      <el-form-item label="Keytab文件" prop="keytabpath">
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
      <el-form-item label="hive.login.keytab" prop="loginkeytab" :rules="{required: true, message: '请输入'}">
        <el-input
          v-model="dialogForm.loginkeytab"
          @input="input"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="hive.principal" prop="principal" :rules="{required: true, message: '请输入'}">
        <el-input
          v-model="dialogForm.principal"
          @input="input"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="Jaas文件" prop="jaasPath">
        <el-upload
          v-if="dialogForm.jaasType === '0'"
          style="display:inline-block"
          action=""
          :limit="1"
          :auto-upload="false"
          :on-success="jaasPathUpSuccess"
          :onChange="jaasPathUploadChange"
          :file-list="jaasPathList">
          <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
        </el-upload>
        <el-input
          v-if="dialogForm.jaasType === '1'"
          v-model="dialogForm.jaasPath"
          @input="input"
          placeholder="请输入jaasPath地址"
          style="width: 60%"
        ></el-input>
        <el-button type="text" class="ml-10" @click="jaasPathClick">切换为KDC地址配置</el-button>
        <p v-if="!jaasPathList.length">{{dialogForm.jaasPath}}</p>
      </el-form-item>
    </template>
    <template v-if="dialogForm.auth_method == '2'">
      <el-form-item
        label="用户名"
        prop="user"
        @input="input"
        :rules="{required: true, message: '请输入用户名'}"
      >
        <el-input v-model="dialogForm.user" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :rules="{required: true, message: '请输入密码'}">
        <el-input
          type="password"
          @input="input"
          autocomplete="new-password"
          v-model="dialogForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </template>
    <el-form-item label="SSL加密" prop="sslenable" :rules="{required: true, message: 'Kerberosenable'}">
      <el-radio-group v-model="dialogForm.sslenable" @change="changeSslenable">
        <el-radio label="0">关闭</el-radio>
        <el-radio label="1">开启</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Kafka',
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
  data() {
    return {
      krb5pathList: [],
      keytabpathList: [],
      jaasPathList: [],
      dialogForm: {
        http_urls: '',
        zookeeper: '',
        auth_method: '0',
        krb5path: '',
        krb5type: '0',
        keytabpath: '',
        keytabtype: '0',
        loginkeytab: '',
        principal: '',
        jaasType: '0',
        jaasPath: '',
        sslenable: '1',
        user: '',
        password: ''
      },
      rules: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.initDialogForm(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initDialogForm(data) {
      this.dialogForm.sslenable = data.sslenable || '1'
      this.dialogForm.http_urls = data.http_urls || ''
      this.dialogForm.zookeeper = data.zookeeper || ''
      if (data.auth_method === '0') {
        this.dialogForm.auth_method = '0'
      } else if (data.auth_method === '1') {
        this.dialogForm.auth_method = '1'
        this.dialogForm.krb5path = data.krb5path || ''
        this.dialogForm.krb5type = data.krb5type || '0'
        this.dialogForm.keytabpath = data.keytabpath || ''
        this.dialogForm.keytabtype = data.keytabtype || '0'
        this.dialogForm.loginkeytab = data.loginkeytab || ''
        this.dialogForm.principal = data.principal || ''
        this.dialogForm.jaasType = data.jaasType || '0'
        this.dialogForm.jaasPath = data.jaasPath || ''
        this.krb5pathList = data.krb5pathList || []
        this.keytabpathList = data.keytabpathList || []
        this.jaasPathList = data.jaasPathList || []
      } else if (data.auth_method === '2') {
        this.dialogForm.auth_method = '2'
        this.dialogForm.user = data.user || ''
        this.dialogForm.password = data.password || ''
      }
    },
    input() {
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    },
    changeKerberosenable() {
      this.krb5pathList = []
      this.dialogForm.krb5path = ''
      this.dialogForm.keytabpath = ''
      this.keytabpathList = []
      this.dialogForm.loginkeytab = ''
      this.dialogForm.principal = ''
      this.dialogForm.jaasPath = ''
      this.jaasPathList = []
      this.dialogForm.jaasType = '0'
      this.dialogForm.krb5type = '0'
      this.dialogForm.keytabtype = '0'
      this.dialogForm.metajdbcuser = ''
      this.dialogForm.metajdbcpassword = ''
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    },
    krb5pathUpSuccess() {},
    krb5pathUploadChange(file, fileList) {
      this.krb5pathList = fileList
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    },
    keytabpathUpSuccess() {},
    keytabpathUploadChange(file, filelist) {
      this.keytabpathList = filelist
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
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
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
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
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    },
    jaasPathUpSuccess() {},
    jaasPathUploadChange(file, filelist) {
      this.jaasPathList = filelist
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    },
    jaasPathClick() {
      this.dialogForm.jaasPath = ''
      this.jaasPathList = []
      if (this.dialogForm.jaasType === '0') {
        this.dialogForm.jaasType = '1'
      } else {
        this.dialogForm.jaasType = '0'
      }
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    },
    changeSslenable() {
      this.$emit('change', {
        ...this.dialogForm,
        krb5pathList: this.krb5pathList,
        keytabpathList: this.keytabpathList,
        jaasPathList: this.jaasPathList
      })
    }
  }
}
</script>