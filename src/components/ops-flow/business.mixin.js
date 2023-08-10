import {mapGetters, mapMutations} from 'vuex'
import {getTaskFlow, reRunTask, pauseRecover} from '@/api/rd/ops'
// import {recover, pause} from '@/config/ops-config'
import {Node} from './node'
import {uuid} from '@/libs/util'
import config from './config'

const findItem = (data, source, target) =>
  data.find(e => e.source === source && target === e.target)

// let id = 1

export default {
  data() {
    return {
      config,
      loading: 0,
      parentLevel: 1,
      childLevel: 1
    }
  },
  computed: {
    ...mapGetters({
      activeNode: 'ops/activeNode',
      project: 'project'
    }),
    instance_type() {
      return config[this.type].instance_type
    }
  },
  mounted() {
    this.$root.eventEmitter.on('changeGraph', this.changeGraph)
  },
  beforeDestroy() {
    this.$root.eventEmitter.off('changeGraph')
    this.graph = null
  },
  methods: {
    ...mapMutations({
      setActiveNode: 'ops/SET_ACTIVE_NODE',
      setActiveDialogComp: 'ops/SET_ACTIVE_DIALOG_COMP'
    }),
    async changeGraph() {
      await this.$sleep(100)
      if ((this.graph && this.graph.destroyed) || !this.graph) return
      this.parentLevel = 1
      this.childLevel = 1
      this.fetchGraphData()
    },
    mergeData(data1, data2) {
      const data = []
      data1.forEach(d1 => {
        const index = data2.findIndex(d2 => d2 && d2.cube_id === d1.cube_id)
        if (index > -1) {
          const d2 = data2[index]
          d1.parent = Array.from(new Set(d1.parent.concat(d2.parent)))
          d1.children = Array.from(new Set(d1.children.concat(d2.children)))
          data2.splice(index)
        }
        data.push(d1)
      })
      return data.concat(data2)
    },
    processData(data, mainId) {
      const nodes = [],
        edges = []
      const sortedData = this.sortData(data)

      sortedData.forEach(d => {
        const {children, parent} = d,
          cids = [],
          pids = []
        children &&
          children.forEach(c => {
            const source = d.id,
              target = (sortedData.find(dd => dd.cube_id === c) || {}).id

            target && cids.push(target)
            if (target && !findItem(edges, source, target)) {
              edges.push({source, target})
            }
          })
        parent &&
          parent.forEach(p => {
            const source = (sortedData.find(dd => dd.cube_id === p) || {}).id,
              target = d.id

            source && pids.push(source)
            if (source && !findItem(edges, source, target)) {
              edges.push({source, target})
            }
          })
        const n = new Node({
          ...d,
          cids,
          pids,
          isMain: d.cube_id === mainId
        })
        nodes.push(n)
      })
      return {nodes, edges}
    },
    sortData(data) {
      const arr = [],
        // 先找到最上面的父级节点
        root = data
          .filter(d => !d.parent || !d.parent.length)
          .map(d => {
            // d.id = `${id++}`
            // g6绘制时会根据id排序，如果id可以转成数字，绘制的图形会混乱，所以这里要使用带有字母的id，使用数字的前提是要保证id的大小与绘制图形是一致的
            !d.id && (d.id = uuid(10, 16))
            // d.id = uuid(10, 16)
            return d
          }),
        otherData = data.filter(d => d.parent && d.parent.length)
      arr.push(...root)

      const loop = function(parent) {
        const childIds = new Set(parent.map(p => p.children || []).flat()),
          children = []
        childIds.forEach(cube_id => {
          if (!arr.find(a => a.cube_id === cube_id)) {
            const item = otherData.find(d => d.cube_id === cube_id)
            if (item) {
              !item.id && (item.id = uuid(10, 16))
              // item.id = uuid(10, 16)
              arr.push(item)
              children.push(item)
            }
          }
        })
        children.length && loop(children)
      }
      // 递归父级节点进行排序和id赋值
      loop(root)

      return arr
    },
    pause(node, data) {
      this.$confirm(
        '此操作只暂停当前周期，下一周期仍会正常调度，是否继续暂停节点?',
        '暂停',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          this.handlePause(data)
        })
        .catch(_ => {})
    },
    recover(node, data) {
      this.$confirm('是否要恢复此节点?', '恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          this.handleRecover(data)
        })
        .catch(_ => {})
    },
    async fetchGraphData() {
      const {cube_id, instance_id} = this.activeNode

      this.loading++
      const res = await this.$simpleAsyncTo(
        getTaskFlow({
          // [config[this.type].id_key]: cube_id,
          cube_id,
          instance_id,
          parent_loop: this.parentLevel,
          child_loop: this.childLevel,
          instance_type: this.instance_type
        }),
        '获取流程数据失败'
      )
      if (res) {
        this.graphData = this.processData(res.data, cube_id)
        this.rerenderGraph()
        this.selectNodeByCubeId(cube_id)
      }
      this.loading--
    },
    // 展开父节点时先过滤的只剩子节点，通过过滤子节点来删除父节点
    // 展开子节点时先过滤的只剩父节点，通过过滤父节点来删除子节点
    filterNodesByType(cube_id, type) {
      const data = []

      const loop = (cube_id, isRoot) => {
        const node = this.wholeData.find(d => d.cube_id === cube_id)
        // if (isRoot) {
        //   node[type === 'children' ? 'parent' : 'children'] = []
        // }
        node && data.push(node)
        if (node && node[type]) {
          node[type].forEach(cid => {
            loop(cid)
          })
        }
      }
      loop(cube_id, true)
      return data
    },
    async expandParent(level, node, data) {
      this.setActiveNode(data)
      this.parentLevel = level
      // this.wholeData = this.filterNodesByType(data.cube_id, 'children')
      this.fetchGraphData()
    },
    async expandChild(level, node, data) {
      this.setActiveNode(data)
      this.childLevel = level
      // this.wholeData = this.filterNodesByType(data.cube_id, 'parent')
      this.fetchGraphData()
    },
    selectNodeByCubeId(cube_id) {
      const node = this.graphData.nodes.find(n => n.cube_id === cube_id)
      if (node) {
        this.selectNodeById(node.id)
      }
    },
    addData(node, data) {
      this.setActiveDialogComp('AddData')
      this.setActiveNode({...data, instance_type: this.instance_type})
    },
    showRunLog(node, data) {
      window.open(`/rd/ops/run-log?id=${data.instance_id}`)
    },
    showNodeCode(node, data) {
      window.open(`/rd/ops/node-code?id=${data.cube_id}`)
    },
    showPeriodInstance(node, data) {
      this.$router.push({
        // path: '/rd/ops/instance/period',
        name: 'instance-period',
        params: {
          id: data.cube_id,
          instance_id: data.instance_id
        }
      })
    },
    showAddDataInstance(node, data) {
      this.$router.push({
        // path: '/rd/ops/instance/add-data',
        name: 'instance-add-data',
        params: {
          id: data.cube_id
        }
      })
    },
    async showOperateLog(node, data) {
      this.setActiveDialogComp('OperatorLog')
      this.setActiveNode(data)
    },
    showPeriodTask(node, data) {},
    rerunDownstream(node, data) {
      this.setActiveDialogComp('RerunDownstream')
      this.setActiveNode({
        ...data,
        instance_type: this.instance_type
      })
    },
    async rerun(node, data) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        reRunTask({
          // job_id: data.job_id
          instance_id: data.instance_id,
          skd_prj_id: this.project.skd_prj_id
        }),
        '重跑失败'
      )
      if (res && res.msg) {
        this.$message({
          type: 'success',
          message: res.msg
        })
      }
      this.loading--
    },
    async handlePause(data) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        pauseRecover({
          job_id: data.job_id,
          status: 0,
          skd_prj_id: this.project.skd_prj_id
        }),
        '暂停失败'
      )
      if (res) {
        data.runStatus = 'recover'
        // this.$set(data, 'runStatus', 'pause')
        res.msg &&
          this.$message({
            type: 'success',
            message: res.msg
          })
      }
      this.loading--
    },
    async handleRecover(data) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        pauseRecover({
          job_id: data.job_id,
          status: 1,
          skd_prj_id: this.project.skd_prj_id
        }),
        '恢复失败'
      )
      if (res && res.msg) {
        data.runStatus = 'pause'
        // this.$set(data, 'runStatus', 'pause')
        res.msg &&
          this.$message({
            type: 'success',
            message: res.msg
          })
      }
      this.loading--
    }
  }
}
