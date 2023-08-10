<template>
  <SimpleEditDialog :visible="visible" title="修改类目" @close="close" @confirm="confirm" width="30%">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：">
      <el-form-item label="所属类目" prop="catalog_id">
        <el-select v-model="form.catalog_id" placeholder="所属类目" multiple clear>
          <el-option v-for="item in categoryList" :key="item.id" :label="item.label" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import {
  getCategoryList, tableEditCatalog, fileEditCatalog, apiEditCatalog
} from '@/api/asset/catalogue'
export default {
  name: 'modify',
  props: {
    visible: Boolean,
    row: Object,
    type: String
  },
  components: {},
  data() {
    return {
      categoryList: [],
      form: {
        catalog_id: []
      },
      rules: {
        catalog_id: [{required: true, message: '请选择所属类目', trigger: 'change'}]
      }
    }
  },
  watch: {
    row: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initForm(val)
      }
    }
  },
  created() {
    this._getCategoryList()
  },
  mounted() {},
  methods: {
    initForm(params) {
      this.form = {
        catalog_id: params.catalog_id
      }
      switch (this.type) {
        case 'table':
          this.form['cube_id'] = params.cube_id
          break
        case 'file':
          this.form['file_id'] = params.file_id
          break
        case 'api':
          this.form['api_id'] = params.api_id
          break
      }
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          switch (this.type) {
            case 'table':
              this._tableEditCatalog()
              break
            case 'file':
              this._fileEditCatalog()
              break
            case 'api':
              this._apiEditCatalog()
              break
          }
        }
      })
    },
    // 所属类目
    async _getCategoryList() {
      const res = await this.$simpleAsyncTo(getCategoryList(), '获取失败')
      if (res) {
        this.categoryList = res.data.map(item => {
          return {
            id: item.catalog_id,
            label: item.catalog_name
          }
        })
      }
    },
    // 数据表修改类目
    async _tableEditCatalog() {
      const res = await this.$simpleAsyncTo(tableEditCatalog(this.form), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改类目成功'
        })
      }
    },
    // 文件修改类目
    async _fileEditCatalog() {
      const res = await this.$simpleAsyncTo(fileEditCatalog(this.form), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改类目成功'
        })
      }
    },
    // API修改类目
    async _apiEditCatalog() {
      const res = await this.$simpleAsyncTo(apiEditCatalog(this.form), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改类目成功'
        })
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
