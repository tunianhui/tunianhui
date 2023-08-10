<template>
  <div class="guide-wrapper">
    <div class="unfold-card import-model-card">
      <div class="unfold-card-icon">
        <img :src="require('@/assets/images/i1.png')" alt="">
      </div>
      <div class="unfold-card-text">
        <div class="unfold-card-text-header">
          <h3>导入预制模型</h3>
          <div class="unfold-card-subTitle">
            <a href="javascript:;">去导入 <i class="el-icon-arrow-right"></i></a>
          </div>
        </div>
        <span class="unfold-card-description">推荐您导入预制模型，快速体验 Dataphin 研发流程</span>
      </div>
    </div>
    <div v-loading="loading" class="loading">
      <div class="loading-wrapper">
        <div class="unfold-card import-model-card">
          <div class="unfold-card-icon">
            <img :src="require('@/assets/images/i2.png')" alt="">
          </div>
          <div class="unfold-card-text">
            <div class="unfold-card-text-header">
              <h3>新建流程引导</h3>
              <div class="unfold-card-subTitle">
                <a href="javascript:;"><i class="el-icon-refresh-right" style="font-size:14px"></i></a>
              </div>
            </div>
            <span class="unfold-card-description">引导您从零开始逐步完成数据规划与研发步骤</span>
          </div>
        </div>
        <el-steps direction="vertical" :active="1" class="step-parent">
          <template v-for="item in stepList">
            <el-step :key="item.title">
              <template slot="title">
                <div class="item-title">
                  {{ item.title }}
                  <div class="steps-item-subtitle">
                    <span class="icon-container" @click="item.showDescription = !item.showDescription">
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </div>
                </div>
              </template>
              <template slot="description">
                <div class="step-description">
                  <div>{{item.description}}</div>
                  <div class="step-item-content" v-show="item.showDescription">
                    <el-steps direction="vertical" :active="1" class="step-child">
                      <template v-for="subItem in item.children">
                        <el-step :key="subItem.title">
                          <template slot="icon">
                            <i class="iconfont icon-yikaiqi"></i>
                          </template>
                          <template slot="title">
                            <div class="item-title">
                              {{ subItem.title }}
                              <div class="steps-item-subtitle">
                                <span class="icon-container">
                                  <a href="javascript:;">去创建 <i class="el-icon-arrow-right"></i></a>
                                </span>
                              </div>
                            </div>
                          </template>
                          <template slot="description">
                            <span class="multi-line single-line">
                              <OverflowTooltip style="width:300px">{{ subItem.description }}</OverflowTooltip>
                            </span>
                          </template>
                        </el-step>
                      </template>
                    </el-steps>
                  </div>
                </div>
              </template>
            </el-step>
          </template>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@/components/overflow-tooltip'
