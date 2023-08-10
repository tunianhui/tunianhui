<!--
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-02-16 16:09:58
 * @Description:
-->
<template>
  <TableEditLayout :tabs="tabs"
                   :buttons="btns">
    <div class="regular-edit">
      <div class="my-regular-detail-title">
        <div class="my-regular-detail">
          <div class="my-title-icon my-task-title">
            <i class="iconfont icon-hangweiguize1"></i>
            <div class="mt-10 font-12">行为规则</div>
          </div>
          <div class="my-description">
            <div>
              <span>{{data.name}}</span>
              <!-- <span>
                <i class="el-icon-warning"></i>
                <span>未<span @click="normalize">配置</span>归一Oneid</span>
              </span> -->
              <span v-if="currentData.isOpenOneId == '1'"
                    class="success">
                <i class="el-icon-success"></i>
                <span>已开启ID归一化</span>
              </span>
              <span v-if="currentData.isOpenOneId == '0'"
                    class="error">
                <i class="el-icon-warning"></i>
                <span>未开启ID归一化</span>
              </span>
            </div>
            <div>
              <span>行为规则ID ：<OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('行为规则ID ：')}px)`}">{{data.id}}</OverflowTooltip></span>
              <span><span>行为名称 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('行为名称 ：')}px)`}">{{currentData.baseName}}</OverflowTooltip>
              </span>
              <span><span>行为中心产出表 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('行为中心产出表 ：')}px)`}">{{currentData.produceTableCode}}</OverflowTooltip>
              </span>
              <span><span>业务板块 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('业务板块 ：')}px)`}">{{currentData.busiFieldName}}</OverflowTooltip>
              </span>
              <span><span>空间类型 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('空间类型 ：')}px)`}">{{currentData.spaceType}}</OverflowTooltip>
              </span>
              <span><span>所属项目 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('所属项目 ：')}px)`}">{{currentData.projectName}}</OverflowTooltip>
              </span>
              <span><span>行为域&业务线 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('行为域&业务线 ：')}px)`}">{{currentData.busiFiledName}}</OverflowTooltip>
              </span>
              <span><span>动作 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('动作 ：')}px)`}">{{currentData.actName}}</OverflowTooltip>
              </span>
              <span><span>对象 ：</span>
                <OverflowTooltip class="my-des-item"
                                 :style="{width: `calc(100% - ${getTextWidth('对象 ：')}px)`}">{{currentData.objectName}}</OverflowTooltip>
              </span>
            </div>
          </div>
        </div>
        <div class="space-between regular-edit-header mt-10">
          <span class="">规则配置</span>
          <div class="flex-layout">
            <el-checkbox v-model="visibleRequired">
              <span class="font-12 mr-15">仅显示必填项及已配置项</span>
            </el-checkbox>
            <span class="my-btn">
              <el-input class="bgc"
                        prefix-icon="el-icon-search"
                        v-model="keyword"
                        placeholder="请输入搜索关键字"></el-input>
            </span>
            <span class="my-btn">
              <el-button type="default"
                         class="ml-10 mr-10"
                         icon="el-icon-refresh-right"
                         @click="refresh"></el-button>
            </span>
            <!-- <span class="my-btn">
              <el-button type="primary" plain @click="normalize">
                ID归一化配置
                <el-tooltip class="item" effect="dark" content="若您有ID倒排表，建议先进行ID归一化配置并选择归一后的OneId作为ID原始值" placement="top-end">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </el-button>
            </span> -->
          </div>
        </div>
      </div>
      <el-table class="group-table my-group-table"
                :data="tableData"
                :border="false"
                :default-expand-all="true"
                :cell-class-name="setCellClass"
                :span-method="mergeColumn">
        <el-table-column type="expand"
                         width="1">
          <template slot-scope="scope">
            <div v-if="scope.row.row_type==='main'"
                 class="flex-layout"
                 style="align-items: center;">
              <el-table ref="mainTable"
                        :show-header="false"
                        :data="scope.row.regularValues"
                        :span-method="(({ row, column, rowIndex, columnIndex }) => objectSpanMethod({ row, column, rowIndex, columnIndex }, spanArr0))"
                        style="width: 100%;background:#fff"
                        class="my-sub-group-table">
                <el-table-column width="220px"
                                 prop="id"
                                 label="ID">
                  <template>
                    <div class="cell-content flex-layout">
                      <i class="iconfont icon-hangweizhuti font-18 green"></i>
                      <div class="ml-10">
                        <p>{{ 'ID原始值' }}</p>
                        <p class="label">
                          <OverflowTooltip>{{ '包含id_type,id_person_ids' }}</OverflowTooltip>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="行为规则值">
                  <template slot-scope="subscope">
                    <div class="my-xingwei">
                      <div class="my-xingwei-content">
                        <div class="my-xingwei-left">
                          <p class="my-xingwei-item-label">ID_Type</p>
                          <el-select v-model="subscope.row.idType"
                                     placeholder="请选择">
                            <el-option v-for="item in idTypeOptions"
                                       :key="item.idType"
                                       :label="item.idType"
                                       :value="item.idType">
                            </el-option>
                          </el-select>
                        </div>
                        <div class="mr-10 ml-10"
                             style="color:#ccc">:</div>
                        <div class="my-xingwei-right">
                          <p class="my-xingwei-item-label">ID_Value</p>
                          <el-select v-model="subscope.row.idValue"
                                     placeholder="请选择">
                            <el-option v-for="item in fieldsOptions"
                                       :key="item.element_id"
                                       :label="item.element_code"
                                       :value="item.element_code">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                                 width="100px"
                                 prop="dataType"
                                 label="数据类型">
                </el-table-column>
                <el-table-column label="操作"
                                 align="right"
                                 width="300px">
                  <template slot-scope="subscope">
                    <el-button type="text"
                               icon="el-icon-delete"
                               v-if="scope.row.regularValues.length > 1"
                               @click="scope.row.regularValues.splice(subscope.$index, 1)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="scope.row.row_type==='object'">
              <el-table :show-header="false"
                        :data="scope.row.regularValues"
                        style="width: 100%;background:#fff"
                        class="my-sub-group-table">
                <el-table-column width="220px"
                                 prop="id"
                                 label="ID">
                  <template slot-scope="subscope">
                    <div class="cell-content flex-layout">
                      <i class="iconfont icon-duixiang1 font-18 green"></i>
                      <div class="ml-10">
                        <p>{{ subscope.row.name }}</p>
                        <p class="label">
                          <OverflowTooltip>{{ subscope.row.code }}</OverflowTooltip>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="行为规则值">
                  <template slot-scope="subscope">
                    <div class="my-xingwei"
                         style="width:100%">
                      <div class="my-xingwei-content"
                           style="width:100%">
                        <div class="my-xingwei-left"
                             style="width:100%">
                          <p class="my-xingwei-item-label">{{subscope.row.label}}</p>
                          <!-- <el-select v-model="subscope.row.value" placeholder="请选择" style="width:100%" @change="(val) => {attrValueChange2(val, subscope.row)}">
                              <el-option
                                v-for="item in fieldsOptions"
                                :key="item.element_id"
                                :label="item.element_code"
                                :value="item.element_code">
                              </el-option>
                            </el-select> -->
                          <el-autocomplete class="inline-input"
                                           style="width:100%"
                                           v-model="subscope.row.value"
                                           :fetch-suggestions="querySearch"
                                           placeholder="请输入内容"
                                           @select="(val) => {attrValueChange2(val, subscope.row)}"
                                           value-key="element_code"
                                           @change="(val) => {objectChangeHandle(val, subscope.row)}"></el-autocomplete>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                                 width="100px"
                                 prop="type"
                                 label="数据类型">
                </el-table-column>
                <el-table-column label="操作"
                                 align="right"
                                 width="300px">
                </el-table-column>
              </el-table>
            </div>
            <div v-if="scope.row.row_type==='object_attr'">
              <el-table :show-header="false"
                        :data="scope.row.regularValues"
                        :span-method="(({ row, column, rowIndex, columnIndex }) => objectSpanMethod({ row, column, rowIndex, columnIndex }, spanArr))"
                        style="width: 100%;background:#fff"
                        class="my-sub-group-table">
                <el-table-column width="220px"
                                 prop="id"
                                 label="ID">
                  <template slot-scope="subscope">
                    <div class="cell-content flex-layout">
                      <i class="iconfont icon-duixiangshuxing1 font-18 green"></i>
                      <div class="ml-10">
                        <p>{{ subscope.row.name }}</p>
                        <p class="label">
                          <OverflowTooltip>{{ subscope.row.code }}</OverflowTooltip>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="行为规则值">
                  <template slot-scope="subscope">
                    <div class="my-xingwei">
                      <div class="my-xingwei-content">
                        <div class="my-xingwei-left">
                          <p class="my-xingwei-item-label">属性</p>
                          <el-select v-model="subscope.row.objectArrtId"
                                     placeholder="请选择">
                            <el-option v-for="item in objectAttrs"
                                       :key="item.id"
                                       :label="item.objectAttrName"
                                       :value="item.id">
                            </el-option>
                          </el-select>
                        </div>
                        <div class="mr-10 ml-10"
                             style="color:#ccc">:</div>
                        <div class="my-xingwei-right">
                          <p class="my-xingwei-item-label">属性值</p>
                          <el-select v-model="subscope.row.sourceAttr"
                                     placeholder="请选择"
                                     @change="(val) => {attrValueChange(val, subscope.row)}">
                            <el-option v-for="item in fieldsOptions"
                                       :key="item.element_id"
                                       :label="item.element_code"
                                       :value="item.element_code">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                                 width="100px"
                                 prop="attrDatatype"
                                 label="数据类型">
                </el-table-column>
                <el-table-column label="操作"
                                 align="right"
                                 width="300px">
                  <template slot-scope="subscope">
                    <el-button type="text"
                               icon="el-icon-delete"
                               v-if="scope.row.regularValues.length > 1"
                               @click="scope.row.regularValues.splice(subscope.$index, 1)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="scope.row.row_type==='behavior_attr'">
              <el-table :show-header="false"
                        :data="scope.row.regularValues"
                        :span-method="(({ row, column, rowIndex, columnIndex }) => objectSpanMethod({ row, column, rowIndex, columnIndex }, spanArr1))"
                        style="width: 100%;background:#fff"
                        class="my-sub-group-table">
                <el-table-column width="220px"
                                 prop="id"
                                 label="ID">
                  <template slot-scope="subscope">
                    <div class="cell-content flex-layout">
                      <i class="iconfont icon-hangweishuxing font-18 green"></i>
                      <div class="ml-10">
                        <p>{{ subscope.row.name }}</p>
                        <p class="label">
                          <OverflowTooltip>{{ subscope.row.code }}</OverflowTooltip>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="行为规则值">
                  <!-- <template slot-scope="subscope">
                      <div class="my-xingwei" style="width:100%">
                        <div class="my-xingwei-content" style="width:100%">
                          <div class="my-xingwei-left" style="width:100%">
                            <p class="my-xingwei-item-label">{{subscope.row.label}}</p>
                            <el-select v-model="subscope.row.value" placeholder="请选择" style="width:100%">
                              <el-option
                                v-for="item in fieldsOptions"
                                :key="item.element_id"
                                :label="item.element_code"
                                :value="item.element_id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                      </div>
                    </template> -->
                  <template slot-scope="subscope">
                    <div class="my-xingwei">
                      <div class="my-xingwei-content">
                        <div class="my-xingwei-left mr-10">
                          <p class="my-xingwei-item-label">属性描述</p>
                          <el-input v-model="subscope.row.behaviorAttrName"></el-input>
                        </div>
                        <div class="my-xingwei-left">
                          <p class="my-xingwei-item-label">属性</p>
                          <el-input v-model="subscope.row.behaviorAttr"></el-input>
                          <!-- <el-select v-model="subscope.row.behaviorAttr" placeholder="请选择">
                              <el-option
                                v-for="item in objectAttrs"
                                :key="item.id"
                                :label="item.objectAttrName"
                                :value="item.id">
                              </el-option>
                            </el-select> -->
                        </div>
                        <div class="mr-10 ml-10"
                             style="color:#ccc">:</div>
                        <div class="my-xingwei-right">
                          <p class="my-xingwei-item-label">属性值</p>
                          <el-select v-model="subscope.row.sourceAttr"
                                     placeholder="请选择"
                                     @change="(val) => {attrValueChange1(val, subscope.row)}">
                            <el-option v-for="item in fieldsOptions"
                                       :key="item.element_id"
                                       :label="item.element_code"
                                       :value="item.element_code">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                                 width="100px"
                                 prop="attrDatatype"
                                 label="数据类型">
                </el-table-column>
                <el-table-column label="操作"
                                 align="right"
                                 width="300px">
                  <template slot-scope="subscope">
                    <el-button type="text"
                               icon="el-icon-delete"
                               v-if="scope.row.regularValues.length > 1"
                               @click="scope.row.regularValues.splice(subscope.$index, 1)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="scope.row.row_type==='system'">
              <el-table :show-header="false"
                        :data="scope.row.regularValues"
                        style="width: 100%;background:#fff"
                        class="my-sub-group-table">
                <el-table-column width="220px"
                                 prop="id"
                                 label="ID">
                  <template slot-scope="subscope">
                    <div class="cell-content flex-layout">
                      <i class="iconfont icon-A2 font-18 green"></i>
                      <div class="ml-10">
                        <p>{{ subscope.row.name }}</p>
                        <!-- <p class="label">
                          <OverflowTooltip>{{ subscope.row.code }}</OverflowTooltip>
                        </p> -->
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="行为规则值">
                  <template>
                    <div class="my-xingwei"
                         style="width:100%">
                      业务日期分区，格式yyyymmdd
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                                 width="100px"
                                 prop="amount1"
                                 label="数据烈性">
                  <template>String</template>
                </el-table-column>
                <el-table-column prop="amount2"
                                 label="操作"
                                 align="right"
                                 width="300px">
                  <template>
                    <!-- <el-button type="text" icon="el-icon-delete"></el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行为规则信息"
                         width="220px">
          <template slot-scope="scope">
            <div>
              <i class="error font-18 v-middle"
                 v-if="scope.row.row_type!=='behavior_attr' && scope.row.row_type!=='system'">*</i>
              <span>{{scope.row.name}}</span>
              <el-tooltip class="item"
                          effect="dark"
                          content="可选择行为发生次数作为行为属性，暂不支持自定义添加"
                          placement="top">
                <i v-if="scope.row.tip"
                   class="el-icon-info mr-10 ml-10"
                   style="color:rgba(0,0,0,.6)"></i>
              </el-tooltip>
              <span>{{scope.row.content}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行为规则值"></el-table-column>
        <el-table-column label="数据类型"
                         width="100px"
                         header-align="center"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="right"
                         width="300px">
          <template slot-scope="scope">
            <div v-if="scope.row.row_type==='main'"
                 class="my-btn">
              <el-button type="primary"
                         plain
                         @click="idManage">
                ID类型管理
              </el-button>
              <el-button type="primary"
                         plain
                         icon="el-icon-plus"
                         @click="addMain(scope.row)">
                新建行为主体
              </el-button>
            </div>
            <div v-if="scope.row.row_type==='object_attr'"
                 class="my-btn">
              <el-button type="primary"
                         plain
                         @click="openObjectTable('OBJECTATTR')">
                对象属性管理
              </el-button>
              <el-button type="primary"
                         plain
                         icon="el-icon-plus"
                         @click="addObjectAttr(scope.row)">
                新增对象属性
              </el-button>
            </div>
            <div v-if="scope.row.row_type==='behavior_attr'"
                 class="my-btn">
              <el-button type="primary"
                         plain
                         icon="el-icon-plus"
                         @click="addBehaviorAttr(scope.row)">
                新增行为属性
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <SideModal :visible.sync="sideModelOption.visible"
               :title="sideModelOption.title"
               @confirm="sideModelOption.confirm">
      <component ref="sideComponent"
                 :is="sideModelOption.component"
                 :data="sideModelOption.data"></component>
    </SideModal>
    <NormalConfig v-if="normalConfigVisible"
                  @normalConfigClose="normalConfigClose"></NormalConfig>
    <IdTypeManage v-if="idTypeManageVisible"
                  @idTypeManageClose="idTypeManageClose"></IdTypeManage>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout'
import SideModal from '@c/side-modal'
import ScheduleConfig from './schedule-config'
import BehaviorRules from './behavior-rules'
import NormalConfig from './normal-config'
import IdTypeManage from './id-type-manage'
import PhysicalConfig from './physical-config'
import RulesVersion from './version'
import {
  queryDispatchById,
  dispatchEdit,
  // getIdNormalizeConfigList,
  getFidleList,
  getrulesinfo,
  saveRules,
  getIdTypeList,
  queryByIdRulesInfo,
  publish
} from '@/api/rd/exreact/regular'
import { getListAll } from '@/api/rd/exreact/object-attr'
import { types } from '@/config/rd-config'
import { loop, capitalize } from '@/libs/util'
import OverflowTooltip from '@c/overflow-tooltip'
import { mapGetters } from 'vuex'
import '@/assets/css/group-table.scss'

export default {
  name: 'RegularEdit',
  props: {
    data: Object
  },
  components: {
    SideModal,
    TableEditLayout,
    OverflowTooltip,
    NormalConfig,
    IdTypeManage
  },
  inject: ['tabStore', 'attrStore'],
  data () {
    return {
      tabs: [
        {
          label: '行为规则信息',
          title: '行为规则信息',
          handler: this.tabClick,
          confirm: this.behaviorRulesConfirm,
          component: BehaviorRules,
          data: {}
        },
        {
          label: '调度配置',
          title: '调度配置',
          handler: this.tabClick,
          confirm: this.opsConfirm,
          component: ScheduleConfig,
          // key: 'ops',
          data: {}
        },
        {
          label: '物理化配置',
          title: '物理化配置',
          handler: this.tabClick,
          confirm: this.opsConfirm,
          component: PhysicalConfig,
          // key: 'ops',
          data: {}
        },
        {
          label: '行为规则版本',
          title: '行为规则版本',
          handler: this.tabClick,
          confirm: this.opsConfirm,
          component: RulesVersion,
          // key: 'ops',
          data: {}
        }
      ],
      btns: [
        {
          icon: 'icon iconfont icon-baocun',
          handler: this.handleSave,
          // label: '保存',
          disabled: false,
          title: '保存'
        },
        {
          icon: 'icon iconfont icon-fabu',
          handler: this.handleRelease,
          disabled: false,
          title: '发布'
        },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      visibleRequired: false,
      keyword: '',
      form: {
        tableData: []
      },
      options: [],
      idTypeOptions: [],
      fieldsOptions: [],
      objectAttrs: [],
      tableData: [
        {
          row_type: 'main',
          name: '行为主体',
          ids: ['id_type', 'id_person_ids'],
          type: 'string',
          content: '',
          regularValues: [
            {
              idType: '',
              idValue: '',
              dataType: ''
            }
          ]
        },
        {
          head: true,
          name: '对象',
          row_type: 'object',
          tip: '',
          content: '至少填写1个，可选择表示对象ID或对象名称的来源字段以唯一标识对象',
          regularValues: [
            {
              name: '对象标识',
              code: 'object_id',
              type: '',
              label: '标识值',
              value: ''
            },
            {
              name: '对象名称',
              code: 'object_name',
              type: '',
              label: '对象名称',
              value: ''
            }
          ]
        },
        {
          name: '对象属性',
          code: 'object_properties',
          type: 'string',
          attr: 'ww',
          attr_value: 't',
          row_type: 'object_attr',
          tip: '',
          regularValues: []
        },
        {
          name: '行为属性',
          row_type: 'behavior_attr',
          code: 'rule_properties',
          icon: 'iconfont icon-hangweishuxing',
          tip: '可选择行为发生次数作为行为属性，暂不支持自定义添加',
          content: '用户行为的描述信息',
          regularValues: []
        },
        {
          name: '系统',
          row_type: 'system',
          icon: 'iconfont icon-A1',
          regularValues: [
            {
              name: 'ds',
              code: 'stat_count',
              type: 'bigint',
              label: '属性值',
              value: 3
            }
          ]
        }
      ],
      mainTableData: [],
      spanArr: [],
      pos: '',
      spanArr1: [],
      pos1: '',
      pos0: '',
      spanArr0: [],
      normalConfigVisible: false,
      idTypeManageVisible: false,
      currentData: {}
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  async created () {
    await this._queryByIdRulesInfo()
    this.tabs.forEach(item => {
      item.data = this.currentData
    })
    let filterMainArr = this.tableData.filter(e => e.row_type === 'main')
    if (filterMainArr && filterMainArr.length) {
      // this.getSpanArr(filterMainArr[0].regularValues)
    }
    this.$nextTick(async _ => {
      await this._getIdTypeList()
      await this.getFidleList()
      await this.getListAll()
      await this.getrulesIndo()
    })
  },
  async mounted () {
  },
  methods: {
    openObjectTable (type) {
      const key = 'exreact'
      this.$store.commit(`${key}/SET_ACTIVE`, types[type])
      this.tabStore.commit('add', {
        label: `${key === 'exreact' ? '萃取' : ''}对象页表页`,
        tabType: types.OBJECTTABLE,
        name: `${key}_${types.OBJECTTABLE}`, // tab页的标识
        component: `${capitalize(key)}ObjectTable`
      })
    },
    mergeColumn ({ row, column, rowIndex, columnIndex }) {
      if (row.block) {
        return columnIndex === 0 ? [1, 4] : [0, 0]
      } else if (row.head) {
        return columnIndex === 1 ? [1, 3] : columnIndex === 3 ? [1, 1] : [0, 0]
      } else {
        return [1, 1]
      }
    },
    setCellClass ({ row, column, rowIndex, columnIndex }) {
      if (row.block) {
        return 'is-center'
      } else if (row.head) {
        return 'group-column-head'
      } else {
        return ''
      }
    },
    idManage () {
      this.idTypeManageVisible = true
    },
    addMain (row) {
      row.regularValues.push({
        idValue: '',
        idType: '',
        id: row.baseId,
        name: 'ID原始值',
        code: 'main'
      })
      let filterMainArr = this.tableData.filter(e => e.row_type === 'main')
      if (filterMainArr && filterMainArr.length) {
        this.getSpanArr0(filterMainArr[0].regularValues)
      }
    },
    obejctAttrManage () {
    },
    addObjectAttr (row) {
      row.regularValues.push({
        name: '对象属性',
        code: 'object_properties',
        attrDatatype: '',
        sourceAttr: '',
        behaviorAttrName: ''
      })
      let filterMainArr = this.tableData.filter(e => e.row_type === 'object_attr')
      if (filterMainArr && filterMainArr.length) {
        this.getSpanArr(filterMainArr[0].regularValues)
      }
    },
    addBehaviorAttr (row) {
      row.regularValues.push({
        name: '行为属性',
        code: 'rule_properties',
        behaviorAttrName: '',
        behaviorAttr: '',
        sourceAttr: ''
      })
      let filterMainArr = this.tableData.filter(e => e.row_type === 'behavior_attr')
      if (filterMainArr && filterMainArr.length) {
        this.getSpanArr1(filterMainArr[0].regularValues)
      }
    },
    refresh () { },
    normalize () {
      this.normalConfigVisible = true
    },
    async tabClick (tab) {
      if (tab.title === this.sideModelOption.title) {
        this.sideModelOption.visible = !this.sideModelOption.visible
        return
      }
      if (tab.title === '调度配置') {
        await this.getScheduleData()
      }
      Object.assign(this.sideModelOption, tab, { visible: true })
    },
    async getScheduleData () {
      const res = await this.$simpleAsyncTo(
        queryDispatchById({ id: this.data.id }),
        '获取调度数据失败'
      )
      if (res) {
        this.tabs[1].data = res.data
      }
    },
    async opsConfirm () {
      const data = this.$refs.sideComponent.getData()
      if (data.job_cycle === '周' || data.job_cycle === '月') {
        if (data.choice_date === '' || data.choice_date === null) {
          return this.$message({
            type: 'warning',
            message: '请选择时间'
          })
        }
      }
      // this.loading++
      this.globalLoading()
      const res = await this.$simpleAsyncTo(
        dispatchEdit(data),
        '保存调度配置失败'
      )
      if (res) {
        this.sideModelOption.visible = false
        // Object.assign(this.tabs[1].data, data, {modified: true})
        this.$message({
          message: '保存调度配置成功',
          type: 'success'
        })
      }
      // this.loading--
      this.globalLoading().close()
    },
    // 获取ID原始值IDtype列表
    async _getIdTypeList () {
      const res = await this.$simpleAsyncTo(getIdTypeList(), '获取失败')
      if (res) {
        this.idTypeOptions = res.data
      }
    },
    // 获取表字段
    async getFidleList () {
      const res = await this.$simpleAsyncTo(getFidleList({ cubeId: this.data.cubeId || this.currentData.cubeId }), '获取失败')
      if (res) {
        this.fieldsOptions = res.data.objectAttrs
      }
    },
    // 对象属性
    async getListAll () {
      const res = await this.$simpleAsyncTo(getListAll(), '获取失败')
      if (res) {
        this.objectAttrs = res.data
      }
    },
    behaviorRulesConfirm () {
      this.sideModelOption.visible = false
    },
    async handleSave () {
      let mainData = this.tableData.filter(e => e.row_type === 'main')
      let objectData = this.tableData.filter(e => e.row_type === 'object')
      let objectAttrData = this.tableData.filter(e => e.row_type === 'object_attr')
      let behaviorAttrData = this.tableData.filter(e => e.row_type === 'behavior_attr')
      const objectAttrs = objectAttrData[0].regularValues.map(item => {
        return {
          id: item.id,
          behaviorAttr: item.behaviorAttr,
          sourceAttr: item.sourceAttr,
          attrDatatype: item.attrDatatype,
          behaviorAttrName: item.behaviorAttrName,
          objectArrtId: item.objectArrtId,
          objectAttrCode: item.objectAttrCode
        }
      })
      const ruleObjects = behaviorAttrData[0].regularValues.map(item => {
        return {
          id: item.id,
          objectArrtId: item.objectArrtId,
          objectAttrCode: item.objectAttrCode,
          sourceAttr: item.sourceAttr,
          attrDatatype: item.attrDatatype,
          behaviorAttrName: item.behaviorAttrName,
          behaviorAttr: item.behaviorAttr
        }
      })
      const actorAttrs = mainData[0].regularValues.map(item => {
        return {
          id: item.id,
          idType: item.idType,
          idValue: item.idValue
        }
      })
      let mainflag = mainData[0].regularValues.every(e => {
        return e.idType && e.idValue
      })
      let objectflag = objectData[0].regularValues.every(e => {
        return e.value
      })
      let objectAttrflag = objectAttrData[0].regularValues.every(e => {
        return e.sourceAttr && e.objectArrtId
      })
      let ruleObjectsflag = behaviorAttrData[0].regularValues.every(e => {
        return e.sourceAttr && e.behaviorAttrName && e.behaviorAttr
      })
      if (!mainflag) return this.$message({ type: 'error', message: '行为主体必填项配置不完整，无法保存' })
      if (!objectflag) return this.$message({ type: 'error', message: '对象必填项配置不完整，无法保存' })
      if (!objectAttrflag) return this.$message({ type: 'error', message: '对象属性必填项配置不完整，无法保存' })
      if (!ruleObjectsflag) return this.$message({ type: 'error', message: '行为属性必填项配置不完整，无法保存' })
      const params = {
        baseId: this.data.id,
        actorAttrs: JSON.stringify(actorAttrs),
        projectCode: this.project.project_id,
        obejctTag: objectData[0].regularValues[0].value,
        obejctTagType: objectData[0].regularValues[0].type,
        objectName: objectData[0].regularValues[1].value,
        objectNameType: objectData[0].regularValues[1].type,
        objectAttrs: JSON.stringify(objectAttrs),
        ruleObjects: JSON.stringify(ruleObjects)
      }
      const res = await this.$simpleAsyncTo(saveRules(params), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }
    },
    // 获取规则信息
    async getrulesIndo () {
      const params = {
        id: this.data.id
      }
      const res = await this.$simpleAsyncTo(getrulesinfo(params), '获取失败')
      if (res) {
        let mainData = this.tableData.filter(e => e.row_type === 'main')
        let objectData = this.tableData.filter(e => e.row_type === 'object')
        // 对象属性
        let objectAttrData = this.tableData.filter(e => e.row_type === 'object_attr')
        // 行为属性
        let behaviorAttr = this.tableData.filter(e => e.row_type === 'behavior_attr')
        let { objectTag, objectTagType, objectName, objectNameType, ruleObjects, objectAttrs, actorAttrs, baseId } = res.data
        objectData[0].regularValues[0].type = objectTagType
        objectData[0].regularValues[0].value = objectTag
        objectData[0].regularValues[1].type = objectNameType
        objectData[0].regularValues[1].value = objectName
        mainData[0].regularValues = actorAttrs
        mainData[0].baseId = baseId
        mainData[0].regularValues.forEach(e => {
          e.name = 'ID原始值'
          e.code = 'main',
            e.id = baseId
        })
        this.getSpanArr0(mainData[0].regularValues)
        objectAttrData[0].regularValues = ruleObjects
        objectAttrData[0].regularValues.forEach(e => {
          e.name = '对象属性'
          e.code = 'object_properties'
        })
        this.getSpanArr(objectAttrData[0].regularValues)
        behaviorAttr[0].regularValues = objectAttrs
        behaviorAttr[0].regularValues.forEach(item => {
          item.name = '行为属性'
          item.code = 'behavior_attr'
        })
        this.getSpanArr1(behaviorAttr[0].regularValues)
      }
    },
    locationHandle () {
      this.$router.push('/tag/workbench/behavior-center/behavior/regular')
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }, spanArr) {
      if (columnIndex === 0) {
        if (spanArr) {
          const _row = spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    getSpanArr0 (data) {
      this.spanArr0 = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr0.push(1)
          this.pos0 = 0
        } else {
          this.spanArr0[this.pos0] += 1
          this.spanArr0.push(0)
        }
      }
    },
    getSpanArr (data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          this.spanArr[this.pos] += 1
          this.spanArr.push(0)
        }
      }
    },
    getSpanArr1 (data) {
      this.spanArr1 = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr1.push(1)
          this.pos1 = 0
        } else {
          this.spanArr1[this.pos1] += 1
          this.spanArr1.push(0)
        }
      }
    },
    normalConfigClose () {
      this.normalConfigVisible = false
    },
    idTypeManageClose () {
      this.idTypeManageVisible = false
    },
    attrValueChange (val, row) {
      const data = this.fieldsOptions.filter(item => item.element_code === val)
      if (data && data.length > 0) {
        row.attrDatatype = data[0].element_type
      }
    },
    attrValueChange1 (val, row) {
      const data = this.fieldsOptions.filter(item => item.element_code === val)
      if (data && data.length > 0) {
        row.attrDatatype = data[0].element_type
      }
    },
    attrValueChange2 (val, row) {
      const data = this.fieldsOptions.filter(item => item.element_code === val.element_code)
      if (data && data.length > 0) {
        row.type = data[0].element_type
      }
    },
    async _queryByIdRulesInfo () {
      const res = await this.$simpleAsyncTo(queryByIdRulesInfo({ id: this.data.id }), '获取数据失败')
      if (res) {
        this.currentData = res.data
      }
    },
    async handleRelease () {
      const res = await this.$simpleAsyncTo(publish({ id: this.data.id }), '发布失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      }
    },
    async querySearch (queryString, cb) {
      // let restaurants = this.fieldsOptions
      // let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(this.fieldsOptions)
    },
    objectChangeHandle (val, row) {
      row.type = 'string'
    },
    getTextWidth (text) {
      const font = 'bold 12pt arial'
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = font
      const {
        width
      } = context.measureText(text)
      return width
    }
  }
}
</script>

<style lang="scss">
.regular-edit {
  $height: 80px;
  height: 100%;
  padding: 10px 15px;
  background: $grey8;
  overflow: auto;
  .v-middle {
    vertical-align: middle;
    margin-right: 3px;
  }
  &-header {
    border-bottom: 1px solid $grey7;
    padding-bottom: 10px;
    color: $grey3;

    .flex-layout {
      align-items: center;
    }
  }
  .group-table.el-table {
    th {
      background-color: $grey10;
    }
    .group-column-head {
      margin-top: 10px;
      .cell {
        height: 28px;
      }
    }
    .cell-content {
      p {
        line-height: 18px;
        color: $grey2;

        &:last-child {
          color: $grey4;
        }
      }
    }
    .is-right {
      .cell {
        justify-content: flex-end;
      }
    }
    .is-center {
      .cell {
        justify-content: center;
      }
    }
    td:not(.group-column-head) .cell {
      height: auto;
    }
    .el-form-item {
      margin-bottom: 0px;

      &__label {
        line-height: 20px;
        font-size: 12px;
        color: $grey4;
      }
    }
  }
  .my-label-width {
    width: calc(100% - 15px);
  }
  .my-regular-detail-title {
    background: none;
    position: relative;
    padding: 10px 0 20px 0;
    box-shadow: none;
    .my-regular-detail {
      margin-top: 12px;
      min-height: $height;
      display: flex;
      position: relative;
      font-size: 12px;
      .my-title-icon {
        min-width: $height;
        background: $editorLightSelectionBg;
        width: $height;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: $grey10;
        i {
          line-height: 1;
          vertical-align: baseline;
          font-size: 25px;
        }
      }
      .my-description {
        padding: 10px;
        flex: 1;
        background: $grey10;
        position: relative;
        width: 0;
        > div {
          &:first-child {
            display: flex;
            height: 14px;
            line-height: 14px;
            margin-bottom: 10px;
            > span:first-child {
              font-weight: 600;
              margin-right: 30px;
            }
            > span:last-child {
              &.success {
                color: $success;
              }
              &.error {
                color: $myError;
              }
              > i {
                font-size: 14px;
              }
            }
          }
          &:last-child {
            display: flex;
            flex-wrap: wrap;
            > span {
              display: flex;
              width: 280px;
              margin-bottom: 5px;
              max-width: 220px;
              &:last-child {
                display: inline-block;
              }
            }
          }
          &.my-base-des {
            > span {
              color: rgba(0, 0, 0, 0.5);
              padding-right: 20px;
              flex: 1;
              .my-des-item {
                color: #333;
                max-width: 210px;
              }
            }
          }
        }
      }
    }
  }
  .my-flex {
    flex-wrap: wrap;
    flex-basis: 500px;
  }
  .my-group-table {
    background-color: $grey8;
    > .el-table__header-wrapper {
      // margin-bottom: 10px;
    }
    > .el-table__body-wrapper {
      .el-table__body {
        .el-table__row.expanded {
          td:first-child {
            .cell {
              // display: none;
            }
          }
        }
        > tbody {
          tr:nth-child(odd) {
            td {
              // border-bottom: 10px solid $grey7;
              background-color: $grey8;
            }
          }
          tr:nth-child(even) {
            .el-table__expanded-cell {
              padding: 0px;
            }
          }
        }
      }
    }
  }
  .my-sub-group-table {
    > .el-table__body-wrapper {
      .el-table__body {
        .el-table__row {
          td {
            background-color: $grey10 !important;
            .cell {
              line-height: initial;
            }
          }
        }
        > tbody {
        }
      }
    }
  }
  .my-xingwei {
    .my-xingwei-content {
      position: relative;
      display: flex;
      align-items: flex-end;
      flex-basis: 500px;
      .my-xingwei-left,
      .my-xingwei-right {
        .my-xingwei-item-label {
          opacity: 0.7;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
