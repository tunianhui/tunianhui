import {on, off, setStyles, hasClass} from '@/libs/dom'
import {
  getCornerLinePath,
  getCenterPoint,
  getPathPoints
} from '@/libs/visual/tool/path'
import {mapMutations} from 'vuex'
import '@/assets/css/wellcome.scss'

export default {
  inject: ['tabStore'],
  data() {
    return {
      marginTop: 25,
      strokeColor: this.$styleVars.grey5,
      strokeColorActive: this.$styleVars['--color-primary'],
      // 圆弧的角度
      radius: 15,
      // 通方向时的伸出长度
      length: 20
    }
  },
  mounted() {
    this.svg = this.$d3.select('#lines')
    this.svgOffsetTop = this.marginTop + this.$refs.head.clientHeight
    this.renderer()
    on(window, 'resize', this.renderer)
  },
  beforeDestroy() {
    off(window, 'resize', this.renderer)
    this.hoverAnimateMap &&
      this.hoverAnimateMap.forEach((paths, el) => {
        off(el, 'mouseenter', this.pathRun)
        off(el, 'mouseleave', this.pathStop)
      })
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    renderer() {
      this.svg.style('display', 'none')
      this.$debounce(this.render.bind(this), 500)()
    },
    render() {
      const $main = this.$refs.main,
        paths = [],
        points = []
      this.svg.style('display', 'block')
      this.svg.style('height', $main.scrollHeight + 36 + 'px')
      this.hoverAnimateMap
        ? this.hoverAnimateMap.clear()
        : (this.hoverAnimateMap = new Map())
      const targets = new Set()
      this.lines.forEach(item => {
        const {source, target, arrow, dir, straight} = item,
          $source = document.querySelector(`#${source}`),
          $target = document.querySelector(`#${target}`),
          [d1, d2] = dir.split('-')
        if ($source && $target) {
          const start = this.getPoint($source, d1),
            end = this.getPoint($target, d2)
          if (straight && ['left', 'right'].includes(d2)) {
            end[1] = start[1]
          }
          if (straight && ['top', 'bottom'].includes(d2)) {
            end[0] = start[0]
          }
          if (source === 'dataProcess') {
            start[0] = $main.clientWidth * 0.89
            start[1] -=
              $source.parentNode.clientHeight / 2 - $source.clientHeight / 2 - 1
          }
          if (source === 'modeling') {
            start[1] += 6
          }

          const path = getCornerLinePath(
            start,
            end,
            this.radius,
            dir,
            this.length
          )
          points.push([start, end])
          paths.push({
            path: path,
            id: `${source}-${target}`,
            target: $target,
            arrow
          })
          item.overlay &&
            this.setOverlayPos(
              start,
              end,
              document.querySelector(`#${item.overlay}`),
              path,
              dir
            )
          targets.add(target)
        }
      })

      this.drawLines(paths)
      this.hoverAnimates()
    },
    drawLines(paths) {
      this.svg
        .select('g')
        .selectAll('path')
        .remove()
      paths.forEach((d, index) => {
        const path = this.svg
          .select('g')
          .append('path')
          .attr('id', d.id)
          .attr('d', d.path)
          .attr('stroke', this.strokeColor)
          .attr('fill', 'transparent')

        const totalLength = path.node().getTotalLength()
        path
          .attr('stroke-dasharray', totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1200)
          .ease(this.$d3.easeCubic)
          .delay(200)
          .attr('stroke-dashoffset', 0)
          .on(
            'end',
            _ => d.arrow && path.attr('marker-end', 'url(#markerArrow)')
          )
        // path.attr('marker-end', 'url(#markerArrow)')
        const pathNodes = this.hoverAnimateMap.get(d.target) || []
        pathNodes.push(path)
        this.hoverAnimateMap.set(d.target, pathNodes)
      })
    },
    getPoint(el, dir) {
      const point = getCenterPoint(el, dir),
        parent = el.parentNode
      if (hasClass(parent, 'el-row')) {
        point[1] += parent.offsetTop + this.svgOffsetTop
        // right时消除padding-right的影响
        dir === 'right' && (point[0] -= 5)
        // 消除padding-left的影响
        dir === 'left' && (point[0] += 5)
      }
      return point
    },
    setOverlayPos(start, end, overlay, path, dir) {
      const [x1, y1] = start,
        [x2, y2] = end,
        [d1, d2] = dir.split('-'),
        width = overlay.clientWidth,
        height = overlay.clientHeight
      let left, top

      if (d1 === d2) {
        const points = getPathPoints(path)
        if (y1 === y2) {
          const ypoints = points.map(item => item[1]),
            y = d1 === 'top' ? Math.min(...ypoints) : Math.max(...ypoints)

          // console.log(ypoints)
          left = x1 + (x2 - x1 - width) / 2
          top = y - height / 2 - this.svgOffsetTop
          // console.log(y, y1, y2, left, top)
        } else if (x1 === x2) {
          const xpoints = points.map(item => item[0]),
            x = d1 === 'left' ? Math.min(...xpoints) : Math.max(...xpoints)
          left = x - width / 2
          top = x1 + (y1 - y2 - height) / 2 - this.svgOffsetTop
        }
      } else {
        left = x1 - width / 2
        top = y1 + (y2 - y1 - height) / 2 - this.svgOffsetTop
      }
      setStyles(overlay, {
        left: `${left}px`,
        top: `${top}px`
      })
    },
    hoverAnimates() {
      this.hoverAnimateMap.forEach((paths, el, map) => {
        off(el, 'mouseenter', this.pathRun)
        off(el, 'mouseleave', this.pathStop)
        on(el, 'mouseenter', this.pathRun)
        on(el, 'mouseleave', this.pathStop)
      })
    },
    pathRun(event) {
      const paths = this.hoverAnimateMap.get(event.target) || []
      // console.log(paths, this)
      paths.forEach(path => {
        const totalLength = path.node().getTotalLength(),
          duration = (totalLength / 50) * 1000
        // 改变 元素 dom中的排列顺序，使当前path显示最前面
        // 先删除，后添加！！！
        path.remove()
        this.svg
          .select('g')
          .node()
          .appendChild(path.node())
        // 有bug
        // this.svg.select('g').selectAll('path').lower()
        this.animate(path, totalLength, duration)
        // 使用css控制，不知道path的长度，动画时间不好控制
        // path.classed('animate', true)
      })
    },
    pathStop(event) {
      const paths = this.hoverAnimateMap.get(event.target) || []
      paths.forEach(path => {
        // interrupt 取消过渡
        path
          .interrupt()
          .attr('stroke-dasharray', 0)
          .attr('stroke-dashoffset', 0)
          .attr('stroke', this.strokeColor)
          .attr('marker-end', 'url(#markerArrow)')
      })
    },
    animate(path, totalLength, duration) {
      const dasharray = 6
      path
        .attr('stroke-dasharray', dasharray)
        .attr('stroke-dashoffset', totalLength)
        .attr('marker-end', 'url(#markerArrowActived)')
        .attr('stroke', this.strokeColorActive)
        .transition()
        .duration(duration)
        .ease(this.$d3.easeLinear)
        .attr('stroke-dashoffset', dasharray + 1)
        .on('end', _ => {
          this.animate(path, totalLength, duration)
        })
    },
    iconControl(control) {
      const {path, tab, dialog} = control
      path && this.$router.push(path)
      tab && this.tabStore.commit('add', tab)
      dialog && this.setActiveRdEditDialog(dialog)
    }
  }
}
