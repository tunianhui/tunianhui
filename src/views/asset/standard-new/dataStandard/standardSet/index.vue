<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 09:43:05
 * @LastEditTime: 2023-05-12 17:28:16
 * @Description:
-->
<template>
  <div class="set-wrapper">
    <template v-if="step === 1">
      <ListHeader title="标准集" class="mb-10" @add="adddataset"></ListHeader>

      <div class="table-wrapper">
        <div class="table" v-resize="resizeDom">
          <el-table :data="tableData" :height="height" style="width: 100%" v-loading="loading">
            <el-table-column label="标准集名称/编码">
              <template slot-scope="{row}">
                <div class="flex-layout">
                  <div class="icon-wrapper">
                    <i class="iconfont icon-quanjugaikuang icon"></i>
                  </div>
                  <div class="name">
                    <div style="color: rgba(46,116,255,1)">{{row.basicInfo.name}}</div>
                    <div style="color: rgba(0,0,0,0.8)">{{row.basicInfo.code}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="归属目录">
              <template slot-scope="{row}">
                <span>{{row.basicInfo.directoryReference.directory}}</span>
              </template>
            </el-table-column>
            <el-table-column label="生效/总标准数">
              <template>
                <span>0/1</span>
              </template>
            </el-table-column>
            <el-table-column label="最近更新人">
              <template slot-scope="{row}">
                <span>{{row.basicInfo.lastModifier.displayName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="140">
              <template slot-scope="{row}">
                <span>{{row.basicInfo.lastModifyTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述">
              <template slot-scope="{row}">
                <span>{{row.basicInfo.description}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tooltip content="查看标准" placement="top">
                  <el-button size="mini" type="text" @click="viewDataStandard">
                    <i class="iconfont icon-yuanbiao-xianxing font-14 color-btn"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                  <el-button size="mini" type="text" @click="editHandle">
                    <i class="el-icon-edit-outline font-14 color-btn"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="克隆" placement="top">
                  <el-button size="mini" type="text">
                    <i class="iconfont icon-ziyuan2 font-14 color-btn"></i>
                  </el-button>
                </el-tooltip>
                <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover>
                  <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                    <ul class="popper-list">
                      <li>
                        <el-button type="text"><i class="iconfont icon-jiagousheji font-14 color-btn">查看落标映射</i></el-button>
                      </li>
                      <li>
                        <el-button type="text"><i class="iconfont icon-jiagousheji font-14 color-btn">配置落标映射</i></el-button>
                      </li>
                      <li>
                        <el-button type="text"><i class="iconfont icon-xiazai font-14 color-btn">下载批量导入模板</i></el-button>
                      </li>
                      <li>
                        <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDel(scope.row)">删除</i></el-button>
                      </li>
                    </ul>
                  </el-popover>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="foot">
          <el-pagination layout="prev, pager, next, sizes" :pager-count="5" :page-sizes="[10, 20, 30, 40]" :total="total">
          </el-pagination>
        </div>
      </div>
    </template>
    <template v-if="step === 2">
      <NextDetail :title="nextDetailTitle" @back="goBack"></NextDetail>
    </template>
    <DialogFormStandardSet
      v-if="DialogFormStandardSetVisible"
      :title="DialogFormStandardSetTitle"
      @next="next"
      @close="DialogFormStandardSetVisible = false"
    ></DialogFormStandardSet>
  </div>
</template>

<script>
import ListHeader from './list-header.vue'
import DialogFormStandardSet from './edit.vue'
import NextDetail from './next.vue'
import {
  getstandardsetFuzzySearchList
} from '@/api/asset/dataStandard-standard.js'
export default {
  name: 'standardSet',
  components: {
    ListHeader,
    DialogFormStandardSet,
    NextDetail
  },
  data() {
    return {
      tableData: [],
      height: 0,
      DialogFormStandardSetVisible: false,
      DialogFormStandardSetTitle: '新增标准集',
      step: 1,
      nextDetailTitle: '标准集列表',
      loading: false,
      total: 0
    }
  },
  created() {
    this._getstandardsetFuzzySearchList()
  },
  methods: {
    async _getstandardsetFuzzySearchList() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getstandardsetFuzzySearchList(), '获取数据失败')
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading = false
    },
    resizeDom (data = {}) {
      console.log(data)
      this.height = parseInt(data.height || 0)
    },
    handleDel (item) {
      this.$confirm('此操作将永久删除该标准集, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    adddataset () {
      this.DialogFormStandardSetVisible = true
      this.DialogFormStandardSetTitle = '新增标准集'
    },
    next () {
      this.step = 2
      this.DialogFormStandardSetVisible = false
      this.nextDetailTitle = '编辑标准集：数据安全标准'
    },
    goBack() {
      this.step = 1
    },
    // 查看标准
    viewDataStandard () {
      this.$router.push({ path: '/asset/standard-new/dataStandard/dataStandard' })
    },
    // 编辑
    editHandle () {
      this.DialogFormStandardSetVisible = true
      this.DialogFormStandardSetTitle = '编辑标准集'
    }
  }
}
</script>

<style lang="scss" scoped>
.set-wrapper {
  height: 100%;
  position: relative;
  font-size: 14px;
  .table-wrapper {
    height: calc(100% - 40px);
    position: relative;
    flex: 1;
    padding: 10px;
    background: #fff;
    .table {
      height: calc(100% - 40px);
    }
    .foot {
      height: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 15px;
    }
  }
}
.icon-wrapper {
  display: flex;
  align-items: center;
  .icon {
    font-size: 20px;
    color: #2e74fe;
  }
}
.name {
  width: calc(100% - 20px);
  margin-left: 10px;
  div {
    line-height: 14px;
  }
}

</style>
