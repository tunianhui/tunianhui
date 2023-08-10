<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    style="width: 100%"
    :class="['script-table-example', showDag ? 'active' : '']"
  >
    <el-table-column prop="teskObj" label="实例对象"  min-width="300">
      <div class="tesk-obj" slot-scope="scope">
        <div class="check-box ml-10 mr-10" v-if="showCheckBox">
          <el-checkbox v-model="scope.check"></el-checkbox>
        </div>
        <div class="table-icon">
          <i class="iconfont icon-zhouqirenwu4"></i>
        </div>
        <div class="name-code">
          <span class="name" @click="clickhand(scope.row)">{{scope.row.name}}</span>
          <span class="code">{{scope.row.code}}</span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="runStatus" label="运行状态" width="120">
      <div class="run-status" slot-scope="scope">
        <div class="field">
          <span :class="['drop', scope.row.runStatus === '1' ? 'incomplete': 'success']"></span>
          <span>字段:</span>
          <span>5</span>
          <span>
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              popper-class="ul-menu-popover"
            >
              <i slot="reference" class="iconfont icon-chakanshili"></i>
              <el-table :data="fieldTableData" style="width: 100%">
                <el-table-column label="字段">
                  <div slot-scope="subscope">
                    <div>{{subscope.row.field}}</div>
                    <div>{{subscope.row.code}}</div>
                  </div>
                </el-table-column>
              <el-table-column prop="status" label="归一运行状态" align="right">
                <template slot-scope="subscope">
                  <i :class="['mr-5', statusList[subscope.row.status] && statusList[subscope.row.status].icon]" :style="{color: statusList[subscope.row.status] && statusList[subscope.row.status].color}"></i>
                  <span>{{statusList[subscope.row.status] && statusList[subscope.row.status].name}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex; align-items: center;padding:10px">
              <i class="iconfont icon-baojing font-14 mr-10" style="color:#2D73FF"></i>
              <p style="font-size: 12px; color: rgba(0,0,0,0.5);">未名展示字段的归一运行状态，您无需关注每个字段所需的物化节点运行状态，运行成功即代表改字段数据已产出</p>
            </div>
            </el-popover>
          </span>
        </div>
        <div class="node">
          <span :class="['drop', scope.row.runStatus === '1' ? 'incomplete': 'success']"></span>
          <span>节点:</span>
          <span>5</span>
          <span>
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              popper-class="ul-menu-popover"
            >
              <i slot="reference" class="iconfont icon-chakanshili"></i>
              <el-table :data="fieldTableData" style="width: 100%">
                <el-table-column label="字段">
                  <div slot-scope="subscope">
                    <div>{{subscope.row.field}}</div>
                    <div>{{subscope.row.code}}</div>
                  </div>
                </el-table-column>
                <el-table-column prop="status" label="归一运行状态" align="right">
                  <template slot-scope="subscope">
                    <i :class="['mr-5', statusList[subscope.row.status] && statusList[subscope.row.status].icon]" :style="{color: statusList[subscope.row.status] && statusList[subscope.row.status].color}"></i>
                    <span>{{statusList[subscope.row.status] && statusList[subscope.row.status].name}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="display: flex; align-items: center;padding:10px">
                <i class="iconfont icon-baojing font-14 mr-10" style="color:#2D73FF"></i>
                <p style="font-size: 12px; color: rgba(0,0,0,0.5);">未名展示字段的归一运行状态，您无需关注每个字段所需的物化节点运行状态，运行成功即代表改字段数据已产出</p>
              </div>
            </el-popover>
          </span>
        </div>
      </div>
    </el-table-column>
    <el-table-column prop="cycle" label="调度周期" width="80"></el-table-column>
    <el-table-column prop="businessDate" label="业务日期" width="160"></el-table-column>
    <el-table-column prop="startRunDatetime" label="开始运行时间" width="160"></el-table-column>
    <el-table-column prop="endRunDatetime" label="结束运行时间" width="160"></el-table-column>
    <el-table-column prop="runTime" label="运行时长" width="80"></el-table-column>
    <el-table-column prop="priority" label="优先级" width="60"></el-table-column>
    <el-table-column prop="curator" label="负责人" width="80"></el-table-column>
    <el-table-column prop="relatedBaselines" label="相关基线" width="180">
      <template slot="header">
        <span class="mr-5">相关基线实例</span>
        <el-tooltip class="item" effect="dark" content="若未开通基线功能，无该字段信息" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </template>
      <div class="related-baselines" slot-scope="scope">
        <span>
          {{scope.row.relatedBaselines}}
        </span>
        <span>查看所有相关基线</span>
      </div>
    </el-table-column>
    <el-table-column label="操作" align="right" width="150">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="DAG图" placement="top">
          <i class="iconfont icon-dag_ETL font-14 cursor mr-15" @click="showDagHande(scope.row)"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="运行日志" placement="top">
          <i class="iconfont icon-run-log font-14 cursor mr-15"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="重跑" placement="top">
          <i class="iconfont icon-zhongpao font-14 cursor mr-15"></i>
        </el-tooltip>
        <el-popover
          placement="bottom-end"
          width="100"
          trigger="click"
          popper-class="ul-menu-popover"
        >
          <i slot="reference" class="iconfont icon-diandian font-14 cursor"></i>
          <UlMenu :menuList="menuList"></UlMenu>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const UlMenu = {
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    return (
      <ul class="ul-menu">
        {
          this.menuList.map(item => {
            return  item.chidren ? (
              <el-popover
                  placement="left"
                  width="100"
                  trigger="click"
                  popper-class="ul-menu-popover"
                >
                <li class="li-menu" key={item.id} slot="reference">
                  <i class={`iconfont icon-${item.icon}`}></i>
                  <span>{item.name}</span>
                  <i class="el-icon-arrow-right ml-50"></i>
                </li>
                <UlMenu menuList={item.chidren}></UlMenu>
              </el-popover>
            ) : (
              <li class="li-menu" key={item.id}>
                <i class={`iconfont icon-${item.icon}`}></i>
                <span>{item.name}</span>
              </li>)
          })
        }
      </ul>
    )
  }
}

export default {
  name: 'DetailTableCucleExample',
  components: {
    UlMenu
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    showDag: {
      type: Boolean,
      default: false
    },
    showCheckBox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: [
        {
          name: '实例对象',
          code: 'n_155566662',
          runStatus: '1',
          cycle: '日',
          businessDate: '2020-10-10',
          startRunDatetime: '2020-10-10 10:10:10',
          endRunDatetime: '2020-10-10 10:10:10',
          runTime: '10s',
          priority: '高',
          scheduledRunningTime: '2020-10-10 10:10:10',
          curator: '张三',
          relatedBaselines: '基线1',
          resourceGroup: '资源组1'
        },
      ],
      menuList: [
        { id: 1, name: '字段及批量操作', icon: 'piliangcaozuo' },
        { id: 2, name: '查看生产链路', icon: 'chakanshengchanlianlu' },
        { id: 3, name: '查看消费链路', icon: 'chakanxiaofeilianlu' },
        { id: 4, name: '查看物化代码', icon: 'wuhuadaima' },
        { id: 5, name: '周期任务', icon: 'zhouqirenwu1' },
        { id: 6, name: '编辑开发节点', icon: 'bianjikaifajiedian-xin' },
        { id: 7, name: '查看生产节点', icon: 'yunweigengduo-chakanshengchanjiedian' },
        { id: 8, name: '重跑下游', icon: 'zhongpaoxiayou' },
        { id: 9, name: '置成功继续调度', icon: 'zhichenggongjixutiaodu' },
        { id: 10, name: '终止', icon: 'zhongzhi' },
        { id: 11, name: '强制重跑', icon: 'qiangzhizhongpao', chidren: [
            { id: 111, name: '强制重跑当前实例', icon: '' },
            { id: 112, name: '强制重跑下游实例', icon: '' }
          ]
        },
        { id: 12, name: '去除上游依赖', icon: 'quchushangyouyilai' },
        { id: 13, name: '暂停', icon: 'execute-' },
        { id: 14, name: '恢复', icon: 'huifu' }
      ],
      fieldTableData: [
        { field: 'name', code: 'name', status: '1' }
      ],
      statusList: {
        1: { name: '未运行', color: '#ccc', icon: 'iconfont icon-weikaiqi' },
        2: { name: '等待中', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        3: { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        4: { name: '失败', color: '#FF7474', icon: 'el-icon-error' },
        5: { name: '成功', color: '#4AC059', icon: 'iconfont icon-yikaiqi' },
      },
    }
  },
  methods: {
    showDagHande(row) {
      this.$emit('showDagHande', row)
    },
    clickhand(srow) {
      this.$emit('showDagHande', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.tesk-obj {
  display: flex;
  align-items: center;
  height: 100%;
  .table-icon {
    i {
      font-size: 28px;
      color: #2D73FF;
      margin-right: 8px;
      display: flex;
    }
  }
  .name-code {
    display: flex;
    flex-direction: column;
    .name {
      cursor: pointer;
      color: #2D73FF;
    }
  }
}
.related-baselines {
  display: flex;
  flex-direction: column;
  >span {
    cursor: pointer;
    color: #2D73FF;
  }
}
.cursor {
  cursor: pointer;
}
.ul-menu {
  padding: 3px 0;
  ::v-deep {
    .li-menu {
      padding: 6px 10px;
      display: flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.65);
      i:first-child {
        margin-right: 8px;
      }
      span {
      }
      &:hover {
        background: rgba($color: #000000, $alpha: 0.08);
      }
    }
  }
}
.script-table {
  &.active {
    ::v-deep .el-table__body-wrapper {
      // overflow-x: hidden!important;
    }
  }
}
.run-status {
  .field,.node {
    display: flex;
    align-items: center;
    >span:nth-child(2),>span:nth-child(3) {
      margin-right: 4px;
      color: rgba($color: #000000, $alpha: 0.85);
    }
    >span:last-child {
      i {
        font-size: 12px;
        color: #2D73FF;
        cursor: pointer;
      }
    }
    .drop {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 4px;
      margin-top: 2px;
      &.incomplete {
        background: #BDBDBD;
      }
      &.success {
        background: #4AC059;
      }
    }
  }
}
</style>

<style lang="scss">
.ul-menu-popover {
  padding: 0;
  .ul-menu {
  padding: 3px 0;
    .li-menu {
      padding: 6px 10px;
      display: flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.65);
      i:first-child {
        margin-right: 8px;
      }
      i:last-child {
        margin-left: 48px;
      }
      span {
      }
      &:hover {
        background: rgba($color: #000000, $alpha: 0.08);
      }
    }
  }
}
</style>