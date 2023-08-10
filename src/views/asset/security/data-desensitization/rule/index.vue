<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-08 17:18:09
 * @Description:
-->

<template>
  <section class="security-wrapper">
    <div class="dp-page-layout">
      <div class="dp-page-header-filters">
        <div class="head">
          <div class="flex">
            <div class="page-title mr-20">脱敏规则</div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="动态脱敏" name="1"></el-tab-pane>
              <el-tab-pane label="动态脱敏白名单" name="2"></el-tab-pane>
              <el-tab-pane label="静态脱敏" name="3"></el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="activeName === '1'">
            <el-button type="primary" icon="el-icon-plus" @click="addRule">新建动态脱敏规则</el-button>
            <el-button @click="getTableList()"><i class="el-icon-refresh-right"></i></el-button>
          </div>
          <div v-if="activeName === '2'">
            <el-button type="primary" icon="el-icon-plus" @click="addWhiteList">新建动态脱敏白名单</el-button>
            <el-button @click="getTableList()"><i class="el-icon-refresh-right"></i></el-button>
          </div>
        </div>

        <div v-show="activeName !== '3'">
          <div class="introduce-wrapper">
            <div class="title">
              <span>规则介绍</span>
              <i class="iconfont icon-shousuoshangjiantou"></i>
            </div>
            <el-divider></el-divider>
            <div class="introduce">
              <div class="list-wrapper" v-for="(item, index) in list" :key="index">
                <div style="width: 100%">
                  <div class="type"><i class="iconfont icon-font icon-shousuo"></i>{{item.type}}</div>
                  <div class="content">{{item.content}}</div>
                </div>
                <el-divider direction="vertical" v-if="index < list.length - 1"></el-divider>
              </div>
            </div>
          </div>

          <FilterFieldCard v-if="activeName === '1'" class="mb-10" ref="filterFieldCard" placeholder="请输入脱敏规则名称" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>

          <FilterFieldCard v-if="activeName === '2'" class="mb-10" ref="filterFieldCard" placeholder="请输入白名单名称" @confirm="getTableList" :filterData="filterData2"></FilterFieldCard>
        </div>
      </div>
      <div class="dp-table-layout">
        <el-table v-show="activeName === '1'" :data="tableData" tooltip-effect="dark" height="100%" style="width: 100%" :class="{'fixed': fixed}" v-loading="!!loading">
          <el-table-column prop="maskRuleName" label="脱敏规则名称" width="200">
          </el-table-column>
          <el-table-column prop="identifyRuleName" label="识别规则">
          </el-table-column>
          <el-table-column prop="maskTypeName" label="脱敏分类">
          </el-table-column>
          <el-table-column prop="maskAlgoName" label="脱敏算法">
          </el-table-column>
          <el-table-column prop="appSceneDesc" label="应用场景">
            <template slot-scope="{row}">
              <OverflowTooltip class="width">{{row.appSceneDesc}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="负责人">
          </el-table-column>
          <el-table-column prop="updatedDate" label="更新时间">
            <template slot-scope="{row}">
              <OverflowTooltip class="width">{{row.updatedDate}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="生效状态">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" active-value="1" inactive-value="0" @change=changeStatus1(row)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" @click="editRuleHandle(row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text"><i class="el-icon-delete font-16 color-btn" @click="handleRuleDel(row)"></i></el-button>
              </el-tooltip>
              <el-button type="text" icon="iconfont icon-gengduo font-14 color-btn" v-popover:morepopover slot="reference">
                <el-popover popper-class="more-popover" placement="bottom" trigger="hover" ref="morepopover">
                  <ul class="popper-list">
                    <li @click="jumpToAlgorithm(row)">
                      <i class="iconfont icon-xiangqing font-14 color-btn mr-10"></i>
                      <span>查看脱敏算法</span>
                    </li>
                    <li @click="jumpToRule(row)">
                      <i class="iconfont icon-xiangqing font-14 color-btn mr-10"></i>
                      <span>查看脱敏规则</span>
                    </li>
                  </ul>
                </el-popover>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table v-show="activeName === '2'" :data="tableData2" tooltip-effect="dark" height="100%" style="width: 100%" :class="{'fixed': fixed}" v-loading="!!loading">
          <el-table-column prop="whiteName" label="白名单名称" width="200">
          </el-table-column>
          <el-table-column prop="accounts" label="生效账号">
          </el-table-column>
          <el-table-column prop="owner" label="负责人">
          </el-table-column>
          <el-table-column prop="startTime" label="生效时段">
            <template slot-scope="{row}">
              <span>{{row.startTime}}~{{row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="appScene" label="生效场景">
            <template slot-scope="{row}">
              <div>
                <OverflowTooltip class="width">{{row.appScene}}</OverflowTooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updatedDate" label="更新时间">
            <template slot-scope="{row}">
              <OverflowTooltip class="width">{{row.updatedDate}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="生效状态" width="100">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" active-value="1" inactive-value="0" @change=changeStatus(row)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" @click="editWhiteList(row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text"><i class="el-icon-delete font-16 color-btn" @click="handleWhitListDel(row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div v-show="activeName === '3'">
          <el-tabs v-model="activeName2" @tab-click="handleClick2">
            <el-tab-pane label="手动任务脱敏" name="a"></el-tab-pane>
            <el-tab-pane label="周期任务脱敏" name="b"></el-tab-pane>
          </el-tabs>
          <div class="carousel-wrapper">
            <el-carousel :interval="5000" indicator-position="outside" :autoplay="false" arrow="always" height="500px">
              <el-carousel-item v-for="(item, index) in 2" :key="index">
                <div class="content">
                  <img :src="require(`@/assets/images/asset/security/snipaste_0${index + 1}.png`)" alt="" />
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
    </div>

    <SelectFooter v-if="activeName !== '3'" :tableData="tableData" :totalNum="total" @sendTableList="sendTableList"></SelectFooter>

    <el-dialog :title="`${type1}动态脱敏规则`" :visible.sync="ruleDialogVisible" width="40%" class="rule-dialog" :close-on-click-modal="false">
      <el-form :model="form1" ref="ruleFormRef" label-width="120px" :rules="rules1">
        <el-form-item label="规则名称" prop="maskRuleName">
          <el-input v-model="form1.maskRuleName" placeholder="请输入动态脱敏规则名称"></el-input>
        </el-form-item>
        <el-form-item label="脱敏规则说明" prop="remark">
          <el-input v-model="form1.remark" type="textarea" :rows="2" :maxlength="200" show-word-limit placeholder="请输入动态脱敏规则说明"></el-input>
        </el-form-item>
        <el-form-item label="识别规则" prop="identifyRuleId" placeholder="请选择脱敏规则">
          <el-row>
            <el-col :span="14">
              <el-select v-model="form1.identifyRuleId" placeholder="请选择脱敏规则" class="rule-select" :disabled="type1 === '编辑'">
                <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId" :disabled="item.bindAlready === '1'">
                  <span style="float: left">{{ item.identifyRuleName }}</span>
                  <span v-if="item.bindAlready === '1'" style="float: right; color: #8492a6; font-size: 13px">已配置脱敏</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <div class="no-rule" @click="jumpToPlanning">无可用规则，去新建 ></div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用场景" prop="appScene">
          <el-checkbox-group v-model="form1.appScene">
            <el-checkbox label="READ_WRITE">写开发表</el-checkbox>
            <el-checkbox label="TEMP_QUERY">即席查询</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="脱敏算法" prop="maskAlgoId1" class="way-select">
          <el-cascader v-model="form1.maskAlgoId1" :props="props" :options="algorithmTypeList" @change=changeMaskAlgoId></el-cascader>
        </el-form-item>
        <el-form-item label="脱敏参数1" prop="maskParams1">
          <el-input v-model="form1.maskParams1" disabled placeholder='字段名称'></el-input>
        </el-form-item>

        <template v-if="form1.maskAlgoId1">
          <el-form-item label="脱敏参数2" v-if="form1.maskAlgoId1[1] === '03999'">
            <div class="params2">
              <el-button type="plain" @click="handleAdd" class="mb-10">新增脱敏区间</el-button>
              <div v-for="(item, index) in section_list" :key="item.section_id" class="mb-10">
                <div>第{{index + 1}}区间</div>
                <div>
                  <span class="mr-5">x</span>
                  <el-input-number v-model="item.x" :min="1" class="mr-20"></el-input-number>
                  <span class="mr-5">y</span>
                  <el-input-number v-model="item.y" :min="1"></el-input-number>
                  <el-select v-model="item.mapping_type" placeholder="选择码表" style="width:100px" class="ml-10">
                    <el-option v-for="item in replaceList" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                  <template v-if="item.mapping_type === 'interval_random'">
                    <el-input-number class="mt-10 ml-10" v-model="item.random_start" :min="0" :max="999"></el-input-number>
                    <span class="mr-10 ml-10 mt-10">—</span>
                    <el-input-number class="mt-10 mr-10" v-model="item.random_end" :min="0" :max="999"></el-input-number>
                  </template>
                  <el-button v-if="item.mapping_type !== 'interval_random'" class="ml-10 mr-5" type="text" @click="handleEdit(item)">{{ item.mapping_type === 'random_table' ? '随机码表' : '映射码表'}} <i class="el-icon-edit-outline"></i></el-button>
                  <el-button type="text" @click="handleDel(index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="脱敏参数2" v-if="form1.maskAlgoId1[0] !== '03'">
            <template v-if="form1.maskAlgoId1[0] === '01'">
              <el-input v-model="params2Arr[0][1]" placeholder="请输入'盐值'"></el-input>
            </template>
            <template v-if="['02005','02006'].includes(form1.maskAlgoId1[1])">
              <div class="params2">
                <div>遮盖脱敏（*和#）</div>
                <el-radio-group v-model="params2Arr[0][1]">
                  <el-radio label="*">*</el-radio>
                  <el-radio label="#">#</el-radio>
                </el-radio-group>
                <div class="mt-10">{{form1.maskAlgoName}}</div>
                <el-radio-group v-model="params2Arr[1][1]">
                  <el-radio label="*">*</el-radio>
                  <el-radio label="@">@</el-radio>
                  <el-radio label=".">.</el-radio>
                </el-radio-group>
              </div>
            </template>
            <template v-if="['02001','02002','02003','02004'].includes(form1.maskAlgoId1[1])">
              <div class="params2">
                <div>遮盖脱敏（*和#）</div>
                <el-radio-group v-model="params2Arr[0][1]">
                  <el-radio label="*">*</el-radio>
                  <el-radio label="#">#</el-radio>
                </el-radio-group>
                <div class="mt-10">{{form1.maskAlgoName}}</div>
                <div v-if="params2Arr.length > 1">
                  <span class="mr-5">{{params2Arr[1][0]}}</span>
                  <el-input-number v-model="params2Arr[1][1]" :min="1" class="mr-20"></el-input-number>
                  <span class="mr-5">{{params2Arr[2][0]}}</span>
                  <el-input-number v-model="params2Arr[2][1]" :min="1"></el-input-number>
                </div>
              </div>
            </template>
            <template v-if="['04001'].includes(form1.maskAlgoId1[1])">
              <div class="params2">
                <div>保留小数点前第N位</div>
                <el-input-number v-model="params2Arr[0][1]" :min="1"></el-input-number>
              </div>
            </template>
            <template v-if="['04003'].includes(form1.maskAlgoId1[1])">
              <div class="params2">
                <div>字符位移</div>
                <el-input-number v-model="params2Arr[0][1]" :min="1"></el-input-number>
                <div></div>
                <el-radio-group v-model="params2Arr[1][1]" class="mt-10">
                  <el-radio :label="1">向左</el-radio>
                  <el-radio :label="2">向右</el-radio>
                </el-radio-group>
              </div>
            </template>
            <template v-if="['05'].includes(form1.maskAlgoId1[0])">
              <el-select v-model="params2Arr[0][1]" placeholder="请选择脱敏密钥">
                <el-option v-for="item in secretKeyList" :key="item.secretKeyId" :label="item.secretKeyName" :value="item.secretKeyId">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </template>

        <el-form-item label="访问板块" prop="unitScopeType">
          <el-row class="mb-10">
            <el-radio v-model="form1.unitScopeType" label="ALL">全部</el-radio>
          </el-row>
          <el-row class="mb-10">
            <el-col :span="4">
              <el-radio v-model="form1.unitScopeType" label="ENUM">枚举</el-radio>
            </el-col>
            <el-col :span="20">
              <el-select v-model="form1.unitIds" multiple placeholder="请选择板块" :disabled="form1.unitScopeType !== 'ENUM'">
                <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="访问项目" prop="projectScopeType">
          <el-row class="mb-10">
            <el-radio v-model="form1.projectScopeType" label="ALL">全部</el-radio>
          </el-row>
          <el-row class="mb-10">
            <el-col :span="4">
              <el-radio v-model="form1.projectScopeType" label="ENUM">枚举</el-radio>
            </el-col>
            <el-col :span="20">
              <el-select v-model="form1.projectIds" multiple placeholder="请选择项目" :disabled="form1.projectScopeType !== 'ENUM'">
                <el-option v-for="(item, index) in projectList" :key="index" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="生效状态" prop="status">
          <el-radio-group v-model="form1.status">
            <el-radio label="1">开</el-radio>
            <el-radio label="0">关</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRuleSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="`${type1}动态脱敏白名单`" :visible.sync="whiteListDialogVisible" width="45%" class="white-dialog" :close-on-click-modal="false">
      <el-form :model="form2" ref="whiteListFormRef" label-width="140px" :rules="rules2">
        <el-form-item label="白名单名称" prop="whiteName">
          <el-input v-model="form2.whiteName" placeholder="请输入白名单名称"></el-input>
        </el-form-item>
        <el-form-item label="白名单名称说明" prop="remark">
          <el-input v-model="form2.remark" type="textarea" :rows="2" :maxlength="200" show-word-limit placeholder="请输入白名单说明"></el-input>
        </el-form-item>
        <!-- <el-form-item label="识别规则" prop="identifyRuleId">
          <el-row>
            <el-col :span="16">
              <el-select v-model="form2.identifyRuleId" placeholder="请选择脱敏规则" class="rule-select" :disabled="type1 === '编辑'">
                <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId" :disabled="item.bindAlready">
                  <span style="float: left">{{ item.identifyRuleName }}</span>
                  <span v-if="item.bindAlready" style="float: right; color: #8492a6; font-size: 13px">已配置脱敏</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <div class="no-rule" @click="jumpToPlanning">无可用规则，去新建 > </div>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item label="生效账号" prop="accounts">
          <el-select v-model="form2.accounts" class="account-select" placeholder="请选择生效账号">
            <el-option v-for="(item, index) in accountList" :key="index" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效场景" prop="appScene">
          <el-checkbox-group v-model="form2.appScene">
            <el-checkbox label="READ_WRITE">写开发表</el-checkbox>
            <el-checkbox label="TEMP_QUERY">即席查询</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="生效范围" class="filter-scope" :rules="{required: true}">
          <div class="filter-item">
            <el-row class="scope-item">
              <el-col :span="4" class="left">
                <span class="num">1</span>
                <span>数据板块</span>
              </el-col>
              <el-col :span="20" class="right">
                <el-row class="mb-10">
                  <el-radio v-model="form2.unitScopeType" label="ALL">全部</el-radio>
                </el-row>
                <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio v-model="form2.unitScopeType" label="ENUM">枚举</el-radio>
                  </el-col>
                  <el-col :span="20">
                    <el-select v-model="form2.unitIds" multiple placeholder="请选择板块" :disabled="form2.unitScopeType !== 'ENUM'">
                      <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <!-- <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio v-model="form2.unitScopeType" label="CUSTOM">自定义</el-radio>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="form2.unitCustomExp" placeholder="请输入自定义正则表达式" :disabled="form2.unitScopeType !== 'CUSTOM'"></el-input>
                  </el-col>
                </el-row> -->
              </el-col>
            </el-row>
          </div>
          <div class="filter-item">
            <el-row class="scope-item">
              <el-col :span="4" class="left">
                <span class="num">2</span>
                <span>表项目</span>
              </el-col>
              <el-col :span="20" class="right">
                <el-row class="mb-10">
                  <el-radio v-model="form2.projectScopeType" label="ALL">全部</el-radio>
                </el-row>
                <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio v-model="form2.projectScopeType" label="ENUM">枚举</el-radio>
                  </el-col>
                  <el-col :span="20">
                    <el-select v-model="form2.projectIds" multiple placeholder="请选择项目" :disabled="form2.projectScopeType !== 'ENUM'">
                      <el-option v-for="item in projectList" :key="item.value" :label="item.name" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <!-- <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio v-model="form2.projectScopeType" label="CUSTOM">自定义</el-radio>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="form2.projectCustomExp" placeholder="请输入自定义正则表达式" :disabled="form2.projectScopeType !== 'CUSTOM'"></el-input>
                  </el-col>
                </el-row> -->
              </el-col>
            </el-row>
          </div>
          <div class="filter-item">
            <el-row class="scope-item">
              <el-col :span="4" class="left">
                <span class="num">3</span>
                <span>数据表</span>
              </el-col>
              <el-col :span="20" class="right">
                <el-row class="mb-10">
                  <el-radio v-model="form2.tableScopeType" label="ALL">全部</el-radio>
                </el-row>
                <el-row class="mb-10">
                  <el-col :span="4">
                    <el-radio v-model="form2.tableScopeType" label="CUSTOM">自定义</el-radio>
                  </el-col>
                  <el-col :span="20">
                    <el-input v-model="form2.tableCustomExp" placeholder="请输入自定义正则表达式" :disabled="form2.tableScopeType !== 'CUSTOM'"></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="生效时段" prop="effectivePeriod">
          <el-date-picker v-model="form2.effectivePeriod" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生效状态" prop="status">
          <el-radio-group v-model="form2.status">
            <el-radio label="1">开</el-radio>
            <el-radio label="0">关</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="whiteListDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleWhiteListSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="自定义替换算法-映射码表" :visible.sync="showCodeTable" width="450px" :close-on-click-modal="false">
      <div>一对映射值如 aaa:bbb 表示aaa映射成bbb, 多对映射值之间用换行分割，如：</div>
      <el-input type="textarea" :rows="6" v-model="codeForm" placeholder="aaa:bbb,ddd:eeee"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCodeSure">确 定</el-button>
        <el-button @click="showCodeTable = false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import SelectFooter from '@c/footer-simple'
import pager from '@/mixins/pager'
import {
  getAlgorithmTypes,
  getAlgorithmTypeTree,
  getPagedDesensitizeRule,
  saveDesensitizeRule,
  getDesensitizeRule,
  deleteDesensitizeRule,
  getPagedDesensitizeWhite,
  saveDesensitizeWhiteListRule,
  getDesensitizeWhiteListRule,
  desensitizeWhiteStatus,
  desensitizeRuleStatus,
  deleteDesensitizeWhiteListRule,
  getPagedIdentifyRule,
  getBusinList,
  getProjectList,
  getSecretKeysData,
  replaceMaskType,
  getRelationUsers
} from '@/api/asset/security.js'

export default {
  name: 'Rule',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      loading: 0,
      activeName: '1',
      activeName2: 'a',
      fixed: false,
      list: [
        {
          type: '动态脱敏规则',
          content: '对满足条件的数据对象进行数据变形或加密实现敏感隐私数据的可靠保护'
        },
        {
          type: '动态脱敏白名单',
          content: '通过白名单对用户、场景、范围进行设置，以满足特定时段、特定场景下数据不脱敏的效果'
        },
        {
          type: '静态脱敏',
          content: '对计算源相关的表通过选择字段引用脱敏算法选择部分或全部字段输出，生成目标表'
        }
      ],
      filterData: [],
      filterData2: [],
      tableData: [],
      tableData2: [],
      props: {
        label: 'name'
      },
      type1: '新建',
      form1: {},
      form2: {},
      ruleDialogVisible: false,
      whiteListDialogVisible: false,
      rules1: {
        maskRuleName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        identifyRuleId: [
          { required: true, message: '请选择脱敏规则', trigger: 'change' }
        ],
        appScene: [
          { type: 'array', required: true, message: '请至少选择一个应用场景', trigger: 'change' }
        ],
        maskAlgoId1: [
          { required: true, message: '请选择脱敏算法', trigger: 'change' }
        ],
        maskParams2: [
          { required: true, message: '请输入脱敏参数2', trigger: 'change' }
        ],
        unitScopeType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        projectScopeType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      rules2: {
        whiteName: [
          { required: true, message: '请输入白名单名称', trigger: 'blur' }
        ],
        identifyRuleId: [
          { required: true, message: '请选择脱敏规则', trigger: 'change' }
        ],
        accounts: [
          { required: true, message: '请选择生效账号', trigger: 'change' }
        ],
        appScene: [
          { required: true, message: '请选择生效场景', trigger: 'change' }
        ],
        effectivePeriod: [
          { required: true, message: '请选择生效时段', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      accountList: [],
      categoryList: [],
      algorithmTypeList: [],
      identifyRuleList: [],
      unitList: [],
      projectList: [],
      params2Arr: [['', ''], ['', ''], ['', '']],
      secretKeyList: [],
      section_list: [
        {
          'section_id': Date.now(),
          'x': '',
          'y': '',
          'mapping_type': 'random_table',
          'replace_values': ''
        }
      ],
      replaceList: [],
      tempRow: {},
      showCodeTable: false,
      codeForm: ''
    }
  },
  watch: {
    'form1.unitIds' (val) {
      if (val) {
        const unitId = `${val}`
        this.getProjectData(unitId)
      }
    },
    'form2.unitIds' (val) {
      if (val) {
        const unitId = `${val}`
        this.getProjectData(unitId)
      }
    }
  },
  async created () {
    await this.getAlgorithmTypeList()
    this.filterData2 = [
      {
        label: '生效场景',
        id: '生效场景',
        options: [
          {
            id: 'READ_WRITE',
            label: '写开发表'
          },
          {
            id: 'TEMP_QUERY',
            label: '即席查询'
          }
        ]
      }
    ]
    this.filterData = [
      {
        label: '脱敏类型',
        id: '脱敏类型',
        options: this.categoryList
      }
    ]
    await this.getTableList()
  },
  mounted () {
    this.getTableList()
    this.getAlgorithmTypeData()
    this.getRuleList()
    this.getBizunitList()
    this.getReplaceMaskTypeList()
    this.getAccountList()
  },
  methods: {
    changeMaskAlgoId (val) {
      this.configData(...val)
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    configData (maskTypeId, maskAlgoId) {
      console.log(maskTypeId, maskAlgoId)

      if (maskTypeId === '05') {
        const data = {
          '05001': 'AES',
          '05002': 'DES',
          '05003': '3DES',
          '05004': 'SM4',
          '05005': 'RAS',
          '05006': 'SM2'
        }
        this.getSecretKeys(data[maskAlgoId])
      }

      if (maskTypeId === '01') {
        this.form1.maskTypeName = '哈希脱敏'
        this.params2Arr = [['salt', '']]
      }

      if (maskTypeId === '02') {
        this.form1.maskTypeName = '遮盖脱敏（*和#）'
        switch (maskAlgoId) {
          case '02001':
            this.form1.maskAlgoName = '保留前n后m'
            this.params2Arr = [['cover_char', '*'], ['n', ''], ['m', '']]
            break
          case '02002':
            this.form1.maskAlgoName = '保留自x至y'
            this.params2Arr = [['cover_char', '*'], ['x', ''], ['y', '']]
            break
          case '02003':
            this.form1.maskAlgoName = '遮盖前n后m'
            this.params2Arr = [['cover_char', '*'], ['n', ''], ['m', '']]
            break
          case '02004':
            this.form1.maskAlgoName = '遮盖自x至y'
            this.params2Arr = [['cover_char', '*'], ['x', ''], ['y', '']]
            break
          case '02005':
            this.form1.maskAlgoName = '特殊字符前遮盖（针对首次出现该字符）'
            this.params2Arr = [['cover_char', '*'], ['special_char', '*']]
            break
          case '02006':
            this.form1.maskAlgoName = '特殊字符后遮盖（针对首次出现该字符）'
            this.params2Arr = [['cover_char', '*'], ['special_char', '*']]
            break
          default:
            break
        }
      }

      if (maskTypeId === '03') {
        this.form1.maskTypeName = '替换脱敏'
      }

      if (maskTypeId === '04') {
        this.form1.maskTypeName = '变换脱敏'
        if (maskAlgoId === '04001') {
          this.params2Arr = [['retain_n', '']]
        }
        if (maskAlgoId === '04003') {
          this.params2Arr = [['move_n_bit', ''], ['move_forword', '']]
        }
      }

      if (maskTypeId === '05') {
        this.form1.maskTypeName = '加密脱敏'
        this.params2Arr = [['secret_key_id', '']]
      }
    },

    async getAccountList () {
      const res = await getRelationUsers()
      if (res) {
        this.accountList = res.data
      }
    },

    async getReplaceMaskTypeList () {
      const res = await replaceMaskType()
      if (res) {
        this.replaceList = res.data
      }
    },

    async getSecretKeys (algoType) {
      const params = {
        algoType,
        pageNo: 1,
        pageSize: 100
      }
      const res = await getSecretKeysData(params)
      if (res) {
        this.secretKeyList = res.data.totalList
      }
    },

    async getAlgorithmTypeData () {
      const res = await getAlgorithmTypeTree()
      if (res) {
        this.algorithmTypeList = res.data
      }
    },

    async getRuleList () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getPagedIdentifyRule(params)
      if (res) {
        this.identifyRuleList = res.data.totalList
      }
    },

    async getBizunitList () {
      const res = await getBusinList()
      if (res) {
        this.unitList = res.data
      }
    },

    async getProjectData (unitId) {
      const res = await getProjectList({ unitId })
      if (res) {
        this.projectList = res.data
      }
    },

    async getTableList (curFilter = [], keyword = '') {
      if (this.activeName === '1') {
        let params = {
          maskRuleName: keyword,
          maskTypeId: '',
          ...this.pageFilters
        }
        curFilter.forEach(e => {
          switch (e.module) {
            case '脱敏类型':
              params.maskTypeId = e.value
              break
            case '生效场景':
              params.appScene = e.value
              break
          }
        })
        this.getPagedDesensitizeRuleList(params)
      }

      if (this.activeName === '2') {
        let params = {
          whiteName: keyword,
          appScene: '',
          ...this.pageFilters
        }
        curFilter.forEach(e => {
          switch (e.module) {
            case '脱敏类型':
              params.maskTypeId = e.value
              break
            case '生效场景':
              params.appScene = e.value
              break
          }
        })
        this.getPagedDesensitizeWhiteList(params)
      }
    },

    async getPagedDesensitizeRuleList (params) {
      const res = await getPagedDesensitizeRule(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    },

    // 白名单列表
    async getPagedDesensitizeWhiteList (params) {
      const res = await getPagedDesensitizeWhite(params)
      if (res) {
        this.tableData2 = res.data.totalList
        this.total = res.data.total
      }
    },

    jumpToAlgorithm (row) {
      this.$router.push({ path: '/asset/security/data-desensitization/algorithm', query: { maskAlgoName: row.maskAlgoName } })
    },

    jumpToRule (row) {
      this.$router.push({ path: '/asset/security/data-identification/planning', query: { identifyRuleName: row.identifyRuleName } })
    },

    jumpToPlanning () {
      this.$router.push({ path: '/asset/security/data-identification/planning' })
    },

    // 编辑脱敏规则
    async editRuleHandle (row) {
      const res = await getDesensitizeRule({ maskRuleId: row.maskRuleId })
      if (res) {
        const { maskAlgoName, maskTypeId, maskAlgoId, appScene, projectIds, unitIds, maskParams2 } = res.data
        this.getSecretKeys(maskAlgoName)
        this.form1 = res.data
        this.form1.projectIds = projectIds ? projectIds.split(',') : []
        this.form1.unitIds = unitIds ? unitIds.split(',') : []
        this.form1.appScene = appScene.split(',')
        const maskAlgoId1 = [maskTypeId, maskAlgoId]
        // this.form1.maskAlgoId1 = [maskTypeId, maskAlgoId] // 某些情形 页面没更新 03
        this.$set(this.form1, 'maskAlgoId1', maskAlgoId1)

        let str = maskParams2 // '{"salt":"123456"}'
        if (str) {
          let obj = JSON.parse(str)
          if (maskAlgoName === '自定义替换') {
            // this.section_list = obj.section_list
            // this.section_list.forEach(ele => {
            //   ele.replaceList = this.getList(ele.replace_values)
            // })
          }
          this.params2Arr = Object.entries(obj)
          console.log(999, this.params2Arr)
        }
        this.type1 = '编辑'
        this.showRuleForm()
      }
    },

    // 新建脱敏规则
    addRule () {
      this.form1 = {
        appScene: [],
        unitScopeType: 'ALL',
        projectScopeType: 'ALL',
        status: '1',
        projectIds: '',
        unitIds: ''
      }
      this.type1 = '新建'
      this.showRuleForm()
    },

    showRuleForm () {
      this.ruleDialogVisible = true
      this.$nextTick(() => {
        this.$refs['ruleFormRef'].clearValidate()
      })
    },

    handleRuleSure () {
      if (this.params2Arr && this.params2Arr.length) {
        const maskParams2 = {}
        this.params2Arr.forEach(ele => {
          maskParams2[ele[0]] = ele[1]
        })
        this.form1.maskParams2 = JSON.stringify(maskParams2)
      }

      console.log(9999, this.form1)
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          this.submitRule()
        }
      })
    },

    async submitRule () {
      const params = JSON.parse(JSON.stringify(this.form1))
      params.maskTypeId = params.maskAlgoId1[0]
      params.maskAlgoId = params.maskAlgoId1[1]
      params.appScene = `${params.appScene}`
      params.projectIds = `${params.projectIds}`
      params.unitIds = `${params.unitIds}`
      delete params['maskAlgoId1']

      const res = await saveDesensitizeRule(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.ruleDialogVisible = false
        this.getTableList()
      }
    },

    handleWhiteListSure () {
      this.$refs.whiteListFormRef.validate(valid => {
        if (valid) {
          this.updateWhiteList()
        }
      })
    },

    async updateWhiteList () {
      const params = JSON.parse(JSON.stringify(this.form2))
      params.startTime = params.effectivePeriod[0]
      params.endTime = params.effectivePeriod[1]
      params.appScene = `${params.appScene}`
      params.projectIds = `${params.projectIds}`
      params.unitIds = `${params.unitIds}`
      delete params['effectivePeriod']

      const res = await saveDesensitizeWhiteListRule(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.whiteListDialogVisible = false
        this.getTableList()
      }
    },

    // 编辑脱敏白名单
    async editWhiteList (row) {
      const res = await getDesensitizeWhiteListRule({ whiteId: row.whiteId })
      if (res) {
        const { appScene, projectIds, unitIds } = res.data
        this.form2 = res.data
        this.form2.projectIds = projectIds ? projectIds.split(',') : []
        this.form2.unitIds = unitIds ? unitIds.split(',') : []
        this.form2.appScene = appScene.split(',')
        this.form2.effectivePeriod = [res.data.startTime, res.data.endTime]
        this.type1 = '编辑'
        this.showWhiteList()
      }
    },

    // 新建脱敏白名单
    addWhiteList () {
      this.form2 = {
        appScene: [],
        unitScopeType: 'ALL',
        projectScopeType: 'ALL',
        tableScopeType: 'ALL',
        status: '1',
        projectIds: '',
        unitIds: ''
      }
      this.type1 = '新建'
      this.showWhiteList()
    },

    showWhiteList () {
      this.whiteListDialogVisible = true
      this.$nextTick(() => {
        this.$refs['whiteListFormRef'].clearValidate()
      })
    },

    async getAlgorithmTypeList () {
      const res = await getAlgorithmTypes()
      if (res) {
        this.categoryList = res.data.map(item => {
          return {
            id: item.value,
            label: item.name
          }
        })
      }
    },

    handleRuleDel (row) {
      this.$confirm(`确定删除脱敏规则, ${row.identifyRuleName} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitRuleDel(row.maskRuleId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async submitRuleDel (maskRuleId) {
      const res = await deleteDesensitizeRule({ maskRuleId })
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },

    handleWhitListDel (row) {
      this.$confirm(`确定删除白名单, ${row.whiteName} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitWhitListDel(row.whiteId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async submitWhitListDel (whiteId) {
      const res = await deleteDesensitizeWhiteListRule({ whiteId })
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },

    // 白名单
    async changeStatus (row) {
      const params = {
        whiteId: row.whiteId,
        status: row.status
      }
      const res = await desensitizeWhiteStatus(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '状态修改成功!'
        })
      }
    },

    // 动态脱敏
    async changeStatus1 (row) {
      const params = {
        maskRuleId: row.maskRuleId,
        status: row.status
      }
      const res = await desensitizeRuleStatus(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '状态修改成功!'
        })
      }
    },

    handleClick (val) {
      this.getTableList()
    },

    handleClick2 (val) { },

    handleAdd () {
      const param = {
        'section_id': Date.now(),
        'x': '',
        'y': '',
        'mapping_type': 'random_table',
        'replace_values': ''
      }
      this.section_list.push(param)
    },

    handleEdit (row) {
      this.showCodeTable = true
      // this.codeForm = row.replace_values
      this.tempRow = row
    },

    handleCodeSure () {
      this.showCodeTable = false
      this.tempRow.replace_values = this.codeForm
    },

    handleDel (index) {
      this.section_list.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.el-carousel {
  .el-carousel__button {
    height: 12px;
    width: 12px;
    border-radius: 12px;
  }
}
</style>
<style lang="scss" scoped>
.security-wrapper {
  position: relative;
  height: 100%;
  .carousel-wrapper {
    // padding: 60px 80px;
    margin: 80px 200px;
    .content {
      background-color: #fff;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .table-name {
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .way-select {
    .el-cascader {
      width: 100%;
    }
  }
  .no-rule {
    color: #2a51f6;
    margin-left: 20px;
    cursor: pointer;
  }
  .filter-scope {
    display: flex;
    flex-direction: column;
    ::v-deep .el-form-item__content {
      margin-left: 20px !important;
    }
    .filter-item {
      display: flex;
      margin-left: 50px;
      margin-top: 10px;
      .scope-item {
        width: 100%;
        .left {
          .num {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            background-color: #a0c2fc;
            color: #fff;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
