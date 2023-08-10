<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:44
 * @LastEditTime: 2022-08-27 15:31:23
 * @Description:
-->
<template>
  <el-table :data="tableData"
            style="width: 100%"
            v-loading="!!loading">
    <el-table-column label="分组名称">
      <template slot-scope="scope">
        <div class="name">
          <OverflowTooltip class="width">{{scope.row.group_name}}</OverflowTooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="group_remark"
                     label="描述">
      <template slot-scope="scope">
        <OverflowTooltip class="width">{{scope.row.group_remark}}</OverflowTooltip>
      </template>
    </el-table-column>
    <el-table-column prop="create_time"
                     label="创建时间">
      <template slot-scope="scope">
        <OverflowTooltip class="width">{{scope.row.create_time}}</OverflowTooltip>
      </template>
    </el-table-column>
    <el-table-column fixed="right"
                     label="操作">
      <template slot-scope="scope">
        <el-button @click.native.prevent="editRow(scope.row)"
                   type="text"
                   size="small">
          <i class="el-icon-edit-outline mr-20"
             style="font-size:16px;"></i>
        </el-button>
        <SimpleConfirm @confirm="handleDeleteDatasource(scope.row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getApiGroup, getAppGroup } from '@/api/server/server.js'
import { mapGetters } from 'vuex'
export default {
  name: 'GroupTable',
  components: {
  },
  computed: {
    ...mapGetters(['project'])
  },
  props: {
    activeName: String
  },
  watch: {
    activeName: {
      immediate: true,
      handler (val) {
        this.getApiGroup()
      }
    }
  },
  data () {
    return {
      loading: 0,
      tableData: []
    }
  },
  created () {
  },
  methods: {
    editRow (row) {
      if (this.activeName === 'service') {
      } else {
      }
    },
    handleDeleteDatasource (row) { },
    async getApiGroup () {
      this.loading++
      let params = {}, fn = null
      if (this.activeName === 'service') {
        params.id = this.project.project_id
        fn = getApiGroup
      } else {
        fn = getAppGroup
      }
      const res = await this.$simpleAsyncTo(fn(params), '获取分组列表失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
</style>
