<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-08 15:35:39
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-08 18:21:20
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\record-example\sub-table.vue
-->
<template>
  <el-table
    ref="table"
    :data="tableData"
    :max-height="300"
    row-key="id"
    style="width: 100%"
  >
    <el-table-column prop="teskObj" label=""  min-width="300">
      <template slot="header">
        <span style="margin-left:101px">实例对象</span>
      </template>
      <div class="tesk-obj" slot-scope="scope">
        <div class="check-box" style="width:55px;text-align:center">
          <el-checkbox v-model="scope.check"></el-checkbox>
        </div>
        <div class="name-code">
          <span class="name" @click="showDagHande">{{scope.row.name}}</span>
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
    <el-table-column prop="priority" label="优先级" width="160"></el-table-column>
    <el-table-column prop="scheduledRunningTime" label="定时运行时间" width="160"></el-table-column>
    <el-table-column prop="startRunDatetime" label="开始运行时间" width="160"></el-table-column>
    <el-table-column prop="endRunDatetime" label="结束运行时间" width="160"></el-table-column>
    <el-table-column prop="runTime" label="运行时长" width="80"></el-table-column>
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
          <i slot="reference" class="iconfont icon-diandian font-14 cursor pr-10"></i>
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
            return (
              <li class="li-menu" key={item.id}>
                <i class={`iconfont icon-${item.icon}`}></i>
                <span>{item.name}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }
}
export default {
  name: 'SubRecordTableExample',
  components: {
    UlMenu
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: '实例名称',
          code: 'n_111111111112555'
        }
      ],
      statusList: {
        1: { name: '未运行', color: '#ccc', icon: 'iconfont icon-weikaiqi' },
        2: { name: '等待调度资源', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        3: { name: '限流中', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        4: { name: '等待调度时间', color: '#A186FF', icon: 'iconfont icon-shenhezhong' },
        5: { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        6: { name: '失败', color: '#FF7474', icon: 'el-icon-error' },
        7: { name: '运行中', color: '#4AC059', icon: 'iconfont icon-yikaiqi' },
      },
      fieldTableData: [],
      menuList: [
        { id: 1, name: '查看节点代码', icon: 'yunweigengduo-chakanjiediandaima' },
        { id: 2, name: '周期任务', icon: 'zhouqirenwu2' },
        { id: 3, name: '编辑开发节点', icon: 'bianjikaifajiedian-xin' },
        { id: 4, name: '查看生产节点', icon: 'yunweigengduo-chakanshengchanjiedian' },
        { id: 5, name: '重跑下游', icon: 'zhongpaoxiayou' },
        { id: 6, name: '置成功继续调度', icon: 'zhichenggongjixutiaodu' },
        { id: 7, name: '终止', icon: 'zhongzhi' },
        { id: 8, name: '强制重跑', icon: 'qiangzhizhongpao' },
        { id: 9, name: '去除上游依赖', icon: 'quchushangyouyilai' },
        { id: 10, name: '暂停', icon: 'execute-' },
        { id: 11, name: '恢复', icon: 'huifu' }
      ]
    }
  },
  methods: {
    showDagHande() {
      this.$emit('showDagHande')
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
    margin-left: 55px;
    .name {
      cursor: pointer;
      color: #2D73FF;
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

