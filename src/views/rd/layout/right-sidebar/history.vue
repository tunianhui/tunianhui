<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-05-16 15:56:32
 * @LastEditTime: 2023-07-17 18:24:05
 * @Description:
-->
<template>
  <section class="side-panel-view" :style="active.style || {}">
    <div class="spv-main">
      <div class="title">
        <span class="name">历史信息</span>
      </div>
      <div class="node-data-edit-base">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="版本信息" name="1">
            <el-table
              :data="tableData"
              style="width: 100%"
              max-height="300"
              v-loading="!!loading"
            >
              <el-table-column prop="version" label="版本号" width="80">
              </el-table-column>
              <el-table-column
                prop="modifer"
                label="修改人"
                width="140"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                width="140"
              ></el-table-column>
              <el-table-column prop="currentVersion" label="状态">
                <template slot-scope="{row}">
                  <!-- <i
                    :class="
                      row.currentVersion == '1'
                        ? 'el-icon-success'
                        : 'el-icon-close'
                    "
                  ></i> -->
                  <span class="ml-5">{{ row.currentVersion == '1' ? '当前版本' : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="{row}">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="查看版本详情"
                    placement="top"
                  >
                    <el-button type="text"
                      ><i
                        class="iconfont icon-shujutancha font-14 color-btn"
                        @click="showLog(row)"
                      ></i
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="回滚到改版本"
                    placement="top"
                  >
                    <el-button type="text"
                      ><i
                        class="iconfont icon-huigun font-14 color-btn"
                        @click="handleReturn(row)"
                      ></i
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="执行信息" name="2">
            <el-table
              :data="tableData2"
              style="width: 100%"
              v-loading="!!loading"
            >
              <el-table-column prop="field1" label="类型" width="80">
              </el-table-column>
              <el-table-column
                prop="field2"
                label="执行人"
                width="140"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="field3"
                label="开始时间"
                width="140"
              ></el-table-column>
              <el-table-column prop="field4" label="耗时"></el-table-column>
              <el-table-column prop="field5" label="状态">
                <template slot-scope="{row}">
                  <i
                    :class="
                      row.field5 === '成功'
                        ? 'el-icon-success'
                        : 'el-icon-error'
                    "
                  ></i>
                  <span class="ml-5">{{ row.field5 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="{row}">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="查看日志"
                    placement="top"
                  >
                    <el-button type="text"
                      ><i
                        class="iconfont icon-xiangqing font-14"
                        @click="showLog(row)"
                      ></i
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="side-modal-footer my-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" class="primary" @click="confirm"
          >确定</el-button
        >
      </div>
    </div>
  </section>
</template>

<script>
import {
  versionHistory,
  versionInfo,
  versionRollBack,
  runInfoList,
  runInfoLogs,
} from '@/api/rd/integrate'
import mixin from '../mixin'
import pager from '@/mixins/pager'
import './common.scss'
import {mapGetters} from 'vuex'

export default {
  name: 'HistoryView',
  mixins: [mixin, pager],
  inject: ['attrStore', 'tabStore'],
  components: {},
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      loading: 0,
      tableData: [],
      tableData2: [
        {
          field1: '运行',
          field2: 'lmz@aidata.onaliyun.com',
          field3: '2023-05-16 11:43:33',
          field4: '11秒',
          field5: '成功',
        },
        {
          field1: '运行',
          field2: 'lmz@aidata.onaliyun.com',
          field3: '2023-05-16 11:43:33',
          field4: '10秒',
          field5: '成功',
        },
        {
          field1: '运行',
          field2: 'lmz@aidata.onaliyun.com',
          field3: '2023-05-16 11:43:33',
          field4: '5秒',
          field5: '失败',
        },
        {
          field1: '运行',
          field2: 'lmz@aidata.onaliyun.com',
          field3: '2023-05-16 11:43:33',
          field4: '5秒',
          field5: '失败',
        },
      ],
    }
  },
  created() {
    this.getVersionHistory()
  },
  computed: {
    ...mapGetters(['project']),
    active() {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    histories() {
      return (this.attrStore && this.attrStore.states.list.slice(0, 25)) || []
    },
    visibleEmpty() {
      return this.attrStore && !this.histories.length
    },
    activeTab () {
      return (this.tabStore && this.tabStore.states.active) || {}
    }
  },
  methods: {
    async getVersionHistory() {
      this.loading++
      const res = await this.$simpleAsyncTo(
        versionHistory({
          taskCode: this.activeTab.data.code,
        }),
        '获取版本信息失败'
      )
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },

    showLog(row) {},

    async handleReturn(row) {
      const res = await this.$simpleAsyncTo(versionRollBack({
        projectId: this.project.project_id,
        taskCode: this.activeTab.data.code,
        version: row.version,
        flowId: this.activeTab.data.flowId,
      }), '回滚失败')
      if (res) {
        this.$message.success('回滚成功')
        this.getVersionHistory()
        this.$root.eventEmitter.emit('refresh')
      }
    },

    // 关闭侧边栏
    cancel() {
      this.$root.eventEmitter.emit('hideSidebar')
    },

    confirm() {
      this.cancel()
    },

    setActiveAttr(attr) {
      this.attrStore.commit('setActive', attr)
    },

    setActiveToFirst(attr) {
      this.attrStore.commit('setActiveToFirst', attr)
    },
  },
}
</script>
<style lang="scss" scoped>
.name {
  font-size: 14px;
  font-weight: bold;
}
.side-modal-footer {
  margin: 15px 15px;
  float: right;
}
.el-icon-error {
  color: #f65252;
}
.icon-oezuocedaohangtubiao- {
  color: #0c4cff;
}
</style>
