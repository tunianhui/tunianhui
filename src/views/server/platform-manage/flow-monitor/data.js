const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'base-rect',
      label: '开始',
      x: 80,
      y: 80,
      attrs: {
        icon: {
          'xlink:href': require('@/assets/images/serverDev/start_icon.png')
        }
      },
      data: {
        type: 'start'
      }
    },
    {
      id: 'node2',
      shape: 'base-rect',
      label: '节点1',
      x: 360,
      y: 210,
      attrs: {
        icon: {
          'xlink:href': require('@/assets/images/serverDev/switch_icon.png')
        }
      },
      data: {
        type: 'switch'
      }
    },
    {
      id: 'node3',
      shape: 'base-rect',
      label: '节点2',
      x: 360,
      y: 360,
      attrs: {
        icon: {
          'xlink:href': require('@/assets/images/serverDev/switch_icon.png')
        }
      },
      data: {
        type: 'switch'
      }
    },
    {
      id: 'node4',
      shape: 'base-rect',
      label: '结束',
      x: 360,
      y: 500,
      attrs: {
        icon: {
          'xlink:href': require('@/assets/images/serverDev/end_icon.png')
        }
      },
      data: {
        type: 'end'
      }
    }
  ],
  edges: [
    {
      source: {
        cell: 'node1',
        port: 'right'
      },
      target: {
        cell: 'node2',
        port: 'top'
      }
    },
    {
      source: {
        cell: 'node2',
        port: 'bottom'
      },
      target: {
        cell: 'node3',
        port: 'top'
      }
    },
    {
      source: {
        cell: 'node3',
        port: 'bottom'
      },
      target: {
        cell: 'node4',
        port: 'top'
      }
    }
  ]
}

export default data
