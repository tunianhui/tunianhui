<!--
 * @Author: 大炸鹅
 * @Date: 2023-08-01 10:01:58
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-08 11:52:11
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\form.vue
-->
<template>
  <el-form :model="dialogForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading.fullscreen.lock="loading">
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
      label="支持应用场景"
    >
      {{currentDataSource.scene}}
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
    <el-form-item
      v-if="currentDataSource.id !== 'Hdfs'"
      label="版本号"
      prop="version"
      :rules="[{required: true, message: '请选择版本号'}, {
      max: 32,
      message: '数据源名称不能超过32个字',
      trigger:  ['blur', 'change']
    }]"
    >
      <el-select v-model="dialogForm.version">
        <el-option
          v-for="(item,index) in versionList"
          :key="index"
          :label="item.version"
          :value="item.version"
        ></el-option>
      </el-select>
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
    <el-form-item
      label="数据源配置"
      prop="mode_type"
      :rules="{required: true, message: '请选择数据源配置'}"
    >
      <el-radio-group v-model="dialogForm.mode_type" @change="changeDatasourceConfig" :disabled="isEdit">
        <el-radio label="0">“生产+开发”数据源</el-radio>
        <el-radio label="1">“生产”数据源</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-divider></el-divider>
    <el-row :gutter="10">
      <el-col :span="dialogForm.mode_type === '0' ? 12 : 24">
        <div class="title">生产数据源</div>
         <div class="sub-form-wrapper">
          <div class="schema-form">
            <el-form-item prop="connect_info_pro" label-width="0" v-if="currentDataSource.id == 'Elasticsearch'">
              <Elasticsearch v-model="dialogForm.connect_info_pro" ref="connectInfoPro" :version="dialogForm.version"></Elasticsearch>
            </el-form-item>
            <el-form-item
              prop="connect_info_pro"
              label-width="0"
              v-if="currentDataSource.id == 'ClickHouse' ||
                currentDataSource.id == 'MySQL' ||
                currentDataSource.id == 'TiDB' ||
                currentDataSource.id == 'Oracle' ||
                currentDataSource.id == 'PolarDB' ||
                currentDataSource.id == 'PolarDB-X(原DRDS)' ||
                currentDataSource.id == 'SAP_HANA' ||
                currentDataSource.id == 'Microsoft_SQL_Server' ||
                currentDataSource.id == 'PostgreSQL' ||
                currentDataSource.id == 'AnalyticDB_for_MySQL2.0' ||
                currentDataSource.id == 'AnalyticDB_for_MySQL3.0' ||
                currentDataSource.id == 'AnalyticDB_for_PostgreSQL' ||
                currentDataSource.id == 'OceanBase' ||
                currentDataSource.id == 'Vertica' ||
                currentDataSource.id == 'IBMDB2' ||
                currentDataSource.id == 'Teradata' ||
                currentDataSource.id == 'DM' ||
                currentDataSource.id == 'GBase_8a' ||
                currentDataSource.id == 'KingbaseES' ||
                currentDataSource.id == 'GoldenDB' ||
                currentDataSource.id == 'openGauss' ||
                currentDataSource.id == 'StarRocks' ||
                currentDataSource.id == 'Doris' ||
                currentDataSource.id == 'GreenPlum'
              "
              >
              <ClickHouse v-model="dialogForm.connect_info_pro" ref="connectInfoPro"></ClickHouse>
            </el-form-item>
            <el-form-item prop="connect_info_pro" label-width="0" v-if="currentDataSource.id == 'Hdfs'">
              <Hdfs v-model="dialogForm.connect_info_pro" ref="connectInfoPro"></Hdfs>
            </el-form-item>
            <el-form-item prop="connect_info_pro" label-width="0" v-if="currentDataSource.id == 'Hive'">
              <Hive v-model="dialogForm.connect_info_pro" ref="connectInfoPro"></Hive>
            </el-form-item>
            <el-form-item prop="connect_info_pro" label-width="0" v-if="currentDataSource.id == 'Kafka'">
              <Kafka v-model="dialogForm.connect_info_pro" ref="connectInfoPro"></Kafka>
            </el-form-item>
          </div>
        </div>
      </el-col>
      <el-col :span="12" v-if="dialogForm.mode_type === '0'">
        <div class="title">开发数据源</div>
        <div class="sub-form-wrapper">
          <div class="schema-form">
            <el-form-item prop="connect_info_dev" label-width="0" v-if="currentDataSource.id == 'Elasticsearch'">
              <Elasticsearch v-model="dialogForm.connect_info_dev" ref="connectInfoDev" :version="dialogForm.version"></Elasticsearch>
            </el-form-item>
            <el-form-item
              prop="connect_info_dev"
              label-width="0"
               v-if="currentDataSource.id == 'ClickHouse' ||
                currentDataSource.id == 'MySQL' ||
                currentDataSource.id == 'TiDB' ||
                currentDataSource.id == 'Oracle' ||
                currentDataSource.id == 'PolarDB' ||
                currentDataSource.id == 'PolarDB-X(原DRDS)' ||
                currentDataSource.id == 'SAP_HANA' ||
                currentDataSource.id == 'Microsoft_SQL_Server' ||
                currentDataSource.id == 'PostgreSQL' ||
                currentDataSource.id == 'AnalyticDB_for_MySQL2.0' ||
                currentDataSource.id == 'AnalyticDB_for_MySQL3.0' ||
                currentDataSource.id == 'AnalyticDB_for_PostgreSQL' ||
                currentDataSource.id == 'OceanBase' ||
                currentDataSource.id == 'Vertica' ||
                currentDataSource.id == 'IBMDB2' ||
                currentDataSource.id == 'Teradata' ||
                currentDataSource.id == 'DM' ||
                currentDataSource.id == 'GBase_8a' ||
                currentDataSource.id == 'KingbaseES' ||
                currentDataSource.id == 'GoldenDB' ||
                currentDataSource.id == 'openGauss' ||
                currentDataSource.id == 'StarRocks' ||
                currentDataSource.id == 'Doris' ||
                currentDataSource.id == 'GreenPlum'
              "
              >
              <ClickHouse v-model="dialogForm.connect_info_dev" ref="connectInfoDev"></ClickHouse>
            </el-form-item>
            <el-form-item prop="connect_info_dev" label-width="0" v-if="currentDataSource.id == 'Hdfs'">
              <Hdfs v-model="dialogForm.connect_info_dev" ref="connectInfoDev"></Hdfs>
            </el-form-item>
            <el-form-item prop="connect_info_dev" label-width="0" v-if="currentDataSource.id == 'Hive'">
              <Hive v-model="dialogForm.connect_info_dev" ref="connectInfoDev"></Hive>
            </el-form-item>
            <el-form-item prop="connect_info_dev" label-width="0" v-if="currentDataSource.id == 'Kafka'">
              <Kafka v-model="dialogForm.connect_info_dev" ref="connectInfoDev"></Kafka>
            </el-form-item>
          </div>
        </div>
       
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Elasticsearch from './formList/Elasticsearch.vue'
import ClickHouse from './formList/ClickHouse.vue'
import Hdfs from './formList/Hdfs.vue'
import Hive from './formList/Hive.vue'
import Kafka from './formList/Kafka.vue'
import {
  getDataSourceVersion
} from '@/api/management/datasource'
export default {
  name: 'Form',
  props: {
    currentDataSource: {
      type: Object,
      default: () => {}
    },
    editDatasource: Object,
    isEdit: Boolean
  },
  components: {
    Elasticsearch,
    ClickHouse,
    Hdfs,
    Hive,
    Kafka
  },
  watch: {
    editDatasource: {
      handler(val) {
        if (val && JSON.stringify(val) !== '{}') {
          this.dialogForm.data_source_name = val.data_source_name
          this.dialogForm.data_source_code = val.data_source_code
          this.dialogForm.data_source_desc = val.data_source_desc
          this.dialogForm.mode_type = val.mode_type
          this.dialogForm.version = val.version
          if (this.currentDataSource.id === 'Kafka') {
            this.dialogForm.connect_info_dev = {
              ...val.connect_info_dev,
              krb5type: '1',
              keytabtype: '1',
              jaasType: '1'
            }
            this.dialogForm.connect_info_pro = {
              ...val.connect_info_pro,
              krb5type: '1',
              keytabtype: '1',
              jaasType: '1'
            }
          } else {
            this.dialogForm.connect_info_dev = {
              ...val.connect_info_dev,
              krb5type: '1',
              keytabtype: '1'
            }
            this.dialogForm.connect_info_pro = {
              ...val.connect_info_pro,
              krb5type: '1',
              keytabtype: '1'
            }
          }
          // this.dialogForm.connect_info_dev = {
          //   ...val.connect_info_dev,
          //   krb5type: '1',
          //   keytabtype: '1',
          //   jaasType: '1'
          // }
          // this.dialogForm.connect_info_pro = {
          //   ...val.connect_info_pro,
          //   krb5type: '1',
          //   keytabtype: '1',
          //   jaasType: '1'
          // }
          if (this.dialogForm.connect_info_dev.jdbcpassword) {
            this.dialogForm.connect_info_dev.jdbcpassword = this.decrypt(val.connect_info_dev.jdbcpassword)
          }
          if (this.dialogForm.connect_info_pro.jdbcpassword) {
            this.dialogForm.connect_info_pro.jdbcpassword = this.decrypt(val.connect_info_pro.jdbcpassword)
          }
          if (this.dialogForm.connect_info_dev.metajdbcpassword) {
            this.dialogForm.connect_info_dev.metajdbcpassword = this.decrypt(val.connect_info_dev.metajdbcpassword)
          }
          if (this.dialogForm.connect_info_pro.metajdbcpassword) {
            this.dialogForm.connect_info_pro.metajdbcpassword = this.decrypt(val.connect_info_pro.metajdbcpassword)
          }
          if (this.dialogForm.connect_info_dev.password) {
            this.dialogForm.connect_info_dev.password = this.decrypt(val.connect_info_dev.password)
          }
          if (this.dialogForm.connect_info_pro.password) {
            this.dialogForm.connect_info_pro.password = this.decrypt(val.connect_info_pro.password)
          }
          // if (this.currentDataSource.id === 'Hive') {
          //   this.dialogForm.connect_info_dev.jdbcpassword = this.decrypt(val.connect_info_dev.jdbcpassword || '')
          //   this.dialogForm.connect_info_pro.jdbcpassword = this.decrypt(val.connect_info_pro.jdbcpassword || '')
          //   this.dialogForm.connect_info_dev.metajdbcpassword = this.decrypt(val.connect_info_dev.metajdbcpassword || '')
          //   this.dialogForm.connect_info_pro.metajdbcpassword = this.decrypt(val.connect_info_pro.metajdbcpassword || '')
          // }
          // if (this.currentDataSource.id === 'ClickHouse' ||
          //   this.currentDataSource.id === 'MySQL' ||
          //   this.currentDataSource.id === 'TiDB' ||
          //   this.currentDataSource.id === 'Oracle'
          // ) {
          //   this.dialogForm.connect_info_dev.jdbcpassword = this.decrypt(val.connect_info_dev.jdbcpassword || '')
          //   this.dialogForm.connect_info_pro.jdbcpassword = this.decrypt(val.connect_info_pro.jdbcpassword || '')
          // }
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    this.loading = true
    await this.getDataSourceVersion()
    if (this.currentDataSource.id !== 'Hdfs' && !(this.editDatasource && JSON.stringify(this.editDatasource) !== '{}')) {
      this.$set(this.dialogForm, 'version', this.versionList[0].version)
    }
    this.loading = false
  },
  data() {
    return {
      dialogForm: {
        data_source_code: '',
        data_source_name: '',
        data_source_desc: '',
        mode_type: '1',
        version: '5.x',
        connect_info_dev: {},
        connect_info_pro: {}
      },
      rules: {
        data_source_code: [
          { required: true, message: '请输入数据源编码', trigger: 'blur' },
          { max: 32, message: '数据源编码不能超过32个字', trigger: 'blur' }
        ],
        data_source_name: [
          { required: true, message: '请输入数据源名称', trigger: 'blur' },
          { max: 32, message: '数据源名称不能超过32个字', trigger: 'blur' }
        ],
        connect_info_dev: [
          { validator: this.validateConnectInfoDev, trigger: 'blur' }
        ],
        connect_info_pro: [
          { validator: this.validateConnectInfoPro, trigger: 'blur' }
        ]
      },
      versionList: [],
      loading: false
    }
  },
  methods: {
    changeDatasourceConfig(val) {
      this.$emit('changeDatasourceConfig', val)
    },
    getData() {
      let data = null
      this.$refs['ruleForm'].validate((valid) => {
        console.log(valid, 'valid')
        if (valid) {
          data = {
            ...this.dialogForm,
            id: this.editDatasource ? this.editDatasource.id : null
          }
        } else {
          data = false
        }
      })
      return data
    },
    validateConnectInfoDev(rule, value, callback) {
      this.$refs.connectInfoDev.$refs.ruleForm.validate(val => {
        if (val) {
          callback()
        } else {
          callback('请输入必填项')
        }
      })
    },
    validateConnectInfoPro(rule, value, callback) {
      this.$refs.connectInfoPro.$refs.ruleForm.validate(val => {
        console.log(val, 'val')
        if (val) {
          callback()
        } else {
          callback('请输入必填项')
        }
      })
    },
    // 获取数据源版本号
    async getDataSourceVersion() {
      const res = await this.$simpleAsyncTo(getDataSourceVersion({data_source_type: this.currentDataSource.id}), '获取数据源版本号失败')
      if (res) {
        this.versionList = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
}
.sub-form-wrapper {
  padding: 10px 0;
  margin-top: 10px;
  // background: #fff;
}
</style>