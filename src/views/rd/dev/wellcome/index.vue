<template>
  <section class="wellcome">
    <!-- <h3 ref="head">欢迎使用{{$config.name}}</h3> -->
    <h3 ref="head">
      欢迎使用{{ $store && $store.getter ? $store.getter.title : '' }}
    </h3>
    <svg id="lines">
      <defs>
        <marker id="markerArrow" markerWidth="10" markerHeight="10" refX="10" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" :style="{fill: strokeColor}" />
        </marker>
        <marker id="markerArrowActived" markerWidth="10" markerHeight="10" refX="10" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" :style="{fill: strokeColorActive}" />
        </marker>
      </defs>
      <g />
    </svg>
    <div class="w-main" ref="main">
      <el-row v-for="item in list" :key="item.name" :gutter="10" :class="item.class" :type="item.class === 'sm-panel' ? 'flex' : ''" :style="{'margin-top': `${marginTop}px`}">
        <el-col :span="item.span || 4" :offset="item.offset || 0" :class="!item.image && 'flex-layout'" :id="item.name">
          <!-- 调度运维 -->
          <div v-if="item.image" class="flex-layout ops-box box">
            <img :src="require(`@/assets/images/rd/dev/${item.image}`)" alt />
            <div class="flex-1">
              <!-- <p>
                <span>{{item.label}}</span>
                <router-link :to="item.path" class="el-icon-d-arrow-right"></router-link>
              </p>-->
              <router-link tag="p" :to="item.path">
                <span>{{ item.label }}</span>
                <i class="el-icon-d-arrow-right"></i>
              </router-link>
              <p class="brief">{{ item.brief }}</p>
            </div>
          </div>
          <!-- <div v-else class="module">
            <span><i :class="item.icon"></i>&nbsp; {{item.label}}</span>
            <router-link :to="item.path" class="el-icon-d-arrow-right"></router-link>
          </div>-->
          <router-link tag="div" class="module" :to="item.path" v-else>
            <span>
              <i :class="item.icon"></i>
              &nbsp; {{ item.label }}
            </span>
            <i class="el-icon-d-arrow-right"></i>
          </router-link>
        </el-col>
        <template v-if="!item.wrap">
          <el-col v-for="child in item.children" :key="child.name" :span="4" :offset="child.offset || 0" :id="child.name">
            <div class="lg-box box">
              <div class="box-content">
                <div class="box-label">
                  <div class="img">
                    <img :src="require(`@/assets/images/rd/dev/${child.image}`)" alt />
                  </div>
                  <p>{{ child.label }}</p>
                </div>
                <div class="box-brief">{{ child.brief }}</div>
              </div>
              <div class="box-controls">
                <span v-for="control in child.controls" :key="control.icon">
                  <el-popover popper-class="dark-popper" placement="bottom" trigger="hover" v-if="control.list">
                    <ul class="popper-list">
                      <li v-for="item in control.list" :key="item.tip" class="pl-15 pr-15" @click="iconControl(item)">
                        {{ item.tip }}
                      </li>
                    </ul>
                    <i :class="control.icon" slot="reference"></i>
                  </el-popover>
                  <i :class="control.icon" :title="item.tip" v-else @click="iconControl(control)"></i>
                </span>
                <!-- <i
                  v-for="control in child.controls"
                  :class="control.icon"
                  :key="control.icon"
                  :title="control.tip"
                  @click="iconControl(control)"
                ></i>-->
              </div>
            </div>
          </el-col>
        </template>
        <el-col v-else :span="24 - (item.span || 4)">
          <el-row :gutter="10">
            <el-col v-for="child in item.children" :key="child.name" :span="6" :offset="child.offset || 0" :class="child.class">
              <div class="sm-box box clearfix">
                <span>{{ child.label }}</span>
                <span class="box-controls fr">
                  <i v-for="control in child.controls" :class="control.icon" :key="control.icon" :title="control.tip" @click="iconControl(control)"></i>
                </span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="overlay" id="overlay1">自动创建</div>
      <div class="overlay" id="overlay2">智能计算</div>
      <div class="overlay" id="overlay3">运行</div>
    </div>
  </section>
</template>

<script>
import wellcomeMixin from '../../wellcome-mixin'
import { types } from '@/config/rd-config'

