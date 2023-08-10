<template>
  <el-dialog title="趋势分析" :visible.sync="dialogVisible" @close="close" v-loading="!!loading">
    <div class="clearfix mb-10">
      <el-radio-group v-model="radio" @change="getTableList" class="fr">
        <el-radio-button label="score">健康分</el-radio-button>
        <el-radio-button label="consume">计算消耗</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      class="mb-10"
      :data="tableData"
      v-if="radio === 'score'"
      :max-height="dialogBodyHeight - 50"
    >
      <el-table-column label="排名" prop="rank" width="45"></el-table-column>
      <el-table-column label="表名称" prop="table_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="项目名" prop="project_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
      <el-table-column label="健康分" prop="score"></el-table-column>
      <el-table-column label="存储消耗" prop="consume">
        <template slot-scope="scope">
          <Byte :value="scope.row.consume"></Byte>
        </template>
      </el-table-column>
      <el-table-column label="存储量比" prop="rate"></el-table-column>
    </el-table>
    <el-table class="mb-10" :data="tableData" :max-height="dialogBodyHeight - 50" v-else>
      <el-table-column label="排名" prop="rank" width="45"></el-table-column>
      <el-table-column label="节点名称" prop="node_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="项目名" prop="project_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="负责人" prop="leader" show-overflow-tooltip></el-table-column>
      <el-table-column label="任务类型" prop="task_type" show-overflow-tooltip></el-table-column>
      <el-table-column label="健康分" prop="score"></el-table-column>
      <el-table-column label="计算消耗" prop="consume">
        <template slot-scope="scope">
          <Byte :value="scope.row.consume"></Byte>
        </template>
      </el-table-column>
      <el-table-column label="计算量比" prop="rate"></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getConsumeList, getScoreList} from '@/api/govern/govern-analyze'
import dialogHeight from '@/mixins/dialog-height'
import Byte from '@c/byte'

const map = {
  score: getScoreList,
  consume: getConsumeList
}

export default {
  name: 'GovernRank',
  mixins: [dialogHeight],
  props: {
    data: Object,
    visible: Boolean
  },
  components: {
    Byte
  },
  data() {
    return {
      radio: 'score',
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
      const res = await this.$simpleAsyncTo(map[this.radio](), '获取数据失败')
      if (res) {
        this.tableData = res.data
      }
      this.laoding--
    },
    close() {
      this.radio = 'score'
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