export default {
  name: 'Guide',
  components: {
    OverflowTooltip
  },
  data() {
    return {
      loading: false,
      stepList: [
        {
          title: '规划数仓',
          description: '全局架构逻辑空间与物理空间的规划',
          showDescription: false,
          children: [
            {
              title: '创建数据板块(1 / 1)',
              description: '数据板块是逻辑空间的重要组成部分，是基于业务特征划分的命名空间。在使用规范建模前，您需要完成数据板块的创建。',
            },
            {
              title: '创建计算源(2 / 1)',
              description: '计算源用于绑定计算引擎项目和Dataphin项目，为Dataphin项目提供处理任务的计算源',
            },
            {
              title: '创建项目(2 / 1)',
              description: '项目是Dataphin的基本组织单元，是进行多用户隔离和访问控制的主要边界。在您开通Dataphin服务后，需要通过项目使用Dataphin。',
            },
            {
              title: '创建数据源(0 / 1)',
              description: '项目是Dataphin的基本组织单元，是进行多用户隔离和访问控制的主要边界。在您开通Dataphin服务后，需要通过项目使用Dataphin。',
            }
          ]
        },
        {
          title: '规范定义',
          description: '主题域设计及概念模型设计',
          showDescription: false,
          children: [
            {
              title: '创建主题域(1 / 1)',
              description: '主题域用于存放同一数据板块内不同意义的指标，如商品域、交易域、会员域等。在使用规范建模前，您需要完成主题域的创建。',
            },
            {
              title: '创建业务实体(0 / 1)',
              description: '业务实体包含业务对象和业务活动，为接下来的规范建模做准备。业务对象，是参与业务的人和物品, 也可以是纯粹的概念，比如: 消费者(人), 商品(物品)等。业务活动，是业务对象的变化行为或业务对象之间交互行为，比如: 访问行为, 销售行为等。',
            }
          ]
        },
        {
          title: '规范建模',
          description: '数据模型设计与研发',
          showDescription: false,
          children: [
            {
              title: '引入数据(0 / 1)',
              description: '将数据源的数据集成到您的工作空间',
            },
            {
              title: '创建维度逻辑表(0 / 1)',
              description: '维度逻辑表是一个业务对象的具体明细表实现，包含普通维度逻辑表、层级维度逻辑表、枚举维度逻辑表和虚拟维度逻辑表四种类型'
            },
            {
              title: '创建事实逻辑表(0 / 1)',
              description: '业务活动添加多个属性后生成事实逻辑表。包含单事务事实表、累积快照事实表和周期快照事实表三种类型'
            },
            {
              title: '创建原子指标(0 / 1)',
              description: '原子指标是对指标统计口径、具体算法的抽象，明确了计算逻辑，以提升研发效率'
            },
            {
              title: '创建业务限定(0 / 1)',
              description: '业务限定用于圈定统计的业务范围。'
            },
            {
              title: '创建派生指标(0 / 1)',
              description: '派生指标用于圈定原子指标统计业务的范围。'
            }
          ]
        },
        {
          title: '发布与运维',
          description: '数据验证、任务发布与运维',
          showDescription: false,
          children: [
            {
              title: '开发环境补数据',
              description: '在开发环境中对任务进行补数据以验证数据模型是否正确并符合预期，包括管道任务、维度逻辑表、事实逻辑表以及指标。',
            },
            {
              title: '验证数据',
              description: '通过即席查询来验证数据正确性，验证通过后即可发布对应的任务或模型至生产环境。',
            },
            {
              title: '发布任务',
              description: '发布开发环境的对象至生产环境，参与生产环境的运维调度。',
            },
            {
              title: '生产环境补数据',
              description: '发布至生产环境的数据次日才会参与调度。为了让您快速熟悉，采用补数据的方式，模拟生产环境调度任务生成实例。',
            },
            {
              title: '查看运行结果',
              description: '查看基于生产环境数据的任务运行结果是否符合预期。',
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-wrapper {
  overflow: auto;
  display: flex;
  padding: 0 20px;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  font-size: 12PX;
  line-height: normal;
  .unfold-card  {
    display: flex;
    padding-bottom: 20px;
    padding-top: 20px;
  }
  .import-model-card {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .unfold-card-icon {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    line-height: normal;
  }
  .unfold-card-text {
    flex: 1;
    width: 0;
    line-height: normal;
    .unfold-card-text-header {
      display: flex;
      justify-content: space-between;
      .unfold-card-subTitle {
      }
    }
  }
  .unfold-card-description {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
  img {
    vertical-align: middle;
    border-style: none;
    width: 40px;
    height: 40px;
  }
  h3 {
    margin-top: 0;
    margin-bottom: 0.5em;
    color: #1b2126;
    font-weight: 500;
  }
  .loading {
    height: 100%;
    .loading-wrapper {
      // height: 100%;
    }
  }
  .item-title {
    position: relative;
    padding-right: 16px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    // line-height: 32px;
    color: rgba(0,0,0,.85);
  }
  .steps-item-subtitle {
    cursor: pointer;
    color: rgba(0,0,0,.5);
    font-size: 12px;
    display: inline;
    margin-left: 8px;
    font-weight: 400;
  }
  .step-item-content {
    margin-top: 10px;
    opacity: 1;
    transition: all .3s;
  }
  .multi-line {
    width: calc(100% - 16px);
  }
  ::v-deep {
    .el-steps.step-parent {
      padding-left: 56px;
      margin-top: 20px;
      .el-step {
        flex-basis: initial!important;
        .el-step__head {
          width: 32px;
          border-width: 1px;
        }
        .el-step__line {
          left: 16px;
        }
        .el-step__icon {
          width: 32px;
          height: 32px;
          border-width: 1px;
        }
      }
      .el-step__description  {
        color: rgba(0,0,0,.5);
        font-size: 12px;
        padding-right: 0;
      }
    }
    .el-step.is-vertical .el-step__line {
      width: 1px;
    }
  }
  ::v-deep {
    .el-steps.step-child {
      .el-step__icon {
        border: none!important;
      }
      .el-step .el-step__line {
        display: block;
      }
      .el-step:last-of-type .el-step__line {
        display: none;
      }
    }
  }
}
</style>