<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-06 09:49:03
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-06 10:39:40
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\real-time-task\table.vue
-->
<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['real-time-table', showDag ? 'active' : '']"
  >
    <el-table-column prop="teskObj" label="任务对象" min-width="310">
      <div class="tesk-obj" slot-scope="scope">
        <div class="check-box ml-10 mr-10">
          <el-checkbox v-model="scope.check"></el-checkbox>
        </div>
        <div class="table-icon">
          <i class="iconfont icon-shishirenwu"></i>
        </div>
        <div class="name-code">
          <span class="name">{{scope.row.name}}</span>
          <span class="code">{{scope.row.code}}</span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="recentOperator" label="最近操作人" width="100"></el-table-column>
    <el-table-column prop="curator" label="负责人" width="150"></el-table-column>
    <el-table-column prop="isStart" label="是否正式启动实例" width="180"></el-table-column>
    <el-table-column prop="latestUpdateTime" label="最近更新时间" width="180"></el-table-column>
    <el-table-column prop="colony" label="集群" width="180"></el-table-column>
    <el-table-column label="操作" align="right" width="150">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="DAG图" placement="top">
          <i class="iconfont icon-dag_ETL font-14 cursor mr-15" @click="showDagHande(scope.row)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="查看实例" placement="top">
          <i class="iconfont icon-biaodanliebiao font-14 cursor mr-15"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="启动实例" placement="top">
          <i class="iconfont icon-zhihang cursor mr-15"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="更多" placement="top">
          <el-popover
            placement="bottom-end"
            width="100"
            trigger="click"
            popper-class="ul-menu-popover"
          >
            <i slot="reference" class="iconfont icon-diandian font-14 cursor"></i>
            <UlMenu :menuList="menuList"></UlMenu>
          </el-popover>
        </el-tooltip>
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
export default {
  name: 'RealTimeTaskTable',
  components: {
    UlMenu
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    showDag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: '任务对象名称',
          code: 'n_128112',
          check: false,
          recentOperator: '张三',
          curator: '李四',
          isStart: '是',
          latestUpdateTime: '2020-12-12 12:12:12',
          colony: '集群名称'
        }
      ],
      menuList: [
        { id: 1, name: '查看任务代码', icon: 'bianjikaifajiedian-xin' },
        { id: 9, name: '查看任务参数', icon: 'yuanbiao-xianxing' },
        { id: 5, name: '修改负责人', icon: 'xiugaifuzeren' },
      ]
    }
  },
  methods: {
    showDagHande(row) {
      this.$emit('showDagHande', row)
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
    .name {
      cursor: pointer;
      color: #2D73FF;
    }
  }
}
.real-time-table {
  &.active {
    ::v-deep .el-table__body-wrapper {
      // overflow-x: hidden!important;
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