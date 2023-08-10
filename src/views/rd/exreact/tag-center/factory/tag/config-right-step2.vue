<template>
  <div class="config-step2 tag-config-wrapper-right">
    <div>
      <div class="step2-header">
        <div class="step2-title">标签生成规则配置
          <el-tooltip class="item" effect="dark" content="本步骤将确定对于每个用户最多返回的标签值个数，并对所有行为发生次数进行时间衰减和行为权重归一化计算配置，配置将影响每个标签值对应的用户偏好程度" placement="top">
            <i class="el-icon-info" style="color:rgba(0,0,0,.5)"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="label-number">
        <div class="config-title mb-10">
          <span class="error">*</span>
          返回标签值个数（最多）
          <el-tooltip class="item" effect="dark" content="每个标签下，对每个用户最多返回的标签值个数，最小值为1" placement="top">
            <i class="el-icon-info mr-10" style="color:rgba(0,0,0,.5)"></i>
          </el-tooltip>
          <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="1"></el-input-number>
        </div>
      </div>
      <div class="label-form-wrapper">
        <el-form ref="form" label-width="80px" class="form">
          <!-- <div class="right-part-form-wrapper">
            <div class="config-title mb-10">
              <span class="error">*</span>
              标签生成规则-衰减方式配置
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  <p>1）不同时间的行为对标签值的影响程度不同，一般认为，时间越近影响程度越大；</p>
                  <p>2）同一周期内行为的影响力相同，不同周期行为的影响力按照设置的衰减周期和曲线随时间递减；</p>
                  <p>3）对于标签值会随着行为快速变化的，建议选择较短的时间周期（如纸尿裤型号偏好）；对于标签值相对稳定，不随行为快速变化的，建议选择较长的时间周期（如预测个人肤质）</p>
                </div>
                <i class="el-icon-info mr-10" style="color:rgba(0,0,0,.5)"></i>
              </el-tooltip>
            </div>
            <div class="behavior-fliter-content">
              <div class="factory-label-step-wrapper">
                <div class="left-part">
                  <div class="step-header-number">1</div>
                  <div class="step-config-line"></div>
                </div>
                <div class="right-part mb-15">
                  <div class="config-title mb-10">
                    <span class="error mr-5">*</span>
                    选择衰减时间周期
                  </div>
                  <div :class="{'required':true, 'active':false}">
                    <span class="mr-5">衰减时间周期</span>
                    <el-select
                      v-model="cycle_day"
                      placeholder="请选择"
                      class="bus-select"
                      popper-class="bus-select-option">
                      <el-option
                        v-for="item in cycleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>

              <div class="factory-label-step-wrapper">
                <div class="left-part">
                  <div class="step-header-number">2</div>
                </div>
                 <div class="right-part mb-15">
                   <div class="config-title mb-10">
                    <span class="error mr-5">*</span>
                    请选择衰减时间曲线
                  </div>
                  <div class="config-box-item-content flex-layout">
                      <div
                        :class="
                          `timecurve ${
                            item.value ? 'is-active' : ''
                          }`
                        "
                        v-for="item in timeCurves"
                        :key="item.value"
                      >
                        <div class="timecurve-icon">
                          <i :class="`iconfont ${item.icon} label`"></i>
                        </div>
                        <div class="timecurve-content">
                          <div class="timecurve-content-wrap">
                            <p class="mb-10">
                              {{ item.label }}
                              <el-tooltip class="item" effect="dark" :content="item.tip" placement="top">
                                <i class="el-icon-warning-outline" style="color:rgba(0,0,0,.5)"></i>
                              </el-tooltip>
                            </p>
                            <p
                              class="label mb-2"
                              v-for="text in item.desc"
                              :key="text"
                            >
                              {{ text }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

            </div>
          </div> -->
          <div class="right-part-form-wrapper">
            <div class="config-title">
              <span class="error">*</span>
              标签生成规则-行为权重分配
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  <p>要求最多两位小数，且各项权重加和为 1；权重越大，表示该行为对最后标签值的影响越大</p>
                </div>
                <i class="el-icon-info mr-10" style="color:rgba(0,0,0,.5)"></i>
              </el-tooltip>
            </div>

            <div class="weight-distribution">
              <div class="weight-distribution-wrapper">
                <div class="weight-distribution-list">
                  <div class="weight-distribution-item mb-10" v-for="(item,index) in weightConfig" :key="item.rule_id">
                    <div class="weight-distribution-text">
                      <div class="category">
                        <span>{{item.source}}</span>
                      </div>
                      <OverflowTooltip style="width:135px">{{item.rule_name}}</OverflowTooltip>
                    </div>
                    <div class="weight-distribution-bar-background">
                      <div class="weight-distribution-bar" :style="{width: `${item.width}%`, left:`${item.left}%`}"></div>
                    </div>
                    <el-input
                      v-model="item.behavior_weight"
                      placeholder=""
                      class="bus-select mr-20"
                      style="width:60px"
                      :maxlength="4"
                      @input="((val) => {inputWeight(val, item, index)})"></el-input>
                    <span>{{item.one}}. </span>
                    <InputNumber
                      :value="item.two"
                      @input="((val) => {weightHandleChange(Number(val), item)})"
                      @reduce="reduceHandle(item, 'two')"
                      @plus="plusHandle(item, 'two')"></InputNumber>
                    <InputNumber
                      :value="item.three"
                      @input="((val) => {weightHandleChange1(Number(val), item)})"
                      @reduce="reduceHandle(item, 'three')"
                      @plus="plusHandle(item, 'three')"
                      ></InputNumber>
                  </div>

                </div>
                <div class="weight-sum-wrapper">
                  <div class="weight-sum-wrapper-title">当前权重和</div>
                  <div class="weight-sum">
                    {{weightNum}}
                    <span class="weight-standard">/1</span>
                  </div>
                  <div class="weight-sum-bar-background weight-sum-bar"></div>
                </div>
              </div>
            </div>

          </div>
<!-- 
          <div class="right-part-form-wrapper">
            <div class="config-title mb-20">
              <span class="error">*</span>
              标签生成规则-覆盖用户范围
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  <p>1）将用户按照所选行为发生次数升序排序，覆盖用户百分比为行为发生次数在某个值以下的用户占所有用户的百分比；</p>
                  <p> 2）仅对覆盖范围内的用户打标，以降低行为次数过少/过多等偶然情况对标签准确度的影响；</p>
                  <p>3）例：勾选行为为购买保湿类护肤品，10%的用户购买次数在3次以下，90%的用户购买次数在100次以下，选择范围为10%-90%，则只对购买次数在3次以上100次以下的用户打标，防止购买次数过少（3次以下）或过多（100次以上）对准确度的影响</p>
                </div>
                <i class="el-icon-info mr-10" style="color:rgba(0,0,0,.5)"></i>
              </el-tooltip>
              <span class="label">（根据已选择和预期标签值选择打标方式）</span>
            </div>

            <div class="behavior-fliter-content">
              <div class="config-title mb-10">
                <span class="mr-5">覆盖范围设定</span>
                <el-input-number
                  v-model="min"
                  controls-position="right"
                  @change="minRangeHandleChange"
                  :min="0"
                  :max="100"
                  style="width:90px"></el-input-number>%
                  <span class="mr-20 ml-20">~</span>
                <el-input-number
                  v-model="max"
                  controls-position="right"
                  @change="handleChange"
                  :min="min"
                  :max="100"
                  style="width:90px"></el-input-number>%
              </div>
            </div>
          </div> -->
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
                @click="confirm"
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
import OverflowTooltip from '@c/overflow-tooltip'
import InputNumber from './input-number'
import {
  labelGenerationRuleConfigSubmit
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'ConfigStep2',
  props: {
    data: Object,
    data1: Object
  },
  components: {
    OverflowTooltip,
    InputNumber
  },
  data() {
    return {
      num: 5,
      cycleOptions: [],
      cycle_day: '',
      timeCurves: [
        {
          icon: 'iconfont icon-zhixian',
          label: '平滑衰减',
          value: 'smooth',
          tip: '行为对标签值的影响不随时间衰减，如购买护肤品类型（个人肤质基本不变）',
          desc: ['行为对标签值的影响', '不随时间衰减']
        },
        {
          icon: 'iconfont icon-xianxingshuaijian',
          label: '线性衰减',
          value: 'linear',
          tip: '行为对标签值的影响随时间线性衰减，时间权重=1-(t/L)，如偏好音乐风格',
          desc: ['行为对标签值的影响', '随时间指数衰减', '权重=(1-t/L)']
        },
        {
          icon: 'iconfont icon-zhishushuaijian',
          label: '指数衰减',
          value: 'index',
          tip: '行为对标签值的影响随时间指数衰减，时间权重=exp(-t/L)，如购买纸尿裤类型',
          desc: ['行为对标签值的影响', '随时间指数衰减', '权重=exp(-t/L)']
        }
      ],
      weight: 0,
      count: 1,
      weightConfig: [],
      weightConunt: 0.00,
      min: 0,
      max: 0
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        const data = val.step2
        this.num = data.label_num || 5
        this.min = data.coverage_start
        this.max = data.coverage_end
        this.weightConfig = data.behaviorWeightData2.map((item, index) => {
          if (!item.behavior_weight) {
            item.behavior_weight = 0
          }
          let numArr = item.behavior_weight.toString().split('')
          numArr = numArr.filter(val => val !== '.')
          // const item = data[index]
          item.width = item.behavior_weight * 100
          if (index === 0) {
            item.left = 0
          }
          if (index > 0) {
            item.left = data.behaviorWeightData2[index - 1].width + data.behaviorWeightData2[index - 1].left
          }
          return {
            ...item,
            one: numArr[0] ? numArr[0] : 0,
            two: numArr[1] ? numArr[1] : 0,
            three: numArr[2] ? numArr[2] : 0
          }
        })
        this.weightConunt = this.weightConfig.reduce((p, e) => p + Number(e.behavior_weight), 0).toFixed(2)
      }
    }
  },
  computed: {
    weightNum() {
      return this.weightConfig.reduce((p, e) => p + Number(e.behavior_weight), 0).toFixed(2)
    }
  },
  methods: {
    inputWeight(val, row, index) {
      const prices = this.weightConfig.reduce((p, e) => p + Number(e.behavior_weight), 0)
      if (prices > 1) {
        return this.$message({
          type: 'error',
          message: '各项权重总和须为1，请重新输入！！！'
        })
      }
      let numArr = val.toString().split('')
      numArr = numArr.filter(v => v !== '.')
      row.one = numArr[0] || 0
      row.two = numArr[1] || 0
      row.three = numArr[2] || 0
      this.getPosition()
      // for (let i = 0; i < this.weightConfig.length; i++) {
      //   const item = this.weightConfig[i]
      //   item.width = item.behavior_weight * 100
      //   if (i === 0) {
      //     item.left = 0
      //   }
      //   if (i > 0) {
      //     item.left = this.weightConfig[i - 1].width + this.weightConfig[i - 1].left
      //   }
      // }
      // this.weightConunt = prices.toFixed(2)
    },
    weightHandleChange(val, row) {
      row.two = val
      row.behavior_weight = row.one + '.' + row.two + row.three
      const prices = this.weightConfig.reduce((p, e) => p + Number(e.behavior_weight), 0)
      if (prices > 1) {
        return this.$message({
          type: 'error',
          message: '各项权重总和须为1，请重新输入！！！'
        })
      }
      this.getPosition()
    },
    weightHandleChange1(val, row) {
      row.three = val
      row.behavior_weight = row.one + '.' + row.two + row.three
      const prices = this.weightConfig.reduce((p, e) => p + Number(e.behavior_weight), 0)
      if (prices > 1) {
        return this.$message({
          type: 'error',
          message: '各项权重总和须为1，请重新输入！！！'
        })
      }
      this.getPosition()
    },
    reduceHandle(item, flag) {
      if (flag === 'two') {
        if (Number(item.one) === 0 && item.two === 0) return
        if (Number(item.one) === 1 && item.two - 1 < 0) {
          item.one = item.one - 1
          item.two = 9
        } else {
          item.two = item.two - 1
        }
      } else {
        if (Number(item.one) === 0 && item.two === 0 && item.three === 0) return
        if (Number(item.one) === 1 && item.two === 0 && item.three - 1 < 0) {
          item.one = item.one - 1
          item.two = 9
          item.three = 9
        } else if (Number(item.one) === 0 && item.two > 0 && item.three - 1 < 0) {
          item.two = item.two - 1
          item.three = 9
        } else {
          item.three = item.three - 1
        }
      }
      item.behavior_weight = item.one + '.' + item.two + item.three
      this.getPosition()
      // for (let i = 0; i < this.weightConfig.length; i++) {
      //   const item = this.weightConfig[i]
      //   item.width = item.behavior_weight * 100
      //   if (i === 0) {
      //     item.left = 0
      //   }
      //   if (i > 0) {
      //     item.left = this.weightConfig[i - 1].width + this.weightConfig[i - 1].left
      //   }
      // }
    },
    plusHandle(item, flag) {
      if (Number(this.weightNum) >= 1) return
      if (flag === 'two') {
        item.two = Number(item.two) + 1
        if (item.two === 10) {
          item.one = Number(item.one) + 1
          item.two = 0
        }
      } else {
        if (item.two !== 10 && item.three === 10) {
          item.two = item.two + 1
          item.three = 0
        } else if (item.two === 10 && item.three === 10) {
          item.one = Number(item.one) + 1
          item.two = 0
          item.three = 0
        } else {
          item.three = item.three + 1
        }
      }
      item.behavior_weight = item.one + '.' + item.two + item.three
      this.getPosition()
      // for (let i = 0; i < this.weightConfig.length; i++) {
      //   const item = this.weightConfig[i]
      //   item.width = item.behavior_weight * 100
      //   if (i === 0) {
      //     item.left = 0
      //   }
      //   if (i > 0) {
      //     item.left = this.weightConfig[i - 1].width + this.weightConfig[i - 1].left
      //   }
    },
    getPosition() {
      for (let i = 0; i < this.weightConfig.length; i++) {
        const item = this.weightConfig[i]
        item.width = item.behavior_weight * 100
        if (i === 0) {
          item.left = 0
        }
        if (i > 0) {
          item.left = this.weightConfig[i - 1].width + this.weightConfig[i - 1].left
        }
      }
    },
    minRangeHandleChange(currentValue, oldValue) {
      if (currentValue >= this.max) {
        if (currentValue < 100) {
          this.max = currentValue + 1
        } else {
          this.max = 100
          this.min = 100
        }
      }
    },
    handleChange(currentValue, oldValue) {
      if (this.max >= 100) {
        this.max = 100
      }
    },
    async confirm() {
      if (Number(this.weightNum) !== 1) return this.$message({type: 'error', message: '各项权重总和须为1'})
      const behaviorWeightData = this.weightConfig.map(item => {
        return {
          rule_id: item.rule_id,
          behavior_weight: item.behavior_weight
        }
      })
      const params = {
        label_id: this.data1.id,
        label_num: this.num,
        coverage_start: this.min,
        coverage_end: this.max,
        behaviorWeightData: JSON.stringify(behaviorWeightData)
      }
      const res = await this.$simpleAsyncTo(labelGenerationRuleConfigSubmit(params), '保存失败')
      if (res) {
        this.$emit('confirm', '2')
      }
    },
    cancelConfig() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
.config-step2.tag-config-wrapper-right {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 678px;
  background: #f8f8f8;
  overflow-y: auto;
  >div {
    .step2-header {
      background: #fff;
      padding: 0 10px;
      .step2-title {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        color: rgba(0,0,0,.9);
        padding: 0 10px;
        border-bottom: 1px solid #ecebef;
      }
    }
    .label-number {
      height: 50px;
      line-height: 50px;
      background-color: $grey10;
      padding: 0 20px;
    }
    .label-form-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      .form {
        flex: 1;
        margin-bottom: 50px;
        .right-part-form-wrapper {
          padding: 20px 20px 0 20px;
          .behavior-fliter-content {
            background: $grey10;
            padding: 12px 20px;
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
          // .object-property-content {
          //   .tips-wrapper {
          //     display: flex;
          //     align-items: center;
          //     background: rgba(59,92,183,.1);
          //     color: rgba(0,0,0,.7);
          //     padding: 10px 20px;
          //     .left-icon {
          //       display: flex;
          //       flex-direction: column;
          //       justify-content: center;
          //       align-items: center;
          //       margin-right: 10px;
          //       >i {
          //         font-size: 16px;
          //         height: 16px;
          //         color: #3b5cb7;
          //       }
          //       .text {

          //       }
          //     }
          //     .labeling_mode {
          //       height: 40px;
          //       background: #d8d8d8;
          //       position: relative;
          //       top: -.06em;
          //       display: inline-block;
          //       width: 1px;
          //       // height: .9em;
          //       margin: 0 8px;
          //       vertical-align: middle;
          //     }
          //     .text-wrapper {
          //       background: rgba(59,92,183,.1);
          //       color: rgba(0,0,0,.7);
          //       padding: 10px 20px;
          //     }
          //   }
          // }
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
  }
  .el-input__inner {
    border-radius: 0;
  }
  .timecurve {
    width: 140px;
    outline: 1px solid transparent;
    cursor: pointer;
    margin-left: 15px;

    &.is-active {
      outline-color: $--color-primary;
    }

    &-icon {
      font-size: 50px;
      background: $--color-primary-light-1;
      text-align: center;
      .iconfont {
        color: $grey10;
      }
    }

    &-content {
      background: $grey8;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      &-wrap {
      }
    }
  }
  .weight-distribution {
    margin-top: 15px;
    padding: 20px;
    background: #fff;
    margin-bottom: 10px;
    &-wrapper {
      display: flex;
      align-items: center;
    }
    &-list {
      flex: 1;
    }
    &-item {
      display: flex;
      align-items: center;
      height: 28px;
    }
    &-text {
      width: 135px;
      height: 40px;
      .category {
        span {
          display: inline-block;
          border: 1px solid #c8ddff;
          height: 16px;
          padding: 0 3px;
          background-color: #fff;
          color: #6ca0f5;
        }
      }
    }
    .weight-distribution-bar-background {
      position: relative;
      flex: 1;
      height: 12px;
      background: rgba(59,92,183,.1);
      margin: 0 16px 0 12px;
      .weight-distribution-bar {
        position: absolute;
        top: 0;
        height: 100%;
        background: #2d98ff;
      }
    }
    .weight-sum-wrapper {
      width: 96px;
      padding-left: 20px;
      text-align: center;
      &-title {
        height: 24px;
        line-height: 24px;
        color: rgba(0,0,0,.4);
      }
      .weight-sum {
        font-size: 28px;
        color: rgba(0,0,0,.9);
        .weight-standard {
          font-size: 12px;
          color: rgba(0,0,0,.9);
          margin-left: 5px;
        }
      }
      .weight-sum-bar-background {
          position: relative;
          flex: 1;
          height: 4px;
          background: rgba(59,92,183,.1);
          margin: 0 16px 0 12px;
          &.weight-sum-bar {
            width: 76px;
            max-width: 76px;
            height: 4px;
            margin: 0;
            background: #2d98ff;
          }
        }
    }
  }
}
</style>
