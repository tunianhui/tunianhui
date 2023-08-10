<template>
  <div class="report-attr">
    <el-form label-width="90px">
      <div>
        <span class="op">报告生成时间：</span>
        <span class="op">{{data.oper_time}}</span>
      </div>
      <el-card class="report-box-card mt-10">
        <div class="basic-info">
          <div class="font-14">基本信息</div>
          <el-row>
            <el-col :span="12" style="line-height: 28px">
              <span class="op mr-10 ta">标签英文名</span>
              <OverflowTooltip class="w">{{data.label_code}}</OverflowTooltip>
            </el-col>
            <el-col :span="12" style="line-height: 28px">
              <span class="op mr-10 ta">标签名称</span>
              <OverflowTooltip class="w">{{data.label_name}}</OverflowTooltip>
            </el-col>
            <el-col :span="12" style="line-height: 28px">
              <span class="op mr-10 ta">命中ID数</span>
              <OverflowTooltip class="w"></OverflowTooltip>
            </el-col>
            <el-col :span="12" style="line-height: 28px">
              <span class="op mr-10 ta">结果表表名</span>
              <OverflowTooltip class="w">{{data.label_table}}</OverflowTooltip>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="report-box-card mt-10">
        <div class="basic-info">
          <div class="font-14">标签数据来源</div>
          <div v-for="(item, index) in datasource" :key="item.action">
            <el-row class="mt-10">
              <el-col :span="24" style="line-height: 28px">
                <span class="op mr-10 ta">行为</span>
                <OverflowTooltip class="w">{{item.action}}</OverflowTooltip>
              </el-col>
              <el-col :span="24" style="line-height: 28px">
                <span class="op mr-10 ta">对象属性</span>
                <OverflowTooltip class="w">{{item.obj_attr}}</OverflowTooltip>
              </el-col>
              <el-col :span="24" style="line-height: 28px">
                <span class="op mr-10 ta">时间跨度</span>
                <OverflowTooltip class="w">{{item.time}}</OverflowTooltip>
              </el-col>
            </el-row>
            <el-divider v-if="index !== datasource.length - 1"></el-divider>
          </div>
          <div class="expand-more">
            <i :class="['iconfont cp', toggle ? 'icon-shousuoshangjiantou' : 'icon-shousuoxiajiantou']" @click="toggle = !toggle"></i>
            <span class="ml-5" v-if="!toggle">展开更多 ({{tagDatasource.length - datasource.length}})</span>
            <span class="ml-5" v-else>收起</span>
          </div>
        </div>
      </el-card>
      <el-card class="report-box-card mt-10">
        <div class="basic-info">
          <div class="font-14 mb-20">标签分布 <span class="op font-12">仅展示覆盖用户百分比最多的前 30 个标签值及分布</span></div>
          <div class="label-distribution-boxs">
            <div class="label-distribution-box mr-10" v-for="item in labelDistribution" :key="item.label">
              <div class="label-title mb-5 font-14 op-0">
                <span>{{item.label}}</span>
              </div>
              <div class="label-des">
                <div class="fr">偏好度区间</div>
                <div class="fl">用户百分比</div>
              </div>
              <div class="label-distribution-content">
                <div class="total-percent">{{item.distribution}}</div>
                <div class="middle-container">
                  <div class="vertical-bar">
                    <div class="top-bar" :style="{height: `${(item.top.substring(0, item.top.length - 1) / 100) / (item.distribution.substring(0, item.distribution.length - 1) / 100) * activeHeight}px`}"></div>
                    <div class="middle-bar" :style="{height: `${(item.middle.substring(0, item.middle.length - 1) / 100) / (item.distribution.substring(0, item.distribution.length - 1) / 100) * activeHeight}px`}"></div>
                    <div class="bottom-bar" :style="{height: `${(item.bottom.substring(0, item.bottom.length - 1) / 100) / (item.distribution.substring(0, item.distribution.length - 1) / 100) * activeHeight}px`}"></div>
                  </div>
                  <div class="percent-wrapper">
                    <div class="percent-number">{{item.top}}</div>
                    <div class="percent-number">{{item.middle}}</div>
                    <div class="percent-number">{{item.bottom}}</div>
                  </div>
                </div>
                <div class="prefer-interval-percent">
                  <div class="prefer-interval">
                    <span class="top-square "></span>0.7~1.0
                  </div>
                  <div class="prefer-interval">
                    <span class="middle-square "></span>0.7~1.0
                  </div>
                  <div class="prefer-interval">
                    <span class="bottom-square "></span>0.7~1.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="report-box-card mt-10">
        <div class="basic-info">
          <div class="font-14 mb-20">结果表数据抽样 <span class="op font-12">抽样展示 5 条标签结果表数据</span></div>
          <div>
            <el-table class="singleTable" ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column property="zhibao" label="指标">
              </el-table-column>
              <el-table-column property="jilu1" label="记录1">
              </el-table-column>
              <el-table-column property="jilu2" label="记录2">
              </el-table-column>
              <el-table-column property="jilu3" label="记录3">
              </el-table-column>
              <el-table-column property="jilu4" label="记录4">
              </el-table-column>
              <el-table-column property="jilu5" label="记录5">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'ReportAttr',
  props: {
    data: Object
  },
  components: {
    OverflowTooltip
  },
  data () {
    return {
      tagDatasource: [
        {
          action: '电商0915-淘宝0915-购买0915-商品09151',
          obj_attr: '商品类目0915包含1',
          time: '30天'
        },
        {
          action: '电商0915-淘宝0915-购买0915-商品09152',
          obj_attr: '商品类目0915包含1',
          time: '30天'
        },
        {
          action: '电商0915-淘宝0915-购买0915-商品09153',
          obj_attr: '商品类目0915包含1',
          time: '30天'
        }
      ],
      toggle: false,
      activeHeight: 66,
      labelDistribution: [
        {
          label: '高价格',
          distribution: '90%',
          top: '53.3%',
          middle: '6.7%',
          bottom: '30%'
        },
        {
          label: '中价格',
          distribution: '70%',
          top: '43.3%',
          middle: '6.7%',
          bottom: '20%'
        },
        {
          label: '低价格',
          distribution: '70%',
          top: '70%',
          middle: '0%',
          bottom: '0%'
        }
      ],
      tableData: [
        {
          zhibao: 'ID_type',
          jilu1: '-',
          jilu2: '-',
          jilu3: '-',
          jilu4: '-',
          jilu5: '-'
        },
        {
          zhibao: 'ID_value',
          jilu1: '-',
          jilu2: '-',
          jilu3: '-',
          jilu4: '-',
          jilu5: '-'
        },
        {
          zhibao: 'confidence',
          jilu1: '-',
          jilu2: '-',
          jilu3: '-',
          jilu4: '-',
          jilu5: '-'
        },
        {
          zhibao: 'prefer',
          jilu1: '-',
          jilu2: '-',
          jilu3: '-',
          jilu4: '-',
          jilu5: '-'
        },
        {
          zhibao: 'count',
          jilu1: '-',
          jilu2: '-',
          jilu3: '-',
          jilu4: '-',
          jilu5: '-'
        }
      ]
    }
  },
  computed: {
    datasource () {
      let arr = []
      if (!this.toggle) {
        arr = this.tagDatasource.slice(0, 2)
      } else {
        arr = this.tagDatasource
      }
      return arr
    }
  }
}
</script>

