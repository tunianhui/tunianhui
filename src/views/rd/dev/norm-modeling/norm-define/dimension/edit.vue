<template>
  <section class="dimension-edit" v-loading="!!loading">
    <div class="btn-oper-box">
      <el-button
        type="text"
        icon="icon iconfont icon-baocun"
        title="保存"
        @click="handleSaveDim"
      ></el-button>
      <el-button
        type="text"
        icon="icon iconfont icon-fabu"
        title="提交"
        :disabled="editForm.dim_id ? false : true"
        @click="handlePublishDim"
      ></el-button>
      <el-button
        type="text"
        icon="icon iconfont icon-iconfontzhizuobiaozhun023117"
        title="定位"
        @click="
          handleLocation(editForm.dim_id + '', '/rd/dev/norm-define/dimension')
        "
      ></el-button>
      <!-- v-if="editForm.dim_id" -->
    </div>
    <div class="edit-content">
      <div>
        <div class="third-title">维度基本信息</div>
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="120px"
          label-position="right"
          label-suffix="："
          class="basic-info-box cus-form"
        >
          <el-row>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item label="业务板块">
                <div>{{ editForm.business_field_name }}</div>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item label="所属项目">
                <div>{{ editForm.project_name }}</div>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item label="项目空间类型">
                <div>{{ editForm.space_type_name }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item label="数据域" prop="data_field_id">
                <el-select
                  v-model="editForm.data_field_id"
                  placeholder="请选择数据域"
                >
                  <el-option
                    v-for="item in metadata"
                    :key="item.data_field_id"
                    :label="item.data_field_name"
                    :value="item.data_field_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item label="维度英文名" prop="dim_code">
                <el-input
                  v-model="editForm.dim_code"
                  placeholder="请输入维度英文名"
                  maxlength="32"
                  show-word-limit
                >
                  <template slot="prepend"
                    >dim_</template
                  >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item label="维度名称" prop="dim_name">
                <el-input
                  v-model="editForm.dim_name"
                  placeholder="请输入维度名称"
                  style="width: 85%"
                  maxlength="32"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="维度描述" prop="dim_desc">
                <el-input
                  v-model="editForm.dim_desc"
                  type="textarea"
                  maxlength="128"
                  show-word-limit
                  placeholder="请输入维度描述"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <div class="third-title">维度逻辑信息</div>
        <div class="logic-box">
          <div class="steps">
            <div
              :class="[
                'step',
                {active: activeIndex == 1},
                {finish: activeIndex > 1}
              ]"
            >
              <span v-if="activeIndex == 1">
                <span class="step-index">1</span>设置维度类型
              </span>
              <span v-else>
                <i
                  :class="['icon', 'iconfont', selectedDimType.icon]"
                  :style="{color: selectedDimType.bg, 'font-size': '14px'}"
                ></i>
                {{ selectedDimType.type }}
              </span>
            </div>
            <div class="step-line"></div>
            <div :class="['step', {active: activeIndex == 2}]">
              <span> <span class="step-index">2</span>主键定义 </span>
            </div>
          </div>
          <div class="logic-content">
            <el-form
              ref="logicForm"
              :model="editForm"
              label-position="right"
              label-width="120px"
              label-suffix
              class="cus-form"
            >
              <div class="type-box" v-if="activeIndex == 1">
                <el-form-item
                  prop="dim_type"
                  :rules="{required: true, message: '请选择维度类型'}"
                  class="cus-form-item"
                >
                  <div class="select-box">
                    <div
                      class="item"
                      v-for="(item, index) in dimTypeList"
                      :key="index"
                      @click="handleSelectDimType(item)"
                    >
                      <img
                        :src="
                          require(`@/assets/images/rd/dimension/${item.image}`)
                        "
                        alt
                        :style="{'background-color': item.bg}"
                      />
                      <div class="label">{{ item.type }}</div>
                    </div>
                  </div>
                </el-form-item>
              </div>
              <div class="pk-box" v-if="activeIndex == 2">
                <div v-if="editForm.dim_type == 'general'" class="simple-box">
                  <el-row>
                    <el-col :md="8" :sm="24" :xs="24">
                      <el-form-item
                        label="主键英文名"
                        prop="pk_code"
                        :rules="[
                          {required: true, message: '请输入主键英文名'},
                          {pattern: /^\w+$/, message: '允许字母、数字或下划线'}
                        ]"
                      >
                        <el-input
                          v-model="editForm.pk_code"
                          maxlength="32"
                          show-word-limit
                          placeholder="请输入主键英文名"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :md="8" :sm="24" :xs="24">
                      <el-form-item
                        label="主键名称"
                        prop="pk_name"
                        :rules="[
                          {required: true, message: '请输入主键名称'},
                          {
                            pattern: /^[\u4e00-\u9fa5\w-]+$/,
                            message: '允许中文、字母、数字、下划线或-'
                          }
                        ]"
                      >
                        <el-input
                          v-model="editForm.pk_name"
                          maxlength="32"
                          show-word-limit
                          placeholder="请输入主键名称"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :md="8" :sm="24" :xs="24">
                      <el-form-item
                        label="主键类型"
                        prop="pk_type"
                        :rules="{required: true, message: '请选择主键类型'}"
                      >
                        <el-select
                          v-model="editForm.pk_type"
                          placeholder="请选择主键类型"
                        >
                          <el-option
                            v-for="(item, index) in pkTypeList"
                            :key="index"
                            :label="item.value"
                            :value="item.key"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :md="6" :sm="24" :xs="24">
                      <el-form-item
                        label="分区类型"
                        prop="part_type"
                        :rules="[
                          {required: true, message: '请选择分区类型'}
                        ]"
                      >
                        <el-select v-model="editForm.part_type" placeholder="请选择" @change="partTypeChange">
                          <el-option
                            v-for="item in partTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="24" :xs="24">
                      <el-form-item
                        label="天分区"
                        prop="part_ds"
                        :rules="[
                          {required: true, message: '请输入天分区'}
                        ]"
                        v-if="editForm.part_type === '1'"
                      >
                        <el-input
                          v-model="editForm.part_ds"
                          placeholder="请输入天分区"
                          @change="partDsChange"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="24" :xs="24">
                      <el-form-item
                        label="小时分区"
                        prop="part_hour"
                        v-if="editForm.part_type === '1'"
                      >
                        <el-input
                          v-model="editForm.part_hour"
                          placeholder="请输入小时分区"
                          @change="partHourChange"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :md="6" :sm="24" :xs="24">
                      <el-form-item
                        label="有延迟"
                        prop="part_hour_delay"
                        v-if="editForm.part_type === '1' && editForm.part_hour"
                      >
                        <el-select v-model="editForm.part_hour_delay" placeholder="请选择" style="width: 80px" @change="partHourDelayChange">
                          <el-option
                            v-for="item in partHourDelayOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>小时
                      </el-form-item>
                      
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        label="主键计算逻辑"
                        prop="sql_content"
                        :rules="{required: true, message: '请输入主键计算逻辑'}"
                      >
                        <MonacoEditor
                          style="height:200px;"
                          has-top-tools
                          has-bottom-tools
                          :code.sync="editForm.sql_content"
                          @verification="sqlVerification"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="editForm.dim_type == 'enum'" class="enum-box">
                  <div class="mb-10">设置枚举信息</div>
                  <div class="flex-layout">
                    <div class="layout-box">
                      <div class="promt-info">
                        <el-tooltip :content="exampleHint">
                          <span>
                            <i class="el-icon-info"></i>
                            参考示例
                          </span>
                        </el-tooltip>
                      </div>
                      <el-input
                        type="textarea"
                        :rows="16"
                        resize="none"
                        v-model="enumInfo"
                        :placeholder="exampleHint"
                        @input="handleTransformData"
                      ></el-input>
                    </div>
                    <div class="arrow-right-btn">
                      <el-button
                        icon="el-icon-d-arrow-right"
                        circle
                        @click="handleTransformData"
                      ></el-button>
                    </div>
                    <div class="layout-box">
                      <el-table
                        :data="editForm.enum_dim_table_list"
                        height="335px"
                      >
                        <el-table-column
                          prop="param_key"
                          label="code(编码)"
                          show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                          prop="param_value"
                          label="value(取值)"
                          show-overflow-tooltip
                        ></el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-10" v-if="editType === 'add'">
                  <el-button plain type="primary" @click="handleModifyDimType"
                    >更改维度类型</el-button
                  >
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getPkTypeList,
  sqlVerification,
  addGeneralDim,
  addEnumDim,
  dimPublish,
  editGeneralDim,
  editEnumDim,
  queryGeneral,
  queryEnum,
  sqlBackFill
} from '@/api/rd/dimension' // eslint-disable-line
import {mapGetters, mapMutations} from 'vuex'
import {types} from '@/config/rd-config'
import rdEditMixin from '@/mixins/rd-edit'

