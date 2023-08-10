<template>
  <section class="side-attr">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{viewInfo.process_code}}</span>
        <span class="status-tag-right">{{getDicsValue('status_tag', viewInfo.status)}}</span>
      </div>
      <div class="attr-name">{{viewInfo.process_name}}</div>
    </div>
    <div class="operate-btn">
      <el-button type="primary" icon="el-icon-edit-outline" @click="handleEdit">编辑</el-button>
      <el-button plain type="primary" icon="icon iconfont icon-gengduo" v-popover:morepopover>
        <el-popover
          popper-class="more-popover"
          placement="bottom"
          trigger="hover"
          ref="morepopover"
        >
          <ul class="popper-list">
            <li>
              <el-button
                type="text"
                icon="icon iconfont icon-chuangjianluojibiao"
                @click="handleCreateFactLogic"
              >创建事实逻辑表</el-button>
            </li>
            <li>
              <el-button type="text" icon="el-icon-copy-document" @click.stop="cloneHandle">克隆</el-button>
            </li>
            <!-- <li>
              <el-button
                type="text"
                icon="iconfont icon-xiaxian2"
                :disabled="!['0', '6'].includes(viewInfo.status)"
                @click.stop="handleOffLine"
              >&nbsp;下线</el-button>
            </li>-->
            <li>
              <el-button type="text" icon="el-icon-delete" @click.stop="handleDelete">删除</el-button>
            </li>
          </ul>
        </el-popover>
      </el-button>
    </div>
    <el-form class="view-form mt-10" label-width="110px" label-position="right" label-suffix="：">
      <el-form-item label="业务板块">
        <div>{{viewInfo.business_field_name}}</div>
      </el-form-item>
      <el-form-item label="所属项目">
        <div>{{viewInfo.project_name}}</div>
      </el-form-item>
      <el-form-item label="项目空间类型">
        <div>{{viewInfo.space_type_name}}</div>
      </el-form-item>
      <el-form-item label="数据域">
        <div>{{viewInfo.data_field_name}}</div>
      </el-form-item>
      <el-form-item label="英文名">
        <div>{{viewInfo.process_code}}</div>
      </el-form-item>
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
import rdAttrMixin from '@/mixins/rd-attr'
import {mapMutations} from 'vuex'
import {delBusProcess, queryBusProcess, offLineBusProcess} from '@/api/rd/fact'
export default {
  name: 'FactAttr',
  mixins: [rdAttrMixin],
  data() {
    return {
      viewInfo: {},
      delFetch: delBusProcess,
      offLineFetch: offLineBusProcess
    }
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async getData() {
      this.loading++
      const id = this.data.data.id
      const res = await this.$simpleAsyncTo(
        queryBusProcess({id}),
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
    handleEdit() {
      this.setActiveRdEditDialog({
        title: '编辑业务过程',
        component: 'FactEdit',
        data: {
          ...this.project,
          ...this.viewInfo
        }
      })
    },
    handleCreateFactLogic() {
      this.setActiveRdEditDialog({
        title: '新建事实逻辑表',
        component: 'FactTableCreate',
        data: {...this.project, ...this.viewInfo}
        // , process_id: this.viewInfo.id
      })
    },
    // 克隆
    cloneHandle() {
      this.setActiveRdEditDialog({
        title: '新建业务过程',
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
