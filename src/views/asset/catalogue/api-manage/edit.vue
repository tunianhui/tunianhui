<template>
  <SimpleEditDialog :visible="visible" title="编辑" @close="close" @confirm="confirm" width="40%">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：">
      <div class="title-line">
        <span class="title">基本信息</span>
        <div class="line-box">
          <div class="line"></div>
        </div>
      </div>
      <div class="box">
        <el-form-item label="API名" prop="api_name">
          <el-input v-model="form.api_name"></el-input>
        </el-form-item>
      </div>
      <div class="title-line">
        <span class="title">类目信息</span>
        <div class="line-box">
          <div class="line"></div>
        </div>
      </div>
      <div class="box">
        <el-form-item label="类目名称" prop="catalog_id">
          <el-select v-model="form.catalog_id" placeholder="类目名称" multiple clear>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import {
  editApi
} from '@/api/asset/catalogue'
export default {
  name: 'CatalogueApiManageEdit',
  props: {
    visible: Boolean,
    row: Object,
    categoryList: Array
  },
  components: {},
  data () {
    return {
      rules: {
        api_name: [{ required: true, message: '请输入API名', trigger: 'change' }],
        catalog_id: [{ required: true, message: '请选择类目名称', trigger: 'change' }]
      },
      form: {
        api_id: '',
        api_name: '',
        catalog_id: []
      }
    }
  },
  computed: {},
  watch: {
    row: {
      immediate: true,
      deep: true,
      handler (val) {
        this.initForm(val)
      }
    }
  },
  created () { },
  mounted () { },
  methods: {
    initForm (params) {
      this.form = {
        api_id: params.api_id,
        api_name: params.api_name,
        catalog_id: params.catalog_id
      }
    },
    close () {
      this.$emit('close')
    },
    confirm () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this._editApi()
        }
      })
    },
    async _editApi () {
      const res = await this.$simpleAsyncTo(editApi(this.form), '获取失败')
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

<style lang="scss">
.demo-ruleForm {
  height: 100%;
  width: 100%;
  .title-line {
    display: flex;
    margin-bottom: 15px;
    .title {
      width: 100px;
      text-align: center;
      display: block;
      font-size: 16px;
      color: $tabTitleColor;
    }
    .line-box {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .line {
        height: 1px;
        width: 100%;
        background: $grey7;
      }
    }
  }
  .box {
    padding-left: 100px;
  }
}
</style>
