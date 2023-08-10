<template>
  <div class="sql-mode height-100per flex-column">
    <div class="sql-mode-content">
      <div class="sql-editor" v-if="showSQLEditor == true">
        <el-alert
          title="当前输入框中‘库名 表名’即使修改，真正建表时也只会按照上一步中选择的库下配置的表名创建！"
          type="warning"
          show-icon
        >
        </el-alert>
        <div class="creat-table-engine">
          建表执行引擎：
          <el-select v-model="SQLCreatTableEngine" placeholder="请选择">
            <el-option
              v-for="(item, index) in options3"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <MonacoEditor></MonacoEditor>
        </div>
        <el-button
          class="el-button-define"
          type="primary"
          @click="creatTableStructure"
          >生成表结构</el-button
        >
      </div>
      <div class="sql-editor-after" v-else>
        <el-button
          class="el-button-define"
          type="primary"
          @click="returnSQLEditor"
          >返回SQL编辑器</el-button
        >
        <el-collapse v-model="formActiveNames">
          <el-collapse-item name="1">
            <span class="collapse-title" slot="title">字段配置</span>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column>
                <template slot="header"
                  >字段名称&nbsp;<el-icon class="el-icon-question"></el-icon
                ></template>
                <template slot-scope="scope">
                  <el-input
                    placeholder="仅支持小写字母、数字、**"
                    v-model="scope.row.date"
                  ></el-input>
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
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small"
                  >
                    删除
                  </el-button>
                  <el-button
                    :disabled="scope.$index == 0 ? true : false"
                    type="text"
                    size="small"
                    @click="moveUp(scope, tableData)"
                  >
                    上移
                  </el-button>
                  <el-button
                    :disabled="
                      scope.$index == tableData.length - 1 ? true : false
                    "
                    type="text"
                    size="small"
                    @click="moveDown(scope, tableData)"
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
              @click="addRow"
              >添加字段</el-button
            >
            <el-table :data="tableData2" style="width: 100%">
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column label="分区字段名称" prop="date">
                <!-- <template slot-scope="scope">
                  <el-input v-model="scope.row.date"></el-input>
                </template> -->
              </el-table-column>
              <el-table-column label="类型" prop="name">
                <!-- <template slot-scope="scope">
                  <el-select v-model="scope.row.name">
                    <el-option
                      v-for="(item, index) in tableRowTypes"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </template> -->
              </el-table-column>
              <el-table-column label="描述" prop="province">
                <!-- <template slot-scope="scope">
                  <el-input v-model="scope.row.province"></el-input>
                </template> -->
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
              <el-table-column></el-table-column>
              <!-- <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow2(scope.$index, tableData2)"
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
              </el-table-column> -->
            </el-table>
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
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import StandardizedLabel from './components/standardized-label.vue'

export default {
  name: 'SQLMode',
  mixins: [pager],
  components: {
    StandardizedLabel,
  },
  props: {
    showSQLEditor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      SQLCreatTableEngine: 'hive',
      options3: [
        {
          value: 'hive',
          label: 'hive',
        },
        {
          value: 'hive2',
          label: 'hive2',
        },
        {
          value: 'hive3',
          label: 'hive3',
        },
        {
          value: 'hive4',
          label: 'hive4',
        },
        {
          value: 'hive5',
          label: 'hive5',
        },
      ],
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
        {value: 'STRING', label: 'STRING'},
        {value: 'BOOLEAN', label: 'BOOLEAN'},
        {value: 'ARRAY', label: 'ARRAY'},
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
      selectedCode: '',
      selectedValue: ['duliang-1', 'duliang-1-1', 'duliang-1-1-1'],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    creatTableStructure() {
      // this.showSQLEditor = false
      this.$emit('creatTableStructure', false)
    },
    returnSQLEditor() {
      // this.showSQLEditor = true
      this.$emit('returnSQLEditor', true)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    addRow() {
      this.tableData.push({
        date: '',
        name: '',
        province: '',
        city: true,
        address: '',
      })
    },
    deleteRow2(index, rows) {
      rows.splice(index, 1)
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
.sql-mode {
  .sql-mode-content {
    .creat-table-engine {
      margin-bottom: 10px;
    }
    .el-button-define {
      margin: 10px 0px;
    }
    // .el-button-define:last-of-type {
    //   margin: 10px 0px 0px;
    // }
    // .degree-btn {
    //   padding: 5px;
    //   cursor: pointer;
    // }
    // .degree-btn.active {
    //   padding: 5px;
    //   cursor: pointer;
    //   color: white;
    //   background-color: #409eff;
    //   border-radius: 2px;
    // }
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