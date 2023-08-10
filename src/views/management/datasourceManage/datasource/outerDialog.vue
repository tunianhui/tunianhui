<!--
 * @Author: 大炸鹅
 * @Date: 2023-07-31 09:32:41
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-08 16:33:28
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\outerDialog.vue
-->
<template>
  <el-dialog
    :visible.sync="outerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="width"
    max-width="80%"
    @close="close"
  >
    <template slot="title" v-if="!innerDialogVisible">
      <div class="outer-title">
        <span>新建数据源</span>
        <span>
          <el-input v-model="keywork" placeholder="请输入搜索关键字" style="width:160px" class="mr-10"></el-input>
          <el-select v-model="scene" placeholder="请选择应用场景" style="width:280px">
            <el-option
              v-for="item in sceneOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </div>
    </template>
    <template slot="title" v-else>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="!isEdit">
        <el-breadcrumb-item style="cursor: pointer;"> <span style="color: rgba(46,116,225, 1);" @click="backDatasource">返回新建数据源</span></el-breadcrumb-item>
        <el-breadcrumb-item>{{isEdit ? '编辑' : '新建'}}{{currentDataSource.name}}数据源</el-breadcrumb-item>
      </el-breadcrumb>
      <span v-else>{{isEdit ? '编辑' : '新建'}}{{currentDataSource.name}}数据源</span>
    </template>

    <div class="dataSrc-select-wrapper" v-if="!innerDialogVisible">
      <template v-for="item in dataSourceTypeList">
        <div class="data-src-section" :key="item.id" v-if="allSourceTypeList[item.id] && allSourceTypeList[item.id].length != 0">
          <div class="data-src-group-header">
            <span class="header-legend"></span>
            {{item.name}}
          </div>
          <div class="data-src-group-wrapper">
            <template v-for="subItem in item.children">
              <div class="data-src-item-wrapper" :key="subItem.id" v-if="sourceTypeList.includes(subItem.id)">
                <div class="data-src-bg" :style="{'background': `url(${subItem.img})`, }">
                  <!-- <i :class="subItem.icon"></i> -->
                  <div class="mask">
                    <div class="scens-info">
                      <span class="scens-title">支持应用场景</span>
                      <span class="scens-value">{{subItem.scene}}</span>
                    </div>
                    <el-button type="primary" @click="createdDatasource(subItem)">新建数据源</el-button>
                  </div>
                </div>
                <div class="data-src-text">
                  <span>{{subItem.name}}</span>
                  <el-tooltip class="item" effect="dark" :content="`支持应用场景：${subItem.scene}`" placement="top">
                    <i class="iconfont icon-yingyongguanli"></i>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <Form
        :isEdit="isEdit"
        :currentDataSource="currentDataSource"
        :editDatasource="editDatasource"
        @changeDatasourceConfig="changeDatasourceConfig"
        ref="Form"
      ></Form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" type="primary" v-if="!innerDialogVisible">关 闭</el-button>
      <el-button @click="upStep" v-if="innerDialogVisible && !isEdit">上一步</el-button>
      <el-button @click="close" v-if="innerDialogVisible">取 消</el-button>
      <el-button @click="save" type="primary" v-if="innerDialogVisible">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Form from './form.vue'
