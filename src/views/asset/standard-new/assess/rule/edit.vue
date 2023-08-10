<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-06 17:55:54
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-10 14:35:01
 * @FilePath: \数据智能构建\src\views\asset\standard-new\assess\rule\edit.vue
-->
<template>
  <div class="rule-add-edit" ref="ruleAddEdit">
    <div style="display: flex; align-items: center; justify-content: space-between;" class="mb-20" ref="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="black"><a href="#" style="font-weight:600;color:#66b1ff" >落标映射规则</a></el-breadcrumb-item>
        <el-breadcrumb-item>新建落标映射规则</el-breadcrumb-item>
      </el-breadcrumb>
      <span>
        <el-button type="default" class="mr-5" @click="drawer = true">查看引导</el-button>
      </span>
    </div>
    <div class="map-rule-header-card" ref="mapRuleHeaderCard" v-resize="resizeDom">
      <span class="anchor-container">
        <div class="anchor-wrapper">
          <div class="anchor">
            <div class="anchor-link" style="display: none;display: none;position: absolute;top: 0;left: 0;height: 100%;">
              <span class="anchor-link-ball"></span>
            </div>
            <div
              :class="['anchor-link', activeAnchorLinkIndex === item.value ? 'anchor-link-active' : '']"
              v-for="(item, index) in stepList" :key="item.value"
              @click="activeAnchorLinkIndexHandle(item, index)"
            >
              <a :class="['anchor-link-title', activeAnchorLinkIndex === item.value ? 'anchor-link-title-active' : '']">
                <i class="iconfont icon-iconfontzhizuobiaozhun023117" v-if="activeAnchorLinkIndex === item.value"></i>
                {{item.label}}
              </a>
            </div>
          </div>
        </div>
      </span>
      <span style="font-size:12px;color:rgba(46,116,255,1);cursor: pointer;" @click="showDesc = !showDesc">收起</span>
      <div class="desc-container" v-if="showDesc">
        <div class="desc-item">规则名称、负责人、描述等基本信息配置</div>
        <div class="desc-item">通过对象类型及元数据字段圈选进行映射评估的资产对象</div>
        <div class="desc-item">通过标准集圈选进行映射评估的数据标准</div>
        <div class="desc-item">规则名称、负责人、描述等基本信息配置</div>
        <div class="desc-item">映射规则执行方式、周期等配置</div>
      </div>
    </div>
    <div class="content" :style="{height: `${height}px`}">
      <div class="form-content" ref="contentBox" @scroll="scrollHandle">
        <h5 class="font-14 mb-10" ref="a1">基本信息</h5>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="映射规则名称" prop="name">
                <el-input v-model="ruleForm.name" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="username">
                <el-select v-model="ruleForm.username" placeholder="请选择负责人" style="width:100%" :disabled="disabled">
                  <el-option label="负责人1" value="1"></el-option>
                  <el-option label="负责人2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="ruleForm.desc" :disabled="disabled"></el-input>
          </el-form-item>
          <h5 class="font-14 mb-10" ref="a2">圈选资产对象</h5>
          <el-row>
            <el-col :span="12">
              <el-form-item label="标准集" prop="standardSet">
                <el-select v-model="ruleForm.standardSet" placeholder="请选择标准集" style="width:100%" :disabled="disabled">
                  <el-option label="标准集1" value="1"></el-option>
                  <el-option label="标准集2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="评估对象" prop="object">
                <el-select v-model="ruleForm.object" placeholder="请选择评估对象" style="width:100%" :disabled="disabled">
                  <el-option label="评估对象1" value="1"></el-option>
                  <el-option label="评估对象2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="过滤条件" prop="filter">
            <el-radio-group v-model="ruleForm.filter" :disabled="disabled">
              <el-radio label="1">不过滤</el-radio>
              <el-radio label="2">表达式配置</el-radio>
            </el-radio-group>
          </el-form-item>
          <FilterConfig v-if="ruleForm.filter == '2'" :disabled="disabled"></FilterConfig>
          <el-form-item label="评估范围" prop="scope">
            <el-radio-group v-model="ruleForm.scope" :disabled="disabled">
              <el-radio label="1">全量评估</el-radio>
            </el-radio-group>
          </el-form-item>
          <h5 class="font-14 mb-10" ref="a3">圈选数据标准</h5>
          <el-row>
            <el-col :span="12">
              <el-form-item label="归属目录" prop="homeDirectory">
                <el-select v-model="ruleForm.homeDirectory" placeholder="请选择归属目录" style="width:100%">
                  <el-option label="归属目录1" value="1"></el-option>
                  <el-option label="归属目录2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="标准来源" prop="standardSource">
                <el-select v-model="ruleForm.standardSource" placeholder="请选择标准来源" style="width:100%">
                  <el-option label="标准来源1" value="1"></el-option>
                  <el-option label="标准来源2" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <h5 class="font-14 mb-10" ref="a4">映射配置</h5>
          <el-form-item label="映射规则" prop="exprConfig" :disabled="disabled">
            <el-radio-group v-model="ruleForm.exprConfig">
              <el-radio label="1">表达式配置</el-radio>
            </el-radio-group>
          </el-form-item>
          <FilterConfig :disabled="disabled"></FilterConfig>
          <h5 class="font-14 mb-10" ref="a5">执行配置</h5>
          <el-row>
            <el-col :span="12">
              <el-form-item label="执行方式" prop="cycleType">
                <el-radio-group v-model="ruleForm.cycleType" :disabled="disabled">
                  <el-radio label="1">定时执行</el-radio>
                  <el-radio label="2">手动执行</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="8" class="mr-10">
                  <el-form-item label="执行周期" prop="cycle">
                    <el-radio-group v-model="ruleForm.cycle" :disabled="disabled">
                      <el-radio label="1">连续周期</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="7" class="mr-10">
                  <el-form-item label="" prop="dateType" label-width="0px">
                    <el-select v-model="ruleForm.dateType" placeholder="" style="width:100%" :disabled="disabled">
                      <el-option label="每日" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="mr-10">
                  <el-form-item label="" prop="dateType" label-width="0px">
                    <el-time-picker
                      :disabled="disabled"
                      v-model="ruleForm.time"
                      format="HH:mm" style="width:120px">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-form-item label="cron表达式"></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="超出时间" prop="overstepTime">
                <el-input-number :disabled="disabled" v-model="ruleForm.overstepTime" controls-position="right" :min="0" :max="24" :step="0.1"></el-input-number> 小时
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="出错重试" prop="retry">
                    <el-switch
                      :disabled="disabled"
                      v-model="ruleForm.retry"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="重试次数" prop="num">
                    <el-input-number :disabled="disabled" v-model="ruleForm.num" controls-position="right" :min="0" :max="24" :step="1"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重试间隔" prop="step">
                <el-input-number :disabled="disabled" v-model="ruleForm.step" controls-position="right" :min="0" :max="24" :step="1"></el-input-number> min
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="foolter" >
        <el-button type="default" class="mr-5" @click="cancel">取消</el-button>
        <el-button type="primary" class="mr-5" @click="save" :disabled="disabled">确定</el-button>
      </div>
    </div>
    <el-drawer
      title="流程引导"
      size="46%"
      :visible.sync="drawer"
      direction="rtl">
      <el-image :src="require('@/assets/images/yindao.png')"></el-image>
    </el-drawer>
  </div>
