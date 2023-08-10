<!--
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2020-07-30 17:59:47
 * @Description:
-->
<template>
  <el-dialog
    custom-class="regular-add-data-dialog"
    title="行为规则补数据"
    width="900px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="10vh"
    append-to-body
    @close="close"
    v-draggable="{
      trigger: '.regular-add-data-dialog .el-dialog__header',
      body: '.regular-add-data-dialog.el-dialog',
      recover: false
    }"
    v-loading="!!loading"
  >
    <div class="regular-add-data-dialog-head">
      <span>选择行为规则</span>
      <span>已选中{{ checkedCount }}条({{ checkedCount }}/10)</span>
    </div>
    <el-form
      ref="form"
      label-position="right"
      label-width="140px"
      :model="filter"
      :rules="rules"
      label-suffix="："
    >
      <el-table :data="tableData" class="object-table-list" max-height="200px">
        <el-table-column label="行为名">
          <template #default="scope">
            <CellContent :data="getCellContentData(scope.row)">
              <!-- <el-checkbox
                v-model="scope.row.checked"
                @change="checkChange"
              ></el-checkbox> -->
            </CellContent>
          </template>
        </el-table-column>
        <el-table-column prop="regular_id">
          <template slot="header" slot-scope="scope">
            <div v-if="false">{{scope}}</div>
            <el-checkbox
              v-model="checked"
              @change="checkChange"
            ></el-checkbox> &nbsp;&nbsp;规则ID
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked"
              @change="subCheckChange(scope.$index, scope.row)"
            ></el-checkbox> &nbsp;&nbsp;{{scope.row.regular_id}}
          </template>
        </el-table-column>
        <el-table-column
          label="规则来源表"
          prop="regular_table"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          prop="update_time"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <span>{{ getStatusLabel(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近补数据">
          <template #default="scope">
            <span>{{ scope.row.addData || '未补数据' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <h4 class="mt-10 mb-10">补数据生效时效</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="filter.startDay"
              type="date"
              placeholder="选择开始日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="filter.endDay"
              type="date"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <h4 class="mb-10">实例名称</h4>
      <el-form-item label="实例名称" prop="name">
        <el-row>
          <el-col :span="10">
            <el-input
              v-model="filter.name"
              placeholder="请输入实例名称"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <OverflowTooltip class="label label-width">{{ suffixName }}</OverflowTooltip>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="my-btn">
      <el-button type="default" @click.stop="close" @keyup.native.stop
        >取消</el-button
      >
      <el-button
        type="primary"
        class="primary"
        :disabled="checkedCount > 10"
        @click.stop="confirm"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {types, iconMap} from '@/config/rd-config'
import OverflowTooltip from '@c/overflow-tooltip'
import {dateFormat} from '@/libs/util'

export default {
  name: 'AddData',
  mixins: [editDialog],
  components: {
    OverflowTooltip
  },
  data() {
    return {
      filter: {
        code: '',
        name: '',
        startDay: '',
        endDay: ''
      },
      rules: {
        code: [
          {required: true, message: '请输入英文名'},
          {
            pattern: /^[a-zA-Z][a-zA-Z_]*$/,
            message: '英文名由字母、数字或下划线(_)组合组成'
          }
        ],
        name: [
          {required: true, message: '请输入名称'}
          // {
          //   pattern: /^[a-zA-Z][a-zA-Z_\-0-9]*$/,
          //   message:
          //     '名称由英文、数字、下划线(_)或短划线(-)组成，且开头必须是字母'
          // }
        ]
      },
      // suffixName: '_行为1301',
      tableData: [],
      loading: 0,
      checked: false
    }
  },
  computed: {
    checkedCount() {
      return this.tableData.filter(item => item.checked).length
    },
    suffixName() {
      let str = ''
      str += `_${this.data.id}`
      let checkItem = this.tableData.filter(item => item.checked)
      checkItem.forEach(e => {
        str += `_规则${e.regular_id}`
      })
      if (this.filter.startDay) {
        str += `_${dateFormat(this.filter.startDay, 'YYYYMMdd')}`
      }
      if (this.filter.endDay) {
        str += `_${dateFormat(this.filter.endDay, 'YYYYMMdd')}`
      }
      return str
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading++
      // const res = await this.$simpleAsyncTo()
      const res = {
        data: Array.from({length: 15}, (d, i) => ({
          id: i + '',
          regular_id: i + '',
          name: '测试' + i,
          code: 'test' + i,
          status: '3',
          regular_table: 'table' + i,
          update_time: '2020-06-30',
          addData: ''
        }))
      }
      if (res) {
        this.tableData = res.data.map(item => {
          item.checked = false
          return item
        })
      }
      this.loading--
    },
    checkChange(val) {
      if (val) {
        this.tableData.forEach((e, i) => {
          if (i < 10) {
            e.checked = true
          }
        })
      } else {
        this.tableData.forEach(e => {
          e.checked = false
        })
      }
      // if (this.checkedCount > 10) {
      //   this.$message({
      //     message: '行为规则最多选择10个',
      //     type: 'warning'
      //   })
      // }
    },
    subCheckChange(index, row) {
      if (row.checked) {
        if (this.checkedCount > 10) {
          this.$message({
            message: '行为规则最多选择10个',
            type: 'warning'
          })
          this.tableData[index].checked = false
        }
      } else {
      }
    },
    getCellContentData(row) {
      return {
        ...iconMap[types.DOMAINBUS],
        ...row,
        name: row.name,
        code: row.code
      }
    },
    getStatusLabel(row) {
      const temp = this.dics.status_tag.find(s => s.key === row.status)
      return temp.value
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.regular-add-data-dialog {
  &-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .label-width {
    width: calc(100% - 20px);
  }
}
</style>
