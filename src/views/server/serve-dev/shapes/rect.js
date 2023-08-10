import {Shape} from '@antv/x6'
import ports from '../ports'

export default Shape.Rect.define({
  shape: 'base-rect',
  width: 200,
  height: 60,
  markup: [
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'image',
      selector: 'icon'
    },
    {
      tagName: 'text',
      selector: 'label'
    },
    {
      tagName: 'image',
      selector: 'status',
      attrs: {
        width: 15,
        height: 15,
        x: 160,
        y: 23,
        'xlink:href': require('@/assets/images/serverDev/loading_icon.png')
      },
      style: {
        visibility: 'hidden'
        // transformOrigin: '50% 50%'
        // animation: 'spin 1s linear infinite'
      }
    }
  ],
  attrs: {
    body: {
      strokeWidth: 2,
      stroke: '#3A68CD',
      fill: '#ffffff'
    },
    icon: {
      width: 40,
      height: 40,
      refX: 10,
      refY: 10
    },
    text: {
      fontSize: 16,
      fill: '#333333'
    }
  },
  ports: {
    ...ports
  }
})
