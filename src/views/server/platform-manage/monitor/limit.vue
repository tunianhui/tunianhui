<template>
  <el-dialog title="API限流配置" :visible.sync="dialogFormVisible" width="35%" @close="close">
    <el-form :model="form" :label-width="formLabelWidth" label-suffix="：" ref="form">
      <el-form-item label="API名称">
        {{form.name}}
      </el-form-item>
       <el-form-item label="限流状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio label="0">开</el-radio>
          <el-radio label="1">关</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="单位时间">
        <el-select v-model="form.time">
          <el-option label="Hour" value="hour"></el-option>
          <el-option label="sec" value="sec"></el-option>
          <el-option label="min" value="min"></el-option>
          <el-option label="day" value="day"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="API流量限制(次数)" prop="apiFlowLimit">
        <el-input v-model="form.apiFlowLimit" placeholder="请输入API流量限制"></el-input>
      </el-form-item>
      <!-- <el-form-item label="APP流量限制" prop="appFlowLimit">
        <el-input v-model="form.appFlowLimit" placeholder="请输入APP流量限制"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <div class="space-between">
          <span>特殊APP流量限制</span>
          <el-button type="text" @click="addAppHandle">添加app</el-button>
        </div>
      </el-form-item>
      <el-form-item label-width="0">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="app"
            label="应用">
            <template slot-scope="scope">
              <el-select v-model="scope.row.app">
                <el-option label="Hour" value="Hour"></el-option>
                <el-option label="sec" value="sec"></el-option>
                <el-option label="min" value="min"></el-option>
                <el-option label="day" value="day"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="limitNum"
            label="限流次数">
            <template slot-scope="scope">
              <el-input v-model="scope.row.limitNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deteleApp(scope.row, scope.$index)"><i class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirmHandle('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getBolckInfo,
  saveBolckInfo
} from '@/api/server/server.js'
export default {
  name: 'LimitDialog',
  props: {
    data: Object
  },
  data() {
    return {
      formLabelWidth: '140px',
      form: {
        name: '',
        state: '0',
        time: 'sec',
        apiFlowLimit: 300
      },
      dialogFormVisible: true,
      tableData: []
    }
  },
  watch: {
    // visible: {
    //   immediate: true,
    //   handler(val) {
    //     this.dialogFormVisible = val
    //   }
    // }
    // dialogFormVisible: {
    //   handler(val) {
    //     this.$emit('update:visible', val)
    //   }
    // }
  },
  created() {
    this.getBolckInfo()
  },
  methods: {
    confirmHandle(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            api_id: this.data.api_id,
            block_status: this.form.state,
            block_time_unit: this.form.time,
            block_limit: this.form.apiFlowLimit
          }
          const res = await this.$simpleAsyncTo(saveBolckInfo(params), '保存失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '配置成功'
            })
          }
          this.$parent.getTableList()
          this.close()
        }
      })
    },
    async getBolckInfo() {
      const res = await this.$simpleAsyncTo(getBolckInfo({id: this.data.api_id}), '获取限流数据失败')
      if (res) {
        let data = res.data
        this.form.name = data.api_name
        this.form.state = data.is_block
        this.form.time = data.unit_time
        this.form.apiFlowLimit = data.api_block
      }
    },
    addAppHandle() {
      this.tableData.push({
        app: '',
        limitNum: ''
      })
    },
    deteleApp(row, index) {
      this.tableData.splice(index, 1)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