export default {
  name: 'DimensionEdit',
  mixins: [rdEditMixin],
  components: {
    // editor
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  // inject: ['tabStore'],
  data() {
    return {
      editForm: this.editFormReset(),
      editFormRules: {
        data_field_id: [{required: true, message: '请选择数据域'}],
        dim_code: [
          {required: true, message: '请输入维度英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        dim_name: [{required: true, message: '请输入维度名称'}]
      },
      exampleHint: `请按照格式输入，枚举维度成员与对应成员信息，请以英文逗号 ',' 隔开，如：
F,女
M,男`,
      // stepsList: ['设置维度类型', '主键定义']
      activeIndex: 1,
      dimTypeList: [
        {
          type: '普通维度',
          code: 'general',
          image: 'simple.png',
          bg: '#2BC048',
          icon: 'icon-sanwei'
        },
        {
          type: '枚举维度',
          code: 'enum',
          image: 'enum.png',
          bg: '#EABA18',
          icon: 'icon-shoudongshili'
        }
      ],
      selectedDimType: {},
      pkTypeList: [],
      exampleSql: '',
      enumInfo: '',
      dimPublishFetch: dimPublish,
      editType: '',
      interfaces: {
        general: queryGeneral,
        enum: queryEnum
      },
      loading: 0,
      partTypeOptions: [
        {label: '非分区表', value: '0'},
        {label: '自定义', value: '1'}
      ],
      partHourDelayOptions: [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
        {label: '11', value: '11'},
        {label: '12', value: '12'},
        {label: '13', value: '13'},
        {label: '14', value: '14'},
        {label: '15', value: '15'},
        {label: '16', value: '16'},
        {label: '17', value: '17'},
        {label: '18', value: '18'},
        {label: '19', value: '19'},
        {label: '20', value: '20'},
        {label: '21', value: '21'},
        {label: '22', value: '22'},
        {label: '23', value: '23'},
        {label: '24', value: '24'},
      ],
      isShow: true
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    // 获取主键类型
    this.getPkTypeList()
    this.init()
  },
  methods: {
    ...mapMutations({
      setActiveTreeId: 'SET_ACTIVE_TREE_ID'
    }),
    newInit() {
      this.editForm = this.editFormReset()
      Object.assign(this.editForm, this.project)
      this.enumInfo = ''
      this.activeIndex = 1
      this.editType = 'add'
      this.editForm.sql_content = this.editForm.sql_content ? this.decrypt(this.editForm.sql_content) : ''
    },
    async modifyInit() {
      const {dim_type, id, isExtends} = this.data
      const queryInterface = this.interfaces[dim_type]
      if (!queryInterface) {
        this.newInit()
      } else {
        this.loading++
        const res = await this.$simpleAsyncTo(
          queryInterface({dim_id: id}),
          '查询维度失败'
        )
        if (res) {
          const {dimensionDatas, dimAttrDatas} = res.data
          const obj = {...dimensionDatas, ...dimAttrDatas}
          if (isExtends) {
            Object.assign(this.editForm, obj, {
              dim_code: '',
              dim_name: '',
              dim_desc: ''
            })
          } else {
            Object.assign(this.editForm, obj)
          }
          this.editForm.dim_code = this.editForm.dim_code.slice(4)
          if (this.editForm.dim_type === 'enum') {
            const {enum_dim_table_list} = this.editForm
            this.enumInfo = ''
            enum_dim_table_list &&
              enum_dim_table_list.forEach(item => {
                this.enumInfo += `${item.param_key},${item.param_value}\n`
              })
          }
          this.selectedDimType = this.dimTypeList.filter(
            item => item.code === this.editForm.dim_type
          )[0]
          this.activeIndex = 2
          this.editType = 'modify'
          this.editForm.sql_content = this.editForm.sql_content ? this.decrypt(this.editForm.sql_content) : ''
        } else {
          this.newInit()
        }
        this.loading--
      }
    },
    init() {
      JSON.stringify(this.data) === '{}' ? this.newInit() : this.modifyInit()
    },
    editFormReset() {
      return {
        dim_id: undefined,
        business_field_name: '',
        data_field_id: '',
        project_name: '',
        dim_name: '',
        dim_code: '',
        dim_desc: '',
        dim_type: '',
        cube_id: '', // 事实表ID
        element_id: '', // 事实表字段ID
        pk_code: '',
        pk_name: '',
        pk_type: '',
        sql_content:
          'select idcid from t_dwd_activeurl where ds = "${bizdata}" and protocol = "http"',
        logic_dim_id: undefined,
        enum_dim_table_list: [],
        project_id: '',
        business_field_id: '',
        space_type_id: '',
        space_type_name: '',
        data_field_name: '',
        part_type: '1',
        part_ds: '',
        part_hour: '',
        part_hour_delay: '0'
      }
    },
    // 获取主键类型
    async getPkTypeList() {
      const res = await this.$simpleAsyncTo(getPkTypeList(), '获取主键类型失败')
      if (res) {
        this.pkTypeList = res.data.data_type
      }
    },
    handleSelectDimType(item) {
      this.activeIndex = 2
      this.selectedDimType = item
      this.editForm.dim_type = item.code
    },
    handleModifyDimType() {
      this.activeIndex = 1
    },
    // 规范性校验
    async sqlVerification(isSave = false) {
      const params = {
        sql: this.encrypt(this.editForm.sql_content),
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(
        sqlVerification(params),
        '规范性校验失败'
      )
      if (res) {
        this.editForm.cube_id = res.data.cube_id
        this.editForm.element_id = res.data.element_id
        this.editForm.part_ds = res.data.part_ds
        this.editForm.part_hour = res.data.part_hour
        this.editForm.part_hour_delay = res.data.part_hour_delay 
        this.editForm.part_type = res.data.part_type
        if (isSave === true) {
          this.saveGeneralDim()
        } else {
          this.$message({
            type: 'success',
            message: res.msg
          })
        }
      }
      this.globalLoading().close()
    },
    // 将输入的数据显示在表格
    handleTransformData() {
      this.$debounce(_ => {
        const arr = this.enumInfo.split(/[\n\r]+/)
        let codeArr = []
        let enumInfoTableData = []
        arr.forEach(item => {
          const tempArr = item.split(',')
          codeArr.push(tempArr[0])
          tempArr[0] &&
            enumInfoTableData.push({
              param_key: tempArr[0],
              param_value: tempArr[1]
            })
        })
        // 判断code编码是否有重复
        if (new Set(codeArr).size !== codeArr.length) {
          this.$message({
            type: 'warning',
            message: 'code(编码)不能重复'
          })
        } else {
          // this.enumInfoTableData = enumInfoTableData
          this.editForm.enum_dim_table_list = enumInfoTableData
        }
      }, 300)()
    },
    // 保存-普通维度
    async saveGeneralDim() {
      const params = this.getFormData(),
        method = params.dim_id ? editGeneralDim : addGeneralDim,
        res = await this.$simpleAsyncTo(method(params), '保存维度失败')
      if (res) {
        this.addSuccess(res.data, params.dim_id)
      }
      this.globalLoading().close()
    },
    // 保存-枚举维度
    async saveEnumDim() {
      const params = this.getFormData(),
        method = params.dim_id ? editEnumDim : addEnumDim
      let str = ''
      params.enum_dim_table_list.length &&
        params.enum_dim_table_list.forEach(item => {
          str += `${item.param_key}@${item.param_value}@#`
        })
      params.enum_dim_table_list = str

      const res = await this.$simpleAsyncTo(method(params), '保存维度失败')

      if (res) {
        this.addSuccess(res.data, params.dim_id)
      }
      this.globalLoading().close()
    },
    addSuccess(data, currentDimId) {
      this.$message({
        type: 'success',
        message: '保存维度成功！'
      })
      // 如果是新增的话，就将此新增页面变成编辑页面
      if (!currentDimId) {
        this.editForm.dim_id = data.dim_id
        this.editForm.logic_dim_id = data.logic_dim_id
        const obj = this.getFormData()
        this.tabStore.commit('replace', this.tabStore.states.activeValue, {
          label: '编辑维度：' + obj.dim_name,
          tabType: types.DIMENSION,
          name: obj.dim_id,
          component: 'DimensionEdit',
          data: Object.assign(obj, {id: obj.dim_id})
        })
      }
      this.$root.eventEmitter.emit('refresh')
    },
    getFormData(toEdit) {
      /* eslint-disable */
      const {
        dim_id,
        business_field_name,
        data_field_id,
        project_name,
        dim_name,
        dim_code,
        dim_desc,
        dim_type,
        cube_id, // 事实表ID
        element_id, // 事实表字段ID
        pk_code,
        pk_name,
        pk_type,
        sql_content,
        logic_dim_id,
        enum_dim_table_list,
        project_id,
        business_field_id,
        space_type_id,
        space_type_name,
        // data_field_name
        part_type,
        part_ds,
        part_hour,
        part_hour_delay
      } = this.editForm
      let info = {}
      switch (dim_type) {
        case 'general':
          info = {
            cube_id, // 事实表ID
            element_id, // 事实表字段ID
            pk_code,
            pk_name,
            pk_type,
            sql_content: this.encrypt(sql_content),
            part_type,
            part_ds,
            part_hour,
            part_hour_delay
          }
          break
        case 'enum':
          info = {
            enum_dim_table_list
          }
          break
      }
      const dimensionDatas = {
        dim_id,
        business_field_name,
        // data_field_id,
        project_name,
        dim_name,
        dim_code: 'dim_' + dim_code,
        dim_desc,
        dim_type,
        project_id,
        business_field_id,
        space_type_id,
        space_type_name,
        ...this.metadata.find(item => item.data_field_id === data_field_id)
      }
      const dimAttrDatas = {
        logic_dim_id,
        ...info
      }
      // if (type === 1) {
      //   return {...dimensionDatas, ...dimAttrDatas}
      // } else if (type === 2) {
      //   return {dimensionDatas, dimAttrDatas}
      // }
      return toEdit
        ? {dimensionDatas, dimAttrDatas}
        : {...dimensionDatas, ...dimAttrDatas}
    },
    // 新增维度
    handleSaveDim() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$refs.logicForm.validate(async valid1 => {
            if (valid1) {
              this.globalLoading()
              if (this.editForm.dim_type === 'general') {
                this.sqlVerification(true)
              } else if (this.editForm.dim_type === 'enum') {
                this.saveEnumDim()
              }
              // this.$root.eventEmitter.emit('refresh')
            }
          })
        }
      })
    },
    // 提交
    handlePublishDim() {
      // const params = {
      //   dim_id: this.editForm.dim_id
      // }
      // this.dimPublish(params)
      this.$confirm('请确认是否提交？', '提交', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.globalLoading()
          const params = this.getFormData()
          if (this.editForm.dim_type === 'enum') {
            let str = ''
            params.enum_dim_table_list.length &&
              params.enum_dim_table_list.forEach(item => {
                str += `${item.param_key}@${item.param_value}@#`
              })
            params.enum_dim_table_list = str
          }
          const res = await this.$simpleAsyncTo(
            dimPublish(params),
            '维度提交失败'
          )
          if (res) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
          this.globalLoading().close()
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '取消提交！'
          })
        })
    },
    partTypeChange(val) {
      this.filter.part_type = val
      if (val === '0') {
        this.editForm.part_ds = ''
        this.editForm.part_hour = ''
        this.editForm.part_hour_delay = '0'
      }
    },
    partDsChange(val) {
      if (this.editForm.part_type === '1' && this.editForm.part_ds) {
        this._sqlBackFill()
      }
    },
    partHourChange(val) {
      if (this.editForm.part_type === '1' && this.editForm.part_ds && this.editForm.part_hour ) {
        this._sqlBackFill()
      }
    },
    partHourDelayChange(val) {
      if (this.editForm.part_type === '1' && this.editForm.part_ds && this.editForm.part_hour && this.editForm.part_hour_delay) {
        this._sqlBackFill()
      }
    },
    async _sqlBackFill() {
      const params = {
        sql: this.editForm.sql_content,
        part_type: this.editForm.part_type,
        part_ds: this.editForm.part_ds,
        part_hour: this.editForm.part_hour,
        part_hour_delay: this.editForm.part_hour_delay
      }
      const res = await this.$simpleAsyncTo(sqlBackFill(params), '获取失败')
      if (res) {
        this.editForm.sql_content = res.data.sql_content
      }
    }
  }
}
</script>

