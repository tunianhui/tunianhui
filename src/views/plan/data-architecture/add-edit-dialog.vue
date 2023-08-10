<template>
  <div class="add-edit-dialog">
    <el-dialog
      :title="title"
      :visible.sync="NewBuildProjectVisible"
      width="60%"
      @close="closeHandle"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-draggable="{
        trigger: '.el-dialog__header',
        body: '.el-dialog',
        recover: false,
      }"
    >
      <el-form
        :model="ProjectForm"
        label-width="120px"
        :rules="ProjectFormRules"
        ref="ProjectForm"
        label-suffix="："
      >
        <el-row>
          <el-col :span="4">
            <div class="l_text">
              <p>维度逻辑表：</p>
              <p>后缀-天表</p>
              <el-switch
                v-model="ProjectForm.dim_logic.on_off"
                active-text="开"
                inactive-text="关"
                active-value="on"
                inactive-value="off"
              >
              </el-switch>
              <p>
                <el-button
                  icon="el-icon-refresh-right"
                  :disabled="
                    !(
                      ProjectForm.dim_logic &&
                      ProjectForm.dim_logic.is_allow_edit
                    )
                      ? true
                      : ProjectForm.dim_logic &&
                        ProjectForm.dim_logic.on_off == 'on'
                      ? false
                      : true
                  "
                  @click="dimResetDefault"
                  >恢复默认</el-button
                >
              </p>
            </div>
            <div class="l_text">
              <p>事实逻辑表：</p>
              <p>主体域前缀</p>
              <el-switch
                v-model="ProjectForm.fct_logic.on_off"
                active-text="开"
                inactive-text="关"
                active-value="on"
                inactive-value="off"
              >
              </el-switch>
              <p>
                <el-button
                  icon="el-icon-refresh-right"
                  :disabled="
                    !(
                      ProjectForm.fct_logic &&
                      ProjectForm.fct_logic.is_allow_edit
                    )
                      ? true
                      : ProjectForm.fct_logic &&
                        ProjectForm.fct_logic.on_off == 'on'
                      ? false
                      : true
                  "
                  @click="fctResetDefault"
                  >恢复默认</el-button
                >
              </p>
            </div>
            <div class="l_text">
              <p>汇总逻辑表：</p>
              <p>后缀-天表</p>
              <el-switch
                v-model="ProjectForm.sum_logic.on_off"
                active-text="开"
                inactive-text="关"
                active-value="on"
                inactive-value="off"
              >
              </el-switch>
              <p>
                <el-button
                  icon="el-icon-refresh-right"
                  :disabled="
                    !(
                      ProjectForm.sum_logic &&
                      ProjectForm.sum_logic.is_allow_edit
                    )
                      ? true
                      : ProjectForm.sum_logic &&
                        ProjectForm.sum_logic.on_off == 'on'
                      ? false
                      : true
                  "
                  @click="sumResetDefault"
                  >恢复默认</el-button
                >
              </p>
            </div>
          </el-col>
          <el-col :span="20">
            <div>
              <div class="edit_text">
                <ul>
                  <li class="data-block">项目</li>
                  <li class="table-type-prefix">表类型前缀</li>
                  <li class="business-implication">
                    业务含义
                    <el-tooltip
                      class="item"
                      effect="dark"
                      placement="top-start"
                    >
                      <div slot="content">
                        普通维度逻辑表：取业务对象名；<br />层级维度逻辑表：取业务对象名，各层维度逻辑表会扩展拼接所在层级。暂仅支持天表；<br />枚举维度逻辑表：enum+业务对象名（建表时自定义该对象名）；<br />虚拟维度逻辑表：virtual+业务对象名（建表时自定义该对象名）。
                      </div>
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </li>
                  <li class="suffix">
                    <span
                      v-if="
                        ProjectForm.dim_logic &&
                        ProjectForm.dim_logic.on_off == 'on'
                      "
                      >后缀</span
                    >
                    <span v-else>后缀（天表不展示后缀）</span>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="普通及层级维度逻辑表按照时效类型增加如下后缀：df（天），hf（小时），mf（分钟）。'df'后缀需要在天表后缀开关开启时生效。枚举及虚拟维度逻辑表暂不支持后缀。"
                      placement="top-start"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
              <div class="edit_text1">
                <ul>
                  <li class="data-block">${项目}&nbsp;&nbsp;&nbsp;&nbsp;+.+</li>
                  <li class="table-type-prefix">
                    <span style="display: inline-block; width: 60%">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        placement="top-start"
                        v-if="!ProjectForm.dim_logic.is_allow_edit"
                      >
                        <div slot="content">
                          {{
                            this.ProjectForm.dim_logic &&
                            this.ProjectForm.dim_logic.warn_info
                          }}
                        </div>
                        <el-input
                          v-model="ProjectForm.dim_logic.table_prefix"
                          :disabled="
                            !(
                              ProjectForm.dim_logic &&
                              ProjectForm.dim_logic.is_allow_edit
                            )
                              ? true
                              : ProjectForm.dim_logic &&
                                ProjectForm.dim_logic.on_off == 'on'
                              ? false
                              : true
                          "
                        >
                        </el-input>
                      </el-tooltip>
                      <el-input
                        v-else
                        v-model="ProjectForm.dim_logic.table_prefix"
                        :disabled="
                          !(
                            ProjectForm.dim_logic &&
                            ProjectForm.dim_logic.is_allow_edit
                          )
                            ? true
                            : ProjectForm.dim_logic &&
                              ProjectForm.dim_logic.on_off == 'on'
                            ? false
                            : true
                        "
                      >
                      </el-input>
                    </span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+</span>
                  </li>
                  <li class="business-implication">
                    _${自定义命名}&nbsp;&nbsp;&nbsp;&nbsp;+
                  </li>
                  <li class="suffix">_${时效分区标识}</li>
                </ul>
              </div>
              <div class="line"></div>
              <div class="edit_top">
                <p>效果实例：项目 ld_demo，业务对象 member</p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.dim_logic.table_prefix }}</span
                  >
                  member<span
                    v-if="
                      ProjectForm.dim_logic &&
                      ProjectForm.dim_logic.on_off == 'on'
                    "
                    >_df</span
                  >
                  --普通维度透辑表
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.dim_logic.table_prefix }}</span
                  >member_lvl1<span
                    v-if="
                      ProjectForm.dim_logic &&
                      ProjectForm.dim_logic.on_off == 'on'
                    "
                    >_df</span
                  >
                  --层级维度逻辑表-一级维度
                </p>
                <p>特殊情况：层级/枚举/虚拟维度逻辑表存在系统命名场景</p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.dim_logic.table_prefix }}</span
                  >_enum_member<span
                    v-if="
                      ProjectForm.dim_logic &&
                      ProjectForm.dim_logic.on_off == 'on'
                    "
                    >_df</span
                  >
                  --枚举维度逻银表
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.dim_logic.table_prefix }}</span
                  >_virtual_member<span
                    v-if="
                      ProjectForm.dim_logic &&
                      ProjectForm.dim_logic.on_off == 'on'
                    "
                    >_df</span
                  >
                  --拟维度逻辑表
                </p>
              </div>
            </div>
            <div style="margin-top: 40px; margin-bottom: 50px">
              <div class="edit_text">
                <ul>
                  <li class="data-block">项目</li>
                  <li class="table-type-prefix">表类型前缀</li>
                  <li class="business-implication">
                    业务含义(自动拼接，可自定义)
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="默认拼接 “业务活动”，开启主题域前缀时，默认拼接 “主题域_业务活动”，支持修改为自定义内容。"
                      placement="top-start"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </li>
                  <li class="suffix">
                    后缀
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="事务型：di（天增量），hi（小时增量），mi（分钟增量），thi（零点到当前小时增量），tmi（零点到当前分钟增量）；周期快照：df（天全量），hf（小时全量），mf（分钟）；累积快照：da（累积全量）。"
                      placement="top-start"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
              <div class="edit_text1">
                <ul>
                  <li class="data-block">${项目}&nbsp;&nbsp;&nbsp;&nbsp;+.+</li>
                  <li class="table-type-prefix">
                    <span style="display: inline-block; width: 60%">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        placement="top-start"
                        v-if="!ProjectForm.fct_logic.is_allow_edit"
                      >
                        <div slot="content">
                          {{
                            this.ProjectForm.fct_logic &&
                            this.ProjectForm.fct_logic.warn_info
                          }}
                        </div>
                        <el-input
                          v-model="ProjectForm.fct_logic.table_prefix"
                          :disabled="
                            !(
                              ProjectForm.fct_logic &&
                              ProjectForm.fct_logic.is_allow_edit
                            )
                              ? true
                              : ProjectForm.fct_logic &&
                                ProjectForm.fct_logic.on_off == 'on'
                              ? false
                              : true
                          "
                        >
                        </el-input>
                      </el-tooltip>
                      <el-input
                        v-else
                        v-model="ProjectForm.fct_logic.table_prefix"
                        :disabled="
                          !(
                            ProjectForm.fct_logic &&
                            ProjectForm.fct_logic.is_allow_edit
                          )
                            ? true
                            : ProjectForm.fct_logic &&
                              ProjectForm.fct_logic.on_off == 'on'
                            ? false
                            : true
                        "
                      >
                      </el-input>
                    </span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+</span>
                  </li>
                  <li class="business-implication">
                    <span
                      v-if="
                        ProjectForm.fct_logic &&
                        ProjectForm.fct_logic.on_off == 'on'
                      "
                      >${主题域前缀}</span
                    >_${业务活动}_${自定义命名}&nbsp;&nbsp;&nbsp;&nbsp;+
                  </li>
                  <li class="suffix">_${时效分区标识}</li>
                </ul>
              </div>
              <div class="line"></div>
              <div class="edit_top">
                <p>
                  效果实例：项目 ld_demo，主题域缩写 trd，业务活动
                  order，天事务表
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.fct_logic.table_prefix }}</span
                  ><span
                    v-if="
                      ProjectForm.fct_logic &&
                      ProjectForm.fct_logic.on_off == 'on'
                    "
                    >_trd</span
                  >_order_di
                </p>
              </div>
            </div>
            <div>
              <div class="edit_text">
                <ul>
                  <li class="data-block">项目</li>
                  <li class="table-type-prefix">
                    表类型前缀
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="特殊设置情况下，会生成应用层的汇总逻辑表，前缀与应用表相同"
                      placement="top-start"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </li>
                  <li class="business-implication">
                    业务含义(自动拼接，可自定义)
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="默认以下划线拼接统计粒度中涉及维度逻辑表的 “业务对象”。如统计粒度为全站，则为“ALL”。支持修改为自定义内容。特殊设置情况下，业务对象后，会以下划线拼接主题域名。"
                      placement="top-start"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </li>
                  <li class="suffix">
                    <span
                      v-if="
                        ProjectForm.sum_logic &&
                        ProjectForm.sum_logic.on_off == 'on'
                      "
                      >后缀</span
                    >
                    <span v-else>后缀（天表不展示后缀）</span>
                  </li>
                </ul>
              </div>
              <div class="edit_text1">
                <ul>
                  <li class="data-block">${项目}&nbsp;&nbsp;&nbsp;&nbsp;+.+</li>
                  <li class="table-type-prefix">
                    <span style="display: inline-block; width: 60%">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        placement="top-start"
                        v-if="!ProjectForm.sum_logic.is_allow_edit"
                      >
                        <div slot="content">
                          {{
                            this.ProjectForm.sum_logic &&
                            this.ProjectForm.sum_logic.warn_info
                          }}
                        </div>
                        <el-input
                          v-model="ProjectForm.sum_logic.table_prefix"
                          :disabled="
                            !(
                              ProjectForm.sum_logic &&
                              ProjectForm.sum_logic.is_allow_edit
                            )
                              ? true
                              : ProjectForm.sum_logic &&
                                ProjectForm.sum_logic.on_off == 'on'
                              ? false
                              : true
                          "
                        >
                        </el-input>
                      </el-tooltip>
                      <el-input
                        v-else
                        v-model="ProjectForm.sum_logic.table_prefix"
                        :disabled="
                          !(
                            ProjectForm.sum_logic &&
                            ProjectForm.sum_logic.is_allow_edit
                          )
                            ? true
                            : ProjectForm.sum_logic &&
                              ProjectForm.sum_logic.on_off == 'on'
                            ? false
                            : true
                        "
                      >
                      </el-input>
                    </span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+</span>
                  </li>
                  <li class="business-implication">
                    _${统计粒度}_${自定义命名}&nbsp;&nbsp;&nbsp;&nbsp;+
                  </li>
                  <li class="suffix">_${时效分区标识}</li>
                </ul>
              </div>
              <div class="line"></div>
              <div class="edit_top">
                <p>
                  效果实例： 项目ld_demo，统计粒度涉及业务对象
                  member、item，生成指标归属用户分析
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.sum_logic.table_prefix }}</span
                  >_member_item
                  <span
                    v-if="
                      ProjectForm.sum_logic &&
                      ProjectForm.sum_logic.on_off == 'on'
                    "
                    >_dd</span
                  >
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >{{ ProjectForm.sum_logic.table_prefix }}</span
                  >_all<span
                    v-if="
                      ProjectForm.sum_logic &&
                      ProjectForm.sum_logic.on_off == 'on'
                    "
                    >_dd</span
                  >
                  --全站统计
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ld_demo.<span
                    style="color: #468cff"
                    >adm</span
                  >_member_item_customeranalysis
                  <span
                    v-if="
                      ProjectForm.sum_logic &&
                      ProjectForm.sum_logic.on_off == 'on'
                    "
                    >_dd</span
                  >
                  -特殊场景
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import OverflowTooltip from '@c/overflow-tooltip'
import {
  getSourceListType,
  getListBusiness,
  getDataSource,
  newBuildProject,
  editProject,
  getSpaceTypeList,
} from '@/api/plan/project-manage'
import {editTableNameRule} from '@/api/plan/data-architecture'
import _ from 'lodash'

