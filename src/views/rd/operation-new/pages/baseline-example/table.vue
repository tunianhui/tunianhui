<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['baseline-example-table']"
  >
    <el-table-column prop="baselineName" label="基线名称" min-width="250">
      <template slot-scope="scope">
        <span class="cursor c-color">{{scope.row.baselineName}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="baselineStatus" label="基线状态" width="120">
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.baselineStatus === '1'">{{baselineStatus[scope.row.baselineStatus]}}</el-tag>
        <el-tag type="info" v-if="scope.row.baselineStatus === '4'">{{baselineStatus[scope.row.baselineStatus]}}</el-tag>
        <el-tag type="warning" v-if="scope.row.baselineStatus === '2'">{{baselineStatus[scope.row.baselineStatus]}}</el-tag>
        <el-tag type="danger" v-if="scope.row.baselineStatus === '3'">{{baselineStatus[scope.row.baselineStatus]}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="isCompleted" label="是否完成" width="150">
      <template>
        <div style="display: flex;flex-direction: column;">
          <span>已完成</span>
          <span>2023-05-10 00:00:03</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="isCompleted" label="预警/保障基线时间" width="160">
      <template>
        <div style="display: flex;flex-direction: column;">
          <span>2023-05-10 00:00:03</span>
          <span>2023-05-10 00:00:03</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="isCompleted" width="120">
      <span slot="header">
        预警余量
        <el-tooltip class="item" effect="dark" content="已完成的，计算”预警时间 - 实际完成时间”的差值；未完成的，计算”预警时间 - 预计完成时间”的差值" placement="top">
          <i class="iconfont icon-info cursor" style="margin-left:3px;color: rgba(0,0,0,0.4);position: relative;z-index: 9;"></i>
        </el-tooltip>
      </span>
      <template>
        <span>0 min</span>
      </template>
    </el-table-column>
    <el-table-column prop="latestInstance" label="最晚实例" width="160">
      <template slot-scope="scope">
        <div class="latest-instance">
          <div>
            <span>
              <i class="iconfont icon-Vi mr-10" style="color: #2d73ff"></i>
              <span class="cursor c-color">n_111123444412323</span>
            </span>
          </div>
          <div>
            <i :class="[latestInstanceIcon[scope.row.latestInstanceStatus].icon, 'mr-5']" :style="{color: latestInstanceIcon[scope.row.latestInstanceStatus].color}"></i>
            <span v-if="scope.row.latestInstanceStatus != '1'">{{latestInstanceIcon[scope.row.latestInstanceStatus].name}}</span>
            <span v-else>
              <span>1一个字段</span>
              <el-popover
                placement="bottom"
                width="200"
                trigger="click"
                popper-class="ul-menu-popover"
              >
                <i class="iconfont icon-guizepeizhi cursor c-color ml-5" slot="reference"></i>
              </el-popover>
            </span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="priority" label="优先级" width="80">
      <template>
        <span>高</span>
      </template>
    </el-table-column>
    <el-table-column prop="priority" label="基线类型" width="80">
      <template>
        <span>天基线</span>
      </template>
    </el-table-column>
    <el-table-column prop="priority" label="负责人" width="120">
      <template>
        <span>张三</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="right" width="120" fixed="right">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
          <i class="iconfont icon-shujutancha font-14 cursor mr-15" @click="action(scope.row)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="甘特图" placement="top">
          <i class="iconfont icon-tubiao-zhexiantu font-14 cursor mr-15"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="相关告警" placement="top">
          <i class="iconfont icon-baojing font-14 cursor"></i>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'BaselineExampleTable',
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      baselineStatus: {
        '1': '安全',
        '2': '预警',
        '3': '破线',
        '4': '其他'
      },
      latestInstanceIcon: {
        1: { name: '未运行', color: '#ccc', icon: 'iconfont icon-weikaiqi' },
        2: { name: '等待调度时间', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        3: { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        4: { name: '失败', color: '#FF7474', icon: 'el-icon-error' },
        5: { name: '成功', color: '#4AC059', icon: 'iconfont icon-yikaiqi' },
      },
      tableData: [
        {
          baselineName: '基线名称',
          baselineStatus: '1',
          latestInstanceStatus: '1'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '2',
          latestInstanceStatus: '2'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '3',
          latestInstanceStatus: '3'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '4'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },{
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        },
        {
          baselineName: '基线名称',
          baselineStatus: '4',
          latestInstanceStatus: '5'
        }
      ]
    }
  },
  methods: {
    action(row) {
      this.$emit('action', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.baseline-example-table {
  .cursor {
    cursor: pointer;
  }
  .c-color {
    color: rgba(46, 116, 255, 1);
  }
  .baseline-status {
    padding: 5px 10px;
    border: 1px solid;
  }
  .latest-instance {

  }
}
</style>