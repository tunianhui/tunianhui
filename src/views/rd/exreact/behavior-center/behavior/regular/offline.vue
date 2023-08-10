<template>
  <el-dialog
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="myClose"
    append-to-body
    :show-close="false"
    width="540px">
    <div slot="title" v-if="curRow.arr.length === 0">提示</div>
    <div slot="title" v-else>
      <div class="my-offline-title">
        <i class="el-icon-warning-outline"></i>
        <span>该行为由于依赖了标签暂不能下线</span>
      </div>
    </div>
    <div class="my-confirm-info-wrapper" v-if="curRow.arr.length === 0">
      <i class="el-icon-warning-outline"></i>
      <span v-if="curRow.flag==='offlineOrDel'">确定下线并删除行为规则：{{curRow.id}} 吗？</span>
      <span v-else>确定下线行为规则：{{curRow.id}} 吗？</span>
    </div>
    <!-- <el-dialog
      :visible.sync="isSubVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="mySubClose"
      append-to-body
      width="500px"
      class="sub-offline-dialog" v-if="curRow.arr.length === 0">
      <el-form ref="form" :model="delRemarksForm" label-width="50px" :rules="rules">
        <el-form-item label="备注">
          <div class="my-btn fr">
            <el-tooltip class="item" effect="dark" content="当前项目，提交成功后，即更新至生产环境，请谨慎操作" placement="top" popper-class="my-offline-popper" :hide-after="30000">
              <el-button @click="myClose">特殊说明</el-button>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item label="" prop="desc" label-width="0">
          <el-input type="textarea" v-model="delRemarksForm.desc" :rows="7" resize="none" placeholder="请输入此次提交的相关备注说明，如变更信息"></el-input>
        </el-form-item>
        <p class="mb-10 my-explain  font-12">填写备注以说明此次提交的变更内容<br />
          当前项目，提交成功后，即更新至生产环境，请谨慎操作!</p>
      </el-form>
      <div slot="footer" class="dialog-footer my-btn">
        <el-button @click="mySubClose">取 消</el-button>
        <el-button type="primary" class="primary" @click="mySubConfirm">确定并提交</el-button>
      </div>
    </el-dialog> -->
    <p class="mb-20 mt-20"
      v-if="curRow.arr.length === 0">
      下线行为规则后
      系统不会自动为您删除行为中心产出表(oi_behavior_detail_d)中该规则的分区数据
      若您新建下游标签时不想使用该规则的数据，需通过代码任务等手动清理。清理语句请参考：帮助文档</p>
    <!-- <el-table
      :data="curRow.arr"
      style="width: 100%"
      v-if="curRow.arr.length !== 0">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名字">
      </el-table-column>
    </el-table> -->
    <div slot="footer" class="dialog-footer my-btn">
      <el-button @click="myClose" :class="curRow.arr.length === 0 ? '' : 'primary'">{{curRow.arr.length === 0 ? '取 消' : '关 闭'}}</el-button>
      <el-button type="primary" class="primary" @click="mySubConfirm" v-if="curRow.arr.length === 0">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {delRules} from '@/api/rd/exreact/regular'
export default {
  name: 'OfflineDialog',
  props: {
    title: String,
    curRow: Object
  },
  data() {
    return {
      isVisible: true,
      isSubVisible: false,
      delRemarksForm: {
        desc: ''
      },
      rules: {
        desc: [
          { required: true, message: '必须填', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    myClose() {
      this.$emit('close')
    },
    myConfirm() {
      this.isSubVisible = true
    },
    mySubClose() {
      this.isSubVisible = false
    },
    async mySubConfirm() {
      // this.$refs['form'].validate(async (valid) => {
      //   if (valid) {
      //     // this.isSubVisible = false
      //     // this.myClose()
      //     if (this.curRow.flag === 'offlineOrDel') {
      //       const res = await this.$simpleAsyncTo(delRules({id: this.curRow.id}), '删除失败')
      //       if (res) {
      //         this.$message({
      //           type: 'success',
      //           message: '下线并删除成功'
      //         })
      //       }
      //     } else {
      //       this.$message({
      //         type: 'success',
      //         message: '下线成功'
      //       })
      //     }
      //     this.myClose()
      //   }
      // })
      if (this.curRow.flag === 'offlineOrDel') {
        const res = await this.$simpleAsyncTo(delRules({id: this.curRow.id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '下线并删除成功'
          })
        }
      } else {
        this.$message({
          type: 'success',
          message: '下线成功'
        })
      }
      this.myClose()
    }
  }
}
</script>

<style lang="scss">
.sub-offline-dialog {
  .el-dialog__header {
    padding: 0 20px;
  }
}
.my-offline-popper {
  border-radius: 0;
  background-color: $sideMenu;
}
.my-explain {
  opacity: .5;
}
.my-offline-title {
  i {
    color: #1890ff;
    font-size: 26px;
    margin-right: 15px;
  }
  span {
    overflow: hidden;
    color: #1b2126;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
    vertical-align: super;
  }
}
</style>
