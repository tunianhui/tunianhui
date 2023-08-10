<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-04 11:02:28
 * @Description:
-->

<template>
  <section class="security-level">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">数据分级</div>
      </div>
      <div>
        <div class="flex">
          <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入分级名称搜索" class="ml-10 mr-10"></el-input>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建数据分级</el-button>
        </div>
      </div>
    </div>
    <div class="cont-box">
      <div class="card-item" v-for="(item,index) in dataLevelList" :key="index">
        <div class="cont">
          <div class="top">
            <div class="flex-center">
              <div class="type">{{item.shortName}}</div>
              <div class="title">{{item.levelName}}</div>
            </div>
            <div class="level flex-center">
              <img :src="require('@/assets/images/asset/security/shandian.png')" alt="" />
              <span class="value">{{item.levelSensitivity}}</span>
            </div>
          </div>
          <div class="line-cont">
            <span class="label">更新人：</span>
            <div class="value">{{item.createdBy}}</div>
          </div>
          <div class="line-cont">
            <span class="label">更新时间：</span>
            <div class="value">{{item.updatedDate}}</div>
          </div>
          <div class="line-cont">
            <span class="label">分级描述：</span>
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
        <el-form-item label="分级名称" prop="levelName">
          <el-input v-model="form.levelName" :disabled="form.levelId" placeholder="请输入分级名称，允许中文、英文、数字、下划线，10个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="分级缩写" prop="shortName">
          <el-input v-model="form.shortName" :disabled="form.levelId" placeholder="请输入分级缩写，允许英文、数字、下划线，5个字符以内" :maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="敏感程度" prop="index">
          <el-select v-model="form.levelSensitivity" placeholder="请选择敏感程度">
            <el-option v-for="(item, index) in indexs" :value="item.levelSensitivity" :label="item.levelSensitivity" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="分级描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入分级描述，允许中文、英文、数字、标点符号、下划线，100个字符以内" :rows="3" show-word-limit :maxlength="100"></el-input>
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
  getDataLevel,
  getLevelItems,
  saveLevel,
  deleteLevel
} from '@/api/asset/security.js'
import pager from '@/mixins/pager'
import SelectFooter from '@c/footer-simple'
export default {
  name: 'Level',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      form: {},
      keyword: '',
      dataLevelList: [],
      indexs: [],
      title: '新建数据分级',
      levelDialogVisible: false,
      rules: {
        levelName: [
          { required: true, message: '请输入分级名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5\w]{1,10}$/, message: '请输入分级名称，允许中文、英文、数字、下划线，10个字符以内', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入分级缩写，允许英文、数字、下划线，5个字符以内', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{1,5}$/, message: '请输入分级缩写，允许英文、数字、下划线，5个字符以内', trigger: 'blur' }
        ],
        levelSensitivity: [{ required: true, message: '请选择敏感程度', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入分级描述', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getTableList()
    this.getLevelItemsData()
  },
  methods: {
    searchChange (val) {
      this.getTableList()
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    async getLevelItemsData () {
      const res = await getLevelItems()
      if (res) {
        this.indexs = res.data
      }
    },

    async getTableList () {
      const params = {
        levelName: this.keyword,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await getDataLevel(params)
      if (res) {
        this.dataLevelList = res.data.totalList
        this.total = res.data.total
      }
    },

    handleAdd () {
      this.levelDialogVisible = true
      this.title = '新建数据分级'
      this.form = {}
      this.$refs.formRef.clearValidate()
    },

    handleEdit (row) {
      this.levelDialogVisible = true
      this.title = '编辑数据分级'
      const { levelId, levelName, shortName, description, levelSensitivity } = row
      const oldLevelSensitivity = JSON.parse(JSON.stringify(levelSensitivity))
      this.form = { levelId, levelName, shortName, description, oldLevelSensitivity, levelSensitivity }
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
      const res = await saveLevel(this.form)
      if (res) {
        const msg = this.form.levelId ? '编辑成功' : '新建成功'
        this.$message({
          type: 'success',
          message: msg
        })
        this.levelDialogVisible = false
        this.getTableList()
      }
    },

    handleDel (row) {
      this.$confirm(`确定删除数据分级, ${row.levelName} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitDel(row.levelId, row.levelSensitivity)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async submitDel (levelId, levelSensitivity) {
      const res = await deleteLevel({ levelId, levelSensitivity })
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
.security-level {
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
            width: 40px;
            height: 40px;
            line-height: 38px;
            text-align: center;
            font-size: 22px;
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