// import {mapGetters} from 'vuex'
export default {
  name: 'AddEditDialog',
  props: {
    projectData: {
      type: Object,
    },
    businId: {
      type: String,
      default: '',
    },
  },
  components: {
    // OverflowTooltip
  },
  computed: {
    // ...mapGetters(['project']),
  },
  // watch: {
  //   'ProjectForm.busin_id': {
  //     immediate: true,
  //     handler(val) {
  //       let a = this.busin_options.filter(e => {
  //         return val === e.busin_id
  //       })
  //       if (a.length) {
  //         this.busin_code = a[0].busin_code + '_'
  //         // this.ProjectForm.project_code = a[0].busin_code + '_'
  //       }
  //     }
  //   }
  // },
  data() {
    return {
      NewBuildProjectVisible: true,
      ProjectForm: this.resetProjectForm(),
      // engine_options: [], // 计算引擎列表
      // data_source_options: [], // 物理数据源
      // busin_options: [], // 业务板块列表
      // spaceType_options: [], // 空间类型类列表
      ProjectFormRules: {
        project_code: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母',
          },
        ],
        project_name: [
          {required: true, message: '请输入中文名称', trigger: 'blur'},
        ],
        engine_id: [
          {required: true, message: '请选择计算引擎源', trigger: 'change'},
        ],
        busin_id: [
          {required: true, message: '请选择业务模块', trigger: 'change'},
        ],
        space_type: [
          {required: true, message: '请选择空间类型', trigger: 'change'},
        ],
      },
      // is_disabled: false,
      title: null,
      busin_code: '',
      // field9: '1',
    }
  },
  created() {
    // this.getSourceList()
    // this.getBusinessList()
    // this.getDataSourceList()
    // this.getSpaceType()
    if (JSON.stringify(this.projectData) === '{}') {
      console.log(123)
      this.ProjectForm = this.resetProjectForm()
      // this.is_disabled = false
      this.title = '新建项目'
    } else {
      this.ProjectForm.dim_logic = _.cloneDeep(this.projectData.dim_logic)
      this.ProjectForm.fct_logic = _.cloneDeep(this.projectData.fct_logic)
      this.ProjectForm.sum_logic = _.cloneDeep(this.projectData.sum_logic)
      // this.ProjectForm.engine_id = this.projectData.engine_id
      // this.ProjectForm.busin_id = this.projectData.busin_id
      // this.ProjectForm.data_source_id = this.projectData.data_source_id
      // this.ProjectForm.space_type = this.projectData.space_type
      // this.is_disabled = true
      this.title = '编辑表命名规则'
    }
  },
  methods: {
    dimResetDefault() {
      this.ProjectForm.dim_logic.table_prefix =
        this.ProjectForm.dim_logic.table_prefix_default
    },
    fctResetDefault() {
      this.ProjectForm.fct_logic.table_prefix =
        this.ProjectForm.fct_logic.table_prefix_default
    },
    sumResetDefault() {
      this.ProjectForm.sum_logic.table_prefix =
        this.ProjectForm.sum_logic.table_prefix_default
    },
    // 提交表单
    async submitForm() {
      let {dim_logic, sum_logic, fct_logic} = this.ProjectForm
      let params = {
        busin_id: this.businId,
        dim_logic: JSON.stringify(dim_logic),
        sum_logic: JSON.stringify(sum_logic),
        fct_logic: JSON.stringify(fct_logic),
      }
      const res = await this.$simpleAsyncTo(editTableNameRule(params))
      if (res) {
        this.NewBuildProjectVisible = false
        this.$message({
          type: 'success',
          message: res.msg,
        })
        this.$emit('close', 'refresh')
      }
    },
    // 新建项目表单初始化
    resetProjectForm() {
      return {
        dim_logic: {},
        fct_logic: {},
        sum_logic: {},
        // engine_id: '',
        // busin_id: '',
        // data_source_id: [],
        // space_type: '',
      }
    },
    changeBusin(val) {
      // const obj = this.busin_options.find(item => item.busin_id === val)
      // this.busin_code = obj.busin_code + '_'
    },
    // 初始化引擎源列表
    // async getSourceList() {
    //   const res = await this.$simpleAsyncTo(
    //     getSourceListType(),
    //     '获取计算引擎源失败'
    //   )
    //   if (res) {
    //     this.engine_options = res.data
    //   }
    // },
    // 获取物理数据源列表
    // async getDataSourceList() {
    //   const res = await this.$simpleAsyncTo(
    //     getDataSource(),
    //     '获取物理数据源失败'
    //   )
    //   if (res) {
    //     this.data_source_options = res.data
    //   }
    // },
    // 获取业务板块列表
    // async getBusinessList() {
    //   const res = await this.$simpleAsyncTo(
    //     getListBusiness(),
    //     '获取业务板块失败'
    //   )
    //   if (res) {
    //     this.busin_options = res.data
    //   }
    // },
    // 获取空间类型
    // async getSpaceType() {
    //   const res = await this.$simpleAsyncTo(
    //     getSpaceTypeList(),
    //     '获取空间类型列表失败'
    //   )
    //   if (res) {
    //     this.spaceType_options = res.data.space_type
    //   }
    // },
    // 新建项目/信息设置
    // NewBuildProject(formName) {
    //   this.$refs[formName].validate(async (_) => {
    //     if (_) {
    //       this.globalLoading()
    //       if (JSON.stringify(this.projectData) === '{}') {
    //         // this.ProjectForm.project_code = this.busin_code + this.ProjectForm.project_code
    //         const res = await this.$simpleAsyncTo(
    //           newBuildProject(this.ProjectForm),
    //           '新建项目失败'
    //         )
    //         if (res) {
    //           this.$message({
    //             type: res.flag ? 'success' : 'error',
    //             message: res.msg,
    //           })
    //         }
    //       } else {
    //         const res = await this.$simpleAsyncTo(
    //           editProject({
    //             ...this.ProjectForm,
    //             project_id: this.projectData.id,
    //           }),
    //           '项目信息设置失败'
    //         )
    //         if (res) {
    //           this.$message({
    //             type: res.flag ? 'success' : 'error',
    //             message: res.msg,
    //           })
    //         }
    //       }
    //       this.closeHandle('refresh')
    //       this.globalLoading().close()
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // 关闭弹窗
    closeHandle(fn) {
      this.NewBuildProjectVisible = false
      if (fn !== 'refresh') {
        if (this.title === '新建项目') {
          this.$message('取消新建项目')
        } else {
          this.$message('取消编辑项目')
        }
      }
      this.$emit('close', fn)
    },
  },
}
</script>
<style lang="scss">
.add-edit-dialog {
  .edit_text ul {
    display: flex;
    flex-direction: row;
    li {
      line-height: 20px;
    }
    li.data-block {
      width: 25%;
    }
    li.table-type-prefix {
      width: 15%;
    }
    li.business-implication {
      width: 40%;
    }
    li.suffix {
      width: 20%;
    }
  }
  .edit_text1 ul {
    display: flex;
    flex-direction: row;
    li {
      font-weight: 400;
      color: #333;
    }
    li {
      line-height: 20px;
    }
    li.data-block {
      width: 25%;
    }
    li.table-type-prefix {
      width: 15%;
    }
    li.business-implication {
      width: 40%;
    }
    li.suffix {
      width: 20%;
    }
  }
  .edit_top p {
    line-height: 30px;
  }
  .l_text {
    height: 220px;
    border-right: 1px solid #d9d9d9;
    margin-right: 20px;
    p {
      line-height: 50px;
    }
  }
  .line {
    width: 100%;
    height: 0;
    border-top: 1px solid #d9d9d9;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
