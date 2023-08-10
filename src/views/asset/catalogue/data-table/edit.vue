<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-07-20 15:40:46
 * @LastEditTime: 2021-08-09 14:29:51
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
        <el-form-item label="表名称" prop="cube_name">
          <el-input v-model="form.cube_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.desc" :rows="7" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="涉密级别" prop="secretLevel">
          <el-select v-model="form.secretLevel" placeholder="涉密级别">
            <el-option v-for="item in secretLevelList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="label">
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
        <el-form-item label="所属类目" prop="catalog_id">
          <el-select v-model="form.catalog_id" placeholder="所属类目" multiple clear>
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
  editDataTable
} from '@/api/asset/catalogue'
export default {
  name: 'CatalogueDataTableEdit',
  props: {
    visible: Boolean,
    row: Object,
    categoryList: Array
  },
  components: {},
  data() {
    return {
      rules: {
        cube_name: [{required: true, message: '请输入表中文名称', trigger: 'blur'}],
        catalog_id: [{required: true, message: '请选择所属类目', trigger: 'change'}]
      },
      form: {
        cube_id: '',
        cube_name: '',
        catalog_id: []
      }
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
        cube_id: params.cube_id,
        cube_name: params.cube_name,
        catalog_id: params.catalog_id
      }
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this._editDataTable()
        }
      })
    },
    async _editDataTable() {
      const res = await this.$simpleAsyncTo(editDataTable(this.form), '获取失败')
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
