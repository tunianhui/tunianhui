<template>
  <div class="work-order height-100per flex-column">
    <div class="work-order-content" v-if="showPages == 'tabsGroup'">
      <el-tabs class="tabs" v-model="activedName" @tab-click="handleClick">
        <el-tab-pane :label="'未提交 ' + uncommittedValue" name="uncommitted">
          <uncommitted />
        </el-tab-pane>
        <el-tab-pane
          :label="'待审批 ' + waitExamineApproveValue"
          name="waitExamineApprove"
        >
          <waitExamineApprove />
        </el-tab-pane>
        <el-tab-pane :label="'被驳回 ' + rejectedValue" name="rejected">
          <rejected />
        </el-tab-pane>
        <el-tab-pane
          :label="'待我审批 ' + waitMeExamineApproveValue"
          name="waitMeExamineApprove"
        >
          <waitMeExamineApprove />
        </el-tab-pane>
        <el-tab-pane
          :label="'已通过 ' + alreadyPassedValue"
          name="alreadyPassed"
        >
          <alreadyPassed />
        </el-tab-pane>
        <!-- <el-tab-pane :label="'开发测试 '+devTestValue" name="devTest">
          <devTest />
        </el-tab-pane> -->
      </el-tabs>
      <div class="edit-order-group">
        <el-button type="primary" @click="editWorkerOrder">
          <i class="el-icon-plus"></i>
          创建修改表工单</el-button
        >
        <el-button type="primary" @click="creatWorkerOrder">
          <i class="el-icon-plus"></i> 创建建表工单</el-button
        >
        <el-button @click="batchImport">
          <i class="el-icon-plus"></i> 批量导入</el-button
        >
        <el-button @click="batchExport">
          <i class="el-icon-plus"></i> 批量导出</el-button
        >
        <el-button type="primary" plain>
          <i class="el-icon-question"></i> 不合理命名表清单</el-button
        >
      </div>
    </div>
    <div class="work-order-content" v-if="showPages == 'creatTable'">
      <el-button
        class="return-btn"
        type="text"
        icon="el-icon-back"
        @click="returnTabsGroup"
        >创建建表工单</el-button
      >
      <buildMeterWorkOrder />
    </div>
    <div class="work-order-content" v-if="showPages == 'editTable'">
      <el-button
        class="return-btn"
        type="text"
        icon="el-icon-back"
        @click="returnTabsGroup"
        >创建修改表工单</el-button
      >
      <editMeterWorkOrder />
    </div>
    <div class="work-order-content" v-if="showPages == 'batchImport'">
      <el-button
        class="return-btn"
        type="text"
        icon="el-icon-back"
        @click="returnTabsGroup"
        >返回</el-button
      >
      <batchImport />
    </div>
    <div class="work-order-content" v-if="showPages == 'batchExport'">
      <el-button
        class="return-btn"
        type="text"
        icon="el-icon-back"
        @click="returnTabsGroup"
        >返回</el-button
      >
      <batchExport />
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import uncommitted from './uncommitted.vue'
import waitExamineApprove from './wait-examine-approve.vue'
import rejected from './rejected.vue'
import waitMeExamineApprove from './wait-me-examine-approve.vue'
import alreadyPassed from './already-passed.vue'
import buildMeterWorkOrder from './build-meter-work-order.vue'
import editMeterWorkOrder from './edit-meter-work-order.vue'
import batchImport from './batch-import.vue'
import batchExport from './batch-export.vue'
// import devTest from './dev-test.vue'

export default {
  name: 'WorkOrder',
  mixins: [pager],
  components: {
    uncommitted,
    waitExamineApprove,
    rejected,
    waitMeExamineApprove,
    alreadyPassed,
    buildMeterWorkOrder,
    editMeterWorkOrder,
    batchImport,
    batchExport,
    // devTest
  },
  data() {
    return {
      activedName: 'uncommitted',
      showPages: 'tabsGroup',
      uncommittedValue: 9,
      waitExamineApproveValue: 9,
      rejectedValue: 9,
      waitMeExamineApproveValue: 9,
      alreadyPassedValue: 9,
      // devTestValue:9,
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    handleClick(instance) {
      console.log(instance)
    },
    returnTabsGroup() {
      this.showPages = 'tabsGroup'
    },
    creatWorkerOrder() {
      this.showPages = 'creatTable'
    },
    batchImport() {
      this.showPages = 'batchImport'
    },
    batchExport() {
      this.showPages = 'batchExport'
    },
    editWorkerOrder() {
      this.showPages = 'editTable'
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.work-order {
  .work-order-content {
    // height: calc(100% - 40px);
    position: relative;
    background-color: white;
    padding: 15px;
    .edit-order-group {
      position: absolute;
      right: 15px;
      top: 12px;
      z-index: 99;
    }
    .tabs {
      // background-color: white;
      // padding: 15px;
    }
    .return-btn {
      color: black;
      font-size: 14px;
    }
  }
}
</style>
