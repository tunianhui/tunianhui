<template>
  <SimpleEditDialog :title="title" :visible="isVisible" @close="close" @confirm="confirm" class="fact-edit" v-loading="!!loading">
    <el-form ref="formEdit" label-width="120px" :model="filter" :rules="rules" label-suffix="：">
      <el-row>
        <el-col :md="9" :sm="24" :xs="24">
          <el-form-item label="业务板块">
            <div>{{filter.business_field_name}}</div>
          </el-form-item>
        </el-col>
        <el-col :md="9" :sm="24" :xs="24">
          <el-form-item label="所属项目">
            <div>{{filter.project_name}}</div>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="24" :xs="24">
          <el-form-item label="项目空间类型">
            <div>{{filter.space_type_name}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据域" prop="data_field_id">
            <el-select v-model="filter.data_field_id" placeholder="请选择" style="width:calc(50%-65px)" @change="changeDataField">
              <!-- :disabled="title.indexOf('编辑')>-1" -->
              <el-option v-for="(item,index) in metadata" :key="index" :label="item.data_field_name" :value="item.data_field_id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="英文名" prop="process_code">
            <el-input v-model="filter.process_code" maxlength="32" show-word-limit placeholder="请输入英文名，允许字母、数字或下划线" style="width:calc(100%-65px)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" prop="process_name">
            <el-input v-model="filter.process_name" maxlength="32" show-word-limit placeholder="请输入业务过程名称" style="width:calc(100%-65px)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="process_desc">
            <el-input v-model="filter.process_desc" type="textarea" maxlength="128" rows="4" show-word-limit placeholder="请输入维度描述" style="width:calc(100%-65px)"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import { addBusProcess, editBusProcess, queryBusProcess } from '@/api/rd/fact'
export default {
  name: 'FactEdit',
  mixins: [editDialog],
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      filter: {
        process_code: '',
        process_name: '',
        data_field_id: '',
        data_field_name: '',
        business_field_name: '',
        project_name: '',
        project_id: '',
        space_type_name: '',
        space_type_id: '',
        process_desc: ''
      },
      rules: {
        process_code: [
          { required: true, message: '请输入英文名' },
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        process_name: { required: true, message: '请输入名称' },
        data_id: { required: true, message: '请选择数据域' }
      },
      loading: 0
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        if (val.id) {
          this.getData()
        } else {
          Object.assign(this.filter, this.project)
        }
      }
    }
  },
  methods: {
    changeDataField () {
      const obj = this.metadata.find(
        item => item.data_field_id === this.filter.data_field_id
      )
      this.filter.data_field_name = obj.data_field_name
    },
    confirm () {
      this.$refs.formEdit.validate(async valid => {
        if (valid) {
          // this.loading++
          this.globalLoading()
          if (this.title.indexOf('新建') > -1) {
            const params = { ...this.filter }
            delete params.id
            const res = await this.$simpleAsyncTo(
              addBusProcess(params),
              '新建业务过程失败'
            )
            if (res) {
              this.$message({
                type: 'success',
                message: '新建业务过程成功！！!'
              })
            }
          } else {
            const res = await this.$simpleAsyncTo(
              editBusProcess(this.filter),
              '编辑业务过程失败'
            )
            if (res) {
              this.$message({
                type: 'success',
                message: '编辑业务过程成功！！！'
              })
            }
          }
          this.$root.eventEmitter.emit('refresh')
          // this.loading--
          this.globalLoading().close()
          this.close()
        }
      })
    },
    async getData () {
      const params = { id: this.data.id }
      this.loading++
      const res = await this.$simpleAsyncTo(
        queryBusProcess(params),
        '查询业务过程失败'
      )
      if (res) {
        Object.assign(this.filter, params, res.data)
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.fact-edit {
  .el-form {
    .el-form-item {
      label {
        font-size: 12px;
        color: $grey4;
      }
    }
  }
}
</style>
