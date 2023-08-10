<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:43
 * @LastEditTime: 2022-08-24 17:38:45
 * @Description:
-->
<template>
  <section class="authority-list">
    <div class="ml-10">权限列表</div>
    <div class="mt-10 ml-10">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="我的申请"
                     name="first">
          <tabInfo ref="firstTab"
                   :tableData="tableData1"
                   :formInline="searchForm1"
                   @getTable="getTableList"></tabInfo>
        </el-tab-pane>
        <el-tab-pane label="我的审批"
                     name="second">
          <tabInfo ref="secondTab"
                   :tableData="tableData2"
                   :formInline="searchForm2"></tabInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import { getTableData } from '@/api/asset/authority'
import tabInfo from './tabInfo.vue'
export default {
  name: 'AuthorityList',
  components: { tabInfo },
  data () {
    return {
      activeName: 'first',
      tableData1: [],
      tableData2: [],
      searchForm1: { type: '0', status: '0', time: '', search: '' },
      searchForm2: { type: '0', status: '0', time: '', search: '' }
    }
  },
  mounted () {
    this.getTableList()
    // this.tableData1 = [
    //   {number: '30481564', content: 'cus_test_003.t_ods_i_', type: '物理表', permissionType: '查询', permissionBelong: '统一生产账号', validTime: '永久', explain: '测试', time: '2019-06-24 16:40:33'},
    //   {number: '30481564', content: 'cus_test_003.t_ods_i_', type: '物理表', permissionType: '查询', permissionBelong: '统一生产账号', validTime: '永久', explain: '测试', time: '2019-06-24 16:40:33'},
    //   {number: '30481564', content: 'cus_test_003.t_ods_i_', type: '物理表', permissionType: '查询', permissionBelong: '统一生产账号', validTime: '永久', explain: '测试', time: '2019-06-24 16:40:33'},
    //   {number: '30481564', content: 'cus_test_003.t_ods_i_', type: '物理表', permissionType: '查询', permissionBelong: '统一生产账号', validTime: '永久', explain: '测试', time: '2019-06-24 16:40:33'},
    //   {number: '30481564', content: 'cus_test_003.t_ods_i_', type: '物理表', permissionType: '查询', permissionBelong: '统一生产账号', validTime: '永久', explain: '测试', time: '2019-06-24 16:40:33'}
    // ]
  },
  methods: {
    handleClick (tab, event) {
    },
    async getTableList () {
      this.$refs.firstTab.loading = true
      const res = await this.$simpleAsyncTo(getTableData(this.searchForm1), '获取权限列表失败')
      if (res) {
        this.$refs.firstTab.loading = false
        this.tableData1 = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
