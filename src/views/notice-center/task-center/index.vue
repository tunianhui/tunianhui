<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-05-29 08:40:27
 * @LastEditTime: 2023-07-20 11:34:01
 * @Description:
-->
<template>
  <section class="task-center">
    <TabsHeader title="任务中心" :tabs="tabs" :active="activeTab" @tab-click="tab => activeTab = tab.name">
    </TabsHeader>

    <!-- :style="{height: `${height}px)`}" -->
    <div class="table-wrapper">
      <template v-if="activeTab === 'Pending'">
        <Pending></Pending>
      </template>
      <template v-if="activeTab === 'Processed'">
        <Processed></Processed>
      </template>
      <template v-if="activeTab === 'MyLaunch'">
        <MyLaunch></MyLaunch>
      </template>
    </div>
  </section>
</template>

<script>
import TabsHeader from '@c/header'
import Pending from './pending/index'
import Processed from './processed/index'
import MyLaunch from './my-launch/index'

export default {
  name: 'taskCenter',
  components: {
    TabsHeader,
    Pending,
    Processed,
    MyLaunch
  },
  data () {
    return {
      activeTab: 'Pending',
      tabs: [
        {
          label: '待处理',
          value: 'Pending'
        },
        {
          label: '已处理',
          value: 'Processed'
        },
        {
          label: '我发起',
          value: 'MyLaunch'
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.task-center {
  height: 100%;
  background-color: $grey7;
  padding: 10px 15px 0 15px;
  .table-wrapper {
    height: calc(100% - 50px);
  }
}
</style>
