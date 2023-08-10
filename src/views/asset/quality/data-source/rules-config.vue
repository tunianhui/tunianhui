<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-18 09:08:36
 * @LastEditTime: 2021-06-25 16:53:38
 * @Description:
-->
<template>
  <div class="rules-config-source">
    <el-button type="text" class="font-16" @click="$emit('goBack')"> &lt; 质量规则列表</el-button>
    <div class="report-title mb-10">
      <div>{{data.tableName}} 质量规则配置</div>
    </div>
    <div class="rule-table-info mb-15">
      <div class="table-icon">
        <i class="icon iconfont icon-yuanshuju"></i>
        <div class="text">数据源</div>
      </div>
      <div class="table-info-content">
        <div class="table-info-header">
          <span>LD_test115.dim_provice</span>
          <a href="javascript:;" class="font-14">质量报告 &gt;</a>
        </div>
        <div class="basic-info">
          <div class="info-item mr-40">
            <span class="basic-label">数据源类型：</span>
            <OverflowTooltip class="basic-value">LD_Demo</OverflowTooltip>
          </div>
          <div class="info-item mr-40">
            <span class="basic-label">所需环境：</span>
            <OverflowTooltip class="basic-value">demo_default</OverflowTooltip>
          </div>
          <div class="info-item mr-40">
            <span class="basic-label">负责人：</span>
            <OverflowTooltip class="basic-value">演示默认管理(demo_default@demo-dataphin)</OverflowTooltip>
          </div>
        </div>
      </div>
    </div>
    <AlarmSetting></AlarmSetting>
    <Head
        ref="head"
        title="质量规则配置"
        actionText="创建质量规则"
        @action="addHandle"></Head>
    <el-table :data="tableData" tooltip-effect="dark" v-loading="!!loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="对象名称"></el-table-column>
      <el-table-column prop="ownerName" label="模板名称">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.ownerName}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="business" label="监测频率">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.business}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="生效时段">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.projectName}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="enabled" label="规则强度" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="试跑状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.status === '未试跑'">
            <i class="iconfont icon-weikaiqi" style="color:#bfbfbf"></i>{{scope.row.status}}
          </span>
          <span v-else>
            <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i>{{scope.row.status}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="enabled" label="校验开关" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text">
                <i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="editHandle(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="delHandle(scope.row, scope.row.$index)"></i></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <section class="select-footer">
      <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox>
        <el-button type="text" :disabled="multipleSelection.length===0" @click="batchOpen">
          <i class="el-icon-video-play font-12 color-btn mr-5"><span class="ml-5">规则试跑</span></i>
        </el-button>
      </div>
      <div class="font-12">已选中 {{multipleSelection.length}} 个</div>
    </section>
    <AddRules :visible="ruleVisible" @close="close" @confirm="confirm"></AddRules>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import AlarmSetting from '../alarm-setting'
import Head from '@c/head.vue'
import AddRules from './add-rules.vue'
export default {
  name: 'RulesConfigDatasource',
  components: {
    OverflowTooltip,
    AlarmSetting,
    Head,
    AddRules
  },
  props: {
    data: Object
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      multipleSelection: [],
      isIndeterminate: false,
      checkAll: false,
      ruleVisible: false
    }
  },
  watch: {
    multipleSelection: {
      deep: true,
      handler(val) {
        if (val.length === 0 || val.length === this.tableData.length) {
          this.isIndeterminate = false
        } else if (val.length < this.tableData.length) {
          this.isIndeterminate = true
        }
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addHandle() {
      this.ruleVisible = true
    },
    editHandle(row) {

    },
    delHandle(row) {

    },
    checkAllChange(boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    batchOpen() {

    },
    confirm() {
      this.ruleVisible = false
    },
    close() {
      this.ruleVisible = false
    }
  }
}
</script>
<style lang="scss">
.rules-config-source {
  .rule-table-info {
    display: flex;
    background-color: #f8f8f8;
    .table-icon {
      width: 73px;
      height: 73px;
      background: #6ca0f5;
      text-align: center;
      i {
        line-height: 40px;
        color: #fff;
        font-size: 30px;
      }
      .text {
        color: #fff;
        font-size: 14px;
      }
    }
    .table-info-content {
      flex: 1;
      padding: 16px 20px;
      .table-info-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }
      .basic-info {
        display: flex;
        .info-item {
          font-size: 12px;
          .basic-label {
            color: rgba($color: #000000, $alpha: 0.5);
          }
          .basic-value {
            color: rgba($color: #000000, $alpha: 0.8);
            width: 100px;
          }
        }
      }
    }
  }
  .select-footer {
    height: 36px;
    padding: 0 20px;
    background-color: $grey10;
    line-height: 36px;
    display: flex;
    justify-content: space-between;
    z-index: 9;
  }
}
</style>
