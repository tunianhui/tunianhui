<template>
  <div class="foolter">
    <div class="left">
      <span>
        <el-checkbox v-model="currentPageAllCheck"></el-checkbox>
        <span>本页全选</span>
      </span>
      <span>
        <i class="el-icon-switch-button"></i>
        <span>开启</span>
      </span>
      <span>
        <i class="el-icon-circle-close"></i>
        <span>关闭</span>
      </span>
      <span>
        <i class="el-icon-delete"></i>
        <span>删除</span>
      </span>
      <span>
        <el-dropdown @command="command">
          <span class="el-dropdown-link">
            接收人<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">新增接收人</el-dropdown-item>
            <el-dropdown-item command="del">删除接收人</el-dropdown-item>
            <el-dropdown-item command="replace">替换接收人</el-dropdown-item>
            <el-dropdown-item command="edit">修改接收人</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <div class="right">
      <span>
        已选中0/0
      </span>
      <span>
        <el-pagination
          layout="prev, pager, next, sizes"
          :total="50">
        </el-pagination>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Foolter',
    data() {
      return {
        currentPageAllCheck: false
      }
    },
    methods: {
      command(val) {
        let titleRecipient = ''
        if (val === 'edit') {
          titleRecipient = '修改接收对象'
        } else if (val === 'add') {
          titleRecipient = '新增接收人'
        } else if (val === 'del') {
          titleRecipient = '删除接收人'
        } else {
          titleRecipient = '替换接收人'
        }
        this.$emit('commandHandle', { val, title: titleRecipient })
      }
      
    }
  }
</script>

<style lang="scss" scoped>
.foolter {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  background: rgb(248, 248, 250);
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  .left {
    display: flex;
    align-items: center;
    > span {
      margin-right: 20px;
      font-size: 12px;
      cursor: pointer;
      > i {
        font-size: 14px;
        vertical-align: bottom;
      }
      > span {
        margin-left: 5px;
      }
      &:first-child {
        > span {
          opacity: 0.9;
          margin-left: 8px;
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    > span {
      margin-right: 20px;
      font-size: 12px;
    }
  }
}
::v-deep .el-pager li {
  background: transparent;
}
::v-deep .el-pagination button {
  background: transparent;
}
::v-deep .el-dropdown {
  width: 80px;
  height: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0,0,0, 0.1);
}
.el-dropdown-link {
  font-size: 12px;
  color: #606266;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>