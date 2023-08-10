<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    :confirmText="confirmText"
    :disabled="disabled"
    :footer="false"
  >
    <div class="step-wrapper">
      <div class="steps-title">
        <span>
          <i :class="['iconfont icon-1', completed ? 'active' : '']"></i>
          <span>注册ID关系</span>
        </span>
        <span></span>
        <span>
          <i class="iconfont icon-2"></i>
          <span>配置基准ID生成顺序</span>
        </span>
      </div>
    </div>
    <el-form
      v-show="completed == 0"
      ref="form"
      label-position="right"
      label-width="120px"
      :model="filter"
      :rules="rules"
      label-suffix="："
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="主体名称" prop="subject_name">
            <el-input
              v-model="filter.subject_name"
              maxlength="32"
              show-word-limit
              placeholder="请输入主体名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主体英文名" prop="subject_code">
            <el-input
              v-model="filter.subject_code"
              show-word-limit
              :disabled="title.indexOf('编辑') > -1"
              placeholder="请输入主体英文名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="来源物理表" prop="source_table">
            <el-select v-model="filter.cube_id" placeholder="请选择来源物理表" @change="changeSourceTabel" filterable>
              <el-option
                v-for="item in sourceTableOptions"
                :key="item.cube_code"
                :label="item.source_table"
                :value="item.cube_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="filter_content">
            <el-input type="textarea" v-model="filter.filter_content" resize="none" :rows="4" placeholder="请输入过滤条件"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联逻辑" prop="">
            <el-row>
              <el-col :span="9">实体ID</el-col>
              <el-col :span="2">
                <span style="opacity:0">"</span>
              </el-col>
              <el-col :span="9">来源表字段</el-col>
              <el-col :span="4">
                <span style="opacity:0">"</span>
              </el-col>
            </el-row>
            <el-row v-for="(item,index) in mainIdRel" :key="item.uuid" class="mb-5">
              <el-col :span="9">
                <el-select
                  v-model="item.entity_id"
                  placeholder="请选择实体ID"
                  @visible-change="val => visibleChangeEntityId(val, mainIdRel)"
                  clearable
                >
                  <el-option
                    v-for="val in entityIDList"
                    :key="val.entity_id"
                    :label="val.entity_code"
                    :value="val.entity_id"
                    :disabled="val.disabled"
                    >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center;">=</el-col>
              <el-col :span="9">
                <el-select
                  v-model="item.source_column"
                  placeholder="请选择来源表字段"
                  @visible-change="val => visibleChangeSouceColumn(val, mainIdRel)"
                  clearable
                >
                  <el-option
                    v-for="val in columnObj.element_data"
                    :key="val.element_code"
                    :label="val.element_code"
                    :value="val.element_code"
                    :disabled="val.disabled"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <i class="el-icon-plus ml-5 pointer" v-if="index === mainIdRel.length - 1" @click="addEntityId"></i>
                <i class="el-icon-delete pointer ml-5 mr-5" @click="delEntityId(index)"></i>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">时间区分字段</el-col>
              <el-col :span="2">
                <span style="opacity:0">"</span>
              </el-col>
              <el-col :span="9">分区字段格式</el-col>
              <el-col :span="4">
                <span style="opacity:0">"</span>
              </el-col>
            </el-row>
            <el-row v-for="(item,index) in partitionData" :key="item.uuid" class="mb-5">
              <el-col :span="9">
                <el-select v-model="item.source_column" placeholder="请选择时间分区字段">
                  <el-option
                    v-for="item in columnObj.partition_data"
                    :key="item.partition_code"
                    :label="item.partition_code"
                    :value="item.partition_code">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center;">=</el-col>
              <el-col :span="9">
                <el-input v-model="item.part_format" placeholder="分区字段格式"></el-input>
              </el-col>
              <el-col :span="4">
                <i class="el-icon-plus ml-5 pointer" v-if="index === partitionData.length - 1" @click="addPartitionData"></i>
                <i class="el-icon-delete pointer ml-5 mr-5" @click="delPartitionData(index)"></i>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-show="completed == 1" class="next-2">
      <h4>基准ID将按照以下配置的参考关系依次生成</h4>
      <div class="tip-warning">
        <i class="el-icon-warning-outline"></i>
        <div>温馨提示：生成基准ID的顺序，更改需谨慎，更改后系统重新生成One ID，将会影响之前One ID，请知悉</div>
      </div>
      <div class="rel-index">
        <ul class="wrapper">
          <li v-for="(item, index) in mainIdRelNew" :key="item.uuid">
            <div class="xingxing">*</div>
            <div class="label">参考关系顺序：</div>
            <div class="guanxi">
              <span><OverflowTooltip>{{item.cusTitle}}</OverflowTooltip></span>
              <span class="arrow">
              </span>
              <span><OverflowTooltip>{{item.source_column}}</OverflowTooltip></span>
            </div>
            <div class="action">
              <span class="down" @click="downIndex(item, index, mainIdRelNew)">
                <i class="el-icon-arrow-down"></i>
              </span>
              <span class="up">
                <i class="el-icon-arrow-up" @click="upIndex(item, index, mainIdRelNew)"></i>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer"  class="my-btn">
      <el-button type="default" @click="close">取 消</el-button>
      <el-button type="primary" class="primary" v-if="completed == 0" @click="nextStep">关联并下一步</el-button>
      <el-button type="primary" class="primary" v-if="completed == 1" @click="upnextStep">上一步</el-button>
      <el-button type="primary" class="primary" v-if="completed == 1" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import { getSourceTableList, getQueryColumnList, getQueryIdInfo, savemain, queryById, editMain } from '@/api/rd/exreact/main-id.js'
