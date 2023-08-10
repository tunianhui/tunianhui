<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-09 14:40:40
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-09 15:58:35
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\real-time-example\table.vue
-->
<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['real-time-table-example', showDag ? 'active' : '']"
  >
    <el-table-column prop="teskObj" label="实例对象"  min-width="300">
      <div class="tesk-obj" slot-scope="scope">
        <div class="check-box ml-10 mr-10">
          <el-checkbox v-model="scope.row.check"></el-checkbox>
        </div>
        <div class="table-icon">
          <i :class="['iconfont', scope.row.icon]"></i>
        </div>
        <div class="name-code">
          <span class="name">{{scope.row.name}}</span>
          <span class="code">{{scope.row.code}}</span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="runStatus" label="运行状态" width="120">
      <template slot-scope="scope">
        <i :class="['mr-5', statusList[scope.row.runStatus] && statusList[scope.row.runStatus].icon]" :style="{color: statusList[scope.row.runStatus] && statusList[scope.row.runStatus].color}"></i>
        <span>{{statusList[scope.row.runStatus] && statusList[scope.row.runStatus].name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="consumptionDelay" label="消费延时" width="80"></el-table-column>
    <el-table-column prop="resources" label="资源消耗" width="80"></el-table-column>
    <el-table-column prop="recentOperator" label="最近操作人" width="120"></el-table-column>
    <el-table-column prop="lastOperationTime" label="最近操作时间" width="160"></el-table-column>
    <el-table-column prop="head" label="负责人" width="100"></el-table-column>
    <el-table-column prop="engineVersion" label="引擎版本" width="80"></el-table-column>
    <el-table-column prop="colony" label="集群" width="120"></el-table-column>
    <el-table-column label="操作" align="right" width="150">
      <template>
        <el-tooltip class="item" effect="dark" content="重跑" placement="top">
          <i class="iconfont icon-zhongpao font-14 cursor mr-15"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下线" placement="top">
          <i class="iconfont icon-xiaxian2 font-14 cursor mr-15"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="查看运行分析" placement="top">
          <i class="iconfont icon-tubiao-zhexiantu font-14 cursor mr-15"></i>
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
export default {
  name: 'RealTimeTableExample',
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
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-Flink_SQL',
          runStatus: 1,
          consumptionDelay: '1h',
          resources: '1核 2G',
          recentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 12,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-Python',
          runStatus: 2,
          consumptionDelay: '1h',
          resources: '1核 2G',
          recentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 13,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-MAX_COMPUTE',
          runStatus: 3,
          consumptionDelay: '1h',
          resources: '1核 2G',
          recentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 41,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-ziyuan71',
          runStatus: 4,
          consumptionDelay: '1h',
          resources: '1核 2G',
          ecentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 51,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-ELASTIC_SEARCH',
          runStatus: 5,
          consumptionDelay: '1h',
          resources: '1核 2G',
          ecentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 16,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-Shell',
          runStatus: 6,
          consumptionDelay: '1h',
          resources: '1核 2G',
          ecentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 17,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-Vi',
          runStatus: 7,
          consumptionDelay: '1h',
          resources: '1核 2G',
          ecentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 114,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-MxSQL',
          runStatus: 8,
          consumptionDelay: '1h',
          resources: '1核 2G',
          ecentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        },
        {
          id: 1141,
          check: false,
          name: '实例对象名称',
          code: 'n_12355556412',
          icon: 'icon-MxSQL',
          runStatus: 9,
          consumptionDelay: '1h',
          resources: '1核 2G',
          ecentOperator: '张三',
          lastOperationTime: '2021-05-09 14:40:40',
          head: '张三',
          engineVersion: '1.11.2',
          colony: '集群名称'
        }
      ],
      statusList: {
        1: { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        2: { name: '停止', color: '#A186FF', icon: 'iconfont icon-zhongzhi' },
        3: { name: '暂停', color: '#E9BA1E', icon: 'iconfont icon-execute-' },
        4: { name: '暂停中', color: '#E9BA1E', icon: 'iconfont icon-execute-' },
        5: { name: '恢复中', color: '#2d73ff', icon: 'iconfont icon-qidongzhong' },
        6: { name: '运行失败', color: '#FF7474', icon: 'iconfont icon-shibai' },
        7: { name: '恢复失败', color: '#FF7474', icon: 'iconfont icon-shibai' },
        8: { name: '启动中', color: '#2d73ff', icon: 'iconfont icon-qidongzhong' },
        9: { name: '停止中', color: '#A186FF', icon: 'iconfont icon-wait' },
      },
      menuList: [
        { id: 1, name: '查看实时任务', icon: 'yuanbiao-xianxing' },
        { id: 5, name: '查看实例代码', icon: 'yunwei' },
        { id: 9, name: '查看实例参数', icon: 'chakanshili' }
      ]
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