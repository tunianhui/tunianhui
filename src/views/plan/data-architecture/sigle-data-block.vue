<template>
  <div class="sigle-data-block height-100per flex-column">
    <div class="page-title">
      <span class="fl" style="cursor: pointer" @click="jumpToDataBlockList"
        >数据板块列表</span
      >
      &nbsp;&gt; {{ parmasS.dataBlock }}
    </div>
    <div class="sigle-data-block-content">
      <div
        style="position: absolute; right: 0px; display: flex; z-index: 100"
        v-if="parmasS.showTopic"
      >
        <el-button-group style="display: flex; margin-right: 10px">
          <el-button
            v-focus
            icon="el-icon-tickets"
            @click="exchageform('form')"
          >
          </el-button>
          <el-button @click="exchageform('tree')" icon="el-icon-film">
          </el-button>
        </el-button-group>
        <el-input
          v-model="data_source_name"
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          @input="search"
          class="mr-10"
          clearable
        ></el-input>
        <el-button
          type="primary"
          @click="handleAddTopicDomain()"
          icon="el-icon-plus"
          >新建主题域</el-button
        >
        <!-- <el-button
          type="primary"
          :disabled="selectedIds.length > 0 ? false : true"
          @click="handleBatchDel"
          >批量删除</el-button
        > -->
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="handleRefreshTopicDomain()"
        ></el-button>
      </div>
      <el-tabs v-model="parmasS.activeName" @tab-click="handleClick" class="custom-page-tab">
        <el-tab-pane label="主题域管理" name="topicDomainManagement">
          <topicDomainManagement
            :dataBlock="parmasS.dataBlock"
            :businId="parmasS.businId"
            :dataSourceName="data_source_name"
            @addBusinessEntity="addBusinessEntity"
            ref="topicDomainManagement"
          />
        </el-tab-pane>
        <el-tab-pane label="业务实体" name="businessEntity">
          <businessEntity :businId="parmasS.businId" ref="businessEntity" />
        </el-tab-pane>
        <el-tab-pane label="研发规范" name="devSpecification">
          <devSpecification :businId="parmasS.businId" ref="devSpecification" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import topicDomainManagement from './topic-domain-management.vue'
import businessEntity from './business-entity.vue'
import devSpecification from './dev-specification.vue'

export default {
  name: 'SigleDataBlock',
  components: {
    topicDomainManagement,
    businessEntity,
    devSpecification,
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      },
    },
  },
  props: {
    params: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      data_source_name: '',
      formData: {},
      dialogTitle: '',
      dialogVisible: false,
      selectedIds: [],
      selectedDeploys: [],
      pType: 'topicDomainManagement',
      debounceSearch: null,
    }
  },
  computed: {
    parmasS: function () {
      return Object.assign(
        {
          dataBlock: '',
          activeName: 'topicDomainManagement',
          businId: '',
          showTopic: null,
        },
        this.params
      )
    },
  },
  watch: {
    'params.activeName': {
      handler: function (n, o) {
        this.$refs.businessEntity.handleAddData()
      },
      deep: true,
    },
  },
  mounted() {
    this.renderer()
  },
  methods: {
    // 修改状态-显示列表or关系图
    exchageform(type) {
      if (this.pType === 'topicDomainManagement') {
        this.$refs.topicDomainManagement.exchagePage(type)
      } else {
        this.$refs.businessEntity.exchagePages(type)
      }
    },
    // 返回数据板块列表
    jumpToDataBlockList() {
      this.$emit('jumpToDataBlockList')
    },
    // tab切换事件
    handleClick(tab, event) {
      if (tab.name == 'topicDomainManagement') {
        this.$emit('changeShowTopic', true)
      } else {
        this.$emit('changeShowTopic', false)
      }
      this.pType = tab.name
    },
    // 新建主题域 弹框
    handleAddTopicDomain() {
      this.formData = {}
      this.dialogTitle = '新增数据源'
      this.dialogVisible = true
      this.$refs.topicDomainManagement.addTopicDomain('new')
    },
    // 刷新主题域列表
    handleRefreshTopicDomain() {
      // this.$refs.topicDomainManagement.refreshTopicDomain()
    },
    // // 批量删除
    // handleBatchDel() {
    //   this.$confirm('确认删除选中的数据源吗?', '删除', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       this.batchDelDataSource()
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除',
    //       })
    //     })
    // },
    // // 批量删除
    // async batchDelDataSource() {
    //   const params = {
    //     data_source_id: this.selectedIds.join(','),
    //     deploy_name: this.selectedDeploys.join(','),
    //   }
    //   const res = await this.$simpleAsyncTo(
    //     batchDelDataSource(params),
    //     '批量删除失败'
    //   )
    //   if (res) {
    //     this.$message({
    //       type: 'success',
    //       message: '批量删除成功!',
    //     })
    //     this.getTableList()
    //   }
    // },
    // 初始化-防抖
    renderer() {
      this.debounceSearch = this.$debounce(
        this.$refs.topicDomainManagement.getTableList.bind(
          this.$refs.topicDomainManagement
        ),
        500
      )
    },
    // 搜索框查询
    search() {
      this.debounceSearch()
    },
    // 接收子组件emit事件
    addBusinessEntity() {
      this.$emit('p_addBusinessEntity')
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  height: 28px;
  margin-bottom: 0;
}
</style>
<style lang="scss">
.sigle-data-block {
  position: relative;
  .sigle-data-block-content {
    height: calc(100% - 28px);
  }
}
.custom-page-tab {
  height: 100%;
  .el-tabs__content {
    height: calc(100% - 55px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
