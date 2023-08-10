<template>
  <section class="task-period ops-aside side-view">
    <div class="sv-head">
      <strong>周期任务</strong>
      <span>
        <i class="icon el-icon-refresh-right font-16" @click="refresh"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input class="dark-input" v-model="keyword" placeholder="输入节点名称或ID" prefix-icon="iconfont icon-guolv" @keyup.native.enter.stop="refresh"></el-input>
    </div>
    <div class="checkbox-group">
      <el-checkbox v-model="isCreated" @change="refresh">我的节点</el-checkbox>
      <el-checkbox v-model="isToday" @change="refresh">今天创建</el-checkbox>
    </div>
    <ul class="ops-aside-tabs">
      <li v-for="tab in tabs" :key="tab.value" :class="['ops-aside-tabs-item', {'is-active': activeTab === tab.value}]" @click="changeTab(tab)">{{ tab.label }}</li>
    </ul>
    <el-row class="ops-aside-list-header" :gutter="10">
      <el-col :span="8">Node ID</el-col>
      <el-col :span="10">节点名称</el-col>
      <el-col :span="6">更新时间</el-col>
    </el-row>
    <div class="ops-aside-body" v-scroll-load="loadTreeData">
      <OpsNodata v-if="!treeData.length"></OpsNodata>
      <template v-else>
        <div class="ops-aside-list-body" v-loading="!!loading">
          <!-- <el-popover
            v-for="row in filterData"
            :key="row.cube_id"
            popper-class="dark-popper"
            trigger="hover"
            :width="320"
            placement="right"
            :open-delay="300"
          >-->
          <!-- slot="reference" -->
          <el-row v-for="row in filterData" :key="row.cube_id" :class="{'is-active': row.cube_id === activeNode.cube_id}" @click.native="nodeClick(row)">
            <el-col :span="8">
              <i class="font-16 iconfont icon-MxSQL node-icon ml-5"></i>
              <OverflowTooltip>
                <span class="info node-id" v-html="$highlightKeyword(row.cube_id, keyword)"></span>
              </OverflowTooltip>
            </el-col>
            <el-col :span="10">
              <OverflowTooltip>
                <p class="node-label node-row mr-10" v-html="$highlightKeyword(row.name, keyword)"></p>
              </OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <OverflowTooltip>
                <p class="node-label node-row">{{ row.create_time }}</p>
              </OverflowTooltip>
            </el-col>
          </el-row>

          <!-- <el-form  label-suffix="：" label-width="90px">
              <el-form-item label="Node ID">{{ row.cube_id }}</el-form-item>
              <el-form-item label="节点名称">{{ row.name }}</el-form-item>
              <el-form-item label="负责人">{{ row.oper_user }}</el-form-item>
              <el-form-item label="运行时间">{{ row.create_time }}</el-form-item>
            </el-form>
          </el-popover>-->
        </div>
        <div class="ops-aside-nomore" v-if="isEnd">没有更多了</div>
      </template>
    </div>
  </section>
</template>

<script>
import OpsNodata from '@c/ops-nodata'
import OverflowTooltip from '@c/overflow-tooltip'
import { getTaskList } from '@/api/rd/ops'
import mixins from '@/mixins/ops-tree'

export default {
  name: 'TaskPeriod',
  components: {
    OpsNodata,
    OverflowTooltip
  },
  mixins: [mixins],
  data () {
    return {
      tabs: [
        // {value: 'routine', label: '常规任务'},
        { value: 'logic', label: '逻辑表物理化任务' }
      ],
      activeTab: 'logic',
      isToday: false,
      isCreated: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    changeTab (v) {
      if (this.activeTab !== v.value) {
        this.activeTab = v.value
        this.getData()
      }
    },
    async getData () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getTaskList({
          projectName: this.project.project_name,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          keyword: this.keyword,
          isToday: this.isToday,
          isCreated: this.isCreated
        }),
        '获取列表失败'
      )
      if (res) {
        this.isEnd = res.isEnd

        this.treeData = this.treeData.concat(
          res.data.map(item => {
            item.name = item.cube_code
            return item
          })
        )
        if (
          ![
            'TaskPeriodGraph',
            'InstancePeriodGraph',
            'InstanceAddDataGraph'
          ].includes(this.activeComp)
        ) {
          this.nodeClick(this.treeData[0])
        }
      }
      this.loading--
    },
    nodeClick (row) {
      this.setActiveComp({
        name: 'TaskPeriodGraph',
        data: row,
        type: 'task-period'
      })

      this.setActiveNode(row)
      this.$root.eventEmitter.emit('changeGraph')
    }
  }
}
</script>

<style lang="scss">
.task-period {
  .node-row {
    line-height: 40px !important;
  }
}

</style>
