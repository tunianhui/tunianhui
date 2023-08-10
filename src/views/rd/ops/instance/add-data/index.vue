<template>
  <section class="instance-realtime ops-aside side-view">
    <div class="sv-head">
      <strong>实时实例</strong>
      <span>
        <i class="icon el-icon-refresh-right font-16" @click="refresh"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input class="dark-input" v-model="keyword" placeholder="输入节点名称或ID" prefix-icon="iconfont icon-guolv" @keyup.enter.native.stop="refresh"></el-input>
    </div>
    <div class="checkbox-group">
      <el-checkbox v-model="isCreate" @change="refresh">我的实例</el-checkbox>
    </div>

    <div class="flex-layout pl-10 pr-10">
      <el-date-picker v-model="start_date" value-format="yyyy-MM-dd" class="dark-input" popper-class="picker" type="date" :picker-options="pickerOptions" placeholder="运行日期" @change="refresh"></el-date-picker>
      <el-date-picker v-model="bussDay" value-format="yyyy-MM-dd" class="dark-input" type="date" :picker-options="pickerOptions" placeholder="业务日期" @change="refresh"></el-date-picker>
    </div>

    <ul class="ops-aside-tabs">
      <li v-for="tab in tabs" :key="tab.value" :class="['ops-aside-tabs-item', {'is-active': activeTab === tab.value}]" @click="changeTab(tab)">{{ tab.label }}</li>
    </ul>
    <div class="ops-aside-body" v-loading="!!loading">
      <OpsNodata v-if="!treeData.length"></OpsNodata>
      <template v-else>
        <el-tree ref="tree" class="sv-tree ops-aside-tree" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :render-content="renderContent" :filter-node-method="filterNode" @node-click="nodeClick" default-expand-all></el-tree>
        <!-- <div class="ops-aside-nomore">没有更多了</div> -->
      </template>
    </div>
  </section>
</template>

<script>
import OpsNodata from '@c/ops-nodata'
// import {logicTypeMapIcon} from '@/config/rd-config'
import { listRepairDataInstance } from '@/api/rd/ops'
import { statusMap } from '@/config/ops-config'
import OverflowTooltip from '@c/overflow-tooltip'
import mixins from '@/mixins/ops-tree'

export default {
  name: 'InstanceRealtime',
  components: {
    OpsNodata
  },
  mixins: [mixins],
  data () {
    return {
      keyword: '',
      bussDay: '',
      start_date: '',
      activeTab: 'routine',
      loading: 0,
      treeData: [],
      checked: [],
      checkList: [
        { value: 'my', label: '我的实例' },
        { value: 'build', label: '我创建的' }
      ],
      isCreate: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      tabs: [{ value: 'routine', label: '常规实例' }],
      nodeKey: 'id',
      curNodeKey: '',
      expandedKeys: []
    }
  },
  watch: {
    keywords (val) {
      this.$debounce(_ => {
        this.$refs.tree.filter(val)
      }, 200)()
    }
  },
  async mounted () {
    const id = this.$route.params.id
    this.keyword = id || ''
    await this.getData()
    if (id) {
      this.$nextTick(async () => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(id)
        this.curNodeKey = id
        this.expandedKeys = [id]
        // await this.$sleep(20)
        // const data = this.$refs.tree.getCurrentNode()
        // data && this.nodeClick(data)
      })
    }
  },
  methods: {
    async getData () {
      this.loading++
      await this.$sleep(1000)
      const res = await this.$simpleAsyncTo(
        listRepairDataInstance({
          projectName: this.project.project_name,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          keyword: this.keyword,
          isCreate: this.isCreate,
          repair_date: this.bussDay,
          start_date: this.start_date
        }),
        '获取列表失败'
      )
      if (res) {
        this.treeData = this.processTreeData(res.data)
      }
      this.loading--
    },
    processTreeData (data) {
      return data.map(d => {
        d.id = d.instance_id
        d.label = d.job_name
        d.children && !d.isLeaf && this.processTreeData(d.children)
        return d
      })
    },
    changeTab (tab) {
      this.changeTab = tab.value
    },
    renderContent (h, { node, data, store }) {
      let html = ''
      if (data.isLeaf) {
        const date = data.start_date
          ? `${data.start_date} 至 ${data.end_date}(${data.run_Duration})`
          : '--'
        html = (
          <span class="node-leaf custom-node">
            <i class={`status-icon ${(statusMap[data.status] || {}).icon}`}></i>
            <span class="node-content">
              <span class="node-icon">
                <i class="icon iconfont icon-MxSQL"></i>
              </span>
              <span class="flex-layout">
                <OverflowTooltip>
                  <span
                    class="node-id"
                    domPropsInnerHTML={this.$highlightKeyword(
                      data.id,
                      this.keyword
                    )}
                  ></span>
                </OverflowTooltip>
                <div class="flex-1">
                  <OverflowTooltip>
                    <p
                      class="node-label node-row mr-10"
                      domPropsInnerHTML={this.$highlightKeyword(
                        data.label,
                        this.keyword
                      )}
                    ></p>
                  </OverflowTooltip>
                  <OverflowTooltip>
                    <p class="info node-row">{date}</p>
                  </OverflowTooltip>
                </div>
              </span>
            </span>
          </span>
        )
      } else {
        html = (
          <span class="custom-node">
            <span class="node-content">
              {/* <i class={logicTypeMapIcon[data.type] + ' icon font-18 info'}></i> */}
              <OverflowTooltip>
                <span
                  style="width: 100%"
                  domPropsInnerHTML={this.$highlightKeyword(
                    data.label,
                    this.keyword
                  )}
                ></span>
              </OverflowTooltip>
            </span>
          </span>
        )
      }
      return html
    },
    nodeClick (data, node) {
      if (data.isLeaf) {
        this.setActiveComp({
          data,
          name: 'InstanceAddDataGraph',
          type: 'instance-add-data'
        })
        this.setActiveNode(data)
        this.$root.eventEmitter.emit('changeGraph')
      }
    },
    filterNode (value, data) {
      if (!value) return true
      value = value.toLowerCase()
      // 忽略大小写
      return (
        data.label.toLowerCase().indexOf(value) !== -1 ||
        data.id
          .toString()
          .toLowerCase()
          .indexOf(value) !== -1
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.instance-realtime .ops-aside-body {
  padding-bottom: 20px;
  .sv-tree.ops-aside-tree.el-tree {
    overflow: hidden;
  }
}

</style>
