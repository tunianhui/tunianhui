<template>
  <section :class="['sql-editor', !showBottomContent ? 'no-bottom-content' : '']" ref="editorContainer">
    <MonacoEditor
      :has-bottom-tools="false"
      :minimap="true"
      :code.sync="curCode"
      @change="handleCodeChange"
      ref="monacoEditor"
    ></MonacoEditor>
    <div ref="bottomContainer" class="bottom-container" v-if="showBottomContent">
      <div class="bc-tabs flex-layout">
        <ul class="flex-layout">
          <li
            v-for="item in tabs.filter(t => t.visible)"
            :key="item.name"
            :class="{'is-disabled': !visibleBottom || !isExcuted}"
          >
            <span
              @click="toggleTabHandle(item)"
              :class="{'active': item.name === activeTab}"
            >{{item.lable}}</span>
          </li>
        </ul>
        <span class="collapse">
          <i
            :class="['icon iconfont', visibleBottom ? 'icon-shousuoxiajiantou' : 'icon-shousuoshangjiantou']"
            @click="collapseHandle"
          ></i>
        </span>
      </div>
      <div :class="['container-body', {'is-visible': visibleBottom}]">
        <transition name="fadeinleft" mode="out-in">
          <div
            :class="['console-content',{'autoActive':activeTab === 'console'}]"
            ref="console"
            v-show="activeTab === 'console'"
          >
            <!-- <pre
              v-for="(item, index) in consoles"
              :key="index"
              :class="[item.indexOf('FAILED') !== -1 ? 'err-color':'']"
            >{{item}}</pre>-->
            <pre>{{consoles}}</pre>
          </div>
        </transition>
        <transition name="fadeinleft" mode="out-in">
          <div
            :class="[!results.length?'result-content':'console-content']"
            v-show="activeTab === 'result'"
          >
            <div v-if="!results.length" class="no-result">暂无执行结果</div>
            <div class="tabs-contant" v-else>
              <el-tabs type="border-card" @tab-click="tabClickHandle">
                <el-tab-pane :label="item" v-for="item in results" :key="item">
                  <!-- style="width: 100%" -->
                  <el-table
                    :data="tableData"
                    style="width: 99.5%"
                    :header-cell-style="{background:'#1A2138',color:'#ffffff','border-bottom':'none'}"
                    :max-height="250"
                  >
                    <el-table-column
                      :prop="e"
                      :label="e"
                      v-for="(e,index) in keys"
                      :key="index"
                      :show-overflow-tooltip="true"
                    ></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
            <!-- <el-table :data="result" v-else>
              <el-table-column label="test1" prop="test1"></el-table-column>
              <el-table-column label="test2" prop="test2"></el-table-column>
            </el-table>-->
          </div>
        </transition>
      </div>
    </div>
    <div class="scroll-top" @click="scrollTopHandle" v-if="showBottomContent">
      <i class="icon iconfont icon-icon_topup"></i>
    </div>
  </section>
</template>

