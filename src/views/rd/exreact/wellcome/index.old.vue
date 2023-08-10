<template>
  <section class="wellcome">
    <!-- <h3 ref="head">欢迎使用{{$config.name}}</h3> -->
    <h3 ref="head">
      欢迎使用{{ $store && $store.getters ? $store.getters.title : '' }}
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
    <div class="w-main" ref="main">
      <el-row
        v-for="(item, index) in list"
        :key="item.name"
        :gutter="10"
        :class="item.class"
        :type="item.class === 'sm-panel' ? 'flex' : ''"
        :style="{'margin-top': `${marginTop * (index + 1)}px`}"
      >
        <el-col
          :span="item.span || 4"
          :offset="item.offset || 0"
          :class="!item.image && 'flex-layout'"
          :id="item.name"
        >
          <div class="module" @iconControl="item">
            <span><i :class="item.icon"></i>&nbsp; {{ item.label }}</span>
            <i class="el-icon-d-arrow-right"></i>
          </div>
        </el-col>
        <template>
          <el-col
            v-for="child in item.children"
            :key="child.name"
            :span="4"
            :offset="child.offset"
            :id="child.name"
          >
            <div class="box xl-box box-list" v-if="child.children">
              <ul>
                <li v-for="c in child.children" :key="c.name">
                  <p class="flex-layout space-between">
                    <span>{{ c.label }}</span>
                    <span class="box-controls">
                      <i
                        v-for="control in c.controls"
                        :class="control.icon"
                        :key="control.icon"
                        :title="control.tip"
                        @click="iconControl(control)"
                      ></i>
                    </span>
                  </p>
                </li>
              </ul>
              <p>{{ child.label }}</p>
            </div>
            <div class="lg-box xl-box box" v-else>
              <div class="box-content">
                <div class="box-label">
                  <div class="img">
                    <img
                      :src="
                        require(`@/assets/images/rd/exreact/${child.image}`)
                      "
                      alt=""
                    />
                  </div>
                  <p>{{ child.label }}</p>
                </div>
                <!-- <div class="box-brief">
                  {{child.brief}}
                </div> -->
              </div>
              <div class="box-controls">
                <i
                  v-for="control in child.controls"
                  :class="control.icon"
                  :key="control.icon"
                  :title="control.tip"
                  @click="iconControl(control)"
                ></i>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
      <div class="overlay" id="overlay1">引用</div>
      <div class="overlay" id="overlay2">数据呈现</div>
      <div class="overlay" id="overlay3">行为产出表</div>
      <div class="overlay" id="overlay4">公开</div>
      <div class="overlay" id="overlay5">
        <i class="el-icon-plus"></i>
      </div>
      <div class="overlay" id="overlay6">数据呈现</div>
    </div>
  </section>
</template>

<script>
import wellcomeMixin from '../../wellcome-mixin'
import {types, iconMap} from '@/config/rd-config'
import {capitalize} from '@/libs/util'

export default {
  name: 'ExreactWellcome',
  mixins: [wellcomeMixin],
  inject: ['tabStore'],
  data() {
    let id = Date.now()
    return {
      list: [
        {
          label: '行为中心',
          name: 'behaviorCenter',
          class: 'xl-panel',
          icon: iconMap[types.REGULAR].icon,
          tab: {
            label: '对象列表页',
            name: `BehaviorCenterObjectTable`,
            tabType: types.OBJECTTABLE,
            component: 'BehaviorCenterObjectTable'
          },
          children: [
            {
              label: '行为元素',
              name: 'behaviorElement',
              children: [
                {
                  label: '域',
                  name: types.DOMAIN,
                  controls: [
                    {
                      icon: 'el-icon-document-add',
                      tip: '新建行为规则',
                      dialog: {
                        title: '新建域',
                        component: 'DomainEdit'
                      }
                    },
                    {
                      icon: 'el-icon-location-outline',
                      path: '/rd/exreact/behavior-center/element/domain-bus',
                      tip: '跳转至域'
                    }
                  ]
                },
                {
                  label: '业务线',
                  name: types.BUS,
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
                  label: '动作',
                  name: types.ACTION,
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
                  label: '对象',
                  name: types.OBJECT,
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
                  label: '对象属性',
                  name: types.OBJECTATTR,
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
              ]
            },
            {
              label: '行为规则',
              name: types.REGULAR,
              image: 'regular.png',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建行为规则',
                  tab: {
                    label: '新建行为规则',
                    name: `new_regular_${id++}`,
                    tabType: types.REGULAR,
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
            {
              label: '行为看板',
              name: types.BEHAVIORBOARD, // 'limit',
              image: 'board.png',
              controls: [
                {
                  icon: 'el-icon-location-outline',
                  tab: {
                    tabType: types.BEHAVIORBOARD,
                    name: types.BEHAVIORBOARD,
                    component: capitalize(types.BEHAVIORBOARD),
                    data: {}
                  },
                  tip: '跳转至行为看板'
                }
              ]
            }
          ]
        },
        {
          label: '标签中心',
          name: 'tagCenter',
          class: 'xl-panel',
          icon: iconMap[types.TAG].icon,
          tab: {
            label: '对象列表页',
            name: `TagCenterObjectTable`,
            tabType: types.OBJECTTABLE,
            component: 'TagCenterObjectTable'
          },
          children: [
            {
              label: '标签工厂',
              name: types.TAG,
              image: 'factory.png',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建标签工厂',
                  tab: {
                    label: '新建标签工厂',
                    name: `new_tag_${id++}`,
                    tabType: types.TAG,
                    component: 'TagEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/rd/exreact/tag-center/tag',
                  tip: '跳转至标签工厂'
                }
              ]
            },
            {
              label: '标签类目',
              name: 'category',
              image: 'category.png'
            },
            {
              label: '公开标签',
              name: 'publicTag',
              image: 'tag.png'
            },
            {
              label: '标签前台',
              name: 'tagfront',
              image: 'tagfront.png'
            }
          ]
        }
      ],
      lines: [
        {
          source: 'behaviorElement',
          target: types.REGULAR,
          arrow: true,
          dir: 'top-top',
          overlay: 'overlay1'
        },
        {
          source: types.REGULAR,
          target: types.BEHAVIORBOARD,
          arrow: true,
          dir: 'top-top',
          overlay: 'overlay2'
        },
        {
          source: types.BEHAVIORBOARD,
          target: types.TAG,
          arrow: true,
          dir: 'bottom-top',
          overlay: 'overlay3'
        },
        {
          source: types.TAG,
          target: 'category',
          arrow: true,
          dir: 'bottom-bottom',
          overlay: 'overlay4'
        },
        {
          source: 'category',
          target: 'publicTag',
          arrow: true,
          dir: 'bottom-bottom',
          overlay: 'overlay5'
        },
        {
          source: 'publicTag',
          target: 'tagfront',
          arrow: true,
          dir: 'bottom-bottom',
          overlay: 'overlay6'
        }
      ]
    }
  }
}
</script>

<style lang="scss"></style>
