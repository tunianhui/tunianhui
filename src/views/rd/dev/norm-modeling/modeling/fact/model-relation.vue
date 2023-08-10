<template>
  <SimpleEditDialog
    class="model-relation"
    :title="title"
    :visible="isVisible"
    :parentClass="parentClass"
    @close="close"
    @confirm="confirm"
    width="60%"
    v-loading="!!loading"
  >
    <div class="model-relation-head" v-show="visibleRadio">
      <span class="label">设置字段类型：</span>
      <el-radio-group v-model="radio">
        <el-radio v-for="item in radioList" :key="item.value" :label="item.value">{{item.name}}</el-radio>
      </el-radio-group>
    </div>
    <el-form
      ref="form"
      :model="filter"
      :rules="rules"
      label-position="right"
      label-width="120px"
      label-suffix="："
      v-show="['10', '3'].includes(radio)"
    >
      <h4>关联维度信息</h4>
      <el-form-item label="关联维度信息" prop="info">
        <el-cascader
          v-model="filter.info"
          filterable
          clearable
          :options="cascaderList"
          placeholder="请输入关键字"
          @change="changeInfo"
        ></el-cascader>
      </el-form-item>
      <div class="mr-item">
        <p>
          <span class="label">维度类型：</span>
          <span class="value">{{filter.dim_type_label}}</span>
        </p>
        <p>
          <span class="label">主键及主键计算逻辑：</span>
          <span class="value">
            {{filter.pk_code}}
            <el-popover placement="top" width="320" trigger="click" popper-class="dark-popper">
              <MonacoEditor
                ref="monacoEditor"
                style="height: 120px;"
                :code.sync="filter.sql_content"
              />
              <el-link type="info" slot="reference">
                <i class="iconfont icon-yewuliu"></i>
              </el-link>
            </el-popover>
          </span>
        </p>
      </div>
      <h4>编辑关联逻辑</h4>
      <div :class="['flex-layout', {'valid-error': !field_valid}]">
        <div class="flex-1">
          <p>事实表需关联字段</p>
          <el-cascader
            v-model="filter.field"
            filterable
            clearable
            :options="fieldList"
            @change="changeField"
            v-if="!data.element_id"
            placeholder="请输入关键字"
          ></el-cascader>
          <p v-else>属性/{{filter.element_code}}</p>
        </div>
        <div class="pl-20 pr-20">
          <el-tag size="medium" type="primary">
            <i class="iconfont icon-dongzuoku"></i>&nbsp;&nbsp;关联
          </el-tag>
        </div>
        <div class="flex-1">
          <p>已选关联维度</p>
          <p>{{filter.dim_code_field}}</p>
        </div>
      </div>
      <p class="valid-error-p" v-if="!field_valid">必填项</p>
      <h4>
        编辑维度角色
        <el-tooltip content="维度别名作用：多次引用同一维度时不可重名定义，起到角色扮演效果" placement="right">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </h4>
      <el-form-item label="角色英文名" prop="name_en">
        <el-input style="width: 200px;" v-model="filter.name_en" maxlength="32" show-word-limit>
          <template slot="prepend">dim_</template>
        </el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="rel_dim_name">
        <el-input
          style="width: 200px;"
          v-model="filter.rel_dim_name"
          maxlength="32"
          show-word-limit
        ></el-input>
      </el-form-item>
      <h4>
        默认值设定
        <el-tooltip content="未关联该维度时，对关联字段的补值" placement="right">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </h4>
      <el-form-item label="默认值" prop="default">
        <el-input style="width: 200px;" v-model="filter.default"></el-input>
      </el-form-item>
    </el-form>
    <p class="needless-edit" v-show="!['10', '3'].includes(radio)">非关联维度的字段此处不需要编辑</p>
  </SimpleEditDialog>
</template>

