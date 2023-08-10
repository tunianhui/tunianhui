<template>
  <section class="structure dark-loading" v-loading="!!loading">
    <div class="structure-legends">
      <dl class="legend" v-for="item in legends" :key="item.label">
        <dt>{{item.label}}:</dt>
        <dd v-for="d in item.data" :key="d.label" :class="{checked: d.checked}" @click="d.checked = !d.checked">
          <i :class="[d.icon, d.type]"></i>{{d.label}}
        </dd>
      </dl>
    </div>
    <ul class="structure-tabs">
      <li v-for="tab in tabs" :key="tab.id" @click="tabClick(tab)" :class="{active: tab.id === activeTab.id}">
        <img src="@/assets/images/asset/earth.png" width="20" height="20" alt="">
        {{tab.name}}
      </li>
    </ul>
    <div class="structure-graphic">
      <!-- <span style="font-size: 14px; position: absolute; z-index: 10;">abcdefghijklmnopqrstuvwxyz</span> -->
      <!-- <span style="font-size: 14px; position: absolute; left: 300px; z-index: 10;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span> -->
      <!-- <span style="font-size: 14px; position: absolute; z-index: 10;">a</span>
      <span style="font-size: 14px; position: absolute; left: 300px; z-index: 10;">A</span>
      <span style="font-size: 14px; position: absolute; left: 400px; z-index: 10;">+</span>
      <span style="font-size: 14px; position: absolute; left: 600px; z-index: 10;">我</span> -->
      <svg id="structureSvg">
      <!-- <path d="M100 0 A100 100 0 0 1 200 100 " stroke="lime" stroke-width="3" fill-opacity="0.5" />
      <path d="M100 100 A100 100 0 1 1 200 200 " stroke="lime" stroke-width="3" fill-opacity="0.5" /> -->
        <g id="circles" class="circles"></g>
        <g id="lines" class="lines"></g>
        <g id="paths" class="paths"></g>
      </svg>
      <div class="outter" ref="outter">
      </div>
      <div class="inner" ref="inner"></div>
      <div class="center-ball">
        <div class="circle-lines">
          <div class="circle-line circle-line1"></div>
          <div class="circle-line circle-line3"></div>
          <div class="circle-line circle-line4"></div>
          <div class="circle-line circle-line5"></div>
          <div class="circle-line circle-line6"></div>
          <div class="circle-line circle-line7"></div>
          <div class="circle-line circle-line8"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {getStructureGraphicData, getStructureList} from '@/api/asset/wholescene'
import {iconMap, types} from '@/config/rd-config'
import {on, off, textSize} from '@/libs/dom'

