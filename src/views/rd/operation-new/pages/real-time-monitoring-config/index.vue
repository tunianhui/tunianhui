<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 16:04:13
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-04 10:39:42
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\real-time-monitoring-config\index.vue
-->
<template>
  <div class="real-time-monitoring-config">
    <TabsHeader
      title="实时监控任务"
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
              新建实时监控
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
      <template>
        <ConfigList></ConfigList>
      </template>
    </div>
    <BatchMonitoringItemConfig v-if="visible" :title="title" @close="visible = false"></BatchMonitoringItemConfig>
    <RealTimeTaskConfig v-if="visibleOfflineTask" :title="title" @close="visibleOfflineTask = false"></RealTimeTaskConfig>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
import ConfigList from './config-list/index.vue'
import BatchMonitoringItemConfig from './batchMonitoringItemConfig.vue'
import RealTimeTaskConfig from './task-config.vue'
export default {
  name: 'RealTimeMonitoringConfig',
  components: {
    TabsHeader,
    ConfigList,
    BatchMonitoringItemConfig,
    RealTimeTaskConfig
  },
  data() {
    return {
      activeTab: '',
      tabs: [],
      visible: false,
      title: '',
      visibleOfflineTask: false
    }
  },
  methods: {
    handleTabClick(tab) {},
    command(command) {
      if (command === 'item') {
        this.visible = true
        this.title = '新建实时任务监控（批量监控项配置）'
      } else {
        this.visibleOfflineTask = true
        this.title = '新建实时任务监控（批量监控规则配置）'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.real-time-monitoring-config {
  padding: 0 15px 0px 15px;
  height: 100%;
  background-color: rgb(229, 228, 233);
  .content-wrapper {
    height: calc(100% - 40px);
  }
}
</style>