<script>
import {scroll} from '@/libs/dom'
import {mapGetters} from 'vuex'
export default {
  name: 'SqlEditor',
  components: {},
  props: {
    excuteFetch: Function,
    compileFetch: Function,
    code: String,
    visibleResult: Boolean,
    excutting: Boolean,
    txt_type: String,
    showBottomContent: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      visibleBottom: false,
      activeTab: 'console',
      tabs: [
        {lable: 'Console', name: 'console', visible: true},
        {lable: 'Result', name: 'result', visible: this.visibleResult}
      ],
      consoles: '',
      result: '',
      isExcuted: false,
      curCode: '',
      results: [],
      tableData: [],
      keys: [],
      resultDatas: {}
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  watch: {
    info: {
      handler(val) {
        this.consoles = val
      },
      deep: true,
      immediate: true
    },
    code: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.isInnerChange) {
          this.isInnerChange = false
          return
        }
        this.curCode = val
      }
    }
  },
  created() {},
  mounted() {
    this.monaco = this.$refs.monacoEditor
  },
  methods: {
    setHeight() {
      this.height =
        this.$refs.editorContainer.clientHeight -
        this.$refs.log.clientHeight -
        33
    },
    handleCodeChange(e) {
      this.isInnerChange = true
      this.$emit('update:code', this.curCode)
    },
    collapseHandle() {
      this.visibleBottom = !this.visibleBottom
    },
    async excute(type, node_name) {
      if (!this.validate()) return
      this.globalLoading()
      this.$emit('update:excutting', true)
      this.isExcuted = true
      // this.consoles = []
      this.visibleBottom = true
      // this.consoles.push('正在提交...')
      let params = {
        sql: this.encrypt(this.monaco.getSelectionsValue()),
        ...this.project
      }
      if (type === 'code-task') {
        params.object_type = this.txt_type
        params.node_name = node_name
      } else {
        params.type = this.txt_type
      }
      const res = await this.$simpleAsyncTo(
        this.excuteFetch(params),
        '执行失败'
      )

      // 因为异步的原因，如果代码没有执行到这里，父组件点击终止，不做任何操作
      if (this.excutting) {
        this.$emit('update:excutting', false)
        // this.consoles.push('提交任务成功！')
        if (res) {
          this.resultDatas = res.data.result
          this.consoles = this.decrypt(res.data.console)
          this.results = []
          for (let key in res.data.result) {
            if (res.data.result.hasOwnProperty(key)) {
              this.results.push(key)
            }
          }
          if (this.results && this.results.length) {
            this.$nextTick(_ => {
              this.tableData = res.data.result[this.results[0]]
              this.keys = Object.keys(res.data.result[this.results[0]][0])
            })
          }
          // const {logs, result} = res.data
          // this.consoles.push(...logs)
          // this.result = result
          let sql = this.monaco.getSelectionsValue().trimLeft()
          let selectIndex = sql.indexOf(' ')
          if (selectIndex > -1) {
            if (sql.substring(0, selectIndex).indexOf('select') > -1 || sql.indexOf('desc') > -1) {
              this.activeTab = 'result'
            } else {
              this.activeTab = 'console'
            }
          }
          this.scrollToBottom()
        }
      } else {
        this.consoles = ['终止执行！']
      }
      this.globalLoading().close()
    },
    async compile(type) {
      if (!this.validate()) return
      this.globalLoading()
      this.consoles = []
      this.results = []
      this.visibleBottom = true
      this.isExcuted = true
      // this.consoles.push('正在提交...')
      this.consoles = '正在提交...'
      let params = {
        // sql: this.curCode,
        sql: this.encrypt(this.monaco.getSelectionsValue()),
        ...this.project
      }
      if (type === 'code-task') {
        params.object_type = this.txt_type
      } else {
        params.type = this.txt_type
      }
      const res = await this.$simpleAsyncTo(
        this.compileFetch(params),
        '预编译失败'
      )
      // this.consoles.push('提交任务成功！')
      this.consoles = '提交任务成功！'
      if (res) {
        // this.consoles.push(JSON.stringify(res.data.console, null, 2))
        // this.result.push(JSON.stringify(res.data.console, null, 2))
        this.consoles = this.decrypt(res.data.console)
        this.results = res.data.result
        let sql = this.monaco.getSelectionsValue().trimLeft()
        let selectIndex = sql.indexOf(' ')
        if (selectIndex > -1) {
          if (sql.substring(0, selectIndex).indexOf('select') > -1 || sql.indexOf('desc') > -1) {
            this.activeTab = 'result'
          } else {
            this.activeTab = 'console'
          }
        }
        this.scrollToBottom()
      }
      this.globalLoading().close()
    },
    toggleTabHandle(tab) {
      if (this.visibleBottom && this.isExcuted) {
        this.activeTab = tab.name
      }
    },
    format() {
      this.monaco.format()
    },
    // 回到顶部
    scrollTopHandle() {
      this.monaco.setScrollTop(0)
    },
    validate() {
      if (!this.curCode.trim()) {
        this.$message({
          showClose: true,
          message: '请先编写代码',
          type: 'error'
        })
        return false
      }
      return true
    },
    async scrollToBottom() {
      await this.$sleep(20)
      const el = this.$refs.console,
        to = el.scrollHeight
      scroll(el, 0, to)
    },
    tabClickHandle(e) {
      if (this.resultDatas.hasOwnProperty(e.label)) {
        this.tableData = this.resultDatas[e.label]
        if (this.resultDatas[e.label] && this.resultDatas[e.label].length) {
          this.keys = Object.keys(this.resultDatas[e.label][0])
        }
      }
    }
  }
}
</script>

