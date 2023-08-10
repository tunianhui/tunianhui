<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-05-29 08:40:27
 * @LastEditTime: 2023-07-20 11:38:31
 * @Description:
-->
<template>
  <div class="msg-center">
    <TabsHeader title="消息中心" :tabs="tabs" :active="activeTab" @tab-click="tab => activeTab = tab.name">
      <div class="actions">
        <template v-if="activeTab === 'Unread'">
          <el-button type="primary" icon="iconfont icon-duanxin font-14 mr-5">标记全部已读</el-button>
        </template>
      </div>
    </TabsHeader>
    <div class="table-wrapper">
      <template v-if="activeTab === 'Unread'">
        <Unread></Unread>
      </template>
      <template v-if="activeTab === 'All'">
        <All></All>
      </template>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@c/header'
import All from './all.vue'
import Unread from './unread.vue'
export default {
  name: 'MsgCenter',
  components: {
    TabsHeader,
    All,
    Unread
  },
  data () {
    return {
      height: 0,
      activeTab: 'Unread',
      tabs: [
        {
          label: '未读消息',
          value: 'Unread'
        },
        {
          label: '全部消息',
          value: 'All'
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.msg-center {
  height: 100%;
  padding: 10px 15px 0 15px;
  background-color: $grey7;
  .table-wrapper {
    height: calc(100% - 50px);
  }
}
</style>