</template>

<script>
import FilterConfig from './filter-config'
import { scroll } from '@/libs/dom'
export default {
  name: 'RuleEdit',
  props: {
    viewType: {
      type: String,
      default: 'add'
    },
    currentRow: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    FilterConfig
  },
  computed: {
    disabled () {
      return this.viewType === 'add' || this.viewType === 'edit' ? false : true
    }
  },
  data () {
    return {
      height: 0,
      ruleForm: {
        name: '',
        username: '',
        desc: '',
        standardSet: '',
        object: '',
        filter: '2',
        scope: '1',
        exprConfig: '1',
        cycleType: '1',
        cycle: '1',
        dateType: '1',
        time: '',
        overstepTime: 0,
        retry: false,
        num: 0,
        step: 0,
        homeDirectory: '',
        standardSource: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入映射规则名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        standardSet: [
          { required: true, message: '请选择标准集', trigger: 'change' }
        ],
        object: [
          { required: true, message: '请选择评估对象', trigger: 'change' }
        ],
        filter: [
          { required: true, message: '请选择过滤条件', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '请选择评估范围', trigger: 'change' }
        ],
        exprConfig: [
          { required: true, message: '请选择映射规则', trigger: 'change' }
        ],
        cycleType: [
          { required: true, message: '请选择执行方式', trigger: 'change' }
        ],
        cycle: [
          { required: true, message: '请选择执行周期', trigger: 'change' }
        ],
        overstepTime: [
          { required: true, message: '请输入超出时间', trigger: 'change' }
        ],
        retry: [
          { required: true, message: '请选择出错重试', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入重试次数', trigger: 'change' }
        ],
        step: [
          { required: true, message: '请输入重试间隔', trigger: 'change' }
        ],
        standardSource: [
          { required: true, message: '请选择标准来源', trigger: 'change' }
        ],
      },
      stepList: [
        { label: '基本信息', value: 1 },
        { label: '圈选资产对象', value: 2 },
        { label: '圈选数据标准', value: 3 },
        { label: '映射配置', value: 4 },
        { label: '执行配置', value: 5 },
      ],
      activeAnchorLinkIndex: 1,
      showDesc: true,
      top: 0,
      isClick: false,
      drawer: false
    }
  },
  methods: {
    black () {
      this.$emit('black')
    },
    resizeDom (data) {
      this.$nextTick(_ => {
        const { height } = data
        this.height = this.$refs.ruleAddEdit.clientHeight - this.$refs.breadcrumb.clientHeight - 30 - parseInt(height)
      })
    },
    cancel () {
      this.$emit('black')
    },
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('black')
        } else {
          return false
        }
      })
    },
    activeAnchorLinkIndexHandle(item, index) {
      
      this.$nextTick(_ => {
        this.isClick = true
        const oldOffsetTop = this.$refs[`a${this.activeAnchorLinkIndex}`].offsetTop
        const offsetTop = this.$refs[`a${item.value}`].offsetTop
        this.activeAnchorLinkIndex = item.value
        scroll(this.$refs.contentBox, oldOffsetTop, offsetTop, 50, () => {
          this.isClick = false
        })
      })
    },
    getOffsetTop() {
      const offsetTopList = []
      this.stepList.forEach(item => {
        offsetTopList.push(this.$refs[`a${item.value}`].offsetTop)
      })
      return offsetTopList
    },
    scrollHandle(e) {
      if (this.isClick) return
      this.$nextTick(_ => {
        const offsetTopList = this.getOffsetTop()
        const scrollTop = e.target.scrollTop
        offsetTopList.forEach((item, index) => {
          if (scrollTop >= item) {
            this.activeAnchorLinkIndex = index + 1
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-add-edit {
  padding: 10px 0 0 0;
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    .form-content {
      height: calc(100% - 40px);
      overflow: overlay;
      padding: 15px;
    }
    .foolter {
      position: absolute;
      bottom: 0;
      height: 40px;
      line-height: 40px;
      width: 100%;
      border-top: 1px solid #ebeef5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sub-title {
      font-size: 14px;
      color: #606266;
      margin: 20px 0 10px 0;
      font-weight: 500;
    }
  }
  .map-rule-header-card {
    background: rgba($color: #fff, $alpha: 1.0);
    user-select: none;
    margin-bottom: 10px;
    .anchor-container {
      margin: 10px 20px 10px 18px;
      height: 30px;
      display: inline-block;
      border-radius: 2px;
      width: 90%;
      .anchor-wrapper {
        max-height: 100vh;
        display: inline-flex;
        box-sizing: border-box;
        width: 100%;
        margin-left: -4px;
        padding-left: 4px;
        overflow: hidden;
        background-color: transparent;
        .anchor {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: #333;
          font-size: 12px;
          font-variant: tabular-nums;
          line-height: 1.5;
          list-style: none;
          font-feature-settings: "tnum";
          position: relative;
          padding-left: 2px;
          .anchor-link {
            padding: 0 15px 0 20px;
            position: relative;
            height: 28px;
            line-height: 28px;
            margin-right: 10px;
            background-color: rgba(0,0,0,0.04);
            flex: 1;
            cursor: pointer;
            &:nth-child(2) {
              padding: 0 15px;
              &::before {
                position: absolute;
                left: 0;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                top: 0;
                border-width: 14px 0 14px 10px;
                content: "";
              }
            }
            &::before {
              position: absolute;
              left: 0;
              width: 0;
              height: 0;
              border-color: transparent transparent transparent rgba($color: #fff, $alpha: 1.0);
              border-style: solid;
              top: 0;
              border-width: 14px 0 14px 10px;
              content: "";
            }
            &::after {
              position: absolute;
              right: -10px;
              width: 0;
              height: 0;
              top: 0;
              border-color: transparent transparent transparent rgba($color: #000, $alpha: 0.04);
              border-style: solid;
              border-width: 14px 0 14px 10px;
              content: "";
            }
            .anchor-link-ball {
              position: absolute;
              left: 50%;
              display: none;
              width: 8px;
              height: 8px;
              background-color: #fff;
              border: 2px solid #0c4cff;
              border-radius: 8px;
              transform: translateX(-50%);
              transition: top .3s ease-in-out;
            }
            .anchor-link-title {
              position: relative;
              display: block;
              margin-bottom: 6px;
              overflow: hidden;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              transition: all .3s;
              &.anchor-link-title-active {
                color: #2e74ff;
              }
            }
            &.anchor-link-active {
              background-color: #e6f0ff;
              &::after {
                border-color: transparent transparent transparent #e6f0ff;
                content: "";
              }
            }
          }
        }
      }
    }
    .desc-container {
      color: rgba($color: #000, $alpha: 0.45);
      display: flex;
      width: 90%;
      margin: 10px 20px 10px 18px;
      font-size: 12px;
      .desc-item {
        width: 20%;
        padding: 0 15px 10px 16px;
        box-sizing: border-box;
      }
    }
  }
}
</style>