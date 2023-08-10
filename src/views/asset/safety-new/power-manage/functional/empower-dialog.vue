<template>
  <el-dialog
    :title="`功能权限${title}：${data.datasource_name}`"
    :visible.sync="dialogVisible"
    @close="close"
    :close-on-click-modal="false"
    class="empower-function">
    <el-form :model="form" :rules="rules">
      <template>
        <div class="mb-10">权限信息</div>
        <div class="function-info">
          <div>
            <span class="fun-title">权限名称：</span>
            <span class="font-12"><i></i></span>
          </div>
          <div>
            <span class="fun-title">权限ID：</span>
            <span class="font-12"><i></i></span>
          </div>
        </div>
        <div class="mb-10 mt-10">授权信息</div>
      </template>
      <el-form-item :label="`${title}用户：`" :label-width="labelWidth" prop="user">
        <el-select v-model="form.user" placeholder="搜索用户">
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期至：" :label-width="labelWidth" v-if="type==='empower'">
        <template>
          <el-row>
            <el-col :span="6" class="mr-10">
              <el-select v-model="form.day" placeholder="搜索用户">
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-date-picker
                v-model="form.time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item :label="`${title}原因：`" :label-width="labelWidth" prop="reason">
        <el-input type="textarea" v-model="form.reason" maxlength="128" show-word-limit :placeholder="`${title}原因`"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submtHandle">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EmpowerDialogFunction',
  props: {
    type: String,
    data: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: true,
      title: '',
      form: {
        user: '',
        day: '',
        time: '',
        reason: ''
      },
      userList: [],
      labelWidth: '100px',
      rules: {
        user: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: `请填写${this.type === 'empower' ? '授权' : '回收'}原因`, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        val === 'empower' ? this.title = '授权' : this.title = '回收'
      }
    }
  },
  methods: {
    submtHandle() {
      this.$message({
        type: 'success',
        message: '授权成功'
      })
      this.close()
    },
    close() {
      this.$emit('empowerClose')
    }
  }
}
</script>

<style lang="scss">
.empower-function {
  .function-info {
    padding: 10px 0;
    background-color: $grey8;
    .fun-title {
      display: inline-block;
      width: 100px;
      text-align: end;
      margin-bottom: 10px;
    }
  }
}
</style>
