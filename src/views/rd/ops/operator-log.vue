<template>
  <el-dialog class="operator-log" title="操作日志" :visible.sync="isVisible" @close="close">
    <el-table :data="tableData" :height="dialogBodyHeight" class="mb-20">
      <el-table-column label="操作时间" prop="oper_time" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作人" prop="oper_user" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" prop="oper_desc" show-overflow-tooltip></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogHeight from '@/mixins/dialog-height'
import {getOperLog} from '@/api/rd/ops'
import {mapMutations} from 'vuex'

export default {
  name: 'OperatorLog',
  props: {
    data: Object,
    visible: Boolean
  },
  mixins: [dialogHeight],
  data() {
    return {
      loading: false,
      tableData: [],
      isVisible: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    ...mapMutations({
      setActiveDialogComp: 'ops/SET_ACTIVE_DIALOG_COMP'
    }),
    async getTableData() {
      this.loading = true
      const res = await this.$simpleAsyncTo(
        getOperLog({cube_id: this.data.cube_id}),
        '获取操作日志失败'
      )
      if (res) {
        this.tableData = res.data
      }
      this.loading = false
    },
    close() {
      this.setActiveDialogComp(null)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
</style>
