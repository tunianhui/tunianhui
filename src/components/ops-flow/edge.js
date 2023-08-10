export const primary = '#9b9b9b'
export const active = '#52619b'

export const registerEdgeConfig = {
  draw(cfg, group) {
    const {startPoint, endPoint} = cfg
    // console.log(
    //   startPoint,
    //   endPoint,
    //   group._cfg.item.getSource().getModel().name,
    //   group._cfg.item.getTarget().getModel().name
    // )
    const shape = group.addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x, endPoint.y / 2 + (1 / 2) * startPoint.y],
          ['L', endPoint.x, endPoint.y / 2 + (1 / 2) * startPoint.y],
          ['L', endPoint.x, endPoint.y]
        ],
        stroke: cfg.stroke || primary,
        lineWidth: 2,
        endArrow: {
          // path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
          // path: 'M0,0 L6,3 L0,6 L3,3Z',
          path: 'M-3,-5 L5,0 L-3,5 L0,0Z',
          d: 5
        }
      },
      className: 'edge'
    })
    return shape
  },
  setState(name, value, item) {
    const group = item.getContainer(),
      keyShape = group.findByClassName('edge')

    // children = group.get('children')
    // console.log(children.map(shape => shape.get('className')))
    // 这里的keyShape是draw里面的 keyShape
    // const keyShape = item.getKeyShape()
    if (!name) {
      keyShape.attr('stroke', primary)
      return
    }
    if (name === 'selected') {
      const color = value ? active : primary
      keyShape.attr('stroke', color)
    }
  }
}
