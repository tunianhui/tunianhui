<template>
  <el-dialog
    title="新建筛选条件"
    :visible="dialogTableVisible"
    custom-class="fact-filter-tutu"
    @close="close"
    width="40%"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="来源表">
        <el-select v-model="form.table" @change="changeSourceTable">
          <el-option
            v-for="item in tables"
            :key="item.cube_id"
            :label="item.cube_code"
            :value="item.cube_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置类型">
        <el-radio-group v-model="form.mode" @change="modeChange">
          <el-radio label="0">页面配置</el-radio>
          <el-radio label="1">sql配置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="筛选条件" v-if="form.mode === '0'">
        <div>
          <el-button type="primary" size="mini" class="mb-5" @click="addGroupRelation">新增</el-button>
        </div>
        <div class="rel-config">
          <div class="outer-layer" v-if="condition_info.length && condition_info.length > 1">
            <span @click="changeGroupRelation">{{form.group_relation === 'and' ? '且' : '或'}}</span>
          </div>
          <div class="inner-layer">
            <div v-for="(item, index) in condition_info" :key="item.group_id">
              <div class="inner-layer-item">
                <div class="item-rel-text" v-if="item.children && item.children.length && item.children.length > 1">
                  <span @click="changeInnerGroupRelation(item)">{{item.relation === 'and' ? '且' : '或'}}</span>
                </div>
                <div>
                  <div class="field-item">
                    <div v-for="(subitem, subIndex) in item.children" :key="subitem.index" class="mb-5">
                      <el-autocomplete
                        style="flex: 2"
                        v-model="subitem.col_key"
                        :fetch-suggestions="querySearch"
                        clearable
                        placeholder="请输入内容"
                      ></el-autocomplete>
                      <el-select v-model="subitem.expr_code" @change="val => changeOperatorList(val, item)" class="mr-5 ml-5" style="flex: 1">
                        <el-option
                          v-for="item in operatorList"
                          :key="item.operator_code"
                          :label="item.operator_name"
                          :value="item.operator_code"
                        ></el-option>
                      </el-select>
                      <el-input v-model="subitem.col_value" style="flex: 1"></el-input>
                      <i class="el-icon-delete ml-5" @click="deleteInnerItem(subitem, subIndex, item, index)"></i>
                    </div>
                    <div @click="addInnerGroupItem(item)" class="add-tutu">
                      <span class="ml-5">+</span>
                    </div>
                    <div class="delete-tutu" @click="deleteGroup(item, index)">
                      <i class="el-icon-delete ml-5"></i>
                    </div>
                  </div>
                </div>
              </div>
              <el-divider v-if="index !== condition_info.length - 1"></el-divider>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="筛选条件" v-else>
        <MonacoEditor
          ref="monacoEditor"
          style="height: 300px;"
          has-top-tools
          has-bottom-tools
          tip-content="仅可基于来源主表字段，设定所需事务记录数据的筛选条件"
          :code.sync="sql_context"
          :isSqlVerification="false"
          @change="changeSql"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryFactConditionTable,
  queryFactCondition,
  queryConditionTableElement,
  queryCondition,
  factConditionSave
} from '@/api/rd/fact-table'
export default {
  name: 'FactFilter',
  props: {
    data: Object
  },
  inject: ['tabStore'],
  data() {
    return {
      dialogTableVisible: true,
      form: {
        mode: '0',
        table: '',
        group_relation: 'and'
      },
      tables: [],
      tableColInfo: {},
      condition_info: [],
      sourceTableField: [],
      operatorList: [],
      sql_context: '',
      relationData: {}
    }
  },
  computed: {
  },
  async created() {
    this._queryCondition()
    await this._queryFactConditionTable()
    await this._queryFactCondition()
    await this._queryConditionTableElement()
    if (this.relationData[this.form.table] && this.relationData[this.form.table].child) {
      this.condition_info = this.relationData[this.form.table].child
    }
    if (this.relationData[this.form.table] && this.relationData[this.form.table].mode === '1') {
      this.sql_context = this.decrypt(this.relationData[this.form.table].sql_context)
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.sourceTableField
      // var results = queryString ? this.sourceTableField.filter(this.createFilter(queryString)) : restaurants
      // // 调用 callback 返回建议列表的数据
      cb(restaurants.map(d => {
        return {
          value: d.element_code
        }
      }))
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.element_code.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    close() {
      this.$emit('close')
    },
    async _queryFactConditionTable() {
      const params = {
        fact_logic_id: this.data.info.fact_logic_id
      }
      const res = await this.$simpleAsyncTo(queryFactConditionTable(params), '获取数据失败')
      if (res) {
        this.tables = res.data
      }
    },
    async changeSourceTable() {
      await this._queryConditionTableElement()
      const currentRelData = this.relationData[this.form.table]
      if (currentRelData) {
        this.form.mode = currentRelData.mode
        this.form.group_relation = currentRelData.group_relation
        if (currentRelData.mode === '0') {
          this.condition_info = currentRelData.child
        } else {
          this.sql_context = this.decrypt(currentRelData.sql_context)
        }
      } else {
        this.form.mode = '0'
        this.form.group_relation = 'and'
        this.relationData[this.form.table] = {
          child: [],
          cube_id: this.form.table,
          cube_code: (this.tables.find(d => d.cube_id === this.form.table) || {}).cube_code,
          mode: '0'
        }
        this.condition_info = []
      }
    },
    async _queryFactCondition() {
      const params = {
        fact_logic_id: this.data.info.fact_logic_id
      }
      const res = await this.$simpleAsyncTo(queryFactCondition(params), '获取数据失败')
      if (res) {
        if (res.data.length) {
          const data = res.data
          data.forEach(item => {
            if (item.mode === '0') {
              if (item.is_multiple_groups === '1') {
                const child = []
                for(let key in item.condition_info) {
                  const relationItem = (item.condition_info[key] || []).map((d, index) => {
                    return {
                      ...d,
                      index: index + new Date()
                    }
                  })
                  child.push({
                    group_id: key,
                    children: relationItem,
                    relation: (relationItem[0] || {}).relation
                  })
                }
                this.relationData[item.cube_id] = {
                  ...item,
                  child
                }
              } else {
                this.relationData[item.cube_id] = {
                  ...item,
                  child: [{
                    group_id: '1',
                    children: item.condition_info,
                    relation: item.condition_info[0].relation
                  }]
                }
              }
            } else {
              this.relationData[item.cube_id] = item
            }
          })
          for(let key in this.relationData) {
            if (this.relationData[key].child && this.relationData[key].child.length > 0) {
              this.form.table = this.relationData[key].cube_id
              this.form.mode = this.relationData[key].mode
              this.form.group_relation = this.relationData[key].group_relation || 'and'
            } else {
              this.form.table = this.relationData[key].cube_id
              this.form.mode = this.relationData[key].mode
            }
          }
        } else {
          this.form.mode = '0'
          this.form.table = (this.tables[0] || {}).cube_id
        }
      }
    },
    changeGroupRelation() {
      this.form.group_relation === 'and' ? this.form.group_relation = 'or' : this.form.group_relation = 'and'
      this.relationData[this.form.table].group_relation = this.form.group_relation
    },
    async _queryConditionTableElement() {
      const params = {
        cube_id: this.form.table
      }
      const res = await this.$simpleAsyncTo(queryConditionTableElement(params), '获取数据失败')
      if (res) {
        this.sourceTableField = res.data
      }
    },
    async _queryCondition() {
      const res = await this.$simpleAsyncTo(queryCondition(), '获取数据失败')
      if (res) {
        this.operatorList = res.data
      }
    },
    changeInnerGroupRelation(item) {
      item.relation === 'and' ? item.relation = 'or' : item.relation = 'and'
      item.children.forEach(d => {
        d.relation = item.relation
      })
    },
    addGroupRelation() {
      const group_id = this.condition_info.length + 1 + ''
      const data = {
        group_id,
        relation: 'and',
        children: [
          {
            relation: 'and',
            col_key: (this.sourceTableField[0] || {}).element_code,
            expr_code: '=',
            col_value: '',
            index: '0' + new Date()
          }
        ]
      }
      this.condition_info.push(data)
      if (!this.relationData[this.form.table]) {
        this.relationData[this.form.table] = {
          child: this.condition_info,
          cube_id: this.form.table,
          cube_code: (this.tables.find(d => d.cube_id === this.form.table) || {}).cube_code,
          mode: '0',
          group_relation: 'and'
        }
      } else {
        if (!this.relationData[this.form.table].group_relation) {
          this.relationData[this.form.table].group_relation = 'and'
        }
        this.relationData[this.form.table].child = this.condition_info
      }
    },
    changeSourceTableField(val, item) {},
    changeOperatorList(val, item) {
      // const data = (this.operatorList.find(d => d.operator_code === val) || {}).operator_name
      // item.expr_name = data
    },
    addInnerGroupItem(item) {
      const index = item.children.length + new Date()
      const data = {
        col_key: '',
        col_value: '',
        expr_code: '',
        index,
        relation: item.relation
      }
      item.children.push(data)
    },
    async ok() {
      let params = {}
      const table_col_info = []
      for(let key in this.relationData) {
        if (this.relationData[key].mode === '0') {
          const length = this.relationData[key].child.length,
            child = this.relationData[key].child,
            arr = []
          child.forEach(dd => {
            dd.children.forEach(d => {
              arr.push({
                ...d,
                group_id: dd.group_id
              })
            })
          })
          table_col_info.push({
            cube_id: key,
            cube_code: this.relationData[key].cube_code,
            mode: '0',
            is_multiple_groups: length <= 1 ? '0' : '1',
            condition_info: arr,
            group_relation: this.relationData[key].group_relation || ''
          })
        } else {
          table_col_info.push({
            cube_id: key,
            cube_code: this.relationData[key].cube_code,
            mode: '1',
            sql_context: this.encrypt(this.sql_context)
          })
        }
      }
      params = {
        fact_logic_id: this.data.info.fact_logic_id,
        table_col_info: JSON.stringify(table_col_info)
      }
      // if (this.form.mode === '0') {
      //   const length = this.condition_info.length
      //   const cube_code = (this.tables.find(d => d.cube_id === this.form.table)).cube_code
      //   const condition_info = []
      //   this.condition_info.forEach(d => {
      //     d.children.forEach(dd => {
      //       condition_info.push({
      //         ...dd,
      //         group_id: d.group_id
      //       })
      //     })
      //   })
      //   params = {
      //     fact_logic_id: this.data.info.fact_logic_id,
      //     table_col_info: JSON.stringify([
      //       {
      //         is_multiple_groups: length <= 1 ? '0' : '1',
      //         group_relation: this.form.group_relation,
      //         cube_id: this.form.table,
      //         cube_code,
      //         mode: this.form.mode,
      //         condition_info
      //       }
      //     ])
      //   }
      // } else {
      //   const cube_code = (this.tables.find(d => d.cube_id === this.form.table)).cube_code
      //   params = {
      //     fact_logic_id: this.data.info.fact_logic_id,
      //     table_col_info: JSON.stringify([
      //       {
      //         cube_id: this.form.table,
      //         cube_code,
      //         mode: this.form.mode,
      //         sql_context: this.encrypt(this.sql_context)
      //       }
      //     ])
      //   }
      // }
      const res = await this.$simpleAsyncTo(factConditionSave(params), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        if (this.data.info.status !== '5') {
          this.$root.eventEmitter.emit('refresh')
        }
        this.$root.eventEmitter.emit(`refreshGetData${this.tabStore.states.active.name}`)
        this.close()
      }
    },
    deleteGroup(item, index) {
      this.condition_info.splice(index, 1)
    },
    deleteInnerItem(subitem, subIndex, item, index) {
      item.children.splice(subIndex, 1)
      if (item.children.length === 0) {
        this.condition_info.splice(index, 1)
      }
    },
    modeChange(val) {
      if (val === '0') {
        // this.relationData[this.form.table].child = []
        // this.condition_info = this.relationData[this.form.table].child
        this.relationData[this.form.table] = {
          child: [],
          cube_id: this.form.table,
          cube_code: (this.tables.find(d => d.cube_id === this.form.table) || {}).cube_code,
          mode: '0'
        }
        this.condition_info = this.relationData[this.form.table].child
      } else {
        // this.relationData[this.form.table].sql_context = ''
        // this.relationData[this.form.table].cube_id = 
        this.relationData[this.form.table] = {
          sql_context: '',
          cube_id: this.form.table,
          cube_code: (this.tables.find(d => d.cube_id === this.form.table) || {}).cube_code,
          mode: '1'
        }
        this.sql_context = this.relationData[this.form.table].sql_context
      }
      // this.condition_info = []
    },
    changeSql() {
      this.relationData[this.form.table].sql_context = this.encrypt(this.sql_context)
    }
  }
}
</script>

<style lang="scss">
.fact-filter-tutu {
  .el-dialog__body {
    max-height: 550px;
    overflow: auto;
  }
  .rel-config {
    display: flex;
  }
  .outer-layer {
    border: 1px solid #ccc;
    position: relative;
    margin-right: 25px;
    span {
      position: absolute;
      top: 50%;
      width: 20px;
      height: 20px;
      right: 50%;
      text-align: center;
      line-height: 20px;
      transform: translate(10px, -10px);
      background: #f9f9f9;
      cursor: pointer;
    }
  }
  .inner-layer {
    .inner-layer-item {
      display: flex;
      .item-rel-text {
        border: 1px solid #ccc;
        position: relative;
        margin-right: 15px;
        span {
          position: absolute;
          top: 50%;
          width: 20px;
          height: 20px;
          right: 50%;
          text-align: center;
          line-height: 20px;
          transform: translate(10px, -10px);
          background: #f9f9f9;
          cursor: pointer;
        }
      }
    }
    .field-item {
      position: relative;
      // padding-right: 50px;
      padding: 5px 50px 0px 5px;
      border: 1px dashed transparent;
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        i {
          cursor: pointer;
        }
      }
      .add-tutu {
        position: absolute;
        top: -22px;
        right: 10px;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        background-color: $tabTitleColor;
        color: #fff;
      }
      .delete-tutu {
        position: absolute;
        top: 50%;
        right: -7px;
        cursor: pointer;
        transform: translate(0, -10px);
        color: $tabTitleColor;
        background-color: #f9f9f9;
        display: none;
      }
      &:hover {
        border-color: $tabTitleColor;
        .delete-tutu {
          display: block;
        }
      }
    }
  }
}
</style>
