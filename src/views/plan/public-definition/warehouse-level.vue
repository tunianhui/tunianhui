<template>
  <div class="warehouseLevel">
    <div class="tab-title">
      <h3 class="mb-15">业务板块</h3>
      <div class="operationBox">
        <el-radio-group v-model="tabData" class="mb-15" size="mini" @change="tabChange">
          <el-radio-button
            v-for="(item, index) in businessListData"
            :key="index"
            :label="item.busin_id"
          >{{item.busin_name}}</el-radio-button>
        </el-radio-group>
        <div class="searchBox">
          <!-- <el-input v-model="inputVal" prefix-icon="el-icon-search" placeholder="请输入关键字搜索" @input="searchChange"></el-input> -->
          <el-button type="primary" icon="el-icon-plus" @click="createdBtn">创建仓库层级</el-button>
        </div>
      </div>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="level_name" show-overflow-tooltip label="名称"></el-table-column>
      <el-table-column prop="level_code" show-overflow-tooltip label="英文名"></el-table-column>
      <el-table-column prop="comments" show-overflow-tooltip label="备注"></el-table-column>
      <el-table-column prop="oper_user" show-overflow-tooltip label="操作人"></el-table-column>
      <el-table-column prop="oper_time" show-overflow-tooltip label="操作时间"></el-table-column>
      <el-table-column prop="status" show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="success" size="mini">启用</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="info" size="mini">停用</el-tag>
          <el-tag v-else-if="scope.row.status === '2'" size="mini">未审核</el-tag>
          <el-tag v-else-if="scope.row.status === '3'" type="warning" size="mini">审核中</el-tag>
          <el-tag v-else-if="scope.row.status === '4'" type="danger" size="mini">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="mr-10"
            title="编辑"
            @click="editClick(scope.row)"
            icon="font-16 el-icon-edit-outline"
          ></el-button>
          <SimpleConfirm @confirm="delClick(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-20 pagerBox">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageFilters.pageNo"
        :page-sizes="pageSizes"
        :page-size="pageFilters.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      :title="isCreated ? '创建仓库层级' : '修改'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}">
      <el-form
        :model="warehouseLevelData"
        ref="warehouseLevelData"
        :rules="rules"
        label-width="100px"
        label-suffix="："
        v-loading="dialogLoading"
      >
        <el-form-item label="名称" prop="level_name">
          <el-input v-model="warehouseLevelData.level_name"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="level_code">
          <el-input v-model="warehouseLevelData.level_code" :disabled="is_disabled"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comments">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="warehouseLevelData.comments"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务板块" prop="selectData">
          <el-checkbox-group v-model="warehouseLevelData.selectData" @change="checkboxChange">
            <el-checkbox
              v-for="(item, index) in businessSelect"
              :key="index"
              :label="item.busin_id"
            >{{item.busin_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('warehouseLevelData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTableList,
  getSave,
  getEdit,
  getQueryById,
  getDel
} from '@/api/plan/publicDefinition/warehouseLevel'
import {getTableList as businessList} from '@/api/plan/business/businessList'
import pager from '@/mixins/pager'
export default {
  name: 'WarehouseLevel',
  mixins: [pager],
  data() {
    return {
      isCreated: true,
      tableLoading: false,
      dialogLoading: false,
      is_disabled: false,
      tabData: '',
      tableData: [],
      total: 0,
      businessListData: [],
      businessSelect: [],
      dialogVisible: false,
      warehouseLevelData: this.warehouseLevelDataInit(),
      businData: {
        busin_id: '',
        busin_name: ''
      },
      rules: {
        level_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        level_code: [
          {required: true, message: '请输入英文名', trigger: 'blur'}
        ],
        selectData: [
          {required: true, message: '请选择业务板块', trigger: 'blur'}
        ]
      },
      level_id: ''
    }
  },
  mounted() {
    this.getTableList()
    this.businessList()
  },
  methods: {
    warehouseLevelDataInit() {
      return {
        level_name: '',
        level_code: '',
        comments: '',
        selectData: []
      }
    },
    async getTableList() {
      this.tableLoading = true
      let param = {...this.pageFilters, busin_id: this.tabData}
      const res = await this.$simpleAsyncTo(getTableList(param), '获取失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.tableLoading = false
    },
    async businessList() {
      const res = await this.$simpleAsyncTo(businessList(), '获取失败')
      if (res) {
        this.businessListData = [
          {busin_name: '全部', busin_id: ''},
          ...res.data
        ]
        this.businessSelect = res.data
      }
    },
    async getSave() {
      const param = {
        level_name: this.warehouseLevelData.level_name,
        level_code: this.warehouseLevelData.level_code,
        comments: this.warehouseLevelData.comments,
        busin_id: this.businData.busin_id,
        busin_name: this.businData.busin_name
      }
      this.globalLoading()
      const res = await this.$simpleAsyncTo(getSave(param), '获取失败')
      if (res) {
        this.getTableList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    async getEdit() {
      const param = {
        level_name: this.warehouseLevelData.level_name,
        level_code: this.warehouseLevelData.level_code,
        comments: this.warehouseLevelData.comments,
        level_id: this.level_id,
        ...this.businData
      }
      this.globalLoading()
      const res = await this.$simpleAsyncTo(getEdit(param), '获取失败')
      if (res) {
        this.getTableList()
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    async getQueryById(row) {
      this.dialogLoading = true
      const param = {level_id: row}
      const res = await this.$simpleAsyncTo(getQueryById(param), '获取失败')
      if (!this.isCreated && res.flag) {
        this.warehouseLevelData = {
          level_name: res.data.level.level_name,
          level_code: res.data.level.level_code,
          comments: res.data.level.comments,
          selectData: this.selectDataFn(res.data.relations)
        }
        this.businData = this.businDataFn(res.data.relations)
      }
      this.dialogLoading = false
    },
    async delClick(row) {
      let param = {level_id: row.level_id, busin_id: this.tabData}
      this.globalLoading()
      const res = await this.$simpleAsyncTo(getDel(param), '删除失败')
      if (res) {
        this.getTableList()
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }
      this.globalLoading().close()
    },
    tabChange(val) {
      this.tabData = val
      this.getTableList()
    },
    searchChange(val) {
      this.getTableList()
    },
    createdBtn() {
      this.dialogLoading = false
      this.is_disabled = false
      this.isCreated = true
      this.warehouseLevelData = this.warehouseLevelDataInit()
      this.dialogVisible = true
    },
    checkboxChange(val) {
      this.businData.busin_id = this.warehouseLevelData.selectData.join(',')
      let businName = []
      this.warehouseLevelData.selectData.forEach(item => {
        let businNameSelect = this.businessListData.find(
          businessListDataItem => businessListDataItem.busin_id === item
        )
        if (businNameSelect) businName.push(businNameSelect.busin_name)
      })
      this.businData.busin_name = businName.join(',')
    },
    selectChange() {
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false
          if (this.isCreated) {
            this.getSave()
          } else {
            this.getEdit()
          }
        } else {
          return false
        }
      })
    },
    editClick(row) {
      this.isCreated = false
      this.dialogVisible = true
      this.is_disabled = true
      this.level_id = row.level_id
      this.getQueryById(row.level_id)
    },
    businDataFn(data) {
      let businId = []
      let businName = []
      data.forEach(item => {
        businId.push(item.busin_id)
        businName.push(item.busin_name)
      })
      return {
        busin_id: businId.join(','),
        busin_name: businName.join(',')
      }
    },
    selectDataFn(data) {
      let arr = []
      if (!data) return
      data.forEach(item => {
        arr.push(item.busin_id)
      })
      return arr
    }
  }
}
</script>

<style lang='scss'>
.warehouseLevel {
  .operationBox {
    // overflow: hidden;
    .searchBox {
      width: 130px;
      float: right;
      display: flex;
      & * {
        margin-right: 4px;
      }
    }
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
    border: none;
  }
  .el-radio-button__inner {
    border: none;
  }
}
</style>