const dimensionIcon = iconMap[types.DIMENSION].icon
const processIcon = iconMap[types.FACT].icon
const circleSize = 50
export default {
  name: 'Structure',
  props: {

  },
  data() {
    return {
      dimensionIcon,
      processIcon,
      loading: 0,
      innerMin: 14,
      outterMin: 30,
      // 圆弧在半径的基础上延伸的长度
      arcExtendWidth: 10,
      legends: [
        {
          label: '维度',
          data: [
            {label: '普通维度', type: 'general', checked: true, icon: dimensionIcon},
            {label: '其它维度', type: 'other', checked: true, icon: dimensionIcon}
          ]
        },
        {
          label: '业务过程',
          data: [
            {label: '业务过程', checked: true, icon: processIcon}
          ]
        },
        {
          label: '关系',
          data: [
            {label: '父子关系', checked: true, icon: 'iconfont icon-shixian'},
            {label: '关联关系', checked: true, icon: 'iconfont icon-line-dashed'}
          ]
        }
      ],
      data: [],
      activeTab: '',
      tabs: [],
      graphicData: {},
      relations: []
    }
  },
  // computed: {
  //   graphicData() {
  //     return this.data.length ? this.data.find(item => item.name === this.activeTab) : {}
  //   }
  // },
  created() {
  },
  mounted() {
    this.getData()
    this.svg = this.$d3.select('#structureSvg')
    on(window, 'resize', this.initGraphic)
  },
  beforeDestroy() {
    off(window, 'resize', this.initGraphic)
  },
  methods: {
    async getList() {
      this.loading++
      const res = await this.$simpleAsyncTo(getStructureList(), '获取资源结构数据失败')
      if (res) {
        this.tabs = res.data
        this.activeTab = this.tabs[0]
        this.getGraphicData()
      }
      this.loading--
    },
    async getGraphicData() {
      this.loading++
      const res = await this.$simpleAsyncTo(getStructureGraphicData({
        id: this.activeTab.id
      }), '获取资源结构数据失败')
      if (res) {
        this.graphicData = res.data
        // this.tabs = this.data.map(item => item.name)
        // this.activeTab = this.tabs[0]
        this.initGraphic()
      }
      this.loading--
    },
    tabClick(tab) {
      this.activeTab = tab
      this.getGraphicData()
    },
    initGraphic() {
      this.setLayout()
      this.drawGraphic()
    },
    drawGraphic() {
      this.clearSvg()
      this.drawCircles()
      this.processData()
      this.addGraphicItemsInHtml()
      this.drawPaths()
    },
    processData(data) {
      const {processList, dimensionList} = this.graphicData,
        outterScale = this.getScaleBand(dimensionList, this.outterMin),
        innerScale = this.getScaleBand(processList, this.innerMin)
      this.graphicData.dimensionMap = this.processItemsData(dimensionList, outterScale, 'outter')
      this.graphicData.processMap = this.processItemsData(processList, innerScale, 'inner')
    },
    addGraphicItemsInHtml() {
      const {dimensionMap, processMap} = this.graphicData,
        $outter = this.$refs.outter,
        $inner = this.$refs.inner
      // console.log(dimensionMap, processMap, 'source, targets', this.layout)
      $outter.innerHTML = this.reverseDataToHtml(dimensionMap)
      $inner.innerHTML = this.reverseDataToHtml(processMap)
    },
    reverseDataToHtml(data) {
      return Object.values(data).reduce((prev, cur) => prev + this.getGraphicItemHtml(cur), '')
    },
    processItemsData(data, scale, position) {
      const {outterRadius, innerRadius, center} = this.layout,
        radius = position === 'inner' ? innerRadius : outterRadius,
        icon = position === 'inner' ? processIcon : dimensionIcon

      return data.reduce((prev, cur, index) => {
        const {name, type, id, relationIds, parentId} = cur,
          angle = scale(index + 1) + scale.bandwidth() / 2,
          rotate = -angle * 180 / Math.PI,
          {x: left, y: top} = this.getArcSpotPos(center, radius, angle)
          // left = center[0] - Math.cos(angle) * radius,
          // // 屏幕中y轴正方向朝下
          // top = center[1] + Math.sin(angle) * radius
        let x, y, size

        if (position === 'outter') {
          size = textSize(name)
          const pos = this.getArcSpotPos(center, radius + size.width + this.arcExtendWidth + circleSize / 2, angle)
          x = pos.x
          y = pos.y
          // x = center[0] - Math.cos(angle) * (radius + size.width)
          // y = center[1] + Math.sin(angle) * (radius + size.width)
          // {x, y} = this.getArcSpotPos(center, radius + size.width, angle)
        }
        prev[id] = {
          x,
          y,
          icon,
          rotate,
          angle,
          left,
          top,
          id,
          text: name,
          textSize: size,
          className: type ? `graphic-${type}` : ''
        }
        relationIds && relationIds.forEach(_id => {
          this.relations({
            source: id,
            target: _id,
            type: 'inner' ? 'line' : 'path'
          })
        })
        parentId && parentId.forEach(_id => {

        })
        return prev
      }, {})
    },
    getArcSpotPos(center, radius, angle) {
      return {
        x: center[0] - Math.cos(angle) * radius,
        // 屏幕中y轴正方向朝下
        y: center[1] + Math.sin(angle) * radius
      }
    },
    getScaleBand(data, min) {
      const domain = data.map((d, i) => i + 1),
        range = this.getRange(data.length < min)
      return this.$d3.scaleBand()
        .domain(domain)
        .range(range)
        .align(0)
    },
    getRange(flag) {
      // return flag ? [-Math.PI / 2, Math.PI / 2] : [-Math.PI / 2, Math.PI * 3 / 2]
      return flag ? [0, -Math.PI] : [0, -2 * Math.PI]
    },
    setLayout() {
      let width = window.innerWidth,
        height = window.innerHeight - 50,
        center = [width / 2, height]

      width = width * 0.85 < 1024 ? 1024 : width * 0.85
      height = height * 0.85 < 500 ? 500 : height * 0.85
      this.layout = {
        width: width,
        height: height,
        outterRadius: height * 0.90,
        innerRadius: height * 0.60,
        center
      }
    },
    clearSvg() {
      this.$d3.selectAll('.graphic-item').remove()
      this.svg.select('#lines').selectAll('line').remove()
      this.svg.select('#paths').selectAll('path').remove()
      this.svg.select('#circles').selectAll('circle').remove()
    },
    drawCircles() {
      const {innerRadius, outterRadius, center} = this.layout,
        radius = [innerRadius, outterRadius],
        circles = this.svg.select('#circles')
      circles.selectAll('circle')
        .data(radius)
        .enter()
        .append('circle')
        .attr('cx', center[0])
        .attr('cy', center[1])
        .attr('r', r => r)
    },
    drawPaths() {
      const {sourcesMap, targetsMap, relations} = this.graphicData,
        $lines = this.svg.select('#lines'),
        $paths = this.svg.select('#paths'),
        {outterRadius, center} = this.layout

      relations.forEach(item => {
        const {source, target} = item,
          sourceOpt = sourcesMap[source],
          targetOpt = sourcesMap[target] || targetsMap[target]
        // console.log(sourceOpt, targetOpt, source, target, sourcesMap, targetsMap)
        if (!sourceOpt || !targetOpt) return
        if (sourcesMap[target]) {
          const {angle: sangle, x: sx, y: sy, textSize: stextSize} = sourceOpt,
            {angle: eangle, x: ex, y: ey, textSize: etextSize} = targetOpt,
            sradius = outterRadius + this.arcExtendWidth + stextSize.width,
            eradius = outterRadius + this.arcExtendWidth + etextSize.width,
            // sradius = outterRadius + stextSize.width,
            // eradius = outterRadius + etextSize.width,
            radius = (sradius > eradius ? sradius : eradius) + circleSize / 2,
            {x: asx, y: asy} = this.getArcSpotPos(center, radius, sangle),
            {x: aex, y: aey} = this.getArcSpotPos(center, radius, eangle),
            d = `M ${sx} ${sy} L ${asx} ${asy} A ${radius} ${radius} ${eangle - sangle} 0 1 ${aex} ${aey} L ${ex} ${ey}`

          this.arcExtendWidth += 8
          console.log(d, $paths, sourceOpt, targetOpt, radius, asy, aey, ey, asx, sx, asy, sy, ex, sradius, eradius)
          $paths.append('path')
            .attr('d', d)
        } else {
          $lines.append('line')
            .attr('x1', sourceOpt.left)
            .attr('y1', sourceOpt.top)
            .attr('x2', targetOpt.left)
            .attr('y2', targetOpt.top)
        }
      })
    },
    getGraphicItemHtml(data) {
      const {className, icon, text, rotate, left, top, angle} = data
      let textStyle = `transform: rotate(${rotate}deg) `
      const textClass = className ? (rotate < 90 ? 'text-position-right' : '') : (rotate > 90 ? 'text-position-right' : '')
      if (className) {
        textStyle += rotate > 90 ? `rotate(180deg)` : 'translate(-100%, 0)'
      } else {
        textStyle += rotate > 90 ? 'rotate(180deg) translate(-100%, 0)' : ''
      }
      textStyle += ';'
      return `
        <div class="graphic-item ${className}" style="left: ${left}px; top: ${top}px;" angle="${angle}">
          <span class="text-position ${textClass}" style="${textStyle}">
            <span class="text">${text}</span>
          </span>
          <span class="circle">
            <span class="circle-inner">
              <i class="${icon}"></i>
            </span>
          </span>
        </div>
      `
    }
  }
}
</script>