import {dataSourceTypeList} from './config'
import {
  saveDataSource,
  editDataSource,
  getDataSourceTypeList
} from '@/api/management/datasource.js'
export default {
  name: 'OuterDialog',
  components: {
    Form
  },
  props: {
    currentEditItemData: Object
  },
  watch: {
    currentEditItemData: {
      handler(val) {
        if (val && JSON.stringify(val) !== '{}') {
          const { data_source_type, mode_type } = val
          const list = []
          this.dataSourceTypeList.map(d => {
            if (d.children) {
              list.push(...d.children)
            }
          })
          const curDatasource = list.find(d => d.id === data_source_type)
          if (curDatasource) {
            this.createdDatasource(curDatasource, true, mode_type)
            this.editDatasource = val
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      width: '1092px',
      dataSourceTypeList,
      outerVisible: true, // 外层 Dialog 显示状态
      innerDialogVisible: false, // 内层 Dialog 显示状态
      keywork: '', // 搜索关键字
      sceneOptions: [], // 应用场景下拉选项
      scene: '', // 应用场景
      currentDataSource: {}, // 当前选中的数据源
      isEdit: false,
      editDatasource: {},
      sourceTypeList: [],
      allSourceTypeList: {}
    }
  },
  created() {
    this._getDataSourceTypeList()
  },
  methods: {
    createdDatasource(data, isEdit, mode_type) {
      this.innerDialogVisible = true
      this.currentDataSource = data
      if (mode_type === '0') {
        this.width = '1092px'
      } else {
        this.width = '570px'
      }
      this.isEdit = isEdit
    },
    backDatasource() {
      this.innerDialogVisible = false
      this.width = '1092px'
    },
    close() {
      this.$emit('close')
    },
    changeDatasourceConfig(data) {
      if (data === '2') {
        this.width = '570px'
      } else {
        this.width = '1092px'
      }
    },
    upStep() {
      this.innerDialogVisible = false
      this.width = '1092px'
    },
    async save() {
      const data = this.$refs.Form.getData()
      if (!data) return
      if (this.currentDataSource.id === 'Hive' || this.currentDataSource.id === 'Hdfs') {
        const flagData = this.getHiveRule(data)
        if (!flagData.flag) {
          return this.$message({
            type: 'error',
            message: flagData.msg
          })
        }
      }
      if (this.currentDataSource.id === 'Kafka') {
        const flagData = this.getKafkaRule(data)
        if (!flagData.flag) {
          return this.$message({
            type: 'error',
            message: flagData.msg
          })
        }
      }
      let params = null
      if (this.currentDataSource.id === 'ClickHouse' ||
        this.currentDataSource.id === 'MySQL' ||
        this.currentDataSource.id === 'TiDB' ||
        this.currentDataSource.id === 'Oracle' ||
        this.currentDataSource.id == 'PolarDB' ||
        this.currentDataSource.id == 'PolarDB-X(原DRDS)' ||
        this.currentDataSource.id == 'SAP_HANA' ||
        this.currentDataSource.id == 'Microsoft_SQL_Server' ||
        this.currentDataSource.id == 'PostgreSQL' ||
        this.currentDataSource.id == 'AnalyticDB_for_MySQL2.0' ||
        this.currentDataSource.id == 'AnalyticDB_for_MySQL3.0' ||
        this.currentDataSource.id == 'AnalyticDB_for_PostgreSQL' ||
        this.currentDataSource.id == 'OceanBase' ||
        this.currentDataSource.id == 'Vertica' ||
        this.currentDataSource.id == 'IBMDB2' ||
        this.currentDataSource.id == 'Teradata' ||
        this.currentDataSource.id == 'DM' ||
        this.currentDataSource.id == 'GBase_8a' ||
        this.currentDataSource.id == 'KingbaseES' ||
        this.currentDataSource.id == 'GoldenDB' ||
        this.currentDataSource.id == 'openGauss' ||
        this.currentDataSource.id == 'StarRocks' ||
        this.currentDataSource.id == 'Doris' ||
        this.currentDataSource.id == 'GreenPlum'
      ) {
        params = this['ClickHouse'](data)
      } else {
        params = this[this.currentDataSource.id](data)
      }
      let fn = null
      if (data.id) {
        fn = editDataSource
        // params.id = data.id
        params.append('id', data.id)
      } else {
        fn = saveDataSource
      }
      const res = await this.$simpleAsyncTo(fn(params, 'upload'), '保存失败')
      if (res) {
        this.$message.success('保存成功')
        this.$emit('close', true)
      }
    },
    // Elasticsearch
    Elasticsearch(data) {
      const params = {
        data_source_code: data.data_source_code,
        data_source_name: data.data_source_name,
        data_source_desc: data.data_source_desc,
        data_source_type: this.currentDataSource.id,
        mode_type: data.mode_type,
        version: data.version,
        connect_info_dev: JSON.stringify(data.connect_info_dev) === '{}' ? null : JSON.stringify({
          ...data.connect_info_dev,
          jdbcpassword: this.encrypt(data.connect_info_dev.jdbcpassword || '')
        }),
        connect_info_pro: JSON.stringify(data.connect_info_pro) === '{}' ? null : JSON.stringify({
          ...data.connect_info_pro,
          jdbcpassword: this.encrypt(data.connect_info_pro.jdbcpassword || '')
        })
      }
      let fd = new FormData
      for (let key in params) {
        fd.append(key, params[key])
      }
      return fd
    },
    // ClickHouse、MySQL、TiDB、Oracle
    ClickHouse(data) {
      const { jdbcpassword: devPass } = data.connect_info_dev
      const { jdbcpassword: proPass } = data.connect_info_pro
      const params = {
        data_source_code: data.data_source_code,
        data_source_name: data.data_source_name,
        data_source_desc: data.data_source_desc,
        data_source_type: this.currentDataSource.id,
        mode_type: data.mode_type,
        version: data.version,
        connect_info_dev: JSON.stringify(data.connect_info_dev) === '{}' ? null : JSON.stringify({
          ...data.connect_info_dev,
          jdbcpassword: this.encrypt(devPass)
        }),
        connect_info_pro: JSON.stringify(data.connect_info_pro) === '{}' ? null : JSON.stringify({
          ...data.connect_info_pro,
          jdbcpassword: this.encrypt(proPass)
        })
      }
      let fd = new FormData
      for (let key in params) {
        fd.append(key, params[key])
      }
      return fd
    },
    // Hdfs
    Hdfs(data) {
      const params = {
        data_source_code: data.data_source_code,
        data_source_name: data.data_source_name,
        data_source_desc: data.data_source_desc,
        data_source_type: this.currentDataSource.id,
        mode_type: data.mode_type,
        version: data.version,
        // connect_info_dev: JSON.stringify(data.connect_info_dev) === '{}' ? null : JSON.stringify({
        //   ...data.connect_info_dev
        // }),
        // connect_info_pro: JSON.stringify(data.connect_info_pro) === '{}' ? null : JSON.stringify({
        //   ...data.connect_info_pro
        // })
      }
      const oldData = JSON.parse(JSON.stringify(data))
      if (oldData.connect_info_pro.krb5pathList) {
        delete oldData.connect_info_pro.krb5pathList
      }
      if (oldData.connect_info_pro.keytabpathList) {
        delete oldData.connect_info_pro.keytabpathList
      }
      if (oldData.connect_info_dev.krb5pathList) {
        delete oldData.connect_info_dev.krb5pathList
      }
      if (oldData.connect_info_dev.keytabpathList) {
        delete oldData.connect_info_dev.keytabpathList
      }

      let proParams = null, devParams = null
      if (data.connect_info_dev.Kerberosenable === '1') {
        if (data.connect_info_dev.krb5type === '0' && data.connect_info_dev.keytabtype === '0') {
          let krb5pathObj = data.connect_info_dev.krb5pathList[0].raw
          let keytabpathObj = data.connect_info_dev.keytabpathList[0].raw
          devParams = {
            ...oldData.connect_info_dev,
          }
          params.krb5path_dev = krb5pathObj
          params.keytabpath_dev = keytabpathObj
        } else if (data.connect_info_dev.krb5type === '0' && data.connect_info_dev.keytabtype === '1') {
          let krb5pathObj = data.connect_info_dev.krb5pathList[0].raw
          devParams = {
            ...oldData.connect_info_dev,
          }
          params.krb5path_dev = krb5pathObj
        } else if (data.connect_info_dev.krb5type === '1' && data.connect_info_dev.keytabtype === '0') {
          let keytabpathObj = data.connect_info_dev.keytabpathList[0].raw
          devParams = {
            ...oldData.connect_info_dev,
          }
          params.keytabpath_dev = keytabpathObj
        } else {
          devParams = {
            ...oldData.connect_info_dev
          }
        }
      } else {
        devParams = {
          ...oldData.connect_info_dev
        }
      }
      if (data.connect_info_pro.Kerberosenable === '1') {
        if (data.connect_info_pro.krb5type === '0' && data.connect_info_pro.keytabtype === '0') {
          let krb5pathObj = data.connect_info_pro.krb5pathList[0].raw
          let keytabpathObj = data.connect_info_pro.keytabpathList[0].raw
          proParams = {
            ...oldData.connect_info_pro,
          }
          params.krb5path_pro = krb5pathObj
          params.keytabpath_pro = keytabpathObj
        } else if (data.connect_info_pro.krb5type === '0' && data.connect_info_pro.keytabtype === '1') {
          let krb5pathObj = data.connect_info_pro.krb5pathList[0].raw
          proParams = {
            ...oldData.connect_info_pro,
          }
          params.krb5path_pro = krb5pathObj
        } else if (data.connect_info_pro.krb5type === '1' && data.connect_info_pro.keytabtype === '0') {
          let keytabpathObj = data.connect_info_pro.keytabpathList[0].raw
          proParams = {
            ...oldData.connect_info_pro,
          }
          params.keytabpath_pro = keytabpathObj
        } else {
          proParams = {
            ...oldData.connect_info_pro
          }
        }
      } else {
        proParams = {
          ...oldData.connect_info_pro
        }
      }
      let fd = new FormData
      const newParamsData = {
        ...params,
        connect_info_pro: JSON.stringify({
          ...proParams,
          // jdbcpassword: this.encrypt(proParams.jdbcpassword || ''),
          // metajdbcpassword: this.encrypt(proParams.metajdbcpassword || '')
        } || {}),
        connect_info_dev: JSON.stringify({
          ...devParams,
          // jdbcpassword: this.encrypt(devParams.jdbcpassword || ''),
          // metajdbcpassword: this.encrypt(devParams.metajdbcpassword || '')
        } || {})
      }
      for (let key in newParamsData) {
        fd.append(key, newParamsData[key])
      }
      return fd
    },
    // Hive
    Hive(data) {
      const params = {
        data_source_code: data.data_source_code,
        data_source_name: data.data_source_name,
        data_source_desc: data.data_source_desc,
        data_source_type: this.currentDataSource.id,
        mode_type: data.mode_type,
        version: data.version,
      }
      const oldData = JSON.parse(JSON.stringify(data))
      if (oldData.connect_info_pro.krb5pathList) {
        delete oldData.connect_info_pro.krb5pathList
      }
      if (oldData.connect_info_pro.keytabpathList) {
        delete oldData.connect_info_pro.keytabpathList
      }
      if (oldData.connect_info_dev.krb5pathList) {
        delete oldData.connect_info_dev.krb5pathList
      }
      if (oldData.connect_info_dev.keytabpathList) {
        delete oldData.connect_info_dev.keytabpathList
      }
      let proParams = null, devParams = null
      if (data.connect_info_pro.Kerberosenable === '1') {
        if (data.connect_info_pro.krb5type === '0' && data.connect_info_pro.keytabtype === '0') {
          let krb5pathObj = data.connect_info_pro.krb5pathList[0].raw
          let keytabpathObj = data.connect_info_pro.keytabpathList[0].raw
          proParams = {
            ...oldData.connect_info_pro,
          }
          params.krb5path_pro = krb5pathObj
          params.keytabpath_pro = keytabpathObj
        } else if (data.connect_info_pro.krb5type === '0' && data.connect_info_pro.keytabtype === '1') {
          let krb5pathObj = data.connect_info_pro.krb5pathList[0].raw
          proParams = {
            ...oldData.connect_info_pro,
          }
          params.krb5path_pro = krb5pathObj
        } else if (data.connect_info_pro.krb5type === '1' && data.connect_info_pro.keytabtype === '0') {
          let keytabpathObj = data.connect_info_pro.keytabpathList[0].raw
          proParams = {
            ...oldData.connect_info_pro,
          }
          params.keytabpath_pro = keytabpathObj
        } else {
          proParams = {
            ...oldData.connect_info_pro
          }
        }
      } else {
        proParams = {
          ...oldData.connect_info_pro
        }
      }
      if (data.connect_info_dev.Kerberosenable === '1') {
        if (data.connect_info_dev.krb5type === '0' && data.connect_info_dev.keytabtype === '0') {
          let krb5pathObj = data.connect_info_dev.krb5pathList[0].raw
          let keytabpathObj = data.connect_info_dev.keytabpathList[0].raw
          devParams = {
            ...oldData.connect_info_dev,
          }
          params.krb5path_dev = krb5pathObj
          params.keytabpath_dev = keytabpathObj
        } else if (data.connect_info_dev.krb5type === '0' && data.connect_info_dev.keytabtype === '1') {
          let krb5pathObj = data.connect_info_dev.krb5pathList[0].raw
          devParams = {
            ...oldData.connect_info_dev,
          }
          params.krb5path_dev = krb5pathObj
        } else if (data.connect_info_dev.krb5type === '1' && data.connect_info_dev.keytabtype === '0') {
          let keytabpathObj = data.connect_info_dev.keytabpathList[0].raw
          devParams = {
            ...oldData.connect_info_dev,
          }
          params.keytabpath_dev = keytabpathObj
        } else {
          devParams = {
            ...oldData.connect_info_dev
          }
        }
      } else {
        devParams = {
          ...oldData.connect_info_dev
        }
      }
      let fd = new FormData
      const newParamsData = {
        ...params,
        connect_info_pro: JSON.stringify({
          ...proParams,
          jdbcpassword: this.encrypt(proParams.jdbcpassword || ''),
          metajdbcpassword: this.encrypt(proParams.metajdbcpassword || '')
        } || {}),
        connect_info_dev: JSON.stringify({
          ...devParams,
          jdbcpassword: this.encrypt(devParams.jdbcpassword || ''),
          metajdbcpassword: this.encrypt(devParams.metajdbcpassword || '')
        } || {})
      }
      for (let key in newParamsData) {
        fd.append(key, newParamsData[key])
      }
      return fd
    },
    getHiveRule(data) {
      if (data.connect_info_pro && JSON.stringify(data.connect_info_pro) !== '{}') {
        if (data.connect_info_pro.Kerberosenable === '1' && data.connect_info_pro.krb5type === '0' && data.connect_info_pro.krb5pathList.length === 0) {
          return {
            flag: false,
            msg: '请选择生产环境krb5文件上传'
          }
        }
        if (data.connect_info_pro.Kerberosenable === '1' && data.connect_info_pro.keytabtype === '0' && data.connect_info_pro.keytabpathList.length === 0) {
          return {
            flag: false,
            msg: '请选择生产环境keytab文件上传'
          }
        }
      }
      if (data.connect_info_dev && JSON.stringify(data.connect_info_dev) !== '{}') {
        if (data.connect_info_dev.Kerberosenable === '1' && data.connect_info_dev.krb5type === '0' && data.connect_info_dev.krb5pathList.length === 0) {
          return {
            flag: false,
            msg: '请选择开发环境krb5文件上传'
          }
        }
        if (data.connect_info_dev.Kerberosenable === '1' && data.connect_info_dev.keytabtype === '0' && data.connect_info_dev.keytabpathList.length === 0) {
          return {
            flag: false,
            msg: '请选择开发环境keytab文件上传'
          }
        }
      }
      return {
        flag: true
      }
    },
    // Kafka
    Kafka(data) {
      const params = {
        data_source_code: data.data_source_code,
        data_source_name: data.data_source_name,
        data_source_desc: data.data_source_desc,
        data_source_type: this.currentDataSource.id,
        mode_type: data.mode_type,
        version: data.version,
      }
      const oldData = JSON.parse(JSON.stringify(data))
      if (oldData.connect_info_pro.krb5pathList) {
        delete oldData.connect_info_pro.krb5pathList
      }
      if (oldData.connect_info_pro.keytabpathList) {
        delete oldData.connect_info_pro.keytabpathList
      }
      if (oldData.connect_info_pro.jaasPathList) {
        delete oldData.connect_info_pro.jaasPathList
      }
      if (oldData.connect_info_dev.krb5pathList) {
        delete oldData.connect_info_dev.krb5pathList
      }
      if (oldData.connect_info_dev.keytabpathList) {
        delete oldData.connect_info_dev.keytabpathList
      }
      if (oldData.connect_info_dev.jaasPathList) {
        delete oldData.connect_info_dev.jaasPathList
      }
      
      let proParams = null, devParams = null
      if (data.connect_info_pro.auth_method === '1') {
        proParams = {
          ...oldData.connect_info_pro,
        }
        if (data.connect_info_pro.krb5type === '0') {
          let krb5pathObj = data.connect_info_pro.krb5pathList[0].raw
          params.krb5path_pro = krb5pathObj
        }
        if (data.connect_info_pro.keytabtype === '0') {
          let keytabpathObj = data.connect_info_pro.keytabpathList[0].raw
          params.keytabpath_pro = keytabpathObj
        }
        if (data.connect_info_pro.jaasType === '0') {
          if (data.connect_info_pro.jaasPathList && data.connect_info_pro.jaasPathList.length !== 0) {
            let jaasPathObj = data.connect_info_pro.jaasPathList[0].raw
            params.jaaspath_pro = jaasPathObj
          }
        }
      } else {
        proParams = {
          ...oldData.connect_info_pro
        }
      }
      if (data.connect_info_dev.auth_method === '1') {
        devParams = {
          ...oldData.connect_info_dev,
        }
        if (data.connect_info_dev.krb5type === '0') {
          let krb5pathObj = data.connect_info_dev.krb5pathList[0].raw
          params.krb5path_dev = krb5pathObj
        }
        if (data.connect_info_dev.keytabtype === '0') {
          let keytabpathObj = data.connect_info_dev.keytabpathList[0].raw
          params.keytabpath_dev = keytabpathObj
        }
        if (data.connect_info_dev.jaasType === '0') {
          if (data.connect_info_dev.jaasPathList && data.connect_info_dev.jaasPathList.length !== 0) {
            let jaasPathObj = data.connect_info_dev.jaasPathList[0].raw
            params.jaaspath_dev = jaasPathObj
          }
        }
      } else {
        devParams = {
          ...oldData.connect_info_dev
        }
      }
      let fd = new FormData
      const newParamsData = {
        ...params,
        connect_info_pro: JSON.stringify(proParams || {}) !== '{}' ? JSON.stringify({
          ...proParams,
          password: this.encrypt(proParams.password || '')
        }) : {},
        connect_info_dev: JSON.stringify(devParams || {}) !== '{}' ? JSON.stringify({
          ...devParams,
          password: this.encrypt(devParams.password || '')
        }) : {}
      }
      for (let key in newParamsData) {
        fd.append(key, newParamsData[key])
      }
      return fd
    },
    getKafkaRule(data) {
      if (JSON.stringify(data.connect_info_pro) !== '{}') {
        if (data.connect_info_pro.auth_method === '1' && data.connect_info_pro.krb5type === '0' && data.connect_info_pro.krb5pathList.length === 0) {
          return {
            flag: false,
            msg: '请选择生产环境krb5文件上传'
          }
        }
        if (data.connect_info_pro.auth_method === '1' && data.connect_info_pro.keytabtype === '0' && data.connect_info_pro.keytabpathList.length === 0) {
          return {
            flag: false,
            msg: '请选择生产环境keytab文件上传'
          }
        }
        // if (data.connect_info_pro.auth_method === '1' && data.connect_info_pro.jaasType === '0' && data.connect_info_pro.jaasPathList.length === 0) {
        //   return {
        //     flag: false,
        //     msg: '请选择生产环境Jaas文件上传'
        //   }
        // }
      }
      if (JSON.stringify(data.connect_info_dev) !== '{}') {
        if (data.connect_info_dev.auth_method === '1' && data.connect_info_dev.krb5type === '0' && data.connect_info_dev.krb5pathList.length === 0) {
          return {
            flag: false,
            msg: '请选择开发环境krb5文件上传'
          }
        }
        if (data.connect_info_dev.auth_method === '1' && data.connect_info_dev.keytabtype === '0' && data.connect_info_dev.keytabpathList.length === 0) {
          return {
            flag: false,
            msg: '请选择开发环境keytab文件上传'
          }
        }
        // if (data.connect_info_dev.auth_method === '1' && data.connect_info_dev.jaasType === '0' && data.connect_info_dev.jaasPathList.length === 0) {
        //   return {
        //     flag: false,
        //     msg: '请选择开发环境Jaas文件上传'
        //   }
        // }
        // return {
        //   flag: true
        // }
      }
      return {
        flag: true
      }
    },
    // 获取数据源类型列表
    async _getDataSourceTypeList() {
      const res = await this.$simpleAsyncTo(getDataSourceTypeList(), '获取数据源类型列表失败')
      if (res) {
        const list = {}
        this.sourceTypeList = res.data.map(d => {
          if (list[d.data_source_category]) {
            list[d.data_source_category].push(d)
          } else {
            list[d.data_source_category] = [d]
          }
          return d.data_source_type
        })
        this.allSourceTypeList = list
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.outer-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dataSrc-select-wrapper {
  height: 80vh;
  .data-src-section {
    .data-src-group-header {
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      margin: 0 5px 10px;
      .header-legend {
        display: inline-block;
        height: 12px;
        width: 3px;
        background-color: #2e8bff;
        margin-right: 5px;
      }
    }
    .data-src-group-wrapper {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .data-src-item-wrapper {
        width: 198px;
        height: 148px;
        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: #fff;
        margin: 0 5px 10px;
        padding: 10px;
        font-size: 12px;
        i {
          font-size: 14px;
        }
      }
      .data-src-bg {
        height: 100px;
        width: 178px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        // background-color: rgb(255, 147, 22);
        font-size: 12px;
        .mask {
          display: none;
          width: 194px;
          height: 116px;
          position: absolute;
          top: -8px;
          background: rgba($color: #000000, $alpha: 0.65);
          color: #fff;
          text-align: center;
          .scens-info {
            height: 68px;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            line-height: 20px;
            .scens-title {

            }
          }
        }
        &:hover {
          .mask {
            display: block;
          }
        }
        > i {
          font-size: 44px;
          color: #fff;
        }
      }
      .data-src-text {
        width: 100%;
        margin-top: 10px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba($color: #000000, $alpha: 0.85);
      }
    }
  }
}
::v-deep {
  .el-dialog__header {
    padding: 20px 48px 20px 20px;
  }
  .el-dialog {
    max-height: 80%;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      overflow: auto;
    }
  }
}
.el-dialog__wrapper {
  overflow: hidden!important;
}
</style>