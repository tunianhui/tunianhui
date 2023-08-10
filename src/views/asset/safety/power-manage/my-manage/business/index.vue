<template>
  <section class="business-authority table-authority">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>业务板块权限管理</div>
      <div>
        <span class="new-btn ml-10">
          <i class="el-icon-refresh-right"></i>
        </span>
      </div>
    </div>
    <el-card class="table-record" v-if="tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="business_name" label="业务板块">
          <template slot-scope="scope">
            <div class="color">
              <OverflowTooltip style="width:150px">
                {{scope.row.business_name}}
              </OverflowTooltip>
            </div>
            <OverflowTooltip style="width:150px">{{scope.row.business_id}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.role}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="gaveSource" label="授权来源" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.gaveSource}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ownership" label="权限归属" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <OverflowTooltip style="width:150px">{{scope.row.ownership}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)"><i class="el-icon-edit-outline"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <NoData v-else></NoData>
    <SimpleEditDialog :visible="visible" :title="title">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：">
        <el-form-item label="授权用户" prop="user">
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="个人账号" prop="">
              <el-select v-model="form.person_num" placeholder="搜索用户">
                <el-option v-for="item in personNumOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期至" prop="">
              <el-select v-model="form.person_num" placeholder="搜索用户" style="width:46%;margin-right:5px">
                <el-option v-for="item in personNumOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width:50%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
      </el-form>
    </SimpleEditDialog>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import NoData from '@c/no-data'
import SimpleEditDialog from '@c/simple-edit-dialog'
export default {
  name: 'BusinessAuthority',
  components: {
    OverflowTooltip,
    NoData,
    SimpleEditDialog
  },
  data () {
    return {
      visible: false,
      title: '',
      tableData: [
        {
          business_name: 'abc'
        }
      ],
      form: {
        person_num: ''
      },
      rules: {
        user: [{ required: true, message: '请选择授权用户', trigger: 'blur' }]
      },
      personNumOptions: []
    }
  },
  methods: {
    edit (row) {
      this.visible = true
      this.title = `业务板块授权：${row.business_name}`
    }
  }
}
</script>

<style lang="scss">
.table-authority {
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
  .header {
    justify-content: space-between;
    .el-button {
      border-radius: 0;
    }
    .new-btn {
      display: inline-block;
      height: 28px;
      padding: 2px 12px;
      border: 1px solid $generalColor;
      box-sizing: border-box;
      color: $generalColor;
      cursor: pointer;
      vertical-align: bottom;
    }
  }
  .group {
    display: -webkit-box;
    max-height: 100px;
    .label {
      width: 100px;
      margin-right: 0;
    }
    .options {
      width: calc(100% - 100px);
      overflow: auto;
    }
  }
}
</style>
