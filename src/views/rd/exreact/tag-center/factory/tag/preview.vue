<template>
  <div class="tag-config-wrapper-right">
    <div class="preview-box">
      <div class="preview-box-header">
        <div class="back" style="cursor: pointer;" @click="backHandle">
          <i class="el-icon-arrow-left"></i>返回
        </div>
        <ul>
          <li :class="{'mr-50':true, 'active':isClass === 'preview'}" @click="isClass='preview'">标签配置预览</li>
          <li :class="{'active':isClass === 'report'}" @click="isClass='report'">查看标签报告</li>
        </ul>
        <div>
          <i class="el-icon-close" style="cursor: pointer;" @click="backHandle"></i>
        </div>
      </div>

      <div class="preview-box-content" v-if="isClass === 'preview'">
        <div class="label-configuration-preview">
          <div class="step-header">
            <img :src="require('@/assets/images/rd/exreact/step_1.png')" alt="" class="mr-5">
            数据来源及标签配置
          </div>

          <div class="step-content-wrapper" v-for="item in step1" :key="item.src_behavior_id">
            <div class="step1-content">
              <div class="step-container">
                <div class="step-nav">数据来源</div>
                <div class="content-row">
                  <div class="left-title">
                    <div class="title">行为</div>
                    <div class="title">筛选条件</div>
                  </div>
                  <div class="right-content">
                    <div class="content">
                      <OverflowTooltip class="width-1">{{item.src_behavior_desc}}</OverflowTooltip>
                    </div>
                    <div class="line"></div>
                    <div class="content">
                      <OverflowTooltip class="width-1">{{item.src_filter_desc}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
                <div class="line1"></div>
                <div class="time-span">
                  <div class="title">时间跨度</div>
                  <div class="time">{{item.span_day}}</div>
                </div>
              </div>

              <div class="step-container">
                <div class="step-nav">标签值</div>
                <div class="content-row">
                  <div class="left-title">
                    <div class="title">打标方式</div>
                    <div class="title">标签值</div>
                  </div>

                  <div class="right-content">
                    <div class="content">
                      <OverflowTooltip class="width-1">{{item.labeling_mode}}</OverflowTooltip>
                    </div>
                    <div class="line"></div>
                    <div class="content">
                      <OverflowTooltip class="width-1">{{item.label_value}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="step-header">
            <img :src="require('@/assets/images/rd/exreact/step_2.png')" alt="" class="mr-5">
            标签生成规则配置
          </div>

          <div class="step-content-wrapper">
            <div class="step1-content">
              <el-row>
                <el-col>
                  <span class="title text">返回标签值个数（最多）</span> {{step2.label_num}}
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <span class="title text" style="vertical-align: top;">行为权重</span>
                  <div class="content-text">
                    <div class="content-text-item mb-10" v-for="item in step2.behaviorWeightData1" :key="item.source">
                      <div class="text-flag">
                        <div class="label-flag-container">
                          <span class="label-flag-text">{{item.source}}</span>
                        </div>
                      </div>
                      <span>
                        <OverflowTooltip class="width-1">{{item.rule_name}}</OverflowTooltip>
                      </span>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col>
                  <span class="title text">覆盖用户范围</span> {{`${step2.coverage_start}% ~ ${step2.coverage_end}%`}}
                </el-col>
              </el-row> -->
            </div>
          </div>
        </div>
      </div>
      <div class="preview-box-content" v-if="isClass === 'report'">
        <ReportAttr :data="data"></ReportAttr>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryLabelConfigurationPreview
} from '@/api/rd/exreact/tag-center'
import OverflowTooltip from '@c/overflow-tooltip'
import ReportAttr from '../report-attr'
export default {
  name: 'PreviewConfig',
  props: {
    data: Object
  },
  components: {
    OverflowTooltip,
    ReportAttr
  },
  data () {
    return {
      isClass: 'preview',
      stepCard: {},
      step1: [],
      step2: {}
    }
  },
  created () {
    this._queryLabelConfigurationPreview()
  },
  methods: {
    async _queryLabelConfigurationPreview () {
      const params = {
        label_id: this.data.id
      }
      const res = await this.$simpleAsyncTo(queryLabelConfigurationPreview(params), '获取数据失败')
      if (res) {
        this.stepCard = res.data
        this.step1 = res.data.step1
        this.step2 = res.data.step2
      }
    },
    backHandle () {
      this.$emit('confirm', 'preview')
    }
  }
}
</script>

<style lang="scss">
.preview-box {
  &-header {
    display: flex;
    align-items: center;
    height: 42px;
    color: rgba(0, 0, 0, .7);
    background: #fff;
    padding: 0 12px;
    border-bottom: 1px solid #ecebef;
    > ul {
      display: flex;
      justify-content: center;
      flex: 1;
      line-height: 42px;
      border-bottom: none;
      > li {
        border-bottom: 2px solid transparent;
        cursor: pointer;
        &.active {
          border-bottom-color: #0c4cff;
        }
      }
    }
  }
  &-content {
    padding: 20px;
    .label-configuration-preview {
      .step-header {
        color: rgba(0, 0, 0, .9);
        margin-bottom: 10px;
        img {
          vertical-align: bottom;
        }
      }
      .step-content-wrapper {
        background: #fff;
        padding: 20px 16px;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        .step1-content {
          .title {
            width: 48px;
            height: 28px;
            line-height: 28px;
            text-align: right;
            color: rgba(0, 0, 0, .4);
            margin-right: 20px;
            &.text {
              text-align: right;
              flex-shrink: 0;
              width: 140px;
              display: inline-block;
            }
          }
          .step-container {
            display: flex;
            height: 56px;
            &:not(:last-child) {
              margin-bottom: 20px;
            }
            .step-nav {
              width: 18px;
              height: 100%;
              display: flex;
              align-items: center;
              line-height: 14px;
              text-align: center;
              color: rgba(0, 0, 0, .4);
              background: hsla(0, 0%, 85%, .2);
              border: 1px solid #d8d8d8;
              margin-right: 15px;
            }
            .content-row {
              flex: 1;
              display: flex;
              align-items: center;
              overflow: hidden;
              .right-content {
                flex: 1;
                color: rgba(0, 0, 0, .9);
                overflow: hidden;
                .content {
                  height: 28px;
                  line-height: 28px;
                }
                .line {
                  display: block;
                  clear: both;
                  width: 100%;
                  min-width: 100%;
                  height: 1px;
                  margin: 0;
                  background: #e8e8e8;
                }
              }
            }
            .line1 {
              position: relative;
              top: -.06em;
              display: inline-block;
              width: 1px;
              background: #e8e8e8;
              height: 54px;
              margin: 0 15px 0 20px;
            }
            .time-span {
              width: 60px;
              height: 20px;
            }
          }
        }
        .content-text {
          color: rgba(0, 0, 0, .9);
          display: inline-block;
          &-item {
            display: flex;
            .text-flag {
              width: 48px;
              flex-shrink: 0;
              .label-flag-container {
                position: relative;
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
            }
          }
        }
      }
    }
  }
  .width-1 {
    width: calc(100% - 30px);
  }
}

</style>
