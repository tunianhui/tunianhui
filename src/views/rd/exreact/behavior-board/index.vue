<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-08-19 17:28:28
 * @Description:
-->
<template>
  <section class="behavior-board">
    <div class="pb-10 space-between">
      <p>行为看板</p>
      <p class="label font-12">更新时间：{{ info.update_time }}</p>
    </div>
    <el-form class="flex-layout" inline label-suffix="：">
      <el-form-item label="行为中心产出表">
        {{ info.table }}
      </el-form-item>
      <el-form-item label="已接入行为规则">
        {{ info.regular_count }}
      </el-form-item>
      <el-form-item label="累计采集用户行为">
        {{ info.behavior_count | insertSeparator }}
      </el-form-item>
    </el-form>
    <div class="flex-layout mt-10">
      <div class="board-left">
        <div class="mr-15">
          <div class="space-between mb-10">
            <div class="display-ratio">
              <span>显示比例：</span>
              <div class="display-ratio-control">
                {{ scale }}%
                <i class="ml-10 font-18 el-icon-circle-plus"></i>
                <i class="font-18 el-icon-remove"></i>
                <el-button type="primary" size="mini" @click="resetScale">
                  重置
                </el-button>
              </div>
            </div>
            <div>
              <el-button type="primary" size="mini" icon="iconfont icon-xiazai">
                下载行为定义表
              </el-button>
            </div>
          </div>
          <p class="label font-12">
            1) 可点击单个域、业务域、动作对象名称或图标以查看详情
          </p>
          <p class="label font-12">
            2) 可hover单个域、业务域、动作对象图标获取描述信息
          </p>
          <p class="mt-5 mb-5">
            <a href="javascript:;">所有域</a>
            <span class="ml-5 mr-5">></span>
            <span>电商</span>
          </p>
          <div class="space-between tiers-height mb-10">
            <span>域</span>
            <span style="transform: translateX(50%);">业务线</span>
            <span style="transform: translateX(52%);">动作对象</span>
            <span>对象属性</span>
          </div>
        </div>
        <div class="tiers">
          <div class="tier" v-for="(item, i) in tierData" :key="i">
            <div class="flex-1 linear-bg flex-center">
              <div class="linear-bar-left"></div>
              <div class="linear-bar-right"></div>
              <span class="pl-15">{{ item.domain }}</span>
              <span class="pr-15">{{ item.bus }}</span>
            </div>
            <div class="flex-2">
              <div
                class="flex-layout"
                v-for="(action, j) in item.actions"
                :key="`${i}${j}`"
              >
                <div class="flex-1">
                  <div
                    :class="
                      `${
                        action.attrs.length ? 'linear-bg' : 'grey-bg'
                      } linear-box`
                    "
                    :style="{height: getHeight(action)}"
                  >
                    <!-- :style="{height: getHeight(action)}" -->
                    <div
                      :class="
                        `${
                          action.attrs.length
                            ? 'linear-bar-right'
                            : 'grey-bar-right'
                        }`
                      "
                    ></div>
                    <span class="pr-15">
                      {{ action.name }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 curve">
                  <p v-for="item in action.attrs" :key="item">
                    <OverflowTooltip :width="attrWidth">
                      {{ item }}
                    </OverflowTooltip>
                  </p>
                  <svg
                    ref="paths"
                    v-if="action.attrs.length"
                    :data="action.attrs.join(',')"
                  ></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="board-right">
        <p>行为数据抽样：所有行为</p>
        <p class="label mb-10">抽样业务日期：{{ info.sample_day }}</p>
        <div class="sample-list">
          <div
            class="sample-list-row"
            v-for="item in sample_list"
            :key="item.id"
          >
            <div class="sample-line"></div>
            <div class="sample-card">
              <p>
                <span class="label">ID：</span>
                <span>{{ item.id }}</span>
              </p>
              <p>
                <span class="label">动作对象：</span>
                <span>{{ item.action_object }}</span>
              </p>
              <p>
                <span class="label">对象属性：</span>
                <span>{{ item.object_attr }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import {getBehaviorBoard} from '@/api/rd/exreact'
import {bezierCurveTo} from '@/libs/visual/tool/path'
import {mapGetters} from 'vuex'

export default {
  name: 'BehaviorBoard',
  inheritAttrs: false,
  components: {OverflowTooltip},
  data() {
    return {
      info: {},
      sample_list: [],
      list: [],
      scale: 100,
      tierData: [
        // {
        //   domain: '电商',
        //   bus: '淘宝',
        //   actions: [
        //     {
        //       name: '浏览商品',
        //       attrs: ['商品价格', '商品类目']
        //     },
        //     {
        //       name: '浏览商品1',
        //       attrs: []
        //     },
        //     {
        //       name: '浏览商品2',
        //       attrs: ['商品价格', '商品类目', 'absolute--']
        //     }
        //   ]
        // },
        // {
        //   domain: '电商1',
        //   bus: '淘宝2',
        //   actions: [
        //     {
        //       name: '浏览商品',
        //       attrs: ['商品价格', '商品类目']
        //     },
        //     {
        //       name: '浏览商品1',
        //       attrs: []
        //     },
        //     {
        //       name: '浏览商品2',
        //       attrs: []
        //     }
        //   ]
        // }
      ],
      edges: [
        {source: 'dot1', target: 'dot2'},
        {source: 'dot1', target: 'dot3'}
      ],
      attrWidth: 72,
      lineHeight: 26,
      tb: 20,
      gapRight: 10
    }
  },
  computed: {
    ...mapGetters(['collapse'])
  },
  watch: {
    collapse: {
      immediate: true,
      async handler(val) {
        await this.$sleep(300)
        this.tierData.length && this.drawCurve()
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.getData()
  },
  methods: {
    getHeight(action) {
      const {tb, lineHeight} = this,
        len = action.attrs.length
      return Math.max(len * lineHeight + tb, 120) + 'px'
    },
    drawCurve() {
      const {gapRight, lineHeight, $styleVars, $refs, attrWidth} = this,
        size = 3,
        color = $styleVars.tagColor,
        paths = $refs.paths

      if (paths.length) {
        const el = paths[0],
          width = el.clientWidth,
          x1 = size,
          x2 = width - attrWidth - gapRight - size,
          dx = (x2 - x1) / 2

        paths.forEach(el => {
          const height = el.clientHeight,
            y1 = height / 2,
            svg = this.$d3.select(el),
            data = svg.attr('data').split(',')

          svg.selectAll('circle').remove()
          svg.selectAll('path').remove()

          data.forEach((attr, i) => {
            const y2 = lineHeight * (i + 0.5) + size / 2 + 10,
              path = bezierCurveTo(x1, y1, x2, y2, dx)
            svg
              .append('path')
              .attr('d', path)
              .attr('stroke', color)
              .attr('fill', 'none')
            this.drawCircle(svg, x2, y2, size, color)
          })
          this.drawCircle(svg, x1, y1, size, color)
        })
      }
    },
    drawCircle(svg, x, y, size, color) {
      svg
        .append('circle')
        .attr('r', size)
        .attr('cx', x)
        .attr('cy', y)
        .attr('stroke', color)
        .attr('fill', '#fff')
    },
    resetScale() {},
    async getData() {
      this.loading++
      const res = await this.$simpleAsyncTo(getBehaviorBoard(), '获取数据失败')
      if (res) {
        const {sample_list, list} = res.data
        this.info = res.data
        this.sample_list = sample_list
        this.tierData = list
        await this.$sleep(20)
        this.drawCurve()
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.behavior-board {
  height: 100%;
  padding: 10px;
  background-color: $grey7;
  // overflow: auto;
  overflow: hidden;

  > .el-form {
    padding: 10px;
    background-color: $grey10;

    .el-form-item {
      margin-bottom: 0px;
      &:not(:first-child) {
        margin-left: 30px;
      }
    }
  }
  .board-left {
    flex: 1;
    background: $grey10;
    padding: 10px 0 0 15px;
    font-size: 12px;
    overflow: hidden;

    .display-ratio {
      display: flex;
      align-items: center;

      &-control {
        display: flex;
        align-items: center;
        padding: 5px;
        border: 1px solid $grey6;
      }

      i {
        color: $--color-primary-light-1;
        margin-right: 10px;
        cursor: pointer;
      }

      .el-button {
        padding: 5px 8px;
        margin-left: 0px;
        border: none;
      }
    }
  }

  @mixin bar($bg) {
    position: absolute;
    top: 0;
    width: 5px;
    height: 100%;
    background: $bg;
  }

  .tiers {
    height: calc(100vh - 328px);
    overflow: auto;
    .tier {
      display: flex;
      padding-bottom: 10px;

      .flex-1 {
        &.flex-center {
          justify-content: space-between;
        }
      }

      .linear-bg {
        background: linear-gradient(
          to right,
          $--color-primary-light-8,
          $--color-primary-light-3
        );
        position: relative;
      }

      .grey-bg {
        background: $grey8;
        position: relative;
      }

      .linear-bar {
        &-left {
          @include bar(
            linear-gradient(to bottom, $--color-primary-light-1, #48bdcf)
          );
          left: 0;
        }
        &-right {
          @include bar(
            linear-gradient(to bottom, $--color-primary-light-1, #48bdcf)
          );
          right: 0;
        }
      }

      .grey-bar {
        &-left {
          @include bar(linear-gradient(to bottom, #b4daf0, #b2e0e9));
          left: 0;
        }
        &-right {
          @include bar(linear-gradient(to bottom, #b4daf0, #b2e0e9));
          right: 0;
        }
      }

      .linear-box {
        min-height: 120px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          border-left: 400px solid transparent;
          border-bottom: 10px solid $grey10;
          overflow: hidden;
        }
      }

      .curve {
        position: relative;
        padding: 10px 0;

        svg {
          width: 100%;
          height: 100%;
          position: absolute;
          left: -5px;
          top: 0;
        }
      }

      span {
        position: relative;

        .dot {
          position: absolute;
          top: 6px;
          width: 7px;
          height: 7px;
          background-color: $grey10;
          border: 1px solid $--color-primary-light-1;
          border-radius: 50%;

          &-left {
            left: -15px;
          }
          &-right {
            right: -1px;
          }
        }
      }
      p {
        position: relative;
        z-index: 2;
        text-align: right;
        padding-top: 0px;
        padding-right: 10px;
        line-height: 26px;
        > span {
          text-align: left;
        }
      }
    }
  }

  .board-right {
    margin-left: 10px;
    width: 35%;
    background: $grey8;
    padding: 10px 15px;
    font-size: 12px;
  }

  .sample-list {
    height: calc(100vh - 252px);
    overflow: auto;
    &-row {
      display: flex;

      &:last-child {
        .sample-line {
          border: none;
          height: 0px;

          &::before {
            left: 1px;
            top: 34px;
          }
        }
      }
    }
    .sample-line {
      width: 0;
      border-left: 1.5px dashed $grey5;
      transform: translateY(50%);
      margin-left: 3px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        top: -6px;
        left: -1px;
        transform: translateX(-48%);
        background: $grey10;
        border: 1.5px solid $grey5;
        border-radius: 50%;
      }
    }
    .sample-card {
      flex: 1;
      margin-left: 15px;
      margin-bottom: 10px;
      margin-right: 3px;
      padding: 10px;
      background-color: $grey10;
    }
  }
}
</style>
