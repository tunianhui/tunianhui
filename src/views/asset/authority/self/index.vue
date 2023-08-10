<template>
  <section class="authority-self">
    <div class="ml-10">我的权限</div>
    <div class="mt-10 ml-10">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-suffix="：">
        <el-form-item label="类型">
          <el-select v-model="formInline.type">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in typeList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否 Owner">
          <el-select v-model="formInline.isOwner">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in isOwnerList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限归属">
          <el-select v-model="formInline.permission">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in permissionList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="input-class">
          <el-input
            v-model="formInline.search"
            prefix-icon="el-icon-search"
            placeholder="请搜索申请内容名称"
          ></el-input>
        </div>
      </el-form>
      <el-table :data="tableData">
        <el-table-column show-overflow-tooltip prop="type" label="类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="content" label="申请内容"></el-table-column>
        <el-table-column show-overflow-tooltip prop="isOwner" label="是否Owner"></el-table-column>
        <el-table-column show-overflow-tooltip prop="permissionBelong" label="权限归属"></el-table-column>
        <el-table-column prop="btn" label="操作">
          <template slot-scope="scope">
            <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="returnClick(scope.row)" type="text" size="small">交还</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="详情" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <div class="dialog-class">
          <div class="detail-head">
            <span>
              类型：
              <span>{{detailInfo.type}}</span>
            </span>
            <span>
              内容：
              <span>{{detailInfo.content}}</span>
            </span>
            <span>
              所属项目：
              <span>{{detailInfo.project}}</span>
            </span>
          </div>
          <el-table :data="detailTable">
            <el-table-column show-overflow-tooltip prop="EnglishName" label="英文名"></el-table-column>
            <el-table-column show-overflow-tooltip prop="describe" label="描述"></el-table-column>
            <el-table-column show-overflow-tooltip prop="permissionType" label="权限类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="time" label="到期无权限时间"></el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog title="交还权限" :visible.sync="dialogVisible2" :close-on-click-modal="false">
        <div class="dialog-class">
          <div class="detail-head">
            <span>
              类型：
              <span>{{detailInfo.type}}</span>
            </span>
            <span>
              内容：
              <span>{{detailInfo.content}}</span>
            </span>
            <span>
              所属项目：
              <span>{{detailInfo.project}}</span>
            </span>
          </div>
          <div>可能影响任务生产哦，情谨慎操作！确认交还该内容所有权限吗？</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AuthoritySelf',
  data() {
    return {
      formInline: {type: '0', isOwner: '0', permission: '0', search: ''},
      typeList: [
        {label: '全选', value: '0'},
        {label: '逻辑表', value: '1'},
        {label: '物理表', value: '2'},
        {label: '数据源', value: '3'}
      ],
      permissionList: [
        {label: '全选', value: '0'},
        {label: '是', value: '1'},
        {label: '否', value: '2'}
      ],
      isOwnerList: [
        {label: '全部', value: '0'},
        {label: '个人账号', value: '1'},
        {label: '统一产生账号', value: '2'}
      ],
      tableData: [],
      detailInfo: {},
      detailTable: [],
      dialogVisible: false,
      dialogVisible2: false
    }
  },
  mounted() {
    this.tableData = [
      {
        type: '物理表',
        content: 'cus_test_003.t_ods_user_info',
        isOwner: '否',
        permissionBelong: '统一生产账号'
      }
    ]
  },
  methods: {
    detailClick(row) {
      this.dialogVisible = true
      this.detailInfo = row
      this.detailTable = [
        {
          EnglishName: 'id',
          describe: '主键ID',
          permissionType: '查询',
          time: '永久'
        },
        {
          EnglishName: 'id',
          describe: '主键ID',
          permissionType: '查询',
          time: '永久'
        },
        {
          EnglishName: 'id',
          describe: '主键ID',
          permissionType: '查询',
          time: '永久'
        },
        {
          EnglishName: 'id',
          describe: '主键ID',
          permissionType: '查询',
          time: '永久'
        }
      ]
    },
    returnClick(row) {
      this.dialogVisible2 = true
      this.detailInfo = row
    }
  }
}
</script>

<style lang="scss">
.input-class {
  width: 200px;
  float: right;
}
.el-dialog .el-dialog__body {
  padding-bottom: 30px;
}
.dialog-class {
  .detail-head {
    padding-bottom: 10px;
    & > span {
      padding: 0 10px;
      color: #999;
      span {
        color: #000;
      }
    }
  }
}
</style>