<style lang="scss">
.structure {
  position: relative;
  height: 100%;
  overflow: hidden;
  .structure-legends {
    position: absolute;
    left: 0;
    top: 10px;
    z-index: 2;
    dl {
      display: flex;
      padding: 8px 0;
      // font-size: 12px;
      font-size: 14px;
    }
    dt {
      width: 80px;
      text-align: right;
      color: $grey4;
      margin-right: 10px;
    }
    dd {
      color: $grey9;
      opacity: 0.5;
      cursor: pointer;

      &.checked {
        opacity: 1;
      }

      &:not(:last-child) {
        margin-right: 15px;
      }

      i {
        margin-right: 4px;
        font-size: 14px;
        font-weight: bold;

        &.general {
          color: $generalColor;
        }
        &.other {
          color: $otherColor;
        }
      }
    }
  }
  .structure-tabs {
    position: absolute;
    right: 2vw;
    top: 62px;
    z-index: 2;
    max-height: 149px;
    overflow: auto;
    @include scrollbar(lighten($--color-primary, 20%), 6px);

    li {
      padding: 0 10px;
      margin: 5px 0;
      // line-height: 30px;
      color: $grey4;
      text-align: right;
      cursor: pointer;
      &.active, &:hover {
        color: $grey9;
      }
      &.active {
        // border-right: 2px solid $--color-primary;
        img {
          opacity: 1;
          vertical-align: middle;
        }
      }
      img {
        opacity: 0;
        transition: $transition;
        margin-right: 10px;
      }
    }
  }

  @mixin layout() {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .structure-graphic {
    @include layout;
    // min-height: 350px;
    // overflow: auto;
    // @include scrollbar($grey3);

    svg {
      @include layout;

      @mixin style() {
        stroke: $grey3;
        fill: transparent;
        &.active {
          stroke: $grey10;
        }
      }

      .circles {
        circle {
          @include style;
        }
      }
      .paths {
        path {
          stroke: $grey4;
          stroke-dasharray: 3, 3;
          @include style;
        }
      }
      .lines {
        line {
          @include style;
        }
      }
    }

    $textOffset: calc(-100% - 7px);
    .outter {
      @include layout;
      // .graphic-item .text {
      //   top: $textOffset;
      // }
    }
    .inner {
      position: absolute;
      // .graphic-item .text {
      //   bottom: $textOffset;
      // }
    }
    @mixin circle($size, $color) {
      display: inline-block;
      width: $size;
      height: $size;
      border-radius: 100%;
      background-color: $color;
    }

    @mixin circleBg($bg, $innerBg) {
      .circle {
        background-color: $bg;
        .circle-inner {
          background-color: $innerBg;
        }
      }
    }

    .graphic-item {
      $size: 50px;
      position: absolute;
      cursor: pointer;
      left: 500px;
      top: 200px;
      z-index: 3;
      margin-left: -$size / 2;
      margin-top: -$size / 2;

      .circle {
        @include circle($size, transparent);
        display: flex;
        align-items: center;
        justify-content: center;

        .circle-inner {
          $innerSize: 32px;
          @include circle($innerSize, darken($grey5, 20%));
          line-height: $innerSize;
          text-align: center;

          .iconfont {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }

      &.graphic-general {
        @include circleBg(transparent, darken($generalColor, 20%));
      }
      &.graphic-other {
        @include circleBg(transparent, darken($otherColor, 20%));
      }

      .text-position {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: $size;
        line-height: $size;
        padding-left: $size;
        font-size: 14px;
        white-space: nowrap;

        .text {
          position: absolute;
          color: $grey4;
        }

        &.text-position-right {
          .text {
            right: 0;
          }
        }
      }

      &:hover, &.active {
        @include circleBg(rgba(darken($grey5, 20%), 0.7), $grey5);
        &.graphic-general {
          @include circleBg(rgba(darken($generalColor, 20%), 0.7), $generalColor);
        }
        &.graphic-other {
          @include circleBg(rgba(darken($otherColor, 20%), 0.7), $otherColor);
        }
        .circle-wrapper {
          opacity: 0.3;
        }
        .text {
          color: $grey10;
        }
      }
    }
  }

  $centerBallSize: 344px;
  .center-ball {
    position: absolute;
    left: 50%;
    bottom: -$centerBallSize / 2;
    margin-left: -$centerBallSize / 2;
  }
  .circle-lines {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $centerBallSize;
    height: $centerBallSize;
    position: relative;
    .circle-line {
      position: absolute;
      opacity: 0.5;
      // left: 50%;
      // top: 50%;
      // transform: translate(-50%, -50%);
      animation: rotate 12s infinite;
      animation-timing-function: cubic-bezier(.25, .46, .45, .94);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    $lineMap: (329px, 329px, 1) (293px, 284px, 3) (180px, 280px, 4) (247px, 261px, 5) (244px, 241px, 6) (220px, 219px, 7) (158px, 210px, 8);
    @each $width, $height, $i in $lineMap {
      .circle-line#{$i} {
        width: $width;
        height: $height;
        background-image: url('~@/assets/images/asset/line#{$i}.png');

        @if ($i % 2 != 0) {
          animation-name: reverseRotate;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-45deg);
    }

    50% {
      transform: rotate(225deg);
    }
    100% {
      transform: rotate(-45deg);
    }
  }
  @keyframes reverseRotate {
    0% {
      transform: rotate(225deg);
    }
    50% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(225deg);
    }
  }
}
</style>
