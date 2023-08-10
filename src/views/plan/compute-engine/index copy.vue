<template>
  <div class="compute-engine height-100per">
    <div class="page-title">
      <span>
        计算引擎源&nbsp;
        <i class="el-icon-warning-outline"></i>
      </span>
      <div class="fr flex-layout">
        <!-- <el-select v-model="optionValue">
          <el-option v-for="(item,index) in optionList" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>-->
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
    <!-- <div class="info-box">
      <div class="fl">
        <span>当前计算引擎：{{currentComputeEngine}}&nbsp;</span>
        <el-button type="text">修改</el-button>
      </div>
      <div class="fr">
        <span>请基于MaxCompute的console进行物理层数据源赋权，以保证本系统跨项目的数据查询&nbsp;</span>
        <el-button type="text">赋权代码</el-button>
      </div>
    </div>-->
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
            <!-- <template slot-scope="scope">
              <div>{{projectList.filter(item=>{item.id==scope.row.project_id}).length?projectList.filter(item=>{item.id==scope.row.project_id})[0].project_name:''}}</div>
            </template>-->
          </el-table-column>
          <el-table-column label="创建信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>创建用户：{{scope.row.create_user}}</div>
              <div>创建时间：{{scope.row.create_time}}</div>
              <div>更新时间：{{scope.row.modify_time}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="engine_source_name" label="计算引擎源类型" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <div>{{projectList.filter(item=>{item.id==scope.row.engine_id}).length?projectList.filter(item=>{item.id==scope.row.engine_id})[0].engine_name:''}}</div>
            </template>-->
          </el-table-column>
          <el-table-column label="连接信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>Endpoint：{{scope.row.endpoint}}</div>
              <div>Project_Name： {{scope.row.project_name}}</div>
              <!-- <div>Project_Name： {{projectList.filter(item=>{item.id==scope.row.project_id}).length?projectList.filter(item=>{item.id==scope.row.project_id})[0].project_name:''}}</div> -->
              <div>Access_ID：{{scope.row.modify_time}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <!-- <div class="operate-icon-box">
                <i class="el-icon-link" title="测试连接" @click="handleTestConnection(scope.row)"></i>
                <i
                  class="el-icon-edit-outline"
                  title="编辑"
                  @click="handleEditComputeEngine(scope.row)"
                ></i>
                <i class="el-icon-delete" title="删除" @click="handleDeleteComputeEngine(scope.row)"></i>
              </div>-->
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
        <!-- <el-form-item label="Project Name" prop="project_id">
          <el-select
            v-model="dialogForm.project_name"
            placeholder="请选择所属项目"
            @change="handleProjectChange"
          >
            <el-option
              v-for="(item,index) in projectList"
              :key="index"
              :label="item.project_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
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
        :model="congifInfo"
        :rules="congifInfoRules"
        ref="congifInfo"
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
          <el-input v-model="congifInfo.fs_defaultFS"></el-input>
        </el-form-item>
        <el-form-item label="Name Node" prop="namenode">
          <el-input v-model="congifInfo.namenode"></el-input>
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
          </el-upload>
        </el-form-item>
        <el-form-item label="Kerberos" prop="Kerberosenable" :rules="{required: true, message: 'Kerberosenable'}">
          <el-radio-group v-model="congifInfo.Kerberosenable" @change="changeKerberosenable">
            <el-radio label="1">开启</el-radio>
            <el-radio label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Krb5文件" prop="krb5path" v-if="congifInfo.Kerberosenable !== '0'">
          <el-upload
            v-if="congifInfo.krb5type === '0'"
            style="display:inline-block"
            action=""
            :auto-upload="false"
            :on-success="krb5pathUpSuccess"
            :onChange="krb5pathUploadChange"
            :file-list="krb5pathList">
            <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
          </el-upload>
          <el-input
            v-if="congifInfo.krb5type === '1'"
            v-model="congifInfo.krb5path"
            placeholder="请输入krb5path地址"
            style="width: 60%"
          ></el-input>
          <el-button type="text" class="ml-10" @click="krb5typeClick">切换为KDC地址配置</el-button>
        </el-form-item>
        <el-form-item label="Keytab文件" prop="keytabpath" v-if="congifInfo.Kerberosenable !== '0'">
          <el-upload
            v-if="congifInfo.keytabtype === '0'"
            style="display:inline-block"
            action=""
            :auto-upload="false"
            :on-success="keytabpathUpSuccess"
            :onChange="keytabpathUploadChange"
            :file-list="keytabpathList">
            <el-button type="primary" icon="el-icon-upload2" plain>选择文件上传</el-button>
          </el-upload>
          <el-input
            v-if="congifInfo.keytabtype === '1'"
            v-model="congifInfo.keytabpath"
            placeholder="请输入keytabpath地址"
            style="width: 60%"
          ></el-input>
          <el-button type="text" class="ml-10" @click="keytabpathClick">切换为KDC地址配置</el-button>
        </el-form-item>
        <el-form-item v-for="(item,index) in HDFSParameterList" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delHDFS(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size">Hive配置</div>
        </el-form-item>
        <!-- <el-form-item label="JDBC驱动串" prop="connction_driver_name">
          <el-input v-model="congifInfo.connction_driver_name"></el-input>
        </el-form-item> -->
        <el-form-item label="JDBC连接串" prop="connction_url">
          <el-input v-model="congifInfo.connction_url"></el-input>
        </el-form-item>
        <el-form-item label="JDBC连接用户名" prop="connction_user_name">
          <el-input v-model="congifInfo.connction_user_name"></el-input>
        </el-form-item>
        <el-form-item label="JDBC连接密码" prop="connction_user_passwd">
          <el-input v-model="congifInfo.connction_user_passwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="thrift_port">
          <el-input v-model="congifInfo.thrift_port"></el-input>
        </el-form-item>
        <el-form-item label="hive.login.keytab" prop="hiveLoginKeytab">
          <el-input v-model="congifInfo.hiveLoginKeytab"></el-input>
        </el-form-item>
        <el-form-item label="hive.principal" prop="hivePrincipal">
          <el-input v-model="congifInfo.hivePrincipal"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="f-size">源数据配置</div>
        </el-form-item>
        <el-form-item label="元数据类型" prop="hive_database_type">
          <el-input v-model="congifInfo.hive_database_type"></el-input>
        </el-form-item>
        <el-form-item label="元数据地址" prop="metastore_host">
          <el-input v-model="congifInfo.metastore_host"></el-input>
        </el-form-item>
        <el-form-item label="元数据用户名" prop="metastore_user_name">
          <el-input v-model="congifInfo.metastore_user_name"></el-input>
        </el-form-item>
        <el-form-item label="元数据密码" prop="metastore_user_passwd">
          <el-input v-model="congifInfo.metastore_user_passwd" type="password"></el-input>
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
          <el-input v-model="congifInfo.spark_yarn_queue"></el-input>
        </el-form-item>
        <el-form-item label="executor_cores" prop="executor_cores">
          <el-input v-model="congifInfo.executor_cores"></el-input>
        </el-form-item>
        <el-form-item label="num_executors" prop="num_executors">
          <el-input v-model="congifInfo.num_executors"></el-input>
        </el-form-item>
        <el-form-item label="executor_memory" prop="executor_memory">
          <el-input v-model="congifInfo.executor_memory"></el-input>
        </el-form-item>
        <el-form-item label="driver_memory" prop="driver_memory">
          <el-input v-model="congifInfo.driver_memory"></el-input>
        </el-form-item>
        <el-form-item label="queue" prop="queue">
          <el-input v-model="congifInfo.queue"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in sparkParameterList" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delRow(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <!-- <div class="f-size">Tez配置</div> -->
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
          <el-input v-model="congifInfo.tez_queue_name"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in tzeParameterList" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delTze(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <!-- <div class="f-size">MapReduce配置</div> -->
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
          <el-input v-model="congifInfo.mapreduce_job_queuename"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in mapReduceParameterList" :key="index" class="custom-spark">
          <el-input v-model="item.code" slot="label"></el-input>
          <el-input v-model="item.value" class="spark-value"></el-input>
          <span class="del ml-5" @click="delMapReduce(index)"> — </span>
        </el-form-item>
        <el-form-item label-width="0">
          <!-- <div class="f-size">MapReduce配置</div> -->
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
          <el-input v-model="congifInfo.storage_format"></el-input>
        </el-form-item>
        <el-form-item label="表文件压缩格式" prop="compress_format">
          <el-input v-model="congifInfo.compress_format"></el-input>
        </el-form-item>
        <el-form-item label="文件行分隔符" prop="line_separator">
          <el-input v-model="congifInfo.line_separator"></el-input>
        </el-form-item>
        <el-form-item label="文件列分隔符" prop="column_separator">
          <el-input v-model="congifInfo.column_separator"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in storageParameList" :key="index" class="custom-spark">
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
      // optionList: [
      //   {label: '全部', value: '0'},
      //   {label: '已绑项目', value: '1'},
      //   {label: '未绑项目', value: '2'}
      // ],
      // optionValue: '0',
      engine_name: '',
      tableList: [],
      selectedIds: [],
      currentComputeEngine: 'MaxCompute',
      dialogVisible: false,
      dialogTitle: '',
      dialogForm: this.dialogFormReset(),
      congifInfo: this.congifInfoReset(),
      // {
      //   engine_id: '',
      //   engine_name: '',
      //   engine_desc: '',
      //   endpoint: '',
      //   project_id: '',
      //   access_id: '',
      //   access_key: ''
      // },
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
        // project_id: [{required: true, message: '请选择所属项目'}],
        access_id: [{required: true, message: '请输入鉴权AccessID'}],
        access_key: [{required: true, message: '请输入鉴权AccessKey'}]
      },
      congifInfoRules: {},
      projectList: [],
      engineTestDataInfo: [],
      isShowForm: true,
      loading: 0,
      metaInfos: {},
      sparkParameterList: [],
      HDFSParameterList: [],
      tzeParameterList: [],
      mapReduceParameterList: [],
      storageParameList: []
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
    'dialogForm.engine_type': {
      handler(val) {
        if (val === 0) {
          this.$refs.congifInfo.resetFields()
        }
      }
    }
  },
  methods: {
    // 初始化表单
    dialogFormReset() {
      return {
        engine_type: '',
        engine_name: '',
        engine_desc: '',
        endpoint: '',
        // project_id: '',
        // project_name: '',
        access_id: '',
        access_key: ''
      }
    },
    congifInfoReset() {
      return {
        // connction_driver_name: '',
        connction_url: '',
        connction_user_name: '',
        connction_user_passwd: '',
        thrift_port: '',
        hiveLoginKeytab: '',
        hivePrincipal: '',
        hive_database_type: '',
        metastore_host: '',
        metastore_user_name: '',
        metastore_user_passwd: '',
        fs_defaultFS: '',
        namenode: '',
        spark_yarn_queue: '',
        executor_cores: '',
        num_executors: '',
        executor_memory: '',
        driver_memory: '',
        queue: '',
        tez_queue_name: '',
        mapreduce_job_queuename: '',
        Kerberosenable: '0',
        krb5type: '0',
        krb5path: '',
        keytabtype: '0',
        keytabpath: '',
        storage_format: '',
        compress_format: '',
        line_separator: '',
        column_separator: ''
      }
    },
    nextStep() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          if (this.dialogTitle.indexOf('新建') > -1) {
            const params = {
              endpoint: this.dialogForm.endpoint,
              amberi_user: this.dialogForm.access_id,
              amberi_passwd: this.encrypt(this.dialogForm.access_key)
            }
            this.globalLoading('读取信息中...')
            const res = await this.$simpleAsyncTo(getInfos(params), '读取信息失败')
            if (res) {
              // this.congifInfo.connction_driver_name = res.data.connction_driver_name
              this.congifInfo.connction_url = res.data.connction_url
              this.congifInfo.connction_user_name = res.data.connction_user_name
              this.congifInfo.connction_user_passwd = res.data.connction_user_passwd
              this.congifInfo.thrift_port = res.data.thrift_port
              this.congifInfo.hive_database_type = res.data.hive_database_type
              this.congifInfo.metastore_host = res.data.metastore_host
              this.congifInfo.metastore_user_name = res.data.metastore_user_name
              this.congifInfo.metastore_user_passwd = res.data.metastore_user_passwd
              this.congifInfo.fs_defaultFS = res.data.fs_defaultFS
              this.congifInfo.namenode = res.data.namenode
              this.congifInfo.spark_yarn_queue = res.data.spark_yarn_queue
              this.congifInfo.executor_cores = res.data.executor_cores
              this.congifInfo.num_executors = res.data.num_executors
              this.congifInfo.executor_memory = res.data.executor_memory
              this.congifInfo.driver_memory = res.data.driver_memory
              this.congifInfo.queue = res.data.queue
              this.congifInfo.tez_queue_name = res.data.tez_queue_name
              this.congifInfo.mapreduce_job_queuename = res.data.mapreduce_job_queuename
              this.isShowForm = false
            }
            this.globalLoading().close()
          } else if (this.dialogTitle.indexOf('编辑') > -1) {
            this.isShowForm = false
            this.congifInfo.connction_url = this.metaInfos.connction_url
            this.congifInfo.connction_user_name = this.metaInfos.connction_user_name
            this.congifInfo.connction_user_passwd = this.decrypt(this.metaInfos.connction_user_passwd)
            this.congifInfo.thrift_port = this.metaInfos.thrift_port
            this.congifInfo.hive_database_type = this.metaInfos.hive_database_type
            this.congifInfo.metastore_host = this.metaInfos.metastore_host
            this.congifInfo.metastore_user_name = this.metaInfos.metastore_user_name
            this.congifInfo.metastore_user_passwd = this.decrypt(this.metaInfos.metastore_user_passwd)
            this.congifInfo.fs_defaultFS = this.metaInfos.fs_defaultFS
            this.congifInfo.namenode = this.metaInfos.namenode
            this.congifInfo.spark_yarn_queue = this.metaInfos.spark_yarn_queue
            this.congifInfo.executor_cores = this.metaInfos.executor_cores
            this.congifInfo.num_executors = this.metaInfos.num_executors
            this.congifInfo.executor_memory = this.metaInfos.executor_memory
            this.congifInfo.driver_memory = this.metaInfos.driver_memory
            this.congifInfo.queue = this.metaInfos.queue
            this.congifInfo.tez_queue_name = this.metaInfos.tez_queue_name
            this.congifInfo.mapreduce_job_queuename = this.metaInfos.mapreduce_job_queuename
          }
        }
      })
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
    // 新增&编辑时选择项目
    handleProjectChange(val) {
      this.dialogForm.project_name = this.projectList.filter(
        item => item.id === val
      )[0].project_name
    },
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
        // console.log('tableList', this.tableList)
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
    // 新增计算引擎源-打开弹框
    handleAddComputeEngine() {
      this.dialogTitle = '新建计算机引擎源'
      this.sparkParameterList = []
      this.HDFSParameterList = []
      this.tzeParameterList = []
      this.mapReduceParameterList = []
      this.dialogVisible = true
      this.dialogForm = this.dialogFormReset()
      this.congifInfo = this.congifInfoReset()
    },
    // 编辑计算引擎-打开弹框
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
        this.metaInfos = res.data.metaInfos
        this.sparkParameterList = res.data.sparkParameterList
        this.HDFSParameterList = res.data.HDFSParameterList
        this.tzeParameterList = res.data.tzeParameterList
        this.mapReduceParameterList = res.data.mapReduceParameterList
        this.dialogForm.id = res.data.id
      }
      this.loading--
    },

    // 修改计算引擎源
    // async editComputeEngine() {
    //   const res = await this.$simpleAsyncTo(
    //     editComputeEngine(this.dialogForm),
    //     '编辑计算引擎源失败'
    //   )
    //   if (res) {
    //     this.$message({
    //       type: 'success',
    //       message: '编辑计算引擎源成功!'
    //     })
    //   }
    // },
    async handleComputeEngine() {
      if (this.dialogForm.id) {
        this.globalLoading()
        const params = {
          ...this.dialogForm,
          metaInfos: {...this.congifInfo},
          sparkParameterList: JSON.stringify(this.sparkParameterList),
          HDFSParameterList: JSON.stringify(this.HDFSParameterList),
          tzeParameterList: JSON.stringify(this.tzeParameterList),
          mapReduceParameterList: JSON.stringify(this.mapReduceParameterList),
          storageParameList: JSON.stringify(this.storageParameList)
        }
        params.access_key = this.encrypt(params.access_key)
        params.metaInfos.connction_user_passwd = this.encrypt(params.metaInfos.connction_user_passwd)
        params.metaInfos.metastore_user_passwd = this.encrypt(params.metaInfos.metastore_user_passwd)
        let fd = new FormData()
        if (this.congifInfo.Kerberosenable === '1') {
          if (this.congifInfo.krb5type === '0' && this.congifInfo.keytabtype === '0') {
            let krb5pathObj = this.krb5pathList[0].raw
            let keytabpathObj = this.keytabpathList[0].raw
            for (let key in params) {
              fd.append(key, params[key])
            }
            fd.append('krb5path', krb5pathObj)
            fd.append('keytabpath', keytabpathObj)
            param = fd
          } else if (this.congifInfo.krb5type === '0' && this.congifInfo.keytabtype === '1') {
            let krb5pathObj = this.krb5pathList[0].raw
            for (let key in params) {
              fd.append(key, params[key])
            }
            fd.append('krb5path', krb5pathObj)
            param = fd
          } else if (this.congifInfo.krb5type === '1' && this.congifInfo.keytabtype === '0') {
            let keytabpathObj = this.keytabpathList[0].raw
            for (let key in params) {
              fd.append(key, params[key])
            }
            fd.append('keytabpath', keytabpathObj)
            param = fd
          } else {
            for (let key in params) {
              fd.append(key, params[key])
            }
          }
        } else {
          for (let key in params) {
            fd.append(key, params[key])
          }
        }
        const configpath = this.configpathList[0].raw
        fd.append('configpath', configpath)
        param = fd
        const res = await this.$simpleAsyncTo(
          editComputeEngine(param, 'upload'),
          '编辑计算引擎源失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '编辑计算引擎源成功!'
          })
        }
      } else {
        if (this.configpathList.length === 0) {
          return this.$message({
            type: 'warning',
            message: '请选择配置文件上传'
          })
        }
        if (this.congifInfo.Kerberosenable === '1' && this.congifInfo.krb5type === '0' && this.krb5pathList.length === 0) {
          return this.$message({
            type: 'warning',
            message: '请选择krb5文件上传'
          })
        }
        if (this.congifInfo.Kerberosenable === '1' && this.congifInfo.keytabtype === '0' && this.keytabpathList.length === 0) {
          return this.$message({
            type: 'warning',
            message: '请选择keytab文件上传'
          })
        }
        // 新增计算引擎源
        let param = null
        const params = {
          ...this.dialogForm,
          metaInfos: {...this.congifInfo},
          sparkParameterList: JSON.stringify(this.sparkParameterList),
          HDFSParameterList: JSON.stringify(this.HDFSParameterList),
          tzeParameterList: JSON.stringify(this.tzeParameterList),
          mapReduceParameterList: JSON.stringify(this.mapReduceParameterList),
          storageParameList: JSON.stringify(this.storageParameList)
        }
        params.access_key = this.encrypt(params.access_key)
        params.metaInfos.connction_user_passwd = this.encrypt(params.metaInfos.connction_user_passwd)
        params.metaInfos.metastore_user_passwd = this.encrypt(params.metaInfos.metastore_user_passwd)
        params.metaInfos = JSON.stringify(params.metaInfos)
        let fd = new FormData()
        this.globalLoading('新建引擎处理中，请稍等...')
        if (this.congifInfo.Kerberosenable === '1') {
          if (this.congifInfo.krb5type === '0' && this.congifInfo.keytabtype === '0') {
            let krb5pathObj = this.krb5pathList[0].raw
            let keytabpathObj = this.keytabpathList[0].raw
            for (let key in params) {
              fd.append(key, params[key])
            }
            fd.append('krb5path', krb5pathObj)
            fd.append('keytabpath', keytabpathObj)
            param = fd
          } else if (this.congifInfo.krb5type === '0' && this.congifInfo.keytabtype === '1') {
            let krb5pathObj = this.krb5pathList[0].raw
            for (let key in params) {
              fd.append(key, params[key])
            }
            fd.append('krb5path', krb5pathObj)
            param = fd
          } else if (this.congifInfo.krb5type === '1' && this.congifInfo.keytabtype === '0') {
            let keytabpathObj = this.keytabpathList[0].raw
            for (let key in params) {
              fd.append(key, params[key])
            }
            fd.append('keytabpath', keytabpathObj)
            param = fd
          } else {
            for (let key in params) {
              fd.append(key, params[key])
            }
          }
        } else {
          for (let key in params) {
            fd.append(key, params[key])
          }
        }
        const configpath = this.configpathList[0].raw
        fd.append('configpath', configpath)
        param = fd
        const res = await this.$simpleAsyncTo(
          addComputeEngine(param, 'upload'),
          '新增计算引擎源失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '新建计算引擎源成功!'
          })
        }
      }
      // this.dialogVisible = false
      // this.isShowForm = true
      // this.$refs.dialogForm.resetFields()
      // this.$refs.congifInfo.resetFields()
      // this.dialogForm = this.dialogFormReset()
      // this.congifInfo = this.congifInfoReset()
      this.handleCancel()
      this.getTableList()
      this.globalLoading().close()
    },
    handleConfirm() {
      this.$refs.congifInfo.validate(valid => {
        if (valid) {
          this.handleComputeEngine()
        }
      })
    },
    handleCancel() {
      this.dialogVisible = false
      this.isShowForm = true
      this.$refs.dialogForm.resetFields()
      this.$refs.congifInfo.resetFields()
      this.dialogForm = this.dialogFormReset()
      this.congifInfo = this.congifInfoReset()
      this.configpathList = []
      this.krb5pathList = []
      this.keytabpathList = []
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
    // 选中表格项
    handleSelectionChange(rows) {
      this.selectedIds = []
      rows.forEach(item => {
        this.selectedIds.push(item.id)
      })
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
    // batchDelComputeEngine() {
    //   this.$message({
    //     type: 'success',
    //     message: '批量删除成功!'
    //   })
    // }
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
    upStep() {
      this.isShowForm = true
    },
    addAparkParameter() {
      this.sparkParameterList.push({
        code: '',
        value: ''
      })
    },
    addHDFSParams() {
      this.HDFSParameterList.push({
        code: '',
        value: ''
      })
    },
    addTzeParams() {
      this.tzeParameterList.push({
        code: '',
        value: ''
      })
    },
    addMapReduceParams() {
      this.mapReduceParameterList.push({
        code: '',
        value: ''
      })
    },
    addStorageParams() {
      this.storageParameList.push({
        code: '',
        value: ''
      })
    },
    delRow(index) {
      this.sparkParameterList.splice(index, 1)
    },
    delHDFS(index) {
      this.HDFSParameterList.splice(index, 1)
    },
    delTze(index) {
      this.tzeParameterList.splice(index, 1)
    },
    delMapReduce(index) {
      this.mapReduceParameterList.splice(index, 1)
    },
    delStorageParams(index) {
      this.storageParameList.splice(index, 1)
    },
    configUpSuccess() {},
    configUploadChange(file, fileList) {
      this.configpathList = fileList
    },
    krb5pathUpSuccess() {},
    krb5pathUploadChange(file, filelist) {
      this.krb5pathList = filelist
    },
    krb5typeClick() {
      this.congifInfo.krb5path = ''
      this.krb5pathList = []
      if (this.congifInfo.krb5type === '0') {
        this.congifInfo.krb5type = '1'
      } else {
        this.congifInfo.krb5type = '0'
      }
    },
    changeKerberosenable(val) {
      this.krb5pathList = []
      this.congifInfo.krb5path = ''
      this.congifInfo.keytabpath = ''
      this.keytabpathList = []
      this.congifInfo.loginkeytab = ''
      this.congifInfo.principal = ''
    },
    keytabpathUpSuccess() {},
    keytabpathUploadChange(file, filelist) {
      this.keytabpathList = filelist
    },
    keytabpathClick() {
      this.congifInfo.keytabpath = ''
      this.keytabpathList = []
      if (this.congifInfo.keytabtype === '0') {
        this.congifInfo.keytabtype = '1'
      } else {
        this.congifInfo.keytabtype = '0'
      }
    }
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
