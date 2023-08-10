<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-08 17:13:52
 * @Description:
-->

<template>
  <section class="security-category">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">数据分类</div>
      </div>
      <div>
        <div class="flex">
          <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入分类名称搜索" class="ml-10 mr-10"></el-input>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建数据分类</el-button>
        </div>
      </div>
    </div>

    <div class="cont-box">
      <div class="card-item" v-for="(item,index) in dataLevelList" :key="index">
        <div class="cont">
          <div class="top">
            <div class="flex-center">
              <div class="type">{{item.shortName}}</div>
              <div class="title">{{item.classifyName}}</div>
            </div>
          </div>
          <div class="line-cont">
            <span class="label">更新人：</span>
            <div class="value">{{item.updatedBy}}</div>
          </div>
          <div class="line-cont">
            <span class="label">更新时间：</span>
            <div class="value">{{item.updatedDate}}</div>
          </div>
          <div class="line-cont">
            <span class="label">分类描述：</span>
            <div class="value value3" :title="item.remark">{{item.remark}}</div>
          </div>
        </div>
        <div class="operate">
          <span class="label">操作：</span>
          <div>
            <i class="el-icon-edit-outline" @click="handleEdit(item)"></i>
            <i class="el-icon-delete" @click="handleDel(item)"></i>
          </div>
        </div>
      </div>
    </div>

    <SelectFooter :tableData="dataLevelList" :totalNum="total" @sendTableList="sendTableList"></SelectFooter>

    <el-dialog :title="title" :visible.sync="levelDialogVisible" width="38%" class="rule-dialog" :close-on-click-modal="false">
      <el-form :model="form" ref="formRef" label-width="100px" :rules="rules">
        <el-form-item label="分类名称" prop="classifyName">
          <el-input v-model="form.classifyName" placeholder="请输入分级名称，允许中文、英文、数字、下划线，10个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="分类缩写" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入分类缩写，仅允许英文字母，5个字符以内" :maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入分类描述，100个字符以内" :rows="3" show-word-limit :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="levelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getDataClassify,
  saveClassify,
  deleteClassify
} from '@/api/asset/security.js'
import pager from '@/mixins/pager'
import SelectFooter from '@c/footer-simple'
export default {
  name: 'Category',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      form: {},
      keyword: '',
      dataLevelList: [],
      title: '新建数据分类',
      levelDialogVisible: false,
      rules: {
        classifyName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5\w]{1,10}$/, message: '请输入分级名称，允许中文、英文、数字、下划线，10个字符以内', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入分类缩写', trigger: 'blur' },
          // ^(S|C|B)[\u4E00-\u9FA5]{0,5}$
          { pattern: /^[a-zA-Z]{1,5}$/, message: '请输入分类缩写，仅允许英文字母，5个字符以内', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getTableList()
  },
  methods: {
    searchChange (val) {
      this.getTableList()
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    async getTableList () {
      const params = {
        classifyName: this.keyword,
        ...this.pageFilters
      }
      const res = await getDataClassify(params)
      if (res) {
        this.dataLevelList = res.data.totalList
        this.total = res.data.total
      }
    },

    handleAdd () {
      this.levelDialogVisible = true
      this.title = '新建数据分类'
      this.form = {}
      this.$refs.formRef.clearValidate()
    },

    handleEdit (row) {
      this.levelDialogVisible = true
      this.title = '编辑数据分类'
      const { classifyId, classifyName, shortName, remark } = row
      this.form = { classifyId, classifyName, shortName, remark }
      this.$refs.formRef.clearValidate()
    },

    handleSure () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.submitEdit()
        }
      })
    },

    async submitEdit () {
      const res = await saveClassify(this.form)
      if (res) {
        const msg = this.form.classifyId ? '编辑成功' : '新建成功'
        this.$message({
          type: 'success',
          message: msg
        })
        this.levelDialogVisible = false
        this.getTableList()
      }
    },

    handleDel (row) {
      this.$confirm(`确定删除数据分类, ${row.classifyName} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitDel(row.classifyId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async submitDel (classifyId) {
      const res = await deleteClassify({ classifyId })
      if (res && res.code == 0) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.security-category {
  position: relative;
  height: 100%;
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .cont-box {
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: calc((100% - 30px) / 4);
      height: 230px;
      background: #fff;
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-child(4n) {
        margin-right: 0;
      }
      .cont {
        padding: 10px 16px;
        box-sizing: border-box;
        height: calc(100% - 48px);
        width: 100%;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          .type {
            width: 32px;
            height: 34px;
            line-height: 30px;
            text-align: center;
            font-size: 24px;
            background: #4c7cfe;
            border: 1px solid #436ad3;
            color: #fff;
            margin-right: 14px;
            border-radius: 2px;
          }
          .title {
            color: #1b1b1b;
            font-size: 16px;
          }
          .level {
            height: 20px;
            line-height: 18px;
            width: 48px;
            text-align: center;
            color: #4a7cf8;
            border: 1px solid #4a7cf8;
            background: #eaf2ff;
            border-radius: 8px;
            img {
              width: 16px;
              height: 16px;
            }
            .value {
              margin-right: 4px;
            }
          }
        }
        .line-cont {
          line-height: 24px;
          display: flex;
          .label {
            width: 74px;
            text-align: left;
            display: inline-block;
            vertical-align: top;
          }
          .value {
            color: #1b1b1b;
            font-size: 14px;
            width: calc(100% - 74px);
            text-align: left;
          }
          .value3 {
            height: 70px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
      .operate {
        height: 48px;
        width: 100%;
        border-top: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        box-sizing: border-box;
        i {
          cursor: pointer;
        }
        .el-icon-edit-outline {
          margin-right: 14px;
        }
      }
      .label {
        font-size: 14px;
        color: #898989;
      }
    }
  }
}
</style>
