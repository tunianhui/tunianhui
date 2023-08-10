<template>
  <section class="wellcome">
    <h3 ref="head">
      欢迎使用{{ $store && $store.getters ? $store.getters.title : '' }}数据萃取
    </h3>
    <svg id="lines">
      <defs>
        <marker
          id="markerArrow"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" :style="{fill: strokeColor}" />
        </marker>
        <marker
          id="markerArrowActived"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path
            d="M2,2 L10,6 L2,10 L6,6 L2,2"
            :style="{fill: strokeColorActive}"
          />
        </marker>
      </defs>
      <g></g>
    </svg>
    <div class="w-main split-main" ref="main">
      <div class="main-left">
        <el-row class="large-panel p-10" :style="`margin-top: ${marginTop}px;`">
          <el-col :span="4" class="flex-layout prev-col">
            <div class="module">
              <span><i :class="centreIcon"></i>&nbsp; 行为中心</span>
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="flex-layout">
              <Box
                v-for="item in behaviorElements"
                :key="item.label"
                :data="item"
                @control="iconControl"
              />
            </div>
            <el-row class="mt-15">
              <el-col :offset="4" :span="7">
                <InlineBox :data="regular" @control="iconControl" />
              </el-col>
              <el-col :offset="6" :span="7">
                <InlineBox :data="behaviorBoard" @control="iconControl" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="large-panel p-10" :style="`margin-top: ${marginTop}px;`">
          <el-col :span="4" class="flex-layout prev-col">
            <div class="module">
              <span><i :class="tagIcon"></i>&nbsp; 标签中心</span>
              <i class="el-icon-d-arrow-right"></i>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="flex-layout">
              <Box
                v-for="item in tags"
                :key="item.label"
                :data="item"
                @control="iconControl"
              />
            </div>
            <el-row class="mt-15">
              <el-col :offset="17" :span="7">
                <InlineBox :data="tagBoard" @control="iconControl" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          class="large-panel p-10"
          :style="`margin-top: ${marginTop}px;`"
          id="dataphinImg"
        >
          <img src="@/assets/images/logo.png" height="80" alt="" />
        </el-row>
      </div>
      <div class="main-right">
        <div class="exreact-ops-box" id="opsBox">
          <img src="@/assets/images/rd/exreact/ops.png" alt="" />
          <p class="mb-10">
            <span>运维调度</span>
            <i class="el-icon-d-arrow-right"></i>
          </p>
          <p>
            运行及维护逻辑表和数据产生的数据任务，以确保所有的任务都有按照时间正确有序地生产数据。
          </p>
        </div>
      </div>

      <div class="overlay" id="overlay1" style="margin-top: 24px;">依赖</div>
    </div>
  </section>
</template>

<script>
import wellcomeMixin from '../../wellcome-mixin'
import {types, iconMap} from '@/config/rd-config'
import {capitalize} from '@/libs/util'
import {mapGetters} from 'vuex'
// import { getRect } from '@/libs/dom'

const InlineBox = {
  name: 'InlineBox',
  props: {
    data: Object
  },
  render(h) {
    const {controls, image, label, name, brief} = this.data
    return (
      <div class="inline-box" id={name}>
        <div class="inline-box-wrap flex-layout">
          <img
            src={require(`@/assets/images/rd/exreact/${image}`)}
            alt={label}
          />
          <div class="flex-center flex-column ml-20">
            <p class="mb-5">{label}</p>
            <div class="box-controls">
              {controls.map(control => (
                <i
                  class={control.icon}
                  key={control.icon}
                  title={control.tip}
                  on-click={e => this.$emit('control', control)}
                />
              ))}
            </div>
          </div>
          {brief ? <div class="brief">{brief}</div> : null}
        </div>
      </div>
    )
  }
}

const Box = {
  name: 'Box',
  props: {
    data: Object
  },
  render(h) {
    const {type} = this.data,
      mapTypes = {
        box: 'renderBox',
        split: 'renderSplit',
        arrow: 'renderArrow',
        divider: 'renderDivider',
        label: 'renderLabel'
      }
    return this[mapTypes[type]](h)
  },
  methods: {
    renderBox(h) {
      const {label, image, brief, controls, name} = this.data
      return (
        <div class="lg-box box flex-1 box-ele" id={name}>
          <div class="box-content">
            <div class="box-label">
              <div class="img">
                <img
                  src={require(`@/assets/images/rd/exreact/${image}`)}
                  alt={label}
                />
              </div>
              <p>{label}</p>
            </div>
            {brief ? <div class="box-brief">{brief}</div> : null}
          </div>
          <div class="box-controls mb-5">
            {controls.map(control => (
              <i
                class={control.icon}
                key={control.icon}
                title={control.tip}
                on-click={e => this.$emit('control', control)}
              />
            ))}
          </div>
        </div>
      )
    },
    renderSplit(h) {
      return (
        <div class="box-split" id={this.data.name}>
          <div class="split-line" />
        </div>
      )
    },
    renderArrow(h) {
      return <div style="width: 15px;" />
    },
    // renderArrow(h) {
    //   return (
    //     <div class="box-arrow">
    //       <i class="el-icon-right" />
    //     </div>
    //   )
    // },
    renderDivider(h) {
      return (
        <div class="box-divider" id={this.data.name}>
          <i class="iconfont icon-xiexian" />
        </div>
      )
    },
    renderLabel(h) {
      const {label, class: classname, name} = this.data
      return (
        <div class={`vertical-label ${classname}`} id={name}>
          {label}
        </div>
      )
    }
  }
}

