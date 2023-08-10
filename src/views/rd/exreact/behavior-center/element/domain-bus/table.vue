<template>
  <section class="pr-15 pb-10 pl-10" v-loading="!!loading">
    <div class="mb-10 clearfix">
      <span>行为域&业务线</span>
      <div class="fr my-btn">
        <el-input
          style="width:200px;"
          v-model="keyword"
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
          v-popover:create-popper
          @click="handleEdit()"
        >
          新建行为域
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleRefresh"
        ></el-button>
      </div>
    </div>
    <div class="my-table-style">
      <el-table
        :data="tableData1"
        v-loading="!!loading"
        class="my-object-table"
        :max-height="tableHeight"
        :default-expand-all="true"
      >
        <el-table-column type="expand" width="1">
          <template slot-scope="props">
            <el-table
              :data="props.row.bizLineVOS"
              class="my-sub-object-table"
              :max-height="tableHeight"
            >
              <el-table-column label="业务线" width="240">
                <template slot-scope="subScope">
                  <div class="my-behavior-item" @click.stop="showAttr(subScope.row, 'bizLine')">
                    <div class="my-icon"><i class="iconfont icon-yuyewuxianxiaoicon"></i></div>
                    <div>
                      <p>{{subScope.row.displayName}}</p>
                      <p>{{subScope.row.name}}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="description">
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="subScope">
                  <el-button
                    type="text"
                    title="编辑"
                    class="el-icon-edit-outline font-16"
                    @click="myAddBizLine(subScope.row)"
                  ></el-button>
                  <el-button type="text" class="font-16 el-icon-delete" title="删除" @click="myDelBehavior(subScope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="行为域" width="260">
          <template slot-scope="scope">
            <div class="my-behavior-item" @click.stop="showAttr(scope.row, 'behavior')">
              <div class="my-icon"><i class="iconfont icon-yuyewuxianxiaoicon"></i></div>
              <div>
                <p>{{scope.row.displayName}}</p>
                <p>{{scope.row.name}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" class="font-16 iconfont icon-rizhi" title="新增业务线" @click.native="myAddBizLine()"></el-button>
            <el-button
              style="margin-left:3px"
              type="text"
              title="编辑"
              class="el-icon-edit-outline font-16"
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button type="text" class="font-16 el-icon-delete" title="删除" style="margin-left:3px" @click="myDelBehavior(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
// import {types} from '@/config/rd-config'
// import OverflowTooltip from '@c/overflow-tooltip'
import rdTableMixin from '@/mixins/rd-table'
import {mapGetters} from 'vuex'
import '@/assets/css/my-table-style.scss'
import { getlistFieldAndBusiField, delDomain, delBus } from '@/api/rd/exreact/domain-bus'
export default {
  name: 'AtomObjectTable',
  mixins: [rdTableMixin],
  components: {
    // OverflowTooltip
  },
  data() {
    return {
      tableData1: [
        {
          name: '通信城'
        },
        {
          name: '通信城'
        }
      ],
      title: '',
      isVisible: false,
      isWarningVisible: false,
      dialogFlag: false,
      isRule: false,
      dialogText: '',
      delRemarksForm: {
        desc: ''
      },
      rules: {
        desc: [
          { required: true, message: '必须填', trigger: 'blur' }
        ]
      }
    }
  },
  inject: ['tabStore'],
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    // this.getTreeData()
  },
  methods: {
    // 获取列表数据
    async getTreeData() {
      this.loading++
      const res = await this.$simpleAsyncTo(getlistFieldAndBusiField(), '获取数据失败')
      if (res) {
        this.tableData1 = res.data
      }
      this.loading--
    },
    showAttr(data, type) {
      const attr = {
        title: '行为域&业务线',
        attrType: this.types.DOMAINBUS,
        name: data.id + '',
        label: data.name,
        data,
        type
      }
      this.attrStore.commit('add', attr)
      this.attrStore.commit('setActiveToFirst', attr)
    },
    // 删除行为域
    myDelBehavior(row) {
      let title = '', isDel, fn
      if (row.bizLineVOS) {
        title = '删除行为域'
        if (row.isCreate) {
          isDel = true
        } else {
          isDel = false
          fn = delDomain
        }
      } else {
        title = '删除业务线'
        if (row.isCreate) {
          isDel = true
        } else {
          isDel = false
          fn = delBus
        }
      }
      this.setActiveRdEditDialog({
        title,
        component: `DelDialog`,
        data: {...this.project, ...row, isDel, fn}
      })
    },
    async remove(row) {
      this.loading++
      // const res = await this.$simpleAsyncTo(del({id: row.id}), '删除失败')
      // if (res) {
      //   this.$message({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   this.$root.eventEmitter.emit('refresh')
      // }
      this.loading--
    },
    handleRefresh() {
      this.getTreeData()
    },
    handleEdit(row) {
      let title = ''
      if (row) {
        title = '编辑行为域'
      } else {
        title = '新建行为域'
        row = {}
      }
      this.setActiveRdEditDialog({
        title,
        component: `DomainEdit`,
        data: {...this.project, ...row}
      })
    },
    myAddBizLine(row) {
      let title = ''
      if (row) {
        title = '编辑业务线'
      } else {
        title = '新建业务线'
        row = {}
      }
      this.setActiveRdEditDialog({
        title,
        component: `BusEdit`,
        data: {...this.project, ...row}
      })
    },
    closeModal() {
      this.editdialog = false
    },
    myClose() {
      this.isWarningVisible = false
    },
    myConfirm() {
      if (this.dialogFlag) {
        this.isWarningVisible = false
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isWarningVisible = false
          }
        })
      }
    }
  }
}
</script>
