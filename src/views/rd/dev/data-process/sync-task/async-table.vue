<template>
  <div class="async-table">
    <Head title="同步表" :btnVisible="false" :refeshBtnVisible="false"></Head>
    <div class="content-box">
      <div class="sync-source">
        <el-card class="async-box-card">
          <div slot="header" class="clearfix">
            <span>同步来源</span>
          </div>
          <el-form :model="syncSource" :rules="syncSourceRules" ref="syncRuleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="数据源" prop="src_ds_type">
              <el-select v-model="syncSource.src_ds_type" placeholder="请选择数据源" style="width:100%" @change="changeSourceType">
                <el-option :label="item.data_source_name" :value="item.data_source_type" v-for="item in sourceOptions" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模式" prop="src_tab_mode" v-if="syncSource.src_ds_type === 'MySQL' || syncSource.src_ds_type === 'Oracle'">
              <el-radio-group v-model="syncSource.src_tab_mode">
                <el-radio label="0">单表</el-radio>
                <el-tooltip class="item" effect="dark" content="该功能未开放" placement="top">
                  <el-radio label="1" disabled>多表</el-radio>
                </el-tooltip>
                <!-- <el-radio label="2">多表</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="表" prop="src_tab_code" v-if="syncSource.src_tab_mode === '0'">
              <el-select v-model="syncSource.src_tab_code" placeholder="请选择" style="width:100%" filterable @change="changeSourceTable">
                <el-option :label="item.table_name" :value="item.table_name" v-for="item in sourceTableOptions" :key="item.table_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表" prop="table1" v-if="syncSource.src_tab_mode === '1'">
              <el-input type="text" v-model="syncSource.table1" style="width:calc(100% - 30px)"></el-input>
              <el-tooltip class="item" effect="dark" content="确认匹配详情" placement="top">
                <i class="el-icon-tickets ml-5" style="cursor: pointer;" @click="clickDetailsHandle"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="分区字段" prop="src_tab_part" v-if="syncSource.src_ds_type === 'Hive'">
              <el-input v-if="syncTarget.load_policy !== '2'" type="textarea" v-model="syncSource.src_tab_part" :rows="3" resize="none" placeholder="请输入分区字段，支持参数配置，如ds=${bizdate}"></el-input>
              <span v-else style="display:flex">
                day=<el-input v-model="load_policy_day"></el-input>,hour=<el-input v-model="load_policy_hour"></el-input>
              </span>
            </el-form-item>
            <el-form-item label="筛选条件" prop="src_tab_cond">
              <el-input type="textarea" v-model="syncSource.src_tab_cond" :rows="3" resize="none" placeholder="请输入筛选条件，如source_type=‘idc’ and id like ‘400001%’"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="sync-target">
        <el-card class="async-box-card">
          <div slot="header" class="clearfix">
            <span>同步目标</span>
          </div>
          <el-form :model="syncTarget" :rules="syncTargetRules" ref="syncRuleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="数据源" prop="dest_ds_type">
              <el-select v-model="syncTarget.dest_ds_type" placeholder="请选择数据源" style="width:100%" @change="changeTargetType">
                <el-option :label="item.data_source_name" :value="item.data_source_type" v-for="item in sourceOptions" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加载策略" prop="load_policy">
              <el-select
              v-model="syncTarget.load_policy"
              placeholder="请选择加载策略"
              style="width:100%"
              v-if="syncSource.src_ds_type === 'Hive' && syncTarget.dest_ds_type === 'Hive'">
                <el-option :label="item.label" :value="item.value" v-for="item in loadingPolicyOptions1" :key="item.label">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    <el-tooltip class="item" effect="dark" :content="item.info" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </span>
                </el-option>
              </el-select>
              <el-select v-model="syncTarget.load_policy" placeholder="请选择加载策略" style="width:100%" v-else>
                <el-option :label="item.label" :value="item.value" v-for="item in loadingPolicyOptions" :key="item.label">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    <el-tooltip class="item" effect="dark" :content="item.info" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建表方式" prop="dest_tab_mode">
              <el-radio-group v-model="syncTarget.dest_tab_mode" @change="changeSyncTarget">
                <el-radio label="0">选择目标表</el-radio>
                <el-radio label="1">自动创建目标表</el-radio>
                <el-radio label="2" v-if="syncTarget.load_policy !== '2'">选择视图</el-radio>
                <el-radio label="3" v-if="syncTarget.load_policy !== '2'">自动创建视图</el-radio>
              </el-radio-group>
              <el-tooltip class="item" effect="dark" content="数据来源与目录来源类型相同的表，表属性(换行符/分隔符/存储格式/压缩格式)与来源表相同; 数据来源与目录来源类型不相同的表，表属性按缺省格式创建(计算引擎源定义)" placement="top">
                <i class="el-icon-info ml-5"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="表" prop="dest_tab_code" v-if="syncTarget.dest_tab_mode === '0' || syncTarget.dest_tab_mode === '2'">
              <el-select v-model="syncTarget.dest_tab_code" placeholder="请选择" style="width:100%" filterable @change="changeTargetTable">
                <el-option :label="item.table_name" :value="item.table_name" v-for="item in syncTargetTableOptions" :key="item.table_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表" prop="dest_tab_code" v-if="syncTarget.dest_tab_mode === '1' || syncTarget.dest_tab_mode === '3'">
              <el-input v-model="syncTarget.dest_tab_code" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="分区" prop="dest_tab_part" v-if="syncSource.src_ds_type === 'Hive'">
              <el-input type="text" v-model="syncTarget.dest_tab_part" style="width:calc(100% - 50px)"></el-input>
              <el-tooltip class="item" effect="dark" content="选择目标表方式，则输入分区常量及变量; 选择自动创建表方式，则按照分区名创建与同步" placement="top">
                <i class="el-icon-info ml-5"></i>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <Head title="字段同步" :btnVisible="false" :refeshBtnVisible="false"></Head>
    <div class="sync-field">
      <div class="top-info">
        <div class="top-info-left mr-10">
          <div>
            <!-- <p class="font-14">来源字段 （6 / 6）</p> -->
            <p class="font-12 mt-5"><span style="color: #ca435b;">*</span> 来源表：<span>{{syncSource.src_tab_code}}</span></p>
          </div>
          <div class="my-btn mr-50">
            <!-- <el-button type="default" icon="el-icon-plus" @click="fieldDialog=true">新建字段</el-button> -->
          </div>
        </div>
        <div class="top-info-right">
          <div>
            <!-- <p class="font-14">目标字段 （6 / 6）</p> -->
            <p class="font-12 mt-5"><span style="color: #ca435b;">*</span> 目标表：<span>{{syncTarget.dest_tab_code}}</span></p>
          </div>
          <div class="my-btn">
            <el-button type="default" icon="el-icon-plus" v-if="syncTarget.load_policy !== '2'" @click="fieldDialog=true">新建字段</el-button>
          </div>
        </div>
      </div>
      <div class="bottom-table">
        <div>
          <!-- <el-table
            :data="sourceFieldTableData"
            :row-key="getRowKey"
            :cell-style="{
              height: '32px'
            }"
            :row-style="{
              cursor: 'pointer'
            }">
            <el-table-column v-for="(item, index) in col"
              :key="`col_${index}`"
              :prop="col[index].prop"
              :label="item.label">
                <template slot-scope="scope">
                  <span v-if="item.prop === 'column_name'">{{scope.row.column_name}}</span>
                  <span v-if="item.prop === 'column_type'">{{scope.row.column_type}}</span>
                  <el-button v-if="item.prop === 'isClick'" type="text" size="small" icon="el-icon-delete" @click="delSourceField(scope.$index, sourceFieldTableData)"></el-button>
                </template>
            </el-table-column>
          </el-table> -->
          <el-table
            :data="sourceFieldTableData" :cell-style="{
            height: '32px'
          }">
            <el-table-column
              prop="column_name"
              label="英文名"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="column_type"
              label="数据类型"
              :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
        </div>
        <div style="padding-top:23px">
          <div class="icon1" v-for="(item, index) in lineArr" :key="index" style="margin-top:8px;height:32px">
            <span v-if="syncTarget.load_policy === '2' &&
              item.source &&
              item.target &&
              item.source.column_name === item.target.column_name &&
              item.source.column_type === item.target.column_type">
              <!-- <el-popover
                ref="popover"
                placement="right"
                title="标题"
                width="200"
                trigger="hover"
                content="">
                <span slot="reference"><i class="icon iconfont icon-guanlian3 font-12"></i></span>
              </el-popover> -->
              <span><i class="icon iconfont icon-guanlian3 font-12"></i></span>
            </span>
            <span v-if="syncTarget.load_policy !== '2' && item.source !== null && item.target !== null">
              <span><i class="icon iconfont icon-guanlian3 font-12"></i></span>
            </span>
          </div>
        </div>
          <div>
            <!-- <el-table
              :data="targetFieldTableData" :cell-style="{
              height: '32px'
            }"
            v-if="syncTarget.load_policy === '2'"
            >
              <el-table-column
                prop="column_name"
                label="英文名">
              </el-table-column>
              <el-table-column
                prop="column_type"
                label="数据类型">
              </el-table-column>
            </el-table> -->
            <el-table
            ref="doLayout"
            :class="[syncTarget.load_policy !== '2' ? 'my-target-table' : '']"
            :data="targetFieldTableData"
            :row-key="getRowKey"
            :cell-style="{
              height: '32px'
            }"
            :row-style="{
              cursor: 'pointer'
            }">
            <template v-for="(item, index) in syncTarget.load_policy !== '2' ? col : col1">
              <el-table-column
                :key="`col_${index}`"
                :prop="col[index].prop"
                :label="item.label"
                :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-if="item.prop === 'column_name'">{{scope.row.column_name}}</span>
                    <span v-if="item.prop === 'column_type'">{{scope.row.column_type}}</span>
                    <el-button v-if="item.prop === 'isClick'" type="text" size="small" icon="el-icon-delete" @click="delSourceField(scope.$index, targetFieldTableData)"></el-button>
                  </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>
    <Head title="参数控制" :btnVisible="false" :refeshBtnVisible="false"></Head>
    <el-form label-width="100px" class="demo-ruleForm" :inline="true" :model="paramsControl">
      <el-form-item label="executor_memory">
        <el-input type="text" v-model="paramsControl.executor_memory"></el-input>
      </el-form-item>
      <el-form-item label="executor_cores">
        <el-input type="text" v-model="paramsControl.executor_cores"></el-input>
      </el-form-item>
      <el-form-item label="num_executors">
        <el-input type="text" v-model="paramsControl.num_executors"></el-input>
      </el-form-item>
      <el-form-item label="driver_memory">
        <el-input type="text" v-model="paramsControl.driver_memory"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog title="确认匹配详情" :visible.sync="dialogTableVisible">
      <el-form label-width="100px" class="demo-ruleForm" label-suffix="：">
        <el-form-item label="表达式" style="margin-bottom:5px">
          ds=${bizdate}
        </el-form-item>
        <el-form-item label="匹配数">
          4
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        :show-header="false">
        <el-table-column
          prop="name">
        </el-table-column>
      </el-table>
      <p class="mt-10 mb-10">列表中存在数据表在元数据中无法匹配到，请重新配置</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确认匹配详情" :visible.sync="fieldDialog" @close="closeFieldDialog" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table
        :data="targetFieldTableDataClone"
        style="width: 100%"
        :show-header="true"
        @selection-change="handleSelectionChange">
         <el-table-column
          type="selection"
          width="55"
          :selectable="selectableCheckBox"
          >
        </el-table-column>
        <el-table-column
          prop="column_name"
          label="字段名">
        </el-table-column>
        <el-table-column
          prop="column_type"
          label="字段类型">
        </el-table-column>
      </el-table>
      <p class="mt-10 mb-10">列表中存在数据表中字段无法选择</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFieldDialog">取 消</el-button>
        <el-button type="primary" @click="addSourceField">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Head from '@c/head'
