<template>
  <div class="project-manage">
    <div class="project-manage-top">
      <div></div>
    </div>
    <!-- 已加入项目 -->
    <div class="content">
      <div class="btn-conent">
        <el-button plain @click="showContent = 'content1'">表规范</el-button>
        <el-button
          style="margin-left: 0px"
          plain
          @click="showContent = 'content2'"
          >研发约束</el-button
        >
      </div>
      <div v-if="showContent === 'content1'">
        <div class="join pl-20">
          版块及规则
          <!-- <span class="mr-20">(2)</span> -->
          <!-- <i :class="is_show_join?'el-icon-arrow-up':'el-icon-arrow-down'" @click="is_show_join=!is_show_join"></i> -->
        </div>
        <div class="content-list pt-20" v-if="is_show_join">
          <el-row class="content flex-layout" v-loading="!!loading">
            <!-- <el-col
              :span="8"
              v-for="item in ProjectList"
              :key="item.id"
              class="content-item mb-15"
            > -->
            <el-col
              :span="8"
              v-for="(item, index) in ProjectList"
              :key="index + 'ProjectList'"
              class="content-item mb-15"
            >
              <div class="grid-content bg-purple">
                <el-card shadow="hover">
                  <div
                    class="main"
                    @mouseenter="enterDiv"
                    @mouseleave="leaveDiv"
                  >
                    <!-- <div class="tag">
                    <span class="mr-10">测试</span>
                    </div>-->
                    <div class="name clearfix">
                      <div class="fl width fl_title">
                        <i
                          class="iconfont icon-jiangpaihuang"
                          :class="showDiv ? 'enter-status' : 'leave-status'"
                        />
                        <OverflowTooltip class="width">
                          <span>
                            时间分区 · 天
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="提示："
                              placement="top-start"
                            >
                              <i
                                v-show="showDiv"
                                class="el-icon-warning-outline"
                              ></i>
                            </el-tooltip>
                          </span>
                        </OverflowTooltip>
                      </div>
                      <div
                        v-show="showDiv"
                        class="fr"
                        style="cursor: pointer; color: #0c4cff"
                        @click="dayProject('edit', item)"
                      >
                        <i
                          class="el-icon-edit-outline font-16"
                          style="margin-right: 5px"
                        ></i>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>中文名：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_name }}
                        </OverflowTooltip>
                      </div>
                      <div class="creation-time">
                        <label>英文名：</label>

                        {{ item.partition_code }}

                        <span></span>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>数据类型：</label>

                        {{ item.partition_data_type }}
                      </div>
                      <div class="creation-time">
                        <label>默认值：</label>

                        {{ item.partition_default_value }}

                        <span></span>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>描述：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_desc }}
                        </OverflowTooltip>
                      </div>
                      <div class="creation-time">
                        <label>默认格式：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_default_format }}
                        </OverflowTooltip>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
            <!-- <el-col
              :span="8"
              v-for="item in ProjectList1"
              :key="item.id"
              class="content-item mb-15"
            > -->
            <el-col
              :span="8"
              v-for="(item, index) in ProjectList1"
              :key="index + 'ProjectList1'"
              class="content-item mb-15"
            >
              <div class="grid-content bg-purple">
                <el-card shadow="hover">
                  <div
                    class="main"
                    @mouseenter="enterDiv1"
                    @mouseleave="leaveDiv1"
                  >
                    <!-- <div class="tag">
                    <span class="mr-10">测试</span>
                    </div>-->
                    <div class="name clearfix">
                      <div class="fl width fl_title">
                        <i
                          class="iconfont icon-jiangpaihuang"
                          :class="showDiv1 ? 'enter-status' : 'leave-status'"
                        />
                        <OverflowTooltip class="width">
                          <span>
                            时间分区 · 小时
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="提示："
                              placement="top-start"
                            >
                              <i
                                v-show="showDiv1"
                                class="el-icon-warning-outline"
                              ></i>
                            </el-tooltip>
                          </span>
                        </OverflowTooltip>
                      </div>
                      <div
                        v-show="showDiv1"
                        class="fr"
                        style="cursor: pointer; color: #0c4cff"
                        @click="hourProject('edit', item)"
                      >
                        <i
                          class="el-icon-edit-outline font-16"
                          style="margin-right: 5px"
                        ></i>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>中文名：</label>

                        {{ item.partition_name }}
                      </div>
                      <div class="creation-time">
                        <label>英文名：</label>

                        {{ item.partition_code }}

                        <span></span>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>数据类型：</label>

                        {{ item.partition_data_type }}
                      </div>
                      <div class="creation-time">
                        <label>默认值：</label>

                        {{ item.partition_default_value }}

                        <span></span>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>描述：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_desc }}
                        </OverflowTooltip>
                      </div>
                      <div class="creation-time">
                        <label>默认格式：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_default_format }}
                        </OverflowTooltip>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
            <!-- <el-col
              :span="8"
              v-for="item in ProjectList2"
              :key="item.id"
              class="content-item mb-15"
            > -->
            <el-col
              :span="8"
              v-for="(item, index) in ProjectList2"
              :key="index + 'ProjectList2'"
              class="content-item mb-15"
            >
              <div class="grid-content bg-purple">
                <el-card shadow="hover">
                  <div
                    class="main"
                    @mouseenter="enterDiv2"
                    @mouseleave="leaveDiv2"
                  >
                    <!-- <div class="tag">
                    <span class="mr-10">测试</span>
                    </div>-->
                    <div class="name clearfix">
                      <div class="fl width fl_title">
                        <i
                          class="iconfont icon-jiangpaihuang"
                          :class="showDiv2 ? 'enter-status' : 'leave-status'"
                        />
                        <OverflowTooltip class="width">
                          <span>
                            时间分区 · 分钟
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="提示："
                              placement="top-start"
                            >
                              <i
                                v-show="showDiv2"
                                class="el-icon-warning-outline"
                              ></i>
                            </el-tooltip>
                          </span>
                        </OverflowTooltip>
                      </div>
                      <div
                        v-show="showDiv2"
                        class="fr"
                        style="cursor: pointer; color: #0c4cff"
                        @click="minuteProject('edit', item)"
                      >
                        <i
                          class="el-icon-edit-outline font-16"
                          style="margin-right: 5px"
                        ></i>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>中文名：</label>

                        {{ item.partition_name }}
                      </div>
                      <div class="creation-time">
                        <label>英文名：</label>

                        {{ item.partition_code }}

                        <span></span>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>数据类型：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_data_type }}
                        </OverflowTooltip>
                      </div>
                      <div class="creation-time">
                        <label>默认值：</label>

                        {{ item.partition_default_value }}

                        <span></span>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>描述：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_desc }}
                        </OverflowTooltip>
                      </div>
                      <div class="creation-time">
                        <label>默认格式：</label>
                        <OverflowTooltip class="width">
                          {{ item.partition_default_format }}
                        </OverflowTooltip>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
            <!-- <el-col
              :span="8"
              v-for="item in ProjectList3"
              :key="item.id"
              class="content-item mb-15"
            > -->
            <el-col
              :span="8"
              v-for="(item, index) in ProjectList3"
              :key="index + 'ProjectList3'"
              class="content-item mb-15"
            >
              <div class="grid-content bg-purple">
                <el-card shadow="hover">
                  <div
                    class="main"
                    @mouseenter="enterDiv3"
                    @mouseleave="leaveDiv3"
                  >
                    <!-- <div class="tag">
                    <span class="mr-10">测试</span>
                    </div>-->
                    <div class="name clearfix">
                      <div class="fl width fl_title">
                        <i
                          class="iconfont icon-jiangpaihuang"
                          :class="showDiv3 ? 'enter-status' : 'leave-status'"
                        />
                        <OverflowTooltip class="width">
                          <span>
                            业务日期
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="提示："
                              placement="top-start"
                            >
                              <i
                                v-show="showDiv3"
                                class="el-icon-warning-outline"
                              ></i>
                            </el-tooltip>
                          </span>
                        </OverflowTooltip>
                      </div>
                      <div
                        v-show="showDiv3"
                        class="fr"
                        style="cursor: pointer; color: #0c4cff"
                        @click="dateProject('edit', item)"
                      >
                        <i
                          class="el-icon-edit-outline font-16"
                          style="margin-right: 5px"
                        ></i>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="engine">
                        <label>参数：</label>
                        <OverflowTooltip class="width">
                          {{ item.biz_date_key }}
                        </OverflowTooltip>
                      </div>
                      <div class="engine">
                        <label>参数值：</label>
                        <OverflowTooltip class="width">
                          {{ item.biz_date_value }}
                        </OverflowTooltip>
                      </div>
                    </div>
                    <!-- <div style="display: flex"> -->
                    <!-- <div class="engine">
                      <label>参数值：</label>
                      <OverflowTooltip class="width">
                        {{ item.engine_name }}
                      </OverflowTooltip>
                    </div> -->
                    <!-- <div class="creation-time"> -->
                    <!-- <label>默认值：</label>
                      <OverflowTooltip class="width">
                        {{ item.create_time }}
                      </OverflowTooltip> -->
                    <!-- <span></span>
                    </div>
                  </div> -->
                    <!-- <div style="display: flex">
                    <div class="engine"> -->
                    <!-- <label>描述：</label>
                      <OverflowTooltip class="width">
                        {{ item.engine_name }}
                      </OverflowTooltip> -->
                    <!-- </div>
                    <div class="creation-time"> -->
                    <!-- <label>默认格式：</label>
                      <OverflowTooltip class="width">
                        {{ item.create_time }}
                      </OverflowTooltip> -->
                    <!-- <span></span>
                    </div>
                  </div> -->
                  </div>
                </el-card>
              </div>
            </el-col>
            <!-- <el-col
              :span="8"
              v-for="item in ProjectList4"
              :key="item.id"
              class="content-item mb-15"
            > -->
            <el-col
              :span="8"
              v-for="(item, index) in ProjectList4"
              :key="index + 'ProjectList4'"
              class="content-item mb-15"
            >
              <div class="grid-content bg-purple">
                <el-card shadow="hover">
                  <div
                    class="main"
                    @mouseenter="enterDiv4"
                    @mouseleave="leaveDiv4"
                  >
                    <!-- <div class="tag">
                    <span class="mr-10">测试</span>
                    </div>-->
                    <div class="name clearfix">
                      <div class="fl width fl_title">
                        <i
                          class="iconfont icon-jiangpaihuang"
                          :class="showDiv4 ? 'enter-status' : 'leave-status'"
                        />
                        <OverflowTooltip class="width">
                          <span>
                            表命名
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="开启后，新建维度逻辑表的天表，名称会额外增加后缀 df（形式如'DIM_对象名_df'）。如不开启，无 df 后缀。特别地，设置后，对新生成的表生效，已生成表无法更名"
                              placement="top-start"
                            >
                              <i
                                v-show="showDiv4"
                                class="el-icon-warning-outline"
                              ></i>
                            </el-tooltip>
                          </span>
                        </OverflowTooltip>
                      </div>
                      <div
                        v-show="showDiv4"
                        class="fr"
                        style="cursor: pointer; color: #0c4cff"
                        @click="newBuildProject('edit', item)"
                      >
                        <i
                          class="el-icon-edit-outline font-16"
                          style="margin-right: 5px"
                        ></i>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div>
                        <label>维度逻辑：</label>
                        <OverflowTooltip class="width">
                          <span
                            >ld_demo.<span style="color: #468cff">{{
                              item.dim_logic && item.dim_logic.table_prefix
                            }}</span
                            >_member<span
                              v-if="
                                item.dim_logic && item.dim_logic.on_off == 'on'
                              "
                              style="color: #468cff"
                              >_df</span
                            ></span
                          >
                        </OverflowTooltip>
                      </div>
                      <!-- <div class="creation-time">
                      <label>英文名：</label>
                      <OverflowTooltip class="width">
                        {{ item.create_time }}
                      </OverflowTooltip>
                      <span></span>
                    </div> -->
                    </div>
                    <div style="display: flex">
                      <div>
                        <label>事实逻辑：</label>
                        <OverflowTooltip class="width">
                          <span
                            >ld_demo.<span style="color: #468cff"
                              >{{ item.dim_logic && item.fct_logic.table_prefix
                              }}<span
                                v-if="
                                  item.fct_logic &&
                                  item.fct_logic.on_off == 'on'
                                "
                                >_trd</span
                              ></span
                            >_order_di</span
                          >
                        </OverflowTooltip>
                      </div>
                      <!-- <div class="creation-time">
                      <label>默认值：</label>
                      <OverflowTooltip class="width">
                        {{ item.create_time }}
                      </OverflowTooltip>
                      <span></span>
                    </div> -->
                    </div>
                    <div style="display: flex">
                      <div>
                        <label>汇总逻辑：</label>
                        <OverflowTooltip class="width">
                          <span
                            >ld_demo.<span style="color: #468cff">{{
                              item.dim_logic && item.sum_logic.table_prefix
                            }}</span
                            >_member<span
                              v-if="
                                item.sum_logic && item.sum_logic.on_off == 'on'
                              "
                              style="color: #468cff"
                              >_dd</span
                            ></span
                          >
                        </OverflowTooltip>
                      </div>
                      <!-- <div class="creation-time">
                      <label>默认格式：</label>
                      <OverflowTooltip class="width">
                        {{ item.create_time }}
                      </OverflowTooltip>
                      <span></span>
                    </div>
                     -->
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="showContent === 'content2'">
        <div class="join pl-20">
          版块及规则
          <!-- <span class="mr-20">(2)</span> -->
          <!-- <i :class="is_show_join?'el-icon-arrow-up':'el-icon-arrow-down'" @click="is_show_join=!is_show_join"></i> -->
        </div>
        <div class="content-list pt-20" v-if="is_show_join">
          <el-row class="content flex-layout" v-loading="!!loading">
            <el-col
              :span="8"
              v-for="item in ProjectList"
              :key="item.id"
              class="content-item mb-15"
            >
              <div class="grid-content bg-purple">
                <el-card shadow="hover">
                  <div
                    class="main"
                    @mouseenter="enterDiv5"
                    @mouseleave="leaveDiv5"
                  >
                    <!-- <div class="tag">
                    <span class="mr-10">测试</span>
                    </div>-->
                    <div class="name clearfix">
                      <div class="fl width fl_title">
                        <i
                          class="iconfont icon-jiangpaihuang"
                          :class="showDiv5 ? 'enter-status' : 'leave-status'"
                        />
                        <OverflowTooltip class="width">
                          <span>
                            概念设计 · 流程管控
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="使用场景：业务对象、业务活动上线前，需要经过板块架构师审批，以便保证模型研发质量"
                              placement="top-start"
                            >
                              <i
                                v-show="showDiv5"
                                class="el-icon-warning-outline"
                              ></i>
                            </el-tooltip>
                          </span>
                        </OverflowTooltip>
                      </div>
                      <!-- <div
                      class="fr"
                      style="cursor: pointer"
                      @click="dialogTableVisible = true"
                    >
                      <el-switch> </el-switch>
                    </div> -->
                      <SimpleConfirm
                        v-show="showDiv5"
                        :switchContent="switchContent"
                        :defaultDelete="false"
                        :switchValue="switchValue"
                        @cancel="cancelSwitch"
                        @confirm="confirmSwitch"
                      />
                    </div>

                    <div class="content-text">
                      <p>
                        使用场景：业务对象、业务活动上线前，需要经过板块架构师审批，以便保证模型研发质量。
                      </p>
                      <p>
                        影响：开启后，所有业务对象、业务活动上线时，需经由板块架构师审批，审批通过方可正式上线。
                      </p>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- <el-dialog title="提示" :visible.sync="dialogTableVisible">
      你确定要打开该规范吗？
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog> -->
    <!-- 小时分区 -->
    <!-- <HourManage v-if="is_member_manage" @closeMemberManage="closeMemberManage" :project="projectInfo"></HourManage> -->
    <!-- 分钟分区 -->
    <!-- <MemberManage v-if="is_member_manage" @closeMemberManage="closeMemberManage" :project="projectInfo"></MemberManage> -->
    <!-- 新建项目/信息设置 -->
    <AddEditDialog
      v-if="is_display"
      @close="close"
      :projectData="projectData"
      :businId="businId"
    ></AddEditDialog>
    <!-- 小时编辑 -->
    <HourEdit
      v-if="is_hour"
      @close="closeHour"
      :hourtData="hourtData"
      :businId="businId"
    ></HourEdit>
    <!-- 天 -->
    <DayManage
      v-if="is_day"
      @close="closeDay"
      :daytData="daytData"
      :businId="businId"
    ></DayManage>
    <!-- 分钟 -->
    <MinuteEdit
      v-if="is_minute"
      @close="closeMinute"
      :minutetData="minutetData"
      :businId="businId"
    ></MinuteEdit>
    <!-- 业务日期 -->
    <DateEdit
      v-if="is_date"
      @close="closedate"
      :datetData="datetData"
      :businId="businId"
    ></DateEdit>
  </div>
