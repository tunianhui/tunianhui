<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-08-11 18:02:30
 * @LastEditTime: 2020-08-12 14:42:32
 * @Description:
-->
<template>
  <div class="step-config">
    <div class="step-config-collapse">
      <div class="step-config-collapse-step1">
        <div class="step-config-collapse-step1-header" @click="collapsed = !collapsed">
          <div class="step-header">
            <img :src="require('@/assets/images/rd/exreact/manual.png')" alt="" class="mr-15" />
            <div>
              <img :src="require('@/assets/images/rd/exreact/step1.png')" alt="">
              <div class="sub-title">数据来源及标签值配置</div>
              <div class="description">- 给每条行为设置标签值</div>
            </div>
            <i :class="[`el-icon-arrow-${collapsed ? 'up' : 'down'}`, 'step-icon']"></i>
          </div>
        </div>
        <div class="step-config-collapse-step1-body" :class="{'active' : collapsed}">
          <div class="body-box">
            <div class="step1-content">
              <div class="step-config-line"></div>
              <div class="step-config-content">
                <div class="step-content" v-for="(item,index) in configStep1" :key="item.id">
                  <div class="step-wrapper" v-if="index !== curIndex">
                    <div class="left-information">
                      <div class="label-info-item">
                        <OverflowTooltip style="width:200px">{{item.src_behavior_desc}}</OverflowTooltip>
                      </div>
                      <div class="label-info-item">
                        时间跨度：<OverflowTooltip style="width:150px">{{item.span_day}}</OverflowTooltip>
                      </div>
                      <div class="label-info-item">
                        打标方式：<OverflowTooltip style="width:150px">{{item.labeling_mode}}</OverflowTooltip>
                      </div>
                    </div>
                    <div class="right-edit-icon">
                      <i class="el-icon-edit-outline font-16" @click="editHandle(item, index)"></i>
                      <el-popover
                        placement="top"
                        :ref="`popover-${index}`"
                        trigger="click">
                        <p class="mb-10">{{'确定删除该配置项吗？'}}</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="_self.$refs[`popover-${index}`][0].doClose()">取消</el-button>
                          <el-button type="primary" size="mini" @click.stop="deleteStep1Item(item, index)">确定</el-button>
                        </div>
                        <div class="delete-icon" slot="reference">
                          <i class="el-icon-delete"></i>
                        </div>
                      </el-popover>
                    </div>
                    <div class="label-flag-container label-flag-container">
                      <OverflowTooltip class="label-flag-text" style="width:38px">来源{{index + 1}}</OverflowTooltip>
                    </div>
                  </div>
                  <div class="step-wrapper border" v-else>
                    <div class="curent-config">
                      <i class="el-icon-edit"></i>
                      <div>配置中...</div>
                    </div>
                  </div>
                </div>
                <div class="step-content" style="cursor: pointer;" v-if="!configStep1.length" @click="add">
                  <span>开始配置</span>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="step-content-btn">
                  <el-button type="primary" icon="el-icon-plus" :disabled="isConfiguring" @click="add">新增配置</el-button>
                  <span class="ml-7 font-12">{{configStep1.length ? configStep1.length : 1}}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       <div class="step-config-collapse-step1">
        <div class="step-config-collapse-step1-header" @click="collapsed1 = !collapsed1">
          <div :class="['step-header a186ff', configStep1.length > 0 && configStep1[0].source !== '' ? '' : 'active']">
            <img :src="require('@/assets/images/rd/exreact/manual2.png')" alt="" class="mr-15" style="width:61px" v-if="configStep1.length > 0 && configStep1[0].source !== ''" />
            <img :src="require('@/assets/images/rd/exreact/step2hui.png')" alt="" class="mr-15" style="width:61px" v-else />
            <div>
              <img :src="require('@/assets/images/rd/exreact/step2.png')" alt="">
              <div class="sub-title">标签生成规则配置</div>
              <div class="description">- 给用户打标</div>
            </div>
            <i :class="[`el-icon-arrow-${collapsed1 ? 'up' : 'down'}`, 'step-icon']"></i>
          </div>
        </div>
        <div class="step-config-collapse-step1-body" :class="{'active' : collapsed1}">
          <div class="body-box">
            <div class="step1-content">
              <div class="step-config-line"></div>
              <div class="step-config-content">
                <div class="step-content" v-if="configStep1.length > 0 && configStep1[0].source !== ''">
                  <div class="step-wrapper" v-if="curIndex1 === 0">
                    <div class="left-information">
                      <div class="label-info-item">
                        最终返回标签值个数：<OverflowTooltip style="width:100px">{{configStep2.label_num}}</OverflowTooltip>
                      </div>
                    </div>
                    <div class="right-edit-icon">
                      <i class="el-icon-edit-outline font-16" @click="step2Config"></i>
                    </div>
                  </div>
                  <div class="step-wrapper border" v-else>
                    <div class="curent-config">
                      <i class="el-icon-edit"></i>
                      <div>配置中...</div>
                    </div>
                  </div>
                </div>
                <div class="step-content" v-else style="opacity: 0.5;">
                  开始配置
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import {
  deleteLabelRuleConfigBySource
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'StepConfig',
  inheritAttrs: false,
  props: {
    data: Object,
    isConfiguring: Boolean
    // config: Array,
    // actived: Boolean
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      collapsed: false,
      collapsed1: false,
      configStep1: [],
      configStep2: {},
      curIndex: '',
      curIndex1: 0
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.configStep1 = val.step1
        this.configStep2 = val.step2
      }
    }
  },
  methods: {
    add() {
      this.configStep1.push({
        source: '',
        src_behavior_desc: '',
        src_behavior_id: '',
        span_day: '',
        src_filter_desc: '',
        labeling_mode: '',
        label_value: ''
      })
      this.curIndex = this.configStep1.length - 1
      this.$emit('add', 'add', 'step1')
    },
    async deleteStep1Item(item, index) {
      if (this.isConfiguring) return this.$message({type: 'warning', message: '请先完成当前配置项'})
      const res = await this.$simpleAsyncTo(deleteLabelRuleConfigBySource({src_behavior_id: item.src_behavior_id}), '删除失败')
      if (res) {
        this._self.$refs[`popover-${index}`][0].doClose()
        this.$emit('refresh')
      }
    },
    editHandle(item, index) {
      if (this.isConfiguring) return this.$message({type: 'warning', message: '请先完成当前配置项'})
      this.curIndex = index
      this.$emit('editHandle', item, 'edit', 'step1')
    },
    cancelConfig(flag) {
      if (flag === 'edit') {
        this.curIndex = ''
        this.curIndex1 = 0
      } else {
        this.curIndex = ''
        this.configStep1.splice(this.configStep1.length - 1, 1)
      }
    },
    step2Config() {
      if (this.curIndex !== '' || this.curIndex1 === 1) return this.$message({type: 'warning', message: '请先完成当前配置项'})
      this.curIndex1 = 1
      this.$emit('editHandle', this.configStep2, 'edit', 'step2')
    }
  }
}
</script>