export default {
  name: 'ExreactWellcome',
  mixins: [wellcomeMixin],
  components: {
    Box,
    InlineBox
  },
  data() {
    // let id = Date.now()
    return {
      length: 8,
      centreIcon: iconMap[types.CENTRE].icon,
      tagIcon: iconMap[types.FACTORY].icon,
      behaviorElements: [
        {
          label: '行为元素',
          type: 'label',
          class: 'p-20',
          name: 'behaviorElement'
        },
        {
          label: '行为域',
          type: 'box',
          name: types.DOMAIN,
          image: 'domain.png',
          brief: '聚合业务含义一致的行为数据，如电商域、文娱域。',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建行为域',
              dialog: {
                title: '新建行为域',
                component: 'DomainEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/behavior-center/element/domain-bus',
              tip: '跳转至行为域'
            }
          ]
        },
        {
          type: 'split'
        },
        {
          label: '业务线',
          type: 'box',
          name: types.BUS,
          image: 'bus.png',
          brief:
            '基于行为域将行为数据进一步细分，各业务线之间相对独立，如淘宝业务线、天猫业务线。',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建业务线',
              dialog: {
                title: '新建业务线',
                component: 'BusEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/behavior-center/element/domain-bus',
              tip: '跳转至业务线'
            }
          ]
        },
        {
          type: 'split'
        },
        {
          label: '动作',
          type: 'box',
          name: types.ACTION,
          image: 'action.png',
          brief: '行为主体发出的操作，如购买、浏览。',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建动作',
              dialog: {
                title: '新建动作',
                component: 'ActionEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/behavior-center/element/action',
              tip: '跳转至动作'
            }
          ]
        },
        {
          type: 'split'
        },
        {
          label: '对象',
          type: 'box',
          name: types.OBJECT,
          image: 'object.png',
          brief: '行为主体操作的具体事物，如商品、电影。',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建对象',
              dialog: {
                title: '新建对象',
                component: 'ObjectEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/behavior-center/element/object',
              tip: '跳转至对象'
            }
          ]
        },
        {
          type: 'split'
        },
        {
          label: '对象属性',
          type: 'box',
          name: types.OBJECTATTR,
          image: 'object-attr.png',
          brief: '对象的描述性信息，如名称、品牌、年份。',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建对象属性',
              dialog: {
                title: '新建对象属性',
                component: 'ObjectAttrEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/behavior-center/element/object-attr',
              tip: '跳转至对象属性'
            }
          ]
        }
      ],
      tags: [
        {
          label: '手工标签',
          type: 'box',
          name: types.MANUAL,
          image: 'manual.png',
          brief: '从物理表引入的手工开发的标签',
          controls: [
            {
              icon: 'iconfont icon-zhihang',
              tip: '新建手工标签'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'label',
          label: '标签工厂',
          class: 'p-5'
        },
        {
          label: '工厂标签',
          type: 'box',
          name: types.FACTORY,
          image: 'factory.png',
          brief: '基于定义的行为元素及行为规则自动化配置和生产工厂标签',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建工厂标签',
              dialog: {
                title: '新建工厂标签',
                component: 'FactoryEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/tag-center/factory',
              tip: '跳转至工厂标签'
            }
          ]
        },
        {
          type: 'split',
          name: 'tagFactorySplit'
        },
        {
          label: '标签逻辑表',
          type: 'box',
          name: types.TAGLOGIC,
          image: 'logic.png',
          brief: '标签逻辑表用于汇总已经生产的工厂标签和已经引入的手工标签',
          controls: [
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/tag-center/logic',
              tip: '跳转至标签逻辑表'
            }
          ]
        },
        {
          type: 'arrow'
        },
        {
          label: '标签类目',
          type: 'box',
          name: types.CATEGORY,
          image: 'category.png',
          brief:
            '标签类目用于对工厂标签和手工标签进行分类管理及公开/不公开状态的管理',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建标签类目',
              dialog: {
                title: '新建标签类目',
                component: 'CategoryEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/tag-center/category',
              tip: '跳转至标签类目'
            }
          ]
        },
        {
          type: 'arrow'
        },
        {
          label: '标签服务',
          type: 'box',
          name: types.TAGSERVICE,
          image: 'tagfront.png',
          controls: [
            {
              icon: 'el-icon-document-add',
              tip: '新建标签类目',
              dialog: {
                title: '新建标签类目',
                component: 'ServiceEdit'
              }
            },
            {
              icon: 'el-icon-location-outline',
              path: '/rd/exreact/tag-center/service',
              tip: '跳转至标签类目'
            }
          ]
        }
      ],
      regular: {
        label: '行为规则',
        name: types.REGULAR,
        image: 'regular.png',
        brief:
          '行为规则是基于定义的行为元素，用于进一步配置对应的数据来源及其加工清洗规则。',
        controls: [
          {
            icon: 'el-icon-document-add',
            tip: '新建行为规则',
            dialog: {
              title: '新建行为规则',
              component: 'RegularEdit'
            }
          },
          {
            icon: 'el-icon-location-outline',
            path: '/rd/exreact/behavior-center/behavior/regular',
            tip: '跳转至行为规则'
          }
        ]
      },
      behaviorBoard: {
        label: '行为看板',
        name: types.BEHAVIORBOARD, // 'limit',
        image: 'behavior-board.png',
        brief:
          '行为看板可以快速抽样预览并可视化查看行为数据，包括近期行为抽样采集、行为数分布、行为 ID 分布',
        // '行为看板为您提供了行为数据分布及抽样数据展示。帮助您动态获取以目标对象为中心的所有行为的规范化结构化聚集。',
        controls: [
          {
            icon: 'iconfont icon-zhihang',
            tab: {
              tabType: types.BEHAVIORBOARD,
              name: types.BEHAVIORBOARD,
              component: capitalize(types.BEHAVIORBOARD),
              data: {}
            },
            tip: '跳转至行为看板'
          }
        ]
      },
      tagBoard: {
        label: '标签看板',
        name: types.TAGBOARD, // 'limit',
        image: 'tag-board.png',
        controls: [
          {
            icon: 'iconfont icon-zhihang',
            tab: {
              tabType: types.TAGBOARD,
              name: types.TAGBOARD,
              component: capitalize(types.TAGBOARD),
              data: {}
            },
            tip: '跳转至标签看板'
          }
        ]
      },
      lines: [
        {
          source: 'behaviorElement',
          target: types.REGULAR,
          arrow: true,
          dir: 'bottom-left'
        },
        {
          source: types.FACTORY,
          target: types.REGULAR,
          arrow: true,
          dir: 'top-bottom',
          straight: true
        },
        {
          source: types.REGULAR,
          target: types.BEHAVIORBOARD,
          arrow: true,
          dir: 'right-left'
        },
        {
          source: types.OBJECTATTR,
          target: 'opsBox',
          arrow: true,
          dir: 'right-top'
        },
        {
          source: types.OBJECTATTR,
          target: types.BEHAVIORBOARD,
          arrow: true,
          dir: 'bottom-top',
          straight: true
        },
        {
          source: types.MANUAL,
          target: types.TAGLOGIC,
          arrow: true,
          dir: 'top-top',
          overlay: 'overlay1'
        },
        {
          source: types.TAGLOGIC,
          target: types.CATEGORY,
          arrow: true,
          dir: 'right-left'
        },
        {
          source: types.CATEGORY,
          target: types.TAGSERVICE,
          arrow: true,
          dir: 'right-left'
        },
        {
          source: types.MANUAL,
          target: types.TAGBOARD,
          arrow: true,
          dir: 'bottom-left'
        },
        {
          source: 'tagFactorySplit',
          target: types.TAGBOARD,
          arrow: true,
          dir: 'bottom-left'
        },
        {
          source: types.CATEGORY,
          target: 'opsBox',
          arrow: true,
          dir: 'bottom-bottom'
        },
        {
          source: types.TAGSERVICE,
          target: types.TAGBOARD,
          arrow: true,
          dir: 'bottom-top',
          straight: true
        },
        {
          source: 'dataphinImg',
          target: 'opsBox',
          arrow: true,
          dir: 'right-bottom'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['visibleWellcome'])
  },
  methods: {
    getPoint(el, dir) {
      const {width, height, left, top} = el.getBoundingClientRect(),
        leftPanel = document.querySelector('.left-pane.split-pane'),
        point = []

      switch (dir) {
        case 'top':
          point.push(left + width / 2, top)
          break
        case 'bottom':
          point.push(left + width / 2, top + height)
          break
        case 'left':
          point.push(left, top + height / 2)
          break
        case 'right':
          point.push(left + width, top + height / 2)
          break
      }

      point[0] = point[0] - leftPanel.clientWidth - 15
      point[1] = point[1] - (this.visibleWellcome ? 96 : 66)
      return point
    }
  }
}
</script>
