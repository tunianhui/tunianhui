<template>
  <section class="side-attr">
    <el-form class="view-form mt-10" label-width="110px" label-position="right" label-suffix="：">
      <el-form-item label="名称">
        <div>{{viewInfo.process_name}}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div>{{viewInfo.process_desc}}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import serverAttrMixin from '@/mixins/server-attr'
import { mapMutations } from 'vuex'
import { queryBusProcess } from '@/api/rd/fact'
export default {
  name: 'ArrangeAttr',
  mixins: [serverAttrMixin],
  data () {
    return {
      viewInfo: {}
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),

    async getData () {
      this.loading++
      const id = this.data.data.id
      const res = await this.$simpleAsyncTo(
        queryBusProcess({ id }),
        '查询业务过程列表失败'
      )
      if (res) {
        this.viewInfo = {
          id,
          ...res.data
        }
      }
      this.loading--
    },

    // 编辑业务过程
    handleEdit () {
      this.setActiveRdEditDialog({
        title: '编辑业务过程',
        component: 'FactEdit',
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
