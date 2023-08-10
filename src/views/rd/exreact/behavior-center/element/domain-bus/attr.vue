<template>
  <section class="side-attr">
    <p class="font-18">{{ data.data.displayName }}</p>
    <p class="font-14 mb-5 my-title">{{ data.data.name }}</p>
    <div class="operate-btn my-btn">
      <el-button type="primary" class="primary" @click="myAddBusiness" v-if="data.type==='behavior'">
        <i class="iconfont icon-rizhi"></i>
        新建业务线</el-button>
      <el-button type="primary" class="primary" @click="edit(data.data)">
        <i class="el-icon-edit-outline"></i>
        编辑</el-button>
      <el-dropdown class="my-el-dropdown ml-10" @command="handleCommand(data.data)">
        <el-button type="primary">
          <i class="iconfont icon-gengduo"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="my-el-dropdown-menu">
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="my-content">
      <div class="my-basc mb-20">
        <div class="my-title">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">基本信息</span>
        </div>
        <div>
          <span class="my-title ml-10 mt-10">描述：</span>
        </div>
      </div>
      <div class="my-basc">
        <div class="my-title mb-15">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">应用行为规则列表</span>
        </div>
        <div>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="行为名">
                <template slot-scope="scope">
                  <OverflowTooltip class="my-width">{{scope.row.name}}</OverflowTooltip>
                </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="规则ID">
              <template slot-scope="scope">
                <OverflowTooltip class="my-width">{{scope.row.name}}</OverflowTooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="规则来源表">
              <template slot-scope="scope">
                <OverflowTooltip class="my-width">{{scope.row.name}}</OverflowTooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import rdAttr from '@/mixins/rd-attr'
import OverflowTooltip from '@c/overflow-tooltip'
import { delDomain, delBus } from '@/api/rd/exreact/domain-bus'
export default {
  name: 'DomainBusAttr',
  mixins: [rdAttr],
  components: {
    OverflowTooltip
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    myAddBusiness() {
      this.setActiveRdEditDialog({
        title: '新建业务线',
        component: `BusEdit`,
        data: {...this.project}
      })
    },
    edit(row) {
      let title = '', component
      if (row.bizLineVOS) {
        title = '编辑行为域'
        component = 'DomainEdit'
      } else {
        title = '编辑业务线'
        component = 'BusEdit'
      }
      this.setActiveRdEditDialog({
        title,
        component,
        data: {...this.project, ...row}
      })
    },
    handleCommand(row) {
      let title = '', isDel, fn
      if (row.bizLineVOS) {
        title = '删除行为域'
        if (row.bizLineVOS.length) {
          isDel = true
        } else {
          isDel = false
          fn = delDomain
        }
      } else {
        title = '删除业务线'
        isDel = false
        fn = delBus
      }
      this.setActiveRdEditDialog({
        title,
        component: `DelDialog`,
        data: {...this.project, ...row, isDel, fn}
      })
    }
  }
}
</script>

<style lang="scss">
.my-el-dropdown-menu {
  width: 100px;
  border-radius: 0;
}
.my-el-dropdown-menu.el-popper[x-placement^=bottom] {
  margin-top: 5px;
}
</style>

<style lang="scss" scoped>
.side-attr {
  .my-width {
    width: calc(100% - 10px);
  }
  .my-el-dropdown {
    width: 28px;
  }
}
</style>
