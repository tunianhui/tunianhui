<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['script-table-example', showDag ? 'active' : '']"
    v-loading="loading"
  >
    <el-table-column prop="teskObj" label="实例对象" :width="!showDag ? 300 : ''">
      <div :class="['tesk-obj', currentRow.id === scope.row.id && showDag ? 'active' : '']" slot-scope="scope">
        <div class="check-box ml-10 mr-10" v-if="showCheckBox">
          <el-checkbox v-model="scope.check"></el-checkbox>
        </div>
        <div class="table-icon">
          <i class="iconfont icon-zhouqirenwu4"></i>
        </div>
        <div class="name-code">
          <span class="name" @click="rowClick(scope.row)">
            <OverflowTooltip style="width: calc(100% - 10px)">{{scope.row.name}}</OverflowTooltip>
          </span>
          <span class="code">{{scope.row.code}}</span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="state" label="运行状态" width="100">
      <template slot-scope="scope">
        <i :class="['mr-5', statusList[scope.row.state].icon]" :style="{color: statusList[scope.row.state].color}"></i>
        <span>{{statusList[scope.row.state].name}}</span>
      </template>
    </el-table-column>
    <template v-if="!showDag">
      <el-table-column prop="crontab" label="调度周期" width="130"></el-table-column>
      <el-table-column prop="businessDate" label="业务日期" width="160"></el-table-column>
      <el-table-column prop="schedule_time" label="定时运行时间" width="160"></el-table-column>
      <el-table-column prop="start_time" label="开始运行时间" width="180"></el-table-column>
      <el-table-column prop="end_time" label="结束运行时间" width="180"></el-table-column>
      <el-table-column prop="duration" label="运行时长" width="80"></el-table-column>
      <!-- <el-table-column prop="priority" label="优先级" width="60"></el-table-column> -->
      <el-table-column prop="user_name" label="负责人" width="80"></el-table-column>
      <el-table-column prop="relatedBaselines" label="相关基线">
        <!-- <template slot="header">
          <span class="mr-5">相关基线</span>
          <el-tooltip class="item" effect="dark" content="展示作为末节点被保障的归属基线，以及作为上游节点被纳入保障范围的相关基线" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
        <div class="related-baselines" slot-scope="scope">
          <span>
            {{scope.row.relatedBaselines}}
          </span>
          <span>查看所有相关基线</span>
        </div> -->
      </el-table-column>
      <!-- <el-table-column prop="resourceGroup" label="资源组" width="150"></el-table-column> -->
      <el-table-column label="操作" align="right" width="130" :fixed="showDag ? null : 'right'">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="DAG图" placement="top">
            <i class="iconfont icon-dag_ETL font-14 cursor mr-15" @click="showDagHande(scope.row)"></i>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="运行日志" placement="top">
            <i class="iconfont icon-run-log font-14 cursor mr-15"></i>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="重跑" placement="top">
            <i class="iconfont icon-zhongpao font-14 cursor mr-15" @click="rerunHandle(scope.row)"></i>
          </el-tooltip>
          <el-popover
            placement="bottom-end"
            width="100"
            trigger="click"
            popper-class="ul-menu-popover"
          >
            <i slot="reference" class="iconfont icon-diandian font-14 cursor"></i>
            <UlMenu :menuList="menuList" :state="scope.row.state" @command="val => command(val, scope.row)"></UlMenu>
          </el-popover>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
