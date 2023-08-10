<template>
  <div class="build-meter-work-order height-100per flex-column">
    <div class="build-meter-work-order-content">
      <el-steps :active="active" space="25%" :align-center="true">
        <el-step
          v-for="(item, index) in elSteps"
          :key="index"
          :title="item.title"
        ></el-step>
      </el-steps>
      <div class="table-name" v-if="active == 1">
        <el-form
          class="form"
          :model="tableNameForm"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="表分层">
            <el-select v-model="tableNameForm.tableLevel">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="layer-library" @click="layerLibrary"
              >查看分层和选库说明</span
            >
          </el-form-item>
          <el-form-item label="库">
            <el-select v-model="tableNameForm.library">
              <el-option
                v-for="(item, index) in options1"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主题归属">
            <el-cascader
              placeholder="请先选择表分层"
              :options="options2"
              :props="cascaderProps"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-collapse accordion v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
              <span class="collapse-title" slot="title">表名配置</span>
              <div>
                <el-alert
                  title="您选择的表分层下未设置表设计规则，可自行设置表名称"
                  type="warning"
                  show-icon
                  :closable="false"
                >
                </el-alert>
                <el-form-item label="表名称">
                  <el-input
                    placeholder="1~64个字符，需以字母开头，仅支持小写字母、数字、‘_’"
                    v-model="tableNameForm.tableName"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="表名描述">
                  <el-input
                    type="textarea"
                    placeholder="请输入表的描述"
                    v-model="tableNameForm.tableDescription"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <div
        class="basic-property-field"
        v-if="active == 2 && pattern == 'undefined'"
      >
        <div class="choose-mode">请选择一种配置模式</div>
        <div class="modes">
          <span>
            <div>
              <img src="@/assets/images/form-mode.png" />
              <el-button type="primary" @click="showForm">表单模式</el-button>
            </div>
            <div>
              <img src="@/assets/images/sql-mode.png" />
              <el-button type="primary" @click="showSQL">SQL模式</el-button>
            </div>
            <div>
              <img src="@/assets/images/dml-mode.png" />
              <el-button type="primary" @click="showDML">DML模式</el-button>
            </div>
          </span>
        </div>
      </div>
      <div class="form-pattern" v-if="active == 2 && pattern == 'form'">
        <formMode></formMode>
      </div>
      <div class="form-pattern" v-if="active == 2 && pattern == 'sql'">
        <sqlMode
          :showSQLEditor="showSQLEditor"
          @creatTableStructure="creatTableStructure"
          @returnSQLEditor="returnSQLEditor"
        ></sqlMode>
      </div>
      <div
        class="form-pattern"
        v-if="(active == 2 || active == 3) && pattern == 'dml'"
      >
        <dmlMode :showDMLSubmitPage="showDMLSubmitPage"></dmlMode>
      </div>
      <el-button style="margin-top: 12px" v-if="active > 1" @click="pre($event)"
        >上一步</el-button
      >
      <el-button
        style="margin-top: 12px"
        v-if="active != 2 && active != 3"
        @click="next($event)"
        >下一步</el-button
      >
      <el-button
        style="margin-top: 12px"
        v-if="active == 2 && active != 3 && pattern == 'dml'"
        @click="nextDML($event)"
        >下一步</el-button
      >
      <span
        v-if="
          (active == 2 && pattern == 'form') ||
          (active == 2 && pattern == 'sql' && !showSQLEditor) ||
          (active == 3 && pattern == 'dml')
        "
        style="margin-left: 12px"
      >
        <el-button
          icon="el-icon-check"
          type="success"
          @click="dialogVisible = true"
        >
          提交
        </el-button>
        <el-button icon="el-icon-folder" type="primary"> 保存 </el-button>
      </span>
      <el-dialog title="提交工单" :visible.sync="dialogVisible" width="30%">
        <el-input
          type="textarea"
          v-model="submitWorkOrderRemark"
          placeholder="请填写备注信息，非必填"
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import formMode from './form-mode.vue'
import sqlMode from './sql-mode.vue'
import dmlMode from './dml-mode.vue'

