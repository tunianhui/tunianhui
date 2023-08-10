<template>
  <div class="trial-run">
		<header class="pl-20 pr-20">
			<span>试跑日志</span>
			<span><el-button type="primary" @click="_getDolphinsTestLog">刷新日志</el-button></span>
		</header>
		<div class="box-run">
			<MonacoEditor :code.sync="code" readonly></MonacoEditor>
			<div ref="bottomContainer" class="bottom-container" v-loading="loading">
				<div class="bc-tabs flex-layout">
					<ul class="flex-layout">
						<li>
							<span>日志</span>
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
							:class="['console-content', 'autoActive']"
						>
							<pre>{{consoles}}</pre>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
  getDolphinsFlowTest,
  getDolphinsTestLog
} from '@/api/rd/fact-table'
import {
  getDolphinsFlowTestDim,
  getDolphinsTestLogDim
} from '@/api/rd/dimension-table'
export default {
	name: 'TrialRun',
	data() {
		return {
			code: '',
			visibleBottom: true,
      consoles: '',
      offset: '',
      length: '',
      loading: false
		}
	},
  created() {
    this.getTrialRunInfo()
  },
	methods: {
		collapseHandle() {
      this.visibleBottom = !this.visibleBottom
    },
    async getTrialRunInfo() {
      let params = {}, fn = null
      if (this.$route.query.type === 'fact') {
        params.fact_logic_id = this.$route.query.id
        fn = getDolphinsFlowTest
      } else if (this.$route.query.type === 'dim') {
        params.dim_id = this.$route.query.id
        fn = getDolphinsFlowTestDim
      }
      const res = await this.$simpleAsyncTo(fn(params), '获取数据失败')
      if (res) {
        this._getDolphinsTestLog()
        this.code = this.decrypt(res.sql_context)
      }
    },
    async _getDolphinsTestLog() {
      this.loading = true
      let params = {}, fn = null
      if (this.$route.query.type === 'fact') {
        params = {
          fact_logic_id: this.$route.query.id,
          offset: this.offset,
          length: this.length
        }
        fn = getDolphinsTestLog
      } else if (this.$route.query.type === 'dim') {
        params = {
          dim_id: this.$route.query.id,
          offset: this.offset,
          length: this.length
        }
        fn = getDolphinsTestLogDim
      }
      const res = await this.$simpleAsyncTo(fn(params), '获取日志失败')
      if (res) {
        this.consoles = res.data
        this.offset = res.offset
        this.length = res.length
      }
      this.loading = false
    }
	}
}
</script>

<style lang="scss" scoped>
.trial-run {
  height: 100%;
  header {
    height: 50px;
    line-height: 50px;
    border: 1px solid $grey5;
		display: flex;
		justify-content: space-between;
  }
	.box-run {
		height: calc(100% - 50px);
		position: relative;
	}
	.bottom-container {
		background: $sideMenuActive;
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 10;
		$tabheight: 50px;
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
        color: $grey7;
        line-height: 18px;
        pre {
          font-family: Menlo, Monaco, Courier New, monospace;
          margin: 0;
          font-size: 12px;
        }
      }
      .autoActive {
        overflow: auto;
      }
    }
	}
}
</style>
