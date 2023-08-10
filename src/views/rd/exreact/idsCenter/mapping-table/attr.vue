<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-07 11:21:53
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-17 09:44:04
 * @FilePath: \数据智能构建\src\views\rd\exreact\idsCenter\mapping-table\attr.vue
-->
<template>
  <div class="entoty-id-attr">
    <div class="subtitle">
      <div>
        <span class="mr-10">{{data.data.sourceMappingName}}</span>
        <span class="status-tag-right" v-if="data.data.status">{{getDicsValue('status_tag',  data.data.status)}}</span>
      </div>
      <div class="attr-name">{{data.data.sourceMappingCode}}</div>
    </div>
    <div class="operate-btn my-btn mt-20">
      <el-button type="primary" class="primary" @click.stop="editHandle(data.data)">
        <i class="el-icon-edit-outline"></i>
        编辑
      </el-button>
      <el-button type="primary" class="primary" @click.stop="delHandle(data.data)">
        <i class="el-icon-delete"></i>
        删除
      </el-button>
    </div>
    <div class="my-content">
      <div class="my-basc mb-20">
        <div class="my-title mt-10">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">基本信息</span>
        </div>
        <div style="display: flex;align-items: center;">
          <span class="my-title ml-10 mt-10">是否开启Oneid归一化：</span>
          <span class="ml-10 mt-10">{{infoObj.openStatus == '1' ? '已开启' : '已关闭'}}</span>
        </div>
        <div style="display: flex;align-items: center;">
          <span class="my-title ml-10 mt-10">ID映射表：</span>
          <span class="ml-10 mt-10">{{infoObj.sourceMappingName}}</span>
        </div>
        <div style="display: flex;align-items: center;">
          <span class="my-title ml-10 mt-10">映射表调度节点：</span>
          <span class="ml-10 mt-10">{{infoObj.sourceJobName}}</span>
        </div>
      </div>
      <div class="my-basc">
        <div class="my-title mb-15">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">消费信息</span>
        </div>
        <div class="mb-10">
          <span class="my-title ml-10">行为规则</span>
        </div>
        <div>
          <el-table
            :data="behaviorList"
            style="width: 100%">
            <el-table-column
              prop="baseName"
              label="行为名">
                <template slot-scope="scope">
                  <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.baseName}}</OverflowTooltip>
                </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="规则ID">
              <template slot-scope="scope">
                <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.id}}</OverflowTooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mb-10 mt-10">
          <span class="my-title ml-10">标签逻辑表</span>
        </div>
        <div>
          <el-table
            :data="labelList"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="名称" align="center">
                <template slot-scope="scope">
                  <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.name}}</OverflowTooltip>
                </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQueryByMappingId, delJobs } from '@/api/rd/exreact/mapping-id'
import { mapGetters } from 'vuex'
import rdAttr from '@/mixins/rd-attr'
export default {
  name: 'EntityIdAttr',
  mixins: [rdAttr],
  data() {
    return {
      behaviorList: [],
      labelList: [],
      infoObj: {}
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        this._queryByIdInfo()
      }
    }
  },
  methods: {
    editHandle(data) {
      this.setActiveRdEditDialog({
        title: '编辑',
        component: `MappingTableId`,
        data: {...this.project, ...data, isEdit: true}
      })
    },
    delHandle(data) {
      this.$confirm(`请确认是否删除【${data.label}】文件？`, '删除', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$simpleAsyncTo(delJobs({id: data.id}))
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$root.eventEmitter.emit('refresh')
          }
        })
        .catch(async _ => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    async _queryByIdInfo() {
      const res = await this.$simpleAsyncTo(getQueryByMappingId({id: this.data.data.id}), '获取数据失败')
      if (res) {
        this.behaviorList = res.data.behaviorList
        this.labelList = res.data.labelList.map(d => {
          return {
            name: d
          }
        })
        this.infoObj = {
          id: res.data.id,
          sourceMappingName: res.data.sourceMappingName,
          sourceMappingId: res.data.sourceMappingId,
          operUser: res.data.operUser,
          sourceJobId: res.data.sourceJobId,
          sourceJobName: res.data.sourceJobName,
          openStatus: res.data.openStatus
        }
      }
    }
  }
}
</script>

<style lang="scss">
.entoty-id-attr {
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