<template>
  <section class="source-attr side-attr">
    <div class="operate-btn mb-20" style="border-bottom:1px solid #e8e8e8;padding-bottom:15px;">
      <el-button type="primary" @click="edit">编辑</el-button>
      <!-- <el-button type="primary" v-clipboard="{value: viewInfo.func_name}">copy 引用</el-button> -->
    </div>
    <el-form class="view-form" label-width="110px" label-position="right" label-suffix="：" v-loading="!!loading" style="font-size: 12px;">
      <el-form-item label="函数名称">
        <div>{{viewInfo.func_name}}</div>
      </el-form-item>
      <el-form-item label="类名">
        <div>{{viewInfo.class_main}}</div>
      </el-form-item>
      <el-form-item label="资源">
        <div>{{viewInfo.file_name}}</div>
      </el-form-item>
      <el-form-item label="责任人">
        <div>{{viewInfo.create_user}}</div>
      </el-form-item>
      <el-form-item label="创建时间">
        <div>{{viewInfo.create_time}}</div>
      </el-form-item>
      <el-form-item label="更新人">
        <div>{{viewInfo.modify_user}}</div>
      </el-form-item>
      <el-form-item label="更新时间">
        <div>{{viewInfo.modify_time}}</div>
      </el-form-item>
      <el-form-item label="函数类型">
        <div>{{viewInfo.classify_name}}</div>
      </el-form-item>
      <el-form-item label="命令格式">
        <div>{{viewInfo.func_format}}</div>
      </el-form-item>
      <el-form-item label="使用文档">
        <div>{{viewInfo.help_text}}</div>
      </el-form-item>
       <el-form-item label="引用路径">
        <div>{{viewInfo.jar_path}}</div>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {queryMetaFuncInfo} from '@/api/rd/func-manage.js'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'FuncManageAttr',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    return {
      viewInfo: {},
      loading: 0,
      funcType: {
        sysOther: '其他函数',
        sysString: '字符串函数',
        sysMath: '数学函数',
        sysDate: '日期函数',
        sysWindow: '窗口函数',
        sysAggregation: '聚合函数'
      }
    }
  },
  created() {
    this._queryMetaFuncInfo()
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    mouseoverHandle() {},
    // 查询函数
    async _queryMetaFuncInfo() {
      this.loading++
      const res = await this.$simpleAsyncTo(queryMetaFuncInfo({id: this.data.data.id}), '获取函数信息失败')
      if (res) {
        this.viewInfo = res.data
      }
      this.loading--
    },
    edit(data, node) {
      console.log(this.data)
      this.setActiveRdEditDialog({
        title: '编辑函数管理',
        component: 'FuncManageEdit',
        data: {...this.project, ...this.data.data}
      })
    }
  }
}
</script>

<style lang="scss">
.func-attr {
  .view-form {
    .el-form-item {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
    }
    .el-form-item__label {
      color: $grey4;
      max-width: 150px;
      font-size: 12px;
    }
    .el-form-item__content {
      flex: 1;
      margin-left: 0!important;
      font-size: 12px;
    }
  }
}
</style>
