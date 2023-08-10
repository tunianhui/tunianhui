<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-07-20 15:40:46
 * @LastEditTime: 2021-08-09 14:30:15
 * @Description:
-->
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
        <el-form-item label="文件名" prop="file_name">
          <el-input v-model="form.file_name"></el-input>
        </el-form-item>
        <el-form-item label="文件描述" prop="file_desc">
          <el-input type="textarea" v-model="form.file_desc" :rows="7" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="涉密级别" prop="secret_level">
          <el-select v-model="form.secret_level" placeholder="涉密级别">
            <el-option v-for="item in secretLevelList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标签" prop="label">
          <el-select v-model="form.label" placeholder="标签" multiple filterable allow-create clear>
            <el-option v-for="item in labelList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
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
  editFile
} from '@/api/asset/catalogue'
export default {
  name: 'CatalogueFileEdit',
  props: {
    visible: Boolean,
    row: Object,
    categoryList: Array
  },
  components: {},
  data() {
    return {
      rules: {
        file_name: [{required: true, message: '请输入文件名', trigger: 'change'}],
        secret_level: [{required: true, message: '请选择涉密级别', trigger: 'change'}],
        catalog_id: [{required: true, message: '请选择类目名称', trigger: 'change'}]
      },
      form: {
        file_id: '',
        file_name: '',
        file_desc: '',
        secret_level: '',
        catalog_id: []
      },
      secretLevelList: [
        {
          label: '涉密', value: '0'
        }, {
          label: '不涉密', value: '1'
        }
      ],
      labelList: [
        // {label: '标签1', value: '0'}
      ]
    }
  },
  computed: {},
  watch: {
    row: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initForm(val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    initForm(params) {
      this.form = {
        file_id: params.file_id,
        file_name: params.file_name,
        file_desc: params.file_desc,
        secret_level: params.secret_level,
        catalog_id: params.catalog_id
      }
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this._editFile()
        }
      })
    },
    async _editFile() {
      const res = await this.$simpleAsyncTo(editFile(this.form), '获取失败')
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
    margin-bottom: 15PX;
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
