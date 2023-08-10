<template>
  <section class="wellcome">
    <h3 ref="head">
      欢迎使用数据中台-服务
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
      <el-row v-for="item in list" :key="item.name" :gutter="20" :class="item.class" :type="item.class === 'sm-panel' ? 'flex' : ''" :style="{'margin-top': `${marginTop}px`}">
        <el-col :span="item.span || 4" :offset="item.offset || 0" :class="!item.image && 'flex-layout'" :id="item.name">
          <div v-if="item.image" class="flex-layout server-ops-box box">
            <img :src="require(`@/assets/images/server/wellcome/${item.image}`)" alt />
            <div class="flex-1">
              <router-link tag="p" :to="item.path">
                <span>{{ item.label }}</span>
                <i class="el-icon-location-outline ml-20"></i>
              </router-link>
              <p class="brief">{{ item.brief }}</p>
            </div>
          </div>
          <router-link tag="div" class="module" :to="item.path" v-else>
            <span>
              <i :class="item.icon"></i>
              &nbsp; {{ item.label }}
            </span>
            <i class="el-icon-d-arrow-right"></i>
          </router-link>
        </el-col>
        <template v-if="!item.wrap">
          <el-col v-for="child in item.children" :key="child.name" :span="child.span || 5" :offset="child.offset || 0" :id="child.name" :class="{ 'item-flow': child.span > 5 }">
            <!-- 单独一行 -->
            <div v-if="child.span > 5" class="lg-box box">
              <div class="box-content">
                <div class="box-line">
                  <span class="img">
                    <img :src="require(`@/assets/images/server/wellcome/${child.image}`)" alt />
                  </span>
                  <span class="ml-20 mt-30">{{ child.label }}</span>
                  <span class="ml-20 mt-30" v-for="control in child.controls" :key="control.icon">
                    <i :class="control.icon" :title="item.tip" @click="iconControl(control)"></i>
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="lg-box box">
              <div class="box-content">
                <div class="box-label">
                  <div class="img">
                    <img :src="require(`@/assets/images/server/wellcome/${child.image}`)" alt />
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
              </div>
            </div>
          </el-col>
        </template>

        <el-col v-else :span="24 - (item.span || 5)">
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
      <div class="overlay" id="overlay">监控运维</div>
    </div>
  </section>