<style lang="scss">
$tabHeaderHeight: 30px;
$tabControlsWidth: 70px;
$tabHeaderBg: $sideMenuStress;
$tabHeaderItemColor: $grey10;
$skewWidth: 12px;
$skewDeg: 22deg;
$tabHeaderItemBg: $sideMenu;
$tabHeaderItemActiveColor: $grey2;
$tabHeaderItemActiveBg: $grey10;
$tabHeaderIcon: lighten($--color-primary, 10%);
.sql-editor {
  position: relative;
  height: 100%;
  $tabheight: 50px;
  .custom-monaco-editor {
    height: calc(100% - #{$tabheight});
  }
  &.no-bottom-content {
    .custom-monaco-editor {
      height: 100%;
    }
  }
  .bottom-container {
    background: $sideMenuActive;
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 10;
    .bc-tabs {
      height: $tabheight;
      background: $sideMenuActive;
      line-height: $tabheight;
      justify-content: space-between;
      padding: 0 20px;

      > ul {
        li {
          &.is-disabled {
            span {
              color: $grey4;
              cursor: default;
            }
          }
          span {
            padding: 10px 0px 5px 0px;
            margin-right: 20px;
            color: $grey6;
            font-size: 12px;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            &.active {
              border-bottom: 2px solid currentColor;
            }
          }
        }
      }

      .collapse {
        .icon {
          cursor: pointer;
          color: $grey5;

          &:hover {
            color: $grey7;
          }
        }
      }
    }
    .container-body {
      box-sizing: border-box;
      padding: 0 20px;
      height: 0;
      transition: $transition;
      overflow: hidden;

      &.is-visible {
        height: 320px;
        padding-bottom: 20px;
      }
      .console-content {
        height: 100%;
        background: $sideMenuStress;
        // overflow: auto;
        // padding: 20px;
        color: $grey7;
        line-height: 18px;
        pre {
          font-family: Menlo, Monaco, Courier New, monospace;
          margin: 0;
          font-size: 12px;
        }
        .err-color {
          color: $error;
        }
      }
      .autoActive {
        overflow: auto;
      }

      .no-result {
        margin-top: 15px;
        text-align: center;
        font-size: 14px;
        color: $grey6;
      }
    }
  }
  .scroll-top {
    position: absolute;
    right: 35px;
    bottom: $tabheight + 25px;
    font-size: 30px;
    cursor: pointer;
    color: $grey5;
  }
  .tabs-contant {
    background: $tabHeaderItemBg;
    .el-tabs--border-card {
      width: 100%;
      height: 100%;
      background: $tabHeaderBg;
      border-color: $tabHeaderBg;
      box-shadow: none;
      > .el-tabs__header {
        width: calc(100% - #{$tabControlsWidth});
        height: $tabHeaderHeight;
        border: none;
        background-color: $tabHeaderBg;
        margin: 0;
        > .el-tabs__nav-wrap {
          > .el-tabs__nav-scroll {
            > .el-tabs__nav {
              border: none;
              > .el-tabs__item {
                height: $tabHeaderHeight;
                line-height: $tabHeaderHeight;
                border: none;
                color: $tabHeaderItemColor;
                margin-left: 10px;
                background: $sideMenu;
                position: relative;
                z-index: 0;
                transition: $transition;
                &::before,
                &:after {
                  content: '';
                  position: absolute;
                  top: 0;
                  width: $skewWidth;
                  height: 100%;
                  background-color: $sideMenu;
                  transition: $transition;
                }
                &::before {
                  left: -$skewWidth / 2;
                  transform: skew(-$skewDeg);
                  z-index: 2;
                  box-shadow: -2px 0px 2px rgba($tabHeaderItemBg, 0.3);
                }
                &::after {
                  right: -$skewWidth / 2;
                  transform: skew($skewDeg);
                  z-index: 3;
                  box-shadow: 2px 0px 2px rgba($tabHeaderItemBg, 0.3);
                }
                &.is-active {
                  position: relative;
                  z-index: 1;
                  color: $tabHeaderItemActiveBg;
                  background: $tabHeaderBg;
                  z-index: 2;
                  &::before,
                  &::after {
                    background: $tabHeaderBg;
                  }

                  &.tab-head-black {
                    color: #fff;
                    background: $sideMenuActive;
                    &::before,
                    &::after {
                      background: $sideMenuActive;
                    }
                  }
                }
                .label {
                  span {
                    display: inline-block;
                    max-width: 100px;
                    line-height: normal;
                    position: relative;
                    top: 4px;
                    margin-left: 3px;
                    vertical-align: top !important;
                    @include textEllipsis;
                  }
                  .iconfont {
                    margin-right: 3px;
                    color: $tabHeaderIcon;
                    font-size: 16px;
                    font-weight: 500;
                  }
                }
              }
            }
          }
        }
      }
      > .el-tabs__content {
        height: calc(100% - #{$tabHeaderHeight});
        overflow: hidden;
        .el-tab-pane {
          height: 100%;
          overflow: auto;
          .el-table {
            background: $tabHeaderBg;
            .el-table__header-wrapper {
              border-bottom: 1px solid;
            }
            tr {
              background: $tabHeaderBg;
            }
            td {
              border-bottom: none !important;
            }
            tbody tr:hover > td {
              background-color: $tabHeaderBg !important;
            }
            &::before {
              height: 0 !important;
            }
            .cell {
              color: $tabHeaderItemActiveBg;
            }
            th {
              background: $tabHeaderBg;
            }
            .el-table__body-wrapper {
              // height: calc(100% - 36px)!important;
            }
          }
        }
      }
    }
  }
}
</style>
