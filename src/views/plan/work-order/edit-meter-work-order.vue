<template>
  <div class="edit-meter-work-order height-100per flex-column">
    <div class="edit-meter-work-order-content">
      <el-alert
        title="仅能修改自己有修改权限的表，有主题归属的会走审批流程，无主题归属的直接执行！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-form
        :model="formData"
        :label-position="labelPosition"
        :label-width="labelWidth"
      >
        <el-form-item label="库">
          <el-select v-model="formData.selectedLibrary">
            <el-option
              v-for="(item, index) in libraryList"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表">
          <el-select v-model="formData.selectedTable">
            <el-option
              v-for="(item, index) in tableList"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.selectedTable != ''">
          <template slot="label">
            <span>级联更新&nbsp;<i class="el-icon-question"></i></span>
          </template>
          <el-switch v-model="formData.cascadingUpdate"> </el-switch>
        </el-form-item>
        <el-form-item label="表分层">
          <div v-if="formData.selectedTable == ''">请先选择表</div>
          <div v-else>
            <span>dwd_明细层</span>
          </div>
        </el-form-item>
        <el-form-item label="主题归属">
          <div v-if="formData.selectedTable == ''">请先选择表</div>
          <div v-else>
            <span>电商业务板块/利率分析</span>
          </div>
        </el-form-item>
        <el-form-item label="表描述">
          <div v-if="formData.selectedTable == ''">请先选择表</div>
          <div v-else>
            <span>度量演示</span>
          </div>
        </el-form-item>
        <el-form-item label="表负责人">
          <div v-if="formData.selectedTable == ''">请先选择表</div>
          <div v-else>
            <span>张三</span>
          </div>
        </el-form-item>
        <el-form-item label="表结构">
          <div v-if="formData.selectedTable == ''">请先选择表</div>
          <div v-else>
            <el-collapse v-model="activeCollapseName">
              <el-collapse-item name="1" title="非分区字段（现有）">
                <el-table :data="nonpartitionedFieldData">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column
                    label="字段名称"
                    prop="fieldName"
                  ></el-table-column>
                  <el-table-column label="类型" prop="type"></el-table-column>
                  <el-table-column
                    label="描述"
                    prop="description"
                  ></el-table-column>
                  <el-table-column label="标准化标签" prop="standardizedLabel">
                    <template slot-scope="scope">
                      <div v-if="scope.row.standardizedLabel == ''">-</div>
                      <div v-else>
                        <el-tag>度量</el-tag>&nbsp;{{
                          scope.row.standardizedLabel
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column></el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item name="1" title="非分区字段（新增）">
                <el-table :data="nonpartitionedFieldDataAdd">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="字段名称">
                    <template slot="header">
                      <span
                        >字段名称&nbsp;<i class="el-icon-question"></i
                      ></span>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.fieldName"> </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.type">
                        <el-option
                          v-for="(item, index) in typeList"
                          :key="index"
                          :value="item.value"
                          :label="item.label"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.description"></el-input>
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
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteRow(scope.$index, nonpartitionedFieldDataAdd)
                        "
                        type="text"
                        size="small"
                      >
                        删除
                      </el-button>
                      <MoveUpDown
                        :s_scope="scope"
                        :tableData="nonpartitionedFieldDataAdd"
                        @moveUp="moveUp1($event, nonpartitionedFieldDataAdd)"
                        @moveDown="
                          moveDown1($event, nonpartitionedFieldDataAdd)
                        "
                      ></MoveUpDown>
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
              </el-collapse-item>
              <el-collapse-item name="1" title="分区字段（现有）">
                <el-table :data="partitionedFieldData">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column
                    label="字段名称"
                    prop="fieldName"
                  ></el-table-column>
                  <el-table-column label="类型" prop="type"></el-table-column>
                  <el-table-column
                    label="描述"
                    prop="description"
                  ></el-table-column>
                  <el-table-column label="标准化标签" prop="standardizedLabel">
                    <template slot-scope="scope">
                      <div v-if="scope.row.standardizedLabel == ''">-</div>
                      <div v-else>
                        <el-tag>度量</el-tag>&nbsp;{{
                          scope.row.standardizedLabel
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column></el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item name="1" title="分区字段（新增）">
                <el-table :data="partitionedFieldDataAdd">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column>
                    <template slot="header">
                      <span
                        >字段名称&nbsp;<i class="el-icon-question"></i
                      ></span>
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.fieldName"> </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.type">
                        <el-option
                          v-for="(item, index) in typeList"
                          :key="index"
                          :value="item.value"
                          :label="item.label"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.description"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="standardizedLabel">
                    <template slot-scope="scope">
                      <StandardizedLabel
                        :selectedCode="selectedCode"
                        :selectedValue="selectedValue"
                        @changeVal="changeVal2($event, scope.row)"
                      ></StandardizedLabel>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteRow2(scope.$index, partitionedFieldDataAdd)
                        "
                        type="text"
                        size="small"
                      >
                        删除
                      </el-button>
                      <MoveUpDown
                        :s_scope="scope"
                        :tableData="partitionedFieldDataAdd"
                        @moveUp="moveUp2($event, partitionedFieldDataAdd)"
                        @moveDown="moveDown2($event, partitionedFieldDataAdd)"
                      ></MoveUpDown>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  class="el-button-define"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addRow2"
                  >添加字段</el-button
                >
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import StandardizedLabel from './components/standardized-label.vue'
import MoveUpDown from './components/move-up-down.vue'

export default {
  name: 'EditMeterWorkOrder',
  mixins: [pager],
  components: {StandardizedLabel, MoveUpDown},
  data() {
    return {
      labelPosition: 'left',
      labelWidth: '140px',
      activeCollapseName: '1',
      formData: {
        selectedLibrary: '',
        selectedTable: '',
        cascadingUpdate: true,
      },
      libraryList: [
        {
          value: '库1',
          label: '库1',
        },
        {
          value: '库2',
          label: '库2',
        },
        {
          value: '库3',
          label: '库3',
        },
      ],
      tableList: [
        {
          value: '表1',
          label: '表1',
        },
        {
          value: '表2',
          label: '表2',
        },
        {
          value: '表3',
          label: '表3',
        },
      ],
      typeList: [
        {value: 'STRING', label: 'STRING'},
        {value: 'BOOLEAN', label: 'BOOLEAN'},
        {value: 'ARRAY', label: 'ARRAY'},
      ],
      selectedCode: '',
      selectedValue: ['duliang-1', 'duliang-1-1', 'duliang-1-1-1'],
      nonpartitionedFieldData: [
        {
          fieldName: '字段1',
          type: 'string',
          description: '描述1',
          standardizedLabel: '产品分析度',
        },
        {
          fieldName: '字段2',
          type: 'string',
          description: '描述2',
          standardizedLabel: '产品分析度',
        },
        {
          fieldName: '字段3',
          type: 'string',
          description: '描述3',
          standardizedLabel: '',
        },
      ],
      nonpartitionedFieldDataAdd: [
        {
          fieldName: '字段1',
          type: 'STRING',
          description: '描述1',
        },
        {
          fieldName: '字段2',
          type: 'STRING',
          description: '描述2',
        },
        {
          fieldName: '字段3',
          type: 'STRING',
          description: '描述3',
        },
      ],
      partitionedFieldData: [
        {
          fieldName: '字段1',
          type: 'string',
          description: '描述1',
          standardizedLabel: '产品分析度',
        },
        {
          fieldName: '字段2',
          type: 'string',
          description: '描述2',
          standardizedLabel: '产品分析度',
        },
        {
          fieldName: '字段3',
          type: 'string',
          description: '描述3',
          standardizedLabel: '',
        },
      ],
      partitionedFieldDataAdd: [
        {
          fieldName: '字段1',
          type: 'STRING',
          description: '描述1',
        },
        {
          fieldName: '字段2',
          type: 'STRING',
          description: '描述2',
        },
        {
          fieldName: '字段3',
          type: 'STRING',
          description: '描述3',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    changeVal(e, row) {
      row
      this.selectedValue = e
    },
    changeVal2(e, row) {
      row
      this.selectedValue = e
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    deleteRow2(index, rows) {
      rows.splice(index, 1)
    },
    moveUp1(e, val) {
      val = e
    },
    moveDown1(e, val) {
      val = e
    },
    moveUp2(e, val) {
      val = e
    },
    moveDown2(e, val) {
      val = e
    },
    addRow() {
      this.nonpartitionedFieldDataAdd.push({
        date: '',
        name: '',
        province: '',
        city: true,
        address: '',
      })
    },
    addRow2() {
      this.partitionedFieldDataAdd.push({
        date: '',
        name: '',
        province: '',
        city: true,
        address: '',
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
.edit-meter-work-order {
  .edit-meter-work-order-content {
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
