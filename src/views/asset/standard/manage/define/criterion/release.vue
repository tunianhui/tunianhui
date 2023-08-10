<template>
  <el-dialog title="发布" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelBtn" width="800px">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="版本号"
        width="200px">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.version"
              placeholder="请输入版本号"
              style="width: 110px"
            >
            </el-input>
            <a href="javascript:;" @click="_getGenerateVersion(scope.row)">自动生成</a>
          </template>
      </el-table-column>
      <el-table-column
        prop="oper_user"
        label="提交人">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.oper_user}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="oper_time"
        label="提交时间">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.oper_time}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="备注">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{scope.row.desc}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="生产状态">
        <template slot-scope="scope">
          <OverflowTooltip class="my-width">{{ getDicsValue('status_tag',  scope.row.status) || '测试'}}</OverflowTooltip>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelBtn">取 消</el-button>
      <el-button type="primary" @click="confirmBtn">{{record === '' ? '发 布' : '确 定' }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import {
  getGenerateVersion,
  batchRelease
} from '@/api/asset/standard/criterion.js'
export default {
  name: 'ReleaseCriterion',
  inject: ['tabStore', 'attrStore'],
  props: {
    releaseData: Array,
    source: {
      type: String,
      default: ''
    },
    record: {
      type: String,
      default: ''
    }
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      visible: true,
      tableData: []
    }
  },
  created() {
    this.tableData = this.releaseData
  },
  methods: {
    async _getGenerateVersion(row) {
      const res = await this.$simpleAsyncTo(getGenerateVersion({version: row.version, std_code: row.std_code}))
      if (res) {
        row.version = res.data
      }
    },
    cancelBtn() {
      this.$emit('cancelRelease')
    },
    confirmBtn() {
      const isVersion = this.tableData.some(item => (item.version === '' || item.version === null))
      if (isVersion) {
        return this.$message({
          type: 'error',
          message: '版本号不能为空'
        })
      } else {
        if (this.record === 'multiple') {
          this.cancelBtn()
        } else {
          this.release()
        }
      }
    },
    async release() {
      const data = this.tableData.map(item => {
        return {
          std_id: item.std_id,
          version: item.version
        }
      })
      const params = {
        std_id: JSON.stringify(data)
      }
      const res = await this.$simpleAsyncTo(batchRelease(params), '发布失败')
      if (this.source === 'waiting') {
        this.$emit('refresh')
      } else {
        this.$root.eventEmitter.emit('refresh')
        this.$emit('refreshTable')
        // this.$root.eventEmitter.emit('refreshTable')
      }
      if (res) {
        this.$message({
          type: 'success',
          message: '发布成功！'
        })
      }
      this.cancelBtn()
    }
  }
}
</script>

<style lang="scss">
.release-criterion {}
</style>
