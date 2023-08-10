<template>
  <section class="data-preview b-r animated fadeInRight">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column width="50" type="index" fixed></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="zone" label="指标" fixed></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" :prop="item" :label="item" v-for="item in columns" :key="item"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  getPreviewData
} from '@/api/asset/map'
export default {
  name: 'DataPreview',
  data() {
    return {
      tableData: [],
      columns: []
    }
  },
  computed: {
    ...mapGetters(['cube_id'])
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const params = {
        cube_id: this.cube_id
      }
      const res = await this.$simpleAsyncTo(getPreviewData(params))
      if (res) {
        this.columns = res.columns
        this.tableData = res.data
      }
    }
  }
}
</script>