<style lang="scss">
.report-attr {
  .op {
    opacity: .6;
  }
  .op-9 {
    opacity: .9;
  }
  .cp {
    cursor: pointer;
  }
  .w {
    width: calc(100% - 80px);
  }
  .ta {
    text-align: right;
    display: inline-block;
    width: 60px;
  }
  .report-box-card {
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
  .el-divider.el-divider--horizontal {
    margin: 5px 0 !important;
  }
  .expand-more {
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: rgba(0, 0, 0, .4);
    margin-top: 10px;
  }
  .label-distribution-boxs {
    display: flex;
    flex-wrap: wrap;
    .label-distribution-box {
      width: calc((100% - 30px) / 3);
      background: #eff1f5;
      padding: 12px;
      margin-bottom: 10px;
      .label-des {
        display: flex;
        justify-content: space-between;
        color: rgba(0, 0, 0, .4);
        margin-bottom: 5px;
      }
      .label-distribution-content {
        display: flex;
        justify-content: space-between;
        padding: 12px 6px;
        background: #fff;
        .total-percent {
          height: 66px;
          line-height: 66px;
          font-size: 15px;
          color: rgba(0, 0, 0, .9);
        }
        .middle-container {
          display: flex;
          .vertical-bar {
            height: 66px;
            width: 4px;
            margin: 0 5px;
            .top-bar {
              background: #50e3c2;
            }
            .middle-bar {
              background: #39b8ff;
            }
            .bottom-bar {
              background: #928ce5;
            }
          }
          .percent-wrapper {
            .percent-number {
              height: 22px;
              line-height: 22px;
              color: rgba(0, 0, 0, .9);
            }
          }
        }
        .prefer-interval-percent {
          .prefer-interval {
            height: 22px;
            line-height: 22px;
            color: rgba(0, 0, 0, .9);
            > span {
              display: inline-block;
              vertical-align: middle;
              width: 4px;
              height: 4px;
              margin-right: 2px;
            }
            .top-square {
              background: #50e3c2;
            }
            .middle-square {
              background: #39b8ff;
            }
            .bottom-square {
              background: #928ce5;
            }
          }
        }
      }
    }
  }
  .singleTable {
    th tr {
      background: $grey6;
    }
  }
}

</style>
