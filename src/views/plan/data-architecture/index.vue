<template>
  <div class="data-architecture height-100per flex-column">
    <div v-if="showDataBlockList">
      <div class="page-title">
        <span class="fl">数据板块（{{ dataBlockNum }}）&nbsp;</span>
        <div class="fl flex-layout flex-center">
          <el-input
            v-model="data_source_name"
            placeholder="请输入关键词"
            prefix-icon="el-icon-search"
            @input="search"
            class="mr-15"
            clearable
          ></el-input>
          <el-checkbox v-model="checked" @change="getTableList"
            >我管理的</el-checkbox
          >
          <el-popover
            placement="bottom-end"
            title="更多筛选"
            width="320"
            v-model="visible"
          >
            <div style="position: relative">
              <span
                style="
                  position: absolute;
                  right: 20px;
                  top: -26px;
                  color: blue;
                  cursor: pointer;
                "
                @click="resetProDevType"
                >重置</span
              >
              <span
                >生产开发类型&nbsp;&nbsp;&nbsp;
                <el-select v-model="proDevType" @change="getTableList">
                  <el-option
                    v-for="(item, index) in proDevTypes"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
            <i
              slot="reference"
              class="icon iconfont icon-shaixuan ml-5"
              style="
                position: relative;
                font-size: 16px;
                padding: 4px;
                border: 1px solid gray;
                cursor: pointer;
              "
            ></i>
          </el-popover>
        </div>
        <el-button
          class="fr"
          type="primary"
          @click="handleAddData"
          icon="el-icon-plus"
          >新建数据板块</el-button
        >
      </div>
      <el-row :gutter="15" class="data-architecture-content">
        <div class="table-content">
          <el-table
            :data="architectureContentTableLIstData"
            class="table-list"
            v-loading="!!loading"
          >
            <el-table-column label="板块名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="mode-type-name fl">
                  <div class="busin-icon-box fl">
                    <div
                      class="icon"
                      :class="[
                        'busin_icon',
                        'icon',
                        'iconfont',
                        scope.row.icon_code,
                      ]"
                      :style="{
                        'background-color': iconList[scope.row.icon_code],
                      }"
                    ></div>
                  </div>
                  <div
                    class="mode-type-item-name"
                    v-if="scope.row.mode_type == '1'"
                  >
                    <div
                      style="cursor: pointer"
                      @click="jumpToSigleDataBlock(scope.row)"
                    >
                      <span class="mode-type-basic">
                        {{
                          scope.row.busin_code +
                          '(' +
                          scope.row.busin_name +
                          ')'
                        }}
                      </span>
                    </div>
                  </div>
                  <div class="mode-type-item-name" v-else>
                    <div
                      style="cursor: pointer"
                      @click="jumpToSigleDataBlock(scope.row)"
                    >
                      <div>
                        <span class="mode-type-prod">
                          {{
                            scope.row.busin_code +
                            '(' +
                            scope.row.busin_name +
                            ')'
                          }}
                        </span>
                      </div>
                      <div>
                        <span class="mode-type-dev">
                          {{
                            scope.row.busin_code +
                            '_dev' +
                            '(' +
                            scope.row.busin_name +
                            '_开发)'
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.comments }}
              </template>
            </el-table-column>
            <el-table-column label="板块架构师" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <template
                  v-if="scope.row.dataBlockForm.block_architect.length == 0"
                >
                  <span></span>
                </template>
                <template
                  v-else-if="scope.row.dataBlockForm.block_architect.length == 1"
                >
                  <span
                    v-for="(item, index) in scope.row.dataBlockForm
                      .block_architect"
                    :key="index"
                  >
                    {{ item }}
                  </span>
                </template>
                <template
                  v-else-if="scope.row.dataBlockForm.block_architect.length > 1"
                >
                  <span
                    v-for="(item, index) in scope.row.dataBlockForm
                      .block_architect"
                    :key="index"
                  >
                    <template
                      v-if="
                        index !=
                        scope.row.dataBlockForm.block_architect.length - 1
                      "
                    >
                      {{ item + '、' }}
                    </template>
                    <template v-else>
                      {{ item }}
                    </template>
                  </span>
                  等{{ scope.row.dataBlockForm.block_architect.length }}人
                </template> -->
                {{ scope.row.block_architect }}
              </template>
            </el-table-column>
            <el-table-column label="板块规划" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <span
                  style="color: skyblue; cursor: pointer"
                  @click="jumpToSigleDataBlockTab('topic_domain', scope.row)"
                >
                  主体域{{ scope.row.plate_planing.topic_domain }}
                </span>
                <span
                  style="color: skyblue; cursor: pointer"
                  @click="jumpToSigleDataBlockTab('business_object', scope.row)"
                >
                  业务对象{{ scope.row.plate_planing.business_object }}
                </span>
                <span
                  style="color: skyblue; cursor: pointer"
                  @click="
                    jumpToSigleDataBlockTab('operational_action', scope.row)
                  "
                >
                  业务活动{{ scope.row.plate_planing.operational_action }}
                </span> -->
                {{ scope.row.busi_plan }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-popover placement="bottom" trigger="click" class="mr-10">
                  <div>
                    <div>
                      <span
                        style="cursor: pointer"
                        @click="
                          jumpToSigleDataBlockOperate(
                            'topicDomainManagement',
                            scope.row
                          )
                        "
                        >新建主体域</span
                      >
                    </div>
                    <div>
                      <span
                        style="cursor: pointer"
                        @click="
                          jumpToSigleDataBlockOperate(
                            'businessEntity',
                            scope.row
                          )
                        "
                        >新建业务实体</span
                      >
                    </div>
                  </div>
                  <el-button
                    type="text"
                    title="新建"
                    class="item-btn"
                    icon="font-16 icon iconfont icon-xinjian1"
                    slot="reference"
                  ></el-button>
                </el-popover>
                <el-button
                  type="text"
                  title="关联项目"
                  class="item-btn"
                  icon="font-16 icon iconfont icon-guanlian4"
                  @click="handleTestConnection(scope.row)"
                ></el-button>
                <el-button
                  type="text"
                  class="item-btn"
                  title="编辑"
                  icon="font-16 icon iconfont icon-bianji2"
                  @click="handleEditSingleDataBlock(scope.row)"
                ></el-button>
                <el-button
                  type="text"
                  class="item-btn"
                  title="删除"
                  icon="font-16 icon iconfont icon-shanchu1"
                  @click="handleRuleDel(scope.row)"
                ></el-button>
                <!-- <SimpleConfirm @confirm="handleDeleteDataBlock(scope.row)" /> -->
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
      </el-row>
    </div>
    <template v-else>
      <SigleDataBlock
        :params="params"
        @jumpToDataBlockList="jumpToDataBlockList"
        @p_addBusinessEntity="p_addBusinessEntity"
        @changeShowTopic="changeShowTopic"
      />
    </template>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="40%"
      top="2vh"
      :before-close="handleCancel"
      custom-class="form-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{
        trigger: '.el-dialog__header',
        body: '.el-dialog',
        recover: false,
      }"
    >
      <div>
        <el-steps
          :space="200"
          :align-center="true"
          :active="activeIndex + 0"
          process-status="finish"
          finish-status="success"
          class="flex-center"
        >
          <el-step title="生产开发类型"></el-step>
          <el-step title="板块定义"></el-step>
        </el-steps>
        <el-tabs v-model="activeName">
          <el-tab-pane name="0">
            <el-row :gutter="15" type="flex" justify="center">
              <el-col :span="12">
                <div
                  class="radio-wrapper"
                  :style="
                    dataBlockForm.mode_type == '0'
                      ? 'border:1px solid blue'
                      : 'border:1px solid transparent'
                  "
                >
                  <el-radio
                    v-model="dataBlockForm.mode_type"
                    label="0"
                    class="flex-end mr-1"
                    >{{ '' }}</el-radio
                  >
                  <div
                    style="cursor: pointer"
                    @click="dataBlockForm.mode_type = '0'"
                  >
                    <img src="@/assets/images/dev-prod-module.png" alt="" />
                    <p>Dev-Prod模式</p>
                    <p>
                      生成互相关联的Dev环境和Prod环境，以强管控数据生产过程、生产的数据。
                    </p>
                    <p>
                      如您管理诉求较强，数据研发人员较多且能力及分工明确，数据计算存储预算较高，推荐此模式：Dev环境和Prod环境逻辑隔离，可加强对数据研发流程的管控，强控制生产数据的权限，最大化保障数据生产稳定性，但是研发流程灵活及便携性较低，对研发人员工具使用熟练度要求较高，需要配置双份计算存储资源。
                    </p>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div
                  class="radio-wrapper"
                  :style="
                    dataBlockForm.mode_type == '1'
                      ? 'border:1px solid blue'
                      : 'border:1px solid transparent'
                  "
                >
                  <el-radio
                    v-model="dataBlockForm.mode_type"
                    label="1"
                    class="flex-end mr-1"
                    >{{ '' }}</el-radio
                  >
                  <div
                    style="cursor: pointer"
                    @click="dataBlockForm.mode_type = '1'"
                  >
                    <img src="@/assets/images/basic-module.png" alt="" />
                    <p>Basic模式</p>
                    <p>
                      生成独立灵活的Prod环境，数据生产过程相对稳定而便捷，生产的数据可管控
                    </p>
                    <p>
                      如您关注数据研发效率而非强管控，研发人员职能边界相对模糊，计算存储预算有限制，推荐此模式：开发与运维一体化的Prod环境，可敏捷管理数据研发流程，强控制生产数据的写权限，平衡数据生产稳定性与灵活性，Basic模式存在直接变更生产风险，请谨慎管理项目成员，控制生产数据稳定性。
                    </p>
                    <el-alert
                      title="提示:请注意,创建后不可升级到Dev-Prod模式!"
                      type="info"
                      show-icon
                      :closable="false"
                    >
                    </el-alert>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="1">
            <el-form
              class="form-list"
              :model="dataBlockForm"
              ref="dataBlockForm"
              :rules="rules"
            >
              <div>
                <span>基础信息</span>
                <el-form-item
                  label="公用英文名"
                  prop="busin_code"
                  :label-width="formLabelWidth"
                >
                  <div style="display: flex">
                    <el-input
                      v-model="dataBlockForm.busin_code"
                      placeholder="请输入数据板块英文名，64个字符以内，允许字母、数字或下划线"
                      autocomplete="off"
                    >
                      <template slot="prepend">{{ prefixValue }}</template>
                    </el-input>
                    <el-tooltip content="公用英文名" placement="top">
                      <i
                        class="el-input__icon el-icon-warning-outline"
                        style="width: 25px; height: 25px"
                      ></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item
                  label="公用名称"
                  prop="busin_name"
                  :label-width="formLabelWidth"
                  style="margin-right: 24px"
                >
                  <el-input
                    v-model="dataBlockForm.busin_name"
                    placeholder="请输入数据板块名称，64个文字以内，允许中文数字字母及下划线或-"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label=""
                  :label-width="formLabelWidth"
                  style="margin-right: 24px"
                >
                  <div
                    class="module-preview-b"
                    v-if="dataBlockForm.mode_type == '1'"
                  >
                    <el-row>
                      <el-col :span="24">
                        <div>
                          <div>
                            <span class="module-name-preview-basic"
                              >模块名预览：</span
                            >
                          </div>
                          <div>
                            <span
                              >模块英文名：{{
                                prefixValue + dataBlockForm.busin_code
                              }}</span
                            >
                          </div>
                          <div>
                            <span
                              >模块名称：{{ dataBlockForm.busin_name }}</span
                            >
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <!-- <div
                    class="module-preview-p-d"
                    v-if="dataBlockForm.mode_type == 2"
                  > -->
                  <div class="module-preview-p-d" v-else>
                    <el-row>
                      <el-col :span="12">
                        <div>
                          <div>
                            <span class="module-name-preview-prod"
                              >模块名预览：</span
                            >
                          </div>
                          <div>
                            <span
                              >模块英文名：{{
                                prefixValue + dataBlockForm.busin_code
                              }}</span
                            >
                          </div>
                          <div>
                            <span
                              >模块名称：{{ dataBlockForm.busin_name }}</span
                            >
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div>
                          <div>
                            <span class="module-name-preview-dev"
                              >模块名预览：</span
                            >
                          </div>
                          <div>
                            <span
                              >模块英文名：{{
                                prefixValue + dataBlockForm.busin_code
                              }}_dev</span
                            >
                          </div>
                          <div>
                            <span
                              >模块名称：{{
                                dataBlockForm.busin_name
                              }}_开发</span
                            >
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>

                <el-form-item
                  label="描述信息"
                  prop="comments"
                  :label-width="formLabelWidth"
                  style="margin-right: 24px"
                >
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入描述，128字符以内"
                    v-model="dataBlockForm.comments"
                    maxlength="120"
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="图标"
                  prop="icon_code"
                  :label-width="formLabelWidth"
                  style="margin-right: 24px"
                >
                  <div class="icon-wrapper clearfix">
                    <div
                      v-for="(icon, key, index) in iconList"
                      :key="index"
                      :class="[
                        'busin-icon-box',
                        'fl',
                        {active: key == dataBlockForm.icon_code},
                      ]"
                      @click="handleSelectIcon(icon, key)"
                    >
                      <div
                        :class="['busin_icon', 'icon', 'iconfont', key]"
                        :style="{'background-color': icon}"
                      ></div>
                    </div>
                  </div>
                </el-form-item>
              </div>
              <div>
                <span>业务信息</span>
                <el-form-item
                  label="板块架构师"
                  prop="block_architect"
                  :label-width="formLabelWidth"
                >
                  <div style="display: flex">
                    <el-select
                      v-model="dataBlockForm.block_architect"
                      multiple
                      filterable
                      placeholder="请选择或输入关键词进行搜索"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.user_id"
                        :label="item.user_name"
                        :value="item.user_id"
                      >
                      </el-option>
                    </el-select>
                    <el-tooltip content="板块架构师" placement="top">
                      <i
                        class="el-input__icon el-icon-warning-outline"
                        style="width: 25px; height: 25px"
                      ></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item label="业务负责人" :label-width="formLabelWidth">
                  <div style="display: flex">
                    <el-select
                      v-model="dataBlockForm.biz_owner"
                      multiple
                      filterable
                      placeholder="请选择或输入关键词进行搜索"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.user_id"
                        :label="item.user_name"
                        :value="item.user_id"
                      >
                      </el-option>
                    </el-select>
                    <el-tooltip content="业务负责人" placement="top">
                      <i
                        class="el-input__icon el-icon-warning-outline"
                        style="width: 25px; height: 25px"
                      ></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item label="数据负责人" :label-width="formLabelWidth">
                  <div style="display: flex">
                    <el-select
                      v-model="dataBlockForm.data_owner"
                      multiple
                      filterable
                      placeholder="请选择或输入关键词进行搜索"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.user_id"
                        :label="item.user_name"
                        :value="item.user_id"
                      >
                      </el-option>
                    </el-select>
                    <el-tooltip content="数据负责人" placement="top">
                      <i
                        class="el-input__icon el-icon-warning-outline"
                        style="width: 25px; height: 25px"
                      ></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer">
        <el-button-group>
          <el-button @click="handleCancel()">取消</el-button>
          <el-button @click="nextStep()" v-if="activeName == 0" type="primary"
            >下一步</el-button
          >
          <el-button @click="preStep()" v-if="activeName == 1 && editStatus"
            >上一步</el-button
          >
          <el-button @click="submitForm()" v-if="activeName == 1" type="primary"
            >确定</el-button
          >
        </el-button-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import OverflowTooltip from '@c/overflow-tooltip'
