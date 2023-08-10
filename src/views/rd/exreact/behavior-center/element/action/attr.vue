<template>
  <section class="action-attr">
    <p class="font-18">{{ data.data.actCode }}</p>
    <p class="font-12 mb-5 my-title">{{ data.data.actName }}</p>
    <div class="operate-btn my-btn">
      <el-button type="primary" class="primary" @click="edit(data.data)">
        <i class="el-icon-edit-outline"></i>
        编辑</el-button>
      <el-button type="primary" class="primary" @click="del(data.data)">
        <i class="el-icon-delete"></i>
        删除</el-button>
    </div>
    <div class="my-content mt-20">
      <div class="my-basc mb-20">
        <div class="my-title">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">基本信息</span>
        </div>
        <div>
          <span class="my-title ml-10 mt-10">描述：{{data.data.remark}}</span>
        </div>
      </div>
      <div class="my-basc">
        <div class="my-title mb-15">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">应用行为规则列表</span>
        </div>
        <div>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="行为名">
                <template slot-scope="scope">
                  <OverflowTooltip class="my-width">{{scope.row.name}}</OverflowTooltip>
                </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="规则ID">
              <template slot-scope="scope">
                <OverflowTooltip class="my-width">{{scope.row.name}}</OverflowTooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="规则来源表">
              <template slot-scope="scope">
                <OverflowTooltip class="my-width">{{scope.row.name}}</OverflowTooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import rdAttr from '@/mixins/rd-attr'
import {del} from '@/api/rd/exreact/action'
export default {
  name: 'ActionAttr',
  mixins: [rdAttr],
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    edit(row) {
      this.setActiveRdEditDialog({
        title: '编辑动作',
        component: `ActionEdit`,
        data: {...this.project, ...row}
      })
    },
    del(row) {
      // let dialogFlag, dialogText, title, isRule
      // if (row.bizLineVOS) {
      //   title = '行为域'
      //   if (row.bizLineVOS.length) {
      //     dialogFlag = true
      //     dialogText = '行为域下包含业务线，无法删除'
      //   } else {
      //     dialogFlag = false
      //     dialogText = '确定删除吗？'
      //   }
      // } else {
      //   title = '业务线'
      //   isRule = row.isRule
      //   if (isRule) {
      //     dialogFlag = true
      //     dialogText = `${row.displayName}业务线下已创建行为规则，无法删除，请删除下挂行为规则后重试`
      //   } else {
      //     dialogFlag = false
      //     dialogText = `确定删除吗？`
      //   }
      // }
      this.setActiveRdEditDialog({
        title: '删除动作',
        component: `DelDialog`,
        data: {...this.project, ...row, isDel: false, fn: del}
      })
    }
  }
}
</script>

<style lang="scss">
.action-attr {
}
</style>
