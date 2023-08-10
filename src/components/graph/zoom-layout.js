import * as d3Zoom from 'd3-zoom'
import * as d3Selection from 'd3-selection'
import * as d3Dispatch from 'd3-dispatch'
import merge from 'lodash/merge'

// 这里的合并顺序不能更改
const d3 = Object.assign(d3Selection, d3Dispatch, d3Zoom)

export default class ZoomLayout {
  constructor(container, elements, options) {
    this.container = d3.select(container)
    this.zoomEles = Array.isArray(elements) ? elements : [elements]
    this.options = merge(
      {
        scaleExtent: [0.3, 3],
        translateExtent: [[-Infinity, -Infinity], [Infinity, Infinity]],
        step: 0.15
      },
      options
    )
    this.zoom = 1
    this.zoomBehavior()
  }

  zoomBehavior() {
    const {scaleExtent, translateExtent} = this.options
    this.zoomHandler = d3
      .zoom()
      .scaleExtent(scaleExtent)
      .translateExtent(translateExtent)
      .on('zoom', _ => {
        const {x, y, k} = d3.event.transform,
          transform = `translate(${x}px, ${y}px) scale(${k})`
        this.zoom = k
        this.zoomEles.forEach(item => {
          item.style.transform = transform
        })
      })
    this.container.call(this.zoomHandler).on('dblclick.zoom', null)
  }

  zoomIn() {
    this.zoom += this.options.step
    this.zoomHandler.scaleTo(this.container, this.zoom)
  }

  zoomOut() {
    this.zoom -= this.options.step
    this.zoomHandler.scaleTo(this.container, this.zoom)
  }

  zoomIdentity() {
    this.container.call(this.zoomHandler.transform, d3.zoomIdentity)
  }
}
