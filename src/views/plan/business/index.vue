<template>
  <div class="business height-100per flex-column">
    <div class="page-title">
      业务板块
      <el-button class="fr"
                 type="primary"
                 @click="handleAddBusiness">新建业务板块</el-button>
    </div>
    <el-row :gutter="15"
            class="business-content">
      <el-col :md="6"
              :sm="8"
              :xs="10">
        <div class="left-box no-data"
             v-if="businessList.length==0">暂无业务板块</div>
        <div class="left-box"
             v-else>
          <div v-for="(item,index) in businessList"
               :class="['card-box',{'active':activeBusinessId==item.busin_id}]"
               :key="index"
               @click="handleChangeBusiness(item)">
            <div class="fr">
              <el-button class="mr-10"
                         type="text"
                         icon="font-16 el-icon-edit-outline"
                         title="编辑"
                         @click.stop="handleEditBusiness(item)"></el-button>
              <SimpleConfirm @confirm="handleDeleteBusiness(item)" />
            </div>
            <div class="top-content">
              <div :class="['icon','iconfont',item.icon_code]"
                   :style="{'background-color':iconList[item.icon_code]}"></div>
              <div class="title-box">
                <el-tooltip placement="bottom"
                            :content="item.busin_name">
                  <div class="text-info text-ellipsis">{{item.busin_name}}</div>
                </el-tooltip>
                <el-tooltip placement="bottom"
                            :content="item.busin_code">
                  <div class="code-info text-ellipsis">{{item.busin_code}}</div>
                </el-tooltip>
              </div>
            </div>
            <div class="bottom-content">
              <div>
                <span>创建时间：</span>
                {{item.create_time}}
              </div>
              <el-tooltip placement="bottom"
                          :content="item.comments">
                <div class="text-ellipsis">
                  <span>描述：</span>
                  {{item.comments}}
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="18"
              :sm="16"
              :xs="14"
              class="right-content-box">
        <div class="right-box">
          <el-row :gutter="15">
            <el-col :md="12"
                    :sm="14"
                    :xs="16">
              <div class="right-top-left">
                <div class="subtitle">
                  板块参数&nbsp;
                  <i class="el-icon-warning-outline"
                     title="业务板块内统一的参数信息"></i>
                </div>
                <div>
                  <div class="third-title">
                    <div class="fr">
                      <el-button type="text"
                                 icon="font-16 el-icon-edit-outline"
                                 title="编辑时间分区"
                                 @click="handleEditPartition"></el-button>
                    </div>
                    <span>
                      时间分区&nbsp;
                      <i class="el-icon-warning-outline"
                         title="事件分区，设置逻辑表时间分区字段的默认名称、数据类型等信息"></i>
                    </span>
                  </div>
                  <div class="result-box clearfix">
                    <ul>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.partition_name">
                        <li class="text-ellipsis">
                          <span class="label-text">中文名</span>
                          <span class="info-text">{{businessParams.partition_name}}</span>
                        </li>
                      </el-tooltip>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.partition_code">
                        <li class="text-ellipsis">
                          <span class="label-text">英文名</span>
                          <span class="info-text">{{businessParams.partition_code}}</span>
                        </li>
                      </el-tooltip>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.data_type">
                        <li class="text-ellipsis"
                            ref="dataType">
                          <span class="label-text">数据类型</span>
                          <span class="info-text">{{businessParams.data_type}}</span>
                        </li>
                      </el-tooltip>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.partition_default">
                        <li class="text-ellipsis">
                          <span class="label-text">默认值</span>
                          <span class="info-text">{{businessParams.partition_default}}</span>
                        </li>
                      </el-tooltip>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.partition_desc">
                        <li class="exclusive-line text-ellipsis">
                          <span class="label-text">描述</span>
                          <span class="info-text">{{businessParams.partition_desc}}</span>
                        </li>
                      </el-tooltip>
                    </ul>
                  </div>
                </div>
                <div>
                  <div class="third-title">
                    <div class="fr">
                      <el-button type="text"
                                 icon="font-16 el-icon-edit-outline"
                                 title="编辑业务日期"
                                 @click="handleEditBizdate"></el-button>
                    </div>
                    <span>
                      业务日期&nbsp;
                      <i class="el-icon-warning-outline"
                         title="业务日期，是任务调度时业务日期参数bizdate的默认参数取值"></i>
                    </span>
                  </div>
                  <div class="result-box clearfix">
                    <ul>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.biz_date_key">
                        <li class="text-ellipsis">
                          <span class="label-text">参数</span>
                          <span class="info-text">{{businessParams.biz_date_key}}</span>
                        </li>
                      </el-tooltip>
                      <el-tooltip placement="bottom"
                                  :content="businessParams.biz_data_value">
                        <li class="text-ellipsis">
                          <span class="label-text">参数值</span>
                          <span class="info-text">{{businessParams.biz_data_value}}</span>
                        </li>
                      </el-tooltip>
                    </ul>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :md="12"
                    :sm="10"
                    :xs="8">
              <div class="flex-1 right-top-right flex-column">
                <div class="subtitle">
                  <!-- <div class="fr more">去项目查看<i class="el-icon-d-arrow-right"></i></div> -->
                  相关项目
                </div>
                <div class="flex-1 flex-column project-box">
                  <div v-if="!busiProject.length">新建项目，以开始标准规范地建设数据体系</div>
                  <div class="project">
                    <OverflowTooltip :class="['project-item', `bc-color-${getrandomInRange()}`]"
                                     v-for="item in busiProject"
                                     :key="item.project_name"
                                     @click.native="projectClickHandle(item)">
                      <span>{{item.project_name}}</span>
                    </OverflowTooltip>
                  </div>
                  <div v-if="!busiProject.length">
                    <el-button type="primary"
                               plain
                               @click="handleAddProject">新建项目</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="right-bottom">
            <div class="pt-20 pb-20">
              <div class="fr flex-layout">
                <el-input v-model="dataName"
                          placeholder="请搜索数据域"
                          prefix-icon="el-icon-search"
                          class="mr-15"
                          clearable></el-input>
                <el-button type="primary"
                           icon="el-icon-plus"
                           @click="handleAddData">新建数据域</el-button>
              </div>
              <div class="subtitle">
                数据域&nbsp;
                <i class="el-icon-warning-outline"
                   title="数据域主要用于存放同一业务板块内不同概念的指标，例如划分出IDC域、DNS域等用于存放不用意义的指标"></i>
              </div>
            </div>
            <div class="table-box">
              <el-table :data="tableList"
                        style="height:100%;overflow-y:auto;"
                        row-key="data_id"
                        default-expand-all
                        lazy
                        :tree-props="{children: 'child'}">
                <el-table-column prop="data_name"
                                 label="数据域名称"
                                 sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="data_code"
                                 label="数据域英文名"
                                 sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="create_time"
                                 label="创建时间"
                                 sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="comments"
                                 label="描述"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作"
                                 width="100">
                  <template slot-scope="scope">
                    <el-button class="mr-10"
                               type="text"
                               icon="font-16 el-icon-edit-outline"
                               title="编辑"
                               @click="handleEditData(scope.row)"></el-button>
                    <SimpleConfirm @confirm="handleDeleteData(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination class="fr pt-10"
                             @current-change="handleCurrentChange"
                             @size-change="handleSizeChange"
                             :page-size="pageFilters.pageSize"
                             :page-sizes="pageSizes"
                             :current-page.sync="pageFilters.pageNo"
                             layout="total, prev, pager, next"
                             :total="total"></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible"
               :title="dialogTitle"
               width="40%"
               :before-close="handleCancel"
               custom-class="form-dialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <div v-if="dialogType=='business'">
        <el-form ref="businessForm"
                 :model="businessForm"
                 :rules="businessFormRules"
                 label-width="120px"
                 label-suffix="："
                 label-position="right">
          <el-form-item label="板块名称"
                        prop="busin_name">
            <el-input v-model="businessForm.busin_name"
                      maxlength="64"
                      show-word-limit
                      placeholder="板块名称至多64个字符，允许中文、数字、字母、下划线或连字符"></el-input>
          </el-form-item>
          <el-form-item label="板块英文名"
                        prop="busin_code">
            <el-input v-model="businessForm.busin_code"
                      :disabled="is_disabled"
                      maxlength="64"
                      show-word-limit
                      placeholder="板块英文名至多64个字符，允许数字、字母、下划线">
              <template slot="prepend">LD_</template>
            </el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="comments">
            <el-input type="textarea"
                      v-model="businessForm.comments"
                      maxlength="128"
                      show-word-limit
                      placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="icon"
                        prop="icon_code">
            <div v-for="(icon,key,index) in iconList"
                 :key="index"
                 :class="['busin-icon-box','fl',{'active':key==businessForm.icon_code}]"
                 @click="handleSelectIcon(icon,key)">
              <div :class="['busin_icon','icon','iconfont',key]"
                   :style="{'background-color':icon}"></div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="dialogType=='partition'">
        <el-form ref="partitionForm"
                 :model="partitionForm"
                 :rules="partitionFormRules"
                 label-width="120px"
                 label-suffix="："
                 label-position="right">
          <el-form-item label="中文名"
                        prop="partition_name">
            <el-input v-model="partitionForm.partition_name"
                      placeholder="请输入中文名"
                      maxlength="64"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="英文名"
                        prop="partition_code">
            <el-input v-model="partitionForm.partition_code"
                      placeholder="请输入英文名"
                      maxlength="64"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="数据类型"
                        prop="data_type">
            <el-input v-model="partitionForm.data_type"
                      placeholder="请输入英文名"></el-input>
          </el-form-item>
          <el-form-item label="默认值"
                        prop="partition_default">
            <el-input v-model="partitionForm.partition_default"
                      placeholder="请输入默认值"></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="partition_desc">
            <el-input type="textarea"
                      v-model="partitionForm.partition_desc"
                      maxlength="128"
                      show-word-limit
                      placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="dialogType=='bizdate'">
        <el-form ref="bizdateForm"
                 :model="bizdateForm"
                 :rules="bizdateFormRules"
                 label-width="120px"
                 label-suffix="："
                 label-position="right">
          <el-form-item label="业务参数日期"
                        prop="biz_date_key">
            <el-select v-model="bizdateForm.biz_date_key"
                       placeholder="请选择业务参数日期"
                       @change="handleBizdatekeyChange">
              <el-option v-for="(item,index) in bizdateValueList"
                         :key="index"
                         :label="item.key"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参数值"
                        prop="biz_data_value">
            <el-input v-model="bizdateForm.biz_data_value"
                      disabled></el-input>
            <div>注：设置后立即生效，调度任务中，如使用业务日期参数的默认取值，则参数值将更新</div>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="dialogType=='dataField'">
        <el-form ref="dataFieldForm"
                 :model="dataFieldForm"
                 :rules="dataFieldFormRules"
                 label-width="120px"
                 label-suffix="："
                 label-position="right">
          <el-form-item label="数据域名称"
                        prop="data_name">
            <el-input v-model="dataFieldForm.data_name"
                      maxlength="64"
                      show-word-limit
                      placeholder="数据域名称至多64个字符，允许中文、数字、字母、下划线或连字符"></el-input>
          </el-form-item>
          <el-form-item label="数据域英文名"
                        prop="data_code">
            <el-input v-model="dataFieldForm.data_code"
                      :disabled="is_disabled"
                      maxlength="64"
                      show-word-limit
                      placeholder="数据域英文名至多64个字符，允许数字、字母、下划线"></el-input>
          </el-form-item>
          <el-form-item label="英文名缩写"
                        prop="nameEnAbb">
            <el-input v-model="dataFieldForm.nameEnAbb"
                      placeholder="英文名缩写至多10个字符，允许数字、字母、下划线"></el-input>
          </el-form-item>
          <el-form-item label="上级主题域"
                        prop="name">
            <el-select v-model="dataFieldForm.name"
                       placeholder="请选择"
                       ref="treeSelect">
              <el-option :label="dataFieldForm.name"
                         :value="dataFieldForm.name"
                         style="max-height:auto;background-color:#fff;padding: 0;font-weight:400">
                <el-tree :data="dataFieldList"
                         :props="{children: 'child',label:'name'}"
                         accordion
                         :highlight-current="true"
                         :expand-on-click-node="false"
                         @node-click="handleNodeClick">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述"
                        prop="comments">
            <el-input type="textarea"
                      v-model="dataFieldForm.comments"
                      maxlength="128"
                      show-word-limit
                      placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary"
                   @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import OverflowTooltip from '@c/overflow-tooltip'
