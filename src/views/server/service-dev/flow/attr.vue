<template>
  <!-- 业务流程 属性 -->
  <section class="side-attr">
    <el-form class="view-form mt-10" label-width="110px" label-position="right" label-suffix="：">
      <el-form-item label="业务名称">
        <div>{{viewInfo.process_name}}</div>
      </el-form-item>
      <el-form-item label="API 分组">
        <div>{{viewInfo.api_group}}</div>
      </el-form-item>
      <el-form-item label="业务描述">
        <div>{{viewInfo.process_desc}}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import serverAttrMixin from '@/mixins/server-attr'
import { mapMutations } from 'vuex'
export default {
  name: 'FlowAttr',
  mixins: [serverAttrMixin],
  data () {
    return {
      viewInfo: {
        process_name: 'XXXX',
        api_group: 'XXXX',
        process_desc: 'XXXXXXXXXX'
      }
    }
  },
  mounted () { },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    })
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
