<template>
  <div class="search-wrapper">
    <div class="nav-wrapper">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in typeList" :name="item.value" :key="index">
          <span slot="label"><i :class="item.icon" :style="{color: item.color}"></i> {{item.name}}</span>
        </el-tab-pane>
      </el-tabs>
      <div>
        <el-input class="input-keyword" v-model="keyword2" placeholder="请输入"></el-input>
        <el-button class="ml-10" type="primary" @click="searchClick">搜索</el-button>
      </div>
    </div>

    <DataTable v-if="activeName === '1'" ref="dataTable" :keyword="keyword2"></DataTable>
    <Indicator v-if="activeName === '2'" ref="indicator" :keyword="keyword2"></Indicator>
    <Field v-if="activeName === '3'" ref="field" :keyword="keyword2"></Field>
    <DataSource v-if="activeName === '4'" ref="dataSource" :keyword="keyword2"></DataSource>
    <Service v-if="activeName === '5'" ref="service" :keyword="keyword2"></Service>
    <Project v-if="activeName === '6'" ref="project" :keyword="keyword2"></Project>
    <Function v-if="activeName === '7'" ref="function" :keyword="keyword2"></Function>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import DataTable from './dataTable'
import Indicator from './indicator'
import Field from './field'
import Function from './function'
import Project from './project'
import DataSource from './dataSource'
import Service from './service'
import store from '@/store'
export default {
  name: 'SearchResult',
  components: {
    DataTable,
    Indicator,
    Field,
    Function,
    Project,
    DataSource,
    Service
  },
  mixins: [pager],
  data () {
    return {
      activeName: '1',
      keyword2: '',
      typeList: [
        {
          name: '数据表',
          value: '1',
          icon: 'iconfont icon-guize',
          color: '#d09607',
          hidden: false
        },
        {
          name: '指标',
          value: '2',
          icon: 'iconfont icon-tubiao-zhexiantu',
          color: '#3b7e26',
          hidden: false
        },
        {
          name: '字段',
          value: '3',
          icon: 'iconfont icon-code-guanjianci',
          color: '#7c77d4',
          hidden: false
        },
        {
          name: '数据源',
          value: '4',
          icon: 'iconfont icon-yuanshuju',
          color: '#db6e71',
          hidden: false
        },
        {
          name: '服务',
          value: '5',
          icon: 'iconfont icon-nav_icon_fuwuqiguanl',
          color: '#f9b242',
          hidden: false
        },
        {
          name: '项目',
          value: '6',
          icon: 'iconfont icon-xiangmu',
          color: '#58a5ad',
          hidden: false
        },
        {
          name: '函数',
          value: '7',
          icon: 'iconfont icon-functions',
          color: '#5888d7',
          hidden: false
        }
      ]
    }
  },
  watch: {
    keyword: {
      deep: true,
      immediate: true,
      handler (val) {
        const keyword = localStorage.getItem('keyword')
        this.keyword2 = keyword || ''
        this.activeName = localStorage.getItem('activeName')
      }
    }
  },
  computed: {
    keyword () {
      return (JSON.parse(this.$route.query.data || 'null') || {}).keyword
    }
  },

  created () {
    const listBtn = store.getters.menuAuths['list'].btns.split('|') || []
    this.typeList = this.typeList.filter(d => {
      if (listBtn.includes(d.value)) return d
    })
  },
  mounted () {

  },
  methods: {
    searchClick () {
      const activeName = this.activeName
      switch (activeName) {
        case '1':
          this.$refs.dataTable.updateData()
          break
        case '2':
          this.$refs.indicator.updateData()
          break
        case '3':
          this.$refs.field.updateData()
          break
        case '4':
          this.$refs.dataSource.updateData()
          break
        case '5':
          this.$refs.service.updateData()
          break
        case '6':
          this.$refs.project.updateData()
          break
        case '7':
          this.$refs.function.updateData()
          break
        default:
          break
      }
    },

    handleClick (val) {
      localStorage.setItem('activeName', this.activeName)
    }
  }
}
</script>
<style lang="scss">
$leftWidth: 360px;
.search-wrapper {
  height: 100%;
  .nav-wrapper {
    padding: 0 20px;
    // background-color: #eaecef;
    background: #e3e9ea;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.31);
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-weight: bold;
      i {
        font-weight: bold;
      }
    }
    .input-keyword {
      width: 300px;
    }
  }
}
.search-result {
  padding: 0 10px 10px 10px;
  min-height: calc(100% - 100px);
  background-color: $grey8;
  height: 100%;

  .iconfont {
    margin-right: 5px;
    color: #39c254;
  }
  .left-condition {
    width: $leftWidth;
    background: #fff;
    padding: 20px;
    .screen {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 14px;
      .refresh-opt {
        cursor: pointer;
      }
    }
    .screen-list {
      font-size: 12px;
      position: relative;
      .sub-toggle {
        position: absolute;
        right: -10px;
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
      .screen-item {
        display: inline-flex;
        overflow: hidden;
        height: 28px;
        padding: 0px 12px;
        align-items: center;
        border: 1px solid transparent;
        background-color: rgba(33, 83, 212, 0.05);
        margin: 0 5px 5px 0;
        .close {
          position: relative;
          width: 14px;
          height: 14px;
          align-self: flex-end;
          margin-right: -20px;
          margin-left: 6px;
          background: #2153d4;
          cursor: pointer;
          transform: skewX(-45deg);
          i {
            color: $grey10;
            position: absolute;
            top: 3.5px;
            right: 3.5px;
            font-weight: bolder;
            transform: skewX(45deg) scale(0.45);
            transition: transform 0.2s ease;
          }
        }
        &:hover {
          background-color: $grey6;
        }
        &.active {
          border: 1px solid $--color-primary;
          color: $--color-primary;
          .close {
            background: #2153d4;
          }
          &:hover {
            background-color: $grey8;
          }
        }
      }
    }
    .filter-text {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      line-height: 27px;
    }
    .label-title {
      color: #666666;
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .refresh-opt {
      font-size: 14px;
      line-height: 24px;
      color: #409eff;
    }
    .el-input__inner {
      width: 267px;
      height: 34px;
      border: 1px solid #c8c8c8;
      border-radius: 1px;
    }
  }
  .right-result {
    padding: 0 0 0 10px;
    .list-title {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      margin: 10px 0;
      i {
        font-size: 16px;
        cursor: pointer;
      }
    }
    .table-list {
      background: $grey10;
      padding: 20px 20px 0 20px;
      margin-bottom: 10px;
      height: calc(100% - 160px);
      overflow: auto;
      .icons {
        i {
          font-size: 28px;
          // color: $warning;
        }
      }
      .name {
        font-size: 14px;
        cursor: pointer;
        width: calc(100% - 20px);
        > h4 {
          span {
            width: calc(100% - 20px);
          }
        }
      }
      .info {
        font-size: 12px;
        > div {
          width: 33.33333%;
          span {
            width: calc(100% - 80px);
            color: $grey2;
          }
        }
      }
    }
    .color {
      color: $grey4;
    }
  }
}
</style>
