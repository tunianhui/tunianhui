<template>
  <div class="physical-datasource-dialogform">
    <el-dialog
      :visible.sync="isVisible"
      :title="title"
      width="40%"
      v-loading="isLoading"
      :before-close="handleCancel"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        label-width="140px"
        label-position="right"
        :style="{'max-height': `${dialogBodyHeight}px`,'overflow': 'auto'}"
        label-suffix="："
        @keyup.native.enter="handleConfirm"
      >
        <el-form-item
          label="数据源编码"
          prop="data_source_code"
          :rules="[{required: true, message: '请输入数据源编码'}, {
          max: 32,
          message: '数据源编码不能超过32个字',
          trigger:  ['blur', 'change']
        }]"
        >
          <el-input
            v-model="dialogForm.data_source_code"
            maxlength="32"
            show-word-limit
            placeholder="请输入数据源编码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="数据源类型"
          prop="data_source_type"
          :rules="[{required: true, message: '请选择数据源类型'}]"
        >
          <el-select v-model="dialogForm.data_source_type" @change="datasourcetypeChange">
            <el-option
              v-for="(item,index) in dataSourceTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="数据源名称"
          prop="data_source_name"
          :rules="[{required: true, message: '请输入数据源名称'}, {
          max: 32,
          message: '数据源名称不能超过32个字',
          trigger:  ['blur', 'change']
        }]"
        >
          <el-input
            v-model="dialogForm.data_source_name"
            maxlength="32"
            show-word-limit
            placeholder="请输入数据源名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据源描述" prop="data_source_desc">
          <el-input
            v-model="dialogForm.data_source_desc"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="数据源描述不能超过200个字"
          ></el-input>
        </el-form-item>
        <div v-if="dialogForm.data_source_type === 'HDFS'">
          <el-form-item
            label="DefaultFS"
            prop="url"
            :rules="{required: true, message: '请输入defaultFS'}"
          >
            <el-input v-model="dialogForm.url" placeholder="格式：hdfs://ServerIP:Port"></el-input>
          </el-form-item>
        </div>
        <div v-if="dialogForm.data_source_type === 'FTP'">
          <el-form-item
            label="Protocol"
            prop="protocol"
            :rules="{required: true, message: '请选择Protocol'}"
          >
            <el-radio-group v-model="dialogForm.protocol">
              <el-radio label="FTP">FTP</el-radio>
              <el-radio label="SFTP">SFTP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="Host"
            prop="host"
            :rules="{required: true, message: '请输入FTP的主机Host'}"
          >
            <el-input v-model="dialogForm.host" placeholder="请输入FTP的主机Host"></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="port" :rules="{required: true, message: '请输入FTP的主机端口号'}">
            <el-input v-model="dialogForm.port" placeholder="请输入Port"></el-input>
          </el-form-item>
        </div>
        <div v-if="dialogForm.data_source_type === 'Hive'">
          <div class="dialog-sub-title">集群配置</div>
          <el-form-item
            label="Name Node"
            prop="name_nodes"
            :rules="{required: true, message: '请输入Name Node'}"
          >
            <el-input
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
              :auto-upload="false"
              :on-success="keytabpathUpSuccess"
              :onChange="keytabpathUploadChange"
              :file-list="keytabpathList">
              <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
            </el-upload>
            <el-input
              v-if="dialogForm.keytabtype === '1'"
              v-model="dialogForm.keytabpath"
              placeholder="请输入keytabpath地址"
              style="width: 60%"
            ></el-input>
            <el-button type="text" class="ml-10" @click="keytabpathClick">切换为KDC地址配置</el-button>
            <p v-if="!keytabpathList.length">{{dialogForm.keytabpath}}</p>
          </el-form-item>
          <div class="dialog-sub-title">Hive配置</div>
          <el-form-item
            label="JDBC URL"
            prop="jdbcurl"
            :rules="{required: true, message: '请输入hive的JDBC连接地址，如host:port/db'}"
          >
            <el-input
              v-model="dialogForm.jdbcurl"
              placeholder="请输入hive的JDBC连接地址，如host:port/db"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="jdbcuser"
            :rules="{required: dialogForm.data_source_type!=='Hive', message: '请输入鉴权用户名，为保证任务正常执行，请确保有所需数据权限'}"
          >
            <el-input v-model="dialogForm.jdbcuser" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="{required: dialogForm.data_source_type!=='Hive', message: '请输入密码'}">
            <el-input
              type="jdbcpassword"
              autocomplete="new-password"
              v-model="dialogForm.jdbcpassword"
              placeholder="请输入鉴权密码，为保证任务正常执行，请确保有所需数据权限"
            ></el-input>
          </el-form-item>
          <el-form-item label="hive.login.keytab" prop="loginkeytab" :rules="{required: true, message: '请输入'}" v-if="dialogForm.Kerberosenable !== '0'">
            <el-input
              v-model="dialogForm.loginkeytab"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="hive.principal" prop="principal" :rules="{required: true, message: '请输入'}" v-if="dialogForm.Kerberosenable !== '0'">
            <el-input
              v-model="dialogForm.principal"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <div class="dialog-sub-title">元数据库配置</div>
          <el-form-item
            label="数据库类型"
            prop="meta_type"
            :rules="[{required: true, message: '请选择元数据库类型'}]"
          >
            <el-select v-model="dialogForm.meta_type">
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
              placeholder="请输入JDBC连接地址，如jdbc:mysql://host:port/dbname"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="metajdbcuser"
            :rules="{required: true, message: '请输入鉴权用户名，为保证任务正常执行，请确保有所需数据权限'}"
          >
            <el-input v-model="dialogForm.metajdbcuser" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="metajdbcpassword" :rules="{required: true, message: '请输入密码'}">
            <el-input
              type="password"
              autocomplete="new-password"
              v-model="dialogForm.metajdbcpassword"
              placeholder="请输入鉴权密码，为保证任务正常执行，请确保有所需数据权限"
            ></el-input>
          </el-form-item>
        </div>
        <div v-if="dialogForm.data_source_type === 'ElasticSearch'">
          <el-form-item
            label="HTTP地址"
            prop="http_urls"
            :rules="{required: true, message: '请输入HTTP地址'}"
          >
            <el-input v-model="dialogForm.http_urls" placeholder="例如127.0.0.1:9200,可填写多个地址，用英文逗号分隔"></el-input>
          </el-form-item>
          <el-form-item
            label="TCP地址"
            prop="tcp_urls"
            :rules="{required: true, message: '请输入TCP地址'}"
          >
            <el-input v-model="dialogForm.tcp_urls" placeholder="例如127.0.0.1:9300,可填写多个地址，用英文逗号分隔"></el-input>
          </el-form-item>
          <el-form-item
            label="集群名称"
            prop="cluster_name"
            :rules="{required: true, message: '请输入集群名称'}"
          >
            <el-input v-model="dialogForm.cluster_name" placeholder="请输入集群名称"></el-input>
          </el-form-item>
        </div>
        <div v-if="visibleUrlAndDatabase">
          <el-form-item label="地址" prop="jdbcurl" :rules="{required: true, message: '请输入地址'}">
            <el-input v-model="dialogForm.jdbcurl" placeholder="例如：127.0.0.1:10000，默认使用JDBC协议"></el-input>
          </el-form-item>
          <!-- <el-form-item label="数据库" prop="database" :rules="{required: true, message: '请输入数据库'}">
            <el-input v-model="dialogForm.database" placeholder="请输入数据库"></el-input>
          </el-form-item> -->
        </div>
        <div v-if="visibleUserinfo">
          <el-form-item label="用户名" prop="jdbcuser" :rules="{required: dialogForm.data_source_type!=='Presto'&&dialogForm.data_source_type!=='Phoenix', message: '请输入用户名'}">
            <!-- 请输入鉴权用户名，为保证任务正常执行，请确保有所需数据权限 -->
            <el-input v-model="dialogForm.jdbcuser" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="jdbcpassword" :rules="{required: dialogForm.data_source_type!=='Presto'&&dialogForm.data_source_type!=='Phoenix', message: '请输入密码'}">
            <!-- 请输入鉴权密码，为保证任务正常执行，请确保有所需数据权限 -->
            <el-input
              type="password"
              autocomplete="new-password"
              v-model="dialogForm.jdbcpassword"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="handleTestConnection"></el-button>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { addDataSource, editDataSource, getProjectList } from '@/api/plan/physical-datasource'