import { businessIconList } from '@/config/dics'
import { randomInRange } from '@/libs/util'
import {
  getBusinessList,
  addBusiness,
  editBusiness,
  delBusiness,
  getBusinessInfo,
  editPartition,
  getBizdateValueList,
  editBizdate,
  getTableList,
  addDataField,
  queryByDataId,
  editDataField,
  delDataField,
  getBusiProject,
  getDataField
} from '@/api/plan/business'
export default {
  name: 'Business',
  mixins: [pager],
  components: {
    OverflowTooltip
  },
  data () {
    return {
      activeBusinessId: null, // 当前选中的业务板块的ID
      handleBusinessId: null, // 当前要编辑或者删除的业务板块的ID
      businessList: [],
      is_disabled: true, // 业务板块英文名编辑禁止修改
      businessParams: {},
      tableList: [],
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'business',
      businessForm: this.resetBusinessForm(),
      businessFormRules: {
        busin_name: [
          { required: true, message: '请输入板块名称' },
          {
            pattern: /^[\u4e00-\u9fa5\w-]{1,64}$/,
            message:
              '板块名称至多64个字符，允许中文、数字、字母、下划线或连字符',
            trigger: ['blur', 'change']
          }
        ],
        busin_code: [
          { required: true, message: '请输入板块英文名' },
          {
            pattern: /^\w{1,61}$/,
            message: '板块英文名至多64个字符，允许数字、字母、下划线',
            trigger: ['blur', 'change']
          }
        ],
        icon_code: [
          { required: true, message: '请选择图标', trigger: ['blur', 'change'] }
        ]
      },
      iconList: businessIconList,
      // [
      //   {class: 'el-icon-s-home', background: '#6CA0F4'},
      //   {class: 'el-icon-delete', background: '#6CA0F4'}
      // ],
      partitionForm: this.resetPartitionForm(),
      partitionFormRules: {
        partition_name: [
          { required: true, message: '请输入中文名', trigger: ['blur', 'change'] }
        ],
        partition_code: [
          {
            required: true,
            message: '请输入英文名',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        data_type: [
          {
            required: true,
            message: '请输入数据类型',
            trigger: ['blur', 'change']
          }
        ],
        partition_default: [
          { required: true, message: '请输入默认值', trigger: ['blur', 'change'] }
        ]
      },
      bizdateValueList: [
        // {key: 'yyyyMMdd', value: 'yyyyMMdd'}
      ],
      bizdateForm: this.resetBizdateForm(),
      bizdateFormRules: {
        biz_data_value: [
          { required: true, message: '请选择参数值', trigger: ['blur', 'change'] }
        ]
      },
      dataFieldForm: this.resetDataFieldForm(),
      dataFieldFormRules: {
        data_name: [
          { required: true, message: '请输入数据域名称' },
          {
            pattern: /^[\u4e00-\u9fa5\w-]{1,64}$/,
            message:
              '数据域名称至多64个字符，允许中文、数字、字母、下划线或连字符',
            trigger: ['blur', 'change']
          }
        ],
        name: [
          { required: true, message: '请选择上级主题域' }
        ],
        data_code: [
          { required: true, message: '请输入数据域英文名' },
          {
            pattern: /^\w{1,64}$/,
            message: '数据域英文名至多64个字符，允许数字、字母、下划线',
            trigger: ['blur', 'change']
          }
        ],
        nameEnAbb: [
          { required: true, message: '请输入英文名缩写' },
          {
            pattern: /^\w{1,10}$/,
            message: '英文名缩写至多10个字符，允许数字、字母、下划线',
            trigger: ['blur', 'change']
          }
        ]
      },
      dataName: '',
      busiProject: [],
      dataFieldList: []
    }
  },
  watch: {
    dataName (newVal, oldVal) {
      this.getTableList()
    }
  },
  created () {
    this.getBusinessList()
    // this.getBusinessInfo()
    // this.getTableList()
    // this.getBizdateValueList()
    // this.getDataNameList()
  },
  methods: {

    handleNodeClick (data, node, e) {
      this.$set(this.dataFieldForm, 'name', data.name)
      this.dataFieldForm.parent_id = data.id
      this.$refs.treeSelect.blur()
    },

    handleChange (val) {
      console.log(val)
    },

    getrandomInRange () {
      return randomInRange(0, 3)
    },

    async getDataNameList () {
      const res = await this.$simpleAsyncTo(
        getDataField({ busin_id: this.activeBusinessId }),
        '获取上级主题域名称列表'
      )
      if (res) {
        this.dataFieldList = [res.data] // res.data.child
      }
    },

    async getBusinessList () {
      const res = await this.$simpleAsyncTo(
        getBusinessList(),
        '获取业务板块列表失败'
      )
      if (res) {
        this.businessList = res.data
        // 初始化或者删除后当前选中的业务板块
        if (
          this.activeBusinessId === null ||
          this.businessList.filter(
            item => item.busin_id === this.activeBusinessId
          ).length === 0
        ) {
          this.activeBusinessId = res.data[0].busin_id
          this.getDataNameList()
        }
        if (this.businessList.length) {
          this.getBusinessInfo()
          this.getTableList()
          this.getBizdateValueList()
          this.getBusiProject()
        }
      }
    },
    handleChangeBusiness (item) {
      this.activeBusinessId = item.busin_id
      this.getBusinessInfo()
      this.getTableList()
      this.getBusiProject()
      this.getDataNameList()
    },
    // 获取业务板块参数
    async getBusinessInfo () {
      const res = await this.$simpleAsyncTo(
        getBusinessInfo({ busin_id: this.activeBusinessId }),
        '获取业务板块参数失败'
      )
      if (res) {
        this.businessParams = res.data.params
      }
    },

    // 获取数据域列表
    async getTableList () {
      const params = {
        busin_id: this.activeBusinessId,
        dataName: this.dataName,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(
        getTableList(params),
        '获取数据域列表失败'
      )
      if (res) {
        this.tableList = res.data.data_fields
        this.total = res.total_records
      }
    },
    // 选择业务板块图标
    handleSelectIcon (icon, key) {
      this.businessForm.icon_code = key
    },
    // 业务板块表单初始化
    resetBusinessForm () {
      return {
        busin_name: '',
        busin_code: '',
        comments: '',
        icon_code: ''
      }
    },
    // 删除业务板块
    async handleDeleteBusiness (item) {
      const res = await this.$simpleAsyncTo(
        delBusiness({ busin_id: item.busin_id }),
        '删除业务板块失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getBusinessList()
      }
    },
    // 打开新增业务板块弹框
    handleAddBusiness () {
      this.dialogType = 'business'
      this.dialogTitle = '新建业务板块'
      this.dialogVisible = true
      this.is_disabled = false
    },
    // 打开编辑业务板块弹框
    handleEditBusiness (item) {
      this.dialogType = 'business'
      this.dialogTitle = '编辑业务板块'
      this.dialogVisible = true
      this.is_disabled = true
      this.businessForm.busin_name = item.busin_name
      this.businessForm.busin_code = item.busin_code
      this.businessForm.comments = item.comments
      this.businessForm.icon_code = item.icon_code
      this.handleBusinessId = item.busin_id
    },
    // 新增&编辑业务板块
    async handleBusiness () {
      this.globalLoading()
      if (this.dialogTitle === '新建业务板块') {
        const res = await this.$simpleAsyncTo(
          addBusiness(this.businessForm),
          '新建业务板块失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '新建业务板块成功!'
          })
        }
      } else if (this.dialogTitle === '编辑业务板块') {
        const params = { busin_id: this.handleBusinessId, ...this.businessForm }
        const res = await this.$simpleAsyncTo(
          editBusiness(params),
          '编辑业务板块失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '编辑业务板块成功!'
          })
        }
      }
      this.$refs.businessForm.resetFields()
      this.dialogVisible = false
      this.businessForm = this.resetBusinessForm()
      this.getBusinessList()
      this.globalLoading().close()
    },
    // 时间分区表单初始化
    resetPartitionForm () {
      return {
        partition_name: '',
        partition_code: '',
        data_type: '',
        partition_default: '',
        partition_desc: ''
      }
    },
    // 编辑时间分区
    handleEditPartition () {
      this.dialogType = 'partition'
      this.dialogTitle = '编辑时间分区'
      this.dialogVisible = true
      this.partitionForm.partition_name = this.businessParams.partition_name
      this.partitionForm.partition_code = this.businessParams.partition_code
      this.partitionForm.data_type = this.businessParams.data_type
      this.partitionForm.partition_default = this.businessParams.partition_default
      this.partitionForm.partition_desc = this.businessParams.partition_desc
    },
    async editPartition () {
      this.globalLoading()
      const params = { busin_id: this.activeBusinessId, ...this.partitionForm }
      const res = await this.$simpleAsyncTo(
        editPartition(params),
        '编辑时间分区失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '编辑时间分区成功!'
        })
        this.getBusinessInfo()
      }
      this.globalLoading().close()
    },
    // 获取时间分区参数值列表
    async getBizdateValueList () {
      const res = await this.$simpleAsyncTo(
        getBizdateValueList(),
        '获取参数值列表失败'
      )
      if (res) {
        this.bizdateValueList = res.data
      }
    },
    resetBizdateForm () {
      return {
        biz_date_key: '',
        biz_data_value: ''
      }
    },
    // 编辑业务日期
    handleEditBizdate () {
      this.dialogType = 'bizdate'
      this.dialogTitle = '编辑业务日期'
      this.dialogVisible = true
      this.bizdateForm.biz_date_key = this.businessParams.biz_date_key
      this.bizdateForm.biz_data_value = this.businessParams.biz_data_value
    },
    // 选择业务日期参数
    handleBizdatekeyChange (val) {
      this.bizdateForm.biz_data_value = this.bizdateValueList.filter(
        item => item.key === val
      )[0].value
    },
    async editBizdate () {
      this.globalLoading()
      const params = { busin_id: this.activeBusinessId, ...this.bizdateForm }
      const res = await this.$simpleAsyncTo(
        editBizdate(params),
        '编辑业务日期失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '编辑业务日期成功!'
        })
        this.getBusinessInfo()
      }
      this.globalLoading().close()
    },
    // 初始化数据域表单
    resetDataFieldForm () {
      return {
        data_name: '',
        data_code: '',
        nameEnAbb: '',
        comments: ''
      }
    },
    // 新建数据域
    handleAddData () {
      this.dialogType = 'dataField'
      this.dialogTitle = '新建数据域'
      this.dialogVisible = true
      this.dataFieldForm.data_id = undefined
      this.is_disabled = false
    },
    // 编辑数据域
    async handleEditData (row) {
      this.dialogType = 'dataField'
      this.dialogTitle = '编辑数据域'
      this.dialogVisible = true
      this.is_disabled = true
      this.dataFieldForm = row
      // const res = await this.$simpleAsyncTo(
      //   queryByDataId({ data_id: row.data_id }),
      //   '获取数据域详情信息失败'
      // )
      // if (res) {
      //   this.dataFieldForm = res.data
      // }
      // this.dataFieldForm.data_name = row.data_name
      // this.dataFieldForm.data_code = row.data_code
      // this.dataFieldForm.nameEnAbb = row.nameEnAbb
      // this.dataFieldForm.comments = row.comments
      // this.dataFieldForm.data_id = row.data_id
    },
    // 新增&编辑数据域
    async handleDataField () {
      this.globalLoading()
      if (this.dialogTitle === '新建数据域') {
        const params = { busin_id: this.activeBusinessId, ...this.dataFieldForm }
        const res = await this.$simpleAsyncTo(
          addDataField(params),
          '新建数据域失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '新建数据域成功!'
          })
        }
      } else if (this.dialogTitle === '编辑数据域') {
        const res = await this.$simpleAsyncTo(
          editDataField(this.dataFieldForm),
          '编辑数据域失败'
        )
        if (res) {
          this.$message({
            type: 'success',
            message: '编辑数据域成功!'
          })
        }
      }
      this.$refs.dataFieldForm.resetFields()
      this.dialogVisible = false
      this.dataFieldForm = this.resetDataFieldForm()
      this.getTableList()
      this.globalLoading().close()
    },
    async handleDeleteData (row) {
      const res = await this.$simpleAsyncTo(
        delDataField({ data_id: row.data_id }),
        '删除业务板块失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },
    // 提交表单
    handleSubmit () {
      if (this.dialogType === 'business') {
        this.$refs.businessForm.validate(valid => {
          if (valid) {
            this.handleBusiness()
            // this.$refs.businessForm.resetFields()
            // this.dialogVisible = false
            // this.businessForm = this.resetBusinessForm()
          }
        })
      } else if (this.dialogType === 'partition') {
        this.$refs.partitionForm.validate(valid => {
          if (valid) {
            this.editPartition()
            // this.$refs.businessForm.resetFields()
            this.dialogVisible = false
            // this.partitionForm = this.resetPartitionForm()
          }
        })
      } else if (this.dialogType === 'bizdate') {
        this.$refs.bizdateForm.validate(valid => {
          if (valid) {
            this.editBizdate()
            // this.$refs.bizdateForm.resetFields()
            this.dialogVisible = false
            // this.bizdateForm = this.resetBizdateForm()
          }
        })
      } else if (this.dialogType === 'dataField') {
        this.$refs.dataFieldForm.validate(valid => {
          if (valid) {
            this.handleDataField()
            // this.$refs.dataFieldForm.resetFields()
            // this.dialogVisible = false
            // this.dataFieldForm = this.resetDataFieldForm()
          }
        })
      }
    },
    // 关闭弹框
    handleCancel () {
      if (this.dialogType === 'business') {
        this.$refs.businessForm.resetFields()
        this.businessForm = this.resetBusinessForm()
      } else if (this.dialogType === 'partition') {
        this.$refs.partitionForm.resetFields()
        this.partitionForm = this.resetPartitionForm()
      } else if (this.dialogType === 'bizdate') {
        this.$refs.bizdateForm.resetFields()
        this.bizdateForm = this.resetBizdateForm()
      } else if (this.dialogType === 'dataField') {
        this.$refs.dataFieldForm.resetFields()
        this.dataFieldForm = this.resetDataFieldForm()
      }
      this.dialogVisible = false
    },
    // 新建项目
    handleAddProject () {
      this.$router.push({
        path: '/plan/project-manage'
      })
    },
    // 相关项目
    async getBusiProject () {
      const res = await this.$simpleAsyncTo(getBusiProject({ busin_id: this.activeBusinessId }), '获取相关对象失败')
      if (res) {
        this.busiProject = res.data
      }
    },
    projectClickHandle (item) {
      this.$router.push({
        name: 'project-manage',
        params: {
          project_name: item.project_name
        }
      })
    }
  }
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
</style>
<style lang="scss">
.business {
  .business-content {
    height: calc(100% - 40px);
    .el-col {
      height: 100%;
    }
  }
  @mixin icon {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    color: $grey10;
  }
  .left-box {
    // width:400px;
    height: 100%;
    overflow-y: auto;
    // margin-right:15px;
    &.no-data {
      background-color: $grey10;
      color: $grey4;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .card-box {
      min-width: 260px;
      padding: 15px;
      box-sizing: border-box;
      background-color: $grey10;
      border-left: 6px solid transparent;
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      &.active {
        border-left-color: $--color-primary;
      }
      &:hover {
        cursor: pointer;
        background-color: $grey8;
      }
      .top-content {
        display: flex;
        .icon {
          @include icon();
          margin-right: 15px;
          // background-color:#A186FF;
        }
        .title-box {
          width: calc(100% - 90px);
          .text-info {
            color: $grey3;
            font-weight: 600;
            font-size: 14px;
            // letter-spacing: 1px;
            padding-bottom: 10px;
          }
          .code-info {
            color: $grey4;
            font-size: 12px;
          }
        }
      }
      .bottom-content {
        padding-top: 15px;
        color: $grey4;
        font-size: 12px;
        font-weight: 600;
        > div:not(:last-child) {
          padding-bottom: 10px;
        }
      }
    }
  }
  .right-content-box {
    overflow: auto;
  }
  .right-box {
    min-width: 500px;
    min-height: 400px;
    height: 100%;
    background-color: $grey8;
    padding: 15px 15px 0;
    // width:calc(100% - 400px);
    box-sizing: border-box;
    @mixin box {
      padding: 15px 20px;
      background-color: $grey10;
    }
    $listColor: $waitRun, $running, $publishedTag, $warning;
    @for $i from 0 through length($listColor) - 1 {
      .bc-color-#{$i} {
        background: rgba(nth($listColor, $i + 1), 0.1);
        border: 1px solid nth($listColor, $i + 1);
        color: nth($listColor, $i + 1);
      }
    }
    .right-top-left {
      @include box();
      .result-box {
        li {
          float: left;
          width: 50%;
          padding-bottom: 5px;
          padding-right: 5px;
          font-size: 12px;
          &.exclusive-line {
            width: 100%;
          }
          .label-text {
            color: $grey4;
            padding-right: 10px;
            // font-size: 14px;
          }
          .info-text {
            color: $grey3;
            font-weight: 600;
            // font-size:14px;
          }
        }
      }
    }
    .right-top-right {
      @include box();
      height: 213px;
      .project-box {
        justify-content: center;
        > div {
          color: $grey4;
          padding-bottom: 10px;
          text-align: center;
        }
        .project {
          display: flex;
          flex-wrap: wrap;
          max-height: 150px;
          overflow-y: auto;
          cursor: pointer;
          .project-item {
            padding: 4px 10px;
            max-width: 80px;
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }
    }
    .right-bottom {
      height: calc(100% - 213px);
    }
    .table-box {
      height: calc(100% - 110px);
    }
  }
  .form-dialog {
    .busin-icon-box {
      border: 1px solid transparent;
      padding: 5px;
      &.active {
        border-color: $--color-primary;
      }
      &:hover {
        cursor: pointer;
        border-color: $--color-primary;
      }
      .busin_icon {
        @include icon();
      }
    }
    // .el-select{
    //   width:100%;
    // }
  }
}
</style>
