import {mapMutations, mapGetters} from 'vuex'
import NodePopper from '@c/node-popper'
import OverflowTooltip from '@c/overflow-tooltip'
import OpsNodata from '@c/ops-nodata'

export default {
  components: {
    NodePopper,
    OpsNodata,
    OverflowTooltip
  },
  data() {
    return {
      keyword: '',
      total: 0,
      loading: 0,
      isEnd: false,
      pageSize: 20,
      pageNo: 1,
      treeData: []
    }
  },
  computed: {
    ...mapGetters({
      activeNode: 'ops/activeNode',
      activeComp: 'ops/activeComp',
      project: 'project'
    }),
    filterData() {
      // return this.treeData.filter(
      //   e =>
      //     e.name.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1 ||
      //     e.cube_id.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1
      // )
      return this.treeData
    }
  },
  watch: {
    // treeData: {
    //   handler(val) {
    //     if (val.length && !this.activeNode.cube_id) {
    //       // console
    //       // this.nodeClick(val[0])
    //     }
    //   }
    // }
    'project.project_id': {
      handler(val) {
        // console.log(val)
        this.refresh()
      }
    }
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setActiveComp: 'ops/SET_ACTIVE_COMP',
      setActiveNode: 'ops/SET_ACTIVE_NODE'
    }),
    refresh() {
      this.pageNo = 1
      this.treeData = []
      this.getData()
    },
    loadTreeData() {
      if (!this.isEnd) {
        this.pageNo++
        this.getData()
      }
    }
  }
}