import {addDataSource, editDataSource} from '@/api/plan/physical-datasource'
import dialogHeight from '@/mixins/dialog-height'
export default {
  name: 'PhysicalDatasourceDialogform',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  mixins: [dialogHeight],
  data() {
    return {
      isLoading: false,
      isVisible: true,
      krb5pathList: [],
      keytabpathList: [],
      dialogForm: {
        data_source_code: '',
        data_source_type: 'MySQL',
        data_source_name: '',
        data_source_desc: '',
        // end_point: '',
        // project_name: '',
        // access_id: '',
        // access_key: '',
        krb5type: '0',
        keytabtype: '0',
        Kerberosenable: '0',
        krb5path: '',
        keytabpath: '',
        protocol: '',
        host: '',
        port: '',
        jdbcurl: '',
        // database: '',
        jdbcuser: '',
        jdbcpassword: '',
        http_urls: '',
        tcp_urls: '',
        cluster_name: '',
        name_nodes: '',
        meta_type: '',
        metajdbcurl: '',
        metajdbcuser: '',
        metajdbcpassword: '',
        loginkeytab: '',
        principal: ''
      },
      dataSourceTypeList: [
        // {label: 'MaxCompute', value: 'MaxCompute'},
        {label: 'MySQL', value: 'MySQL'},
        {label: 'Oracle', value: 'Oracle'},
        {label: 'HDFS', value: 'HDFS'},
        // {label: 'FTP', value: 'FTP'},
        {label: 'Hive', value: 'Hive'},
        {label: 'ElasticSearch', value: 'ElasticSearch'},
        {label: 'Presto', value: 'Presto'},
        {label: 'ClickHouse', value: 'ClickHouse'},
        {label: 'TiDB', value: 'TiDB'},
        {label: 'Phoenix', value: 'Phoenix'}
      ],
      databaseTypeList: [{label: 'MySQL', value: 'MySQL'}]
      // projectList: []
    }
  },
  computed: {
    visibleUrlAndDatabase() {
      const types = ['MySQL', 'Oracle', 'Presto', 'ClickHouse', 'TiDB', 'Phoenix']
      return types.includes(this.dialogForm.data_source_type)
    },
    visibleUserinfo() {
      const types = ['MySQL', 'Oracle', 'FTP', 'Presto', 'ClickHouse', 'TiDB', 'Phoenix']
      return types.includes(this.dialogForm.data_source_type)
    }
  },
  created() {
    const jdbcpassword = this.decrypt(this.data.jdbcpassword)
    const metajdbcuser = this.data.metajdbcuser && this.decrypt(this.data.metajdbcuser)
    Object.assign(this.dialogForm, this.data, {jdbcpassword})
    metajdbcuser && Object.assign(this.dialogForm, this.data, {metajdbcuser})
    // this.getProjectList()
  },
  methods: {
    // 获取项目列表
    // async getProjectList() {
    //   const res = await this.$simpleAsyncTo(getProjectList(), '获取项目列表失败')
    //   if (res) {
    //     this.projectList = res.data
    //   }
    // },
    // 测试连接
    handleTestConnection() {
      this.$emit('testConnection')
    },
    // 新增数据源
    async addDataSource() {
      if (this.dialogForm.data_source_type === 'Hive' && this.dialogForm.Kerberosenable === '1' && this.dialogForm.krb5type === '0' && this.krb5pathList.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择krb5文件上传'
        })
      }
      if (this.dialogForm.data_source_type === 'Hive' && this.dialogForm.Kerberosenable === '1' && this.dialogForm.keytabtype === '0' && this.keytabpathList.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择keytab文件上传'
        })
      }
      const params = this.getFormData()
      let param = null, type = ''
      this.globalLoading()
      if (this.dialogForm.data_source_type === 'Hive' && this.dialogForm.Kerberosenable === '1') {
        let fd = new FormData()
        if (this.dialogForm.krb5type === '0' && this.dialogForm.keytabtype === '0') {
          let krb5pathObj = this.krb5pathList[0].raw
          let keytabpathObj = this.keytabpathList[0].raw
          for (let key in params) {
            fd.append(key, params[key])
          }
          fd.append('krb5path', krb5pathObj)
          fd.append('keytabpath', keytabpathObj)
          param = fd
          type = 'upload'
        } else if (this.dialogForm.krb5type === '0' && this.dialogForm.keytabtype === '1') {
          let krb5pathObj = this.krb5pathList[0].raw
          for (let key in params) {
            fd.append(key, params[key])
          }
          fd.append('krb5path', krb5pathObj)
          param = fd
          type = 'upload'
        } else if (this.dialogForm.krb5type === '1' && this.dialogForm.keytabtype === '0') {
          let keytabpathObj = this.keytabpathList[0].raw
          for (let key in params) {
            fd.append(key, params[key])
          }
          fd.append('keytabpath', keytabpathObj)
          param = fd
          type = 'upload'
        } else {
          param = params
        }
      } else {
        param = params
      }
      const res = await this.$simpleAsyncTo(
        addDataSource(param, type),
        '新增数据源失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '新建数据源成功!'
        })
      }
      this.globalLoading().close()
    },
    // 修改数据源
    async editDataSource() {
      // if (this.dialogForm.data_source_type === 'Hive' && this.dialogForm.Kerberosenable === '1' && this.dialogForm.krb5type === '0' && this.krb5pathList.length === 0) {
      //   return this.$message({
      //     type: 'warning',
      //     message: '请选择krb5文件上传'
      //   })
      // }
      // if (this.dialogForm.data_source_type === 'Hive' && this.dialogForm.Kerberosenable === '1' && this.dialogForm.keytabtype === '0' && this.keytabpathList.length === 0) {
      //   return this.$message({
      //     type: 'warning',
      //     message: '请选择keytab文件上传'
      //   })
      // }
      const params = this.getFormData()
      let param = null, type = ''
      this.globalLoading()
      if (this.dialogForm.data_source_type === 'Hive' && this.dialogForm.Kerberosenable === '1') {
        let fd = new FormData()
        if (this.dialogForm.krb5type === '0' && this.dialogForm.keytabtype === '0') {
          let krb5pathObj = this.krb5pathList[0].raw
          let keytabpathObj = this.keytabpathList[0].raw
          for (let key in params) {
            fd.append(key, params[key])
          }
          fd.append('krb5path', krb5pathObj)
          fd.append('keytabpath', keytabpathObj)
          param = fd
          type = 'upload'
        } else if (this.dialogForm.krb5type === '0' && this.dialogForm.keytabtype === '1') {
          let krb5pathObj = this.krb5pathList[0].raw
          for (let key in params) {
            fd.append(key, params[key])
          }
          fd.append('krb5path', krb5pathObj)
          param = fd
          type = 'upload'
        } else if (this.dialogForm.krb5type === '1' && this.dialogForm.keytabtype === '0') {
          let keytabpathObj = this.keytabpathList[0].raw
          for (let key in params) {
            fd.append(key, params[key])
          }
          fd.append('keytabpath', keytabpathObj)
          param = fd
          type = 'upload'
        } else {
          param = params
        }
      } else {
        param = params
      }
      const res = await this.$simpleAsyncTo(
        editDataSource(param, type),
        '编辑数据源失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '编辑数据源成功!'
        })
      }
      this.globalLoading().close()
    },
    // 确定新增&编辑
    handleConfirm() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          if (this.data.data_source_name) {
            await this.editDataSource()
          } else {
            await this.addDataSource()
          }
          this.$emit('confirm')
        }
      })
    },
    // 取消新增&编辑
    handleCancel() {
      this.$emit('cancel')
    },
    getFormData() {
      /* eslint-disable */
      const {
        krb5type,
        name_nodes,
        meta_type,
        metajdbcurl,
        metajdbcuser,
        Kerberosenable,
        http_urls,
        tcp_urls,
        cluster_name,
        jdbcurl,
        // database,
        jdbcuser,
        protocol,
        host,
        port,
        krb5path,
        keytabtype,
        keytabpath,
        // end_point,
        // project_name,
        // access_id,
        // access_key,
        data_source_code,
        data_source_id,
        data_source_type,
        data_source_name,
        data_source_desc,
        loginkeytab,
        principal
      } = this.dialogForm
      let {jdbcpassword, metajdbcpassword} = this.dialogForm
      jdbcpassword = this.encrypt(jdbcpassword)
      metajdbcpassword = this.encrypt(metajdbcpassword)
      // const a = this.encrypt(password)
      // console.log(this.encrypt(password))
      // console.log(this.decrypt(a))
      let connect_info = {}
      switch (data_source_type) {
        // case 'MaxCompute':
        //   connect_info = {
        //     end_point,
        //     project_name,
        //     access_id,
        //     access_key
        //   }
        //   break
        case 'MySQL':
        case 'Presto':
        case 'Phoenix':
        case 'ClickHouse':
        case 'TiDB':
          connect_info = {
            jdbcurl,
            // database,
            jdbcuser,
            jdbcpassword
          }
          break
        case 'Oracle':
          connect_info = {
            jdbcurl,
            // database,
            jdbcuser,
            jdbcpassword
          }
          break
        case 'HDFS':
          connect_info = {
            jdbcurl
          }
          break
        case 'FTP':
          connect_info = {
            protocol,
            host,
            port,
            jdbcuser,
            jdbcpassword
          }
          break
        case 'Hive':
          connect_info = {
            Kerberosenable,
            name_nodes,
            jdbcurl,
            jdbcuser,
            jdbcpassword,
            meta_type,
            metajdbcurl,
            metajdbcuser,
            metajdbcpassword,
            krb5type,
            keytabtype,
            loginkeytab,
            principal
          }
          if (this.dialogForm.Kerberosenable === '1' && this.dialogForm.krb5type !== '0') {
            connect_info.krb5path = krb5path
          }
          if (this.dialogForm.Kerberosenable === '1' && this.dialogForm.keytabtype !== '0') {
            connect_info.keytabpath = keytabpath
          }
          break
        case 'ElasticSearch':
          connect_info = {
            http_urls,
            tcp_urls,
            cluster_name
          }
          break
        default:
          break
      }
      const data = {
        data_source_id,
        data_source_type,
        data_source_name,
        data_source_desc,
        connect_info: JSON.stringify(connect_info),
        data_source_code
      }
      return data
    },
    krb5pathUploadChange(file, fileList) {
      this.krb5pathList = fileList
    },
    krb5pathUpSuccess() {},
    changeKerberosenable(val) {
      this.krb5pathList = []
      this.dialogForm.krb5path = ''
      this.dialogForm.keytabpath = ''
      this.keytabpathList = []
      this.dialogForm.loginkeytab = ''
      this.dialogForm.principal = ''
    },
    krb5typeClick() {
      this.dialogForm.krb5path = ''
      this.krb5pathList = []
      if (this.dialogForm.krb5type === '0') {
        this.dialogForm.krb5type = '1'
      } else {
        this.dialogForm.krb5type = '0'
      }
    },
    keytabpathUpSuccess() {},
    keytabpathUploadChange(file, filelist) {
      this.keytabpathList = filelist
    },
    keytabpathClick() {
      this.dialogForm.keytabpath = ''
      this.keytabpathList = []
      if (this.dialogForm.keytabtype === '0') {
        this.dialogForm.keytabtype = '1'
      } else {
        this.dialogForm.keytabtype = '0'
      }
    },
    datasourcetypeChange() {
      this.dialogForm.krb5path = ''
      this.krb5pathList = []
      this.dialogForm.keytabpath = ''
      this.keytabpathList = []
    }
  }
}
</script>
