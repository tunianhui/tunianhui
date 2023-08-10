<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-10 10:21:49
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-11 15:20:09
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\baseline-monitor\table.vue
-->
<template>
  <el-table
    ref="table"
    :data="tableData"
    height="100%"
    style="width: 100%"
    :class="['baseline-monitor-table', showDag ? 'active' : '']"
  >
    <el-table-column prop="baselineName" label="基线名称"  min-width="300">
      <div class="tesk-obj" slot-scope="scope">
        <div class="check-box ml-10 mr-10">
          <el-checkbox v-model="scope.check"></el-checkbox>
        </div>
        <div class="table-icon">
          <i class="iconfont icon-jixian"></i>
        </div>
        <div class="name-code">
          <span class="name">{{scope.row.baselineName}}</span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="priority" label="优先级">
    </el-table-column>
    <el-table-column prop="basellineType" label="基线类型">
    </el-table-column>
    <el-table-column prop="monitorSwitch" label="基线开关" width="100">
      <template slot-scope="scope">
        <el-switch
          :value="scope.row.monitorSwitch"
          @change="val => changeSwitch(val, scope.row)"
        >
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="hand" label="负责人">
    </el-table-column>
    <el-table-column prop="warningTime" label="预警时间">
    </el-table-column>
    <el-table-column prop="guaranteeTime" label="保障时间">
    </el-table-column>
    <el-table-column label="操作" align="right" width="150">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="查看" placement="top">
          <i class="iconfont icon-shujutancha font-14 cursor mr-15" @click="viewHandle(scope.row, 'view')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <i class="el-icon-edit font-14 cursor mr-15" @click="editHandle(scope.row, 'edit')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="变更记录" placement="top">
          <i class="iconfont icon-guizepeizhi font-14 cursor mr-15" @click="changeRecordHandle"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <i class="el-icon-delete font-14 cursor mr-15" @click="deleteHandle(scope.row)"></i>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-dialog title="基线变更记录" :visible.sync="dialogTableVisible" :append-to-body="true" custom-class="baseline-monitor-table-dialog">
      <el-table :data="changeRecordData">
        <el-table-column property="changeType" label="变更类型"></el-table-column>
        <el-table-column property="changeHead" label="变更人"></el-table-column>
        <el-table-column property="changeTime" label="变更时间"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-table>
</template>

<script>
export default {
  name: 'BaselineMonitorTable',
  props: {
    showDag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      tableData: [
        {
          id: 1,
          baselineName: '基线名称1',
          check: false,
          priority: '高',
          basellineType: '天',
          monitorSwitch: true,
          hand: '张三',
          warningTime: '当日 00:00',
          guaranteeTime: '当日 00:00',
        }
      ],
      changeRecordData: [
        { changeType: '关闭基线监控', changeHead: '张胜男', changeTime: '2023-05-10 11:05:32' },
        { changeType: '开启基线监控', changeHead: '张胜男', changeTime: '2023-05-10 11:05:32' },
        { changeType: '修改负责人', changeHead: '张胜男', changeTime: '2023-05-10 11:05:32' },
        { changeType: '关闭基线监控', changeHead: '张胜男', changeTime: '2023-05-10 11:05:32' },
        { changeType: '关闭基线监控', changeHead: '张胜男', changeTime: '2023-05-10 11:05:32' },
      ]
    }
  },
  methods: {
    changeSwitch(val, row) {
      let title = '', content = ''
      if (val) {
        title = `开启基线：${row.baselineName}的监控`
        content = '开启后将生成基线实例，并根据配置的告警规则进行监控告警。每晚23点生成基线实例，请于23点前完成变更。确认开启监控？'
      } else {
        title = `关闭基线：${row.baselineName}的监控`
        content = '关闭监控不会继续生成基线实例。每晚23点生成基线实例，如需对次日的任务进行监控，请于23点前完成变更。确认关闭监控'
      }
      this.$confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.monitorSwitch = val
      }).catch(() => {   
        this.$message({
          type: 'info',
          message: '已取消'
        });     
      })
    },
    deleteHandle(row) {
      this.$confirm('删除后不会继续生成基线实例。每晚23点生成基线实例，请于23点前完成变更。', `确认删除基线：${row.baselineName}?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {   
        this.$message({
          type: 'info',
          message: '已取消'
        });     
      })
    },
    changeRecordHandle() {
      this.dialogTableVisible = true
    },
    viewHandle(row, command) {
      this.$emit('action', { row, command })
    },
    editHandle(row, command) {
      this.$emit('action', { row, command })
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
      font-size: 18px;
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
      padding: 5px 0;
    }
  }
}
.cursor {
  cursor: pointer;
}
</style>

<style lang="scss">
.baseline-monitor-table-dialog {
  .el-dialog__body {
    padding-bottom: 15px;
  }
}
</style>