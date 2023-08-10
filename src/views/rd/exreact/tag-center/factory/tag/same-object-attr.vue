<template>
  <div class="same-object-attr">
    <div class="left-panel">
      <div class="object-property-filter-header">
        筛选配置 <span>{{data.length}}</span>/3
      </div>
      <div class="sortable-object-property">
        <div class="sortable-item" v-for="(item) in currentRulesConfig" :key="item.object_attr_code">
          <div class="pane-content">
            <div class="content-wrapper">
              <i class="iconfont icon-sidebar-toggle-copy mr-5"></i>
              <OverflowTooltip style="width:40px" class="mr-5">{{item.object_attr_code}}</OverflowTooltip>
              <div style="width:42%" class="mr-10">
                <el-select v-model="item.rules"
                  placeholder="请选择"
                  class="bus-select"
                  popper-class="bus-select-option"
                  @change="change()"
                >
                  <el-option
                    v-for="val in mappingRules"
                    :key="val.operator_code"
                    :label="val.operator_name"
                    :value="val.operator_code"
                    >
                  </el-option>
                </el-select>
              </div>
              <div style="width:58%" class="required">
                <el-input v-model="item.keywords" placeholder="请输入内容" @input="((val) => {$forceUpdate(),change1(val, item)})" :class="['bus-select', item.visible ? 'active' : '']"></el-input>
                <p class="required-text" v-if="item.visible">必填项</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="relationship-configuration-wrapper" v-if="data.length > 1">
        <div class="border2 border1">
          <div class="radios-wrapper">
            <el-radio-group v-model="radio" @change="changeRadio">
              <el-radio label="and">且</el-radio>
              <el-radio label="or">或</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="border2" v-if="data.length > 2">
          <div class="radios-wrapper">
            <el-radio-group v-model="radio1" @change="changeRadio1">
              <el-radio label="and">且</el-radio>
              <el-radio label="or">或</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="relationship-preview-wrapper" v-if="data.length > 1">
      <div>关系预览</div>
      <i :class="['iconfont', icon]"></i>
      <el-popover
        placement="top-end"
        width="250"
        trigger="hover">
        <div>
          <div class="popover-title">可视化关系示意图
            <el-tooltip class="item" effect="dark" content="筛选配置顺序在示意图中匹配为从左到右到下的位置" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <ul class="icon-list">
            <li v-for="(item, index) in icons" :key="item.icon">
              <i :class="[item.icon, index > icons.length - 3 ? 'font20' : '', 'mr-20']"></i>{{item.label}}
            </li>
          </ul>
        </div>
        <div class="configuration-boot" slot="reference">
          <i class="iconfont icon-peizhiyindao"></i>
          <span class="ml-5">配置引导</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {
  getMappingRules
} from '@/api/rd/exreact/tag-center'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'SameObjectAttr',
  props: {
    data: Array
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      options: [],
      value: '',
      keywords: '',
      radio: 'and',
      radio1: 'and',
      icons: [
        {
          icon: 'iconfont icon-santiaoguizeqie',
          label: '3条规则"且"'
        },
        {
          icon: 'iconfont icon-santiaoguizehuo',
          label: '3条规则"或"'
        },
        {
          icon: 'iconfont icon-tiaoguizexianqiehouhuo',
          label: '3条规则先"且"后"或"'
        },
        {
          icon: 'iconfont icon-santiaoguizexianhuohouqie',
          label: '3条规则先"或"后"且"'
        },
        {
          icon: 'iconfont icon-tiaoguizeqie1',
          label: '2条规则"且"'
        },
        {
          icon: 'iconfont icon-tiaoguizehuo',
          label: '2条规则"或"'
        }
      ],
      icon: 'icon-tiaoguizeqie1',
      mappingRules: [],
      currentRulesConfig: [],
      rulesObj: {},
      andOr: {
        and: '且',
        or: '或'
      },
      rules: '',
      rules1: '',
      rules2: ''
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.currentRulesConfig = []
        val.forEach(item => {
          const index = this.currentRulesConfig.findIndex(val => item.object_attr_code === val.object_attr_code)
          if (index === -1) {
            this.currentRulesConfig.push({
              ...item
            })
          }
        })
        if (val.length === 2) {
          this.radio = val[0].filter_relation
        }
        if (val.length === 3) {
          this.radio = val[0].filter_relation
          this.radio1 = val[1].filter_relation
        }
      }
    },
    currentRulesConfig: {
      deep: true,
      handler(val) {
        if (val.length === 3) {
          // this.icon = 'icon-santiaoguizeqie'
          if (this.radio === 'and' && this.radio1 === 'and') {
            this.icon = 'icon-santiaoguizeqie'
          } else if (this.radio === 'or' && this.radio1 === 'or') {
            this.icon = 'icon-santiaoguizehuo'
          } else if (this.radio === 'and' && this.radio1 === 'or') {
            this.icon = 'icon-tiaoguizexianqiehouhuo'
          } else {
            this.icon = 'icon-santiaoguizexianhuohouqie'
          }
        }
        if (val.length === 2) {
          this.radio1 = 'and'
          if (this.radio === 'and') {
            this.icon = 'icon-tiaoguizeqie1'
          } else {
            this.icon = 'icon-tiaoguizehuo'
          }
          // this.icon = 'icon-tiaoguizeqie1'
        }
        if (val.length === 1) {
          this.radio1 = 'and'
          this.radio = 'and'
        }
      }
    }
  },
  created() {
    this._getMappingRules()
  },
  methods: {
    // 映射规则
    async _getMappingRules() {
      const res = await this.$simpleAsyncTo(getMappingRules(), '获取失败')
      if (res) {
        this.mappingRules = res.data
        this.mappingRules = this.mappingRules.filter(item => {
          this.rulesObj[item.operator_code] = item.operator_name
          return item.operator_code !== 'ALL'
        })
      }
    },
    change(e) {
      this.$forceUpdate()
    },
    change1(val, item) {
      if (val === '') {
        item.visible = true
      } else {
        item.visible = false
      }
      // this.$forceUpdate()
    },
    changeRules(val) {
    },
    changeRadio(val) {
      this.radio = val
      if (this.currentRulesConfig.length === 2) {
        if (val === 'and') {
          this.icon = 'icon-tiaoguizeqie1'
        } else {
          this.icon = 'icon-tiaoguizehuo'
        }
      }
      if (this.currentRulesConfig.length === 3) {
        if (val === 'and' && this.radio1 === 'and') {
          this.icon = 'icon-santiaoguizeqie'
        } else if (val === 'or' && this.radio1 === 'or') {
          this.icon = 'icon-santiaoguizehuo'
        } else if (val === 'and' && this.radio1 === 'or') {
          this.icon = 'icon-tiaoguizexianqiehouhuo'
        } else {
          this.icon = 'icon-santiaoguizexianhuohouqie'
        }
      }
    },
    changeRadio1(val) {
      this.radio1 = val
      if (val === 'and' && this.radio === 'and') {
        this.icon = 'icon-santiaoguizeqie'
      } else if (val === 'or' && this.radio === 'or') {
        this.icon = 'icon-santiaoguizehuo'
      } else if (val === 'and' && this.radio === 'or') {
        this.icon = 'icon-santiaoguizexianhuohouqie'
      } else {
        this.icon = 'icon-tiaoguizexianqiehouhuo'
      }
    },
    getData() {
      if (this.currentRulesConfig.length) {
        if (this.currentRulesConfig.length === 1) {
          this.currentRulesConfig[0].filter_relation = ''
        }
        if (this.currentRulesConfig.length === 2) {
          this.currentRulesConfig[0].filter_relation = this.radio
          this.currentRulesConfig[1].filter_relation = ''
        }
        if (this.currentRulesConfig.length === 3) {
          this.currentRulesConfig[0].filter_relation = this.radio
          this.currentRulesConfig[1].filter_relation = this.radio1
          this.currentRulesConfig[2].filter_relation = ''
        }
        return this.currentRulesConfig
      } else {
        return []
      }
    },
    visible() {
      this.currentRulesConfig.forEach(item => {
        if (item.keywords === '') {
          item.visible = true
        }
      })
      return this.currentRulesConfig.some(item => item.keywords === '')
    },
    close(data) {
      this.currentRulesConfig = this.currentRulesConfig.filter(item => {
        return data.some(val => {
          return val.object_attr_code === item.object_attr_code
        })
      })
    }
  }
}
</script>