import Sortable from 'sortablejs'
import {
  getMetaDataSource,
  getDataSourceTable,
  getTableColumnInfo,
  queryMetaSyncInfo
} from '@/api/rd/sync-task.js'
export default {
  name: 'AsyncTable',
  components: {
    Head
  },
  props: {
    data: Object
  },
  data() {
    return {
      index: 0,
      fieldDialog: false,
      multipleSelection: [],
      col: [
        {
          label: '英文名',
          prop: 'column_name'
        },
        {
          label: '数据类型',
          prop: 'column_type'
        },
        {
          label: '操作',
          prop: 'isClick'
        }
      ],
      col1: [
        {
          label: '英文名',
          prop: 'column_name'
        },
        {
          label: '数据类型',
          prop: 'column_type'
        }
      ],
      syncSource: {
        src_ds_type: '',
        src_tab_mode: '0',
        src_tab_code: '',
        table1: '',
        src_tab_cond: '',
        src_tab_part: ''
      },
      syncSourceRules: {
        src_ds_type: [
          { required: true, trigger: 'blur' }
        ],
        src_tab_mode: [
          { required: true }
        ],
        src_tab_code: [
          { required: true }
        ]
      },
      syncTarget: {
        dest_ds_type: '',
        load_policy: '0',
        dest_tab_mode: '0',
        dest_tab_code: '',
        dest_tab_part: ''
      },
      syncTargetRules: {
        dest_ds_type: [
          { required: true, trigger: 'blur' }
        ],
        load_policy: [
          { required: true, trigger: 'blur' }
        ],
        dest_tab_mode: [
          { required: true }
        ],
        dest_tab_code: [
          { required: true }
        ]
      },
      sourceOptions: [],
      sourceTableOptions: [],
      syncTargetTableOptions: [],
      dialogTableVisible: false,
      tableData: [
        {name: '123'},
        {name: '123'},
        {name: '123'},
        {name: '123'},
        {name: '123'}
      ],
      loadingPolicyOptions: [
        {label: '覆盖', value: '0', info: '同步前清理已有数据'},
        {label: '追加', value: '1', info: '同步前保留已有数据'}
      ],
      loadingPolicyOptions1: [
        {label: '覆盖', value: '0', info: '同步前清理已有数据'},
        {label: '追加', value: '1', info: '同步前保留已有数据'},
        {label: '映射', value: '2', info: '只映射来源数据，不加载复制数据，且目标表为外部表'}
      ],
      sourceFieldTableData: [],
      targetFieldTableDataClone: [],
      targetFieldTableData: [],
      paramsControl: {
        executor_memory: '',
        executor_cores: '',
        num_executors: '',
        driver_memory: ''
      },
      lineArr: [],
      editConfigData: {},
      load_policy_day: '',
      load_policy_hour: '',
      tableSyncData: {},
      colSyncData: []
    }
  },
  watch: {
    sourceFieldTableData: {
      handler(val) {
        this.lineArr = []
        if (val && val.length && this.targetFieldTableData.length) {
          if (val.length > this.targetFieldTableData.length) {
            val.forEach((item, index) => {
              this.lineArr[index] = {
                source: item,
                target: this.targetFieldTableData[index] || null
              }
            })
            console.log(this.lineArr)
          } else {
            this.targetFieldTableData.forEach((item, index) => {
              this.lineArr[index] = {
                source: val[index] || null,
                target: item
              }
            })
          }
        }
      },
      deep: true,
      immediate: true
    },
    targetFieldTableData: {
      handler(val) {
        this.lineArr = []
        if (val && val.length && this.sourceFieldTableData.length) {
          if (val.length > this.sourceFieldTableData.length) {
            val.forEach((item, index) => {
              this.lineArr[index] = {
                source: this.sourceFieldTableData[index] || null,
                target: item
              }
            })
          } else {
            this.sourceFieldTableData.forEach((item, index) => {
              this.lineArr[index] = {
                source: item,
                target: val[index] || null
              }
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    this._getMetaDataSource()
    if (this.data.id) {
      await this._queryMetaSyncInfo()
    }
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    getRowKey(row) {
      return JSON.stringify(row)
    },
    rowDrop() {
      const tbody = document.querySelector('.my-target-table.el-table .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        // disabled: this.syncTarget.load_policy !== '2',
        onEnd({oldIndex, newIndex}) {
          const arr = JSON.parse(JSON.stringify(_this.targetFieldTableData))
          _this.targetFieldTableData.splice(oldIndex, 1, arr[newIndex])
          _this.targetFieldTableData.splice(newIndex, 1, arr[oldIndex])
        }
      })
    },
    handleChange(val) {},
    clickDetailsHandle() {
      if (this.syncSource.table1 === '') return this.$message({type: 'error', message: '请填写表达式'})
      this.dialogTableVisible = true
    },
    async _getMetaDataSource() {
      const res = await this.$simpleAsyncTo(getMetaDataSource(), '获取数据源失败')
      if (res) {
        this.sourceOptions = res.data
      }
    },
    async _getDataSourceTable(id, data_source_type, type) {
      const res = await this.$simpleAsyncTo(getDataSourceTable({id, data_source_type}), '获取数据源所有表失败')
      if (res) {
        this[type] = res.data
      }
    },
    changeSourceType(v) {
      this.syncSource.src_tab_code = ''
      this.sourceFieldTableData = []
      const idObj = this.sourceOptions.find(item => item.data_source_type === v)
      this._getDataSourceTable(idObj.id, v, 'sourceTableOptions')
    },
    changeTargetType(v) {
      this.syncTarget.dest_tab_code = ''
      this.targetFieldTableData = []
      const idObj = this.sourceOptions.find(item => item.data_source_type === v)
      this._getDataSourceTable(idObj.id, v, 'syncTargetTableOptions')
    },
    async _getTableColumnInfo(id, data_source_type, table, type) {
      const res = await this.$simpleAsyncTo(getTableColumnInfo({id, data_source_type, table}), '获取字段失败')
      if (res) {
        this[type] = res.data.column_data
      }
    },
    changeSourceTable(v) {
      const idObj = this.sourceOptions.find(item => item.data_source_type === this.syncSource.src_ds_type)
      this._getTableColumnInfo(idObj.id, this.syncSource.src_ds_type, v, 'sourceFieldTableData')
    },
    changeTargetTable(v) {
      const idObj = this.sourceOptions.find(item => item.data_source_type === this.syncTarget.dest_ds_type)
      this._getTableColumnInfo(idObj.id, this.syncTarget.dest_ds_type, v, 'targetFieldTableData')
      this._getTableColumnInfo(idObj.id, this.syncSource.src_ds_type, v, 'targetFieldTableDataClone')
    },
    getData() {
      if (this.syncTarget.load_policy === '2') {
        const leftAndRight = this.lineArr.every(item => item.source &&
              item.target &&
              item.source.column_name === item.target.column_name &&
              item.source.column_type === item.target.column_type)
        if (!leftAndRight) {
          return leftAndRight
        }
      }
      if (this.sourceFieldTableData.length < this.targetFieldTableData.length) {
        return 'flag'
      }
      let col_sync_info = this.sourceFieldTableData.map((item, index) => {
        return {
          src_col_type: item.column_type,
          src_col_code: item.column_name,
          src_col_desc: item.column_comment,
          dest_col_type: this.targetFieldTableData[index] ? this.targetFieldTableData[index].column_type : '',
          dest_col_code: this.targetFieldTableData[index] ? this.targetFieldTableData[index].column_name : '',
          dest_col_desc: this.targetFieldTableData[index] ? this.targetFieldTableData[index].column_comment : '',
          col_order: index
        }
      })
      if (this.syncTarget.load_policy === '2') {
        this.syncSource.src_tab_part = `day=${this.load_policy_day},hour=${this.load_policy_hour}`
      }
      return {
        ...this.syncSource,
        ...this.syncTarget,
        col_sync_info,
        ...this.paramsControl
      }
    },
    changeSyncTarget(v) {
      this.syncTarget.dest_tab_code = ''
    },
    delSourceField(index, rows) {
      rows.splice(index, 1)
    },
    selectableCheckBox(row, index) {
      const i = this.targetFieldTableData.findIndex(item => item.column_name === row.column_name && item.column_type === row.column_type)
      return i === -1
    },
    closeFieldDialog() {
      this.fieldDialog = false
    },
    addSourceField() {
      this.targetFieldTableData = [...this.targetFieldTableData, ...this.multipleSelection]
      this.closeFieldDialog()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async _queryMetaSyncInfo() {
      const res = await this.$simpleAsyncTo(queryMetaSyncInfo({id: this.data.id}), '获取数据失败')
      if (res) {
        this.tableSyncData = res.data.tableSyncData
        this.colSyncData = res.data.colSyncData
        await this.changeSourceType(res.data.tableSyncData.src_ds_type)
        await this.changeTargetType(res.data.tableSyncData.dest_ds_type)
        const sourceData = [], targetData = []
        res.data.colSyncData.forEach(item => {
          sourceData.push({
            column_name: item.src_col_code,
            column_type: item.src_col_type,
            column_comment: item.src_col_desc
          })
          targetData.push({
            column_name: item.dest_col_code,
            column_type: item.dest_col_type,
            column_comment: item.dest_col_desc
          })
        })
        this.sourceFieldTableData = [...sourceData]
        this.targetFieldTableData = [...targetData]
        this.syncSource.src_ds_type = res.data.tableSyncData.src_ds_type
        this.syncSource.src_tab_code = res.data.tableSyncData.src_tab_code
        this.syncSource.src_tab_part = res.data.tableSyncData.src_tab_part
        this.syncSource.src_tab_cond = res.data.tableSyncData.src_tab_cond
        //
        this.syncTarget.dest_ds_type = res.data.tableSyncData.dest_ds_type
        this.syncTarget.load_policy = res.data.tableSyncData.load_policy
        this.syncTarget.dest_tab_mode = res.data.tableSyncData.dest_tab_mode
        this.syncTarget.dest_tab_code = res.data.tableSyncData.dest_tab_code
        this.syncTarget.dest_tab_part = res.data.tableSyncData.dest_tab_part
        //
        this.paramsControl.executor_memory = res.data.tableSyncData.executor_memory
        this.paramsControl.executor_cores = res.data.tableSyncData.executor_cores
        this.paramsControl.num_executors = res.data.tableSyncData.num_executors
        this.paramsControl.driver_memory = res.data.tableSyncData.driver_memory
      }
    }
  }
}
</script>

<style lang="scss">
.async-table {
  padding: 0 20px;
  .head {
    border-bottom: none;
  }
  .content-box {
    display: flex;
    >div {
      flex: 1;
      &:first-child {
        margin-right: 10px;
      }
    }
    .async-box-card {
      background-color: #F8F8FA;
      box-shadow: none;
      border-radius: 0;
      border: none;
      .el-card__header {
        padding: 10px;
        font-size: 14px;
        border-bottom: none;
      }
      .el-card__body {
        padding: 10px;
      }
    }
  }
  .sync-field {
    background-color: #F3F3F5;
    padding: 15px;
    .top-info {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      >div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .bottom-table {
      display: flex;
      // align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      background-color: #F8F8FA;
      >div:first-child,>div:last-child {
        width: 45%;
      }
      >div:nth-child(2) {
        flex-basis: 100px;
        width: 100px;
        .icon1 {
          text-align: center;
          >span {
            display: inline-block;
            width: 90px;
            border: 1px solid #aaa;
            position: relative;
            >span {
              width: 20px;
              height: 20px;
              display: inline-block;
              border-radius: 50%;
              border: 1px solid #aaa;
              position: absolute;
              top: -10px;
              left: 50%;
              transform: translateX(-10px);
              background: #fff;
              line-height: 20px;
              cursor: pointer;
              i {
                color: #aaa;
                vertical-align: super;
              }
            }
          }
        }
      }
      .has-gutter {
        background-color: #f8f8fa!important;
        th {
          padding: 0!important;
        }
      }
      .el-table {
        background-color: transparent;
      }
      .el-table tr {
        background-color: transparent;
      }
      .el-table th {
        background-color: transparent;
      }
      .el-table th.is-leaf, .el-table td {
        border-bottom: none;
      }
      .el-table tbody tr:hover td{
        background-color: transparent!important;
      }
      .el-table tbody tr {
        background-color: #ffffff;
        >td {
          padding: 0;
        }
      }
      .el-table__body {
        border-collapse: separate;
        border-spacing: 0 8px;
      }
    }
  }
}
</style>
