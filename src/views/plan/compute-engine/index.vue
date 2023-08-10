<template>
  <div class="compute-engine height-100per">
    <div class="page-title">
      <span>
        计算引擎源&nbsp;
        <i class="el-icon-warning-outline"></i>
      </span>
      <div class="fr flex-layout">
        <el-input
          v-model="engine_name"
          placeholder="请搜索计算引擎源"
          prefix-icon="el-icon-search"
          class="mr-15"
          clearable
        ></el-input>
        <el-button type="primary" @click="handleAddComputeEngine" icon="el-icon-plus">添加计算引擎源</el-button>
        <el-button
          type="primary"
          :disabled="selectedIds.length>0?false:true"
          @click="handleBatchDel"
        >批量删除</el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="table-content">
        <el-table :data="tableList" class="table-list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <span v-show="scope.row.test_flag">
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">
                    <span v-for="(item,index) in engineTestDataInfo" :key="index"><span>{{item.info}}</span><br/></span>
                  </div>
                  <i class="el-icon-warning" style="font-size:16px;color:#E6A23C"></i>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="engine_name" label="数据源名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="project_name" label="已绑定项目" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="创建信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>创建用户：{{scope.row.create_user}}</div>
              <div>创建时间：{{scope.row.create_time}}</div>
              <div>更新时间：{{scope.row.modify_time}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="engine_source_name" label="计算引擎源类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="连接信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>Endpoint：{{scope.row.endpoint}}</div>
              <div>Project_Name： {{scope.row.project_name}}</div>
              <div>Access_ID：{{scope.row.modify_time}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                title="测试连接"
                icon="font-16 el-icon-link"
                @click="handleTestConnection(scope.row)"
              ></el-button>
              <el-button
                type="text"
                class="mr-10"
                title="编辑"
                icon="font-16 el-icon-edit-outline"
                @click="handleEditComputeEngine(scope.row)"
              ></el-button>
              <SimpleConfirm @confirm="handleDeleteComputeEngine(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr pt-10"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pageFilters.pageSize"
          :page-sizes="pageSizes"
          :current-page.sync="pageFilters.pageNo"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :destroy-on-close="true"
      width="45%"
      :before-close="handleCancel"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="formRules"
        label-width="135px"
        label-position="right"
        label-suffix="："
        :style="{'max-height': `${dialogBodyHeight}px`,'overflow': 'auto'}"
        @keyup.native.enter="nextStep"
        v-show="isShowForm"
        v-loading="!!loading"
      >
        <el-form-item label="计算引擎源类型" prop="engine_type">
          <el-select v-model="dialogForm.engine_type">
            <el-option
              v-for="(item,index) in dics.engine_type"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计算引擎源名称" prop="engine_name">
          <el-input
            v-model="dialogForm.engine_name"
            maxlength="32"
            show-word-limit
            placeholder="最多输入32个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="计算引擎源描述" prop="engine_desc">
          <el-input
            v-model="dialogForm.engine_desc"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="最多输入200个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="EndPoint" prop="endpoint">
          <el-input
            v-model="dialogForm.endpoint"
            placeholder="请正确输入ambari URL，如http://ip:port/api/v1/clusters/maxc"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="access_id">
          <el-input
            v-model="dialogForm.access_id"
            placeholder="请输入鉴权Access ID，为保证任务正常执行，请确保有所需数据权限"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="access_key">
          <el-input v-model="dialogForm.access_key" placeholder="请输入鉴权Access Key" type="password"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="configInfo"
        ref="configInfo"
        label-width="140px"
        class="demo-ruleForm pr-20"
        style="width:100%"
        label-suffix="：" v-show="!isShowForm" :style="{'max-height': `${dialogBodyHeight}px`,'overflow': 'auto'}">
        <el-form-item label-width="0">
          <div class="f-size spark">
            <span>HDFS配置</span>
            <span>
              <el-tooltip class="item" effect="dark" content="自定义HDFS参数" placement="top">
                <i class="el-icon-circle-plus-outline font-18" @click="addHDFSParams"></i>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="HDFS URL" prop="fs_defaultFS">
          <el-input v-model="configInfo.HDFS_obj.fs_defaultFS"></el-input>
        </el-form-item>
        <el-form-item label="配置文件" prop="configpath">
          <el-upload
            style="display:inline-block"
            action=""
            :auto-upload="false"
            :on-success="configUpSuccess"
            :onChange="configUploadChange"
            :file-list="configpathList">
            <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
            <p v-if="!configpathList.length">{{configInfo.HDFS_obj.configpath}}</p>
          </el-upload>
        </el-form-item>
        <el-form-item label="Kerberos" prop="Kerberosenable">
          <el-radio-group v-model="configInfo.HDFS_obj.Kerberosenable" @change="changeKerberosenable">
            <el-radio label="1">开启</el-radio>
            <el-radio label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Krb5文件" prop="krb5path" v-if="configInfo.HDFS_obj.Kerberosenable !== '0'">
          <el-upload
            v-if="configInfo.HDFS_obj.krb5type === '0'"
            style="display:inline-block"
            action=""
            :auto-upload="false"
            :on-success="krb5pathUpSuccess"
            :onChange="krb5pathUploadChange"
            :file-list="krb5pathList">
            <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
          </el-upload>
          <el-input
            v-if="configInfo.HDFS_obj.krb5type === '1'"
            v-model="configInfo.HDFS_obj.krb5path"
            placeholder="请输入krb5path地址"
            style="width: 60%"
          ></el-input>
          <el-button type="text" class="ml-10" @click="krb5typeClick">切换为KDC地址配置</el-button>
          <p v-if="!krb5pathList.length">{{configInfo.HDFS_obj.krb5path}}</p>
        </el-form-item>
        <el-form-item label="Keytab文件" prop="keytabpath" v-if="configInfo.HDFS_obj.Kerberosenable !== '0'">
          <el-upload
            v-if="configInfo.HDFS_obj.keytabtype === '0'"
            style="display:inline-block"
            action=""
            :auto-upload="false"
            :on-success="keytabpathUpSuccess"
            :onChange="keytabpathUploadChange"
            :file-list="keytabpathList">
            <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
          </el-upload>
          <el-input
            v-if="configInfo.HDFS_obj.keytabtype === '1'"
            v-model="configInfo.HDFS_obj.keytabpath"
            placeholder="请输入keytabpath地址"
            style="width: 60%"
          ></el-input>
          <el-button type="text" class="ml-10" @click="keytabpathClick">切换为KDC地址配置</el-button>
          <p v-if="!keytabpathList.length">{{configInfo.HDFS_obj.keytabpath}}</p>
        </el-form-item>
        <el-form-item v-for="(item,index) in configInfo.HDFS_no_custom_obj" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delHDFS(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size">Hive配置</div>
        </el-form-item>
        <el-form-item label="JDBC连接串" prop="connction_url">
          <el-input v-model="configInfo.hive_obj.connction_url"></el-input>
        </el-form-item>
        <el-form-item label="JDBC连接用户名" prop="connction_user_name">
          <el-input v-model="configInfo.hive_obj.connction_user_name"></el-input>
        </el-form-item>
        <el-form-item label="JDBC连接密码" prop="connction_user_passwd">
          <el-input v-model="configInfo.hive_obj.connction_user_passwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="thrift_port">
          <el-input v-model="configInfo.hive_obj.thrift_port"></el-input>
        </el-form-item>
        <el-form-item label="hive.login.keytab" prop="hiveLoginKeytab">
          <el-input v-model="configInfo.hive_obj.hiveLoginKeytab"></el-input>
        </el-form-item>
        <el-form-item label="hive.principal" prop="hivePrincipal">
          <el-input v-model="configInfo.hive_obj.hivePrincipal"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size">源数据配置</div>
        </el-form-item>
        <el-form-item label="元数据类型" prop="hive_database_type">
          <el-input v-model="configInfo.hive_meta_obj.hive_database_type"></el-input>
        </el-form-item>
        <el-form-item label="元数据地址" prop="metastore_host">
          <el-input v-model="configInfo.hive_meta_obj.metastore_host"></el-input>
        </el-form-item>
        <el-form-item label="元数据用户名" prop="metastore_user_name">
          <el-input v-model="configInfo.hive_meta_obj.metastore_user_name"></el-input>
        </el-form-item>
        <el-form-item label="元数据密码" prop="metastore_user_passwd">
          <el-input v-model="configInfo.hive_meta_obj.metastore_user_passwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size spark">
            <span>Spark配置</span>
            <span>
              <el-tooltip class="item" effect="dark" content="自定义Spark参数" placement="top">
                <i class="el-icon-circle-plus-outline font-18" @click="addAparkParameter"></i>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="spark_yarn_queue" prop="spark_yarn_queue">
          <el-input v-model="configInfo.spark_obj.spark_yarn_queue"></el-input>
        </el-form-item>
        <el-form-item label="executor_cores" prop="executor_cores">
          <el-input v-model="configInfo.spark_obj.executor_cores"></el-input>
        </el-form-item>
        <el-form-item label="num_executors" prop="num_executors">
          <el-input v-model="configInfo.spark_obj.num_executors"></el-input>
        </el-form-item>
        <el-form-item label="executor_memory" prop="executor_memory">
          <el-input v-model="configInfo.spark_obj.executor_memory"></el-input>
        </el-form-item>
        <el-form-item label="driver_memory" prop="driver_memory">
          <el-input v-model="configInfo.spark_obj.driver_memory"></el-input>
        </el-form-item>
        <el-form-item label="queue" prop="queue">
          <el-input v-model="configInfo.spark_obj.queue"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in configInfo.spark_no_suctom_obj" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delRow(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size spark">
            <span>Tez配置</span>
            <span>
              <el-tooltip class="item" effect="dark" content="自定义Tze参数" placement="top">
                <i class="el-icon-circle-plus-outline font-18" @click="addTzeParams"></i>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="队列名" prop="tez_queue_name">
          <el-input v-model="configInfo.tze_obj.tez_queue_name"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in configInfo.tze_no_custom_obj" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delTze(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size spark">
            <span>MapReduce配置</span>
            <span>
              <el-tooltip class="item" effect="dark" content="自定义MapReduce参数" placement="top">
                <i class="el-icon-circle-plus-outline font-18" @click="addMapReduceParams"></i>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="队列名" prop="mapreduce_job_queuename">
          <el-input v-model="configInfo.mapreduce_obj.mapreduce_job_queuename"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in configInfo.mapreduce_no_custom_obj" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delMapReduce(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size spark">
            <span>存储配置</span>
            <span>
              <el-tooltip class="item" effect="dark" content="自定义存储配置参数" placement="top">
                <i class="el-icon-circle-plus-outline font-18" @click="addStorageParams"></i>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="表存储文件格式" prop="storage_format">
          <el-input v-model="configInfo.storge_obj.storage_format"></el-input>
        </el-form-item>
        <el-form-item label="表文件压缩格式" prop="compress_format">
          <el-input v-model="configInfo.storge_obj.compress_format"></el-input>
        </el-form-item>
        <el-form-item label="文件行分隔符" prop="line_separator">
          <el-input v-model="configInfo.storge_obj.line_separator"></el-input>
        </el-form-item>
        <el-form-item label="文件列分隔符" prop="column_separator">
          <el-input v-model="configInfo.storge_obj.column_separator"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in configInfo.storage_no_custom_obj" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delStorageParams(index)"> — </span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="upStep" v-show="!isShowForm">上一步</el-button>
        <el-button type="primary" @click="handleConfirm" v-show="!isShowForm">确 定</el-button>
        <el-button type="primary" @click="nextStep" v-show="isShowForm">下一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import dialogHeight from '@/mixins/dialog-height'
import {
  getTableList,
  getSourceTypeList,
  addComputeEngine,
  editComputeEngine,
  delComputeEngine,
  batchDelComputeEngine,
  getProjectList,
  getTestConnection,
  getInfos,
  getEngineById
} from '@/api/plan/compute-engine'
export default {
  name: 'ComputeEngine',
  mixins: [pager, dialogHeight],
  data() {
    return {
      configpathList: [],
      krb5pathList: [],
      keytabpathList: [],
      engine_name: '',
      tableList: [],
      selectedIds: [],
      // currentComputeEngine: 'MaxCompute',
      dialogVisible: false,
      dialogTitle: '',
      dialogForm: this.dialogFormReset(),
      configInfo: this.configInfoReset(),
      sourceTypeList: [],
      formRules: {
        engine_type: [{required: true, message: '请选择计算引擎源类型'}],
        engine_name: [
          {required: true, message: '请输入计算引擎源名称'},
          {
            max: 120,
            message: '计算引擎源名称不能超过120个字',
            trigger: ['blur', 'change']
          }
        ],
        endpoint: [{required: true, message: '请输入EndPoint'}],
        access_id: [{required: true, message: '请输入鉴权AccessID'}],
        access_key: [{required: true, message: '请输入鉴权AccessKey'}]
      },
      projectList: [],
      engineTestDataInfo: [],
      isShowForm: true,
      loading: 0,
      // metaInfos: {},
      HDFSParameterList: [],
      hiveParameterList: [],
      mapReduceParameterList: [],
      metaDataParameterList: [],
      sparkParameterList: [],
      storgeParameterList: [],
      tzeParameterList: [],
      krb5path: '',
      keytabpath: ''
    }
  },
  created() {
    this.getProjectList()
    this.getSourceTypeList()
    this.getTableList()
  },
  watch: {
    engine_name(newVal, oldVal) {
      this.getTableList()
    },
    // 'dialogForm.engine_type': {
    //   handler(val) {
    //     if (val === 0) {
    //       this.$refs.configInfo.resetFields()
    //     }
    //   }
    // }
  },
  methods: {
    // 获取物理引擎源列表
    async getTableList() {
      const params = {
        engine_name: this.engine_name,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(
        getTableList(params),
        '获取物理引擎源列表失败'
      )
      if (res) {
        this.tableList = res.data
        this.total = res.totalRecords
        this.tableList = this.tableList.map(e => {
          return {...e, test_flag: false}
        })
      }
    },
    // 测试连接
    async handleTestConnection(row) {
      const res = await this.$simpleAsyncTo(getTestConnection({id: row.id}), '测试连接失败')
      if (res) {
        row.test_flag = true
        this.engineTestDataInfo = res.data
        this.$message({
          type: 'success',
          message: '完成连接的测试，hover列表第一列icon提示以获取详情'
        })
      }
    },
    handleAddComputeEngine() {
      this.dialogTitle = '新建计算机引擎源'
      this.dialogVisible = true
      this.dialogForm = this.dialogFormReset()
    },
    // 批量删除
    handleBatchDel() {
      this.$confirm('确认删除选中的数据源吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.batchDelComputeEngine()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 批量删除
    async batchDelComputeEngine() {
      const params = {
        id: this.selectedIds.join(',')
      }
      const res = await this.$simpleAsyncTo(
        batchDelComputeEngine(params),
        '批量删除失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '批量删除成功!'
        })
        this.getTableList()
      }
    },
    // 删除计算引擎
    async handleDeleteComputeEngine(row) {
      const res = await this.$simpleAsyncTo(
        delComputeEngine({
          id: row.id
        }),
        '删除计算引擎源失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },
    // 选中表格项
    handleSelectionChange(rows) {
      this.selectedIds = []
      rows.forEach(item => {
        this.selectedIds.push(item.id)
      })
    },
    handleCancel() {
      this.dialogVisible = false
      this.isShowForm = true
      this.$refs.dialogForm.resetFields()
      // this.$refs.configInfo.resetFields()
      this.dialogForm = this.dialogFormReset()
      // this.configInfo = this.configInfoReset()
      this.configpathList = []
      this.krb5pathList = []
      this.keytabpathList = []
      this.configInfo = this.configInfoReset()
    },
    // 初始化表单
    dialogFormReset() {
      return {
        engine_type: '',
        engine_name: '',
        engine_desc: '',
        endpoint: '',
        access_id: '',
        access_key: ''
      }
    },
    configInfoReset() {
      return {
        HDFS_obj: {
          fs_defaultFS: '',
          Kerberosenable: '0',
          krb5type: '0',
          krb5path: '',
          keytabtype: '0',
          keytabpath: '',
          configpath: ''
        },
        hive_obj: {
          connction_url: '',
          connction_user_name: '',
          connction_user_passwd: '',
          hiveLoginKeytab: '',
          hivePrincipal: '',
          thrift_port: ''
        },
        hive_meta_obj: {
          hive_database_type: '',
          metastore_host: '',
          metastore_user_name: '',
          metastore_user_passwd: ''
        },
        spark_obj: {
          spark_yarn_queue: '',
          driver_memory: '',
          executor_cores: '',
          executor_memory: '',
          num_executors: '',
          queue: '',
          spark_param1: ''
        },
        tze_obj: {
          tez_queue_name: ''
        },
        mapreduce_obj: {
          mapreduce_job_queuename: ''
        },
        storge_obj: {
          storage_format: '',
          compress_format: '',
          line_separator: '',
          column_separator: ''
        },
        HDFS_no_custom_obj: [],
        hive_no_custom_obj: [],
        hive_meta_no_custom_obj: [],
        spark_no_suctom_obj: [],
        tze_no_custom_obj: [],
        mapreduce_no_custom_obj: [],
        storage_no_custom_obj: []
      }
    },
    // 获取项目列表
    async getProjectList() {
      const res = await this.$simpleAsyncTo(
        getProjectList(),
        '获取项目列表失败'
      )
      if (res) {
        this.projectList = res.data
      }
    },
    // 获取数据源类型列表
    async getSourceTypeList() {
      const res = await this.$simpleAsyncTo(
        getSourceTypeList(),
        '获取数据源类型列表失败'
      )
      if (res) {
        this.sourceTypeList = res.data
      }
    },
    upStep() {
      this.isShowForm = true
    },
    handleConfirm() {
      this.$refs.configInfo.validate(valid => {
        if (valid) {
          this.handleComputeEngine()
        }
      })
    },
    async handleComputeEngine() {
      if (this.dialogForm.id) {
        const fd = this.getParams()
        const res = await this.$simpleAsyncTo(
          editComputeEngine(fd, 'upload'),
          '编辑计算引擎源失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '编辑计算引擎源成功!'
          })
        }
      } else {
        if (this.configInfo.HDFS_obj.Kerberosenable === '1' && this.configInfo.HDFS_obj.krb5type === '0' && this.krb5pathList.length === 0) {
          return this.$message({
            type: 'warning',
            message: '请选择krb5文件上传'
          })
        }
        if (this.configInfo.HDFS_obj.Kerberosenable === '1' && this.configInfo.HDFS_obj.keytabtype === '0' && this.keytabpathList.length === 0) {
          return this.$message({
            type: 'warning',
            message: '请选择keytab文件上传'
          })
        }
        const fd = this.getParams()
        const res = await this.$simpleAsyncTo(
          addComputeEngine(fd, 'upload'),
          '新增计算引擎源失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '新建计算引擎源成功!'
          })
        }
      }
      this.handleCancel()
      this.getTableList()
      this.globalLoading().close()
    },
    getParams() {
      const params = {
        ...this.dialogForm
      }
      params.access_key = this.encrypt(params.access_key)
      let fd = new FormData()
      const configpath = this.configpathList[0] && this.configpathList[0].raw
      let HDFSParameterList = [], hiveParameterList = [], metaDataParameterList = [], sparkParameterList = [], tzeParameterList = [], mapReduceParameterList = [], storgeParameterList = []
      for(let key in this.configInfo.HDFS_obj) {
        HDFSParameterList.push({
          code: key,
          value: this.configInfo.HDFS_obj[key],
          param_type: 0,
          iscustom: 1
        })
      }
      for(let key in this.configInfo.hive_obj) {
        if (key === 'connction_user_passwd') {
          hiveParameterList.push({
            code: key,
            value: this.configInfo.hive_obj[key] && this.encrypt(this.configInfo.hive_obj[key]),
            param_type: 1,
            iscustom: 1
          })
        } else {
          hiveParameterList.push({
            code: key,
            value: this.configInfo.hive_obj[key],
            param_type: 1,
            iscustom: 1
          })
        }
      }
      for(let key in this.configInfo.hive_meta_obj) {
        if (key === 'metastore_user_passwd') {
          metaDataParameterList.push({
            code: key,
            value: this.configInfo.hive_meta_obj[key] && this.encrypt(this.configInfo.hive_meta_obj[key]),
            param_type: 2,
            iscustom: 1
          })
        } else {
          metaDataParameterList.push({
            code: key,
            value: this.configInfo.hive_meta_obj[key],
            param_type: 2,
            iscustom: 1
          })
        }
      }
      for(let key in this.configInfo.spark_obj) {
        sparkParameterList.push({
          code: key,
          value: this.configInfo.spark_obj[key],
          param_type: 3,
          iscustom: 1
        })
      }
      for(let key in this.configInfo.tze_obj) {
        tzeParameterList.push({
          code: key,
          value: this.configInfo.tze_obj[key],
          param_type: 4,
          iscustom: 1
        })
      }
      for(let key in this.configInfo.mapreduce_obj) {
        mapReduceParameterList.push({
          code: key,
          value: this.configInfo.mapreduce_obj[key],
          param_type: 5,
          iscustom:  1
        })
      }
      for(let key in this.configInfo.storge_obj) {
        storgeParameterList.push({
          code: key,
          value: this.configInfo.storge_obj[key],
          param_type: 6,
          iscustom: 1
        })
      }
      if (this.configInfo.HDFS_obj.krb5type === '0' && this.configInfo.HDFS_obj.Kerberosenable === '1' && this.krb5pathList[0]) {
        const krb5path = this.krb5pathList[0].raw
        fd.append('krb5path', krb5path)
      }
      if (this.configInfo.HDFS_obj.keytabtype === '0' && this.configInfo.HDFS_obj.Kerberosenable === '1' && this.keytabpathList[0]) {
        const keytabpath = this.keytabpathList[0].raw
        fd.append('keytabpath', keytabpath)
      }
      if (this.configpathList[0]) {
        fd.append('configpath', configpath)
      }
      HDFSParameterList = [...HDFSParameterList, ...this.configInfo.HDFS_no_custom_obj]
      hiveParameterList = [...hiveParameterList, ...this.configInfo.hive_no_custom_obj]
      metaDataParameterList = [...metaDataParameterList, ...this.configInfo.hive_meta_no_custom_obj]
      sparkParameterList = [...sparkParameterList, ...this.configInfo.spark_no_suctom_obj]
      tzeParameterList = [...tzeParameterList, ...this.configInfo.tze_no_custom_obj]
      mapReduceParameterList = [...mapReduceParameterList, ...this.configInfo.mapreduce_no_custom_obj]
      storgeParameterList = [...storgeParameterList, ...this.configInfo.storage_no_custom_obj]
      params.HDFSParameterList = JSON.stringify(HDFSParameterList)
      params.hiveParameterList = JSON.stringify(hiveParameterList)
      params.metaDataParameterList = JSON.stringify(metaDataParameterList)
      params.sparkParameterList = JSON.stringify(sparkParameterList)
      params.tzeParameterList = JSON.stringify(tzeParameterList)
      params.mapReduceParameterList = JSON.stringify(mapReduceParameterList)
      params.storgeParameterList = JSON.stringify(storgeParameterList)
      for(let key in params) {
        fd.append(key, params[key])
      }
      return fd
    },
    nextStep() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          if (this.dialogTitle.indexOf('编辑') > -1) {
            this.isShowForm = false
          } else if (this.dialogTitle.indexOf('新建') > -1) {
            const params = {
              endpoint: this.dialogForm.endpoint,
              amberi_user: this.dialogForm.access_id,
              amberi_passwd: this.encrypt(this.dialogForm.access_key)
            }
            this.globalLoading('读取信息中...')
            const res = await this.$simpleAsyncTo(getInfos(params), '读取信息失败')
            if (res) {
              this.isShowForm = false
              this.setConfig(res)
            }
          }
          this.globalLoading().close()
        }
      })
    },
    setConfig(res) {
      this.HDFSParameterList = res.data.HDFSParameterList
      this.hiveParameterList = res.data.hiveParameterList
      this.metaDataParameterList = res.data.metaDataParameterList
      this.sparkParameterList = res.data.sparkParameterList
      this.tzeParameterList = res.data.tzeParameterList
      this.mapReduceParameterList = res.data.mapReduceParameterList
      this.storgeParameterList = res.data.storgeParameterList
      this.HDFSParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            this.configInfo.HDFS_obj[item.code] = item.value
          }
        } else {
          this.configInfo.HDFS_no_custom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
      this.hiveParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            if (item.code === 'connction_user_passwd') {
              this.configInfo.hive_obj[item.code] = this.decrypt(item.value)
            } else {
              this.configInfo.hive_obj[item.code] = item.value
            }
          }
        } else {
          this.configInfo.hive_no_custom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
      this.metaDataParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            if (item.code === 'metastore_user_passwd') {
              this.configInfo.hive_meta_obj[item.code] = this.decrypt(item.value)
            } else {
              this.configInfo.hive_meta_obj[item.code] = item.value
            }
          }
        } else {
          this.configInfo.hive_meta_no_custom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
      this.sparkParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            this.configInfo.spark_obj[item.code] = item.value
          }
        } else {
          this.configInfo.spark_no_suctom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
      this.tzeParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            this.configInfo.tze_obj[item.code] = item.value
          }
        } else {
          this.configInfo.tze_no_custom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
      this.mapReduceParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            this.configInfo.mapreduce_obj[item.code] = item.value
          }
        } else {
          this.configInfo.mapreduce_no_custom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
      this.storgeParameterList.forEach(item => {
        if (item.iscustom === 1) {
          if (item.value) {
            this.configInfo.storge_obj[item.code] = item.value
          }
        } else {
          this.configInfo.storage_no_custom_obj.push({
            code: item.code,
            value: item.value
          })
        }
      })
    },
    addHDFSParams() {
      this.configInfo.HDFS_no_custom_obj.push({
        code: '',
        value: '',
        param_type: 0,
        iscustom: 0
      })
    },
    addAparkParameter() {
      this.configInfo.spark_no_suctom_obj.push({
        code: '',
        value: '',
        param_type: 3,
        iscustom: 0
      })
    },
    addTzeParams() {
      this.configInfo.tze_no_custom_obj.push({
        code: '',
        value: '',
        param_type: 4,
        iscustom: 0
      })
    },
    addMapReduceParams() {
      this.configInfo.mapreduce_no_custom_obj.push({
        code: '',
        value: '',
        param_type: 5,
        iscustom: 0
      })
    },
    addStorageParams() {
      this.configInfo.storge_obj.push({
        code: '',
        value: '',
        param_type: 6,
        iscustom: 0
      })
    },
    delHDFS(index) {
      this.configInfo.HDFS_no_custom_obj.splice(index, 1)
    },
    delRow(index) {
      this.configInfo.spark_no_suctom_obj.splice(index, 1)
    },
    delTze(index) {
      this.configInfo.tze_no_custom_obj.splice(index, 1)
    },
    delMapReduce(index) {
      this.configInfo.mapreduce_no_custom_obj.splice(index, 1)
    },
    delStorageParams(index) {
      this.configInfo.storage_no_custom_obj.splice(index, 1)
    },
    configUpSuccess() {},
    configUploadChange(file, fileList) {
      this.configpathList = fileList
    },
    changeKerberosenable(val) {
      this.krb5pathList = []
      this.krb5path = ''
      this.keytabpath = ''
      this.keytabpathList = []
      this.loginkeytab = ''
      this.principal = ''
    },
    krb5pathUpSuccess() {},
    krb5pathUploadChange(file, fileList) {
      this.krb5pathList = fileList
    },
    krb5typeClick() {
      this.configInfo.HDFS_obj.krb5path = ''
      this.krb5path = ''
      this.krb5pathList = []
      if (this.configInfo.HDFS_obj.krb5type === '0') {
        this.configInfo.HDFS_obj.krb5type = '1'
      } else {
        this.configInfo.HDFS_obj.krb5type = '0'
      }
    },
    keytabpathUpSuccess() {},
    keytabpathUploadChange(file, fileList) {
      this.keytabpathList = fileList
    },
    keytabpathClick() {
      this.configInfo.HDFS_obj.keytabpath = ''
      this.keytabpath = ''
      this.keytabpathList = []
      if (this.configInfo.HDFS_obj.keytabtype === '0') {
        this.configInfo.HDFS_obj.keytabtype = '1'
      } else {
        this.configInfo.HDFS_obj.keytabtype = '0'
      }
    },
    async handleEditComputeEngine(row) {
      this.loading++
      this.dialogTitle = '编辑计算机引擎源'
      this.sparkParameterList = []
      this.HDFSParameterList = []
      this.tzeParameterList = []
      this.mapReduceParameterList = []
      this.dialogVisible = true
      const res = await this.$simpleAsyncTo(getEngineById({id: row.id}))
      if (res) {
        this.dialogForm.engine_type = res.data.engine_type
        this.dialogForm.engine_name = res.data.engine_name
        this.dialogForm.engine_desc = res.data.engine_desc
        this.dialogForm.endpoint = res.data.endpoind
        this.dialogForm.access_id = res.data.amberi_user
        this.dialogForm.access_key = this.decrypt(res.data.amberi_passwd)
        this.dialogForm.id = res.data.id
        this.setConfig(res)
      }
      this.loading--
    },
  }
}
</script>

<style lang="scss" scoped>
.compute-engine {
  // .info-box{
  //   font-size:12px;
  //   color:$grey4;
  //   height:38px;
  //   padding-bottom:10px;
  // }
  .content-box {
    height: calc(100% - 40px);
  }
  .f-size {
    text-align: start!important;
    font-weight: 600;
  }
}
</style>
<style lang="scss">
@import '@/assets/css/mixins.scss';
.demo-ruleForm {
  @include scrollbar($grey4, 4px);
  .spark {
    display: flex;
    justify-content: space-between;
    i {
      cursor: pointer;
      color: $waitRun;
    }
  }
  .custom-spark {
    .spark-value {
      width: calc(100% - 25px);
    }
    .del {
      display: inline-block;
      width: 20px;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      color: $waitRun;
    }
  }
}
</style>
