<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-04 16:09:21
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-21 18:52:32
 * @FilePath: \智能数据构建\src\views\rd\operation-new\pages\cycle-task\script-table.vue
-->
<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['script-table', showDag ? 'active' : '']"
    v-loading="loading"
  >
    <el-table-column prop="teskObj" label="任务对象">
      <div :class="['tesk-obj', currentRow.id === scope.row.id && showDag ? 'active' : '']" slot-scope="scope">
        <div class="table-icon">
          <i class="iconfont icon-zhouqirenwu4"></i>
        </div>
        <div class="name-code">
          <span class="name" @click="rowClick(scope.row)" style="padding: 10px 0">
            <OverflowTooltip style="width: calc(100% - 10px)">{{scope.row.name}}</OverflowTooltip>
          </span>
          <!-- <span class="code">{{scope.row.code}}</span> -->
        </div>
        <el-tag type="info" v-if="scope.row.release_state == 0">暂停</el-tag>
      </div>
    </el-table-column>
    <el-table-column prop="crontab" label="调度周期" width="140">
    </el-table-column>
    <template v-if="!showDag">
      <!-- <el-table-column prop="priority" label="" width="80">
        <template slot="header">
          <span class="mr-5">优先级</span>
          <el-tooltip class="item" effect="dark" content="基线任务取所有基线中最高的作为优先级，覆盖原有配置的任务优先级" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column prop="user_name" label="负责人" width="150">
      </el-table-column>
      <el-table-column prop="relatedBaselines" label="相关基线" width="180">
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
      <el-table-column prop="resourceGroup" label="资源组" width="150">
      </el-table-column>
      <el-table-column prop="update_time" label="最近更新时间" width="180">
      </el-table-column>
      <el-table-column label="操作" align="right" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="DAG图" placement="top">
            <i class="iconfont icon-dag_ETL font-14 cursor mr-15" @click="showDagHande(scope.row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="运行" placement="top">
            <i class="iconfont icon-zhihang cursor mr-15" @click="runClick(scope.row)"></i>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="查看周期实例" placement="top">
            <i class="iconfont icon-zhouqishili font-14 cursor mr-15"></i>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="编辑开发节点" placement="top">
            <i class="iconfont icon-bianjikaifajiedian-xin font-14 cursor mr-15"></i>
          </el-tooltip>
          <el-popover
            placement="bottom-end"
            width="100"
            trigger="click"
            popper-class="ul-menu-popover"
          >
            <i slot="reference" class="iconfont icon-diandian font-14 cursor"></i>
            <UlMenu :menuList="menuList" @command="val => command(val, scope.row)" :status="scope.row.release_state"></UlMenu>
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
    status: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    getClass(item, status) {
      if (item.id === 7) {
        return status === 0 ? 'disabled' : ''
      }
      if (item.id === 8) {
        return status === 1 ? 'disabled' : ''
      }
      return ''
    },
    menuClick(item, status) {
      return () => {
        if (item.id === 7 && status === 0) {
          return
        }
        if (item.id === 8 && status === 1) {
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
              <li class={`li-menu ${this.getClass(item, this.status)}`} key={item.id} on-click={this.menuClick(item, this.status)}>
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
import { pauseCycleTask, resumeCycleTask, runCycleTask } from '@/api/rd/operation-new/cycle-task'
import {mapGetters} from 'vuex'
export default {
  name: 'ScriptTable',
  props: {
    height: {
      type: Number,
      default: 0
    },
    showCheckBox: {
      type: Boolean,
      default: true
    },
    showDag: {
      type: Boolean,
      default: false
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
  components: {
    UlMenu,
    OverflowTooltip
  },
  watch: {
    height: {
      handler(val) {
        this.$nextTick(() => {
          // this.$refs.table.doLayout()
        })
      },
      immediate: true
    },
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
      tableData: [],
      menuList: [
        // { id: 1, name: '查看生产节点', icon: 'yunweigengduo-chakanshengchanjiedian' },
        { id: 2, name: '查看节点代码', icon: 'yunweigengduo-chakanjiediandaima', command: 'viewCode' },
        { id: 3, name: '查看周期实例', icon: 'zhouqishili', command: 'viewCycle' },
        { id: 4, name: '补数据', icon: 'bushuju', command: 'compensate' },
        // { id: 5, name: '修改负责人', icon: 'xiugaifuzeren' },
        // { id: 6, name: '修改优先级', icon: 'xiugaiyouxianji' },
        { id: 7, name: '暂停', icon: 'execute-', command: 'pause' },
        { id: 8, name: '恢复', icon: 'huifu', command: 'restore' },
        // { id: 9, name: '配置监控报警', icon: 'baojing', command: 'configMonitor' }
      ],
      currentRow: {}
    }
  },
  methods: {
    showDagHande(row) {
      this.currentRow = row
      this.$emit('showDagHande', row)
    },
    rowClick(row) {
      this.currentRow = row
      this.$emit('rowClick', row)
    },
    command(command, row) {
      this[command](row)
    },
    // 暂停
    pause(row) {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定暂停该任务吗？'),
            h('p', { style: 'color: rgba(0,0,0,0.65);font-size:12px' }, '暂停的任务仍正常生成实例，但当前任务生成实例及下游依赖实例均不调度')
          ]),
      }).then(async () => {
        const res = await this.$simpleAsyncTo(pauseCycleTask({ code: row.code }))
        if (res) {
          this.$message({
            type: 'success',
            message: '暂停成功!'
          })
        }
        this.$emit('refresh')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消暂停'
        })
      })
    },
    // 恢复
    restore(row) {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定恢复该任务吗？')
          ]),
      }).then(async () => {
        const res = await this.$simpleAsyncTo(resumeCycleTask({ code: row.code }))
        if (res) {
          this.$message({
            type: 'success',
            message: '恢复成功!'
          })
        }
        this.$emit('refresh')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },
    async runClick(row) {
      const params = {
        code: row.code,
        projectId: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(runCycleTask(params), '手动任务运行失败')
      if (res) {
        this.$message.success('周期任务运行成功')
        this.$emit('refresh')
      }
      this.$message.destroy()
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
.script-table {
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
</style>

<style lang="scss">
.ul-menu-popover {
  padding: 0;
}
</style>