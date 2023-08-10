<!--
 * @Author: 大炸鹅
 * @Date: 2022-10-24 14:31:02
 * @LastEditors: YONG
 * @LastEditTime: 2023-06-06 15:42:48
 * @FilePath: \智能数据构建\src\views\asset\safety-new\power-apply\ability\index.vue
-->
<template>
  <div class="ability-power">
    <div v-if="showHome" ref="quality">
      <Header :tabs="tabs" v-model="activeName" title="功能权限" ref="head">
        <div class="actions">
          <el-button><i class="el-icon-refresh-right"></i></el-button>
        </div>
      </Header>

      <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入关键字" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
        <el-table-column prop="data_project" label="权限名称">
          <template slot-scope="scope">
            <TableCell :data="scope.row" keyName="name" keyDesc="desc" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
          </template>
        </el-table-column>
        <el-table-column prop="powerLevel" label="权限等级">
        </el-table-column>
        <el-table-column prop="data_plate" label="权限归属"></el-table-column>
        <el-table-column prop="project" label="授权信息">
          <template slot-scope="scope">
            <strong>{{scope.row.name}}</strong>
            <p>{{scope.row.desc}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="有效期至">
          <template slot-scope="scope">
            <p>{{scope.row.date}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="applyPowerHandle(scope.row)">
              <i class="iconfont icon-qiangzhizhongpao" style="font-size:14px;"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-footer">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
      </div>
    </div>

    <el-dialog title="申请功能权限" :visible.sync="abilityPowerVisible">
      <div style="font-weight:500;font-size:16px" class="mb-10">权限信息</div>
      <div style="padding: 15px;background: #F0F0F2;">
        <div class="mb-5">
          <span style="opacity: 0.7;width:100px;text-align:end;display: inline-block;">权限名称：</span>
          <span style="color: rgba(0,0,0,0.9);">ms_test</span>
        </div>
        <div class="mb-5">
          <span style="opacity: 0.7;width:100px;text-align:end;display: inline-block;">权限ID：</span>
          <span style="color: rgba(0,0,0,0.9);">ms_test</span>
        </div>
        <div class="mb-5">
          <span style="opacity: 0.7;width:100px;text-align:end;display: inline-block;">权限等级：</span>
          <span style="color: rgba(0,0,0,0.9);">ms_test</span>
        </div>
        <div class="mb-5">
          <span style="opacity: 0.7;width:100px;text-align:end;display: inline-block;">权限归属：</span>
          <span style="color: rgba(0,0,0,0.9);">ms_test</span>
        </div>
        <div class="mb-5">
          <span style="opacity: 0.7;width:100px;text-align:end;display: inline-block;">审批人：</span>
          <span style="color: rgba(0,0,0,0.9);">ms_test</span>
        </div>
      </div>
      <div style="font-weight:500;font-size:16px" class="mb-10 mt-10">权限信息</div>
      <el-form :model="abilityPowerForm" :rules="abilityPowerRules" ref="abilityPowerForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="有效期至" prop="quick" :label-width="formLabelWidth">
              <el-select v-model="abilityPowerForm.quick" placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in quickTimeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label=" " :label-width="0">
              <el-date-picker style="width: 300px" align="center" v-model="abilityPowerForm.date" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label-width="formLabelWidth" label="申请原因" prop="applyReason">
          <el-input type="textarea" v-model="abilityPowerForm.applyReason" :rows="7" :maxlength="128" :minlength="5" resize="none" placeholder="请填写续费原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="abilityPowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('abilityPowerForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '../../mixins'
import pager from '@/mixins/pager'
export default {
  name: 'AbilityPower',
  mixins: [mixin, pager],
  data () {
    return {
      fixed: false,
      showHome: true,
      activeName: '1',
      loading: 0,
      tabs: [
        {
          label: '已生效',
          value: '1',
          total: 14
        },
        {
          label: '已失效',
          value: '2',
          total: 17
        }
      ],
      filterData: [
        {
          label: '到期日期',
          id: '到期日期',
          options: [
            {
              id: '0',
              label: '七日内'
            },
            {
              id: '1',
              label: '七日后'
            }
          ]
        }
      ],
      tableData: [
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        },
        {
          name: 'ms_test',
          desc: 'ms_test',
          date: '2020-10-22',
          user: '个人账号',
          powerType: '改表数据，查表数据'
        }
      ],
      abilityPowerVisible: false,
      abilityPowerForm: {
        quick: '',
        applyReason: '',
        date: ''
      },
      abilityPowerRules: {
        quick: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        applyReason: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ]
      },
      formLabelWidth: '120px',
      quickTimeList: [
        {
          label: '30天',
          value: '30'
        },
        {
          label: '60天',
          value: '60'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    getTableList () { },
    applyPowerHandle () {
      this.abilityPowerVisible = true
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ability-power {
  height: 100%;
  position: relative;
  background: #ebeaef;
  > div {
    overflow-y: overlay;
    height: 100%;
    padding: 10px 15px 56px 15px;
  }
}
</style>
