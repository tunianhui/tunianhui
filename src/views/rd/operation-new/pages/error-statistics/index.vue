<template>
  <div class="error-statistics">
    <TabsHeader
      title="异常统计"
      :tabs="tabs"
      :active="activeTab"
      :height="height"
      :borderBottomWrapper="true"
      @tab-click="handleTabClick"
    >
      <template #right>
        <el-select v-model="value" placeholder="请选择" class="mr-10 suctom-select" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        <ErrorOfflineExample></ErrorOfflineExample>
      </template>
      <template v-if="activeTab === '2'">
        <RealTimeExample></RealTimeExample>
      </template>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@/components/tabs-header'
import ErrorOfflineExample from './offline-example/index.vue'
import RealTimeExample from './real-time-example/index.vue'
export default {
  name: 'ErrorStatistics',
  components: {
    TabsHeader,
    ErrorOfflineExample,
    RealTimeExample
  },
  data() {
    return {
      value: '',
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
      options: [],
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
.error-statistics {
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
  .suctom-select {
    vertical-align: bottom;
    ::v-deep {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}

</style>