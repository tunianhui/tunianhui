<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-11 14:36:35
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-11 16:38:56
 * @FilePath: \数据智能构建\src\views\asset\standard-new\assess\rule\luobiao-mingxi.vue
-->
<template>
  <el-drawer
    :title="`落标详情: ${title}`"
    :visible="visible"
    direction="rtl"
    size="650px"
    :destroy-on-close="true"
    :close-on-press-escape="true"
    :wrapperClosable="false"
    @close="closeDrawer"
  >
    <div class="wrapper" v-resize="resizeDom">
      <h5>基本信息</h5>
      <el-form :inline="true" :model="formInline" class="demo-form-inline"  label-width="120px" ref="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="规则名称">
              规则映射1
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准集">
              <span style="color:#66b1ff">数据标准1</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始执行时间">
              2023-02-05 11:12:12
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行结果">
              <div>
                <i class="iconfont icon-yuanxingxuanzhong-fill-copy mr-5" style="color:#24BD47"></i>
                <span class="mr-5">成功</span>
                <span class="mr-5">0.00s</span>
                <i class="iconfont icon-cycletask" style="color: #66b1ff;cursor: pointer;"></i>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已生效标签总数">
              0
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映射非空标准数">
              0
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h5>落标明细</h5>
      <div class="content" :style="{height: `${height}px`}">
        <div class="left">
          <div class="top">
            <span class="mr-10">标准列表</span>
            <el-checkbox v-model="checked">映射为空</el-checkbox>
            <el-input v-model="input" placeholder="请输入内容" style="width: 135px" class="ml-20"></el-input>
          </div>
          <el-table
            :data="tableData"
            height="calc(100% - 40px)"
            style="width: 100%" class="standard">
            <el-table-column
              prop="date"
              label="标准名称">
            </el-table-column>
            <el-table-column
              prop="name"
              label="标准编码">
            </el-table-column>
            <el-table-column
              prop="address"
              label="映射元数据">
            </el-table-column>
          </el-table>
        </div>
        <div class="right">
          <div class="top">
            <span class="mr-20">元数据名称</span>
            <el-input v-model="input" placeholder="请输入内容" style="width: 180px" class="ml-20"></el-input>
          </div>
          <el-table
            :data="tableData"
            height="calc(100% - 40px)"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="元数据名称">
            </el-table-column>
            <el-table-column
              prop="name"
              label="元数据路径">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'DrawerDemoLuobiaoMingxi',
  props: {
    title: {
      type: String,
      default: '规则映射1'
    }
  },
  data() {
    return {
      visible: true,
      formInline: {},
      height: 0,
      tableData: [],
      checked: false,
      input: ''
    }
  },
  methods: {
    closeDrawer() {
      console.log(123)
      this.$emit('close', false)
    },
    resizeDom(data) {
      const { width, height } = data
      this.$nextTick(_ => {
        this.height = parseInt(height) - this.$refs.form.$el.clientHeight - 50
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0px;
}
::v-deep .el-drawer__body {
  padding: 12px;
  overflow: hidden;
}
h5 {
  font-size: 14px;
  font-weight: 600;
  color: rgba($color: #000000, $alpha: 0.75);
  margin-bottom: 12px;
}
.content {
  display: flex;
  .top {
    height: 40px;
    line-height: 40px;
    display: flex;
    font-size: 12px;
  }
  .left {
    flex: 1;
    // border-right: 1px solid #ebeef5;
  }
  .right {
    flex: 1;
  }
}
.wrapper {
  height: 100%;
}
.standard {
  ::v-deep .el-table__body-wrapper {
    background: #FAFAFA;
  }
}
</style>