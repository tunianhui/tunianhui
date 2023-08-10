<template>
  <SimpleEditDialog :title="title" :visible="isVisible" @close="close" @confirm="confirm" class="flow-edit" v-loading="!!loading">
    <el-form ref="formEdit" label-width="110px" :model="filter" :rules="rules" label-suffix="：">
      <el-row>
        <el-col>
          <el-form-item label="业务名称" prop="process_name">
            <el-input v-model="filter.process_name" maxlength="50" show-word-limit placeholder="请输入业务流程名称" style="width:calc(100%-65px)"></el-input>
            <div class="tips">业务名称，必须唯一，支持汉字、英文字母、数字、英文格式的下划线，必须以英文字母或汉 字开头，4～50个字符。</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="API 分组" prop="api_group">
            <el-select v-model="filter.api_group" placeholder="请选择API分组">
              <el-option v-for="item in groupList" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
            </el-select>
            <div class="tips">如需新建分组，您可以跳转<span @click="jump('/server/platform-manage/group')" class="link">平台管理</span>创建新分组</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="业务描述" prop="process_desc">
            <el-input v-model="filter.process_desc" type="textarea" maxlength="180" rows="4" show-word-limit placeholder="请输入业务描述"></el-input>
            <div class="tips">业务描述，不超过180字符</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import {
  getApiGroup
} from '@/api/server/server.js'
import { saveBusinessFlow, editBusinessFlow } from '@/api/server/businessFlow'
import { mapGetters } from 'vuex'

export default {
  name: 'FlowEdit',
  mixins: [editDialog],
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      groupList: [],
      filter: {
        process_name: '',
        api_group: '',
        process_desc: ''
      },
      rules: {
        // 英文名只能用英文、数字、下划线组成，且开头必须是字母
        // {4,50}
        process_name: [
          { required: true, message: '请输入业务名称' },
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '支持汉字、英文字母、数字、英文格式的下划线，必须以英文字母或汉 字开头，4～50个字符。'
          }
        ],
        api_group: { required: true, message: '请选择API分组' }
      },
      loading: 0
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        if (val.id) {
          // this.getData()
          this.filter = val // 编辑回写
        } else {
          // Object.assign(this.filter, this.project)
          this.filter.project_id = this.this.project.project_id
        }
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created () {
    this.getApiGroup()
  },
  methods: {
    async getApiGroup () {
      const params = { id: this.project.project_id }
      const res = await this.$simpleAsyncTo(
        getApiGroup(params),
        '获取分组列表失败'
      )
      if (res) {
        this.groupList = res.data
      }
    },
    // 跳转到平台管理
    jump (path) {
      path && this.$router.push(path)
    },
    // 新建业务流程
    confirm () {
      this.$refs.formEdit.validate(async valid => {
        if (valid) {
          this.globalLoading()
          if (this.title.indexOf('新建') > -1) {
            const params = { ...this.filter }
            // delete params.id
            const res = await saveBusinessFlow(params)
            if (res) {
              this.$message({
                type: 'success',
                message: '新建业务过程成功'
              })
            }
          } else {
            const res = await editBusinessFlow(this.filter)
            if (res) {
              this.$message({
                type: 'success',
                message: '编辑业务过程成功'
              })
            }
          }
          this.$root.eventEmitter.emit('refresh')
          this.globalLoading().close()
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.flow-edit {
  .el-form {
    .el-form-item {
      label {
        font-size: 12px;
        color: $grey4;
      }
    }
  }
  .tips {
    font-size: 12px;
    line-height: 15px;
    color: #999;
  }
  .link {
    margin-left: 5px;
    margin-right: 5px;
    color: #409eff;
    cursor: pointer;
  }
}
</style>