<style lang="scss" scoped>
.step-config {
  overflow: auto;
  &-collapse {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #333;
    font-size: 12px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    background-color: #fafafa;
    border: 0;
    border-bottom: 0;
    border-radius: 4px;
    .step-header {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: #fff;
    }
    .description {
      font-size: 12px;
      color: hsla(0,0%,100%,.7);
    }
    .step-icon {
      font-size: 18px;
      margin: auto 0 auto auto;
      cursor: pointer;
    }
    &-step1 {
      margin-bottom: 5px;
      border: none;
      &-header {
        position: relative;
        // padding: 12px 16px;
        // padding-left: 40px;
        color: #1b2126;
        line-height: 22px;
        cursor: pointer;
        transition: all .3s;
        .step-header {
          @extend .step-header;
          background-color: #6ca0f5;
          &.a186ff {
            background-color: #a186ff;
            &.active {
              background-color: $grey6
            }
          }
        }
      }
      &-body {
        overflow: hidden;
        color: #333;
        background-color: transparent;
        border-top: 0;
        transition: all .3s;
        display: block;
        &.active {
          display: none;
        }
        .body-box {
          padding: 0;
          margin: 9px 0;
          .step1-content {
            display: flex;
          }
        }
      }
    }
  }
  .step-config-content {
    flex: 1;
    .step-content {
      height: 86px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: hsla(0,0%,85%,.2);
      margin-bottom: 9px;
      .step-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 8px 12px;
        .left-information {
          color: rgba(0,0,0,.7);
        }
        .right-edit-icon {
          height: 100%;
          width: 24px;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0 0 auto auto;
          color: rgba(0,0,0,.7);
          i {
            cursor: pointer;
          }
          .delete-icon {
            height: 24px;
            width: 24px;
            line-height: 24px;
            text-align: center;
            background: rgba(222,222,230,.91);
            display: none;
          }
        }
        .label-flag-container {
          position: absolute;
          top: -6px;
          left: 0;
        }
        .label-flag-container {
          display: inline-block;
          border: 1px solid #c8ddff;
          padding: 0 3px;
          background-color: #fff;
          height: 16px;
          line-height: 16px;
          .label-flag-text {
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: bottom;
            color: #6ca0f5;
          }
        }
        &.border {
          border-left: 4px solid  #6ca0f5;
          justify-content: center;
        }
        .curent-config {
          text-align: center;
        }
      }
      &:hover {
        .delete-icon {
          display: block!important;
        }
      }
    }
  }
  // &.is-active {
  //   // background: #6ca0f5;

  //   .step-config-card {
  //     // color: $grey1;
  //     background: #6ca0f5;
  //   }
  //   .step-config-main {
  //     color: $grey1;
  //     .step-config-main-card {
  //       display: flex;
  //       background-color: $grey8;
  //       .left-information {
  //         width: 100%;
  //         font-size: 12px;
  //         position: relative;
  //         display: flex;
  //         padding: 10px;
  //         color: rgba($color: #000000, $alpha: 0.6);
  //         .content {
  //           .tooltip-width {
  //             // width: calc(100% - );
  //             width: 200px;
  //           }
  //         }
  //         .edit-icon {
  //           height: 100%;
  //           width: 24px;
  //           text-align: right;
  //           display: flex;
  //           flex-direction: column;
  //           justify-content: space-between;
  //           margin: 0 0 auto auto;
  //           i {
  //             cursor: pointer;
  //           }
  //           >.delete-icon {
  //             height: 24px;
  //             width: 24px;
  //             line-height: 24px;
  //             text-align: center;
  //             background: rgba(222,222,230,.91);
  //             display: none;
  //           }
  //         }
  //       }
  //       &:hover {
  //         .delete-icon {
  //           display: block!important;
  //         }
  //       }
  //     }
  //   }
  // }

  // &-card {
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   padding: 10px 15px;
  //   background: #cbcdd7;
  //   cursor: pointer;

  //   img {
  //     width: 60px;
  //     margin-right: 15px;
  //   }

  //   &-right {
  //     flex: 1;
  //     h4 {
  //       font-size: 24px;
  //       color: $grey10;
  //     }
  //     .title {
  //       display: flex;
  //       justify-content: space-between;
  //       color: $grey9;
  //       font-size: 13px;

  //       i {
  //         font-weight: bold;
  //       }
  //     }
  //     p {
  //       color: $grey8;
  //       font-size: 12px;
  //       line-height: 20px;
  //     }
  //   }
  // }

  .step-config-line {
    display: flex;
    // height: 100%;
    // flex: 1;
    margin: 0 8px;
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

  // .el-button {
  //   border-radius: 0;
  //   &--info {
  //     background: #cbcdd7;
  //     border-color: #cbcdd7;
  //   }
  // }

  // &-main {
  //   display: flex;
  //   margin-bottom: 10px;
  //   overflow: hidden;
  //   color: $grey5;

  //   &-right {
  //     flex: 1;
  //     &-card {
  //       margin-top: 10px;
  //     }
  //     .flex-center {
  //       margin-top: 10px;
  //       height: 90px;
  //       background: $grey8;
  //       font-size: 13px;
  //       cursor: pointer;
  //     }
  //   }
  // }
}
</style>
