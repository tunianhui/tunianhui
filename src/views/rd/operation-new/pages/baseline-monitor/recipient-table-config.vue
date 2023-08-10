<template>
  <div class="recipient-table-config">
    <el-table
      ref="table"
      :data="tableData"
      max-height="300px"
      style="width: 100%"
    >
      <el-table-column prop="recipient" label="接收人">
        <template slot-scope="scope">
          <el-select v-model="scope.row.recipient" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :disabled="getDisabled(item.value, scope.row)"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="recipientDetail" label="接收人详情">
        <template slot-scope="scope" v-if="type === 'base'">
          <MultipleSelect v-model="scope.row.recipientDetail" v-if="scope.row.recipient !== '1'" style="width:100%" placeholder="请选择接收人"></MultipleSelect>
          <span v-else>基线负责人</span>
        </template>
        <template slot-scope="scope" v-if="type === 'event'">
          <MultipleSelect v-model="scope.row.recipientDetail" v-if="scope.row.recipient !== '1'" style="width:100%" placeholder="请选择接收人"></MultipleSelect>
          <span v-else>
            <el-checkbox-group v-model="scope.row.recipientDetail">
              <el-checkbox label="基线负责人"></el-checkbox>
              <el-checkbox label="任务负责人"></el-checkbox>
            </el-checkbox-group>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveMode" label="接收方式">
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.receiveMode">
            <el-checkbox label="电话"></el-checkbox>
            <el-checkbox label="短信"></el-checkbox>
            <el-checkbox label="邮件"></el-checkbox>
            <el-checkbox label="钉钉"></el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope" v-if="type === 'base'">
          <i class="el-icon-delete font-14 cursor pt-10 pb-10" @click="deleteHandle(scope.row, scope.$index)"></i>
        </template>
        <template slot-scope="scope" v-if="type === 'event'">
          <el-tooltip class="item" effect="dark" content="至少配置一种接收方式" placement="top" v-if="tableData.length <= 1">
            <i class="el-icon-delete font-14 cursor pt-10 pb-10" @click="deleteHandle(scope.row, scope.$index)"></i>
          </el-tooltip>
          <i class="el-icon-delete font-14 cursor pt-10 pb-10" @click="deleteHandle(scope.row, scope.$index)" v-else></i>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="add" :disabled="tableData.length >= 3" class="mt-10" v-if="!pageDisabled">添加接收人</el-button>
  </div>
</template>

<script>
import MultipleSelect from '../../component/check-select.vue'
export default {
  name: 'RecipientTableConfig',
  props: {
    type: String,
    pageDisabled: Boolean
  },
  components: {
    MultipleSelect
  },
  data() {
    return {
      tableData: [
        {
          recipient: '1',
          recipientDetail: [],
          receiveMode: []
        }
      ],
      options: [
        { label: '责任人', value: '1' },
        { label: '自定义', value: '2' },
        { label: '值班表', value: '3' },
      ]
    }
  },
  methods: {
    add() {
      const recipient = this.tableData.map(item => item.recipient)
      this.tableData.push({
        recipient: !recipient.includes('1') ? '1' : !recipient.includes('2') ? '2' : '3',
        recipientDetail: [],
        receiveMode: []
      })
    },
    deleteHandle(row, index) {
      if (this.tableData.length <= 1 && this.type === 'event') return
      this.tableData.splice(index, 1)
    },
    getDisabled(val, row) {
      const recipient = this.tableData.map(item => item.recipient)
      if (val === '1') {
        return recipient.includes('1') && row.recipient !== '1'
      } else if (val === '2') {
        return recipient.includes('2') && row.recipient !== '2'
      } else {
        return recipient.includes('3') && row.recipient !== '3'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
.recipient-table-config {
  ::v-deep th.el-table__cell {
    background: #fafafa!important;
    border-bottom: 1px solid #f0f0f0!important;
    padding: 10px 0;
  }
}

</style>