import {businessIconList} from '@/config/dics'
import {randomInRange} from '@/libs/util'
import SigleDataBlock from './sigle-data-block.vue'
import * as _ from 'lodash'
import {
  queryBussinessList,
  queryBussinessById,
  delBussiness, // 删除
  saveBussiness, // 新建
  editBussiness, // 编辑
  queryUserList, // 用户列表
} from '@/api/plan/data-architecture'

export default {
  name: 'DataArchitecture',
  mixins: [pager],
  components: {
    OverflowTooltip,
    SigleDataBlock,
  },
  data() {
    return {
      iconList: businessIconList,
      dialogVisible: false,
      dialogTitle: '',
      showDataBlockList: true,
      activeIndex: 0, // 当前激活页索引
      activeName: '0',
      tabsName: Object.freeze(['0', '1']),
      data_source_name: '',
      checked: false,
      architectureContentTableLIstData: [],
      loading: 0,
      dataBlockForm: this.resetForm(),
      formLabelWidth: '100px',
      options: [],
      addNew: true,
      prefixValue: 'LD_',
      debounceSearch: null,
      visible: false,
      proDevType: 'ALL',
      editStatus: true,
      params: {
        dataBlock: '',
        businId: '',
        activeName: '',
        showTopic: true,
      },
      proDevTypes: [
        {
          value: 'ALL',
          label: '全部',
        },
        {
          value: '1',
          label: 'Basic',
        },
        {
          value: '0',
          label: 'Dev_Prod',
        },
      ],
      rules: {
        busin_code: [
          {
            required: true,
            message:
              '请输入数据板块英文名，64个字符以内，允许字母、数字或下划线',
            trigger: 'blur',
          },
        ],
        busin_name: [
          {
            required: true,
            message:
              '请输入数据板块名称，64个文字以内，允许中文数字字母及下划线或-',
            trigger: 'blur',
          },
        ],
        icon_code: [{required: true, message: '请选择图标', trigger: 'blur'}],
        block_architect: [
          {required: true, message: '请选择板块架构师', trigger: 'blue'},
        ],
        comments: [
          {
            message: '请输入描述，120字符以内',
          },
        ],
      },
    }
  },
  computed: {
    dataBlockNum() {
      return this.architectureContentTableLIstData.length
    },
  },
  watch: {
    activeIndex(value) {
      this.activeName = this.tabsName[value]
    },
  },
  created() {
    this.renderer()
    this.getTableList()
    this.getQueryUserList()
  },
  mounted() {},
  methods: {
    // 删除
    handleRuleDel(row) {
      this.$confirm(`确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.submitRuleDel(row.busin_id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 删除
    async submitRuleDel(busin_id) {
      const res = await this.$simpleAsyncTo(delBussiness({busin_id}))
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getTableList()
      }
    },
    // 重置表单Form
    resetForm() {
      return {
        busin_id: '',
        busin_code: '',
        busin_name: '',
        comments: '',
        icon_code: '',
        mode_type: '0',
        block_architect: [],
        biz_owner: [],
        data_owner: [],
      }
    },
    // 获取列表数据
    async getTableList() {
      const res = await this.$simpleAsyncTo(
        queryBussinessList({
          keyword: this.data_source_name,
          mode_type: this.proDevType,
          managed: !this.checked ? '0' : '1',
          pageSize: 10,
          pageNo: 1,
        })
      )
      if (res) {
        this.total = res.data.total_records
        this.architectureContentTableLIstData = res.data.busi_data
        this.resetVisible()
      }
    },
    // 关闭弹框
    handleCancel() {
      this.$refs.dataBlockForm.resetFields()
      this.dataBlockForm = this.resetForm()
      this.activeIndex = 0
      this.dialogVisible = false
    },
    // 选择业务板块图标
    handleSelectIcon(icon, key) {
      this.dataBlockForm.icon_code = key
    },
    // 点击行item名称跳转tab页面
    jumpToSigleDataBlock(row) {
      this.params.dataBlock = row.busin_code
      this.params.businId = row.busin_id
      this.params.activeName = 'topicDomainManagement'
      this.params.showTopic = true
      this.showDataBlockList = false
      this.resetVisible()
    },
    // 点击板块规划跳转tab页面
    // jumpToSigleDataBlockTab(type, row) {
    //   if (type == 'topic_domain') {
    //     this.params.dataBlock = row.dataBlockForm.busin_code
    //     this.params.activeName = 'topicDomainManagement'
    //   } else if (type == 'business_object') {
    //     this.params.dataBlock = row.dataBlockForm.busin_code
    //     this.params.activeName = 'businessEntity'
    //   } else if (type == 'operational_action') {
    //     this.params.dataBlock = row.dataBlockForm.busin_code
    //     this.params.activeName = 'devSpecification'
    //   }
    //   this.showDataBlockList = false
    //   this.resetVisible()

    // },
    // 点击操作-新建 跳转tab页面
    jumpToSigleDataBlockOperate(type, row) {
      if (type == 'topicDomainManagement') {
        this.params.dataBlock = row.busin_code
        this.params.businId = row.busin_id
        this.params.activeName = 'topicDomainManagement'
        this.params.showTopic = true
      } else if (type == 'businessEntity') {
        this.params.dataBlock = row.busin_code
        this.params.businId = row.busin_id
        this.params.activeName = 'businessEntity'
        this.params.showTopic = false
      }
      this.showDataBlockList = false
      this.resetVisible()
    },
    // 接收子组件emit事件
    jumpToDataBlockList() {
      this.showDataBlockList = true
    },
    // 新建弹框下一步
    nextStep() {
      this.activeIndex++
      this.dialogTitle =
        this.dialogTitle +
        ` 已选：${
          this.dataBlockForm.mode_type == '0' ? 'Dev-Prod模式' : 'Basic模式'
        }`
    },
    // 新建弹框上一步
    preStep() {
      this.activeIndex--
      this.dialogTitle = '新建数据板块'
    },
    // 表单提交验证
    submitForm() {
      this.$refs['dataBlockForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.submit()
        }
      })
    },
    // 表单提交数据接口
    async submit() {
      const {busin_id, busin_name, comments, icon_code, mode_type} =
        this.dataBlockForm
      let block_architect = []
      this.dataBlockForm.block_architect.forEach((item) => {
        this.options.map((ite) => {
          if (ite.user_id == item) {
            block_architect.push({
              user_id: ite.user_id,
              user_name: ite.user_name,
            })
          }
        })
      })
      let biz_owner = []
      this.dataBlockForm.biz_owner.forEach((item) => {
        this.options.map((ite) => {
          if (ite.user_id == item) {
            biz_owner.push({
              user_id: ite.user_id,
              user_name: ite.user_name,
            })
          }
        })
      })
      let data_owner = []
      this.dataBlockForm.data_owner.forEach((item) => {
        this.options.map((ite) => {
          if (ite.user_id == item) {
            data_owner.push({
              user_id: ite.user_id,
              user_name: ite.user_name,
            })
          }
        })
      })
      let busin_code = this.prefixValue + this.dataBlockForm.busin_code
      let params = {
        busin_id,
        busin_code,
        busin_name,
        comments,
        icon_code,
        mode_type,
        block_architect: JSON.stringify(block_architect),
        biz_owner: JSON.stringify(biz_owner),
        data_owner: JSON.stringify(data_owner),
      }
      let res
      if (this.addNew) {
        delete params['busin_id']
        res = await this.$simpleAsyncTo(saveBussiness(params))
      } else {
        res = await this.$simpleAsyncTo(editBussiness(params))
      }
      if (res) {
        this.$message({
          type: 'success',
          message: '提交数据成功!',
        })
        this.dataBlockForm = this.resetForm()
        this.activeIndex = 0
        this.dialogVisible = false
        this.getTableList()
      }
    },
    // 新建弹框弹出
    handleAddData() {
      this.dialogTitle = '新建数据板块'
      this.editStatus = true
      this.addNew = true
      this.dialogVisible = true
    },
    // 点击操作-关联项目
    async handleTestConnection(row) {
      this.$router.push({
        name: 'project-manage',
        params: {project_name: row.busin_id},
      })
    },
    // 点击操作-删除
    handleDeleteDataBlock(row) {
      let tempIndex = this.architectureContentTableLIstData.findIndex(
        (item, index) => {
          return item.id == row.id
        }
      )
      this.architectureContentTableLIstData.splice(tempIndex, 1)
      this.$message({
        type: 'error',
        message: '待对接删除接口',
      })
    },
    // 点击操作-编辑弹框
    async handleEditSingleDataBlock(row) {
      const res = await this.$simpleAsyncTo(
        queryBussinessById({
          busin_id: row.busin_id,
        })
      )
      if (res) {
        this.dialogTitle = '编辑数据板块'
        this.editStatus = false
        let block_architect = []
        res.data.block_architect.forEach((item) => {
          block_architect.push(item.user_id)
        })
        let biz_owner = []
        res.data.biz_owner.forEach((item) => {
          biz_owner.push(item.user_id)
        })
        let data_owner = []
        res.data.data_owner.forEach((item) => {
          data_owner.push(item.user_id)
        })
        Object.keys(this.dataBlockForm).forEach((item) => {
          if (item == 'block_architect') {
            this.dataBlockForm[item] = block_architect
          } else if (item == 'biz_owner') {
            this.dataBlockForm[item] = biz_owner
          } else if (item == 'data_owner') {
            this.dataBlockForm[item] = data_owner
          } else if (item == 'busin_code') {
            this.dataBlockForm[item] = res.data[item].slice(3)
          } else {
            this.dataBlockForm[item] = res.data[item] ? res.data[item] : ''
          }
        })
        this.activeIndex = 1
        this.addNew = false
        this.dialogVisible = true
      }
    },
    // 初始化获取人员列表
    async getQueryUserList() {
      const res = await this.$simpleAsyncTo(queryUserList())
      if (res && res.data.length > 0) {
        this.options = res.data
      }
    },
    // 初始化防抖
    renderer() {
      this.debounceSearch = this.$debounce(this.getTableList.bind(this), 500)
    },
    // 搜索框时间
    search() {
      this.debounceSearch()
    },
    // 接收子组件emit事件
    p_addBusinessEntity() {
      this.params.activeName = 'businessEntity'
      this.params.showTopic = false
    },
    // 接收子组件emit事件
    changeShowTopic(val) {
      this.params.showTopic = val
    },
    // 关闭更多筛选
    resetVisible() {
      this.visible = false
    },
    // 更多筛选-重置
    resetProDevType() {
      this.proDevType = 'ALL'
      this.getTableList()
    },
  },
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
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.data-architecture {
  @mixin icon {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    color: $grey10;
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
    .module-name-preview-basic {
      position: relative;
      font-size: 16px;
      &::after {
        content: 'Basic';
        position: absolute;
        top: 50%;
        left: 100px;
        color: blue;
        border: 1px solid blue;
        transform: translateY(-50%);
        line-height: 16px;
        padding: 2px;
        width: 40px;
        text-align: center;
      }
    }
    .module-name-preview-prod {
      position: relative;
      font-size: 16px;
      &::after {
        content: 'Prod';
        position: absolute;
        top: 50%;
        left: 100px;
        color: purple;
        border: 1px solid purple;
        transform: translateY(-50%);
        line-height: 16px;
        padding: 2px;
        width: 40px;
        text-align: center;
      }
    }
    .module-name-preview-dev {
      position: relative;
      font-size: 16px;
      &::after {
        content: 'Dev';
        position: absolute;
        top: 50%;
        left: 100px;
        color: orange;
        border: 1px solid orange;
        transform: translateY(-50%);
        line-height: 16px;
        padding: 2px;
        width: 40px;
        text-align: center;
      }
    }
    .radio-wrapper {
      padding: 10px;
      background-color: white;
      height: 400px;
      p {
        text-align: center;
        line-height: 1.8;
      }
      p:last-of-type {
        text-align: left;
        color: lightgray;
      }
      img {
        display: block;
        margin: 0 auto;
        width: 100px;
        height: 100px;
      }
    }
  }
  .form-list {
    .module-preview-b {
      .el-col {
        padding: 20px;
        background-color: white;
        border: 1px dashed gray;
      }
    }
    .module-preview-p-d {
      .el-col {
        padding: 20px;
        background-color: white;
        border: 1px dashed gray;
      }
      .el-col:nth-of-type(2) {
        border-left: 0px;
      }
    }
    .icon-wrapper {
      background-color: white;
      padding: 10px;
      border: 1px solid #dcdfe6;
    }
  }
  .data-architecture-content {
    height: calc(100% - 40px);
    .el-col {
      height: 100%;
    }
    .table-list {
      @mixin icon {
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 30px;
        color: $grey10;
      }
      .mode-type-name {
        position: relative;
        .busin-icon-box {
          border: 1px solid transparent;
          padding: 5px;
          .busin_icon {
            @include icon();
          }
        }
        .mode-type-item-name {
          position: absolute;
          top: 50%;
          left: 70px;
          transform: translateY(-50%);
        }
        .mode-type-basic {
          margin-left: 60px;
          position: relative;
          font-size: 16px;
          &::before {
            content: 'Basic';
            position: absolute;
            top: 50%;
            left: -60px;
            color: blue;
            border: 1px solid blue;
            transform: translateY(-50%);
            line-height: 16px;
            padding: 2px;
            width: 40px;
            text-align: center;
          }
        }
        .mode-type-prod {
          margin-left: 60px;
          position: relative;
          font-size: 16px;
          &::before {
            content: 'Prod';
            position: absolute;
            top: 50%;
            left: -60px;
            color: purple;
            border: 1px solid purple;
            transform: translateY(-50%);
            line-height: 16px;
            padding: 2px;
            width: 40px;
            text-align: center;
          }
        }
        .mode-type-dev {
          margin-left: 60px;
          position: relative;
          font-size: 16px;
          &::before {
            content: 'Dev';
            position: absolute;
            top: 50%;
            left: -60px;
            color: orange;
            border: 1px solid orange;
            transform: translateY(-50%);
            line-height: 16px;
            padding: 2px;
            width: 40px;
            text-align: center;
          }
        }
      }
    }
    .item-btn {
      color: #606266;
    }
  }
}
</style>