const UlMenu = {
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    state: {
      type: [String, Number],
    }
  },
  methods: {
    getClass(item, state) {
      if (item.id == 7) {
        return state != 1 ? 'disabled' : ''
      }
      if (item.id == 10) {
        return state != 1 ? 'disabled' : ''
      }
      if (item.id == 11) {
        return state == 3 ? '' : 'disabled'
      }
    },
    menuClick(item, status) {
      return () => {
        if (item.id === 7 && status != 1) {
          return
        }
        if (item.id === 10 && status != 1) {
          return
        }
        if (item.id === 11 && status != 3) {
          return
        }
        this.$emit('command', item.command)
      }
    }
  },
  render(h) {
    return (
      <ul class="ul-menu">
        {
          this.menuList.map(item => {
            return (
              <li class={`li-menu ${this.getClass(item, this.state)}`} key={item.id} on-click={this.menuClick(item, this.state)}>
                <i class={`iconfont icon-${item.icon}`}></i>
                <span>{item.name}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

import OverflowTooltip from '@/components/overflow-tooltip'
import {rerunCycleExample, stopCycleExample, pauseCycleExample, resumeCycleExample} from '@/api/rd/operation-new/cycle-example'
import {mapGetters} from 'vuex'
export default {
  name: 'ScriptTableExample',
  components: {
    UlMenu,
    OverflowTooltip
  },
  props: {
    showDag: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 0
    },
    showCheckBox: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data: {
      handler(val) {
        this.tableData = val
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      statusList: {
        '0': { name: '未运行', color: '#ccc', icon: 'iconfont icon-weikaiqi' },
        '3': { name: '暂停', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        '5': { name: '停止', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        '1': { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        '6': { name: '失败', color: '#FF7474', icon: 'el-icon-error' },
        '7': { name: '成功', color: '#4AC059', icon: 'iconfont icon-yikaiqi' },
        '2': { name: '准备暂停', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        '4': { name: '准备停止', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
      },
      tableData: [],
      menuList: [
        { id: 1, name: '查看节点代码', icon: 'yunweigengduo-chakanjiediandaima', command: 'viewCode' },
        // { id: 2, name: '周期任务', icon: 'zhouqirenwu2' },
        // { id: 3, name: '编辑开发节点', icon: 'bianjikaifajiedian-xin' },
        // { id: 4, name: '查看生产节点', icon: 'yunweigengduo-chakanshengchanjiedian' },
        // { id: 5, name: '重跑下游', icon: 'zhongpaoxiayou' },
        // { id: 6, name: '置成功继续调度', icon: 'zhichenggongjixutiaodu' },
        { id: 7, name: '终止', icon: 'zhongzhi', command: 'stop' },
        // { id: 8, name: '强制重跑', icon: 'qiangzhizhongpao' },
        // { id: 9, name: '去除上游依赖', icon: 'quchushangyouyilai' },
        { id: 10, name: '暂停', icon: 'execute-', command: 'pause' },
        { id: 11, name: '恢复', icon: 'huifu', command: 'resume' }
      ],
      currentRow: {}
    }
  },
  methods: {
    showDagHande(row) {
      this.currentRow = row
      this.$emit('showDagHande', row)
    },
    // 重跑
    async rerunHandle(row) {
      const res = await this.$simpleAsyncTo(rerunCycleExample({
        projectId: this.project.project_id,
        id: row.id
      }), '重跑失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '重跑成功'
        })
        this.$emit('refresh')
      }
    },
    rowClick(row) {
      this.currentRow = row
      this.$emit('rowClick', row)
    },
    command(command, row) {
      this[command](row)
    },
    stop(row) {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定终止实例吗？'),
            h('p', { style: 'color: rgba(0,0,0,0.65);font-size:12px' }, '')
          ]),
      }).then(async () => {
        const res = await this.$simpleAsyncTo(stopCycleExample({
          projectId: this.project.project_id,
          id: row.id
        }), '终止失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '终止成功!'
          })
          this.$emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消终止'
        })
      })
    },
    pause(row) {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定暂停实例吗？'),
            h('p', { style: 'color: rgba(0,0,0,0.65);font-size:12px' }, '')
          ]),
      }).then(async () => {
        const res = await this.$simpleAsyncTo(pauseCycleExample({
          projectId: this.project.project_id,
          id: row.id
        }), '暂停失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '暂停成功!'
          })
          this.$emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消暂停'
        })
      })
    },
    resume(row) {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定恢复实例吗？'),
            h('p', { style: 'color: rgba(0,0,0,0.65);font-size:12px' }, '')
          ]),
      }).then(async () => {
        const res = await this.$simpleAsyncTo(resumeCycleExample({
          projectId: this.project.project_id,
          id: row.id
        }), '恢复失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '恢复成功!'
          })
          this.$emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tesk-obj {
  display: flex;
  align-items: center;
  height: 100%;
  .table-icon {
    i {
      font-size: 28px;
      color: #2D73FF;
      margin-right: 8px;
      display: flex;
    }
  }
  .name-code {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 0;
    .name {
      cursor: pointer;
      color: #2D73FF;
    }
  }
  &.active {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #2D73FF;
    }
  }
}
.related-baselines {
  display: flex;
  flex-direction: column;
  >span {
    cursor: pointer;
    color: #2D73FF;
  }
}
.script-table-example {
  &.active {
    ::v-deep .el-table__body-wrapper {
      // overflow-x: hidden!important;
    }
    ::v-deep tbody {
      .el-table__cell {
        padding: 0!important;
        .cell {
          padding: 0!important;
        }
      }
    }
    .tesk-obj {
      padding: 6px 10px;
    }
  }
}
.cursor {
  cursor: pointer;
}
.ul-menu {
  padding: 3px 0;
  ::v-deep {
    .li-menu {
      padding: 6px 10px;
      display: flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.65);
      i {
        margin-right: 8px;
      }
      span {
      }
      &:hover {
        background: rgba($color: #000000, $alpha: 0.08);
      }
      &.disabled {
        cursor: not-allowed;
        color: rgba($color: #000000, $alpha: 0.25);
        &:hover {
          background: transparent;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.ul-menu-popover {
  padding: 0;
}
</style>