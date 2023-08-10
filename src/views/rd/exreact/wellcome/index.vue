<!--
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:30
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-17 10:34:07
 * @FilePath: \数据智能构建\src\views\rd\exreact\wellcome\index.vue
-->
<template>
  <div class="wellcome" id="wellcome">
    <div class="header-img">
      <p>欢迎使用数据标签功能！</p>
      <p>数据标签提供ID定义、行为数据规范化结构化聚集、<br> 标签可视化配置能力。结合OneID体系，可以统一<br>  实体信息，高速、有效构建可直接应用的核心标签，<br>
      以消除数据孤岛，提升数据价值。</p>
    </div>
    <div class="setp-wrapper">
      <div id="idsCenter" ref="idCenter">
        <span>
          <i class="iconfont icon-sanwei"></i>
          ID中心
        </span>
        <span class="arrow"></span>
      </div>
      <div id="behavior-center">
        <span>
          <i class="iconfont icon-zerenren"></i>
          行为中心
        </span>
        <span class="arrow"></span>
      </div>
      <div id="tag-center">
        <span>
          <i class="iconfont icon-biaoqian"></i>
          标签中心
        </span>
      </div>
      <svg id="lines">
        <defs>
          <marker id="markerArrow" markerWidth="10" markerHeight="10" refX="10" refY="6" orient="auto">
            <path d="M2,2 L10,6 L2,10 L6,6 L2,2" :style="{fill: strokeColor}" />
          </marker>
        </defs>
        <g />
      </svg>
    </div>

    <div class="idsCenter-wrapper">
      <div>
        <div class="">
          <i class="iconfont icon-sanwei"></i>
          ID中心
        </div>
        <div>
          自持实体 ID 的定义及 OneID 映射表的引入，通过 ID mapping 实现唯一实体识别以深度挖掘数据价值
        </div>
      </div>
      <div>
        <div class="careat">
          <div class="careat-img">
            <img :src="require('@/assets/images/home/7.png')" alt="">
            <div class="handle">
              <span>1</span>
              <span>
                <span>创建实体ID</span>
                <i class="el-icon-document-add" @click="addEntityId"></i>
              </span>
            </div>
          </div>
          <span class="arrow111"></span>
        </div>
        <div class="import">
          <div class="careat-img">
            <img :src="require('@/assets/images/rd/exreact/bus.png')" alt="">
            <div class="handle">
              <span>2</span>
              <span>
                <span>引入ID映射表</span>
                <i class="el-icon-document-add" @click="addMappingTable"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="behavior-center">
      <div>
        <div class="">
          <i class="iconfont icon-zerenren"></i>
          行为中心
        </div>
        <div>
          通过行为构建及行为规则定义，实现对行为数据的规范化结构化聚合，以支持标签生产及用户营销等场景
        </div>
      </div>
      <div>
        <div class="careat">
          <div class="careat-img">
            <img :src="require('@/assets/images/rd/exreact/regular1.png')" alt="">
            <div class="handle">
              <span>1</span>
              <span>
                <span>定义行为元素</span>
                <i class="el-icon-document-add" @click="$router.push({path: '/tag/workbench/behavior-center/element/domain-bus'})"></i>
              </span>
            </div>
          </div>
          <span class="arrow111"></span>
        </div>
        <div class="import">
          <div class="careat-img">
            <img :src="require('@/assets/images/rd/exreact/manual.png')" alt="">
            <div class="handle">
              <span>2</span>
              <span>
                <span>创建行为规则</span>
                <i class="el-icon-document-add" @click="addBehaviorRule"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tag-center">
      <div>
        <div class="">
          <i class="iconfont icon-zerenren"></i>
          标签中心
        </div>
        <div>
          支持基于萃取平台的标签自动化生产及原生标签引入，提供统一的标签管理平台，并通过标签逻辑表统一对外提供服务
        </div>
      </div>
      <div>
        <div class="careat">
          <div class="careat-img">
            <img :src="require('@/assets/images/rd/exreact/category.png')" alt="">
            <div class="handle">
              <span>1</span>
              <span>
                <span>创建标签</span>
                <i class="el-icon-document-add" @click="addTag"></i>
              </span>
            </div>
          </div>
          <span class="arrow111"></span>
        </div>
        <div class="import">
          <div class="careat-img">
            <img :src="require('@/assets/images/rd/exreact/category.png')" alt="">
            <div class="handle">
              <span>2</span>
              <span>
                <span>配置标签规则</span>
                <i class="el-icon-document-add" @click="$router.push({path: '/tag/workbench/tag-center/factory'})"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCornerLinePath,
  getCenterPoint,
  getPathPoints
} from '@/libs/visual/tool/path'
import {on, off} from '@/libs/dom'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'ExreactWellcome',
  inject: ['tabStore'],
  data() {
    return {
      strokeColor: this.$styleVars.grey5,
      strokeColorActive: this.$styleVars['--color-primary'],
      path: null
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  mounted() {
      this.svg = this.$d3.select('#lines')
      this.renderer()
      on(window, 'resize', this.renderer)
  },
  beforeDestroy() {
    off(window, 'resize', this.renderer)
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    renderer() {
      this.$debounce(this.render.bind(this), 500)()
    },
    render() {
      const source = document.querySelector(`#idsCenter`)
      const target = document.querySelector(`#tag-center`)
      const dir = 'bottom-bottom'
      const start = this.getPoint(source, 'bottom')
      const end = this.getPoint(target, 'bottom')
      let path = getCornerLinePath(
        [start[0], start[1] + 5],
        [end[0], end[1] + 5],
        7,
        dir,
        5
      )
      this.svg.select('g').selectAll('path').remove();
      const p = this.svg
        .select('g')
        .append('path')
        .attr('d', path)
        .attr('stroke', this.strokeColor)
        .attr('fill', 'transparent')
        .attr('marker-end', 'url(#markerArrow)')
    },
    getPoint(el, dir) {
      return getCenterPoint(el, dir)
    },
    addEntityId() {
      this.setActiveRdEditDialog({
        title: '新建实体ID',
        component: `IdEditCreate`,
        data: {}
      })
    },
    addMappingTable() {
      this.setActiveRdEditDialog({
        title: 'ID映射表配置',
        component: `MappingTableId`,
        data: {...this.project, isEdit: false}
      })
    },
    addBehaviorRule() {
      this.setActiveRdEditDialog({
        title: '新建行为规则',
        component: 'RegularEditDialog',
        data: {...this.project}
      })
    },
    addTag() {
      this.setActiveRdEditDialog({
        title: '新建工厂标签',
        component: `FactoryEdit`,
        data: {...this.project}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 15px;
.wellcome {
  height: 100%;
  padding: 15px;
  background: #f2f1f5;
  user-select: none;
  width: 100%;
  display: block;
  overflow: overlay;
  .header-img {
    height: 170px;
    background: #fff;
    margin-bottom: 10px;
    box-sizing: border-box;
    background-image: url('~@/assets/images/rd/exreact/huaban.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-size: cover;
    p {
      color: #fff;
      padding: 20px 20px 15px 20px;
      &:first-child {
        font-weight: 700;
        font-size: 16px;
      }
      &:last-child {
        padding-top: 0;
        font-size: 12px;
      }
    }
  }
  .setp-wrapper {
    height: 65px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 9;
    >div {
      flex: 1;
      display: flex;
      justify-content: center;
      font-size: 14px;
      color: #648cff;
      align-items: center;
      >span {
        cursor: pointer;
      }
      > .arrow {
        position: absolute;
        height: 7px;
        background: linear-gradient(to left, $grey5, $grey8);
        width: 80px;
        right: 0;
        transform: translateX(50%);
        display: flex;
        align-items: center;
        &::after {
          content: '';
          width: 0px;
          height: 0px;
          border-width: 7px;
          border-style: solid;
          border-color: transparent transparent transparent $grey5;
          position: absolute;
          right: 0;
          transform: translateX(14px);
        }
      }
    }
    #idsCenter, #behavior-center {
      position: relative;
    }
  }
  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .idsCenter-wrapper,.behavior-center,.tag-center {
    height: 155px;
    background: $grey8;
    display: flex;
    // margin-top: 10px;
    padding: 10px;
    justify-content: space-between;
    > div {
      flex: 2;
      background: #fff;
      &:first-child {
        padding: 35px 35px 0px 35px;
        font-size: 14px;
        >div:first-child {
          > i {
            color: #648cff;
          }
        }
        >div:last-child {
          font-size: 12px;
          margin-top: 10px;
          opacity: 0.7;
        }
      }
      
      &:last-child {
        flex: 3;
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          .careat-img {
            
            img {
              width: 65px;
              height: 65px;
            }
            .handle {
              display: flex;
              align-items: center;
              >span {
                font-size: 13px;
                color: rgba(0,0,0,0.7);
              }
              > span:first-child {
                width: 15px;
                height: 15px;
                background: #648cff;
                color: #fff;
                text-align: center;
                line-height: 15px;
                display: inline-block;
                border-radius: 50%;
                font-size: 14px;
                margin-right: 5px;
              }
              > span:last-child {
                // display: flex;
                // align-items: center;
                i {
                  cursor: pointer;
                  margin-left: 3px;
                }
              }
            }
          }
        }
      }
    }
  }
  .arrow111 {
    position: absolute;
    height: 0px;
    // background: linear-gradient(to left, $grey5, $grey8);
    border-bottom: 3px dashed $grey7;
    width: 80px;
    right: 0px;
    transform: translateX(50%);
    display: flex;
    align-items: center;
    bottom: 5px;
    &::after {
      content: '';
      width: 0px;
      height: 0px;
      border-width: 7px;
      border-style: solid;
      border-color: transparent transparent transparent $grey7;
      position: absolute;
      right: 0;
      bottom: -8px;
      transform: translateX(14px);
    }
  }
}
</style>