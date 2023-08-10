<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-09 17:33:13
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-12 14:59:37
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\baseline-monitor\index.vue
-->
<template>
  <div class="baseline-monitor">
    <template v-if="showHome === 'home'">
      <TabsHeader
        title="基线监控"
        :tabs="[]"
        active=""
        height="40px"
        :borderBottomWrapper="false"
      >
        <div slot="right" style="display: flex;align-items: center;">
          <el-checkbox-group v-model="checkList" class="mr-10">
            <el-checkbox label="1">我的负责</el-checkbox>
            <el-checkbox label="2">监控开启</el-checkbox>
          </el-checkbox-group>
          <span>
            <MultipleSelect v-model="headKey" :options="optionsMultipSelect" style="width:100%" placeholder="请选择负责人"></MultipleSelect>
          </span>
          <span class="ml-10">
            <el-select v-model="priority" placeholder="请选择优先级">
              <el-option
                v-for="item in optionsPriority"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
          <span class="mr-10 ml-10">
            <el-input v-model="baselineKeyword" placeholder="请输入基线名称">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </span>
          <el-button type="primary" @click="addBaseline">
            <i class="el-icon-plus"></i>
            新建基线
          </el-button>
          <el-button>
            <i class="el-icon-refresh-right"></i>
          </el-button>
        </div>
      </TabsHeader>
      <div class="table-wrapper mt-10">
        <PageTableLayout :showDag="showDag" @leftClickHange="showDag = false">
          <template v-slot:left>
            <BaselineMonitorTable @action="actionHandle"></BaselineMonitorTable>
            <PageBottomTips
              :showDag="showDag"
              :actiosList="actiosList"
              paginationLayput="prev, next, sizes"
              @changeCheck="changeCheck"
              @openHandle="openHandle"
              @offHandle="offHandle"
              @editHeadHeadHander="editHeadHeadHander"
            ></PageBottomTips>
          </template>
        </PageTableLayout>
      </div>
    </template>
    <template v-if="showHome === 'detail'">
      <BaselineMonitorEdit :currentTitle="currentTitle" @back="backHand"></BaselineMonitorEdit>
    </template>
    <el-dialog title="批量修改基线负责人" :visible.sync="dialogTableVisible" :append-to-body="true" custom-class="baseline-monitor-table-dialog" width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="负责人" prop="head">
          <el-select v-model="ruleForm.region" placeholder="请选择负责人">
            <el-option :label="item.label" :value="item.value" v-for="item in headOptions" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
        <el-button @click="saveBatchEditHead" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
import MultipleSelect from '../../component/check-select.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
import BaselineMonitorTable from './table.vue'
import BaselineMonitorEdit from './edit.vue'

export default {
  name: 'BaselineMonitor',
  components: {
    TabsHeader,
    MultipleSelect,
    PageTableLayout,
    PageBottomTips,
    BaselineMonitorTable,
    BaselineMonitorEdit
  },
  data() {
    return {
      showHome: 'home',
      checkList: [],
      baselineKeyword: '',
      headKey: [],
      optionsMultipSelect: [],
      priority: '',
      optionsPriority: [
        { label: '高', value: 1 },
        { label: '最高', value: 2 }
      ],
      showDag: false,
      actiosList: [
        { name: '开启监控', icon: 'iconfont icon-kaiqi', command: 'openHandle' },
        { name: '关闭监控', icon: 'el-icon-circle-close', command: 'offHandle' },
        { name: '修改负责人', icon: 'iconfont icon-xiugaifuzeren', command: 'editHeadHeadHander' },
      ],
      dialogTableVisible: false,
      ruleForm: {
        head: ''
      },
      rules: {
        head: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ]
      },
      headOptions: [],
      currentTitle: ''
    }
  },
  created() {
    const queryId = this.$route.query.id
    if (queryId) {
      this.showHome = 'detail'
      this.currentTitle = '查看基线'
    }
  },
  methods: {
    changeCheck() {},
    addBaseline() {
      this.showHome = 'detail'
      this.currentTitle = '新建基线'
    },
    backHand() {
      this.showHome = 'home'
    },
    openHandle() {
      this.$confirm('开启后将生成基线实例，并根据配置的告警规则进行监控告警。每晚23点生成基线实例，请于23点前完成变更。确认开启监控？', '批量开启基线的监控？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '开启成功!'
        })
      }).catch(() => {   
        this.$message({
          type: 'info',
          message: '已取消'
        });     
      })
    },
    offHandle() {
      this.$confirm('关闭监控不会继续生成基线实例。每晚23点生成基线实例，如需对次日的任务进行监控，请于23点前完成变更。确认关闭监控？', '批量关闭基线的监控？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '关闭成功!'
        })
      }).catch(() => {   
        this.$message({
          type: 'info',
          message: '已取消'
        });     
      })
    },
    editHeadHeadHander() {
      this.dialogTableVisible = true
    },
    saveBatchEditHead() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {}
      })
    },
    actionHandle({row, command}) {
      if (command === 'view') {
        this.showHome = 'detail'
        this.currentTitle = '查看基线'
      } else if (command === 'edit') {
        this.showHome = 'detail'
        this.currentTitle = '编辑基线'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.baseline-monitor {
  padding: 10px 15px 0px 15px;
  height: 100%;
  background-color: rgb(240, 240, 240);
  .table-wrapper {
    height: calc(100% - 50px);
    background: #fff;
    padding-bottom: 40px;
    position: relative;
  }
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>