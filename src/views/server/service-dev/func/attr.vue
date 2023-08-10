<template>
  <section class="side-attr">
    <el-form class="view-form mt-10" label-width="110px" label-position="right" label-suffix="：">
      <el-form-item label="函数名称">
        <div>{{viewInfo.func_name}}</div>
      </el-form-item>
      <el-form-item label="函数模板">
        <div>{{viewInfo.func_template}}</div>
      </el-form-item>
      <el-form-item label="函数描述">
        <div>{{viewInfo.func_remark}}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import serverAttrMixin from '@/mixins/server-attr'
import { mapMutations } from 'vuex'
export default {
  name: 'FuncAttr',
  mixins: [serverAttrMixin],
  data () {
    return {
      viewInfo: {
        func_name: 'test_001',
        func_template: 'Python3 Standard v1',
        func_remark: '函数'
      }
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    // 编辑
    handleEdit () {
      this.setActiveRdEditDialog({
        title: '编辑函数',
        component: 'FuncEdit',
        data: {
          ...this.project,
          ...this.viewInfo
        }
      })
    }
  }
}
</script>

<style lang="scss">
.fact-attr {
  .dim-name {
    color: $grey4;
    font-size: 14px;
    padding-bottom: 5px;
  }
  .edit {
    padding: 13px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .view-form {
    .el-form-item {
      margin-bottom: 5px;
    }
    .el-form-item__label {
      color: $grey4;
    }
  }
}
</style>
