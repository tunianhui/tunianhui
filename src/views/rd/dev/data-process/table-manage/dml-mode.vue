<template>
  <div class="dml-mode height-100per flex-column">
    <div class="dml-mode-content">
      <div v-if="showDMLSubmitPage">
        <el-collapse v-model="formActiveNames">
          <el-collapse-item name="1">
            <span class="collapse-title" slot="title">字段配置</span>
            <el-button
              class="el-button-define"
              type="primary"
              icon="el-icon-plus"
              @click="addRow"
              >转成分区字段</el-button
            >
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="date">
                <template slot="header"
                  >字段名称&nbsp;<el-icon class="el-icon-question"></el-icon
                ></template>
              </el-table-column>
              <el-table-column label="类型" prop="name">
              </el-table-column>
              <el-table-column label="描述" prop="province">
              </el-table-column>
              <el-table-column label="主键" width="50">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.city"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot="header"
                  >标准化标签&nbsp;<el-icon class="el-icon-question"></el-icon
                ></template>
                <template slot-scope="scope">
                  <StandardizedLabel
                    :selectedCode="selectedCode"
                    :selectedValue="selectedValue"
                    @changeVal="changeVal($event, scope.row)"
                  ></StandardizedLabel>
                </template>
              </el-table-column>
              <el-table-column></el-table-column>
            </el-table>
            <el-table :data="tableData2" style="width: 100%">
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column label="分区字段名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.date"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name">
                    <el-option
                      v-for="(item, index) in tableRowTypes"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="描述">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.province"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="主键" width="50">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.city"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="标准化标签">
                <template slot-scope="scope">
                  <StandardizedLabel
                    :selectedCode="selectedCode"
                    :selectedValue="selectedValue"
                    @changeVal="changeVal($event, scope.row)"
                  ></StandardizedLabel>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow2(scope.$index, tableData)"
                    type="text"
                    size="small"
                  >
                    删除
                  </el-button>
                  <el-button
                    :disabled="scope.$index == 0 ? true : false"
                    type="text"
                    size="small"
                    @click="moveUp(scope, tableData2)"
                  >
                    上移
                  </el-button>
                  <el-button
                    :disabled="
                      scope.$index == tableData2.length - 1 ? true : false
                    "
                    type="text"
                    size="small"
                    @click="moveDown(scope, tableData2)"
                  >
                    下移
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              class="el-button-define"
              type="primary"
              icon="el-icon-plus"
              @click="addRow2"
              >添加分区字段</el-button
            >
          </el-collapse-item>
          <el-collapse-item name="2">
            <span class="collapse-title" slot="title">业务属性</span>
            <el-form :data="formData2" label-width="120px">
              <el-form-item label="核心表">
                <el-switch v-model="coreTable"> </el-switch>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="3">
            <span class="collapse-title" slot="title">基础属性设置</span>
            <el-form :data="formData2" label-width="120px">
              <el-form-item label="impala同步">
                <el-switch v-model="formData2.impalaSynchronization">
                </el-switch>
              </el-form-item>
              <el-form-item label="建表执行引擎">
                <el-select
                  disabled
                  v-model="formData2.buildTableExecutionEngine"
                >
                  <el-option label="hive" value="hive"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="表类型">
                <el-radio-group v-model="formData2.radio">
                  <el-radio :label="'3'">内部表</el-radio>
                  <el-radio :label="'6'">外部表</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="表生命周期">
                <el-radio-group v-model="formData2.radio1">
                  <el-radio :label="'3'">永久</el-radio>
                  <el-radio :label="'6'"
                    >非永久<el-input
                      :disabled="formData2.radio1 == 3"
                    ></el-input
                    ><span style="color: black">天</span></el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分区生命周期">
                <el-radio-group v-model="formData2.radio2">
                  <el-radio :label="'3'">永久</el-radio>
                  <el-radio :label="'6'"
                    >非永久<el-input
                      :disabled="formData2.radio2 == 3"
                    ></el-input
                    ><span style="color: black">天</span></el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="存储格式">
                <el-radio-group v-model="formData2.radio3">
                  <el-radio :label="'3'">Parquet</el-radio>
                  <el-radio :label="'4'">TextFile</el-radio>
                  <el-radio :label="'5'">SequenceFile</el-radio>
                  <el-radio :label="'6'">ORC</el-radio>
                  <el-radio :label="'7'">AVRO</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-collapse v-model="DMLActive">
              <el-collapse-item name="1">
                <span class="collapse-title" slot="title">设置输入表</span>
                <el-select v-model="DMLSelectIn">
                  <el-option
                    v-for="(item, index) in DMLOptions"
                    :key="index"
                    :value="item.value"
                  ></el-option>
                </el-select>
                &nbsp;
                <el-select v-model="DMLSelectIn2">
                  <el-option
                    v-for="(item, index) in DMLOptions2"
                    :key="index"
                    :value="item.value"
                  ></el-option>
                </el-select>
                &nbsp;
                <el-button
                  :disabled="false"
                  type="primary"
                  class="add-input-table-btn"
                  @click="addInputTableData"
                  >添加</el-button
                >
                <el-table :data="DMLTableData">
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    label="库表名称"
                    prop="libraryTableName"
                  ></el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="text">移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-col>
          <el-col :span="12">
            <el-collapse v-model="DMLActive2">
              <el-collapse-item name="1">
                <span class="collapse-title" slot="title">输出表</span>
                <el-button
                  type="text"
                  class="add-input-table-btn"
                  style="color: transparent; cursor: none"
                  >-</el-button
                >
                <el-table :data="DMLTableData2">
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    label="库表名称"
                    prop="libraryTableName"
                  ></el-table-column>
                  <el-table-column label="表类型" width="100"
                    >最终表</el-table-column
                  >
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-collapse v-model="DMLActive3">
              <el-collapse-item name="1">
                <span class="collapse-title" slot="title">加工准备区</span>
                <div>加工对象：{{ processingObject }}</div>
                <div>
                  模式选择：<el-select v-model="DMLSelectIn3">
                    <el-option
                      v-for="(item, index) in DMLOptions3"
                      :key="index"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <div class="alert-wrapper">
                    <el-alert
                      title="编辑时，建议按照序号①②③...进行"
                      type="warning"
                      :closable="false"
                    >
                    </el-alert>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <span>--以下为最终结果集</span>
                      <el-button
                        style="float: right"
                        type="text"
                        @click="popup(-1, 'false')"
                        :disabled="DMLTableData.length > 0 ? false : true"
                        >编辑</el-button
                      >
                    </div>
                    <div class="process-area">
                      <div>
                        {{
                          DMLTableData.length > 0
                            ? '序号' + (DMLTableData.length * 2 + 1)
                            : ''
                        }}
                        select 最终字段组
                      </div>
                    </div>
                    <div v-for="(item, index) in DMLTableData" :key="index">
                      <div>
                        <div v-if="index == 0">
                          from(
                          <el-button
                            style="float: right"
                            type="text"
                            :disabled="true"
                            >删除本项</el-button
                          >
                        </div>
                        <div v-if="index != 0">
                          {{ '序号' + (index > 0 ? index * 2 : '') }}
                          <el-select v-model="selectedRule">
                            <el-option
                              v-for="(item, index) in selectRules"
                              :key="index"
                              :value="item.value"
                              :label="item.label"
                            >
                            </el-option>
                          </el-select>
                          (
                          <el-button
                            style="float: right"
                            type="text"
                            :disabled="true"
                            >删除本项</el-button
                          >
                        </div>
                      </div>
                      <div>
                        {{ '序号' + (index == 0 ? index + 1 : index * 2 + 1) }}
                        <ResultSet
                          :ref="'ResultSet' + index"
                          :indexNum="index"
                          @popup="popup($event, 'true')"
                        ></ResultSet>
                        <div v-if="index == 0">)t{{ index + 1 }}</div>
                        <div v-if="index != 0">)t{{ index + 1 }}</div>
                      </div>
                    </div>
                    <div>
                      {{
                        DMLTableData.length > 0
                          ? '序号' + DMLTableData.length * 2
                          : ''
                      }}
                      <el-button
                        style="float: right"
                        type="text"
                        :disabled="true"
                        >新增关联</el-button
                      >
                      <div>
                        on<el-input
                          style="width: 70%"
                          v-model="associationCondition"
                          placeholder="请输入关联条件，必填"
                        ></el-input>
                      </div>
                      <div>
                        where<el-input
                          style="width: 70%"
                          v-model="associationCondition"
                          :disabled="true"
                          placeholder="此处为‘最终过滤条件’，在‘最终字段组’编辑后会自动填充"
                        ></el-input>
                      </div>
                      <div>
                        order by<el-input
                          style="width: 70%"
                          v-model="associationCondition"
                          :disabled="true"
                          placeholder="此处为‘最终聚合项’，在‘最终字段组’编辑后会自动填充"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <EditObjectResultSet
                    :DMLvisible="DMLvisible"
                    :ifTemp="ifTemp"
                    :indexNum="indexNum"
                    @closeDialog="closeDialog"
                    @saveDialog="saveDialog"
                  ></EditObjectResultSet>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import StandardizedLabel from './components/standardized-label.vue'
