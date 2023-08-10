<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 14:40:06
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-19 10:29:02
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\example-statistics\index.vue
-->
<template>
  <div class="example-statistics">
    <TabsHeader
      title="实例统计"
      :tabs="tabs"
      :active="activeTab"
      :height="height"
      :borderBottomWrapper="true"
      @tab-click="handleTabClick"
    >
      <template #right>
        <template v-for="item in angleView">
          <el-tooltip effect="dark" :content="item.label" placement="top" :key="item.value">
            <el-button
              :type="activeAngleView === item.value ? 'primary' : 'default'"
              size="mini"
              class="custom-button-radio"
              @click="switchAngleView(item.value)"
            >
              <i :class="['iconfont', item.icon, 'font-18']"></i>
            </el-button>
          </el-tooltip>
        </template>
        <el-button
          type="default"
          size="mini"
          class="ml-10"
          style=" padding: 5px 8px; border-radius: 0;"
        >
          <i class="el-icon-refresh-right font-18"></i>
        </el-button>
      </template>
    </TabsHeader>
    <div class="content">
      <template v-if="activeTab === '1'">
        <OfflineExample :activeAngleView="activeAngleView" />
      </template>
      <template v-if="activeTab === '2'">
        <RealTimeExample />
      </template>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@/components/tabs-header'
import OfflineExample from './offline-example/index.vue'
import RealTimeExample from './real-time-example/index.vue'
export default {
  name: 'ExampleStatistics',
  components: {
    TabsHeader,
    OfflineExample,
    RealTimeExample
  },
  data() {
    return {
      activeTab: '1',
      height: '40px',
      tabs: [
        { label: '离线实例', name: '1' },
        { label: '实时实例', name: '2' }
      ],
      angleView: [
        { label: '项目视角', value: '1', icon: 'icon-xiangmu1' },
        { label: '全局视角', value: '2', icon: 'icon-quanbu-copy' }
      ],
      activeAngleView: '1'
    }
  },
  methods: {
    handleTabClick(tab) {
      this.activeTab = tab.name
    },
    switchAngleView(value) {
      this.activeAngleView = value
    }
  }
}
</script>

<style lang="scss" scoped>
.example-statistics {
  padding: 10px 16px;
  height: 100%;
  overflow: auto;
  background: #E7E7EC;
  .custom-button-radio {
    padding: 5px 8px;
    margin: 0;
    border-radius: 0;
    &:first-child {
      border-right: none;
    }
  }
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>