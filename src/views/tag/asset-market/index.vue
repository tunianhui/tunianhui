<template>
  <div class="asset-market">
    <div class="search-header" v-resize="resizeDom">
      <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select" style="width:600px" size="medium">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:120px;background:#fff">
          <el-option label="公共市场" value="1"></el-option>
        </el-select>
        <el-button slot="append">搜索</el-button>
      </el-input>
    </div>
    <div class="content">
      <div class="side-menu-wrapper">
        <el-collapse v-model="activeNames">
          <el-collapse-item :name="item.id" v-for="item in categoryList" :key="item.id">
            <span slot="title" class="title">{{item.name}}</span>
            <el-collapse v-model="activeNames1">
              <template v-for="subItem in item.children">
                <el-collapse-item
                  :name="subItem.id"
                  :class="[!(subItem.children && subItem.children.length > 0) ? 'none-icon' : '']"
                  :key="subItem.id"
                  v-if="subItem.children && subItem.children.length"
                >
                  <span slot="title" class="title">{{subItem.name}}({{subItem.count}})</span>
                  <div class="item-wrapper">
                    <div :class="['item', data.id === activeId ? 'active' : '']" v-for="data in subItem.children" :key="data.id" @click="activeId = data.id">
                      <span>{{data.name}}({{data.count}})</span>
                    </div>
                  </div>
                </el-collapse-item>
                <div class="item-wrapper" v-else :key="subItem.id">
                  <div :class="['item', subItem.id === activeId ? 'active' : '']" @click="activeId = subItem.id">
                    <span>{{subItem.name}}({{subItem.count}})</span>
                  </div>
                </div>
              </template>
             
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="center-wrapper" v-resize="resizeDom1">
        <AssetMarketHeader />
        <Table :height="height"></Table>
      </div>
      <div class="right-wrapper">
        <div class="top-box">
          <div>
            <div>上新榜</div>
            <div>热用榜</div>
          </div>
          <div>最新上架标签TOP30排行榜</div>
        </div>
        <div class="top-30-wrapper">
          <template v-for="(item, index) in top30List">
            <div class="item"  :key="item.name">
              <div>
                <i class="iconfont icon-paiming1" style="color: #F4AF40" v-if="index === 0"></i>
                <i class="iconfont icon-paiming" style="color: #8396A5" v-if="index === 1"></i>
                <i class="iconfont icon-mingci" style="color: #B88F7B" v-if="index === 2"></i>
                <span v-if="index !== 2 && index !== 1 && index !== 0">{{index + 1}}</span>
              </div>
              <div>
                <span>
                  <span>decimal_005</span>
                  <span>(decimal_005)</span>
                </span>
                <span>-</span>
              </div>
              
            </div>
            <el-divider :key="item.name" style="margin: 10px 0"></el-divider>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AssetMarketHeader from './header.vue'
import Table from './table.vue'
export default {
  name: 'AssetMarket',
  components: {
    AssetMarketHeader,
    Table
  },
  data() {
    return {
      searchKey: '',
      select: '1',
      activeNames: [1],
      activeNames1: ['1'],
      activeId: '',
      categoryList: [
        {
          id: 1,
          name: '标签类目',
          children: [
            {
              id: 11,
              name: '客户',
              count: 4,
              children: [
                {
                  id: 111,
                  name: '基本信息',
                  count: 2,
                },
                {
                  id: 112,
                  name: '投资信息',
                  count: 2,
                },
              ]
            },
            {
              id: 12,
              name: '员工',
              count: 1,
              children: [
                {
                  id: 121,
                  name: '张三',
                  count: 1,
                }
              ]
            },
            {
              id: 13,
              name: '金融产品',
              count: 16,
            },
          ]
        }
      ],
      height: '',
      top30List: [
        {
          name: 'decimal_005'
        },
        {
          name: 'decimal_005'
        },
        {
          name: 'decimal_005'
        },
        {
          name: 'decimal_005'
        },
        {
          name: 'decimal_005'
        },
        {
          name: 'decimal_005'
        },
        {
          name: 'decimal_005'
        }
      ]
    }
  },
  methods: {
    resizeDom(data) {
      console.log(data)
      const { height } = data
      this.$nextTick(() => {
        const dom = document.querySelector('.content')
        dom.style.height = `calc(100% - ${height})`
      })
    },
    resizeDom1(data) {
      console.log(data)
      this.height = parseInt(data.height) - 48 - 40 + 'px'
    }
  },
}
</script>

<style lang="scss" scoped>
.asset-market {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-size: 100% 100%;
  background-image: url('~@/assets/images/bg111.png');
  .search-header {
    padding: 25px 0;
    display: flex;
    justify-content: center;
    ::v-deep {
      .el-input-group__append {
        background: #3D75F6;
        color: #fff;
        border-color: #3D75F6;
      }
    }
  }
  .content {
    padding: 0 30px;
    display: flex;
    .side-menu-wrapper {
      width: 230px;
      background: #fff;
      border-radius: 10px 10px 0 0;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
      .item-wrapper {
        .item {
          padding: 10px 20px 10px 35px;
          &:hover {
            background: #F4F7FE;
            cursor: pointer;
            user-select: none;
          }
          &.active {
            background: #F4F7FE;
          }
        }
      }
      ::v-deep {
        .el-collapse-item__header[tabindex="0"] {
          border-radius: 10px 10px 0 0;
        }
      }
    }
    .center-wrapper {
      flex: 1;
      margin: 0 15px;
      background: #fff;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
    }
    .right-wrapper {
      width: 280px;
      background: #fff;
      border-radius: 10px 10px 0 0;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
      .top-box {
        height: 60px;
        padding: 10px 15px;
        background: #4A97F7;
        border-radius: 10px 10px 0 0;
        >div:first-child {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0 20px;
          
          >div {
            font-size: 14px;
            color: #fff;
            &:first-child {
              font-weight: 600;
              margin-right: 10px;
            }
          }
        }
        >div:last-child {
          font-size: 12px;
          color: #85ADF9;
          padding: 0 20px;
          margin-top: 5px;
        }
      }
      .top-30-wrapper {
        height: calc(100% - 68px);
        padding: 10px 15px;
        overflow-y: auto;
        .item {
          display: flex;
          > div:first-child {
            width: 30px;
          }
          >div:last-child {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            >span:first-child {
              font-size: 14px;
              color: #333;
              >span:first-child {
                font-weight: 600;
                margin-right: 5px;
              }
              >span:last-child {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
  .title {
    padding: 0 20px;
  }

  ::v-deep {
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .el-divider {
      margin: 10px 0;
    }
  }
  .none-icon {
    ::v-deep {
      .el-collapse-item__arrow {
        display: none;
      }
    }
  }
}
</style>
