<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 16:02:46
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-27 14:35:16
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\offline-monitoring-config\index.vue
-->
<template>
  <div class="offline-monitoring-config">
    <TabsHeader
      title="离线任务监控"
      :tabs="tabs"
      :active="activeTab"
      height="40px"
      :borderBottomWrapper="true"
      @tab-click="handleTabClick"
    >
      <template #right>
        <el-button
          type="default"
          size="mini"
          class="ml-10"
          style=" padding: 5px 8px; border-radius: 0;"
        >
          <i class="iconfont icon-baojing"></i>
            告警中心
        </el-button>
        <el-dropdown @command="command">
          <el-button
            type="primary"
            size="mini"
            class="ml-10"
            style=" padding: 5px 8px; border-radius: 0;"
          >
            <i class="el-icon-plus"></i>
              新建离线监控
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="item">批量监控项配置</el-dropdown-item>
            <el-dropdown-item command="rule">批量监控规则配置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          type="default"
          size="mini"
          class="ml-10"
        >
          <i class="el-icon-refresh-right font-12"></i>
        </el-button>
      </template>
    </TabsHeader>
    <div class="content-wrapper">
      <template v-if="activeTab === 'task-monitoring'">
        <TaskMonitoring></TaskMonitoring>
      </template>
      <template v-if="activeTab === 'field-monitoring'">
        <FieldMonitoring></FieldMonitoring>
      </template>
    </div>
    <BatchMonitoringItemConfig v-if="visible" :title="title" @close="visible = false"></BatchMonitoringItemConfig>
    <OfflineTaskMonitoring v-if="visibleOfflineTask" :title="title" @close="visibleOfflineTask = false"></OfflineTaskMonitoring>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
import TaskMonitoring from './task-monitoring/index.vue'
import FieldMonitoring from './field-monitoring/index.vue'
import BatchMonitoringItemConfig from './batchMonitoringItemConfig.vue'
import OfflineTaskMonitoring from './offline-task.vue'
export default {
  name: 'OfflineMonitoringConfig',
  components: {
    TabsHeader,
    TaskMonitoring,
    FieldMonitoring,
    BatchMonitoringItemConfig,
    OfflineTaskMonitoring
  },
  data() {
    return {
      tabs: [
        { label: '任务监控', name: 'task-monitoring'},
        { label: '字段监控', name: 'field-monitoring' }
      ],
      activeTab: 'task-monitoring',
      visible: false,
      title: '',
      visibleOfflineTask: false
    }
  },
  methods: {
    handleTabClick(tab) {
      this.activeTab = tab.name
    },
    command(command) {
      if (command === 'item') {
        this.visible = true
        this.title = '新建离线任务监控（批量监控项配置）'
      } else {
        this.visibleOfflineTask = true
        this.title = '新建离线任务监控（批量监控规则配置）'
      }
    }
  }
}
</script>

<style lang="scss">
.offline-monitoring-config {
  padding: 0 15px 0px 15px;
  height: 100%;
  background-color: rgb(229, 228, 233);
  .content-wrapper {
    height: calc(100% - 40px);
  }
}
</style>