</template>
<script>
import { types } from '@/config/server-config'
import welcomeMixin from './welcome-mixin'
export default {
  name: 'ServerWelcome',
  mixins: [welcomeMixin],
  data () {
    let id = Date.now()
    return {
      list: [
        {
          label: '服务开发',
          name: 'serverDev',
          class: 'lg-panel',
          icon: 'iconfont icon-fuwubianpai',
          path: '/server/api-create',
          children: [
            {
              label: 'Api生成',
              name: types.APICREATE,
              image: 'api-dev.png',
              brief:
                'Api生成，自定义SQL模式支持通过脚本模式配置复杂查询条件及简单函数，生成API，包含：生成、测试、发布、下线、删除功能',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: 'Api生成',
                  tab: {
                    label: 'Api生成',
                    name: `new_create_${id++}`,
                    tabType: types.APICREATE,
                    component: 'ApiCreateEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/api-create',
                  tip: '跳转至Api生成'
                }
              ]
            },
            {
              label: 'Api注册',
              name: types.REGISTER,
              image: 'api-login.png',
              brief:
                '注册已有的API至数据服务，与通过数据表生成的API进行统一管理、发布和对接',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建API注册',
                  tab: {
                    label: '新建API注册',
                    name: `new_register_${id++}`,
                    tabType: types.REGISTER,
                    component: 'ApiRegisterEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/api-register',
                  tip: '跳转至API注册'
                }
              ]
            },
            {
              label: '函数',
              name: types.FUNC,
              image: 'function.png',
              brief:
                '服务开发中创建函数、测试函数、发布函数，发布后的函数可被进一步关联至API，作为API的过滤器，对API的请求参数或返回结果进行加工处理，从而实现API的复杂查询需求，灵活适配各类业务场景。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建函数',
                  tab: {
                    label: '新建函数',
                    name: `new_func_${id++}`,
                    tabType: types.FUNC,
                    component: 'FuncEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/func',
                  tip: '跳转至函数'
                }
              ]
            },
            {
              label: '服务编排',
              name: types.ARRANGE,
              image: 'serve-arrange.png',
              brief:
                '服务务编排采用Conductor，通过流程、任务、历史、监控、客户端、通信和管理后台几个层面来做了功能归类。架构能够实现动态伸缩，无需关注底层运行环境，只需要关注业务逻辑本身。',
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建服务编排',
                  tab: {
                    label: '新建服务编排',
                    name: `new_arrange_${id++}`,
                    tabType: types.ARRANGE,
                    component: 'ArrangeEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/arrange',
                  tip: '跳转至服务编排'
                }
              ]
            },
            {
              label: '业务流程',
              name: types.FLOW,
              image: 'flow.png',
              brief:
                '根据业务种类将不同类型的资源组织在一起，即构成业务流程，能够更好地以业务为单元进行概括。每一个业务流程下均包括API、函数和服务编排三个类目，分别存放创建的API、函数和服务编排。',
              offset: 4,
              span: 12,
              controls: [
                {
                  icon: 'el-icon-document-add',
                  tip: '新建业务流程',
                  dialog: {
                    title: '新建业务流程',
                    component: 'FlowEdit'
                  }
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/flow',
                  tip: '跳转至业务流程'
                }
              ]
            }
          ]
        },
        {
          label: '服务应用',
          name: 'modeling',
          class: 'lg-panel',
          icon: 'iconfont icon-fuwudanyuan',
          path: '/server/api-create',
          children: [
            {
              label: 'Api市场',
              name: types.APIMARKET,
              image: 'api-market.png',
              brief:
                'Api市场...',
              controls: [
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/api-market/market',
                  tip: '跳转至Api市场'
                }
              ]
            },
            {
              label: 'Api应用',
              name: types.APISERVER,
              image: 'api-server.png',
              brief:
                'Api应用...',
              controls: [
                {
                  icon: 'el-icon-location-outline',
                  path: '/server/api-app/manage',
                  tip: '跳转至Api应用'
                }
              ]
            }
          ]
        },
        {
          label: '运维大盘',
          name: 'ops',
          class: 'ops-panel',
          offset: 4,
          span: 16,
          image: 'operation.png',
          path: '/server/platform-manage/overview',
          brief:
            '监控当天API的运行情况，查看API运行详情、配置API限流和API告警，保障应用能够正常调用API。'
        }
      ],
      lines: [
        {
          source: types.APICREATE,
          target: types.ARRANGE,
          dir: 'top-top'
        },
        {
          source: types.REGISTER,
          target: types.ARRANGE,
          arrow: false,
          dir: 'top-top'
        },
        {
          source: types.FUNC,
          target: types.ARRANGE,
          arrow: false,
          dir: 'top-top'
        },
        {
          source: types.APICREATE,
          target: types.FLOW,
          arrow: true,
          dir: 'bottom-top'
        },
        {
          source: types.REGISTER,
          target: types.FLOW,
          arrow: true,
          dir: 'bottom-top'
        },
        {
          source: types.FUNC,
          target: types.FLOW,
          arrow: true,
          dir: 'bottom-right'
        },
        {
          source: types.ARRANGE,
          target: types.FLOW,
          arrow: true,
          dir: 'bottom-right'
        },
        {
          source: types.FLOW,
          target: types.APIMARKET,
          arrow: true,
          dir: 'bottom-top'
        },
        {
          source: types.FLOW,
          target: types.APISERVER,
          arrow: true,
          dir: 'bottom-top'
        },
        {
          source: 'modeling',
          target: 'ops',
          arrow: true,
          dir: 'bottom-left',
          overlay: 'overlay'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scope>
.item-flow {
  margin-top: 30px;
  height: 11vh !important;
  min-height: 102px !important;
  .box-content {
    height: 100% !important;
    margin-bottom: 0 !important;
  }
}
</style>