<style lang="scss">
.dimension-edit {
  height: 100%;
  background-color: $grey7;
  .edit-content {
    padding: 0px 15px 10px;
    .basic-info-box {
      background-color: $grey10;
      padding: 10px;
    }
    .logic-box {
      background-color: $grey10;
      // padding:10px;
      .steps {
        display: flex;
        justify-content: center;
        font-size: 12px;
        // padding:10px;
        color: $grey4;
        border-bottom: 1px solid $grey5;
        .step {
          padding: 10px 5px;
          position: relative;
          .step-index {
            display: inline-block;
            margin-right: 3px;
            width: 14px;
            height: 14px;
            line-height: 12px;
            text-align: center;
            border: 1px solid $grey4;
            border-radius: 50%;
          }
          &.active {
            color: $grey1;
            &:before {
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              border: 6px solid transparent;
              border-bottom-color: $grey5;
            }
            &:after {
              content: '';
              position: absolute;
              bottom: -1px;
              left: calc(50% + 1px);
              border: 5px solid transparent;
              border-bottom-color: $grey8;
            }
            .step-index {
              color: $grey10;
              background-color: $--color-primary;
              border-color: $--color-primary;
            }
          }
          &.finish {
            color: $grey1;
          }
        }
        .step-line {
          width: 30%;
          height: 20px;
          border-bottom: 1px dashed $grey3;
        }
      }
      .type-box {
        padding: 40px 0 15px;
        .select-box {
          display: flex;
          justify-content: center;
          // padding:40px 0 15px;
          .item {
            width: 120px;
            // height:120px;
            &:not(:last-child) {
              margin-right: 10px;
            }
            &:hover {
              opacity: 0.8;
              cursor: pointer;
            }
            img {
              width: 100%;
              height: 100px;
            }
            .label {
              line-height: 20px;
              font-size: 12px;
              text-align: center;
            }
          }
        }
      }
      .pk-box {
        padding: 15px;
        .simple-box {
          .toolbar {
            height: 36px;
            background-color: $grey7;
            border-radius: 6px 6px 0 0;
            font-size: 12px;
            .toolbar-item {
              line-height: 36px;
              float: left;
              padding: 0 12px;
              color: $grey3;
              &:hover {
                // background-color:$grey8;
                opacity: 0.8;
                cursor: pointer;
              }
            }
          }
        }
        .enum-box {
          font-size: 12px;
          .promt-info {
            height: 36px;
            line-height: 36px;
            color: $grey3;
            background-color: $grey7;
            padding: 0 10px;
            border-radius: 6px 6px 0 0;
          }
          .arrow-right-btn {
            padding: 0 16px;
            align-self: center;
          }
          .layout-box {
            width: calc(50% - 30px);
          }
        }
      }
    }
    .el-form-item.cus-form-item {
      .el-form-item__error {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
