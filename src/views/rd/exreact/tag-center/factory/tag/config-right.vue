<template>
  <div class="tag-config-wrapper-right">
    <div class="factory-label-step1-right-container">
      <div class="config-setting-steps">
        <div class="config-setting-steps-wrapper">
          <div
            :class="[
              'config-setting-step-item',
              {
                'is-active': activeStep === 1,
                'is-finished': activeStep !== 1
              }
            ]"
          >
            <i
              :class="
                activeStep === 1 ? 'iconfont icon-1' : 'el-icon-success'
              "
            ></i>
            <div>
              <p>数据来源配置</p>
              <p class="label">圈选用户行为数据</p>
            </div>
          </div>
          <div class="config-setting-step-line"></div>
          <div
            :class="[
              'config-setting-step-item',
              {'is-active': activeStep === 2}
            ]"
          >
            <i class="iconfont icon-2"></i>
            <div>
              <p>数据来源配置</p>
              <p class="label">基于圈选的用户行为数据定义标签值</p>
            </div>
          </div>
        </div>
      </div>
      <div class="label-form-wrapper">
        <el-form ref="form" label-width="80px" class="form" v-if="activeStep === 1">
          <div class="right-part-form-wrapper">
            <div class="config-title mb-10">
              <span class="error">*</span>
              数据来源-行为筛选
            </div>
            <div class="behavior-fliter-content">
              <div class="factory-label-step-wrapper mb-20">
                <div class="left-part">
                  <div class="step-header-number">1</div>
                  <div class="step-config-line"></div>
                </div>
                <div class="right-part mb-15">
                  <div class="config-title mb-10">
                    <span class="error mr-5">*</span>
                    按行为域筛选
                  </div>
                  <div :class="{'required':true, 'active':isDomainRequied}">
                    <CheckBox :data="domainList" @select="selectDomainHandle"></CheckBox>
                    <span class="required-text" v-if="isDomainRequied">必填项</span>
                  </div>
                </div>
              </div>

              <div class="factory-label-step-wrapper mb-20">
                <div class="left-part">
                  <div class="step-header-number">2</div>
                  <div class="step-config-line"></div>
                </div>
                <div class="right-part mb-15">
                  <div class="config-title mb-10">
                    <span class="error mr-5">*</span>
                    <el-select
                      v-model="actionAndActObj"
                      placeholder="请选择"
                      class="bus-select"
                      popper-class="bus-select-option"
                      @change="changeActionAndActObj"
                      :disabled="isAddOrEdit==='edit'">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                      </el-option>
                    </el-select>
                    <span class="label">（下方展示行为域-业务线）</span>
                  </div>
                  <div :class="{'required':true, 'active':isActRequied}">
                    <span class="required-text" v-if="isActRequied">必填项</span>
                    <div class="group-item" v-for="item in actObj" :key="item.bf_name">
                      <p class="mb-5">行为域：{{item.bf_name}}</p>
                      <div v-for="subItem in item.busiFieldData" :key="subItem.busi_id">
                        <p class="mb-5 bus">业务线：{{subItem.busi_name}}</p>
                        <template v-if="actionAndActObj === '0'">
                          <CheckBox :data="subItem.actObjectData" @select="selectActHandle"></CheckBox>
                        </template>
                        <template v-if="actionAndActObj === '1'">
                          <CheckBox :data="subItem.actBehaviorData" @select="selectActHandle"></CheckBox>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="factory-label-step-wrapper mb-20" v-if="actionAndActObj === '0'">
                <div class="left-part">
                  <div class="step-header-number">3</div>
                  <div class="step-config-line"></div>
                </div>
                <div class="right-part mb-15">
                  <div class="config-title mb-10">
                    <!-- <span class="error mr-5">*</span> -->
                    按共有属性筛选
                    <i class="el-icon-warning-outline label"></i>
                    <span class="label">（非必选，最多选择3个）</span>
                  </div>
                  <CheckBox :data="sameObjectAttr" @select="selectsameObjectAttrHandle" :max="3"></CheckBox>
                  <SameObjectAttr :data="currentSameObjAttr" ref="sameObjectAttr"></SameObjectAttr>
                </div>
              </div>

            </div>

            <div class="config-title mb-10">
              <span class="error">*</span>
              数据来源-时间跨度
            </div>
            <div class="behavior-fliter-content">
              <div class="config-title mb-10">
                <span class="mr-5">时间跨度</span>
                <el-select v-model="spanDay" placeholder="请选择" class="bus-select" popper-class="bus-select-option">
                  <el-option
                    v-for="item in spanDayOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
                <span class="label">（将基于所选时间跨度内的行为数据生产标签）</span>
              </div>
            </div>
          </div>
        </el-form>
        <el-form ref="form" label-width="80px" class="form" v-if="activeStep === 2">
          <div class="right-part-form-wrapper">
            <div class="config-title mb-10">
              <span class="error">*</span>
              标签值-打标方式
            </div>
            <div class="behavior-fliter-content">
              <div class="config-title mb-10">
                <span class="mr-5">打标方式</span>
                <el-select
                  v-model="labeling_mode"
                  placeholder="请选择打标方式"
                  class="bus-select"
                  popper-class="bus-select-option">
                  <!-- <el-option
                    v-for="item in labelingModeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="actionAndActObj==='0'"
                    >
                  </el-option> -->
                  <el-option
                    label="直接打标"
                    value="0"
                    :disabled="actionAndActObj==='1'"
                    >
                  </el-option>
                  <el-option
                    label="对象属性映射打标"
                    value="1"
                    :disabled="!(sameObjectAttr && sameObjectAttr.length) && actionAndActObj === '0'"
                    >
                  </el-option>
                </el-select>
              </div>
            </div>

            <div v-if="labeling_mode === '0'">
              <div class="config-title mb-10">
                <span class="error">*</span>
                标签值配置-标签值定义
              </div>
              <div class="behavior-fliter-content">
              <div class="config-title mb-10">
                <span class="mr-5">标签值定义</span>
                <div style="width:58%;display:inline-block" class="required">
                  <el-input
                    v-model="label_value"
                    placeholder="请输入标签值"
                    :class="['bus-select', islabelValue ? 'active' : '']"
                    style="width:260px" @input="inputLabelValue"></el-input>
                  <p class="required-text" v-if="islabelValue">必填项</p>
                </div>
              </div>
            </div>
            </div>

            <div v-if="labeling_mode === '1'">
              <div class="object-property-content">
                <div class="tips-wrapper">
                  <div class="left-icon">
                    <i class="iconfont icon-tip"></i>
                    <span class="text">Tip</span>
                  </div>
                  <div class="labeling_mode"></div>
                  <div class="text-wrapper">
                    <div>1.每条行为数据仅命中1个标签值</div>
                    <div>2.同一条行为命中多条规则时，优先采用靠前的规则，因此属性选择顺序及映射规则顺序将影响每条行为返回的标签值</div>
                  </div>
                </div>
                <div class="behavior-fliter-content">
                  <div class="factory-label-step-wrapper mb-20">
                    <div class="left-part">
                      <div class="step-header-number">1</div>
                      <div class="step-config-line"></div>
                    </div>
                    <div class="right-part">
                      <div class="config-title mb-10">
                        <span class="error mr-5">*</span>
                        选择对象属性映射打标
                      </div>
                      <div :class="{'required':true, 'active': isSelectObjLabeling}">
                        <div class="config-title mb-10">
                          对象属性<span class="label">（最多选3个）</span>
                        </div>
                        <CheckBox :data="objectAttrCopy" :max="3" @select="selectObjectAttrHandle"></CheckBox>
                        <span class="required-text" v-if="isSelectObjLabeling">必填项</span>
                      </div>
                      <div class="field-distribution-histogram">
                        <div class="field-distribution-histogram-header">
                          <div class="title">属性值分布预览</div>
                          <div class="sortable-fields-wrapper">
                            <div class="sortable-fields">
                              <div class="sortable-fields-item mr-10" v-for="(item, index) in curObjectAttrCopy" :key="item.object_attr_code" @click.stop="selectItem(index)">
                                <i class="iconfont icon-sidebar-toggle-copy mr-5"></i>
                                <span :class="{'active':index === curIndex }">{{item.object_attr_name}}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style="height:280px" v-if="curObjectAttrCopy.length > 0">
                          <Echarts
                            class="chart"
                            autoresize
                            :option="getOptions()"
                            :init-options="{renderer: 'canvas'}"
                          ></Echarts>
                        </div>
                        <div v-else style="text-align:center;color:#ccc">暂无数据</div>
                      </div>
                    </div>
                  </div>

                  <div class="factory-label-step-wrapper mb-20">
                    <div class="left-part">
                      <div class="step-header-number">2</div>
                      <div class="step-config-line"></div>
                    </div>
                    <div class="right-part mb-15">
                      <div class="config-title mb-10" style="display:flex;">
                        <span class="error mr-5">*</span>
                        选择映射方式
                        <div class="ml-10" style="display:flex;" v-if="curObjectAttrCopy.length > 0">
                          <div class="sortable-fields-item mr-10" v-for="(item,index) in curObjectAttrCopy" :key="item.object_attr_code" @click.stop="selectItem(index)">
                            <i class="iconfont icon-sidebar-toggle-copy mr-5"></i>
                            <span :class="{'active':index === curIndex }">{{item.object_attr_name}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="" v-if="curObjectAttrCopy.length > 0">
                        <div  v-for="(item,index) in selectMapingModeConfig" :key="item.object_attr_code">
                          <el-radio-group v-model="item.radio" class="mb-10" v-if="index === selectIndex" @change="$forceUpdate()">
                            <div class="config-title mb-10 mt-10 font-12" v-if="actionAndActObj === '0'">
                              第二权重信息<span class="label">（可选）</span>
                            </div>
                            <CheckBox
                              :data="item.secondWeightData"
                              :max="3"
                              @select="((val) => {selectSameBehaviorAttrHandle(val, item.secondWeightData)})"
                              v-if="actionAndActObj === '0'"
                              :isRadio="true" class="font-12"></CheckBox>
                            <el-radio label="0">属性值应用为标签值</el-radio>
                            <el-radio label="1">设计映射规则</el-radio>
                          </el-radio-group>
                          <div class="tag-rule-form" v-if="index === selectIndex && item.radio === '1'">
                            <div class="tag-rule-form-item">
                              <div class="tag-rule-form-item-content">
                                <div v-for="(subItem, subIndex) in item.rule_mapping" :key="subItem.level_rule" class="mb-10">
                                  <el-select v-model="subItem.operator_factor"
                                    placeholder="请选择"
                                    class="bus-select mr-10"
                                    popper-class="bus-select-option"
                                    style="width:100px"
                                    @change="((val) => changeRule(val, subItem))"
                                  >
                                    <el-option
                                      v-for="val in mappingRulesList"
                                      :key="val.operator_code"
                                      :label="val.operator_name"
                                      :value="val.operator_code"
                                      >
                                    </el-option>
                                  </el-select>
                                  <div style="width:180px;display:inline-block" v-if="!subItem.visible"></div>
                                  <el-input
                                    v-model="subItem.matching_value"
                                    placeholder="请输入关键字"
                                    class="bus-select" style="width:180px"
                                    v-if="subItem.visible"></el-input>
                                  <i class="el-icon-d-arrow-right font-16 mr-10 ml-10"></i>
                                  <el-input v-model="subItem.label_name" placeholder="请定义标签值" class="bus-select" style="width:180px"></el-input>
                                  <i class="el-icon-delete ml-10" v-if="subIndex > 0" style="cursor: pointer;" @click="item.rule_mapping.splice(subIndex, 1)"></i>
                                </div>
                              </div>
                            </div>
                            <div class="my-btn">
                              <el-button type="primary" icon="el-icon-plus" @click="addRules(item.rule_mapping)">新增规则</el-button>
                              {{item.rule_mapping.length}}/10
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </el-form>
        <div class="filter-result-preview-wrapper">
          <div class="filter-result-content">
            <div class="filter-result-footer">
              <el-button
                type="primary"
                @click="cancelConfig"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                @click="nextStep"
                v-if="activeStep === 1"
              >
                下一步
              </el-button>
              <el-button
                type="primary"
                @click="prevStep"
                v-if="activeStep === 2"
              >
                上一步
              </el-button>
              <el-button
                type="primary"
                @click="confirmConfig"
                v-if="activeStep === 2"
              >
                确定
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckBox from './check-box'
import SameObjectAttr from './same-object-attr'
import Echarts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent
} from 'echarts/components'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/title'
import { mapGetters } from 'vuex'
import {
  getBcFieldInfo,
  getBcActAndAttrInfo,
  getSameObjectAttr,
  getSpanDay,
  getMappingRules,
  getSameBehaviorAttr,
  labelConfiguration,
  queryLabelRuleConfigurationBySource
} from '@/api/rd/exreact/tag-center'
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent
])
export default {
  name: 'ConfigRight',
  props: {
    data: Object,
    isAddOrEdit: String,
    currentData: Object
  },
  components: {
    CheckBox,
    SameObjectAttr,
    Echarts
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      activeStep: 1,
      domainList: [],
      options: [
        {
          label: '按动作对象筛选',
          value: '0'
        },
        {
          label: '按动作行为属性筛选',
          value: '1'
        }
      ],
      actionAndActObj: '0',
      actObj: [],
      sameObjectAttr: [],
      objectAttrCopy: [],
      currentSameObjAttr: [],
      curObjectAttrCopy: [],
      spanDay: '1',
      spanDayOptions: [],
      curDomain: [],
      curActObject: [],
      isDomainRequied: false,
      isActRequied: false,
      allItems: [],
      labeling_mode: '0',
      labelingModeOptions: [
        {
          label: '直接打标',
          value: '0'
        },
        {
          label: '对象属性映射打标',
          value: '1'
        }
      ],
      label_value: '',
      curIndex: 0,
      selectIndex: 0,
      radio: '0',
      rulesObj: {},
      mappingRulesList: [],
      rules: '',
      sameBehaviorAttr: [],
      selectMapingModeConfig: [],
      src_filter: [],
      isSelectObjLabeling: false,
      islabelValue: false,
      editObject: {}
    }
  },
  watch: {
    curDomain: {
      deep: true,
      handler(val) {
        if (val.length !== 0) {
          this.isDomainRequied = false
        } else {
          this.isDomainRequied = true
        }
      }
    },
    curActObject: {
      deep: true,
      handler(val) {
        if (val.length !== 0) {
          this.isActRequied = false
        } else {
          this.isActRequied = true
        }
      }
    },
    curObjectAttrCopy: {
      deep: true,
      handler(val) {
        if (val.length !== 0) {
          this.isSelectObjLabeling = false
        } else {
          this.isSelectObjLabeling = true
        }
      }
    }
  },
  async created() {
    this._getSpanDay()
    await this._getMappingRules()
    if (this.isAddOrEdit === 'add') {
      this._getBcFieldInfo()
    } else {
      this._queryLabelRuleConfigurationBySource()
    }
  },
  methods: {
    nextStep() {
      if (this.curDomain.length === 0) {
        this.isDomainRequied = true
        return
      }
      if (this.curActObject.length === 0) {
        this.isActRequied = true
        return
      }
      if (this.actionAndActObj === '0') {
        if (this.$refs.sameObjectAttr.visible()) return
      }
      this.activeStep = 2
      if (this.actionAndActObj === '0') {
        this.src_filter = this.$refs.sameObjectAttr.getData()
        let data = JSON.parse(JSON.stringify(this.sameObjectAttr))
        data.forEach(item => {
          item.is_select = item.is_selected || false
          if (this.isAddOrEdit === 'add') {
            item.secondWeightData = JSON.parse(JSON.stringify(this.sameBehaviorAttr))
          } else {
            item.secondWeightData = item.secondWeightData.map(val => {
              return {
                behavior_attr: val.behavior_attr,
                behavior_attr_name: val.behavior_attr_name,
                name: val.behavior_attr_name,
                is_select: val.is_selected
              }
            })
          }
        })
        this.objectAttrCopy = data
      } else {
        this.labeling_mode = '1'
        let data = JSON.parse(JSON.stringify(this.curActObject))
        data.forEach(item => {
          item.is_select = item.is_selected || false
        })
        this.objectAttrCopy = data
      }
      // if (this.isAddOrEdit === 'add' && this.actionAndActObj === '0') {
      // }
      if (this.isAddOrEdit === 'edit' && this.editObject.publicData.labeling_mode === '1') {
        this.curObjectAttrCopy = this.objectAttrCopy.filter(item => item.is_select)
        this.selectMapingModeConfig = this.curObjectAttrCopy.map(item => {
          if (item.lcRuleMappingData && item.lcRuleMappingData.length > 0) {
            item.lcRuleMappingData = item.lcRuleMappingData.map(subItem => {
              let visible = true
              if (subItem.operator_factor === 'ALL') {
                visible = false
              }
              return {
                ...item,
                ...subItem,
                visible
              }
            })
          }
          return {
            ...item,
            radio: item.maping_mode,
            rule_mapping: item.lcRuleMappingData || []
          }
        })
        this.selectMapingModeConfig.forEach(item => {

        })
      }
    },
    prevStep() {
      this.activeStep = 1
      this.curObjectAttrCopy = []
      this.selectMapingModeConfig = []
    },
    async confirmConfig() {
      if (this.labeling_mode === '0') {
        if (this.label_value === '') {
          this.islabelValue = true
          return
        }
      } else {
        if (this.curObjectAttrCopy.length === 0) {
          this.isSelectObjLabeling = true
          return
        }
        const flag = this.selectMapingModeConfig.some(item => {
          if (item.radio === '1') {
            return item.rule_mapping.some(val => {
              return (val.visible && val.matching_value === '') || val.label_name === ''
            })
          }
        })
        if (flag) {
          return this.$message({
            type: 'error',
            message: '类目属性对应的映射规则填写不完整，请检查'
          })
        }
      }

      const ids = this.curActObject.map(item => {
        return item.behavior_id
      })
      const domainNames = this.curDomain.map(item => {
        return item.name
      })
      const actNames = this.curActObject.map(item => {
        return item.name
      })
      // const sameObjectNames = this.currentSameObjAttr.map(item => {
      //   return item.name
      // })
      let src_behavior_desc
      // if (this.actionAndActObj === '0') {
      //   src_behavior_desc = this.mapString([domainNames, actNames, sameObjectNames])
      // } else {
      //   src_behavior_desc = this.mapString([domainNames, actNames])
      // }
      if (this.labeling_mode === '0' && this.actionAndActObj === '0') {
        src_behavior_desc = this.mapString([domainNames, actNames])
      } else {
        const sameObjectNames = this.curObjectAttrCopy.map(item => {
          return item.name
        })
        src_behavior_desc = this.mapString([domainNames, actNames, sameObjectNames])
      }
      let params = {
        behaviorIds: JSON.stringify(ids),
        project_id: this.project.project_id,
        project_name: this.project.project_name,
        business_field_id: this.project.business_field_id,
        business_field_name: this.project.business_field_name,
        span_day: this.spanDay,
        labeling_mode: this.labeling_mode,
        label_value: this.labeling_mode === '0' ? this.label_value : '',
        behavior_mode: this.actionAndActObj,
        label_id: this.data.id,
        label_table: this.data.label_table,
        src_behavior_desc,
        src_behavior_id: this.currentData.src_behavior_id || ''
      }
      if (this.actionAndActObj === '0') {
        const objectAttrFilter = this.src_filter.map((item, index) => {
          return {
            filter_order: index,
            object_attr_id: item.object_attr_id,
            object_attr_code: item.object_attr_code,
            object_attr_name: item.object_attr_name,
            operator_factor: item.rules,
            matching_value: item.keywords,
            attr_datatype: item.attr_datatype,
            filter_relation: item.filter_relation
          }
        })
        params.objectAttrFilter = JSON.stringify(objectAttrFilter)
        if (this.labeling_mode === '1') {
          const mapingMode = this.selectMapingModeConfig.map(item => {
            item.rule_mapping = item.rule_mapping && item.rule_mapping.map((subItem, index) => {
              // console.log(subItem)
              // subItem.level_rule = index
              // delete subItem.visible
              return {
                level_rule: index,
                operator_factor: subItem.operator_factor,
                matching_value: subItem.matching_value,
                label_name: subItem.label_name
              }
            })
            const behavior_second_weight = item.secondWeightData && item.secondWeightData.filter(item => item.is_select === true)
            return {
              object_attr_name: item.object_attr_name,
              maping_mode: item.radio,
              behavior_second_weight: behavior_second_weight && behavior_second_weight.length > 0
                ? behavior_second_weight[0].behavior_attr
                : '',
              object_attr_code: item.object_attr_code,
              rule_mapping: item.radio === '1' ? item.rule_mapping : []
            }
          })
          params.sameObjectProperties = JSON.stringify(mapingMode)
        } else {
          const mapingMode = this.currentSameObjAttr.map(item => {
            return {
              object_attr_code: item.object_attr_code,
              object_attr_name: item.object_attr_name
            }
          })
          params.sameObjectProperties = JSON.stringify(mapingMode)
        }
      } else {
        delete params.behaviorIds
        if (this.labeling_mode === '1') {
          const mapingMode = this.selectMapingModeConfig.map(item => {
            item.rule_mapping = item.rule_mapping && item.rule_mapping.map((subItem, index) => {
              return {
                level_rule: index,
                operator_factor: subItem.operator_factor,
                matching_value: subItem.matching_value,
                label_name: subItem.label_name
              }
            })
            return {
              object_attr_name: item.object_attr_name,
              maping_mode: item.radio,
              object_attr_code: item.object_attr_code,
              rule_mapping: item.radio === '1' ? item.rule_mapping : [],
              behavior_id: item.behavior_id
            }
          })
          params.behaviorProperties = JSON.stringify(mapingMode)
        } else {
          const mapingMode = this.curActObject.map(item => {
            return {
              object_attr_name: item.object_attr_name,
              behavior_id: item.behavior_id,
              object_attr_code: item.object_attr_code
            }
          })
          params.behaviorProperties = JSON.stringify(mapingMode)
        }
      }
      const res = await this.$simpleAsyncTo(labelConfiguration(params), '操作失败')
      if (res) {
        this.$emit('confirm', '1')
      }
    },
    // 编辑规则配置信息
    async _queryLabelRuleConfigurationBySource() {
      const params = {
        src_behavior_id: this.currentData.src_behavior_id,
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(queryLabelRuleConfigurationBySource(params), '获取数据失败')
      if (res) {
        this.editObject = res
        this.actionAndActObj = res.publicData.behavior_mode
        this.labeling_mode = res.publicData.labeling_mode
        this.spanDay = res.publicData.span_day
        this.label_value = res.publicData.label_value
        this.domainList = res.bcFieldData.map(item => {
          return {
            id: item.bf_id,
            name: item.bf_name,
            is_select: item.is_selected,
            bf_code: item.bf_code,
            bf_id: item.bf_id,
            bf_name: item.bf_name
          }
        })
        this.curDomain = this.domainList.filter(item => item.is_select)
        res.bcActAndAttrData.forEach(item => {
          item.busiFieldData.forEach(subItem => {
            subItem.actObjectData = subItem.actObjectData.map(grandson => {
              if (grandson.is_selected) {
                this.curActObject.push({
                  ...grandson,
                  is_select: grandson.is_selected || false,
                  name: grandson.act_object,
                  id: grandson.behavior_id
                })
              }
              return {
                ...grandson,
                is_select: grandson.is_selected || false,
                name: grandson.act_object,
                id: grandson.behavior_id
              }
            })
            subItem.actBehaviorData = subItem.actBehaviorData.map(grandson => {
              if (grandson.is_selected) {
                this.curActObject.push({
                  ...grandson,
                  is_select: grandson.is_selected || false,
                  name: grandson.act_behavior,
                  id: grandson.behavior_id
                })
              }
              return {
                ...grandson,
                is_select: grandson.is_selected || false,
                name: grandson.act_behavior,
                id: grandson.behavior_id
              }
            })
          })
        })
        this.actObj = res.bcActAndAttrData
        if (this.actionAndActObj === '0') {
          res.sameObjectAttrData = res.sameObjectAttrData.map(item => {
            return {
              is_select: false,
              id: item.object_attr_code,
              name: item.object_attr_name,
              ...item
            }
          })
          const objectAttrCodes = res.publicData.objectAttrFilterData.map(item => {
            return item.object_attr_code
          })
          res.sameObjectAttrData.forEach(item => {
            if (objectAttrCodes.includes(item.object_attr_code)) {
              item.is_select = true
            }
          })
          this.sameObjectAttr = res.sameObjectAttrData
          this.currentSameObjAttr = res.publicData.objectAttrFilterData.map(item => {
            return {
              ...item,
              id: item.object_attr_code,
              name: item.object_attr_name,
              rules: item.operator_factor,
              keywords: item.matching_value,
              visible: false
            }
          })
        }
      }
    },
    // 新增按行为域筛选
    async _getBcFieldInfo() {
      const res = await this.$simpleAsyncTo(getBcFieldInfo(), '获取数据失败')
      if (res) {
        let data = res.data
        data.forEach(item => {
          item.is_select = false
          item.id = item.bf_id
          item.name = item.bf_name
        })
        this.domainList = res.data
        if (this.domainList && this.domainList.length > 0) {
          this.domainList[0].is_select = true
          this.selectDomainHandle(this.domainList)
        }
      }
    },
    // 选中行为域
    selectDomainHandle(data) {
      const selectItems = data.filter(item => item.is_select === true)
      this.curDomain = selectItems
      const bcFieldDatas = selectItems.map(item => {
        return {
          bf_name: item.bf_name,
          bf_id: item.bf_id
        }
      })
      this._getBcActAndAttrInfo(bcFieldDatas)
    },
    // 选中对象属性
    selectActHandle(data) {
      this.currentSameObjAttr = []
      this.allItems = this.allItems.concat(data)
      this.allItems = Array.from(new Set(this.allItems))
      const selectItems = this.allItems.filter(item => item.is_select === true)
      this.curActObject = selectItems
      const ids = selectItems.map(item => {
        return item.behavior_id
      })
      if (this.actionAndActObj === '0') {
        this._getSameObjectAttr(ids)
        this._getSameBehaviorAttr(ids)
      }
    },
    // 动作对象||行为属性
    async _getBcActAndAttrInfo(data) {
      const params = {
        bcFieldDatas: JSON.stringify(data),
        project_id: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(getBcActAndAttrInfo(params), '获取数据失败')
      if (res) {
        this.addIsSelect(res.data)
        this.actObj = res.data
      }
    },
    // 选中共有属性
    selectsameObjectAttrHandle(data, handler) {
      let selectItems = data.filter(item => item.is_select === true)
      if (selectItems.length > 3) return
      selectItems.forEach(item => {
        item.rules = 'in'
        item.keywords = ''
        item.filter_relation = 'and'
        item.visible = false
      })
      this.currentSameObjAttr = selectItems
      if (handler === 'close') {
        this.$refs.sameObjectAttr.close(this.currentSameObjAttr)
      }
    },
    selectObjectAttrHandle(data) {
      const selectItems = data.filter(item => item.is_select === true)
      if (selectItems.length > 3) return
      this.curObjectAttrCopy = selectItems
      if (this.curObjectAttrCopy.length > 0) {
        this.selectMapingModeConfig = []
        this.curObjectAttrCopy.forEach(item => {
          // const index = this.selectMapingModeConfig.findIndex(val => item.object_attr_code === val.object_attr_code)
          // if (index === -1) {
          //   this.selectMapingModeConfig.push({
          //     ...item,
          //     radio: '0',
          //     rule_mapping: [
          //       {
          //         operator_factor: 'in',
          //         matching_value: '',
          //         label_name: '',
          //         visible: true
          //       }
          //     ]
          //   })
          // }
          this.selectMapingModeConfig.push({
            ...item,
            radio: item.radio || '0',
            rule_mapping: item.rule_mapping ||
            [
              {
                operator_factor: 'in',
                matching_value: '',
                label_name: '',
                visible: true
              }
            ]
          })
        })
        this.curIndex = 0
        this.selectIndex = 0
        // if (this.curIndex !== 0) {
        //   this.curIndex = this.selectMapingModeConfig.length
        // }
      } else {
        this.selectMapingModeConfig = []
      }
    },
    selectSameBehaviorAttrHandle(data, item) {
      // this.selectSameBehaviorAttr = data.filter(item => item.is_select === true)
    },
    // 共有属性对象筛选
    async _getSameObjectAttr(data) {
      const params = {
        behaviorIds: JSON.stringify(data)
      }
      const res = await this.$simpleAsyncTo(getSameObjectAttr(params), '获取数据失败')
      if (res) {
        res.data.forEach(item => {
          item.is_select = false
          item.id = item.object_attr_code
          item.name = item.object_attr_name
        })
        this.sameObjectAttr = res.data
      }
    },
    changeActionAndActObj(val) {
      this.curActObject = []
      this.actObj.forEach(item => {
        item.busiFieldData.forEach(subItem => {
          subItem.actObjectData.forEach(grandson => {
            grandson.is_select = false
          })
          subItem.actBehaviorData.forEach(grandson => {
            grandson.is_select = false
          })
        })
      })
      this.currentSameObjAttr = []
      this.curObjectAttrCopy = []
      this.selectMapingModeConfig = []
      this.objectAttrCopy = []
    },
    // 时间跨度
    async _getSpanDay() {
      const res = await this.$simpleAsyncTo(getSpanDay(), '获取数据失败')
      if (res) {
        this.spanDayOptions = res.data
      }
    },
    // 映射规则
    async _getMappingRules() {
      const res = await this.$simpleAsyncTo(getMappingRules(), '获取失败')
      if (res) {
        this.mappingRulesList = res.data
        this.mappingRulesList.forEach(item => {
          this.rulesObj[item.operator_code] = item.operator_name
        })
      }
    },
    // 第二权重信息
    async _getSameBehaviorAttr(data) {
      const params = {
        behaviorIds: JSON.stringify(data)
      }
      const res = await this.$simpleAsyncTo(getSameBehaviorAttr(params), '获取数据失败')
      if (res) {
        res.data.forEach(item => {
          item.is_select = false
          item.name = item.behavior_attr_name
          item.id = item.behavior_attr
        })
        this.sameBehaviorAttr = res.data
      }
    },
    // 新增规则
    addRules(data) {
      if (data.length >= 10) return
      data.push({
        operator_factor: 'in',
        matching_value: '',
        label_name: '',
        visible: true
      })
    },
    selectItem(index) {
      this.curIndex = index
      this.selectIndex = index
    },
    inputLabelValue(val) {
      if (val) {
        this.islabelValue = false
      } else {
        this.islabelValue = true
      }
    },
    addIsSelect(data) {
      data.forEach(item => {
        item.busiFieldData.forEach(subItem => {
          subItem.actObjectData.forEach(grandson => {
            grandson.is_select = false
            grandson.name = grandson.act_object
            grandson.id = grandson.behavior_id
          })
          subItem.actBehaviorData.forEach(grandson => {
            grandson.is_select = false
            grandson.name = grandson.act_behavior
            grandson.id = grandson.behavior_id
          })
        })
      })
    },
    cancelConfig() {
      this.$emit('cancel')
    },
    mapString(arr) {
      let sarr = [[]]
      for (let i = 0; i < arr.length; i++) {
        let tarr = []
        for (let j = 0; j < sarr.length; j++) {
          for (let k = 0; k < arr[i].length; k++) {
            tarr.push(sarr[j].concat(arr[i][k]))
          }
        }
        sarr = tarr
      }
      let a = sarr.map(item => {
        return item.join('-')
      })
      return a.join(' 或 ')
    },
    changeRule(val, item) {
      if (val === 'ALL') {
        item.visible = false
        item.label_name = ''
      } else {
        item.visible = true
        item.label_name = ''
      }
    },
    getOptions(xAxisData) {
      return {
        background: 'transparent',
        grid: {
          top: '20',
          right: '20',
          left: '80',
          bottom: '40' // 图表尺寸大小
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: [
          {
            name: '属性值',
            nameLocation: 'middle',
            nameTextStyle: {
              color: '#333',
              padding: [10, 0, 0, 0]
            },
            type: 'category',
            // data: xAxisData,
            data: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: '对象分布百分比',
            nameLocation: 'middle',
            nameTextStyle: {
              color: '#333',
              padding: [3, 4, 35, 4]
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#ddd'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#333'
              },
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: [40, 80, 50, 36, 30, 35, 40, 60],
            barWidth: '16px',
            itemStyle: {
              normal: {
                // color: this.$styleVars.tagColor,
                color: '#56C2FE'
              }
            },
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.tag-config-wrapper-right {
  .bus {
    color: rgba($color: #000000, $alpha: .6);
  }
  .required {
    border: 1px solid transparent;
    position: relative;
    &.active {
      border-color: #F15533;
    }
    .required-text {
      position: absolute;
      font-size: 12px;
      bottom: -15px;
      color: #F15533;
    }
  }
  $color: #0c4cff;

  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 678px;
  // width: 100%;
  background: #f8f8f8;
  overflow-y: auto;
  .factory-label-step1-right-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    .config-setting-steps {
      padding: 10px 0 15px;
      background: $grey10;
      border-bottom: 1px solid $grey6;
      &-wrapper {
        width: 75%;
        margin: 0 auto;
        display: flex;
        .config-setting-step-item {
          display: flex;
          font-size: 12px;
          position: relative;

          &.is-active {
            i {
              color: $--color-primary;
            }

            &:before {
              content: '';
              position: absolute;
              left: 50%;
              bottom: -16px;
              margin-left: -5px;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-bottom: 7px solid $grey6;
            }
            &:after {
              content: '';
              position: absolute;
              left: 50%;
              bottom: -17px;
              margin-left: -4px;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 6px solid $grey8;
            }
          }
          &.is-finished {
            i {
              color: $success;
            }
          }

          p {
            &:first-child {
              font-size: 13px;
            }
            &:last-child {
              margin-top: 5px;
              font-size: 12px;
            }
          }

          i {
            position: relative;
            top: 2px;
            margin-right: 6px;
            font-size: 16px;
            color: $grey5;
          }
        }
      }
    }
    .label-form-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      .form {
        flex: 1;
        margin-bottom: 50px;
        .right-part-form-wrapper {
          padding: 20px;
          .behavior-fliter-content {
            background: $grey10;
            padding: 12px 20px;
            margin-bottom: 15px;
            .factory-label-step-wrapper {
              display: flex;
              .left-part {
                padding-top: 2px;
                margin-right: 8px;
                .step-header-number {
                  width: 14px;
                  height: 14px;
                  line-height: 14px;
                  text-align: center;
                  background: #6ca0f5;
                  color: #fff;
                }
                .step-config-line {
                  display: flex;
                  height: calc(100% - 14px);
                  flex: 1;
                  margin: 0 6px;
                  border-left: 2px dotted $grey7;
                  position: relative;
                  top: 0px;

                  &:before {
                    content: '';
                    position: absolute;
                    left: -4.5px;
                    bottom: 0px;
                    width: 4px;
                    height: 4px;
                    background-color: $grey10;
                    border: 1.5px solid $grey7;
                    border-radius: 50%;
                  }
                }
              }
              .right-part {
                flex: 1;
              }
            }
          }
          .object-property-content {
            .tips-wrapper {
              display: flex;
              align-items: center;
              background: rgba(59,92,183,.1);
              color: rgba(0,0,0,.7);
              padding: 10px 20px;
              .left-icon {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-right: 10px;
                >i {
                  font-size: 16px;
                  height: 16px;
                  color: #3b5cb7;
                }
                .text {

                }
              }
              .labeling_mode {
                height: 40px;
                background: #d8d8d8;
                position: relative;
                top: -.06em;
                display: inline-block;
                width: 1px;
                // height: .9em;
                margin: 0 8px;
                vertical-align: middle;
              }
              .text-wrapper {
                background: rgba(59,92,183,.1);
                color: rgba(0,0,0,.7);
                padding: 10px 20px;
              }
            }
          }
        }
      }
      .filter-result-preview-wrapper {
        position: sticky;
        z-index: 10;
        bottom: 0;
        right: 10px;
        .filter-result-content {
          padding: 15px 20px 20px;
          background: #fff;
          box-shadow: 0 -1px 2px 1px rgba(0,0,0,.05);
          .filter-result-footer {
            text-align: right;
            margin-top: 15px;
          }
        }
      }
    }
    .field-distribution-histogram {
      min-height: 120px;
      background: #f7f7f9;
      padding: 20px 12px;
      margin-bottom: 15px;
      &-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .title {
          color: rgba(0,0,0,.4);
          margin-right: 20px;
        }
        .sortable-fields-wrapper {
          flex: 1;
          height: 18px;
          background: #fff;
          .sortable-fields {
            display: flex;
          }
        }
      }
    }
    .sortable-fields-item {
      >span {
        cursor: pointer;
        &.active {
          border-bottom: 2px solid #468cff;
        }
      }
    }
    .tag-rule-form {
      &-item {
        display: flex;
        align-items: center;
        max-width: 700px;
        &:first-child {
          margin-bottom: 8px;
        }
        &-content {
          // display: flex;
          // align-items: center;
          // flex: 1;
        }
      }
    }
  }
}
</style>
