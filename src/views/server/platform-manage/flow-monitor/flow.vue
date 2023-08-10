<template>
  <div class="flow-container" id="container"></div>
</template>

<script>
import {Graph, Addon, Shape} from '@antv/x6'
import BaseRect from '../../serve-dev/shapes/rect'
import x6Data from './data'
export default {
  mounted() {
    this.initGraph()
  },
  methods: {
    initGraph() {
      Graph.registerNode('base-rect', BaseRect, true)
      const graph = new Graph({
        container: document.getElementById('container'),
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              padding: 1
            }
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8
            }
          },
          anchor: 'center',
          // connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 10
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#333D55',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'classic',
                    size: 7
                  }
                }
              }
            })
          }
        }
      })
      graph.fromJSON(x6Data)
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-container {
  height: 100%;
}
</style>