export default {
  name: 'BuildMeterWorkOrder',
  mixins: [pager],
  components: {
    formMode,
    sqlMode,
    dmlMode,
  },
  data() {
    return {
      active: 1,
      elSteps: [{title: '表名'}, {title: '基础属性及字段'}],
      tableNameForm: {
        tableLevel: '选项2',
        library: '选项2',
        subjectAttribution: '选项1',
        tableName: '表名称1',
        tableDescription: '表描述1',
      },
      options: [
        {
          value: '选项1',
          label: '表1',
        },
        {
          value: '选项2',
          label: '表2',
        },
        {
          value: '选项3',
          label: '表3',
        },
        {
          value: '选项4',
          label: '表4',
        },
        {
          value: '选项5',
          label: '表5',
        },
      ],
      options1: [
        {
          value: '选项1',
          label: '库1',
        },
        {
          value: '选项2',
          label: '库2',
        },
        {
          value: '选项3',
          label: '库3',
        },
        {
          value: '选项4',
          label: '库4',
        },
        {
          value: '选项5',
          label: '库5',
        },
      ],
      options2: [
        {
          value: 'zhinan',
          label: '板块1',
          children: [
            {
              value: 'shejiyuanze',
              label: '域1',
              children: [
                {
                  value: 'yizhi',
                  label: '属1',
                },
                {
                  value: 'fankui',
                  label: '属2',
                },
              ],
            },
            {
              value: 'daohang',
              label: '域2',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '属1',
                },
                {
                  value: 'dingbudaohang',
                  label: '属2',
                },
              ],
            },
          ],
        },
        {
          value: 'zujian',
          label: '板块2',
          children: [
            {
              value: 'basic',
              label: '域1',
              children: [
                {
                  value: 'layout',
                  label: '属1',
                },
                {
                  value: 'color',
                  label: '属2',
                },
              ],
            },
            {
              value: 'form',
              label: '域2',
              children: [
                {
                  value: 'radio',
                  label: '属1',
                },
                {
                  value: 'checkbox',
                  label: '属2',
                },
              ],
            },
          ],
        },
        {
          value: 'ziyuan',
          label: '板块3',
          children: [
            {
              value: 'axure',
              label: '属1',
            },
            {
              value: 'sketch',
              label: '属2',
            },
          ],
        },
      ],
      activeNames: '1',
      pattern: 'undefined',
      coreTable: false,
      formData2: {
        radio1: 3,
        radio2: 3,
      },
      showDMLSubmitPage: false,
      cascaderProps: {
        multiple: true,
      },
      showSQLEditor: true,
      dialogVisible: false,
      submitWorkOrderRemark: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    pre(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      if (this.pattern != 'undefined') {
        if (this.pattern == 'dml') {
          if (this.active == 3) {
            this.showDMLSubmitPage = false
            this.active = 2
          } else {
            this.elSteps = [{title: '表名'}, {title: '基础属性及字段'}]
            this.pattern = 'undefined'
          }
        } else {
          this.pattern = 'undefined'
        }
      } else {
        if (this.active-- < 1) this.active = 1
      }
    },
    next(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      if (this.active++ > 1) this.active = 1
    },
    nextDML(ev) {
      if ((ev.target.nodeName == 'SPAN') | (ev.target.nodeName == 'I')) {
        ev.target.parentNode.blur()
      } else {
        ev.target.blur()
      }
      this.showDMLSubmitPage = true
      this.active = 3
    },
    handleChange() {},
    showForm() {
      this.pattern = 'form'
    },
    showSQL() {
      this.pattern = 'sql'
    },
    showDML() {
      this.pattern = 'dml'
      this.elSteps = [
        {title: '表名'},
        {title: '构建DML'},
        {title: '基础属性及字段'},
      ]
    },
    layerLibrary() {},
    creatTableStructure() {
      this.showSQLEditor = false
    },
    returnSQLEditor() {
      this.showSQLEditor = true
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
.build-meter-work-order {
  .build-meter-work-order-content {
    .el-steps {
      justify-content: center;
    }
    .layer-library {
      color: #409eff;
      margin-left: 10px;
      cursor: pointer;
    }
    .form {
      width: 50%;
      margin: 10px 0px 0px 40px;
      .el-select,
      .el-cascader {
        width: 80%;
      }
    }
    .el-alert {
      margin-bottom: 18px;
    }
    .choose-mode {
      text-align: center;
    }
    .modes {
      text-align: center;
      margin-top: 18px;
      span {
        display: flex;
        justify-content: space-evenly;
        div {
          display: flex;
          flex-direction: column;
        }
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