<script>
import {
  getAllDimensionInfo,
  getElementByDimId,
  getRelDimInfo
} from '@/api/rd/dimension-table'
import {dimLogicRelationTypes, factLogicRelationTypes} from '@/config/rd-config'
import {mapGetters} from 'vuex'
export default {
  name: 'ModelRelationFact',
  props: {
    data: Object,
    visible: Boolean,
    type: String,
    title: String,
    relationFieldList: Array,
    parentClass: String
  },
  inject: ['tabStore'],
  data() {
    return {
      isVisible: true,
      radio: 'relation',
      visibleRadio: false,
      filter: {
        info: [],
        field: [],
        element_code: '',
        pk_code: '',
        dim_code_field: '',
        dim_type_label: '',
        name_en: '',
        rel_dim_type: '',
        rel_dim_name: '',
        sql_content: '',
        default: '-110'
      },
      rules: {
        info: {required: true, message: '请选择关联维度信息'},
        name_en: [
          {required: true, message: '请输入角色英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        rel_dim_name: {required: true, message: '请输入角色名称'},
        default: {required: true, message: '请输入默认值'}
      },
      field_valid: true,
      cascaderList: [],
      dimRadioList: dimLogicRelationTypes,
      factRadioList: factLogicRelationTypes,
      fieldList: [],
      radioList: [],
      loading: 0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
        if (val) {
          this.getCascaderList()
          this.processFieldList(this.relationFieldList)
          // if (this.relationFieldList) {
          //   this.processFieldList(this.relationFieldList)
          // } else {
          //   // this.getFieldList()
          // }
        }
      }
    },
    data(val) {
      this.radio = this.type === 'dimension' ? '10' : '3'
      this.visibleRadio = false
      if (val.element_id) {
        this.visibleRadio = true
        this.radio = val.relation_type
        if (['10', '3'].includes(val.relation_type)) {
          this.initFilter()
        } else {
          Object.assign(this.filter, val)
          this.filter.field = ['属性', this.filter.element_id]
        }
      }
    },
    type: {
      immediate: true,
      handler(val) {
        this.radioList =
          val === 'dimension' ? this.dimRadioList : this.factRadioList
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    close() {
      this.$emit('close', false)
      this.filter.field = []
      this.filter.dim_code_field = ''
      this.filter.dim_type_label = ''
      this.filter.pk_code = ''
      this.filter.sql_content = ''
      this.filter.element_code = ''
      this.filter.element_id = ''
      this.filter.logic_id = ''
      this.field_valid = true
      this.fieldList = []
      this.$refs.form.resetFields()
    },
    initFilter() {
      if (this.data.element_id) {
        if (!this.data.pk_code) {
          this.assignByKey(this.cascaderList, 'rel_dim_id', 'info')
          // this.assignByKey(this.fieldList, 'element_id', 'field')
          this.filter.element_id = this.data.element_id
          this.filter.element_code = this.data.element_code

          this.filter.field = ['属性', this.filter.element_id]
        } else {
          Object.assign(this.filter, this.data)
        }
      }
    },
    confirm() {
      const flag = ['10', '3'].includes(this.radio),
        radioItem = this.radioList.find(o => o.value === this.radio),
        obj = {
          group_type: radioItem.type,
          group_name: radioItem.name,
          relation_type: this.radio,
          relation_id: flag ? this.filter.logic_id : 'no_relation'
        }

      if (flag) {
        this.$refs.form.validate(async valid => {
          if (!this.filter.field.length) {
            this.field_valid = false
          }
          if (valid && this.field_valid) {
            // this.loading++
            this.globalLoading()
            const res = await this.$simpleAsyncTo(
              getRelDimInfo({
                dim_id: this.filter.rel_dim_id
              }),
              '获取关联维度数据失败'
            )
            this.filter.rel_dim_table = `dim_${this.filter.name_en}`
            this.$emit('confirm', {
              ...this.filter,
              ...obj,
              ...res.data
            })
            this.close()
            // this.loading--
            this.globalLoading().close()
          }
        })
      } else {
        const data = {
          ...this.filter,
          ...obj,
          rel_dim_id: '',
          rel_dim_name: '',
          rel_dim_table: '',
          rel_dim_type: '',
          default: ''
        }
        this.$emit('confirm', data)
        this.close()
      }
    },
    assignByKey(data, key, filterKey) {
      if (!this.data[key]) return
      let flag = false
      data.some(item => {
        item.children &&
          item.children.some(c => {
            if (this.data[key] === c[key]) {
              Object.assign(this.filter, c)
              this.filter[filterKey] = [item.value, c.value]
              flag = true
              delete this.filter.label
              delete this.filter.value
              return true
            }
          })
        return flag
      })
    },
    changeInfo(val) {
      if (val.length) {
        this.processFilter(this.cascaderList, val)
        this.type === 'dimension' && this.getFieldList(this.filter.rel_dim_id)
      } else {
        this.filter.pk_code = ''
        this.filter.dim_code_field = ''
        this.filter.dim_type_label = ''
        this.filter.name_en = ''
        this.filter.rel_dim_type = ''
        this.filter.rel_dim_name = ''
        this.filter.sql_content = ''
      }
    },
    changeField(val) {
      if (val.length) {
        this.field_valid = true
        this.processFilter(this.fieldList, val)
      } else {
        this.field_valid = false
      }
    },
    processFilter(data, value) {
      const [parent, child] = value,
        pObj = data.find(item => item.value === parent)
      if (pObj && pObj.children) {
        const cObj = pObj.children.find(item => item.value === child)
        Object.assign(this.filter, cObj)
        delete this.filter.label
        delete this.filter.value
      }
    },
    async getCascaderList() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getAllDimensionInfo({project_id: this.project.project_id}),
        '获取维度信息列表失败'
      )
      if (res) {
        this.cascaderList = []
        res.data.forEach(item => {
          const d = this.cascaderList.find(
              d => d.value === item.data_field_name
            ),
            temp = {
              label: `${item.dim_code} ${item.dim_name}`,
              value: item.dim_id,
              name_en: (item.dim_code.split('dim_') || [])[1],
              dim_code_field: item.dim_code + '.' + item.pk_code,
              dim_type_label: this.getDicsValue('dim_type', item.dim_type),
              rel_dim_table: item.dim_code,
              rel_dim_name: item.dim_name,
              rel_dim_type: item.dim_type,
              rel_dim_id: item.dim_id,
              pk_code: item.pk_code,
              sql_content: item.sql_content
            }
          if (d) {
            d.children.push(temp)
          } else {
            this.cascaderList.push({
              label: item.data_field_name,
              value: item.data_field_name,
              children: [temp]
            })
          }
        })
        this.assignByKey(this.cascaderList, 'rel_dim_id', 'info')
      }
      this.loading--
    },
    processFieldList(data) {
      const obj = {
        label: '属性',
        value: '属性',
        children: []
      }
      this.fieldList = [obj]
      data.forEach(item => {
        obj.children.push({
          label: item.element_code,
          value: item.element_id,
          ...item
        })
      })
      this.assignByKey(this.fieldList, 'element_id', 'field')
    },
    async getFieldList(id) {
      this.loading++
      const res = await this.$simpleAsyncTo(
        getElementByDimId({
          // dim_id: this.tabStore.states && this.tabStore.states.activeValue
          dim_id: id
        }),
        '获取维度信息列表失败'
      )
      if (res) {
        // this.processFieldList(res.data)
        const obj = res.data.find(item => item.relation_type === '0')
        this.filter.logic_id = obj.logic_id
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.model-relation {
  .el-dialog__body {
    padding-top: 10px;
  }
  .label {
    display: inline-block;
    min-width: 120px;
    text-align: right;
    padding-right: 12px;
    color: $grey4;
    font-size: 12px;
  }
  .el-form-item {
    .el-cascader {
      width: 400px;
    }
  }
  .el-form-item__label {
    color: $grey4;
    font-size: 12px;
  }
  .mr-item {
    display: flex;
    margin-bottom: 20px;

    p {
      flex: 1;
    }
  }
  h4 {
    color: $grey2;
    font-size: 14px;
    margin-bottom: 15px;
  }
  .model-relation-head {
    margin-bottom: 10px;
  }
  .flex-layout {
    padding: 10px 15px;
    background: $grey10;
    margin-bottom: 20px;
    align-items: center;
    &.valid-error {
      border: 1px solid $error;
    }
    p {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: $grey4;
    }
    .el-cascader {
      width: 100%;
      .el-input__inner {
        border: 0;
      }
    }
  }
  .valid-error-p {
    color: $error;
    margin-top: -20px;
    font-size: 12px;
    margin-bottom: 15px;
  }
  .needless-edit {
    height: 460px;
    line-height: 460px;
    text-align: center;
  }
}
</style>
