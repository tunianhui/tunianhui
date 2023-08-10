<template>
  <el-table
    ref="table"
    v-loading="loading"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['hand-task-table', showDag ? 'active' : '']"
  >
    <el-table-column prop="teskObj" label="任务对象" min-width="340">
      <div :class="['tesk-obj', currentRow.id === scope.row.id && showDag ? 'active' : '']" slot-scope="scope">
        <div class="table-icon">
          <i class="iconfont icon-shoudongrenwu2"></i>
        </div>
        <div class="name-code">
          <span class="name" @click="rowClick(scope.row)">
            <OverflowTooltip style="width: calc(100% - 10px)">{{scope.row.name}}</OverflowTooltip>
          </span>
          <span class="code">{{scope.row.code}}</span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="priority" label="优先级" width="100"></el-table-column>
    <el-table-column prop="curator" label="负责人" width="250"></el-table-column>
    <el-table-column prop="resourceGroup" label="资源组" width="220"></el-table-column>
    <el-table-column prop="latestUpdateTime" label="最近更新时间" width="180"></el-table-column>
    <el-table-column label="操作" align="right" width="150">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="DAG图" placement="top">
          <i class="iconfont icon-yunweigengduo-chakanjiediandaima font-14 cursor mr-15" @click="showDagHande(scope.row)"></i>
        </el-tooltip>
        
          <i class="iconfont icon-biaodanliebiao font-14 cursor mr-15"></i>
        
        <el-tooltip class="item" effect="dark" content="运行" placement="top">
          <i class="iconfont icon-zhihang cursor mr-15" @click="runClick(scope.row)"></i>
        </el-tooltip>
        <el-popover
          placement="bottom-end"
          width="100"
          trigger="click"
          popper-class="ul-menu-popover"
        >
          <i slot="reference" class="iconfont icon-diandian font-14 cursor"></i>
          <UlMenu :menuList="menuList"></UlMenu>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const UlMenu = {
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    return (
      <ul class="ul-menu">
        {
          this.menuList.map(item => {
            return (
              <li class="li-menu" key={item.id}>
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
import OverflowTooltip from '@c/overflow-tooltip'
import { mapGetters } from 'vuex'
import {
  runHandTask
} from '@/api/rd/operation-new/hand-task'
export default {
  name: 'HandTaskTable',
  props: {
    height: {
      type: Number,
      default: 0
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
  computed: {
    ...mapGetters(['project']),
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
  data() {
    return {
      tableData: [],
      menuList: [
        { id: 1, name: '编辑节点', icon: 'bianjikaifajiedian-xin' },
        { id: 5, name: '修改负责人', icon: 'xiugaifuzeren' },
        { id: 9, name: '配置监控报警', icon: 'baojing' }
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
    async runClick(row) {
      const params = {
        code: row.code,
        projectId: this.project.project_id
      }
      const res = await this.$simpleAsyncTo(runHandTask(params), '手动任务运行失败')
      if (res) {
        this.$message.success('手动任务运行成功')
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
.hand-task-table {
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
    }
  }
}
</style>

<style lang="scss">
.ul-menu-popover {
  padding: 0;
}
</style>