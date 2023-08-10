<template>
  <el-form :model="addForm" :rules="addules" ref="addForm" label-width="100px" class="addForm">
    <el-form-item label="类目名称" prop="catalog_name">
      <el-input v-model="addForm.catalog_name"></el-input>
    </el-form-item>
    <el-form-item label="类目编码" prop="catalog_code">
      <el-input v-model="addForm.catalog_code"></el-input>
    </el-form-item>
    <el-form-item label="类目描述" prop="catalog_desc">
      <el-input v-model="addForm.catalog_desc" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="涉密类型" prop="secret_level">
      <el-radio-group v-model="addForm.secret_level">
        <el-radio label="0">涉密</el-radio>
        <el-radio label="1">不涉密</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="type === 'add'">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </el-form-item>
    <el-form-item v-if="type === 'edit'">
      <el-button type="primary" @click="edit">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  saveCatalog,
  editCatalog
} from '@/api/asset/catalogue'
export default {
  name: 'addCatalog',
  props: {
    parentId: String,
    type: String,
    catalog: {
      type: Object,
      default: () => {
        return {
          catalog_id: '',
          catalog_name: '',
          catalog_code: '',
          catalog_desc: '',
          secret_level: '1',
          parent_id: ''
        }
      }
    }
  },
  components: {},
  data() {
    return {
      addForm: this.initAddForm(''),
      addules: {
        catalog_name: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
          { max: 128, message: '长度不能超过 128 个字符', trigger: 'blur' }
        ],
        catalog_code: [
          { required: true, message: '请输入类目编码', trigger: 'blur' }
        ],
        secret_level: [
          { required: true, message: '请选择涉密类型', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    type: function (val) {
      if (val === 'add') {
        this.initAddForm()
      } else {
        this.initForm(this.catalog)
      }
    },
    catalog: {
      handler(val) {
        this.initForm(val)
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    initAddForm(val) {
      this.addForm = {
        catalog_name: '',
        catalog_code: '',
        catalog_desc: '',
        secret_level: '1'
      }
    },
    save() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this._saveCatalog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async _saveCatalog() {
      this.addForm.parent_id = this.parentId ? this.parentId : ''
      const res = await this.$simpleAsyncTo(saveCatalog(this.addForm), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '新增成功'
        })
      }
    },
    cancel() {
      this.$emit('close')
    },
    initForm(params) {
      this.addForm = {
        catalog_id: params.catalog_id,
        catalog_name: params.catalog_name,
        catalog_code: params.catalog_code,
        catalog_desc: params.catalog_desc,
        secret_level: params.secret_level,
        parent_id: params.parent_id
      }
    },
    edit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this._editCatalog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async _editCatalog() {
      const res = await this.$simpleAsyncTo(editCatalog(this.addForm), '修改失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
