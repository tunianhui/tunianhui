<!--
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-07-31 10:37:31
 * @LastEditTime: 2023-02-09 17:02:57
 * @Description:
-->
<template>
  <section class="tag-factory-attr">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{data.data.name}}</span>
        <!-- <span class="status-tag-right">{{getDicsValue('status_tag', data.data.status)}}</span> -->
        <span class="status-tag-right">{{getDicsValue('status_tag',  data.data.status)}}</span>
      </div>
      <div class="attr-name">{{data.data.name}}</div>
    </div>
    <div class="operate-btn my-btn mt-20">
      <el-button type="primary" class="primary" @click.stop="editHandle(data.data)">
        <i class="el-icon-edit-outline"></i>
        编辑
      </el-button>
      <el-button type="primary" class="primary" @click.stop="seeTagReport(data.data)">
        <i class="iconfont icon-rizhi"></i>
        查看标签报告
      </el-button>
      <el-button type="primary" class="primary" @click.stop="addData(data.data)">
        <i class="iconfont icon-bushuju"></i>
        补数据
      </el-button>
      <el-dropdown class="my-el-dropdown ml-10" @command="handleCommand" placement="bottom-end">
        <el-button type="primary">
          <i class="iconfont icon-gengduo"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="my-el-dropdown-menu">
          <el-dropdown-item icon="iconfont icon-biaoqian1" command="seeTagTaskHandle">标签任务</el-dropdown-item>
          <!-- <el-dropdown-item icon="el-icon-document-copy" command="cloneHandle">克隆</el-dropdown-item> -->
          <el-dropdown-item icon="iconfont icon-xiaxian" command="offlineHandle" :disabled="!['0', '6'].includes(data.data.status)">下线</el-dropdown-item>
          <el-dropdown-item icon="el-icon-delete" command="delHandle">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="my-content mt-20">
      <div class="my-basc mb-20">
        <div class="my-title">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">数据来源及标签值</span>
        </div>
        <div style="border-bottom:1px solid #DFDFE1;padding:10px 0 20px 0" v-for="(item, index) in dsTagValues" :key="index">
          <el-form label-width="90px">
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">行为：</span>
              </div>
              <span class="font-12">{{item.src_behavior_desc}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D">筛选条件：</span>
              </div>
              <span class="font-12">{{item.src_filter_desc}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0;font-size:12px!important">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">打标方式：</span>
              </div>
              <span class="font-12">{{item.labeling_mode}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">标签值：</span>
              </div>
              <span class="font-12">{{item.label_value}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">时间跨度：</span>
              </div>
              <span class="font-12">{{item.span_day}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="my-basc">
        <div class="my-title mb-15">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">标签生成规则</span>
        </div>
        <div style="border-bottom:1px solid #DFDFE1;padding:10px 0 20px 0">
          <el-form label-position="left" label-width="100px">
            <el-form-item style="margin-bottom:0" label-width="200px">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">对用户返回标签值个数（最多）：</span>
              </div>
              <span class="font-12">{{rulesObj.label_num}}</span>
            </el-form-item>
            <!-- <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">衰减时间周期：</span>
              </div>
              <span class="font-12">7</span>
            </el-form-item> -->
            <!-- <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">时间衰减曲线：</span>
              </div>
              <div class="font-12">
                <div class="time-status">
                  <span><i class="el-icon-minus"></i></span>
                  <span style="padding:0 5px">平滑：行为对标签值的影响不随时间衰减</span>
                </div>
              </div>
            </el-form-item> -->
            <el-form-item style="margin-bottom:0" class="mt-10">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">行为权重：</span>
              </div>
              <el-table :data="rulesObj.behaviorWeightData2" style="width: 100%" class="act-weigth">
                <el-table-column prop="rule_name" label="行为">
                  <template slot-scope="scope">
                    <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.rule_name}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="behavior_weight" label="权重">
                  <template slot-scope="scope">
                    <div class="weight-bar">
                      <span>
                        <span class="bar-item" :style="{width: `${scope.row.width}%`, left: `${scope.row.left}%`}"></span>
                      </span>
                      <span>{{scope.row.behavior_weight}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div class="font-12">1</div> -->
            </el-form-item>
            <!-- <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">覆盖用户范围：</span>
              </div>
              <span class="font-12">{{`${rulesObj.coverage_start}% ~ ${rulesObj.coverage_end}%`}}</span>
            </el-form-item> -->
          </el-form>
        </div>
      </div>

      <div class="my-basc mt-20">
        <div class="my-title mb-15">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">标签结果表</span>
        </div>
        <div style="border-bottom:1px solid #DFDFE1;padding:10px 0 20px 0">
          <el-form label-position="left" label-width="100px">
            <el-form-item style="margin-bottom:0" label-width="90px">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">标签结果表：</span>
              </div>
              <el-button type="text" @click="tabRestableHandle">{{data.data.label_table}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="my-basc mt-20">
        <div class="my-title mb-15">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">依赖关系</span>
        </div>
        <div style="padding:10px 0 20px 0">
          <el-form label-width="100px" v-for="(item, index) in relyData" :key="item.behavior">
            <el-form-item style="margin-bottom:0" label-width="90px">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">行为：</span>
              </div>
              <div>
                <el-button type="text" @click="actionhandle">{{item.behavior}}</el-button>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label-width="90px" v-for="(subitem, subindex) in item.behavior_rule" :key="subitem.behavior_id">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12" v-if="subindex === 0">行为规则：</span>
              </div>
              <div>
                <el-button type="text">{{subitem.cube_code}}</el-button>
              </div>
            </el-form-item>
            <el-divider v-if="index !== relyData.length - 1"></el-divider>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <TagOfflineDialog v-if="tagOfflineVisible" :data="curData" @closeTag="closeTag" :title="title"></TagOfflineDialog> -->
  </section>
</template>

<script>
import { types } from '@/config/rd-config'
import rdAttr from '@/mixins/rd-attr'
// import TagOfflineDialog from './offline'
import OverflowTooltip from '@c/overflow-tooltip'
import { capitalize } from '@/libs/util'
import {
  queryLabelConfigurationPreview,
  offLine,
  deleteTag
} from '@/api/rd/exreact/tag-center'
export default {
  name: 'TagFactoryAttr',
  mixins: [rdAttr],
  components: {
    // TagOfflineDialog,
    OverflowTooltip
  },
  data () {
    return {
      tagOfflineVisible: false,
      curData: {},
      title: '',
      dsTagValues: [],
      actWeigthTableData: [],
      rulesObj: {},
      relyData: []
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        this._queryLabelConfigurationPreview()
      }
    }
  },
  created () {
    this._queryLabelConfigurationPreview()
  },
  methods: {
    async _queryLabelConfigurationPreview () {
      const params = {
        label_id: this.data.data.id
      }
      const res = await this.$simpleAsyncTo(queryLabelConfigurationPreview(params), '获取数据失败')
      if (res) {
        this.dsTagValues = res.data.step1
        this.rulesObj = res.data.step2
        this.relyData = res.data.relyData
        let data = this.rulesObj.behaviorWeightData2
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          item.width = item.behavior_weight * 100
          if (i === 0) {
            item.left = 0
          }
          if (i > 0) {
            item.left = data[i - 1].width + data[i - 1].left
          }
        }
      }
    },
    handleCommand (data) {
      this[data]()
    },
    seeTagTaskHandle () {
    },
    cloneHandle () {
      const attr = {
        label: `克隆标签: ${this.data.data.name}`,
        tabType: 'regular',
        name: this.data.data.id + '克隆',
        data: this.data.data,
        component: 'TagConfig'
      }
      this.tabStore.commit('add', attr)
    },
    offlineHandle () {
      // this.tagOfflineVisible = true
      // this.title = '下线'
      // this.curData = this.data.data
      this.$confirm('此操作将下线该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(offLine({ id: this.data.data.id }), '下线失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '下线成功!'
          })
          this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下线'
        })
      })
    },
    delHandle () {
      // this.tagOfflineVisible = true
      // this.title = '下线并删除'
      // this.curData = this.data.data
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(deleteTag({ id: this.data.data.id }), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$root.eventEmitter.emit('refresh')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    closeTag () {
      this.tagOfflineVisible = false
    },
    tabRestableHandle () {
      let routeData = this.$router.resolve({
        name: 'detail',
        query: {}
      })
      window.open(routeData.href, '_blank')
    },
    actionhandle () {
      let key = 'exreact'
      this.$store.commit(`${key}/SET_ACTIVE`, 'regular')
      this.tabStore.commit('add', {
        label: `${key === 'exreact' ? '萃取' : ''}对象页表页`,
        tabType: 'objectTable',
        name: `${key}_objectTable`, // tab页的标识
        component: `${capitalize(key)}ObjectTable`
      })
    },
    editHandle (data) {
      const attr = {
        label: `编辑标签：${data.name}`,
        tabType: types.FACTORY,
        name: data.id + '编辑',
        data,
        component: 'TagConfig'
      }
      this.tabStore.commit('add', attr)
    },
    addData (data) {
      this.setActiveRdEditDialog({
        title: '标签补数据',
        component: `TagAddData`,
        data: { ...this.project }
      })
    },
    seeTagReport (data) {
      const attr = {
        title: '标签报告',
        attrType: 'report',
        name: data.id + 'report',
        label: '标签报告',
        data,
        width: '700px'
      }
      this.attrStore.commit('add', attr)
    }
  }
}
</script>

<style lang="scss">
.tag-factory-attr {
  .subtitle {
    font-weight: 400;
    font-size: 14px;
    > div:last-child {
      opacity: .6;
    }
  }
  .time-status {
    outline: 1px solid rgba(0, 0, 0, .2);
    white-space: nowrap;
    display: inline-flex;
    > span:first-child {
      padding: 0 5px;
      box-sizing: border-box;
      background: $grey6;
    }
  }
  .act-weigth {
    background: #f8f8fa;
    tr, th {
      background: #f8f8fa;
    }
    .weight-bar {
      width: calc(100% - 5px);
      display: flex;
      align-items: center;
      > span:first-child {
        width: calc(100% - 25px);
        height: 15px;
        background: $grey6;
        margin-right: 5px;
        position: relative;
        .bar-item {
          position: absolute;
          background: $tabTitleColor;
          height: 100%;
        }
      }
    }
  }
}

</style>
