<template>
  <div class="statisticalPeriod">
    <div class="searchBox mb-15">
      <el-input
        v-model="inputVal"
        prefix-icon="el-icon-search"
        @input="searchChange"
        clearable
        placeholder="请输入关键字搜索"
      ></el-input>
      <el-button type="primary" icon="el-icon-plus" @click="createdClick">新建统计周期</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="cycle_name" show-overflow-tooltip label="统计周期"></el-table-column>
      <el-table-column prop="cycle_code" show-overflow-tooltip label="英文缩写"></el-table-column>
      <el-table-column prop="cycle_desc" show-overflow-tooltip label="描述"></el-table-column>
      <el-table-column prop show-overflow-tooltip label="表达式">
        <template slot-scope="scope">
          <!-- <div>开始时间：{{scope.row.value_expr_start === '' ? scope.row.param_start : scope.row.ves}}</div>
          <div>结束时间：{{scope.row.value_expr_end === '' ? scope.row.param_end : scope.row.value_expr_end}}</div> -->
          <div>开始时间：{{scope.row.value_expr_start}}</div>
          <div>结束时间：{{scope.row.value_expr_end}}</div>
        </template>
      </el-table-column>
      <el-table-column prop show-overflow-tooltip label="创建信息">
        <template slot-scope="scope">
          <div>创建用户：{{scope.row.create_user}}</div>
          <div>创建时间：{{scope.row.create_time}}</div>
        </template>
      </el-table-column>
      <el-table-column prop show-overflow-tooltip label="更新信息">
        <template slot-scope="scope">
          <div>更新用户：{{scope.row.modify_user}}</div>
          <div>更新时间：{{scope.row.modify_time}}</div>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editClick(scope.row)"
            class="mr-10"
            title="编辑"
            icon="font-16 el-icon-edit-outline"
          ></el-button>
          <SimpleConfirm @confirm="delClick(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-20 pagerBox">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageFilters.pageNo"
        :page-sizes="pageSizes"
        :page-size="pageFilters.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="isCreated ? '新建统计周期' : '修改'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <div>
        <el-form
          ref="ruleForm"
          label-width="100px"
          :model="statisticalPeriodData"
          :rules="rules"
          label-suffix="："
          v-loading="dialogLoading"
        >
          <el-form-item prop="cycle_name" label="统计周期">
            <el-input
              v-model="statisticalPeriodData.cycle_name"
              maxlength="32"
              show-word-limit
              placeholder="请输入名称，32字符以内"
            ></el-input>
          </el-form-item>
          <el-form-item prop="cycle_code" label="英文缩写">
            <el-input
              v-model="statisticalPeriodData.cycle_code"
              maxlength="10"
              show-word-limit
              placeholder="请输入统计周期英文，10字符以内"
              :disabled="is_disabled"
            ></el-input>
          </el-form-item>
          <el-form-item prop="cycle_desc" label="描述" type="textarea">
            <el-input
              type="textarea"
              v-model="statisticalPeriodData.cycle_desc"
              maxlength="128"
              show-word-limit
              placeholder="请输入周期描述，128字符以内"
            ></el-input>
          </el-form-item>
          <h3 class="expressionTitle">
            表达式
            <span v-popover:explain>表达式参数说明</span>
            <el-popover
              placement="top-start"
              trigger="click"
              width="500"
              ref="explain"
              :visible-arrow="true"
              popper-class="explain-popover">
              <Explain></Explain>
            </el-popover>

          </h3>
          <el-form-item label="开始时间表达式" required label-width="150px"></el-form-item>
          <el-form-item required>
            <!-- <el-radio-group v-model="startRadio">
              <el-radio :label="0" :disabled="startDisabled0">参数</el-radio>
              <el-radio :label="1" :disabled="startDisabled1">函数表达式</el-radio>
            </el-radio-group> -->
            <!-- <el-form-item prop="param_start" v-if="startRadio === 0">
              <el-input
                clearable
                v-model="statisticalPeriodData.param_start"
                placeholder="请输入参数"
                @change="changeInputParam(statisticalPeriodData.param_start, 'startDisabled1')"
              ></el-input>
            </el-form-item> -->
            <div class="selectInput">
              <div class="left">
                <el-form-item prop="key_expr_start">
                  <el-select
                    clearable
                    v-model="statisticalPeriodData.key_expr_start"
                    placeholder="请选择"
                    @change="changeHandleStart"
                  >
                  <!-- @change="changeHandle(statisticalPeriodData.value_expr_start, statisticalPeriodData.key_expr_start,  'startDisabled0')" -->
                    <el-option
                      v-for="(item, index) in dics.key_expr"
                      :key="index"
                      :label="item.value"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item prop="value_expr_start">
                  <el-input
                    clearable
                    placeholder="请输入内容"
                    v-model="statisticalPeriodData.value_expr_start"
                  ></el-input>
                  <!-- @change="changeInput(statisticalPeriodData.value_expr_start, statisticalPeriodData.key_expr_start,  'startDisabled0')" -->
                </el-form-item>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="结束时间表达式" required label-width="150px"></el-form-item>
          <el-form-item required>
            <!-- <el-radio-group v-model="endRadio">
              <el-radio :label="0" :disabled="endDisabled0">参数</el-radio>
              <el-radio :label="1" :disabled="endDisabled1">函数表达式</el-radio>
            </el-radio-group> -->
            <!-- <el-form-item prop="param_end" v-if="endRadio === 0">
              <el-input
                clearable
                v-model="statisticalPeriodData.param_end"
                @change="changeInputParam(statisticalPeriodData.param_end, 'endDisabled1')"
                placeholder="请输入参数"
              ></el-input>
            </el-form-item> -->
            <div class="selectInput">
              <div class="left">
                <el-form-item prop="key_expr_end">
                  <el-select
                    clearable
                    :disabled="end_disabled"
                    v-model="statisticalPeriodData.key_expr_end"
                    placeholder="请选择"
                  >
                  <!--  @change="changeHandle(statisticalPeriodData.value_expr_end, statisticalPeriodData.key_expr_end,  'endDisabled0')" -->
                    <el-option
                      v-for="(item, index) in dics.key_expr"
                      :key="index"
                      :label="item.value"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item prop="value_expr_end">
                  <el-input
                    placeholder="请输入内容"
                    clearable
                    :disabled="end_disabled"
                    v-model="statisticalPeriodData.value_expr_end"
                  ></el-input>
                  <!-- @change="changeInput(statisticalPeriodData.value_expr_end, statisticalPeriodData.key_expr_end,  'endDisabled0')" -->
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="enterClick('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTableList,
  getSave,
  getQueryById,
  getEdit,
  getDel
} from '@/api/plan/publicDefinition/statisticalPeriod'
import pager from '@/mixins/pager'
import Explain from './explain'
export default {
  name: 'statisticalPeriod',
  mixins: [pager],
  components: {
    Explain
  },
  data() {
    return {
      isCreated: true,
      tableLoading: false,
      dialogLoading: false,
      is_disabled: false,
      tableData: [],
      inputVal: '',
      dialogVisible: false,
      statisticalPeriodData: this.statisticalPeriodDataInit(),
      rules: {
        cycle_name: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ],
        cycle_code: [
          {required: true, message: '英文名不能为空', trigger: 'blur'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        param_start: [
          {required: true, message: '参数不能为空', trigger: 'blur'}
        ],
        param_end: [{required: true, message: '参数不能为空', trigger: 'blur'}],
        key_expr_start: [
          {required: true, message: '参数不能为空', trigger: 'blur'}
        ],
        key_expr_end: [
          {required: true, message: '参数不能为空', trigger: 'blur'}
        ],
        value_expr_start: [
          {required: true, message: '函数表达式不能为空', trigger: 'blur'}
        ],
        value_expr_end: [
          {required: true, message: '函数表达式不能为空', trigger: 'blur'}
        ]
      },
      startRadio: 0,
      endRadio: 0,
      startDisabled0: false,
      endDisabled0: false,
      startDisabled1: false,
      endDisabled1: false,
      end_disabled: false
    }
  },
  mounted() {
    this.getTableList()
  },
  watch: {
    statisticalPeriodData: {
      handler(val) {
        if (val.value_expr_end !== '' || val.key_expr_end !== '') {
          this.startDisabled0 = true
          this.startDisabled1 = false
        }
      },
      immediate: true
    }
  },
  methods: {
    statisticalPeriodDataInit() {
      return {
        cycle_name: '',
        cycle_code: '',
        cycle_desc: '',
        // param_start: '',
        key_expr_start: '',
        value_expr_start: '',
        // param_end: '',
        key_expr_end: '',
        value_expr_end: ''
      }
    },
    searchChange() {
      this.getTableList()
    },
    createdClick() {
      this.statisticalPeriodData = this.statisticalPeriodDataInit()
      // console.log(this.statisticalPeriodData)
      this.dialogLoading = false
      this.isCreated = true
      this.dialogVisible = true
      this.startDisabled0 = false
      this.endDisabled0 = false
      this.startDisabled1 = false
      this.endDisabled1 = false
      this.is_disabled = false
    },
    editClick(row) {
      this.isCreated = false
      this.getQueryById(row.id)
      this.dialogVisible = true
      this.is_disabled = true
    },
    enterClick(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isCreated) {
            await this.getSave()
            this.dialogVisible = false
          } else {
            await this.getEdit()
            this.dialogVisible = false
          }
        } else {
          return false
        }
      })
    },
    changeHandleStart(val) {
      // if (val === 'lastNDate' ||
      //     val === 'tdBeginDate' ||
      //     val === 'mountCurrent' ||
      //     val === 'weekCurrent' ||
      //     val === 'yearCurrent' ||
      //     val === 'tdMountCurrent' ||
      //     val === 'tdWeekCurrent') {
      //   this.end_disabled = true
      //   this.statisticalPeriodData.value_expr_end = 'current_date'
      //   this.statisticalPeriodData.key_expr_end = this.statisticalPeriodData.key_expr_start
      // } else {
      //   this.end_disabled = false
      // }
      if (
        // val === 'mountCurrent' ||
        // val === 'yearCurrent' ||
        // val === 'weekCurrent'
        val !== 'beginEndDate'
      ) {
        this.end_disabled = true
        this.rules.value_expr_end[0].required = false
        this.rules.key_expr_end[0].required = false
      } else {
        this.end_disabled = false
        this.rules.value_expr_end[0].required = true
        this.rules.key_expr_end[0].required = true
      }
    },
    // changeHandle(inputVal, selectVal, disabled) {
    //   if (inputVal === '' && selectVal === '') {
    //     this[disabled] = false
    //   } else {
    //     this[disabled] = true
    //   }
    // },
    // changeInput(inputVal, selectVal, disabled) {
    //   if (inputVal === '' && selectVal === '') {
    //     this[disabled] = false
    //   } else {
    //     this[disabled] = true
    //   }
    // },
    // changeInputParam(val, disabled) {
    //   if (val !== '') {
    //     this[disabled] = true
    //   } else {
    //     this[disabled] = false
    //   }
    // },
    async getTableList() {
      this.tableLoading = true
      let param = {
        ...this.pageFilters,
        key: this.tabData,
        levelName: this.inputVal
      }
      const res = await this.$simpleAsyncTo(getTableList(param), '获取失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.tableLoading = false
    },
    async getQueryById(row) {
      this.dialogLoading = true
      const param = {id: row}
      const res = await this.$simpleAsyncTo(getQueryById(param), '获取失败')
      if (!this.isCreated && res.flag) {
        if (res.data.param_start === '') {
          this.startRadio = 1
          this.startDisabled0 = true
          this.startDisabled1 = false
        } else {
          this.startRadio = 0
          this.startDisabled1 = true
          this.startDisabled0 = false
        }
        if (res.data.param_end !== '') {
          this.endRadio = 0
          this.endDisabled1 = true
          this.endDisabled0 = false
        } else {
          this.endRadio = 1
          this.endDisabled0 = true
          this.endDisabled1 = false
        }
        this.statisticalPeriodData = {
          cycle_name: res.data.cycle_name,
          cycle_code: res.data.cycle_code,
          cycle_desc: res.data.cycle_desc,
          param_start: res.data.param_start,
          key_expr_start: res.data.key_expr_start,
          value_expr_start: res.data.value_expr_start,
          param_end: res.data.param_end,
          key_expr_end: res.data.key_expr_end,
          value_expr_end: res.data.value_expr_end,
          id: row
        }
        if (
          // this.statisticalPeriodData.key_expr_end === 'mountCurrent' ||
          // this.statisticalPeriodData.key_expr_end === 'yearCurrent' ||
          // this.statisticalPeriodData.key_expr_end === 'weekCurrent' ||
          // this.statisticalPeriodData.key_expr_end === 'tdBeginDate'
          this.statisticalPeriodData.key_expr_start !== 'beginEndDate'
        ) {
          this.end_disabled = true
          this.rules.value_expr_end[0].required = false
          this.rules.key_expr_end[0].required = false
          // this.statisticalPeriodData.value_expr_end = 'current_date'
          // this.statisticalPeriodData.key_expr_end = this.statisticalPeriodData.key_expr_start
        } else {
          this.end_disabled = false
          this.rules.value_expr_end[0].required = true
          this.rules.key_expr_end[0].required = true
        }
      }
      this.dialogLoading = false
    },
    async getSave() {
      this.globalLoading()
      const param = this.statisticalPeriodData
      await this.$sleep(3000)
      const res = await this.$simpleAsyncTo(getSave(param), '提交失败')
      if (res) {
        this.getTableList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    async getEdit() {
      this.globalLoading()
      const param = this.statisticalPeriodData
      const res = await this.$simpleAsyncTo(getEdit(param), '提交失败')
      await this.$sleep(3000)
      if (res) {
        this.getTableList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    async delClick(row) {
      const param = {id: row.id}
      this.globalLoading()
      const res = await this.$simpleAsyncTo(getDel(param), '提交失败')
      if (res) {
        this.getTableList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    closeHandle() {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
.statisticalPeriod {
  .searchBox {
    float: right;
    display: flex;
    & * {
      // flex: 1;
      margin: 0 4px;
    }
  }
  .expressionTitle {
    font-size: 16px;
    border-top: solid 1px $grey5;
    line-height: 40px;
    span {
      cursor: pointer;
      font-size: 12px;
      color: $tabTitleColor;
      padding-left: 20px;
    }
  }
  .selectInput {
    display: flex;
    .left {
      width: 100px;
      margin-right: 5px;
    }
    .right {
      flex: 1;
    }
  }
}
</style>
<style lang="scss">
.explain-popover {
  padding: 0;
  border-radius: 0;
  background-color: $headerBg;
  border: none;
  color: $grey7;
  .popper__arrow::after {
    border-top-color: $headerBg!important;
  }
}
</style>
