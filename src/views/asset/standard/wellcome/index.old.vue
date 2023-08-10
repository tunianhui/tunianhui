<template>
  <section class="wellcome">
    <h2 ref="head">
      欢迎开启元数据管理
    </h2>
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
      <g />
    </svg>
    <div class="w-main" ref="main">
      <el-row
        v-for="item in list"
        :key="item.name"
        :gutter="10"
        :class="item.class"
        :type="item.class === 'sm-panel' ? 'flex' : ''"
        :style="{'margin-top': `${marginTop}px`}"
      >
        <el-col
          :span="item.span || 6"
          :offset="item.offset || 0"
          class="flex-layout"
          :id="item.name"
        >
          <router-link tag="div" class="module" :to="item.path">
            <span>
              <i :class="item.icon"></i>
              &nbsp; {{ item.label }}
            </span>
            <i class="el-icon-d-arrow-right"></i>
          </router-link>
        </el-col>
        <el-col
          v-for="child in item.children"
          :key="child.name"
          :span="6"
          :offset="child.offset || 0"
          :id="child.name"
        >
          <div class="lg-box box">
            <div class="box-content mb-0">
              <div class="box-label">
                <div class="img">
                  <img
                    :src="require(`@/assets/images/asset/standard/${child.image}`)"
                    alt
                  />
                </div>
                <p class="lg-label">{{ child.label }}</p>
              </div>
              <div class="box-brief">{{ child.brief }}</div>
            </div>
            <ul class="box-btns">
              <li v-for="btn in child.btns" :key="btn.label" :class="btn.loc ? 'icon-right' : ''">
                <div class="box-btn mb-10">
                  <el-button type="primary">{{btn.label}}</el-button>
                </div>
                <div :class="['box-controls']">
                  <span class="lg-icon" v-for="control in btn.controls" :key="control.icon">
                    <i
                      :class="control.icon"
                      :title="item.tip"
                      @click="iconControl(control)"
                    ></i>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import wellcomeMixin from '../../wellcome-mixin'

export default {
  name: 'StandardWellcome',
  mixins: [wellcomeMixin],
  data() {
    // let id = Date.now()
    return {
      marginTop: 40,
      list: [
        {
          label: '标准管理',
          name: 'standardManage',
          class: 'lg-standard-panel',
          icon: 'iconfont icon-guifan',
          path: '/asset/standard/manage/define/criterion',
          children: [
            {
              label: '标准定义',
              name: 'define',
              image: 'define.png',
              brief:
                '标准定义是由XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。',
              btns: [{
                label: '定义标准',
                path: '',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建标准'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/manage/define/criterion',
                  tip: '跳转至标准'
                }]
              }, {
                label: '定义类目',
                path: '',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建类目'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/manage/define/category',
                  tip: '跳转至类目'
                }]
              }, {
                label: '定义字典',
                path: '',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建字典'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/manage/define/dict',
                  tip: '跳转至字典'
                }]
              }]
            },
            {
              label: '标准映射',
              name: 'mapping',
              image: 'atom.png',
              brief:
                '标准映射代表XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。',
              btns: [{
                label: '规则映射',
                path: '',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建规则映射'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/manage/mapping/regular',
                  tip: '跳转至规则映射'
                }]
              }]
            },
            {
              label: '贯标',
              name: 'through',
              image: 'through.png',
              brief:
                '贯标是XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx。',
              btns: [{
                label: '元数据映射',
                path: '',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建元数据映射'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/manage/through/metadata',
                  tip: '跳转至元数据映射'
                }]
              }]
            }
          ]
        },
        {
          label: '版本管理',
          name: 'edition',
          class: 'lg-standard-panel',
          icon: 'iconfont icon-shujujianmo',
          path: '/asset/standard/edition',
          children: [
            {
              label: '标准发布',
              name: 'release',
              image: 'publish.png',
              brief:
                '标准发布XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。',
              btns: [{
                label: '标准发布',
                path: '',
                loc: 'right',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建标准发布'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/edition',
                  tip: '跳转至标准发布'
                }]
              }]
            },
            {
              label: '版本管理',
              name: 'editionManage',
              image: 'through.png',
              brief:
                '版本管理XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX。',
              btns: [{
                label: '版本管理',
                path: '',
                loc: 'right',
                controls: [{
                  icon: 'el-icon-document-add',
                  tip: '新建版本管理'
                },
                {
                  icon: 'el-icon-location-outline',
                  path: '/asset/standard/edition',
                  tip: '跳转至版本管理'
                }]
              }]
            }
          ]
        }
      ],
      lines: [
        {
          source: 'define',
          target: 'through',
          arrow: true,
          dir: 'top-top'
        }, {
          source: 'mapping',
          target: 'through',
          arrow: true,
          dir: 'top-top'
        }, {
          source: 'release',
          target: 'editionManage',
          arrow: true,
          dir: 'bottom-bottom'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.welcome {
  &.standard {
    font-size: 12px;
    .w-main {
      .lg-panel{
        > .el-col {
          height: 25vh;
          min-height: 160px;
        }
      }
    }
  }
}
</style>
