<template>
  <div class="data-server-powwer">
    <div class="" ref="quality" v-if="showHome">
      <Header :tabs="tabs" v-model="activeName" ref="head" @change="changeTab">
        <div class="actions">
          <el-button type="primary" v-if="activeName === 'App'" @click="AppPowerVisible = true">申请应用权限</el-button>
          <el-button type="primary" v-if="activeName === 'Api'" @click="apiPowerVisible = true">申请API权限</el-button>
          <el-button type="primary" v-if="activeName === 'server'" @click="serverPowerVisible = true">申请服务单元权限</el-button>
          <el-button type="primary" v-if="activeName === 'datasource'" @click="datasourcePowerVisible = true">申请Dataphin数据源权限</el-button>
          <el-button><i class="el-icon-refresh-right"></i></el-button>
        </div>
      </Header>

      <!-- 应用权限列表 -->
      <template v-if="activeName === 'App'">
        <el-card ref="filterFieldCard">
          <el-form :model="form" :inline="true" class="formSearch">
            <el-form-item label="请选择服务项目" label-width="120px">
              <el-select v-model="form.project">
                <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="search">
              <el-input v-model="form.keyWord" prefix-icon="el-icon-search" placeholder="请输入关键词">
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>

        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading" class="mt-15">
          <el-table-column prop="data_project" label="应用名称">
            <template slot-scope="scope">
              <TableCell :data="scope.row" keyName="name" keyDesc="desc" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
            </template>
          </el-table-column>
          <el-table-column prop="data_plate" label="所属服务项目">
            <template slot-scope="scope">
              <strong>{{scope.row.name}}</strong>
              <p>{{scope.row.desc}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="powerType" label="权限类型">
            <template slot-scope="scope">
              <p>{{scope.row.powerType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="权限账号">
            <template slot-scope="scope">
              <p>{{scope.row.user}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="有效期">
            <template slot-scope="scope">
              <p>{{scope.row.date}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="AppPowerHandle(scope.row)">
                <i class="iconfont icon-qiangzhizhongpao" style="font-size:14px;"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
        </div>
      </template>
      <!-- API权限 -->
      <template v-if="activeName === 'Api'">
        <el-card ref="filterFieldCard">
          <el-form :model="form" :inline="true" class="formSearch">
            <el-form-item label="请选择服务项目" label-width="120px">
              <el-select v-model="form.project">
                <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="search">
              <el-input v-model="form.keyWord" prefix-icon="el-icon-search" placeholder="请输入关键词">
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading" class="mt-15">
          <el-table-column prop="data_project" label="API名称">
            <template slot-scope="scope">
              <TableCell :data="scope.row" keyName="name" keyDesc="desc" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
            </template>
          </el-table-column>
          <el-table-column prop="data_plate" label="所属服务项目">
            <template slot-scope="scope">
              <strong>{{scope.row.name}}</strong>
              <p>{{scope.row.desc}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="api_id" label="API_ID">
          </el-table-column>
          <el-table-column prop="powerType" label="权限类型">
            <template slot-scope="scope">
              <p>{{scope.row.powerType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="权限账号">
            <template slot-scope="scope">
              <p>{{scope.row.user}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="有效期">
            <template slot-scope="scope">
              <p>{{scope.row.date}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text">
                交还
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
        </div>
      </template>
      <!-- 服务单元权限 -->
      <template v-if="activeName === 'server'">
        <el-card ref="filterFieldCard">
          <el-form :model="form" :inline="true" class="formSearch">
            <el-form-item label="请选择服务项目" label-width="120px">
              <el-select v-model="form.project">
                <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="search">
              <el-input v-model="form.keyWord" prefix-icon="el-icon-search" placeholder="请输入关键词">
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading" class="mt-15">
          <el-table-column prop="data_project" label="服务单元名称">
            <template slot-scope="scope">
              <TableCell :data="scope.row" keyName="name" keyDesc="desc" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
            </template>
          </el-table-column>
          <el-table-column prop="data_plate" label="所属服务项目">
            <template slot-scope="scope">
              <strong>{{scope.row.name}}</strong>
              <p>{{scope.row.desc}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="powerType" label="服务单元类型">
            单物理表服务单元
          </el-table-column>
          <el-table-column prop="datasource" label="数据来源">
          </el-table-column>
          <el-table-column prop="powerType" label="权限类型">
            <template slot-scope="scope">
              <p>{{scope.row.powerType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="权限账号">
            <template slot-scope="scope">
              <p>{{scope.row.user}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="有效期">
            <template slot-scope="scope">
              <p>{{scope.row.date}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="serverPowerHandle(scope.row)">
                <i class="iconfont icon-qiangzhizhongpao" style="font-size:14px;"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
        </div>
      </template>
      <!-- Dataphin数据源权限 -->
      <template v-if="activeName === 'datasource'">
        <el-card ref="filterFieldCard">
          <el-form :model="form" :inline="true" class="formSearch">
            <el-form-item label="请选择服务项目" label-width="120px">
              <el-select v-model="form.project">
                <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="search">
              <el-input v-model="form.keyWord" prefix-icon="el-icon-search" placeholder="请输入关键词">
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading" class="mt-15">
          <el-table-column prop="data_project" label="数据源名称">
            <template slot-scope="scope">
              <TableCell :data="scope.row" keyName="name" keyDesc="desc" icon="iconfont icon-yuanbiao-xianxing"></TableCell>
            </template>
          </el-table-column>
          <el-table-column prop="data_plate" label="所属服务项目">
            <template slot-scope="scope">
              <strong>{{scope.row.name}}</strong>
              <p>{{scope.row.desc}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="powerType" label="权限类型">
            <template slot-scope="scope">
              <p>{{scope.row.powerType}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="权限账号">
            <template slot-scope="scope">
              <p>{{scope.row.user}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="有效期">
            <template slot-scope="scope">
              <p>{{scope.row.date}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text">
                交还
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
        </div>
      </template>
    </div>
    <!-- 应用权限 -->
    <el-dialog title="应用权限申请" :visible.sync="AppPowerVisible">
      <el-form :model="AppPowerForm" :rules="AppPowerRules" ref="AppPowerForm">
        <div class="label">应用权限对象</div>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="应用" :label-width="formLabelWidth" prop="appName">
              <el-select v-model="AppPowerForm.appName" placeholder="请选择项目" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" label-width="0" prop="appName">
              <el-select v-model="AppPowerForm.appName" placeholder="请选择应用分组" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" label-width="0" prop="appName">
              <el-select v-model="AppPowerForm.appName" placeholder="请选择应用" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="label">权限配置</div>
        <el-form-item label="权限类型" :label-width="formLabelWidth" prop="powerType">
          <el-radio-group v-model="AppPowerForm.powerType">
            <el-radio label="1">使用权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限账号" :label-width="formLabelWidth" prop="powerUser">
          <el-radio-group v-model="AppPowerForm.powerUser">
            <el-radio label="1">个人账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="有效期" :label-width="formLabelWidth" prop="dateType">
              <el-select v-model="AppPowerForm.dateType" placeholder="请选择" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in dateTypeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="" label-width="0" prop="date">
              <el-date-picker style="width:180px" align="center" v-model="AppPowerForm.date" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label-width="formLabelWidth" label="申请原因" prop="renew">
          <el-input type="textarea" v-model="AppPowerForm.renew" :rows="7" :maxlength="128" :minlength="5" resize="none" placeholder="请填写申请原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AppPowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormApp('AppPowerForm')">提 交</el-button>
      </div>
    </el-dialog>
    <!-- API权限 -->
    <el-dialog title="API权限申请" :visible.sync="apiPowerVisible" width="880px" custom-class="apiPowerForm">
      <el-form :model="apiPowerForm" :rules="apiPowerRule" ref="apiPowerForm">
        <div class="label">API权限对象</div>
        <el-card class="apiPowerForm-el-card">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="API" :label-width="formLabelWidth1" prop="apiProject">
                <el-select v-model="apiPowerForm.apiProject" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in apiProjectList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="apiGroup">
                <el-select v-model="apiPowerForm.apiGroup" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in apiGroupList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="api">
                <el-select v-model="apiPowerForm.api" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in apiList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <div class="label mt-15">权限字段表</div>
        <el-tabs v-model="activeNameApiTab">
          <el-tab-pane name="first">
            <span slot="label">Basic 已选中 0</span>
            <el-input placeholder="搜索参数" style="width:170px" class="mb-10"></el-input>
            <el-table :data="[]" style="width: 100%">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" label="序号" width="50">
              </el-table-column>
              <el-table-column prop="date" label="返回参数名称" width="180">
              </el-table-column>
              <el-table-column prop="name" label="数据类型">
              </el-table-column>
              <el-table-column prop="address" label="返回参数描述" width="180">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class="label mt-15">权限配置</div>
        <el-card class="mb-10 apiPowerForm-el-card">
          <el-form-item label="权限类型" :label-width="formLabelWidth1" prop="powerUser">
            <el-radio-group v-model="apiPowerForm.powerUser">
              <el-radio label="1">使用权限</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限账号" :label-width="formLabelWidth1" prop="powerUser">
            <el-radio-group v-model="apiPowerForm.powerUser">
              <el-radio label="1">应用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限账号所属项目" :label-width="formLabelWidth1" prop="powerUserProject">
            [默认项目[122556445]]
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-form-item label="应用" :label-width="formLabelWidth1" prop="appNameGroup">
                <el-select v-model="apiPowerForm.appNameGroup" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="appName">
                <el-select v-model="apiPowerForm.appName" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-form-item label="有效期" :label-width="formLabelWidth1" prop="dateType">
                <el-select v-model="apiPowerForm.dateType" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in dateTypeList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="date">
                <el-date-picker style="width:180px" align="center" v-model="apiPowerForm.date" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth1" label="申请原因" prop="renew">
            <el-input type="textarea" v-model="apiPowerForm.renew" :rows="4" :maxlength="128" :minlength="5" resize="none" placeholder="请填写申请原因，不少于5个字" show-word-limit></el-input>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="apiPowerVisible = false">取 消</el-button>
        <el-button type="primary">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 服务权限申请 -->
    <el-dialog title="服务单元权限申请" :visible.sync="serverPowerVisible">
      <el-form :model="serverPowerForm" :rules="serverPowerRule" ref="serverPowerForm">
        <div class="label">服务单元权限对象</div>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="服务单元" :label-width="formLabelWidth" prop="appName">
              <el-select v-model="serverPowerForm.appName" placeholder="请选择项目" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" label-width="0" prop="appName">
              <el-select v-model="serverPowerForm.appName" placeholder="请选择服务单元分组" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" label-width="0" prop="appName">
              <el-select v-model="serverPowerForm.appName" placeholder="请选择服务单元" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="label">权限配置</div>
        <el-form-item label="权限类型" :label-width="formLabelWidth" prop="powerType">
          <el-radio-group v-model="serverPowerForm.powerType">
            <el-radio label="1">使用权限</el-radio>
            <el-radio label="2">开发权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限账号" :label-width="formLabelWidth" prop="powerUser">
          <el-radio-group v-model="serverPowerForm.powerUser">
            <el-radio label="1">个人账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="有效期" :label-width="formLabelWidth" prop="dateType">
              <el-select v-model="serverPowerForm.dateType" placeholder="请选择" style="width:100%">
                <el-option :label="item.label" :value="item.value" v-for="item in dateTypeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="" label-width="0" prop="date">
              <el-date-picker style="width:180px" align="center" v-model="serverPowerForm.date" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label-width="formLabelWidth" label="申请原因" prop="renew">
          <el-input type="textarea" v-model="AppPowerForm.renew" :rows="7" :maxlength="128" :minlength="5" resize="none" placeholder="请填写申请原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="serverPowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormServer('serverPowerForm')">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 申请Dataphin数据源权限 -->
    <el-dialog title="申请Dataphin数据源权限" :visible.sync="datasourcePowerVisible" width="880px">
      <div class="step">
        <span class="step-1">
          <i class="iconfont el-step__icon" v-if="activeStep === '1'" style="background: #2D64F0;">1</i>
          <i class="iconfont el-step__icon" v-else style="background: #67c23a;">√</i>
          <span class="ml-5">Dataphin数据源权限对象</span>
        </span>
        <span class="dashed-line"></span>
        <span class="step-1">
          <i class="iconfont el-step__icon" style="background: #2D64F0;">2</i>
          <span class="ml-5">权限申请配置</span>
        </span>
      </div>
      <el-form :model="datasourcePowerForm" :rules="datasourcePowerRule" ref="datasourcePowerForm">
        <template v-if="activeStep === '1'">
          <div class="label">对象信息</div>
          <el-form-item label="数据环境" :label-width="formLabelWidth1" prop="dataEnv">
            <el-select v-model="datasourcePowerForm.dataEnv" placeholder="请选择数据环境" style="width:50%">
              <el-option :label="item.label" :value="item.value" v-for="item in dataEnvList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目" :label-width="formLabelWidth1" prop="project">
            <el-select v-model="datasourcePowerForm.project" placeholder="请选择所属项目" style="width:50%">
              <el-option :label="item.label" :value="item.value" v-for="item in projectList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-form-item label="Dataphin数据源" :label-width="formLabelWidth1" prop="datasourceGroup">
                <el-select v-model="datasourcePowerForm.datasourceGroup" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="datasource">
                <el-select v-model="datasourcePowerForm.datasource" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="逻辑表" :label-width="formLabelWidth1" prop="logic">
            <el-select v-model="datasourcePowerForm.logic" placeholder="请选择" style="width:100%">
              <el-option :label="item.label" :value="item.value" v-for="item in logicList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目" :label-width="formLabelWidth1" prop="physics">
            <el-select v-model="datasourcePowerForm.physics" placeholder="请选择" style="width:100%">
              <el-option :label="item.label" :value="item.value" v-for="item in physicsList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <div class="label">对象信息</div>
          <el-card>
            <el-row>
              <el-col :span="10" class="mb-5">
                <span class="info-label">数据环境:</span>
                <span class="info-value">开发环境</span>
              </el-col>
              <el-col :span="14">
                <span class="info-label">Dataphin数据源:</span>
                <span class="info-value">dataphin1222_1225</span>
              </el-col>
              <el-col :span="24" class="mb-5">
                <span class="info-label">逻辑表:</span>
                <span class="info-value">taba_adfaga</span>
              </el-col>
              <el-col :span="24" class="mb-5">
                <span class="info-label">物理表:</span>
                <span class="info-value">taba_adfaga</span>
              </el-col>
            </el-row>
          </el-card>
          <div class="label mt-10">对象信息</div>
          <div class="report-detail-table" v-for="check in checkList" :key="check.title">
            <ul class="check-info">
              <li>
                <div class="title">
                  <i :class="check.showDetail ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" @click="detailCollapse(check)"></i>
                  <span>{{check.title}}: </span>
                  <span>dim_redesss</span>
                  <span class="label-tag">维度逻辑表</span>
                  <span>已选中：</span>
                  <a href="JavaScript:;">0</a>
                </div>
              </li>
            </ul>
          </div>
          <div class="label mt-10">权限配置</div>
          <el-form-item label="权限类型" :label-width="formLabelWidth1" prop="powerType">
            <el-checkbox-group v-model="datasourcePowerForm.powerType">
              <el-checkbox label="1">查询权限</el-checkbox>
              <el-checkbox label="2">使用权限</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="权限账号" :label-width="formLabelWidth1" prop="powerUser">
            <el-radio-group v-model="datasourcePowerForm.powerUser">
              <el-radio label="1">应用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限账号所属项目" :label-width="formLabelWidth1" prop="powerUserProject">
            [默认项目[122556445]]
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-form-item label="应用" :label-width="formLabelWidth1" prop="appNameGroup">
                <el-select v-model="datasourcePowerForm.appNameGroup" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="appName">
                <el-select v-model="datasourcePowerForm.appName" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in appList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-form-item label="有效期" :label-width="formLabelWidth1" prop="dateType">
                <el-select v-model="datasourcePowerForm.dateType" placeholder="请选择" style="width:100%">
                  <el-option :label="item.label" :value="item.value" v-for="item in dateTypeList" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0" prop="date">
                <el-date-picker style="width:180px" align="center" v-model="datasourcePowerForm.date" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label-width="formLabelWidth" label="申请原因" prop="renew">
            <el-input type="textarea" v-model="datasourcePowerForm.renew" :rows="4" :maxlength="128" :minlength="5" resize="none" placeholder="请填写申请原因，不少于5个字" show-word-limit></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="datasourcePowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="next" v-if="activeStep === '1'">下一步</el-button>
        <el-button type="primary" @click="prev" v-if="activeStep === '2'">上一步</el-button>
        <el-button type="primary" v-if="activeStep === '2'">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '../../mixins'
import pager from '@/mixins/pager'
export default {
  name: 'DataserverPower',
  mixins: [mixin, pager],
  data () {
    return {
      showHome: true,
      fixed: false,
      activeName: 'App',
      tabs: [
        {
          label: '应用权限',
          value: 'App',
          total: 14
        },
        {
          label: 'API权限',
          value: 'Api',
          total: 17
        },
        {
          label: '服务单元权限',
          value: 'server',
          total: 1
        },
        {
          label: 'Dataphin数据源权限',
          value: 'datasource',
          total: 1
        }
      ],
      form: {
        project: '',
        keyWord: ''
      },
      projectList: [],
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
      loading: 0,
      AppPowerVisible: false,
      serverPowerVisible: false,
      datasourcePowerVisible: false,
      apiPowerVisible: false,
      AppPowerForm: {
        appName: '',
        powerType: '',
        powerUser: '',
        dateType: '',
        renew: ''
      },
      apiPowerForm: {
        apiProject: '',
        apiGroup: '',
        api: '',
        powerUser: ''
      },
      serverPowerForm: {
        appName: '',
        powerType: '',
        powerUser: '',
        dateType: '',
        renew: ''
      },
      datasourcePowerForm: {
        dataEnv: '',
        project: '',
        datasource: '',
        datasourceGroup: '',
        powerType: '',
        powerUser: '',
        powerUserProject: '',
        appNameGroup: '',
        appName: '',
        dateType: '',
        date: '',
        renew: ''
      },
      AppPowerRules: {
        appName: [
          { required: true }
        ],
        powerType: [
          { required: true }
        ],
        powerUser: [
          { required: true }
        ],
        dateType: [
          { required: true }
        ],
        renew: [
          { required: true }
        ]
      },
      apiPowerRule: {
        apiProject: [
          { required: true }
        ],
        apiGroup: [
          { required: true }
        ],
        api: [
          { required: true }
        ],
        powerUser: [
          { required: true }
        ]
      },
      serverPowerRule: {
        appName: [
          { required: true }
        ],
        powerType: [
          { required: true }
        ],
        powerUser: [
          { required: true }
        ],
        dateType: [
          { required: true }
        ],
        renew: [
          { required: true }
        ]
      },
      datasourcePowerRule: {
        dataEnv: [
          { required: true }
        ],
        project: [
          { required: true }
        ],
        datasource: [
          { required: true }
        ],
        datasourceGroup: [
          { required: true }
        ],
        powerType: [
          { required: true }
        ],
        powerUser: [
          { required: true }
        ],
        powerUserProject: [
          { required: true }
        ],
        appNameGroup: [
          { required: true }
        ],
        appName: [
          { required: true }
        ],
        dateType: [
          { required: true }
        ],
        date: [
          { required: true }
        ],
        renew: [
          { required: true }
        ]
      },
      formLabelWidth: '100px',
      formLabelWidth1: '140px',
      appList: [],
      dateTypeList: [],
      dataEnvList: [],
      logicList: [],
      physicsList: [],
      apiProjectList: [],
      apiGroupList: [],
      apiList: [],
      activeStep: '1',
      checkList: [
        { title: '逻辑表', key: 'logic', list: [] }
      ],
      activeNameApiTab: 'first'
    }
  },
  created () {
  },
  methods: {
    changeTab (val) {
      this.activeName = val
    },
    AppPowerHandle () {
      this.AppPowerVisible = true
    },
    serverPowerHandle () {
      this.serverPowerVisible = true
    },
    submitFormApp (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { }
      })
    },
    submitFormServer (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { }
      })
    },
    next () {
      this.activeStep = '2'
    },
    prev () {
      this.activeStep = '1'
    },
    detailCollapse () { }
  }
}
</script>

<style lang="scss" scoped>
.data-server-powwer {
  height: 100%;
  position: relative;
  background: #ebeaef;
  > div {
    overflow-y: overlay;
    height: 100%;
    padding: 10px 15px 56px 15px;
  }
  .formSearch {
    ::v-deep .el-form-item {
      margin-bottom: 0 !important;
    }
    .search {
      .el-input {
        width: 200px;
        ::v-deep .el-input__inner {
          border: none;
          border-bottom: 1px solid $grey6;
          border-radius: 0;
          background-color: #fff;
        }
      }
    }
  }
  .label {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    padding: 0 0 15px 0;
  }
  .step {
    // text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      border-radius: 50%;
      color: #fff;
    }
    .dashed-line {
      width: 100px;
      display: inline-block;
      border-bottom: 1px dashed rgba($color: #000000, $alpha: 0.8);
      margin: 2px 10px 0 10px;
    }
  }
  .info-label {
    color: rgba($color: #000000, $alpha: 0.5);
    margin-right: 5px;
    display: inline-block;
    width: 120px;
    text-align: end;
  }
  .report-detail-table {
    // margin-top: 10px;
    background: #fff;
    .info-table {
      background: #ffff;
      margin-top: 10px;
      padding: 10px;
    }
    .mark {
      border-left: 3px solid #3f5dff;
      padding-left: 10px;
      .part {
        margin-right: 35px;
      }
    }
    .check-info {
      display: flex;
      li {
        display: flex;
        min-width: 280px;
        padding: 10px;
        .label,
        .value {
          font-size: 14px;
        }
      }
    }
  }
  .label-tag {
    padding: 4px 10px;
    background: rgba($color: #000000, $alpha: 0.05);
    margin: 0 5px;
    font-size: 12px;
  }
}
::v-deep .apiPowerForm .el-dialog__body {
  max-height: 520px !important;
  overflow: auto;
  .apiPowerForm-el-card {
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
}
</style>
