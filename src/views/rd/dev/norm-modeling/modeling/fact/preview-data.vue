<template>
  <el-dialog title="数据预览" :visible.sync="dialogTableVisible" append-to-body :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
  <el-table :data="gridData" v-loading="loading">
    <el-table-column :prop="item" :label="item" v-for="item in keys" :key="item" :show-overflow-tooltip="true">
    </el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="ok">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'PreviewDataTuTu',
  props: {
    previewData: Array,
    previewLoading: Boolean
  },
  components: {
    OverflowTooltip
  },
  watch: {
    previewData: {
      deep: true,
      handler(val) {
        this.gridData = val
        this.keys = Object.keys(this.gridData[0])
      }
    },
    previewLoading: {
      immediate: true,
      handler(val) {
        this.loading = val
      }
    }
  },
  data() {
    return {
      gridData: [],
      keys: [],
      dialogTableVisible: true,
      loading: false
    }
  },
  methods: {
    ok() {
      this.$emit('ok')
    }
  }
}
</script>
