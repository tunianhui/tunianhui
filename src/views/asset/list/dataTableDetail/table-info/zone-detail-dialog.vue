<template>
  <el-dialog :title="`${rowData.element_code} 分区详情`" :visible.sync="zoneVisible" width="40%" :close-on-click-modal="false" @close="closeHandle">
    <el-table :data="zoneData" v-loading="!!loading">
      <el-table-column width="50" type="index"></el-table-column>
      <el-table-column property="zone" label="分区"></el-table-column>
      <el-table-column property="num_rows" label="记录数"></el-table-column>
      <el-table-column property="updata_date" label="更新时间"></el-table-column>
      <el-table-column property="create_time" label="创建时间"></el-table-column>
    </el-table>
    <!-- <div slot="footer" class="dialog-footer">
      <el-pagination
        class="pt-10 pb-20"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageFilters.pageSize"
        :page-sizes="pageSizes"
        :current-page.sync="pageFilters.pageNo"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div> -->
  </el-dialog>
</template>

<script>
import pager from '@/mixins/pager'
import { getPartitionInfo } from '@/api/asset/map'
import {mapGetters} from 'vuex'
export default {
  name: 'ZoneDateilDialog',
  mixins: [pager],
  props: {
    rowData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created() {
    this.getTableList()
  },
  data() {
    return {
      zoneVisible: true,
      zoneData: [],
      loading: 0
    }
  },
  methods: {
    async getTableList() {
      this.loading++
      const params = {
        id: this.cube_id,
        end_time: '',
        column_name: ''
      }
      const res = await this.$simpleAsyncTo(getPartitionInfo(params), '获取详情失败')
      if (res) {
        let data = res.data
        let zoneDatas = data.filter(e => {
          return e.column_name === this.rowData.element_code
        })
        if (zoneDatas && zoneDatas.length) {
          this.zoneData = zoneDatas[0].partitions
        }
      }
      this.loading--
    },
    closeHandle() {
      this.$emit('close', 'zone')
    }
  }
}
</script>
