<template>
  <el-dialog
    custom-class="tag-add-data-dialog"
    :title="title"
    width="850px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="10vh"
    append-to-body
    @close="close"
    v-draggable="{
      trigger: '.tag-add-data-dialog .el-dialog__header',
      body: '.tag-add-data-dialog.el-dialog',
      recover: false
    }"
    v-loading="!!loading"
  >
    <div class="regular-add-data-dialog-head">
      <span>标签信息</span>
      <!-- <span>已选中{{ checkedCount }}条({{ checkedCount }}/10)</span> -->
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
        <el-table-column label="标签名">
          <template #default="scope">
            <p>{{scope.row.name}}</p>
            <p>{{scope.row.code}}</p>
            <!-- <CellContent :data="getCellContentData(scope.row)">
            </CellContent> -->
          </template>
        </el-table-column>
        <el-table-column prop="regular_id" label="标签ID">
        </el-table-column>
        <!-- <el-table-column
          label="规则来源表"
          prop="regular_table"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column
          label="最近更新时间"
          prop="update_time"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <i class="el-icon-success success"></i>
            <span>{{ getStatusLabel(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近补数据">
          <template #default="">
            <i class="el-icon-success success"></i>成功
            <el-popover
              placement="bottom-end"
              trigger="click">
              <div class="mb-20">补数据记录</div>
              <el-table :data="gridData">
                <el-table-column width="170" property="date" label="操作时间"></el-table-column>
                <el-table-column width="190" property="name" label="操作人"></el-table-column>
                <el-table-column width="120" property="address" label="补数据结束日期"></el-table-column>
                <el-table-column width="100" property="address" label="结果"></el-table-column>
              </el-table>
              <i slot="reference" class="iconfont icon-lishijilu"></i>
            </el-popover>
            <!-- <span>{{ scope.row.addData || '未补数据' }}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <h4 class="mt-10 mb-10">补数据生效时段</h4>
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="开始日期">
            <el-date-picker
              v-model="filter.startDay"
              type="date"
              placeholder="选择开始日期"
            >
            </el-date-picker>
          </el-form-item> -->
        </el-col>
        <el-col :span="24">
          <el-form-item label="结束日期" style="margin-bottom:5px">
            <el-date-picker
              v-model="filter.endDay"
              type="date"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <p class="ml-50 font-12">基于该标签配置的数据来源时间跨度自动计算开始时间，无需选择</p>
      </el-row>
      <h4 class="mb-10 mt-10">实例名称</h4>
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
// import {types, iconMap} from '@/config/rd-config'
import OverflowTooltip from '@c/overflow-tooltip'
// import {dateFormat} from '@/libs/util'
export default {
  name: 'TagAddData',
  components: {
    OverflowTooltip
  },
  mixins: [editDialog],
  data() {
    return {
      tableData: [],
      filter: {},
      rules: {},
      loading: 0,
      checked: false,
      gridData: []
    }
  },
  computed: {
    checkedCount() {
      return this.tableData.filter(item => item.checked).length
    },
    suffixName() {
      let str = ''
      return str
    }
  },
  created() {
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
    getStatusLabel(row) {
      const temp = this.dics.status_tag.find(s => s.key === row.status)
      return temp.value
    }
  }
}
</script>

<style lang="scss">
.tag-add-data-dialog {
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
