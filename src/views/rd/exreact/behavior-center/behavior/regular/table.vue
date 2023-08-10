<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="subtitle">
      <span>行为规则列表</span>
      <div class="fr  my-btn">
        <el-button icon="el-icon-plus" type="primary" plain @click="add">
          新建行为规则
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleRefresh"
        ></el-button>
      </div>
    </div>
    <!-- <FilterGroup :data="filterGroupList" @filterHandle="filterHandle"></FilterGroup> -->
    <FilterCard
      class="mb-10 mt-10"
      ref="filterFieldCard"
      @confirm="_getDataRulesList"
      :filterData="filterGroupList"
    ></FilterCard>
    <el-table
      :data="tableData"
      class="object-table-list"
      :max-height="tableHeight"
      v-loading="!!loading"
      :span-method="objectSpanMethod"
    >
      <!-- :span-method="objectSpanMethod" -->
      <el-table-column label="行为名" width="240">
        <template #default="scope">
          <div class="my-regular-item" @click.stop="showAttr(scope.row)">
            <div class="my-regular-icon"><i class="iconfont icon-hangweiguize1"></i></div>
            <div class="ml-40">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.baseName}}</OverflowTooltip>
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.baseCode}}</OverflowTooltip>
              <div class="my-btn">
                <el-button
                  icon="el-icon-document-add"
                  type="primary"
                  plain
                  @click="myAddData(scope.row)"
                >补数据</el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="规则ID"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="cubeCode"
        label="规则来源表"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="oper_user"
        label="开发状态"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div>
            <i class="el-icon-success font-16" style="color: #67C23A" v-if="scope.row.status==='6'"></i>
            <i class="iconfont icon-kaifazhong font-18" style="color: #a186ff;vertical-align: bottom" v-if="scope.row.status==='5'"></i>
            <span>{{getDicsValue('status_tag', scope.row.status)}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="operUser"
        label="更新人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="operTime"
        label="更新时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="编辑"
            style="margin-left:2px"
            class="el-icon-edit-outline font-16"
            @click="handleEdit(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="查看行为规则"
            style="margin-left:2px"
            class="iconfont icon-hangwei font-16"
            @click="setXinwei(scope.row)"
          ></el-button>
          <el-button
            type="text"
            title="补数据"
            style="margin-left:2px"
            class="el-icon-document-add font-16"
            @click="myAddData(scope.row)"
          ></el-button>
          <el-button
            type="text"
            class="iconfont icon-gengduo font-16"
            v-popover:morepopover
            style="margin-left:2px"
          >
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
                    icon="icon el-icon-copy-document"
                    @click="copyhandle(scope.row)"
                    >克隆</el-button
                  >
                </li>
                <li>
                  <el-button @click="handleOffline(scope.row)" type="text" icon="iconfont icon-xiaxian"
                    >下线</el-button
                  >
                </li>
                <li>
                  <el-button @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"
                    >下线并删除</el-button
                  >
                </li>
              </ul>
            </el-popover>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Offline v-if="offlineVisible" :curRow="curRow" @close="close"></Offline>
  </section>
</template>

<script>
// import {types} from '@/config/rd-config'
import OverflowTooltip from '@c/overflow-tooltip'
import rdTableMixin from '@/mixins/rd-table'
import filterGroupMixin from '@/mixins/filter-group'
import {mapGetters} from 'vuex'
import Offline from './offline'
// import FilterGroup from '@c/filter-group'
import FilterCard from '@c/filter-card'
import { getRegularList } from '@/api/rd/exreact/regular'
import { getDomainListAll, getBusListAll } from '@/api/rd/exreact/domain-bus'
import {getListAll} from '@/api/rd/exreact/action'
import {getListAll as getObjectListAll} from '@/api/rd/exreact/object'
export default {
  name: 'RegularObjectTable',
  mixins: [rdTableMixin, filterGroupMixin],
  components: {
    Offline,
    // FilterGroup,
    FilterCard,
    OverflowTooltip
  },
  data() {
    return {
      visibleCreatePopper: false,
      tableData: [],
      filterGroupList: [],
      offlineVisible: false,
      curRow: {},
      spanArr: [],
      pos: '',
      curFilterData: []
    }
  },
  inject: ['tabStore'],
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this.getFiltersList()
  },
  mounted() {
  },
  methods: {
    async getFiltersList() {
      const Rule_status = {
        id: '开发状态',
        label: '开发状态',
        options: [
          {
            id: '6',
            label: '已提交'
          },
          {
            id: '5',
            label: '草稿'
          }
        ]
      }
      const recentRefreshStatus = {
        id: '最近补数据状态',
        label: '最近补数据状态',
        options: [
          {
            id: 'not_running',
            label: '未执行'
          },
          {
            id: 'running',
            label: '运行中'
          },
          {
            id: 'success',
            label: '成功'
          },
          {
            id: 'failed',
            label: '失败'
          }
        ]
      }
      const domainListAll = await this.getDomainListAll()
      const busListAll = await this.getBusListAll()
      const actionListAll = await this.getActionListAll()
      const objectListAll = await this.getObjectListAll()
      let data = JSON.parse(JSON.stringify([Rule_status, domainListAll, busListAll, actionListAll, objectListAll, recentRefreshStatus]))
      // this.mapFlag(data)
      this.filterGroupList = data
      // const res = await this.$simpleAsyncTo(getFiltersList(), '获取数据失败')
      // if (res) {
      //   let data = res.data
      //   this.mapFlag(data)
      //   this.filterGroupList = data
      // }
    },
    async getTreeData() {
      this.loading++
      let params = {}
      this.curFilterData.forEach(e => {
        switch (e.parid) {
          case 'RULE_STATUS':
            params.status = e.value
            break
          case 'domain':
            params.bfId = e.value
            break
          case 'bisLine':
            params.busiId = e.value
            break
          case 'action':
            params.actId = e.value
            break
          case 'object':
            params.objId = e.value
            break
        }
      })
      const res = await this.$simpleAsyncTo(getRegularList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        // this.tableData = this.mapTableData(this.tableData, 'rules')
        this.getSpanArr(this.tableData)
      }
      this.loading--
    },
    mapFlag(data) {
      data.forEach(e => {
        e.flag = false
        if (e.options && e.options.length) {
          this.mapFlag(e.options)
        }
      })
    },
    mapTableData(data, key) {
      let arr = []
      data.forEach(e => {
        const behaviorId = e.behaviorId, behaviorDisplayName = e.displayName, behaviorName = e.name
        e[key].forEach(i => {
          arr.push({...i, behaviorId, behaviorDisplayName, behaviorName})
        })
      })
      return arr
    },
    filterHandle(data) {
      this.curFilterData = data
      this.getTreeData()
    },
    showAttr(data) {
      // const attr = {
      //   title: '原子指标',
      //   attrType: this.types.ATOM,
      //   name: data.id + '',
      //   label: data.code,
      //   data
      // }
      // this.attrStore.commit('add', attr)
      // this.attrStore.commit('setActiveToFirst', attr)
    },
    add() {
      this.setActiveRdEditDialog({
        title: '新建行为规则',
        component: `RegularEditDialog`,
        data: {...this.project}
      })
    },
    handleRefresh() {
      this.getTreeData()
    },
    handleEdit(data) {
      const attr = {
        label: '编辑行为规则',
        tabType: 'regular',
        name: data.id + '',
        data,
        component: 'RegularEdit'
      }
      this.tabStore.commit('add', attr)
    },
    setXinwei(row) {

    },
    closeModal() {
      this.editdialog = false
    },
    myAddData(row) {
      this.setActiveRdEditDialog({
        title: '行为规则补数据',
        component: `RegularAddData`,
        data: {...this.project, ...row}
      })
    },
    // 下线并删除
    handleDelete(row) {
      this.offlineVisible = true
      this.curRow = row
      this.curRow.flag = 'offlineOrDel'
      this.curRow.arr = []
    },
    // 克隆
    copyhandle(data) {
      const attr = {
        label: `克隆行为规则: ${data.name}`,
        tabType: 'regular',
        name: data.id + '克隆',
        data,
        component: 'RegularEdit'
      }
      this.tabStore.commit('add', attr)
    },
    // 下线
    handleOffline(row) {
      this.offlineVisible = true
      this.curRow = row
      this.curRow.flag = 'offline'
      this.curRow.arr = []
    },
    close() {
      this.offlineVisible = false
      this.getTreeData()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (data[i].baseCode === data[i - 1].baseCode) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    // 获取行为域
    async getDomainListAll() {
      const res = await this.$simpleAsyncTo(getDomainListAll(), '获取数据失败')
      let domainListAll = []
      if (res) {
        domainListAll = res.data
        domainListAll.forEach(e => {
          e.label = e.bfName
        })
      }
      return {
        id: '数据域',
        label: '数据域',
        options: domainListAll
      }
    },
    // 获取业务线
    async getBusListAll() {
      const res = await this.$simpleAsyncTo(getBusListAll(), '获取数据失败')
      let busListAll = []
      if (res) {
        busListAll = res.data
        busListAll.forEach(e => {
          e.label = e.busiName
        })
      }
      return {
        id: '业务线',
        label: '业务线',
        options: busListAll
      }
    },
    // 获取动作列表
    async getActionListAll() {
      const res = await this.$simpleAsyncTo(getListAll(), '获取数据失败')
      let actionListAll = []
      if (res) {
        actionListAll = res.data
        actionListAll.forEach(e => {
          e.label = e.actName
        })
      }
      return {
        id: '动作',
        label: '动作',
        options: actionListAll
      }
    },
    // 获取对象列表
    async getObjectListAll() {
      const res = await this.$simpleAsyncTo(getObjectListAll(), '获取数据失败')
      let objectListAll = []
      if (res) {
        objectListAll = res.data
        objectListAll.forEach(e => {
          e.label = e.objectName
        })
      }
      return {
        id: '对象',
        label: '对象',
        options: objectListAll
      }
    },
    _getDataRulesList() {}
  }
}
</script>
<style lang="scss">
@import '@/assets/css/filter-group.scss';
.my-regular-item {
  // display: -webkit-box;
  // align-items: center;
  .my-regular-icon {
    // display: inline-block;
    float: left;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: lighten($--color-primary, 20%);
    color: $grey10;
    font-size: 18px;
  }
}
.my-el-dropdown1 {
  width: 130px;
}
</style>