export default {
  name: 'DevWellcome',
  mixins: [wellcomeMixin],
  data () {
    let id = Date.now()
    return {
      list: [
        {
          label: '规范定义',
          name: 'normDefine',
          class: 'lg-panel',
          icon: 'iconfont icon-guifan',
          path: '/rd/dev/norm-define/dimension',
          children: [
            {
              label: '维度',
              name: types.DIMENSION,
              image: 'dimension.png',
              brief:
                '维度是由独立不重叠的数据元素组成的数据集，所构成的可进行统计的对象。常见的如人、产品、地点。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建维度',
                  tab: {
                    label: '新建维度',
                    name: `new_dimension_${id++}`,
                    tabType: types.DIMENSION,
                    component: 'DimensionEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/norm-define/dimension',
                  tip: '跳转至维度'
                }
              ]
            },
            {
              label: '业务过程',
              name: types.FACT, // 'fact',
              image: 'fact.png',
              brief:
                '业务过程代表一个被管理实体或系统的事实，是对业务活动单元/事件的定义。常见的如下单、支付。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建业务过程',
                  dialog: {
                    title: '新建业务过程',
                    component: 'FactEdit'
                  }
                  // tab: {
                  //   label: '新建业务过程',
                  //   name: `new_fact_${id++}`,
                  //   tabType: types.FACT,
                  //   component: 'FactEdit'
                  // }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/norm-define/fact',
                  tip: '跳转至业务过程'
                }
              ]
            },
            {
              label: '业务限定',
              name: types.LIMIT,
              image: 'limit.png',
              brief:
                '业务限定是对业务中圈选的统计范围的定义，与SQL中where条件等价。常见的如女买家、已支付。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建业务限定',
                  tab: {
                    label: '新建业务限定',
                    name: `new_limit_${id++}`,
                    tabType: types.LIMIT,
                    component: 'LimitEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/norm-define/limit',
                  tip: '跳转至业务限定'
                }
              ]
            },
            {
              label: '原子指标',
              name: types.ATOM,
              image: 'atom.png',
              brief:
                '原子指标是对业务事实中度量的统计定义，与SQL中select内容等价。常见的如支付金额、买家数。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  list: [
                    {
                      tip: '新建原子指标',
                      tab: {
                        label: '新建原子指标',
                        name: `new_atom_${id++}`,
                        tabType: types.ATOM,
                        component: 'AtomEdit'
                      }
                    },
                    {
                      tip: '新建衍生原子指标',
                      dialog: {
                        title: '新建衍生原子指标',
                        component: 'DeriveAtomEdit'
                      }
                    }
                  ]
                  // tip: '新建原子指数',
                  // tab: {
                  //   label: '新建原子指数',
                  //   name: `new_atom_${id++}`,
                  //   tabType: types.ATOM,
                  //   component: 'AtomEdit'
                  // }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/norm-define/atom',
                  tip: '跳转至原子指数'
                }
              ]
            },
            {
              label: '派生指标',
              name: types.DERIVE,
              image: 'derive.png',
              brief:
                '派生指标即常规的统计指标，通过原子指标与各种业务限定的组合而生成。如最近一天买家支付金额。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建派生指标',
                  tab: {
                    label: '新建派生指标',
                    name: `new_derive_${id++}`,
                    tabType: types.DERIVE,
                    component: 'DeriveEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/norm-define/derive',
                  tip: '跳转至派生指标'
                }
              ]
            }
          ]
        },
        {
          label: '数据建模',
          name: 'modeling',
          class: 'lg-panel',
          icon: 'iconfont icon-shujujianmo',
          path: '/rd/dev/modeling/dimension-table',
          children: [
            {
              label: '维度逻辑表',
              name: types.DIMENSIONTABLE,
              image: 'dimension-table.png',
              brief:
                '描述对应维度属性的数据仓库模型，包含逻辑结构、存储方式、组织方式和操作方式等内容。',
              controls: [
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/modeling/dimension-table',
                  tip: '跳转至维度逻辑表'
                }
              ]
            },
            {
              label: '事实逻辑表',
              name: types.FACTTABLE,
              image: 'fact-table.png',
              brief:
                '描述某个事实（即业务过程）属性的数据仓库模型，包含逻辑结构、存储方式、组织方式和操作方式等内容。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建事实逻辑表',
                  dialog: {
                    title: '新建事实逻辑表',
                    component: 'FactTableCreate'
                  }
                  // tab: {
                  //   label: '新建事实逻辑表',
                  //   name: `new_factTable_${id++}`,
                  //   tabType: types.FACTTABLE,
                  //   component: 'FactTableEdit'
                  // }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/modeling/fact-table',
                  tip: '跳转至事实逻辑表'
                }
              ]
            },
            {
              label: '汇总逻辑表',
              name: types.POLYMERTABLE,
              image: 'polymer-table.png',
              brief:
                '描述维度统计信息（即派生指标）及维度属性信息的数据集合集，所构成的数据仓库模型。',
              offset: 8,
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建汇总逻辑表',
                  dialog: {
                    title: '新建汇总逻辑表',
                    component: 'PolymerTableCreate'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/modeling/polymer-table',
                  tip: '跳转至汇总逻辑表'
                }
              ]
            }
          ]
        },
        {
          label: '运维调度',
          name: 'ops',
          class: 'ops-panel',
          offset: 4,
          span: 12,
          image: 'ops.png',
          path: '/rd/ops/task/period',
          brief:
            '运行及维护逻辑表和数据产生的数据任务，以确保所有的任务都有按照时间正确有序地生产数据。'
        },
        {
          label: '数据处理',
          name: 'dataProcess',
          class: 'sm-panel',
          icon: 'iconfont icon-shujuchuli',
          path: '/rd/dev/data-process/code-task',
          // 是否换行显示
          wrap: true,
          // children: Array.from({length: 7}, (item, index) => {
          //   return {
          //     label: 'Maxcompute SQL',
          //     name: `dataProcess${index}`,
          //     span: 6,
          //     controls: [
          //       {
          //         icon: 'el-icon-document-add',
          //         tip: '新建Maxcompute SQL',
          //         tab: {
          //           label: '新建 Maxcompute SQL',
          //           name: `new_MaxcomputeSQL_${id++}`,
          //           tabType: 'sql',
          //           component: 'MaxcomputeEdit'
          //         }
          //       }
          //     ]
          //   }
          // })
          children: [
            {
              label: 'SHEELL',
              name: 'SHEELL',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建SHELL',
                  dialog: {
                    component: ''
                  }
                }
              ]
            },
            {
              label: 'SPARK',
              name: 'SPARK',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建SPARK',
                  dialog: {
                    component: ''
                  }
                }
              ]
            },
            {
              label: '函数',
              name: 'func',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建函数',
                  dialog: {
                    title: '新建函数',
                    component: 'FuncManageEdit'
                  }
                }
              ]
            },
            {
              label: '资源',
              name: 'source',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建资源',
                  dialog: {
                    title: '新建资源',
                    component: 'SourceManageEdit'
                  }
                }
              ]
            }
          ]
        },
        {
          label: '即席查询',
          name: 'adSearch',
          class: 'sm-panel',
          icon: 'iconfont icon-xinzengyudingicon-',
          path: '/rd/dev/ad-search',
          // 是否换行显示
          wrap: true,
          children: [
            {
              label: 'SQL 查询',
              name: 'sqlSearch',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建SQL查询',
                  dialog: {
                    title: '新建SQL查询',
                    component: 'AdSearchNewFile'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/dev/ad-search',
                  tip: '跳转至SQL查询'
                }
              ]
            }
          ]
        }
      ],
      lines: [
        {
          source: types.DIMENSION,
          target: types.DERIVE,
          arrow: false,
          dir: 'top-top'
        },
        {
          source: types.DIMENSION,
          target: types.DIMENSIONTABLE,
          arrow: true,
          dir: 'bottom-top',
          overlay: 'overlay1'
        },
        {
          source: types.FACT,
          target: types.FACTTABLE,
          arrow: true,
          dir: 'bottom-top'
        },
        {
          source: types.LIMIT,
          target: types.DERIVE,
          arrow: false,
          dir: 'top-top'
        },
        { source: types.ATOM, target: types.DERIVE, arrow: true, dir: 'top-top' },
        {
          source: types.FACTTABLE,
          target: types.LIMIT,
          arrow: true,
          dir: 'right-bottom'
        },
        {
          source: types.FACTTABLE,
          target: types.ATOM,
          arrow: true,
          dir: 'right-bottom'
        },
        {
          source: types.DERIVE,
          target: types.POLYMERTABLE,
          arrow: true,
          dir: 'bottom-top'
        },
        {
          source: 'modeling',
          target: 'ops',
          arrow: true,
          dir: 'bottom-left',
          overlay: 'overlay2'
        },
        {
          source: 'dataProcess',
          target: 'ops',
          arrow: true,
          dir: 'top-right',
          overlay: 'overlay3'
        }
      ]
    }
  }
}
</script>

<style lang="scss"></style>
