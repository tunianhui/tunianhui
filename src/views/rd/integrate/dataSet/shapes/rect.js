/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-29 16:49:56
 * @LastEditTime: 2023-07-15 19:55:32
 * @Description:
 */
import {Shape} from '@antv/x6'
import ports from '../ports'

export default Shape.Rect.define({
  shape: 'base-rect-integrate',
  width: 200,
  height: 40,
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
        width: 14,
        height: 14,
        x: 160,
        y: 15,
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
      width: 24,
      height: 24,
      refX: 8,
      refY: 8
    },
    text: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333333'
    }
  },
  ports: {
    ...ports
  }
})
