<template>
  <section class="launch-push">
    <div class="edit-content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/asset/govern/item-manage/dispatch' }">推送管理</el-breadcrumb-item>
        <el-breadcrumb-item>发起推送</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="third-title">推送配置</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right" label-suffix="：" class="basic-info">
        <el-row>
          <el-col :span="8">
            <el-form-item label="推送名称" prop="pushName">
              <el-input v-model="form.pushName" placeholder="请输入推送名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效日期" prop="time">
              <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="推送频次" prop="frequency">
              <el-radio v-model="form.frequency" label="1">定时推送</el-radio>
              <el-radio v-model="form.frequency" label="2">周期推送</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="推送渠道" prop="channel">
              <el-checkbox-group v-model="form.channel">
                <el-checkbox label="短信"></el-checkbox>
                <el-checkbox label="邮件"></el-checkbox>
                <el-checkbox label="站内信"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="third-title">编辑推送数据</div>
      <div class="edit-wrapper">
        <div class="steps-wrapper">
          <el-steps :active="active" finish-status="success" align-center class="steps">
            <el-step title="选择推送治理项"></el-step>
            <el-step title="选择推送数据"></el-step>
          </el-steps>
        </div>
        <!-- 选择推送治理项 -->
        <div v-if="active === 0">
          <div class="button-wrapper">
            <el-button type="primary" plain icon="el-icon-plus" @click="handleCreate">新建治理项</el-button>
            <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加治理项</el-button>
          </div>
          <div v-if="tableData.length>0">
            <el-table ref="table1" :data="tableData" style="width: 100%" class="mb-20">
              <el-table-column prop="field1" label="治理项名称" min-width="110">
                <template slot-scope="{row}">
                  <span class="icon iconfont icon-shougongbiaoqian"></span>
                  <span class="ml-10">{{row.field1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="field2" label="治理项类型">
              </el-table-column>
              <el-table-column prop="field3" label="负责人"></el-table-column>
              <el-table-column prop="field4" label="治理对象">
              </el-table-column>
            </el-table>
          </div>
          <div class="empty-content text-center" v-else>
            <img src="@/assets/images/nodata.png" />
            <p class="empty-text">请从右上角添加治理项</p>
          </div>
        </div>
        <!-- 选择推送数据 -->
        <div v-else>
          <div v-for="(item, index) in projectData" :key="index" class="proList">
            <p>{{item.proClassify}}</p>
            <div class="flex-wrap">
              <div v-for="(_item, _index) in item.projectList" :key="_index" :class="['item', {'active':_item.is_select}]" @click.stop="()=> {_item.is_select = !_item.is_select}">{{_item.proName}}
                <span class="close" v-if="_item.is_select">
                  <i class="el-icon-close"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <el-row v-if="tableData.length>0">
          <el-col :offset="12" :span="4">
            <el-button type="primary" @click="nextStep" v-if="active === 0">下一步</el-button>
            <el-button type="primary" @click="back" v-else>返回上一步</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="flex-end" v-if="tableData.length>0 && active === 1">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handelSend">发送测试</el-button>
        <el-button type="primary" @click="handelSubmit">提 交</el-button>
      </div>
    </div>

    <!-- 添加治理项 -->
    <el-dialog title="添加治理项" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}" width="70%">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="mb-10">
            <div class="mb-10">治理项列表</div>
            <el-input v-model="field1" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入治理项名称" class="mr-10"></el-input>
          </div>
          <el-table ref="leftTable" :data="tableData2" style="width: 100%" class="mb-20">
            <el-table-column prop="field1" label="治理项名称" min-width="110">
              <template slot-scope="{row}">
                <span class="icon iconfont icon-shougongbiaoqian"></span>
                <span class="ml-10">{{row.field1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="field2" label="治理项类型">
            </el-table-column>
            <el-table-column prop="field3" label="负责人"></el-table-column>
            <el-table-column prop="field4" label="治理对象">
            </el-table-column>
            <el-table-column label="" width="40">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                  <el-button type="text"><i class="el-icon-circle-plus font-14 color-btn" @click="addToRight(scope.row, scope.$index)"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <div class="mb-10">
            新增治理项
          </div>
          <el-table ref="addTable" :data="tableData3" style="width: 100%" class="mb-20">
            <el-table-column prop="field1" label="治理项名称" min-width="110">
              <template slot-scope="{row}">
                <span class="icon iconfont icon-shougongbiaoqian"></span>
                <span class="ml-10">{{row.field1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="field2" label="治理项类型">
            </el-table-column>
            <el-table-column prop="field3" label="负责人"></el-table-column>
            <el-table-column prop="field4" label="治理对象">
            </el-table-column>
            <!-- <el-table-column label="" width="40">
              <template slot-scope="{row}">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="addToRight(row)"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'LaunchPush',
  data () {
    return {
      active: 0,
      form: {
        channel: []
      },
      rules: {
        pushName: [
          { required: true, message: '请输入推送名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择生效日期', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '请选择推送频次', trigger: 'blur' }
        ],
        channel: [
          { required: true, message: '请选择推送渠道', trigger: 'blur' }
        ]
      },
      radio: '1',
      tableData: [],
      // ---- 弹窗相关 ----
      dialogVisible: false,
      field1: '',
      // 治理项列表
      tableData2: [
        {
          field1: '我的表',
          field2: '自定义治理项',
          field3: 'test002',
          field4: '物理表'
        },
        {
          field1: '我的表',
          field2: '自定义治理项',
          field3: 'test001',
          field4: '物理表'
        },
        {
          field1: '我的表',
          field2: '自定义治理项',
          field3: 'test001',
          field4: '物理表'
        },
        {
          field1: '我的表',
          field2: '自定义治理项',
          field3: 'test001',
          field4: '物理表'
        }
      ],
      tableData3: [],
      projectData: [
        {
          proClassify: 'LD_demo_dev',
          projectList: [
            {
              proName: 'demo_dev',
              value: '1',
              is_select: false
            }
          ]
        },
        {
          proClassify: 'LD_test0423_dev',
          projectList: [
            {
              proName: 'test0423_dev',
              value: '1',
              is_select: false
            },
            {
              proName: 'demo',
              value: '2',
              is_select: false
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 新建治理项
    handleCreate () {
      this.dialogVisible = true
    },
    // 添加治理项
    handleAdd () {
      this.dialogVisible = true
    },

    // 弹窗相关
    searchChange () { },
    // 添加治理项到右侧
    addToRight (row, index) {
      this.tableData2.splice(index, 1)
      this.tableData3.push(row)
    },
    // 下一步
    nextStep () {
      this.active = 1
    },
    // 返回上一步
    back () {
      this.active = 0
    },
    handleCancel () {

    },
    handelSend () {

    },
    handelSubmit () {

    },
    submitForm () {
      this.tableData = cloneDeep(this.tableData3)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/launch-push.scss';

</style>
