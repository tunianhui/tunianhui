<template>
  <section class="run-log">
    <header class="pl-20">运行日志</header>
    <section class="log-list flex-layout">
      <div class="list">
        <div :class="['item', {'active': item.exec_id === active.exec_id}]" v-for="item in logList" :key="item.exec_id" @click="changeActive(item)">
          <i :class="statusMap[item.status].icon"></i>
          <div class="ml-5 mr-5">{{item.start_time}} 至 {{item.end_time}}<br />
            ( <span>{{item.run_Duration}}</span>)
          </div>
          <i class="el-icon-refresh" @click.stop="refresh(item)" v-show="active.exec_id === item.exec_id"></i>
        </div>
      </div>
      <div class="code flex-1 flex-layout">
        <MonacoEditor :code.sync="log" :readonly="true"></MonacoEditor>
      </div>
    </section>
  </section>
</template>

<script>
import { getRunLog, listHistoryLog } from '@/api/rd/ops'
// import {scroll} from '@/libs/dom'
import { statusMap } from '@/config/ops-config'
import { mapGetters } from 'vuex'
export default {
  name: 'RunLog',
  components: {},
  data () {
    return {
      statusMap,
      logList: [],
      active: Object.create(null),
      currentId: null,
      log: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created () {
    this.getLogList()
  },
  mounted () { },
  methods: {
    async getLogList () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        listHistoryLog({ instance_id: this.$route.query.id, skd_prj_id: this.project.skd_prj_id }),
        '获取日志失败'
      )
      if (res) {
        this.logList = res.data
        this.active = this.logList[0] || Object.create(null)
        this.log = ''
        this.logList[0] && this.getLog()
      }
      this.loading--
    },
    refresh (data) {
      this.log = ''
      this.getLog({
        exec_id: data.exec_id
      })
    },
    async getLog (params) {
      this.loading++
      if (!params) {
        const { exec_id, offset, length, session_id } = this.active
        params = {
          exec_id,
          offset,
          length,
          session_id,
          skd_prj_id: this.project.skd_prj_id
        }
      }
      const res = await this.$simpleAsyncTo(
        getRunLog(params), '获取日志失败'
      )
      if (res) {
        this.log += res.data
        this.active.offset = res.offset
        this.active.length = res.length
        this.active.session_id = res.session_id

        !res.isEnd && this.getLog()
      }
      this.loading--
    },
    changeActive (data) {
      if (this.active.exec_id === data.exec_id) return
      this.active = data
      this.log = ''
      const { exec_id, offset, length, session_id } = this.active
      this.getLog({
        exec_id,
        offset,
        length,
        session_id
      })
    }
  }
}
</script>

<style lang="scss">
.run-log {
  $height: 50px;
  $item-height: 20px;
  height: calc(100% - 50px);
  header {
    height: $height;
    line-height: $height;
    border: 1px solid $grey5;
  }
  .log-list {
    height: 100%;
    padding: 20px;
    font-size: 12px;
    .list {
      width: 310px;
      border: 1px solid $grey5;
      overflow: auto;
      .color {
        color: $error;
      }
      .item {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        padding: 15px;
        border-bottom: 1px solid $grey5;
        cursor: pointer;
        i {
          font-size: 16px;
        }
        .err {
          color: $error;
        }
        &.active {
          background: $grey8;
        }
      }
    }
    .code {
      background: $editorDarkBg;
      overflow-y: auto;
    }
  }
}

</style>
