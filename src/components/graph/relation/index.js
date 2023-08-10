import ZoomLayout from '../zoom-layout'
import OverflowTooltip from '@c/overflow-tooltip'
import { getConsanguinity, getNextConsanguinity } from '@/api/asset/map'
// import {initData, nextRelationData} from './relation-data'
import { bezierCurveTo } from '@/libs/visual/tool/path'
// import RelationTable from './relation-table.vue'
import RelationTable from './relation-table.js'
import cloneDeep from 'lodash/cloneDeep'
import './style.scss'

const legendsList = [
  { class: 'prefix-column', label: '字段' },
  { class: 'prefix-physical', label: '物理表' },
  { class: 'prefix-logic', label: '逻辑表' }
]

// 这里的值需要与scss中的变量值保持一致
const nodeGap = 5,
  nodeHeight = 24,
  bodyPadding = 13,
  groupPadding = 5,
  searchHeight = 38,
  borderWidth = 1,
  bigPrefixSize = 12,
  // 预留空间
  reserved = 40,
  // 定位间距
  gapx = 40,
  tableWidth = 190,
  rootTableWidth = 100,
  rootTableHeight = 32,
  // 定位时除去上面搜索框的高度与padding
  outTop = searchHeight + bodyPadding

export default {
  name: 'RelationGraph',
  props: {
    data: Object
  },
  components: {
    RelationTable,
    OverflowTooltip
  },
  data() {
    return {
      isTemp: '0',
      radioList: [
        { name: '是', value: '1' },
        { name: '否', value: '0' }
      ],
      tools: [
        { title: '放大', icon: 'el-icon-zoom-in', handler: this.zoomIn },
        { title: '缩小', icon: 'el-icon-zoom-out', handler: this.zoomOut },
        {
          title: '恢复初始状态',
          icon: 'el-icon-refresh-right',
          handler: this.refresh
        },
        {
          title: '恢复初始位置',
          icon: 'el-icon-location-outline',
          handler: this.zoomIdentity
        }
      ],
      relationData: {},
      nodes: [],
      edges: [],
      firstPart: [],
      secondPart: {},
      thirdPart: [],
      fouthPart: [],
      loading: 0
    }
  },
  created() {
    this.getData()
  },
  computed: {
    visibleGraph() {
      const {
        directUpStreamTableCount,
        directDownStreamTableCount
      } = this.relationData
      return directUpStreamTableCount || directDownStreamTableCount
    }
  },
  render(h) {
    const {
      directUpStreamTableCount,
      directDownStreamTableCount
    } = this.relationData

    const tableCount = this.visibleGraph ? (
      <div>
        <span>直接上游表数：{directUpStreamTableCount || 0}</span>
        <span>直接下游表数：{directDownStreamTableCount || 0}</span>
      </div>
    ) : null
    return (
      <div class="graph" v-loading={this.loading}>
        <div class="graph-head">
          <div class="graph-head-left">
            <div>
              <label>是否过滤临时表：</label>
              <el-radio-group
                v-model={this.isTemp}
                on-change={this.changeTempType}
              >
                {this.radioList.map(item => (
                  <el-radio label={item.value}>{item.name}</el-radio>
                ))}
              </el-radio-group>
            </div>
            {tableCount}
          </div>
          <ul class="graph-head-right">{this.renderLegends(h)}</ul>
        </div>
        {this.visibleGraph ? this.renderGraph(h) : this.renderEmpty(h)}
        {/* {this.renderGraph(h)} */}
      </div>
    )
  },
  mounted() {
    // this.initGraph()
  },
  watch: {
    nodes: {
      deep: true,
      handler(data) {
        data.forEach(table => {
          const { parent } = table
          if (parent && !parent.isRoot) {
            const { data, curPage, active } = parent,
              page = data[curPage],
              g = page.find(
                group =>
                  group.modelId === active.modelId &&
                  group.modelType === active.modelType
              )
            table.visible = !!g
          }
        })
        this.getAllEdges()
      }
    }
  },
  methods: {
    async initGraph() {
      await this.$sleep(30)
      const $graph = this.$refs.graph
      this.zoomLayout = new ZoomLayout($graph, [
        this.$refs.nodes,
        this.$refs.edges
      ])
      const containerHeight = $graph.clientHeight,
        containerWidth = $graph.clientWidth
      this.maxPageHeight =
        containerHeight - searchHeight - bodyPadding * 2 - reserved
      this.onlyLogicPageTotal = this.getColumnCountByHeight(this.maxPageHeight)
      this.onlyLogicPageHeight = this.getLogicTableHeight(
        this.onlyLogicPageTotal
      )

      this.rootPos = {
        top:
          (containerHeight - rootTableHeight - reserved / 2) / 2 + searchHeight,
        left: (containerWidth - rootTableWidth) / 2
      }
    },
    changeTempType(val) {
      this.getData()
    },
    renderEmpty(h) {
      return (
        <div class="empty-graph">
          <img src={require('@/assets/images/TB1.png')} alt="" />
          <p>暂时没有血缘关系哦</p>
        </div>
      )
    },
    renderGraph(h) {
      return (
        <div class="graph-body">
          <div class="graph-container" ref="graph">
            <svg>
              <g class="edges" ref="edges">
                {this.renderPath(h)}
              </g>
            </svg>
            <div class="nodes" ref="nodes">
              {this.renderTable(h)}
            </div>
          </div>
          <ul class="graph-tools">{this.renderTools(h)}</ul>
        </div>
      )
    },
    renderPath(h) {
      return this.edges.map(edge => (
        <path d={edge} fill="none" stroke="#d1d9e4" />
      ))
    },
    renderTable(h) {
      return this.nodes.map(table => {
        const { data, position, placement, visible } = table
        if (table.isRoot) {
          return (
            <div class="root-table" style={position}>
              <p>
                <span class="prefix-physical prefix-physical-big" />
              </p>
              <OverflowTooltip>
                <span class="name">{data.tableName}</span>
              </OverflowTooltip>
            </div>
          )
        } else {
          return visible ? (
            <RelationTable
              data={table.data}
              active={table.active}
              style={table.positions[table.curPage]}
              v-model={table.curPage}
              placement={placement}
              on-node-click={payload => this.handleNodeClick(table, payload)}
            />
          ) : null
        }
      })
    },
    renderTools(h) {
      return this.tools.map(item => (
        <li on-click={item.handler}>
          <el-tooltip
            popper-class="dark-popper"
            content={item.title}
            placement="left"
          >
            <i class={item.icon} title={item.title} />
          </el-tooltip>
        </li>
      ))
    },
    renderLegends(h) {
      return legendsList.map(item => (
        <li>
          <i class={item.class} />
          {item.label}
        </li>
      ))
    },
    zoomIn() {
      this.zoomLayout.zoomIn()
    },
    zoomOut() {
      this.zoomLayout.zoomOut()
    },
    zoomIdentity() {
      this.zoomLayout.zoomIdentity()
    },
    refresh() {
      this.nodes = cloneDeep(this.initialData)
      this.zoomIdentity()
    },
    processRelationData() {
      const {
        upStreamTableList,
        downStreamTableList,
        modelId,
        modelType
      } = this.relationData
      const { left, top } = this.rootPos,
        cx = left + (rootTableWidth - bigPrefixSize) / 2,
        cy = top + bigPrefixSize / 2,
        position = {
          left: `${left}px`,
          top: `${top}px`
        },
        rootStream = {
          data: {
            tableName: this.data.name,
            modelId,
            modelType
          },
          isRoot: true,
          placement: 'center',
          controlPoint: {
            left: {
              x: cx,
              y: cy
            },
            right: {
              x: cx + bigPrefixSize,
              y: cy
            }
          },
          position
        }
      this.nodes = []
      this.nodes.push(rootStream)
      upStreamTableList.length &&
        this.nodes.push(
          this.initTableData(upStreamTableList, rootStream, 'left')
        )
      downStreamTableList.length &&
        this.nodes.push(
          this.initTableData(downStreamTableList, rootStream, 'right')
        )
      this.initialData = cloneDeep(this.nodes)
    },
    initTableData(data, parent, placement) {
      const _data = this.handlePaging(data)
      return {
        data: _data,
        placement,
        parent,
        curPage: 0,
        positions: this.getAllPagesPosition(_data, parent, placement),
        visible: true
      }
    },
    // 获取logicTabel, 在height 的范围内，还可以放几个字段
    getColumnCountByHeight(height) {
      return Math.floor((height - nodeGap) / (nodeHeight + nodeGap)) - 1
    },
    getAllPagesPosition(data, parent, placement) {
      return data.map(d => this.getPagePosition(d, parent, placement))
    },
    // 获取每个分页的定位
    getPagePosition(data, parent, placement) {
      const height = this.getPageHeight(data),
        width = parent.placement === 'center' ? rootTableWidth : tableWidth,
        { left, top } = parent.position,
        _top = `${parseFloat(top) -
          height / 2 -
          searchHeight -
          bigPrefixSize / 2}px`

      data.height = height
      return placement === 'right'
        ? { left: `${parseFloat(left) + gapx + width}px`, top: _top }
        : { left: `${parseFloat(left) - gapx - tableWidth}px`, top: _top }
    },
    // 获取每个分页的高度
    getPageHeight(data) {
      return (
        data.reduce((prev, cur) => prev + cur.height, 0) +
        (data.length - 1) * nodeGap
      )
    },
    getAllEdges() {
      this.edges = []
      this.nodes.slice(1).forEach(page => {
        const { data, placement, positions, parent, curPage, visible } = page
        visible &&
          this.edges.push(
            ...this.getEdges(
              data[curPage],
              parent,
              positions[curPage],
              placement
            )
          )
      })
    },
    getEdges(data, parent, position, placement) {
      const { x: x1, y: y1 } = parent.controlPoint[placement],
        edges = [],
        left = parseFloat(position.left),
        top = parseFloat(position.top),
        x2 =
          placement === 'right'
            ? left + groupPadding + borderWidth * 2
            : left + tableWidth - groupPadding - borderWidth,
        dx = (x2 - x1) / 2
      let y2 = top + outTop
      data.forEach((group, index) => {
        if (index !== 0) {
          y2 += nodeGap
        }
        if (group.modelType === 4) {
          group.position = {
            left: `${left}px`,
            top: `${y2}px`
          }
          y2 += nodeHeight / 2
          group.controlPoint = {
            left: {
              x: left + groupPadding + borderWidth,
              y: y2
            },
            right: {
              x: x2 + tableWidth - (groupPadding + borderWidth) * 2,
              y: y2
            }
          }
          edges.push(bezierCurveTo(x1, y1, x2, y2, dx))
          y2 += nodeHeight / 2
        } else {
          y2 += groupPadding + nodeGap + nodeHeight + borderWidth
          group.columnNameList.forEach((item, j) => {
            if (j !== 0) {
              y2 += nodeGap
            }
            y2 += nodeHeight / 2
            edges.push(bezierCurveTo(x1, y1, x2, y2, dx))
            y2 += nodeHeight / 2
          })
          y2 += 6
        }
      })
      return edges
    },
    // 分页
    handlePaging(data) {
      const pages = [[]]
      let i = 0
      let pageHeight = 0

      // 下一页重置
      const newPage = _ => {
        i++
        pageHeight = 0
        pages[i] = []
      }
      // 长字段的分页
      const longLogicTablePaging = d => {
        const { columnNameList } = d,
          len = columnNameList.length,
          pageSize = Math.floor(len / this.onlyLogicPageTotal),
          lastPageCount = len - pageSize * this.onlyLogicPageTotal
        let j = 0
        let list = columnNameList
        while (j < pageSize) {
          j++
          newPage()
          pages[i] = [
            {
              ...d,
              columnNameList: list.slice(0, this.onlyLogicPageTotal),
              height: this.onlyLogicPageHeight
            }
          ]
          list = list.slice(this.onlyLogicPageTotal)
          pageHeight = this.onlyLogicPageHeight
        }

        if (lastPageCount) {
          newPage()
          pageHeight = this.getLogicTableHeight(list.length)
          pages[i] = [
            {
              ...d,
              columnNameList: list,
              height: pageHeight
            }
          ]
        }
      }
      data.forEach(item => {
        pageHeight += nodeGap
        const remainHeight = this.maxPageHeight - pageHeight
        if (item.modelType === 4) {
          item.height = nodeHeight
          item.count = 1
          if (remainHeight - nodeGap >= item.height) {
            pages[i].push(item)
            pageHeight += item.height

            if (remainHeight - nodeGap === item.height) {
              newPage()
            }
          } else {
            i++
            pageHeight = item.height
            pages[i] = [item]
          }
        } else {
          const { columnNameList } = item,
            len = columnNameList.length,
            height = this.getLogicTableHeight(len)
          item.count = len
          // 剩余的高度 与 当前logic表的高度 比较
          if (remainHeight - nodeGap >= height) {
            item.height = height
            pageHeight += height
            pages[i].push(item)
            // 如果相等则重置到下一页
            if (remainHeight - nodeGap === height) {
              newPage()
            }
          } else {
            // 获取剩下的高度还能放几个字段
            const remainCount = this.getColumnCountByHeight(remainHeight)
            // 如果一个字段都放不下
            if (remainCount < 1) {
              longLogicTablePaging(item)
            } else {
              const h = this.getLogicTableHeight(remainCount)
              pageHeight += h
              pages[i].push({
                ...item,
                height: h,
                columnNameList: columnNameList.slice(0, remainCount)
              })
              longLogicTablePaging({
                ...item,
                columnNameList: columnNameList.slice(remainCount)
              })
            }
          }
        }
      })
      return pages
    },
    getLogicTableHeight(length) {
      return (
        (length + 1) * nodeHeight +
        (groupPadding + borderWidth) * 2 +
        (length > 0 ? length * nodeGap : 0)
      )
    },
    hasNode() { },
    async handleNodeClick(table, { node, page, pageNo }) {
      table.active = node
      if (node.modelType === 4) {
        this.loading++
        const res = await this.$simpleAsyncTo(getNextConsanguinity({
          cube_id: node.modelId,
          isTemp: this.isTemp,
          source_type: this.data.source_type
        }), '获取数据失败')
        // await this.$sleep(1000)
        // const res = nextRelationData
        if (res) {
          const { upStreamTableList, downStreamTableList } = res.data
          const data = this.initTableData(
            table.placement === 'right' ? downStreamTableList : upStreamTableList,
            Object.assign(table, node),
            table.placement
          )
          // 获取上游依赖节点
          const getParents = (node, arr = []) => {
            const { parent } = node
            if (parent) {
              arr.push(parent)
              getParents(parent, arr)
            }
            return arr
          }
          this.nodes = [
            // 获取不同方向的数据
            ...this.nodes.filter(n => n.placement !== table.placement),
            ...getParents(table),
            table,
            data
          ]
        }
        this.loading--
      }
    },
    async getData() {
      this.loading++
      const res = await this.$simpleAsyncTo(getConsanguinity({
        cube_id: this.data.id,
        isTemp: this.isTemp,
        source_type: this.data.source_type,
        project_code: this.data.project_code
      }), '获取数据失败')
      // await this.$sleep(1000)
      // const res = initData
      if (res) {
        this.relationData = res.data
        if (this.visibleGraph) {
          await this.initGraph()
          this.processRelationData()
        }
      }
      this.loading--
    }
  }
}