import { uuid } from '@/libs/util'
import { mapGetters } from 'vuex'
export default {
  name: 'MainEdit',
  mixins: [editDialog],
  computed: {
    ...mapGetters(['project']),
  },
  data() {
    return {
      confirmText: '确定',
      disabled: false,
      completed: 0,
      sourceTableOptions: [],
      columnObj: {},
      entityIDList: [],
      filter: {
        subject_name: '',
        subject_code: '',
        cube_id: '',
        filter_content: ''
      },
      mainIdRel: [
        {
          id: uuid(16),
          entity_id: '',
          source_column: '',
          index_num: 0
        }
      ],
      partitionData: [
        {
          id: uuid(16),
          source_column: '',
          part_format: ''
        }
      ],
      mainIdRelNew: [],
      rules: {
        subject_name: [
          {required: true, message: '请输入主体名称'}
        ],
        subject_code: [
          {required: true, message: '请输入主体英文名'}
        ],
        cube_id: [
          {required: true, message: '请选择来源物理表'}
        ]
      },
      editInfo: {},
      btnLoading: false
    }
  },
  async created() {
    this._getSourceTableList()
    if (this.title.indexOf('编辑') > -1) {
      await this._getMainInfo(this.data.subject_id)
      this.filter.subject_code = this.editInfo.base_info.subject_code
      this.filter.subject_name = this.editInfo.base_info.subject_name
      this.filter.cube_id = this.editInfo.base_info.cube_id
      this.filter.filter_content = this.editInfo.base_info.filter_content
      this.changeSourceTabel(this.filter.cube_id)
      this.mainIdRel = this.editInfo.column_info.map(d => {
        return {
          uuid: uuid(16),
          entity_id: d.entity_id,
          source_column: d.source_column,
          index_num: d.index_num
        }
      })
      this.partitionData = this.editInfo.part_info.map(d => {
        return {
          uuid: uuid(16),
          source_column: d.source_column,
          part_format: d.part_format
        }
      })
    }
  },
  methods: {
    confirm() {},
    async _getSourceTableList() {
      const res = await this.$simpleAsyncTo(getSourceTableList(), '获取来源物理表数据失败')
      if (res) {
        this.sourceTableOptions = res.data
      }
    },
    async _getQueryColumnList(cube_id) {
      const res = await this.$simpleAsyncTo(getQueryColumnList({cube_id}), '获取来源物理表字段/分区数据失败')
      if (res) {
        this.columnObj = res.data
      }
    },
    async _getQueryIdInfo(cube_id) {
      const res = await this.$simpleAsyncTo(getQueryIdInfo({cube_id}), '获取实体ID数据失败')
      if (res) {
        this.entityIDList = res.data
      }
    },
    changeSourceTabel(val) {
      this._getQueryColumnList(val)
      this._getQueryIdInfo(val)
    },
    addEntityId() {
      const data = JSON.parse(JSON.stringify(this.mainIdRel))
      this.mainIdRel.push({
        uuid: uuid(16),
        entity_id: '',
        source_column: '',
        index_num: data.length
      })
    },
    delEntityId(index) {
      this.mainIdRel.splice(index, 1)
      this.mainIdRel = this.mainIdRel.map((d, i) => {
        return {
          ...d,
          index_num: i
        }
      })
    },
    addPartitionData() {
      this.partitionData.push({
        uuid: uuid(16),
        part_format: '',
        source_column: ''
      })
    },
    delPartitionData(index) {
      this.partitionData.splice(index, 1)
    },
    nextStep() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const flag = this.mainIdRel.some(d => d.entity_id === '' || d.source_column === '')
          if (flag) return this.$message({
            type: 'error',
            message: '关联逻辑不能为空'
          })
          const flag1 = this.partitionData.some(d => d.source_column === '' || d.part_format === '')
          if (flag1) return this.$message({
            type: 'error',
            message: '关联逻辑不能为空'
          })
          this.completed = 1
          this.mainIdRelNew = this.mainIdRel.map((d) => {
            const data = this.entityIDList.find(val => val.entity_id === d.entity_id)
            return {
              ...d,
              index_num: d.index_num,
              entity_code: data.entity_code,
              cusTitle: '基准'
            }
          })
          console.log(this.mainIdRelNew)
        }
      })
      
    },
    downIndex(item, index, mainIdRelNew) {
      if (index === mainIdRelNew.length - 1) return
      if (mainIdRelNew.length == 1) return
      const data = mainIdRelNew[index + 1]
      mainIdRelNew.splice(index + 1, 1, {...item, index_num: index + 1})
      mainIdRelNew.splice(index , 1, {...data, index_num: index})
    },
    upIndex(item, index, mainIdRelNew) {
      if (index === 0) return 0
      if (mainIdRelNew.length == 1) return
      const data = mainIdRelNew[index - 1]
      mainIdRelNew.splice(index - 1, 1, {...item, index_num: index - 1})
      mainIdRelNew.splice(index , 1, {...data, index_num: index})
    },
    upnextStep() {
      this.completed = 0
      this.mainIdRelNew = []
    },
    async save() {
      this.btnLoading = true
      const data = this.sourceTableOptions.find(d =>  this.filter.cube_id === d.cube_id)
      const params = {
        subject_code: this.filter.subject_code,
        subject_name: this.filter.subject_name,
        filter_content: this.filter.filter_content,
        project_id: this.project.project_id,
        project_code: this.project.project_code,
        project_name: this.project.project_name,
        business_field_id: this.project.business_field_id,
        business_field_name: this.project.business_field_name
      }
      
      if (data) {
        params.cube_code = data.cube_code,
        params.cube_id = data.cube_id
        params.source_project_id = data.source_project_id
        params.source_project_code = data.source_project_code
      }
      const arr1 = this.mainIdRelNew.map(d => {
        const currentData = this.entityIDList.find(val => val.entity_id === d.entity_id)
        return {
          entity_id: d.entity_id,
          entity_code: (currentData || {}).entity_code,
          index_num: d.index_num,
          source_column: d.source_column,
          col_tag: 'column',
          part_format: ''
        }
      })
      const arr2 = this.partitionData.map(d => {
        return {
          entity_id: '',
          entity_code: '',
          index_num: '',
          source_column: d.source_column,
          col_tag: 'partition',
          part_format: d.part_format
        }
      })
      params.rel_info = JSON.stringify([...arr1, ...arr2])
      let fn = null, text = ''
      if (this.title.indexOf('新建') > -1) {
        fn = savemain
        text = '新建'
      } else {
        fn = editMain
        text = '编辑'
        params.subject_id = this.data.subject_id
      }
      const res = await this.$simpleAsyncTo(fn(params), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: `${text}成功`
        })
        this.$root.eventEmitter.emit('refresh')
        this.close()
      }
      this.btnLoading = false
    },
    async _getMainInfo(id) {
      const res = await this.$simpleAsyncTo(queryById({subject_id: id}), '获取数据失败')
      if (res) {
        this.editInfo = res.data
      }
    },
    visibleChangeEntityId(val, mainIdRel) {
      if (val) {
        this.entityIDList.forEach(item => {
          const data = mainIdRel.find(d => d.entity_id === item.entity_id)
          if (data) {
            this.$set(item, 'disabled', true)
          } else {
            this.$set(item, 'disabled', false)
          }
        })
      }
    },
    visibleChangeSouceColumn(val, mainIdRel) {
      if (val) {
        (this.columnObj.element_data || []).forEach(item => {
          const data = mainIdRel.find(d => d.source_column === item.element_code)
          if (data) {
            this.$set(item, 'disabled', true)
          } else {
            this.$set(item, 'disabled', false)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  .steps-title {
    // width: 100%;
    flex: 1;
    height: 40px;
    background: $grey9;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    > span:first-child,
    > span:last-child {
      i:first-child {
        font-size: 22px;
        color: $user2;
        vertical-align: sub;
        &.active {
          color: $success;
        }
      }
      i:last-child {
        color: $grey5;
      }
      span {
        padding: 0 5px;
      }
    }
    > span:nth-child(2) {
      display: inline-block;
      width: 20%;
      border-bottom: 1px dashed $grey4;
      margin: 0 5px 3px 5px;
    }
  }
}
.pointer {
  cursor: pointer;
}
.next-2 {
  padding: 20px 40px;
  h4 {
    font-weight: 400;
    font-size: 16px;
  }
  .tip-warning {
    margin-top: 10px;
    border: 1px solid #F56C6C;
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center;
    padding: 10px;
    background: rgba($color: #F56C6C, $alpha: 0.08);
    > i {
      width: 100px;
      font-size: 30px;
      margin-left: 10px;
      color: #F56C6C;
    }
    > div {
      color: rgba($color: #000, $alpha: 0.5);
      user-select: none;
    }
  }
  .rel-index {
    margin-top: 15px;
    > ul {
      li {
        height: 35px;
        line-height: 35px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .xingxing {
          color: #F56C6C;
          width: 10px;
          line-height: 35px;
        }
        .label {
          font-size: 14px;
          width: 100px;
        }
        .guanxi {
          display: flex;
          align-items: center;
          height: 35px;
          flex: 1;
          background: rgba($color: #000, $alpha: 0.03);
          padding: 0 15px;
          >span:first-child, >span:last-child {
            width: 80px;
          }
        }
        .action {
          width: 100px;
        }
        .arrow {
          width: 35px;
          height: 4px;
          background: rgba($color: #000, $alpha: 0.1);
          margin: 0 20px;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            left: -16px;
            top: -6px;
            border-bottom: 8px solid transparent;
            border-top: 8px solid transparent;
            border-right: 8px solid rgba($color: #000, $alpha: 0.1);
            border-left: 8px solid transparent;
          }
          &::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            right: -16px;
            top: -6px;
            border-bottom: 8px solid transparent;
            border-top: 8px solid transparent;
            border-right: 8px solid transparent;
            border-left: 8px solid rgba($color: #000, $alpha: 0.1);
          }
        }
        .down,.up {
          width: 35px;
          height: 35px;
          text-align: center;
          color: $tabTitleColor;
          border: 1px solid rgba($color: #000, $alpha: 0.1);
          display: inline-block;
          margin: 0 5px;
          cursor: pointer;
          i {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>