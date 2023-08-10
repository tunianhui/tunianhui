<template>
  <section class="structure dark-loading" v-loading="!!loading" ref="page">
    <div class="structure-legends">
      <dl class="legend" v-for="item in legends" :key="item.label">
        <dt>{{item.label}}：</dt>
        <dd v-for="d in item.data" :key="d.label" :class="{checked: d.checked}">
          <!-- @click="d.checked = !d.checked" -->
          <i :class="[d.icon, d.type]"></i>&nbsp;{{d.label}}
        </dd>
      </dl>
      <dl class="legend">
        <dt>搜索：</dt>
        <dd>
          <el-select v-model="activeNode" class="dark-input" popper-class="structure-select-popper dark-popper no-arrow no-gutter" placeholder="搜索维度或业务过程" filterable clearable @change="changeNode">
            <el-option v-for="item in selectList" :key="item.id" :value="item.id" :label="item.name">
              <i :class="[item.icon, item.type]"></i>&nbsp;&nbsp;{{item.name}}
            </el-option>
          </el-select>
        </dd>
      </dl>
    </div>

    <el-slider v-model="rotate" v-if="visibleSlider" :max="360" @input="changeRotation"></el-slider>

    <ul class="structure-tabs">
      <li v-for="(tab, index) in tabs" :key="tab.id" @click="tabClick(tab, index)" :class="{active: tab.id === activeTab.id}">
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
      <div class="outter" ref="outter"></div>
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
        <div class="ball" ref="ball">
          <p>{{activeTab.name || ''}}</p>
          <p>{{activeTab.storage ? `${activeTab.storage}TB` : ''}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {getStructureGraphicData, getStructureList} from '@/api/asset/wholescene'
import {iconMap, types} from '@/config/rd-config'
import {on, off, textSize, addClass, removeClass} from '@/libs/dom'
import {deg2Rad} from '@/libs/maf'
// import data from './genStructureData'
// import data from './genData'
// console.log(data)

const dimensionIcon = iconMap[types.DIMENSION].icon
const factIcon = iconMap[types.FACT].icon
const nodeSize = 56
const smallNodeSize = 38

export default {
  name: 'Structure',
  props: {

  },
  data() {
    return {
      dimensionIcon,
      factIcon,
      loading: 0,
      minPaddingRotate: 3,
      inner: {
        // 一次最多显示多少个节点
        max: 10,
        // 左右两边的间距
        paddingRotate: 15,
        rotate: 0,
        angle: 0
      },
      outter: {
        max: 20,
        paddingRotate: 8,
        rotate: 0,
        angle: 0
      },
      // 圆弧在半径的基础上延伸的长度
      arcExtendWidth: 20,
      arcExtendWidthGap: 6,
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
            {label: '业务过程', type: 'process', checked: true, icon: factIcon}
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
      activeTab: {},
      tabs: [],
      graphicData: {},
      rotate: 0,
      selectList: [],
      activeNode: '',
      visibleSlider: false
    }
  },
  watch: {
    activeNode: {
      immediate: true,
      handler(id, lastId) {
        if (lastId) {
          this.setRelationsClass(lastId, 'remove')
        }
        this.setRelationsClass(id, 'add')
      }
    }
  },
  created() {
  },
  mounted() {
    this.getList()
    this.svg = this.$d3.select('#structureSvg')
    on(window, 'resize', this.initGraphic)
    on(this.$refs.page, 'click', this.setActiveNode.bind(this))
  },
  beforeDestroy() {
    off(window, 'resize', this.initGraphic)
    off(this.$refs.page, 'click', this.setActiveNode.bind(this))
  },
  methods: {
    async getList() {
      this.loading++
      const res = await this.$simpleAsyncTo(getStructureList(), '获取资源结构列表失败')
      if (res) {
        this.tabs = res.data || []
        this.activeTab = this.tabs[0]
        addClass(this.$refs.ball, 'ball-1')
        this.getGraphicData()
      }
      this.loading--
    },
    async getGraphicData() {
      this.loading++
      const res = await this.$simpleAsyncTo(getStructureGraphicData({
        id: this.activeTab.id
      }), '获取资源结构图形数据失败')
      // console.log(getStructureGraphicData)
      // await this.$sleep(1000)
      // const res = data

      if (res) {
        // this.graphicData = res.data
        const {dimensionList, processList} = res.data
        const relations = []
        dimensionList.forEach(item => {
          item.relationIds && item.relationIds.forEach(id => {
            relations.push({
              source: item.id,
              target: id
            })
          })
          item.parentId && relations.push({
            source: item.parentId,
            target: item.id,
            // 线段画在圆上
            inCircle: true
          })
        })
        processList.forEach(item => {
          item.relationIds && item.relationIds.forEach(id => {
            relations.push({
              source: id,
              target: item.id
            })
          })
        })
        this.graphicData = {
          sources: dimensionList,
          targets: processList,
          relations
        }
        this.initGraphic()
      }
      this.loading--
    },
    async tabClick(tab, index) {
      const ball = this.$refs.ball
      addClass(ball, 'animation')
      this.rotate = 0
      await this.$sleep(120)
      ball.className = `ball ball-${index % 20 + 1} animation`
      this.activeTab = tab
      this.getGraphicData()
      await this.$sleep(120)
      removeClass(ball, 'animation')
    },
    async changeNode(id) {
      const {maps} = this.graphicData
      if (maps) {
        const data = maps[id]
        const rotateDeg = data.rotate - 90 + this[data.position].rotate,
          rotate = this[data.position].sliderScale(rotateDeg)
        if (rotate > 1) {
          this.rotate = rotate
        } else {
          this.rotate = 0
        }
        await this.$sleep(30)
        // this.activeNode = id
        this.setRelationsClass(id, 'add')
      }
    },
    setActiveNode(event) {
      const node = event.target.closest('.graphic-item')
      if (node) {
        const id = node.getAttribute('id').slice(5)
        this.activeNode = id
      } else {
        this.activeNode = ''
      }
    },
    setRelationsClass(id, handle) {
      const {maps} = this.graphicData
      if (maps && maps[id]) {
        const {linkSources, linkTargets} = maps[id] || {}
        this[`${handle}ClassById`](`node_${id}`, 'active')
        linkSources.forEach(obj => {
          const _id = `path_${obj.source}_${id}`
          this[`${handle}ClassById`](_id, 'active')
          this[`${handle}ClassById`](`node_${obj.source}`, 'active')
        })

        linkTargets.forEach(obj => {
          const _id = `path_${id}_${obj.target}`
          this[`${handle}ClassById`](_id, 'active')
          this[`${handle}ClassById`](`node_${obj.target}`, 'active')
        })
      }
    },
    addClassById(id, handle) {
      const dom = document.querySelector(`#${id}`)
      dom && addClass(dom, 'active')
    },
    removeClassById(id, handle) {
      const dom = document.querySelector(`#${id}`)
      dom && removeClass(dom, 'active')
    },
    changeRotation(rotate) {
      const {rotationScale: innerRotationScale} = this.inner,
        {rotationScale: outterRotationScale} = this.outter
      if (innerRotationScale) {
        this.inner.rotate = innerRotationScale(rotate)
        this.inner.angle = deg2Rad(this.inner.rotate)
      }
      if (outterRotationScale) {
        this.outter.rotate = outterRotationScale(rotate)
        this.outter.angle = deg2Rad(this.outter.rotate)
      }
      ;(innerRotationScale || outterRotationScale) && this.drawGraphic()
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
    addGraphicItemsInHtml() {
      const {sourcesMap, targetsMap} = this.graphicData,
        $outter = this.$refs.outter,
        $inner = this.$refs.inner
      $outter.innerHTML = this.reverseDataToHtml(sourcesMap, 'outter')
      $inner.innerHTML = this.reverseDataToHtml(targetsMap, 'inner')
    },
    reverseDataToHtml(data, position) {
      return Object.values(data).reduce((prev, cur) => prev + this.getGraphicItemHtml(cur, position), '')
    },
    processData(data) {
      const {sources, targets} = this.graphicData
      this.selectList = []
      this.graphicData.sourcesMap = this.processItemsData(sources, 'outter')
      this.graphicData.targetsMap = this.processItemsData(targets, 'inner')
      this.graphicData.maps = {
        ...this.graphicData.sourcesMap,
        ...this.graphicData.targetsMap
      }
      if (this.inner.maxRotate > 180 - this.inner.paddingRotate || this.outter.maxRotate >= 180 - this.outter.paddingRotate) {
        this.visibleSlider = true
      }
    },
    processItemsData(data, position) {
      const {outterRadius, innerRadius, center} = this.layout,
        radius = position === 'inner' ? innerRadius : outterRadius,
        icon = position === 'inner' ? factIcon : dimensionIcon,
        {paddingRotate, max, angle: startAngle, rotate: startRotate} = this[position],
        {relations} = this.graphicData,
        len = data.length,
        outOfRange = len > max - 1,
        // perRotate = (180 - paddingRotate * 2) / (outOfRange ? max - 1 : len + 1),
        perRotate = outOfRange ? (180 - paddingRotate * 2) / (max - 1) : 180 / (len + 1),
        perAngle = deg2Rad(perRotate),
        paddingAngle = deg2Rad(paddingRotate),
        maxRotate = perRotate * (len - 1) + paddingRotate
      this[position].paddingAngle = paddingAngle
      this[position].perRotate = perRotate
      this[position].perAngle = perAngle
      this[position].maxRotate = maxRotate
      this[position].rotationScale = this.getRotationScale(maxRotate, paddingRotate)
      this[position].sliderScale = this.getSliderScale(maxRotate, paddingRotate)

      return data.reduce((prev, cur, index) => {
        const {name, type, id} = cur,
          angle = outOfRange ? perAngle * index + paddingAngle - startAngle : perAngle * (index + 1),
          rotate = outOfRange ? perRotate * index + paddingRotate - startRotate : perRotate * (index + 1),
          {x: left, y: top} = this.getArcSpotPos(center, radius, angle),
          linkSources = relations.filter(obj => obj.target === id),
          linkTargets = relations.filter(obj => obj.source === id)
        let x, y, size, nSize = ['3', '4'].includes(type + '') ? smallNodeSize : nodeSize

        if (position === 'outter') {
          size = textSize(name)
          const pos = this.getArcSpotPos(center, radius + size.width + nSize / 2 + 10, angle)
          x = pos.x
          y = pos.y
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
          linkSources,
          linkTargets,
          text: name,
          textSize: size,
          relations: '',
          type,
          position,
          className: type ? `graphic-${type}` : ''
        }
        this.selectList.push({
          id,
          name,
          icon,
          type
        })
        return prev
      }, {})
    },
    getArcSpotPos(center, radius, angle) {
      return {
        x: center[0] - Math.cos(angle) * radius,
        // 屏幕中y轴正方向朝下
        y: center[1] - Math.sin(angle) * radius
      }
    },
    getRotationScale(max, padding) {
      return this.$d3.scaleLinear()
        .domain([0, 360])
        .range([0, max - 180 + padding])
    },
    getSliderScale(max, padding) {
      return this.$d3.scaleLinear()
        .domain([0, max - 180 + padding])
        .range([0, 360])
    },
    getScaleBand(data, min) {
      const domain = data.map((d, i) => i + 1),
        range = this.getRange(data.length < min)
      // console.log(domain.push(domain.length + 1), domain)
      domain.push(domain.length + 1)
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
      this.inner.radius = height * 0.60
      this.outter.radius = height * 0.90
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
        {outterRadius, center} = this.layout,
        {paddingRotate: innerPaddingRotate, rotate: innerStartRotate} = this.inner,
        {paddingRotate: outterPaddingRotate, rotate: outterStartRotate} = this.outter,
        innerPadding = innerStartRotate === 0 ? innerPaddingRotate : this.minPaddingRotate,
        outterPadding = outterStartRotate === 0 ? outterPaddingRotate : this.minPaddingRotate

      this.arcExtendWidth = 20
      relations.forEach(item => {
        const {source, target} = item,
          sourceOpt = sourcesMap[source]
        // targetOpt = sourcesMap[target] || targetsMap[target]
        let targetOpt, targetPadding
        if (sourcesMap[target]) {
          targetOpt = sourcesMap[target]
          targetPadding = outterPadding
        } else {
          targetOpt = targetsMap[target]
          targetPadding = innerPadding
        }
        if (!sourceOpt || !targetOpt) return
        if (sourceOpt.rotate > 180 - outterPadding || sourceOpt.rotate < outterPadding || targetOpt.rotate > 180 - targetPadding || targetOpt.rotate < targetPadding) return
        if (sourcesMap[target]) {
          const {angle: sangle, rotate: srotate, x: sx, y: sy, textSize: stextSize, left: sleft, top: stop} = sourceOpt,
            {angle: eangle, rotate: erotate, x: ex, y: ey, textSize: etextSize, left: eleft, top: etop} = targetOpt,
            sradius = outterRadius + this.arcExtendWidth + stextSize.width,
            eradius = outterRadius + this.arcExtendWidth + etextSize.width,
            // sradius = outterRadius + stextSize.width,
            // eradius = outterRadius + etextSize.width,
            radius = (sradius > eradius ? sradius : eradius) + nodeSize / 2,
            {x: asx, y: asy} = this.getArcSpotPos(center, radius, sangle),
            {x: aex, y: aey} = this.getArcSpotPos(center, radius, eangle)
          let d, sweepFlag
          if (item.inCircle) {
            // 顺时针(1) 逆时针(0)
            sweepFlag = erotate < srotate ? 0 : 1
            d = `M ${sleft} ${stop} A ${outterRadius} ${outterRadius} 0 0 ${sweepFlag} ${eleft} ${etop}`
          } else {
            // 顺时针(1) 逆时针(0)
            sweepFlag = erotate - srotate > 180 ? 0 : 1
            // d = `M ${sx} ${sy} L ${asx} ${asy} A ${radius} ${radius} ${eangle - sangle} 0 ${sweepFlag} ${aex} ${aey} L ${ex} ${ey}`
            d = `M ${sx} ${sy} L ${asx} ${asy} A ${radius} ${radius} 0 0 ${sweepFlag} ${aex} ${aey} L ${ex} ${ey}`
          }

          this.arcExtendWidth += this.arcExtendWidthGap
          $paths.append('path')
            .attr('id', `path_${sourceOpt.id}_${targetOpt.id}`)
            .attr('d', d)
            .classed('fat-path', item.inCircle)
        } else {
          $lines.append('line')
            .attr('id', `path_${sourceOpt.id}_${targetOpt.id}`)
            .attr('x1', sourceOpt.left)
            .attr('y1', sourceOpt.top)
            .attr('x2', targetOpt.left)
            .attr('y2', targetOpt.top)
        }
      })
    },
    getGraphicItemHtml(data, position) {
      const {className, icon, text, left, top, angle, id, rotate} = data,
        {paddingRotate, rotate: startRotate} = this[position],
        padding = startRotate === 0 ? paddingRotate : this.minPaddingRotate
      let textStyle = `transform: rotate(${rotate}deg) `
      const textClass = className ? (rotate < 90 ? 'text-position-right' : '') : (rotate >= 90 ? 'text-position-right' : ''),
        itemClass = className + (rotate > 180 - padding || rotate < padding ? ' graphic-item-hide' : '')

      if (className) {
        textStyle += rotate >= 90 ? `rotate(180deg)` : 'translate(-100%, 0)'
      } else {
        textStyle += rotate >= 90 ? 'rotate(180deg) translate(-100%, 0)' : ''
      }
      textStyle += ';'
      return `
        <div class="graphic-item ${itemClass}" style="left: ${left}px; top: ${top}px;" angle="${angle}" id="node_${id}">
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

  .el-slider {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translateX(-50%);
    z-index: 999;
  }

  .structure-legends {
    position: absolute;
    left: 10px;
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

        &.process {
          color: lighten($processColor, 25%);
        }
        &.general {
          color: lighten($generalColor, 10%);
        }
        &.other {
          color: lighten($otherColor, 10%);
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

        .fat-path {
          stroke-width: 5;
          stroke: darken($--color-primary, 20%);
          stroke-dasharray: 0;
          &.active {
            stroke: $--color-primary;
          }
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
      $nodeSize: 56px;
      position: absolute;
      cursor: pointer;
      left: 500px;
      top: 200px;
      z-index: 3;
      margin-left: -$nodeSize / 2;
      margin-top: -$nodeSize / 2;

      &.graphic-item-hide {
        display: none;
      }

      .circle {
        @include circle($nodeSize, transparent);
        display: flex;
        align-items: center;
        justify-content: center;

        .circle-inner {
          $innerSize: $nodeSize * 0.7;
          // @include circle($innerSize, darken($grey5, 20%));
          @include circle($innerSize, $processColor);
          line-height: $innerSize;
          text-align: center;

          .iconfont {
            font-size: 20px;
            font-weight: bold;
            color: $grey5;
          }
        }
      }

      // &.graphic-general {
      //   @include circleBg(transparent, darken($generalColor, 20%));
      // }
      // &.graphic-other {
      //   @include circleBg(transparent, darken($otherColor, 20%));
      // }
      &.graphic-1, &.graphic-3 {
        @include circleBg(transparent, darken($generalColor, 5%));
      }
      &.graphic-2, &.graphic-4 {
        @include circleBg(transparent, darken($otherColor, 5%));
      }

      &.graphic-3, &.graphic-4 {
        $smallNodeSize: 38px;

        margin-left: -$smallNodeSize / 2;
        margin-top: -$smallNodeSize / 2;
        .circle {
          width: $smallNodeSize;
          height: $smallNodeSize;
          .circle-inner {
            $innerSize: 26px;
            width: $innerSize;
            height: $innerSize;
            line-height: $innerSize - 2;

            .iconfont {
              font-size: 13px;
            }
          }
        }
        .text-position {
          height: $smallNodeSize;
          line-height: $smallNodeSize;
          padding-left: $smallNodeSize;
        }
      }

      .text-position {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: $nodeSize;
        line-height: $nodeSize;
        padding-left: $nodeSize;
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
        // @include circleBg(rgba(darken($grey5, 20%), 0.7), $grey5);
        @include circleBg(rgba($processColor, 0.8), lighten($processColor, 25%));
        &.graphic-general,
        &.graphic-1,
        &.graphic-3 {
          // @include circleBg(rgba(darken($generalColor, 20%), 0.7), $generalColor);
          @include circleBg(rgba($generalColor, 0.8), lighten($generalColor, 10%));
        }
        &.graphic-other,
        &.graphic-2,
        &.graphic-4 {
          // @include circleBg(rgba(darken($otherColor, 20%), 0.7), $otherColor);
          @include circleBg(rgba($otherColor, 0.8), lighten($otherColor, 10%));
        }
        .circle .circle-inner .iconfont {
          color: $grey10;
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

    .ball {
      $padding: 152px;
      position: absolute;
      width: $centerBallSize - $padding;
      height: $centerBallSize - $padding;
      border-radius: 50%;
      left: $padding / 2;
      top: $padding / 2;
      text-align: center;
      padding-top: 30px;
      p {
        line-height: 24px;
      }

      &.animation {
        animation: ballAnimate 0.3s ease-in-out;
      }

      @keyframes ballAnimate {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        49% {
          transform: translate(-50px, 100px) rotate(-90deg);
        }
        51% {
          transform: translate(50px, 100px) rotate(90deg);
        }
        100% {
          transform: translate(0, 0) rotate(0deg);
        }
      }
    }

    $colors: (
      (#090457, #552DAD),
      (#F0302D, #fc9566),
      (#20A6E1, #88bbb3),
      (#025358, #6a5af8),
      (#C738AA, #3674f8),
      (#71f177, #7ffc66),
      (#1E1D63, #8071f1),
      (#281963, #aef585),
      (#3F3F40, #C9C7BD),
      (#0a3464, #92CFA4),
      (#786BF2, #fc6284),
      (#fc9566, #b9fc62),
      (#717716, #7b8efa),
      (#055c7e, #c3f58a),
      (#606d67, #b5fdbe),
      (#c72b2b, #6271fc),
      (#d84806, #b9fc62),
      (#1a3057, #59c4ee),
      (#c01da5, #9becdc),
      (#087a12, #e2f57a)
    );

    @mixin gradient($color1, $color2) {
      background: radial-gradient($color1, $color2);
    }

    @for $i from 1 through length($colors) {
      .ball-#{$i} {
        $-colors: nth($colors, $i);
        @include gradient(nth($-colors, 1), nth($-colors, 2));
      }
    }
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

  // .center-info {
  //   position: absolute;
  //   width: $centerBallSize - 60;
  //   height: ($centerBallSize - 60) / 2;
  //   left: 50%;
  //   bottom: -($centerBallSize - 30) / 4;
  //   transform: translateX(-50%);
  //   text-align: center;
  //   z-index: 10;
  // }

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
.structure-select-popper {
  .iconfont {
    font-weight: bold;
    &.general {
      color: $generalColor;
    }
    &.other {
      color: $otherColor;
    }
  }
}
</style>