import EditObjectResultSet from './components/edit-object-result-set.vue'
import ResultSet from './components/result-set.vue'

export default {
  name: 'DMLMode',
  mixins: [pager],
  components: {
    StandardizedLabel,
    EditObjectResultSet,
    ResultSet,
  },
  props: {
    showDMLSubmitPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formActiveNames: '1',
      tableData: [
        {
          date: '字段1',
          name: '类型1',
          province: '描述1',
          city: true,
          address: '',
        },
        {
          date: '字段2',
          name: '类型2',
          province: '描述2',
          city: true,
          address: '',
        },
        {
          date: '字段3',
          name: '类型3',
          province: '描述3',
          city: true,
          address: '',
        },
      ],
      tableRowTypes: [
        {value: '类型1', label: '类型1'},
        {value: '类型2', label: '类型2'},
        {value: '类型3', label: '类型3'},
      ],
      normalizationTag1: true,
      options2: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致',
                },
                {
                  value: 'fankui',
                  label: '反馈',
                },
                {
                  value: 'xiaolv',
                  label: '效率',
                },
                {
                  value: 'kekong',
                  label: '可控',
                },
              ],
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航',
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航',
                },
              ],
            },
          ],
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局',
                },
                {
                  value: 'color',
                  label: 'Color 色彩',
                },
                {
                  value: 'typography',
                  label: 'Typography 字体',
                },
                {
                  value: 'icon',
                  label: 'Icon 图标',
                },
                {
                  value: 'button',
                  label: 'Button 按钮',
                },
              ],
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框',
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框',
                },
                {
                  value: 'input',
                  label: 'Input 输入框',
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器',
                },
                {
                  value: 'select',
                  label: 'Select 选择器',
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器',
                },
                {
                  value: 'switch',
                  label: 'Switch 开关',
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块',
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器',
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器',
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器',
                },
                {
                  value: 'upload',
                  label: 'Upload 上传',
                },
                {
                  value: 'rate',
                  label: 'Rate 评分',
                },
                {
                  value: 'form',
                  label: 'Form 表单',
                },
              ],
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格',
                },
                {
                  value: 'tag',
                  label: 'Tag 标签',
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条',
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件',
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页',
                },
                {
                  value: 'badge',
                  label: 'Badge 标记',
                },
              ],
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告',
                },
                {
                  value: 'loading',
                  label: 'Loading 加载',
                },
                {
                  value: 'message',
                  label: 'Message 消息提示',
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框',
                },
                {
                  value: 'notification',
                  label: 'Notification 通知',
                },
              ],
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单',
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页',
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑',
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单',
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条',
                },
              ],
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框',
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示',
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框',
                },
                {
                  value: 'card',
                  label: 'Card 卡片',
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯',
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板',
                },
              ],
            },
          ],
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components',
            },
            {
              value: 'sketch',
              label: 'Sketch Templates',
            },
            {
              value: 'jiaohu',
              label: '组件交互文档',
            },
          ],
        },
      ],
      tableData2: [
        {
          date: '字段1',
          name: '类型1',
          province: '描述1',
          city: true,
          address: '',
        },
        {
          date: '字段2',
          name: '类型2',
          province: '描述2',
          city: true,
          address: '',
        },
        {
          date: '字段3',
          name: '类型3',
          province: '描述3',
          city: true,
          address: '',
        },
      ],
      normalizationTag2: true,
      formData2: {
        radio1: 3,
        radio2: 3,
        buildTableExecutionEngine: 'hive',
      },
      coreTable: false,
      DMLActive: '1',
      DMLSelectIn: 'show',
      DMLOptions: [
        {key: 'show', value: 'show'},
        {key: 'show2', value: 'show2'},
      ],
      DMLSelectIn2: 'showww',
      DMLOptions2: [
        {key: 'showww', value: 'showww'},
        {key: 'showww2', value: 'showww2'},
      ],
      DMLTableData: [],
      DMLActive2: '1',
      DMLTableData2: [
        {
          libraryTableName: 'show dwd_test_2',
        },
      ],
      DMLActive3: '1',
      DMLSelectIn3: '标准反复关联模式',
      DMLOptions3: [
        {key: '标准反复关联模式', value: '标准反复关联模式'},
        {key: '标准反复关联模式2', value: '标准反复关联模式2'},
      ],
      processingObject: 'show dwd_test_2',
      selectedCode: '',
      selectedValue: ['duliang-1', 'duliang-1-1', 'duliang-1-1-1'],
      selectRules: [
        {
          value: 'inner join',
          key: 'inner join',
        },
        {
          value: 'left outer join',
          key: 'left outer join',
        },
        {
          value: 'right outer join',
          key: 'right outer join',
        },
      ],
      selectedRule: 'inner join',
      associationCondition: '',
      unfold: true,
      DMLvisible: false,
      ifTemp: true,
      indexNum: -1,
      tempNum1: '',
      tempNum2: '',
      tempNum3: '',
      tempNum4: '',
      tempNum5: '',
    }
  },
  computed: {},
  watch: {
    DMLTableData(n, o) {
      if (n.length == 0) {
        this.tempNum1 = ''
        this.tempNum2 = ''
        this.tempNum3 = ''
        this.tempNum4 = 1
        this.tempNum5 = 2
      } else if (n.length == 1) {
        this.tempNum1 = ''
        this.tempNum2 = ''
        this.tempNum3 = 1
        this.tempNum4 = 2
        this.tempNum5 = 3
      } else if (n.length > 1) {
        this.tempNum1 = ''
        this.tempNum2 = 1
        this.tempNum3 = 1
        this.tempNum4 = 2
        this.tempNum5 = 3
      }
    },
  },
  created() {},
  methods: {
    addRow() {
      this.tableData.push({
        date: '',
        name: '',
        province: '',
        city: true,
        address: '',
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    deleteRow2(index, rows) {
      rows.splice(index, 1)
    },
    addRow2() {
      this.tableData2.push({
        date: '',
        name: '',
        province: '',
        city: true,
        address: '',
      })
    },
    changeVal(e, row) {
      row
      this.selectedValue = e
    },
    moveUp(scope, array) {
      array[scope.$index] = array.splice(
        scope.$index - 1,
        1,
        array[scope.$index]
      )[0]
    },
    moveDown(scope, array) {
      array[scope.$index] = array.splice(
        scope.$index + 1,
        1,
        array[scope.$index]
      )[0]
    },
    popup(n, v) {
      this.DMLvisible = true
      if (n != -1) {
        this.indexNum = n.index
      } else {
        this.indexNum = n
      }
      if (v == 'true') {
        this.ifTemp = true
      } else if (v == 'false') {
        this.ifTemp = false
      }
    },
    closeDialog() {
      this.DMLvisible = false
    },
    saveDialog(val) {
      this.DMLvisible = false
      if (val.index != -1) {
        let temp = 'ResultSet' + val.index
        this.$refs[temp][0].resultVal = val
      }
    },
    addInputTableData() {
      let temp = this.DMLSelectIn + ' ' + this.DMLSelectIn2
      this.DMLTableData.push({
        libraryTableName: temp,
      })
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
.dml-mode {
  .dml-mode-content {
    .el-button-define {
      margin: 10px 0px;
    }
    .el-button-define:last-of-type {
      margin: 10px 0px 0px;
    }
    .add-input-table-btn {
      margin-bottom: 5px;
    }
    .el-collapse {
      border: none;
      .el-collapse-item__wrap {
        border: none;
      }
    }
    .process-area {
      background: #ccc;
    }
    .alert-wrapper {
      float: right;
      width: 15%;
      .el-alert {
        margin: 0px;
        padding: 0px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
}
</style>
