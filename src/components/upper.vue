<template>
  <section class="upper-rely">
    <div class="text-right">
      <el-popover placement="right" width="400" v-model="isShow" popper-class="rely-popper">
        <el-form :model="form" :rules="newForm" ref="form" label-width="0">
          <el-form-item class="mr-10">
            <div style="color: #aaa">新建上游依赖</div>
          </el-form-item>
          <el-form-item prop="value">
            <el-select v-model="form.value" placeholder="请输入关键字搜索节点" style="width:100%;" multiple filterable>
              <el-option v-for="item in data.upstreamRelyData" :key="item.cube_id" :label="item.cube_code" :value="item.cube_id" class="ml-10">
                <OverflowTooltip style="width:80px">
                  {{ item.cube_code }}
                </OverflowTooltip>
                <OverflowTooltip class="fr mr-20" style="color: #8492a6;font-size: 12px">
                  {{ item.cube_id }}
                </OverflowTooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="text-right">
            <el-button class="mr-10" @click="close">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定新增</el-button>
          </el-form-item>
        </el-form>
        <el-button slot="reference" v-if="type==='upper'" class="mb-10 new-create">新建上游依赖
        </el-button>
      </el-popover>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="cube_name" label="输出名称" width="180">
        <template slot-scope="scope">
          <OverflowTooltip class="width" @click.native="handleClickEdit(scope.row, scope.$index)" v-if="scope.$index!==currentIndex">
            {{scope.row.cube_name}}
          </OverflowTooltip>
          <el-input v-else :ref="`outputName-${scope.$index}`" v-model="scope.row.cube_name" @blur="blurHandle">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="cube_code" label="节点名" width="180">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.cube_code}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cube_id" label="节点ID（实例ID）">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.cube_id}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="oper_user" label="负责人">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.oper_user}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row, scope.$index)" icon="el-icon-delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'UpperRely',
  components: {
    OverflowTooltip
  },
  props: {
    data: {
      type: [Object, Array]
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tableData: [],
      form: {
        value: []
      },
      newForm: {},
      isShow: false,
      currentIndex: null,
      outputName: ''
    }
  },
  created () {
    if (this.type === 'upper') {
      this.tableData = this.data.currUpstreamRelyData
    } else {
      this.tableData = [this.data.currNodeData || {}]
    }
  },
  methods: {
    deleteHandle (row, index) {
      this.tableData.splice(index, 1)
    },
    onSubmit () {
      if (this.form.value.length) {
        this.form.value.forEach(e => {
          this.data.upstreamRelyData.forEach(i => {
            if (e === i.cube_id) {
              let arr = this.tableData.some(o => {
                return o.cube_id === e
              })
              if (!arr) {
                this.tableData.push(i)
              }
            }
          })
        })
        // this.ruleForm.tableData.push.apply(this.ruleForm.tableData, data)
        this.isShow = false
        // this.$refs.form.resetFields()
      }
    },
    getData (type) {
      let data = null
      if (type === 'upper') {
        data = { upstreamRelyData: this.tableData || [] }
      } else {
        data = { currNodeData: this.tableData || [] }
      }
      return data
    },
    handleClickEdit (row, index) {
      this.currentIndex = index
      this.$nextTick(e => {
        // this.outputName = row.cube_name
        this.$refs[`outputName-${index}`].focus()
      })
    },
    blurHandle () {
      this.currentIndex = null
    },
    close () {
      this.isShow = false
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
.upper-rely {
  .new-create {
    display: inline-flex;
    height: 28px;
    align-items: center;
    justify-content: center;
    background: $grey10;
    border: 1px solid $tabTitleColor;
    border-radius: 0;
    color: $tabTitleColor;
    font-size: 12px;
    padding: 0 10px;
    cursor: pointer;
  }
  .width {
    width: calc(100% - 10px);
  }
}
</style>