</template>

<script>
// import MemberManage from './member-manage'
// import HourManage from './hour-manage'

import AddEditDialog from './add-edit-dialog' //表命名
import DayManage from './day-edit' //天
import HourEdit from './hour-edit' //小时
import MinuteEdit from './minute-edit' //分钟
import DateEdit from './date-edit' //业务日期
import {
  queryBizPartition,
  queryDataTypeList,
  queryBusinessDate,
  editBizPartiton,
  queryTableNameRule,
  editTableNameRule,
  queryProcessControl,
  editProcessControl,
} from '@/api/plan/data-architecture'
import {types} from '@/config/rd-config'
import pager from '@/mixins/pager'
import {mapMutations, mapGetters} from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'DevSpecification',
  components: {
    // HourManage,
    DayManage,
    MinuteEdit,
    DateEdit,
    // MemberManage,
    AddEditDialog,
    HourEdit,
    OverflowTooltip,
  },
  mixins: [pager],
  props: {
    businId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // dialogTableVisible: false,
      showContent: 'content1',
      num: 2,
      proiect_total: null,
      AlreadyAdd: [],
      is_display: false,
      is_hour: false, //  小时
      is_day: false, //  天
      is_minute: false, //  分钟
      is_date: false, //  业务日期
      is_member_manage: false,
      projectData: {},
      hourtData: {},
      ProjectList: [{}],
      ProjectList1: [{}],
      ProjectList2: [{}],
      ProjectList3: [{}],
      ProjectList4: [{}],
      ProjectList5: [
        {
          busin_id: 'ceshi',
          busin_name: 'ceshi',
          create_time: 'ceshi',
          engine_id: 'ceshi',
          engine_name: 'ceshi',
          id: 'ceshi',
          liable_info: 'ceshi',
          project_code: 'ceshi',
          project_desc: 'ceshi',
          project_name: 'ceshi',
        },
      ],
      loading: 0,
      is_show_join: true,
      ProiectType: null, // 选中的项目类型
      searchKeyword: null, // 搜索关键字
      ProiectTypeOptions: [], // 项目类型
      projectInfo: {}, // 项目id/名称
      sortType: [
        {value: 0, label: '添加日期'},
        {value: 1, label: '名称'},
        {value: 2, label: '英文名'},
      ],
      sort_value: 0,
      switchValue: 'off',
      switchContent: {
        on: '你确定要打开该规范吗？',
        off: '你确定要关闭该规范吗？',
      },
      showDiv: false,
      showDiv1: false,
      showDiv2: false,
      showDiv3: false,
      showDiv4: false,
      showDiv5: false,
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  created() {
    this.searchKeyword = this.$route.params.project_name || ''
    // this.getTableList()
    this.getBlockData()
    this.getTableNaming()
    this.getFlowControlStatus()
  },
  mounted() {},
  methods: {
    enterDiv5() {
      this.showDiv5 = !this.showDiv5
    },
    leaveDiv5() {
      this.showDiv5 = !this.showDiv5
    },
    enterDiv4() {
      this.showDiv4 = !this.showDiv4
    },
    leaveDiv4() {
      this.showDiv4 = !this.showDiv4
    },
    enterDiv3() {
      this.showDiv3 = !this.showDiv3
    },
    leaveDiv3() {
      this.showDiv3 = !this.showDiv3
    },
    enterDiv2() {
      this.showDiv2 = !this.showDiv2
    },
    leaveDiv2() {
      this.showDiv2 = !this.showDiv2
    },
    enterDiv1() {
      this.showDiv1 = !this.showDiv1
    },
    leaveDiv1() {
      this.showDiv1 = !this.showDiv1
    },
    enterDiv() {
      this.showDiv = !this.showDiv
    },
    leaveDiv() {
      this.showDiv = !this.showDiv
    },
    cancelSwitch() {},
    confirmSwitch(val) {
      if (val.flag == 'on') {
        // this.switchValue = 'on'
        this.postFlowControlStatus('on')
      } else {
        // this.switchValue = 'off'
        this.postFlowControlStatus('off')
      }
    },
    async postFlowControlStatus(val) {
      const res = await this.$simpleAsyncTo(
        editProcessControl({
          busin_id: this.businId,
          on_off: val,
        })
      )
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg,
        })
        this.getFlowControlStatus()
      }
    },
    async getFlowControlStatus() {
      const res = await this.$simpleAsyncTo(
        queryProcessControl({
          busin_id: this.businId,
        })
      )
      if (res) {
        this.switchValue = res.data.on_off
      }
    },
    async getTableNaming() {
      const res = await this.$simpleAsyncTo(
        queryTableNameRule({
          busin_id: this.businId,
        })
      )
      if (res) {
        console.log([res.data])
        this.ProjectList4 = [res.data]
      }
    },
    async getBlockData() {
      let temp = ['1', '2', '3', '4']
      for (const item of temp) {
        const res = await this.$simpleAsyncTo(
          queryBizPartition({
            busin_id: this.businId,
            type: item,
          })
        )
        if (item == 1 && res) {
          this.ProjectList = [res.data]
        } else if (item == 2 && res) {
          this.ProjectList1 = [res.data]
        } else if (item == 3 && res) {
          this.ProjectList2 = [res.data]
        } else if (item == 4 && res) {
          this.ProjectList3 = [res.data]
        }
      }
    },
    ...mapMutations({
      setProject: 'SET_PROJECT',
    }),
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 项目列表
    // async getTableList() {
    //   this.loading++
    //   const params = {project_name: this.searchKeyword}
    //   const res = await this.$simpleAsyncTo(
    //     getTableList(params),
    //     '获取项目列表失败'
    //   )
    //   if (res) {
    //     this.proiect_total = res.totalRecords
    //     this.total = res.totalRecords
    //     // this.ProjectList = res.data
    //     // this.ProjectList.sort(function(a, b) {
    //     //   return Date.parse(b.created_date) - Date.parse(a.created_date)
    //     // })
    //     this.loading--
    //   }
    // },
    // 搜索项目
    filterChange(val) {
      this.searchKeyword = val
      // this.getTableList()
    },
    // 区分新增/编辑项目-表命名
    newBuildProject(flag, v = {}) {
      if (flag === 'add') {
        this.is_display = true
        this.projectData = v
      } else {
        this.is_display = true
        this.projectData = v
      }
    },
    // 小时编辑
    hourProject(flag, v = {}) {
      if (flag === 'add') {
        this.is_hour = true
        this.hourtData = v
      } else {
        this.is_hour = true
        this.hourtData = v
      }
    },
    // 天编辑
    dayProject(flag, v = {}) {
      if (flag === 'add') {
        this.is_day = true
        this.daytData = v
      } else {
        this.is_day = true
        this.daytData = v
      }
    },
    // 分钟编辑
    minuteProject(flag, v = {}) {
      if (flag === 'add') {
        this.is_minute = true
        this.minutetData = v
      } else {
        this.is_minute = true
        this.minutetData = v
      }
    },
    // 编辑-业务日期
    dateProject(flag, v = {}) {
      if (flag === 'add') {
        this.is_date = true
        this.datetData = v
      } else {
        this.is_date = true
        this.datetData = v
      }
    },
    // 成员管理
    // memberManageClick(item) {
    //   this.is_member_manage = true
    //   this.projectInfo = {project_id: item.id, project_name: item.project_name}
    // },
    workarea(item) {
      this.setProject(item.id)
      // this.$router.push()
      this.$router.push({name: types.DIMENSION, params: {project_id: item.id}})
    },
    // 排序
    sortHandle(index) {
      this.sort_value = index
    },
    // 关闭新增与编辑弹窗
    close(fn) {
      this.is_display = false
      if (fn && fn === 'refresh') {
        // this.getTableList()
        this.getTableNaming()
      }
    },
    // 关闭小时分区弹窗
    closeHour(fn) {
      this.is_hour = false
      if (fn && fn === 'refresh') {
        // this.getTableList()
        this.getBlockData()
      }
    },

    // 关闭天分区弹窗
    closeDay(fn) {
      this.is_day = false
      if (fn && fn === 'refresh') {
        // this.getTableList()
        this.getBlockData()
      }
    },
    // 关闭分钟分区弹窗
    closeMinute(fn) {
      this.is_minute = false
      if (fn && fn === 'refresh') {
        // this.getTableList()
        this.getBlockData()
      }
    },

    // 关闭日期分区弹窗
    closedate(fn) {
      this.is_date = false
      if (fn && fn === 'refresh') {
        // this.getTableList()
        this.getBlockData()
      }
    },
    // 关闭成员管理弹窗
    // closeMemberManage(fn) {
    //   this.is_member_manage = false
    //   if (fn && fn === 'refresh') {
    //     this.getTableList()
    //   }
    // },
    // 删除项目
    // deleteProjectHandle(id) {
    //   this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async () => {
    //     this.globalLoading()
    //     const res = await this.$simpleAsyncTo(deleteProject({id}), '删除失败')
    //     if (res) {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //       this.getTableList()
    //     }
    //     this.globalLoading().close()
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //     this.globalLoading().close()
    //   })
    // }
  },
}
</script>
<style scoped>
.btn-conent {
  padding-top: 15px;
  padding-left: 10px;
}
.el-tabs__nav-wrap .is-top {
  width: 182px !important;
}
</style>
<style lang="scss">
.content-text p {
  color: rgba(0, 0, 0, 0.5);
  line-height: 30px;
}
.mb-20 ul {
  display: flex;
  margin: 20px 20px;
  padding-top: 20px;
  li {
    border: 1px solid #333;
    padding: 10px 10px;
    width: 150px;
    text-align: center;
  }
}
.engine {
  width: 50% !important;
}
.fl_title {
  color: #333;
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 20px;
  img {
    margin-right: 10px;
  }
}
.project-manage {
  overflow-x: auto;
  height: 100%;
  min-width: 1100px;
  .project-manage-top {
    .header-list {
      line-height: 28px;
      font-size: 12px;
      .hr {
        .sort-type {
          .info-item {
            color: $grey4;
            cursor: pointer;
            &.active {
              color: $grey2;
            }
          }
          div:nth-child(2) {
            span {
              padding: 0 10px;
              position: relative;
              &::before,
              &::after {
                content: '';
                border-right: 1px solid $grey4;
                position: absolute;
                top: 50%;
                margin-top: -6px;
                width: 0px;
                height: 12px;
              }
              &::after {
                right: 0;
              }
              &::before {
                left: 0;
              }
            }
          }
        }
      }
    }
  }
  .hl-text {
    color: #000;
    font-weight: 600;
    font-size: 16px;
    margin: 30px 20px;
    line-height: 70px;
  }
  .content {
    .join {
      width: 100%;
      // height: 60px;
      background-color: $grey8;
      line-height: 40px;
    }
  }
}
.project-manage {
  .content {
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: $grey8;
    // padding: 0 10px;
    box-sizing: border-box;
    .content-item {
      /* width: 33.333333333%; */
      padding: 0 10px;
      box-sizing: border-box;
      .bg-purple {
        background: $grey10;
      }
      .main {
        padding: 0px 0px 0px 12px;
        font-size: 12px;
        box-sizing: border-box;
        min-height: 150px;
        > div {
          padding: 6px 0;
          label {
            color: rgba(0, 0, 0, 0.5);
          }
          .width {
            width: calc(100% - 60px);
            color: #333;
          }
        }
        .tag {
          width: 100%;
          height: 40px;
          line-height: 40px;
          span {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            border: 1px solid $waitRun;
            border-right: none;
            color: $waitRun;
            background: $grey10;
            padding-left: 5px;
            box-sizing: border-box;
            overflow: hidden;
            &::before {
              content: '';
              position: absolute;
              top: 0;
              right: -15px;
              height: 21px;
              width: 21px;
              border: 1px solid $waitRun;
              border-color: transparent transparent $waitRun $waitRun;
              transform: rotate(45deg);
              background: $grey10;
            }
          }
        }
        .btn {
          display: flex;
          justify-content: space-between;
          .el-button {
            border-color: $--color-primary;
            color: $--color-primary;
            border-radius: 0;
            flex: 1;
          }
        }
        .enter-btn {
          background: $--color-primary;
          color: $grey10;
          border-radius: 0;
          width: 100%;
        }
        .enter-status {
          color:#eaba19;
          font-size: 24px;
          margin-right: 5px;
        }
        .leave-status {
          color:#e1e0e4;
          font-size: 24px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
