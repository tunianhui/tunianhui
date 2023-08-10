<template>
  <el-dialog
    class="govern-effect-rank"
    title="趋势分析"
    :visible.sync="dialogVisible"
    @close="close"
    v-loading="!!loading"
  >
    <el-tabs v-model="activeTab" lazy @tab-click="getTableList">
      <el-tab-pane label="存储" name="store">
        <el-table
          class="mb-10"
          :data="tableData"
          :max-height="dialogBodyHeight - 50"
          v-if="activeTab === 'store'"
        >
          <el-table-column label="排名" prop="rank" width="45"></el-table-column>
          <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
          <el-table-column label="存储健康分" prop="score" show-overflow-tooltip></el-table-column>
          <el-table-column label="存储优化量" prop="optimize_count">
            <template slot-scope="scope">
              <Byte :value="scope.row.optimize_count"></Byte>
            </template>
          </el-table-column>
          <el-table-column label="存储量" prop="count">
            <template slot-scope="scope">
              <Byte :value="scope.row.count"></Byte>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="计算" name="compute">
        <el-table class="mb-10" :data="tableData" :max-height="dialogBodyHeight - 50">
          <el-table-column label="排名" prop="rank" width="45"></el-table-column>
          <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
          <el-table-column label="计算健康分" prop="score" show-overflow-tooltip></el-table-column>
          <el-table-column label="计算优化量" prop="optimize_count">
            <template slot-scope="scope">
              <Compute :value="scope.row.optimize_count"></Compute>
            </template>
          </el-table-column>
          <el-table-column label="计算量" prop="count">
            <template slot-scope="scope">
              <Compute :value="scope.row.count"></Compute>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer">
      <el-button type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getStoreList, getComputeList} from '@/api/govern/govern-effect'
import dialogHeight from '@/mixins/dialog-height'
import Byte from '@c/byte'
import Compute from '@c/compute'

const map = {
  store: getStoreList,
  compute: getComputeList
}

export default {
  name: 'GovernRank',
  mixins: [dialogHeight],
  props: {
    data: Object,
    visible: Boolean
  },
  components: {
    Byte,
    Compute
  },
  data() {
    return {
      activeTab: 'store',
      dialogVisible: false,
      tableData: [],
      loading: 0
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.getTableList()
      }
    }
  },
  methods: {
    async getTableList() {
      this.laoding++
      const res = await this.$simpleAsyncTo(
        map[this.activeTab](),
        '获取数据失败'
      )
      if (res) {
        this.tableData = res.data
      }
      this.laoding--
    },
    close() {
      this.radio = 'store'
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.govern-effect-rank {
  ::v-deep .el-dialog__body {
    padding-top: 5px;
  }
}
</style>
