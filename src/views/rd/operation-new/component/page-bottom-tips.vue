<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-04 16:35:29
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-07 13:55:36
 * @FilePath: \dataphin\src\views\rd\operation-new\component\page-bottom-tips.vue
-->
<template>
  <div class="page-bottom-tips">
    <div>
      <div class="bottom-tips-check" v-if="showPageCheck">
        <el-checkbox v-model="checked" @change="val => $emit('changeCheck', val)"></el-checkbox>
        <span>本页全选</span>
      </div>
      <ul class="bottom-tips-actionlist" v-if="!showDag">
        <template v-for="item in actiosList">
          <li :class="[disabled ? 'disable-click' : '']" :key="item.name" @click="clickHandle(item)" v-if="item.viewType !== 'dropdown'">
            <!-- <i class="el-icon-video-play"></i> -->
            <i :class="item.icon"></i>
            <span class="tips-action-name">{{item.name}}</span>
          </li>
          <li :class="[disabled ? 'disable-click' : '']" :key="item.name" v-if="item.viewType === 'dropdown'">
            <i :class="item.icon"></i>
            <el-dropdown trigger="click" @command="val => handleCommand(val, item)">
              <span class="el-dropdown-link font-12">
                {{item.name}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="subItem in item.children" :key="subItem.value" :command="subItem.command">{{subItem.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </template>
      </ul>
    </div>
    <div>
      <el-pagination
        :layout="showDag ? `prev, pager, next` : paginationLayput"
        :total="total"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :pager-count="5"
        @current-change="val => $emit('currentChange', val)"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageBottomTips',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    actiosList: {
      type: Array,
      default: () => []
    },
    paginationLayput: {
      type: String,
      default: 'prev, pager, next'
    },
    total: {
      type: Number,
      default: 0
    },
    showDag: {
      type: Boolean,
      default: false
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showPageCheck: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      checked: false
    }
  },
  methods: {
    clickHandle(item) {
      if (item.command) {
        this.$emit(item.command)
      }
    },
    handleCommand(command, item) {
      if (item.children) {
        item.name = item.children.find(subitem => subitem.command === command).label
      }
      this.$emit(command, item)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-bottom-tips {
  display: flex;
  position: absolute;
  justify-content: space-between;
  // align-items: center;
  line-height: 36px;
  bottom: 36px;
  right: 0;
  left: 0;
  background-color: #f8f8fa;
  width: inherit;
  height: 36px;
  padding: 0 20px 0 14px;
  z-index: 9;
  box-shadow: -10px 0 10px transparent,0 -5px 13px rgba(0,0,0,0.15),10px 0 10px transparent,0 10px 10px transparent;
  >div:first-child {
    display: flex;
    align-items: center;
    .bottom-tips-check {
      > span {
        font-size: 12px;
        color: rgba(0,0,0,0.85);
        margin-left: 10px;
      }
    }
    .bottom-tips-actionlist {
      margin: 0;
      padding: 0;
      display: flex;
      list-style-type: none;
      margin-left: 12px;
      cursor: pointer;
      li {
        padding-right: 20px;
        &.disable-click {
          cursor: not-allowed;
          color: #cecece;
        }
        .tips-action-name {
          position: relative;
          font-size: 12px;
          color: rgba(0,0,0,0.75);
        }
        i {
          margin-right: 5px;
          vertical-align: middle;
          color: rgba(0,0,0,0.75);
        }
      }
    }
  }
  ::v-deep .el-pager li {
    background: transparent;
  }
  ::v-deep .el-pagination .btn-prev, ::v-deep .el-pagination .btn-next {
    background: transparent;
  }
}
</style>