<style lang="scss">
.same-object-attr{
  display: flex;
  width: 100%;
  max-width: 700px;
  background: #f7f7f9;
  margin-top: 8px;
  .left-panel {
    display: flex;
    flex: 1;
    padding: 20px 0 20px 20px;
    .object-property-filter-header {
      width: 70px;
      color: rgba(0,0,0,.7);
      padding-top: 5px;
    }
    .sortable-object-property {
      flex: 1;
      margin-left: 12px;
      z-index: 2;
      .sortable-item {
        height: 28px;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        .pane-content {
          position: relative;
          .content-wrapper {
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .relationship-configuration-wrapper {
      margin-right: 70px;
      .border2 {
        position: relative;
        top: 14px;
        width: 60px;
        height: 48px;
        border-right: 1px dotted #d8d8d8;
        border-bottom: 1px dotted #d8d8d8;
        &.border1 {
          border-top: 1px dotted #d8d8d8;
        }
        .radios-wrapper {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 10px;
          left: 10px;
          width: 104px;
          height: 28px;
          background: #e9ebf4;
          border-radius: 14px;
          .el-radio {
            margin-right: 5px;
          }
        }
      }
    }
  }
  .relationship-preview-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100px;
    padding: 12px 0;
    background: rgba(59,92,183,.1);
    >i {
      font-size: 38px;
      color: #71A5FC;
    }
    .configuration-boot {
      width: 85px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      background: #fff;
      cursor: pointer;
    }
  }
}
.popover-title {
  font-weight: 500px;
}
.icon-list {
  line-height: 28px;
  i {
    color:  #71A5FC;
    font-size: 25px!important;
    vertical-align: middle;
    &.font20 {
      font-size: 20px!important;
    }
  }
}
</style>
