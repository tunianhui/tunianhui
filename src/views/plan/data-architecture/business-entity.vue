
<template>
  <div class="topic-domain-management height-100per flex-column">
    <div class="topic-domain-management-content" v-if="hasData">
      <div class="topic-domain-table-list" v-if="pageType == 'form'">
        <div class="business-box" style="margin: 10px; float: right;">
          <el-button class="btn" type="primary" icon="el-icon-plus" @click="handleAddData">新建业务实体</el-button>
          <el-button class="btn btn_search" type="primary" icon="el-icon-refresh-right"
            @click="getTableList()"></el-button>
          <el-input class="searchBox" clearable v-model="keyword" prefix-icon="el-icon-search" placeholder="请输入关键字搜索"
            @input="searchChange"></el-input>
        </div>

        <el-table ref="tableList" :data="tableList" style="width: 100%; margin-bottom: 20px" row-key="entity_id" border
          :select-on-indeterminate="true" @select-all="selectAll" @select="select" :tree-props="{ children: 'children' }">
          <!-- @selection-change="handleSelectionChange" -->
          <!--  @select-all="selectAll"   @select="select"-->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="主题域名称/编码" width="240">
            <template slot-scope="scope">
              <div></div> <br>
              <div>
                 <img v-if="scope.row.entity_type == '普通对象'" style="margin-right: 8px" src="@/assets/images/type1.png"
                  width="36px" />
                 <img v-if="scope.row.entity_type == '枚举对象'" style="margin-right: 8px" src="@/assets/images/type2.png"
                  width="36px" />
                 <img v-if="scope.row.entity_type == '虚拟对象'" style="margin-right: 8px" src="@/assets/images/type3.png"
                  width="36px" />
                 <img v-if="scope.row.entity_type == '层级对象'" style="margin-right: 8px" src="@/assets/images/type4.png"
                  width="36px" />
                 <img v-if="scope.row.entity_type == '业务事件'" style="margin-right: 8px" src="@/assets/images/type5.png"
                  width="36px" />
                 <img v-if="scope.row.entity_type == '业务快照'" style="margin-right: 8px" src="@/assets/images/type6.png"
                  width="36px" />
                 <img v-if="scope.row.entity_type == '业务流程'" style="margin-right: 8px" src="@/assets/images/type7.png"
                  width="36px" />
                <span style="display: inline-block">
                  <span style="position: absolute;left: 0px; font-size: 12px; color: blue;"> {{ scope.row.relation_type }}
                  </span><br />
                  {{ scope.row.entity_name }} <br />
                  {{ scope.row.entity_code }}<br />
                </span>
                <el-button type="text" size="mini" @click="chooseTree(scope.$index, scope.row)">
                   <img src="@/assets/images/relationship.png" width="12px" />
                </el-button>
              </div>
              <!-- </span> -->
            </template>
          </el-table-column>
          <el-table-column prop="data_name" label="所属主体域" sortable show-overflow-tooltip></el-table-column>

          <el-table-column prop="biz_type,entity_type" label="实体类型" sortable show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.biz_type }}<br><span>{{ scope.row.entity_type }}</span></span>
            </template>
          </el-table-column>
          <el-table-column prop="responsible_user" label="责任人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip>

            <template slot-scope="scope">

              <span v-if="scope.row.status == '5'"> <i class="iconfont icon-kaifazhong"
                  style="color: #EABA19;vertical-align: bottom;font-size:18px"></i>草稿</span>
              <span v-if="scope.row.status == '6'"> <i class="el-icon-success font-16"
                  style="color: #67C23A"></i>已发布</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="entity_code" label="相关逻辑表" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="rel_logic_num" label="相关逻辑表" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.rel_logic_num }}</span>
              <span>  <img class="btn_img" src="@/assets/images/logic_r.png" style="margin: 5px;"
                  @click="checkLogic(scope.row)" type="text" title="相关逻辑表" width="14px"></span>
              <!-- <span v-if="scope.row.status == '7'">开发中</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="comments" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">

              <img class="btn_img" src="@/assets/images/edit.png" type="text" title="编辑"
                @click="handleEditData(scope.row)" width="14px">
              <!--
                <span v-if="scope.row.status == '5'">草稿</span>
                <span v-if="scope.row.status == '6'">已发布</span> -->

               <img class="btn_img" src="@/assets/images/upload.png" @click="entityPublish(scope.row)"
                v-if="scope.row.status == '5'" type="text" title="上线" width="14px">
               <img class="btn_img" src="@/assets/images/outline.png" @click="entityOffLine(scope.row)"
                v-if="scope.row.status == '6'" type="text" title="下线" width="14px">
               <img class="btn_img" src="@/assets/images/logic.png" type="text" title="关联表"
                @click="queryProject(scope.row)" width="14px">
               <img class="btn_img" src="@/assets/images/version.png" type="text" title="版本"
                @click="checkVersion(scope.row)" width="14px">
              <SimpleConfirm @confirm="handleDeleteData(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="fr pt-10" @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo"
          layout="total, prev, pager, next" :total="total"></el-pagination>
        <div class="fl pt-10">
          <el-checkbox v-model="allChecked" style="background-color: white" label="本页全选" border
            @change="handleAllChecked"></el-checkbox>
          <el-button icon="el-icon-delete" style="margin-left:10px" size="mini" :disabled="delInBatchesStatus"
            @click="delInBatches()">
            批量删除
          </el-button>
          <el-button icon="el-icon-delete" size="mini" :disabled="delInBatchesStatus" @click="BatchPublish">
            批量上线
          </el-button>
          <el-button icon="el-icon-delete" size="mini" :disabled="delInBatchesStatus" @click="entityBatchOffLine">
            批量下线
          </el-button>

        </div>
      </div>
      <div v-else>
        <div style="height: 800px; border: 1px solid #eee">
          <div class="taglist">
            <div v-for="item in tagTreeData" :key="item.id" class="tagitem" @click="chhoseItem(item)">
              <div>
                <img :src='filterImgSrc(item)' alt="" srcset="" />
                <!-- <img src='@/assets/images/topic/zty-p.png' alt="" srcset="" /> -->
              </div>
              <div>{{ item.name }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无业务实体">
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="handleAddData">新建业务实体</el-button>
        </div>

      </el-empty>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="40%" :before-close="handleCancel"
      custom-class="form-dialog" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{
        trigger: '.el-dialog__header',
        body: '.el-dialog',
        recover: false
      }">
      <div v-if="dialogType == 'dataField'">
        <el-form ref="dataFieldForm" :model="dataFieldForm" :rules="dataFieldFormRules" label-width="120px"
          label-suffix="：" label-position="right">
          <el-form-item label="实体名称" prop="entity_name">
            <el-input v-model="dataFieldForm.entity_name" maxlength="64" show-word-limit
              placeholder="64个字符，允许中文、数字、字母、下划线或连字符"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="entity_code">
            <el-input v-model="dataFieldForm.entity_code" maxlength="64" show-word-limit
              placeholder="请输入编码，64个字符，允许数字、字母、下划线"></el-input>
          </el-form-item>
          <el-form-item label="实体类型" prop="entity_type">
            <!--queryEntityTypeList-->
            <!--            <el-input v-model="dataFieldForm.entity_type" placeholder="请选择实体类型"></el-input>-->
            <el-cascader v-model="dataFieldForm.entity_type" :disabled="is_disabled"
              :options="queryEntityTypeList_options" @change="handleChange2" style="width: 100%">
            </el-cascader>
          </el-form-item>
          <el-form-item label="主题域" prop="data_id">
            <el-select v-model="dataFieldForm.data_name" placeholder="请选择" @change="$forceUpdate()" ref="treeSelect">
              <el-option :label="dataFieldForm.data_name" :value="dataFieldForm.data_name" @change="$forceUpdate()"
                style="max-height:auto;background-color:#fff;padding: 0;font-weight:400">
                <el-tree :data="dataFieldList" :props="{ children: 'children', label: 'name' }" accordion
                  :highlight-current="true" :expand-on-click-node="false" @change="$forceUpdate()"
                  @node-click="handleNodeClick">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" prop="responsible_user">
            <el-select v-model="dataFieldForm.responsible_user" placeholder="">
              <el-option v-for="item in queryUserList_Info" :key="item.user_id" :label="item.user_name"
                :value="item.user_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="comments">
            <el-input type="textarea" v-model="dataFieldForm.comments" maxlength="128" show-word-limit
              placeholder="请输入描述"></el-input>
          </el-form-item>


          <el-form-item label="继承自实体" prop="extend_entity_id"
            v-if="dataFieldForm.entity_type != undefined && dataFieldForm.entity_type[1] == '1'">
            <el-select v-model="dataFieldForm.extend_entity_id" clearable placeholder="" @change="$forceUpdate()">
              <el-option v-for="item in getList1_options" :key="item.entity_id" :label="item.entity_name"
                :value="item.entity_id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关联实体" prop="rel_entity_info"
            v-if="dataFieldForm.entity_type != undefined && (dataFieldForm.entity_type[1] == '1' || dataFieldForm.entity_type[1] == '5' || dataFieldForm.entity_type[1] == '6' || dataFieldForm.entity_type[1] == '7')">
            <el-select v-model="dataFieldForm.rel_entity_info" placeholder="" multiple @change="$forceUpdate()">
              <el-option v-for="item in getList2_options" :key="item.entity_id" :label="item.entity_name"
                :value="item.entity_id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="前序业务流程" prop="pre_biz_flow_info"
            v-if="dataFieldForm.entity_type != undefined && dataFieldForm.entity_type[1] == '7'">
            <el-select v-model="dataFieldForm.pre_biz_flow_info" placeholder="" multiple @change="$forceUpdate()">
              <el-option v-for="item in getList3_options" :key="item.entity_id" :label="item.entity_name"
                :value="item.entity_id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="流程事件" prop="flow_event_info"
            v-if="dataFieldForm.entity_type != undefined && dataFieldForm.entity_type[1] == '7'">
            <el-select v-model="dataFieldForm.flow_event_info" placeholder="" @change="$forceUpdate()" multiple>
              <el-option v-for="item in getList4_options" :key="item.entity_id" :label="item.entity_name"
                :value="item.entity_id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上线 -->
    <el-dialog :visible.sync="centerDialogVisible" title="上线" width="30%">
      <span>你确定上线该业务实体吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联表 -->
    <el-dialog :visible.sync="dialogFormVisible" title="关联表" width="30%">
      <el-form :model="form">
        <el-form-item label="项目">
          <el-select v-model="form.region" placeholder="请选择关联项目">
            <el-option v-for="item in region" :key="item.project_id" :label="item.project_name" :value="item.project_id"></el-option>

          </el-select>
        </el-form-item>






      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="jumpPage">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 版本详情 -->
    <el-dialog :visible.sync="versionFormVisible" title="版本详情" width="50%">
      <el-form :model="versionform">
        <el-row class="t-flag">
          <el-col :span="8">
            <el-form-item label="">

              <el-select v-model="versionObj.versions" placeholder="" @change="changeVersion($event)">
                <el-option v-for="(item, index) in versionList" :key="index" :label="item.versions"
                  :value="item.versions"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改人">
              <div>{{ versionform.oper_user }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <div>{{ versionform.create_time }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="m-flag">
          <el-row>
            <el-col :span="24" class="line">
              <span class="m-flag-text">基本信息</span>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="1">
              <el-form-item label="">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="类型:">
                <span>{{ versionform.entity_type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="板块名：">
                <div>{{ versionform.busin_name }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名称(编码)：">
                <div>{{ versionform.entity_code }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="1">
              <el-form-item label="">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="中文名称(名称)：">
                <div>{{ versionform.entity_name }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="描述：">
                <div>{{ versionform.comments }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人：">
                <div>{{ versionform.create_user }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>

        <el-row class="b-flag">
          <el-row>
            <el-col :span="24" class="line">
              <span class="m-flag-text">对象信息</span>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="1">
              <el-form-item label="">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="主题域:">
                <span>{{ versionform.data_name }}</span>
              </el-form-item>
            </el-col>

          </el-row>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="versionFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="versionFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 版本对比 -->
    <el-dialog :visible.sync="comparisonFormVisible" title="版本对比" width="85%">
      <el-form :model="comparisonform">
        <el-row>
          <el-col :span="11">
            <el-row class="t-flag">
              <el-col :span="8">
                <el-form-item label="">
                  <!-- <el-select v-model="comparisonform.region" v-for="(item ,index) in versionList" :key="index" :label="item.versions"
                  :value="item.versions" placeholder="请选择版本">
                  </el-select> -->
                  <el-select v-model="versionCom.versions" placeholder="" @change="changeComVersion($event)">
                    <el-option v-for="(item, index) in versionList" :key="index" :label="item.versions"
                      :value="item.versions"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="修改人">
                  <div>{{ comparisonform.oper_user }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="创建时间">
                  <div>{{ comparisonform.create_time }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="m-flag">
              <el-row>
                <el-col :span="24" class="line">
                  <span class="m-flag-text">基本信息</span>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="类型:">
                    <span>{{ comparisonform.entity_type }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="板块名：">
                    <div>{{ comparisonform.busin_name }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="英文名称(编码)：">
                    <div>{{ comparisonform.entity_code }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="中文名称(名称)：">
                    <div>{{ comparisonform.entity_name }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="描述：">
                    <div>{{ comparisonform.comments }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="创建人：">
                    <div>{{ comparisonform.create_user }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>

            <el-row class="b-flag">
              <el-row>
                <el-col :span="24" class="line">
                  <span class="m-flag-text">对象信息</span>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="主题域:">
                    <span>{{ comparisonform.data_name }}</span>
                  </el-form-item>
                </el-col>

              </el-row>

            </el-row>

          </el-col>
          <el-col :span="1">
            <el-row class="l-flag">

            </el-row>
          </el-col>
          <el-col :span="11">
            <el-row class="t-flag">
              <el-col :span="8">
                <el-form-item label="">
                  <el-select v-model="versionCom1.versions" placeholder="" @change="changeComVersion1($event)">
                    <el-option v-for="(item, index) in versionList1" :key="index" :label="item.versions"
                      :value="item.versions"></el-option>
                  </el-select>
                  <!-- <el-select v-model="comparisonform.region" placeholder="请选择版本">
                    <el-option label="版本一" value="shanghai"></el-option>
                    <el-option label="版本二" value="beijing"></el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="修改人">
                  <div>{{ comparisonform1.oper_user }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="创建时间">
                  <div>{{ comparisonform.create_time }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="m-flag">
              <el-row>
                <el-col :span="24" class="line">
                  <span class="m-flag-text">基本信息</span>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="类型:">
                    <span>{{ comparisonform1.entity_type }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="板块名：">
                    <div>{{ comparisonform1.busin_name }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="英文名称(编码)：">
                    <div>{{ comparisonform1.entity_code }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="中文名称(名称)：">
                    <div>{{ comparisonform1.entity_name }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="描述：">
                    <div>{{ comparisonform1.comments }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="创建人：">
                    <div>{{ comparisonform1.create_user }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>

            <el-row class="b-flag">
              <el-row>
                <el-col :span="24" class="line">
                  <span class="m-flag-text">对象信息</span>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="1">
                  <el-form-item label="">
                    <span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="主题域:">
                    <span>{{ comparisonform1.data_name }}</span>
                  </el-form-item>
                </el-col>

              </el-row>

            </el-row>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="comparisonFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="comparisonFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>




    <!-- 查看版本 -->

    <el-dialog title="版本信息" :visible.sync="dialogTableVisible" width="70%">
      <el-table :data="gridData">
        <el-table-column property="versions" label="版本号" width="150"></el-table-column>
        <el-table-column property="oper_user" label="提交人" width="200"></el-table-column>
        <el-table-column property="oper_time" label="提交时间"></el-table-column>
        <el-table-column property="oper_type" label="类型"></el-table-column>
        <el-table-column property="status" label="状态"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">

            <img class="btn_img" src="@/assets/images/d-detail.png" type="text" title="版本详情"
              @click="checkVersionDetail(scope.row)" width="14px">

             <img class="btn_img" src="@/assets/images/d-version.png" type="text" title="版本对比"
              @click="comparisonVersion(scope.row)" width="14px">
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 相关逻辑表 -->
    <el-dialog :visible.sync="logicTableVisible" width="70%">
      <!-- <div class="logic-main"> -->

      <div slot="title">
        相关逻辑表
      </div>
      <div class="logic-tab" v-if="mode_type == 0">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="开发表" name="dev">
            <el-table :data="LogicData">
              <el-table-column prop="logic_code,logic_name" label="逻辑表名" width="200">
                <template slot-scope="scope">
                  <div style="display: flex;">
                    <img v-if="logicValue.entity_type == '普通对象'" style="margin-right: 8px"
                      src="@/assets/images/info_1.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '枚举对象'" style="margin-right: 8px"
                      src="@/assets/images/info_2.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '虚拟对象'" style="margin-right: 8px"
                      src="@/assets/images/info_3.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '层级对象'" style="margin-right: 8px"
                      src="@/assets/images/info_4.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务事件'" style="margin-right: 8px"
                      src="@/assets/images/info_5.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务快照'" style="margin-right: 8px"
                      src="@/assets/images/info_6.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务流程'" style="margin-right: 8px"
                      src="@/assets/images/info_7.png" width="36px" height="36px" />

                    <span>{{ scope.row.logic_code }}<br><span>{{ scope.row.logic_name }}</span></span>
                  </div>

                </template>
              </el-table-column>
              <el-table-column prop="oper_user" label="负责人" width="200"></el-table-column>
              <el-table-column prop="project_name" label="所属项目"></el-table-column>
              <el-table-column prop="status" label="状态">

                <template slot-scope="scope">
                  <span v-if="scope.row.status == '5'"> <i class="iconfont icon-kaifazhong"
                      style="color: #EABA19;vertical-align: bottom;font-size:18px"></i>草稿</span>
                  <span v-if="scope.row.status == '6'"> <i class="el-icon-success font-16"
                      style="color: #67C23A"></i>已发布</span>

                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
        
                    <img class="btn_img" src="@/assets/images/d-detail.png" type="text" title="版本详情"
                      @click="checkVersionDetail(scope.row)" width="14px">
        
                  </template>
                </el-table-column> -->
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="生产表" name="prod">
            <el-table :data="prodData">
              <el-table-column prop="logic_code,logic_name" label="逻辑表名" width="200">
                <template slot-scope="scope">
                  <div style="display: flex;">
                    <img v-if="logicValue.entity_type == '普通对象'" style="margin-right: 8px"
                      src="@/assets/images/info_1.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '枚举对象'" style="margin-right: 8px"
                      src="@/assets/images/info_2.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '虚拟对象'" style="margin-right: 8px"
                      src="@/assets/images/info_3.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '层级对象'" style="margin-right: 8px"
                      src="@/assets/images/info_4.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务事件'" style="margin-right: 8px"
                      src="@/assets/images/info_5.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务快照'" style="margin-right: 8px"
                      src="@/assets/images/info_6.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务流程'" style="margin-right: 8px"
                      src="@/assets/images/info_7.png" width="36px" height="36px" />

                    <span>{{ scope.row.logic_code }}<br><span>{{ scope.row.logic_name }}</span></span>
                  </div>

                </template>
              </el-table-column>
              <el-table-column prop="oper_user" label="负责人" width="200"></el-table-column>
              <el-table-column prop="project_name" label="所属项目"></el-table-column>
              <el-table-column prop="status" label="状态">

                <template slot-scope="scope">
                  <span v-if="scope.row.status == '5'"> <i class="iconfont icon-kaifazhong"
                      style="color: #EABA19;vertical-align: bottom;font-size:18px"></i>草稿</span>
                  <span v-if="scope.row.status == '6'"> <i class="el-icon-success font-16"
                      style="color: #67C23A"></i>已发布</span>
                  <!-- <span v-if="scope.row.status == '7'">开发中</span> -->
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
        
                    <img class="btn_img" src="@/assets/images/d-detail.png" type="text" title="版本详情"
                      @click="checkVersionDetail(scope.row)" width="14px">
        
                  </template>
                </el-table-column> -->
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="logic-tab" v-if="mode_type == 1">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="" name="dev">
            <el-table :data="basicData">
              <el-table-column prop="logic_code,logic_name" label="逻辑表名" width="200">
                <template slot-scope="scope">
                  <div style="display: flex;">
                    <img v-if="logicValue.entity_type == '普通对象'" style="margin-right: 8px"
                      src="@/assets/images/info_1.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '枚举对象'" style="margin-right: 8px"
                      src="@/assets/images/info_2.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '虚拟对象'" style="margin-right: 8px"
                      src="@/assets/images/info_3.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '层级对象'" style="margin-right: 8px"
                      src="@/assets/images/info_4.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务事件'" style="margin-right: 8px"
                      src="@/assets/images/info_5.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务快照'" style="margin-right: 8px"
                      src="@/assets/images/info_6.png" width="36px" height="36px" />
                    <img v-if="logicValue.entity_type == '业务流程'" style="margin-right: 8px"
                      src="@/assets/images/info_7.png" width="36px" height="36px" />

                    <span>{{ scope.row.logic_code }}<br><span>{{ scope.row.logic_name }}</span></span>
                  </div>

                </template>
              </el-table-column>
              <el-table-column prop="oper_user" label="负责人" width="200"></el-table-column>
              <el-table-column prop="project_name" label="所属项目"></el-table-column>
              <el-table-column prop="status" label="状态">

                <template slot-scope="scope">
                  <span v-if="scope.row.status == '5'"> <i class="iconfont icon-kaifazhong"
                      style="color: #EABA19;vertical-align: bottom;font-size:18px"></i>草稿</span>
                  <span v-if="scope.row.status == '6'"> <i class="el-icon-success font-16"
                      style="color: #67C23A"></i>已发布</span>

                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>

        </el-tabs>
      </div>
      <!-- </div> -->

      <div slot="footer" class="dialog-footer">
        <el-button @click="logicTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="logicTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>




    <el-dialog :visible.sync="treeDialogVisible" title="地址关系图" width="70%">
      <div>
        <div style="height: 400px; border:1px solid #eee">
          <!-- <div style="height:calc(100vh - 50px);"> -->

          <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
            :on-line-click="onLineClick" />
          <!-- </div>/ -->
          <!-- <zm-tree-org ref="tree" :data="treeComponentData" :disabled="disaled" :horizontal="horizontal"
          :collapsable="collapsable" :label-style="style" :node-draggable="false" :default-expand-level="1"
          :filterNodeMethod="filterNodeMethod" @on-contextmenu="onMenus" @on-expand="onExpand"
          @on-node-click="onNodeClick">

          <template slot-scope="{node}">
            <div class="node-block">
              <div>
                <img src="@/assets/images/guanxi.png" alt="" srcset="">
              </div>

              <div class="tree-org-node__text node-label">
                {{ node.label }} <br /> <span>{{ node.label }}</span>
              </div>

            </div>
          </template>

          <template v-slot:expand="{ node }">
            <div>{{ node.children.length }}</div>
          </template>
        </zm-tree-org> -->
        </div>
      </div>
    </el-dialog>

    <EntityRelDrawer v-if="entityRelDrawerVisible" :currentData="currentEntityRelData"
      @close="entityRelDrawerVisible = false"></EntityRelDrawer>
  </div>
</template>


<script>

import pager from '@/mixins/pager'
import G6 from '@antv/g6';
import OverflowTooltip from '@c/overflow-tooltip'
import { businessIconList } from '@/config/dics'
import { randomInRange } from '@/libs/util'
// import {types} from '@/config/rd-config'
import RelationGraph from 'relation-graph'
import EntityRelDrawer from './rel-graph/entity-rel-drawer.vue'

import {
  getQueryEntityList, //表格
  getQueryEntityRelDiagramt, //关系图
  entityPublish, //上线
  entityOffLine,//下线

  entityBatchPublish, //批量上线
  delBatchEntity, //批量删除

  entityBatchOffLine, //批量下线
  delEntity, //下线并删除
  queryEntityRel, //弹窗选择

  queryEntityTypeList, //实体类型下拉
  saveEntity,//新增
  editEntity,//编辑
  queryEntityById, //编辑回显
  queryUserList,  //负责人
  queryDataFieldTreeInfo, //主题域

  queryEntityVersionList, //版本信息
  queryEntityVersionDetail, //版本详情
  queryEntityVersionNum, //版本号
  queryProject, //项目关联
  queryRelLogicTable,  //相关逻辑表

  addBusiness,
  editBusiness,
  getBusinessInfo,
  // editPartition,
  getBizdateValueList,
  // editBizdate,
  getTableList,
  queryByDataId,
  delDataField,
  getBusiProject,
  getDataField
} from '@/api/plan/business-entity'

// 图片资源
import img1 from '@/assets/images/type1.png'
import img2 from '@/assets/images/type2.png'
import img3 from '@/assets/images/type3.png'
import img4 from '@/assets/images/type4.png'
import img5 from '@/assets/images/type5.png'
import img6 from '@/assets/images/type6.png'
import img7 from '@/assets/images/type7.png'
import img8 from '@/assets/images/type8.png'
import {mapMutations, mapGetters} from 'vuex'
export default {
  name: 'Business',
  mixins: [pager],
  props: {
    businId: {
      type: String,
      default: ''
    }
  },
  components: {
    OverflowTooltip,
    RelationGraph,
    EntityRelDrawer
  },
  data() {
    var checkMaxVal = (rule, value, callback) => {
      // console.log(value);
      if (this.dataFieldForm.flow_event_info && this.dataFieldForm.flow_event_info.length < 2) {
        callback(new Error('至少选择2个业务事件'));

      } else {
        callback();
      }
    };
    return {
      hasData: true,
      activeName: 'dev',
      logicTableVisible: false,
      versionCom: {},
      versionCom1: {},
      comparisonform1: {},
      versionList: [],
      versionList1: [],
      versionObj: {},// 版本信息
      getList1_options: [],
      getList2_options: [],
      getList3_options: [],
      getList4_options: [],
      queryUserList_Info: [], //负责人
      queryEntityTypeList_options: [],//实体类型
      queryEntityVersionNum_options: [],  //版本号
      batchId: [], // entry_id
      imgType: [
        { type: '1', entity_type: '普通对象', val: img1 },
        { type: '2', entity_type: '枚举对象', val: img2 },
        { type: '3', entity_type: '虚拟对象', val: img3 },
        { type: '4', entity_type: '层级对象', val: img4 },
        { type: '5', entity_type: '业务事件', val: img5 },
        { type: '6', entity_type: '业务快照', val: img6 },
        { type: '7', entity_type: '业务流程', val: img7 },
        { type: '8', entity_type: '', val: img8 },
      ],
      // 关系图options
      graphOptions: {
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        allowShowMiniToolBar: false,
        // defaultExpandHolderPosition:'bottom',
        defaultJunctionPoint: 'border',
        layouts: [
          {
            layoutName: 'tree',
            layoutDirection: 'v',
            from: 'top',
            centerOffset_x: 0,
            centerOffset_y: 0
          }
        ]
      },
      prodData: [],
      // 关系图数据格式
      __graph_json_data: {
        rootId: 'a',
        nodes: [
          { id: 'a', text: 'A', nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style' },
          { id: 'b', text: 'B', nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style' },
          { id: 'c', text: 'C', nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style' },
          { id: 'e', text: 'E', nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style' }
        ],
        lines: [
          { from: 'a', to: 'b', text: '', color: '#43a2f1' },
          { from: 'a', to: 'c', text: '' },
          { from: 'a', to: 'e', text: '' },
          // { from: 'b', to: 'e', color: '#67C23A' }
        ]
      },
      dialogTableVisible: false,
      gridData: [{
        date: '2016-05-02',
        name: 'ceshi',
        address: 'ceshi'
      }, {
        date: '2016-05-04',
        name: 'ceshi',
        address: 'ceshi'
      }, {
        date: '2016-05-01',
        name: 'ceshi',
        address: 'ceshi'
      }, {
        date: '2016-05-03',
        name: 'ceshi',
        address: 'ceshi'
      }],
      tagTreeData: [],
      treeData: {},
      toolBar: {
        scale: false
      },
      keyword: '',
      mode_type: '',
      horizontal: false,
      collapsable: false,
      onlyOneNode: false,
      cloneNodeDrag: false,
      expandAll: false,
      disaled: false,
      style: {
        background: '#fff',
        color: '#5e6d82'
      },

      // 上线
      centerDialogVisible: false,
      dialogFormVisible: false, // 关联表
      versionFormVisible: false, //版本详情
      comparisonFormVisible: false,//版本对比
      sinHasSelect: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      editValue: {},
      addValue: {},
      logicValue: {
        entity_type: ''
      },
      versionform: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      comparisonform: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      activeBusinessId: null, // 当前选中的业务板块的ID
      // handleBusinessId: null, // 当前要编辑或者删除的业务板块的ID
      // businessList: [],
      is_disabled: true, // 业务板块英文名编辑禁止修改
      businessParams: {},
      tableList: [

      ],
      treeDialogVisible: false,
      treeComponentData: {},
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'business',
      // businessForm: this.resetBusinessForm(),

      iconList: businessIconList,
      // [
      //   {class: 'el-icon-s-home', background: '#6CA0F4'},
      //   {class: 'el-icon-delete', background: '#6CA0F4'}
      // ],
      partitionForm: this.resetPartitionForm(),

      bizdateValueList: [
        // {key: 'yyyyMMdd', value: 'yyyyMMdd'}
      ],
      bizdateForm: this.resetBizdateForm(),
      bizdateFormRules: {
        biz_data_value: [
          {
            required: true,
            message: '请选择参数值',
            trigger: ['blur', 'change']
          }
        ]
      },
      dataFieldForm: this.resetDataFieldForm(),
      dataFieldFormRules: {
        entity_name: [
          { required: true, message: '请输入数据域名称' },
          {
            pattern: /^[\u4e00-\u9fa5\w-]{1,64}$/,
            message:
              '数据域名称至多64个字符，允许中文、数字、字母、下划线或连字符',
            trigger: ['blur', 'change']
          }
        ],
        // data_id: [{ required: true, message: '请选择主题域' }],
        entity_code: [
          { required: true, message: '请输入编码' },
          {
            pattern: /^\w{1,64}$/,
            message: '编码名称至多64个字符，允许数字、字母、下划线',
            trigger: ['blur', 'change']
          }
        ],
        responsible_user: [
          { required: true, message: '请选择负责人' },

        ],
        data_id: [
          { required: true, message: '请选择主题域' },

        ],
        entity_type: [
          { required: true, message: '请选择实体类型' },

        ],
        flow_event_info: [
          { required: true, message: '请选择' },
          { validator: checkMaxVal, trigger: 'change' }


        ],
      },
      busiProject: [],
      dataFieldList: [],
      pageType: false,
      allChecked: false,
      delInBatchesStatus: true,
      // isIndeterminate: true,
      checkedList: [],
      emptyData: false,
      region: [],
      projectData: {},
      LogicData: [],
      basicData: [],
      entityRelDrawerVisible: false,
      currentEntityRelData: {},
    }
  },
  watch: {
    keyword(newVal, oldVal) {
      this.getTableList()

    },
  
  },
  created() {
    this.pageType = 'form'
    this.getTableList()


    // this.getValues()
  },
  computed: {
    ...mapGetters(['project'])
  },
  methods: {
    ...mapMutations({
      setProject: 'SET_PROJECT'
    }),
    handleClick(tab, event) {
      console.log(tab, event);
    },
    searchChange(val) {
      this.getTableList()
    },
    // 相关逻辑表
    async checkLogic(row) {

      this.logicTableVisible = true
      const params = {
        entity_id: row.entity_id,
      }
      const res = await this.$simpleAsyncTo(
        queryRelLogicTable(params),
        '获取版本信息失败'
      )
      this.mode_type = res.data.mode_type
      console.log(row, 'sdfsdfsd');
      this.LogicData = res.data.dev
      this.prodData = res.data.prod
      this.basicData = res.data.basic
      this.logicValue = JSON.parse(JSON.stringify(row))
    },


    // 查看版本
    async checkVersion(row) {

      this.dialogTableVisible = true
      console.log(row);
      const params = {
        entity_id: row.entity_id,
      }
      const res = await this.$simpleAsyncTo(
        queryEntityVersionList(params),
        '获取版本信息失败'
      )
      // console.log(res);
      this.gridData = res.data
    },

    // 查看版本详情
    async checkVersionDetail(row) {
      this.versionObj = JSON.parse(JSON.stringify(row))

      this.versionFormVisible = true
      this.checkVersionNum(row, 1)
      this.getVersionDetail(row, 1)
    },
    // 获取详情数据
    async getVersionDetail(row, type) {
      const params = {
        entity_id: row.entity_id,
        version_num: row.version_num
      }
      const res = await this.$simpleAsyncTo(
        queryEntityVersionDetail(params),
        '获取版本详情失败'
      )
      if (type == 1) {
        this.versionform = res.data
        // this.queryEntityVersionNum()
      } else if (type == 2) {
        this.comparisonform = res.data
        // this.queryEntityVersionNum()
      } else {
        this.comparisonform1 = res.data
        // this.queryEntityVersionNum()
      }

      //
    },
    // 查看版本号
    async checkVersionNum(row, type) {
      const params = {
        entity_id: row.entity_id,
        version_num: row.version_num
      }
      const res = await this.$simpleAsyncTo(
        queryEntityVersionNum(params),
        '获取版本号失败'
      )
      this.versionList = res.data
      this.versionList1 = res.data
      if (type == 2) {
        this.versionCom1 = JSON.parse(JSON.stringify(this.versionList[0]))
        console.log(this.versionList[1], '3333');
        this.getVersionDetail(this.versionCom1, 3)
      }
    },

    // 关联表
    async queryProject(row) {
      this.projectData = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
      console.log(row);
      const params = {
        busin_id: this.businId,
      }
      const res = await this.$simpleAsyncTo(
        queryProject(params),
        '获取关联表失败'
      )
      // console.log(res);
      this.region = res.data
    },
    // 关联表确认选择
    jumpPage() {

      this.dialogFormVisible = false
      console.log(this.form);
      let value = this.region.find(item => item.project_id == this.form.region)
      value.type = 'add'
      console.log(value);
      this.setProject(value.project_id)
      if (this.projectData.biz_type == '业务对象') {
        this.$router.push({
          path: '/rd/dev/norm-define/dimension',
          name: 'dimension',
          params: value
        })
        this.dialogFormVisible = false
      } else {
        this.$router.push({
          path: '/rd/dev/modeling/fact-table',
          name: 'factTable',
          params: value
        })

      }
      this.dialogFormVisible = false
      console.log(this.projectData.biz_type);
    },



    //切换版本详情
    changeVersion(val) {
      let data = JSON.parse(JSON.stringify(this.versionList.find(item => item.versions == val)))
      this.checkVersionDetail(data)
    },
    // 版本对比
    comparisonVersion(row) {
      this.comparisonFormVisible = true
      this.versionCom = JSON.parse(JSON.stringify(row))

      // JSON.parse(JSON.stringify(row))

      this.checkVersionNum(row, 2)
      this.getVersionDetail(row, 2)

    },
    //切换版本详情
    changeComVersion(val) {
      let data = JSON.parse(JSON.stringify(this.versionList.find(item => item.versions == val)))
      this.getVersionDetail(data, 2)
    },
    //切换版本详情
    changeComVersion1(val) {
      let data = JSON.parse(JSON.stringify(this.versionList.find(item => item.versions == val)))
      this.getVersionDetail(data, 3)
    },

    // 显示关系图
    showSeeksGraph() {

      this.$refs.seeksRelationGraph.setJsonData(this.__graph_json_data, (graphInstance) => {
        // 这些写上当图谱初始化完成后需要执行的代码
      });

    },
    // 关系图点击事件
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject)
    },
    // 关系图点击 线条事件
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },

    // 获取关系图数据
    async getQueryDiagramt(data) {
      const params = {
        data_id: data.data_id,
        entiy_id: data.entity_id,
      }

      const res = await this.$simpleAsyncTo(
        getQueryEntityRelDiagramt(params),
        '获取关系图失败'
      )
      if (res) {
        let arr = [], lines = [];

        //生成关系图所需数据结构
        console.log(res.data);
        res.data && res.data.forEach(item => {
          let imgVal = this.imgType.find(it => it.type == item.type)
          // 生成节点Html
          let html = `
            <div class="node-blocks">
                  <div>
                    <img src="${imgVal.val}" alt="" srcset="">
                  </div>

                  <div class="tree-org-node__text node-label">
                    ${(item.parent_name == undefined ? item.child_name : item.parent_name)}
                  </div>

                </div>
              `
          // 获取父级数据
          if (item.parent_id != undefined) {
            let obj = { id: item.child_id == undefined ? item.parent_id : item.child_id, html: html, nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style', }
            arr.push(obj)
          }
          // 获取子级数据
          if (item.child_id != undefined) {
            let obj = { id: item.child_id == undefined ? item.parent_id : item.child_id, html: html, nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style', }
            arr.push(obj)
          }

          // 获取父级 - 当前节点
          if (item.parent_id != undefined && item.rel_data_id == params.data_id) {
            let obj = { from: item.parent_id, to: params.data_id, text: '', color: '#43a2f1' };
            lines.push(obj)
          }
          // 获取当前节点 - 子级
          if (item.child_id != undefined && item.rel_data_id == params.data_id) {
            let obj = { from: params.data_id, to: item.child_id, text: '', color: '#43a2f1' };
            lines.push(obj)
          }

        })
        let tempImg = this.imgType.find(item => item.entity_type == data.entity_type)
        let html2 = `
            <div class="node-blocks">
                  <div>
                    <img src="${tempImg.val}" alt="" srcset="">
                  </div>

                  <div class="tree-org-node__text node-label">
                    ${data.entity_name}
                  </div>

                </div>
              `
        let obj2 = { id: params.data_id, html: html2, nodeShape: 1, borderWidth: -1, fontColor: '#000', styleClass: 'my-node-style' }
        this.__graph_json_data = {
          rootId: params.data_id,
          nodes: [obj2, ...arr],
          lines: lines
        }
        console.log('this.__graph_json_data', this.__graph_json_data);
        this.treeDialogVisible = true
        this.$nextTick(() => {
          this.showSeeksGraph()
        })
      }
    },

    // 查看数据
    chooseTree(index, data) {
      console.log(index, data);
      // this.getQueryDiagramt(data)
      this.entityRelDrawerVisible = true
      this.currentEntityRelData = {
        nodeBaseData: {
          nodeName: data.entity_name,
          id: data.entity_id,
        },
        id: data.entity_id,
      }
    },
    //选中数据
    chhoseItem(val) {
      this.treeDialogVisible = true
      console.log(val);
      this.treeComponentData = val

    },
    setTreeData(parr, arr) {
      arr.forEach((child) => {
        parr.push(child)
        if (child.children && child.children.length > 0) {
          this.setTreeData(parr, child.children)
        }

      });
      console.log(parr)
      return parr
    },

    onMenus({ node, command }) {
      console.log(node, command)
    },
    filter() {
      this.$refs.tree.filter(this.keyword)
    },
    filterNodeMethod(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onExpand(e, data) {
      console.log(e, data)
    },
    onNodeClick(e, data) {
      if (!this.treeDialogVisible) {
        this.treeDialogVisible = true
        this.treeComponentData = data
      }
    },

    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.$set(item, 'expand', val)
          if (item.children) {
            this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          this.toggleExpand(data.children, val)
        }
      }
    },



    generaMenu(routes, data) {
      console.log(data, 'data')
      data.forEach(item => {
        const menu = {
          id: item.data_id,
          pid: item.parent_id,
          children: [],
          label: item.data_name
        }
        if (item.child) {
          this.generaMenu(menu.children, item.child)
        }
        routes.push(menu)
      })
      return data
    },
    handleNodeClick(data, node, e) {
      console.log('ddddddddd');
      this.$set(this.dataFieldForm, 'data_name', data.name)
      this.dataFieldForm.data_id = data.id
      this.dataFieldForm.data_code = data.code
      this.$refs.treeSelect.value = data.data_name
      this.$refs.treeSelect.blur()
    },

    handleChange(val) {
      console.log(val)
    },
    handleChange2(val) {
      console.log(val)
      this.dataFieldForm.extend_entity_id = ''
      this.dataFieldForm.rel_entity_info = []
      this.dataFieldForm.pre_biz_flow_info = []
      this.dataFieldForm.flow_event_info = []
    },
    getrandomInRange() {
      return randomInRange(0, 3)
    },


    // 获取数据域列表
    async getTableList() {
      const params = {

        busin_id: this.businId,
        keyword: this.keyword,
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize
      }
      const res = await this.$simpleAsyncTo(
        getQueryEntityList(params),
        '获取数据域列表失败'
      )
      if (res) {
        this.getList1()
        this.getList2()
        this.getList3()
        this.getList4()
        this.queryEntityTypeList()
        this.queryUserList()
        this.getDataNameList()

        // this.queryProject()
        // this.queryRelLogicTable()
        if (res) {
          this.hasData = res.data.if_has_data
          // this.emptyData = false
          this.tableList = res.data.entity_data
          this.total = res.data.total_records

        } else {
          // this.emptyData = true
        }

      }
    },
    // 选择业务板块图标
    // handleSelectIcon(icon, key) {
    //   this.businessForm.icon_code = key
    // },
    // 业务板块表单初始化
    resetBusinessForm() {
      return {
        busin_name: '',
        busin_code: '',
        comments: '',
        icon_code: ''
      }
    },

    // 打开新增业务板块弹框
    // handleAddBusiness() {
    //   this.dialogType = 'business'
    //   this.dialogTitle = '新建业务板块'
    //   this.dialogVisible = true
    //   this.is_disabled = false
    // },
    // 打开编辑业务板块弹框
    // handleEditBusiness(item) {
    //   this.dialogType = 'business'
    //   this.dialogTitle = '编辑业务板块'
    //   this.dialogVisible = true
    //   this.is_disabled = true
    //   this.businessForm.busin_name = item.busin_name
    //   this.businessForm.busin_code = item.busin_code
    //   this.businessForm.comments = item.comments
    //   this.businessForm.icon_code = item.icon_code
    //   this.handleBusinessId = item.busin_id
    // },
    // 新增&编辑业务板块
    // async handleBusiness() {
    //   this.globalLoading()
    //   if (this.dialogTitle === '新建业务板块') {
    //     const res = await this.$simpleAsyncTo(
    //       addBusiness(this.businessForm),
    //       '新建业务板块失败'
    //     )
    //     if (res) {
    //       this.$message({
    //         type: 'success',
    //         message: '新建业务板块成功!'
    //       })
    //     }
    //   } else if (this.dialogTitle === '编辑业务板块') {
    //     const params = { busin_id: this.handleBusinessId, ...this.businessForm }
    //     const res = await this.$simpleAsyncTo(
    //       editBusiness(params),
    //       '编辑业务板块失败'
    //     )
    //     if (res) {
    //       this.$message({
    //         type: 'success',
    //         message: '编辑业务板块成功!'
    //       })
    //     }
    //   }
    //   this.$refs.businessForm.resetFields()
    //   this.dialogVisible = false
    //   this.businessForm = this.resetBusinessForm()
    //   this.getQueryEntityList()
    //   this.globalLoading().close()
    // },
    // 时间分区表单初始化
    resetPartitionForm() {
      return {
        partition_name: '',
        partition_code: '',
        data_type: '',
        partition_default: '',
        partition_desc: ''
      }
    },

    // async editPartition() {
    //   this.globalLoading()
    //   const params = { busin_id: this.activeBusinessId, ...this.partitionForm }
    //   const res = await this.$simpleAsyncTo(
    //     editPartition(params),
    //     '编辑时间分区失败'
    //   )
    //   if (res) {
    //     this.$message({
    //       type: 'success',
    //       message: '编辑时间分区成功!'
    //     })
    //     // this.getBusinessInfo()
    //   }
    //   this.globalLoading().close()
    // },
    // 获取时间分区参数值列表
    async getBizdateValueList() {
      const res = await this.$simpleAsyncTo(
        getBizdateValueList(),
        '获取参数值列表失败'
      )
      if (res) {
        this.bizdateValueList = res.data
      }
    },
    resetBizdateForm() {
      return {
        biz_date_key: '',
        biz_data_value: ''
      }
    },

    // 初始化数据域表单
    resetDataFieldForm() {
      return {
        data_name: '',
        entity_code: '',
        comments: '',
        extend_entity_id: '',
        rel_entity_info: [],
        pre_biz_flow_info: [],
        flow_event_info: [],
        data_id: ''
      }
    },
    // 新建业务实体
    handleAddData() {
      this.getList1()
      this.getList2()
      this.getList3()
      this.getList4()
      this.getDataNameList()

      this.dialogType = 'dataField'
      this.dialogTitle = '新建'
      this.dialogVisible = true
      this.dataFieldForm.data_id = undefined
      // this.dataFieldForm.data_id = undefined
      this.is_disabled = false
    },
    // 编辑业务实体
    async handleEditData(row) {
      this.editValue = JSON.parse(JSON.stringify(row))
      this.getList1()
      this.getList2()
      this.getList3()
      this.getList4()
      this.getDataNameList()
      const res = await this.$simpleAsyncTo(
        queryEntityById({ 'entity_id': row.entity_id }),

      )
      if (res) {

        this.dataFieldForm = res.data.entity_info
        //主题域回显
        this.dataFieldForm.name = this.dataFieldForm.data_name

        if (this.dataFieldForm.entity_type != null) {
          this.dataFieldForm.entity_type = parseInt(this.dataFieldForm.entity_type) > 4 ? ['huodong', this.dataFieldForm.entity_type] : ['duixiang', this.dataFieldForm.entity_type]
        }
        let extend_info = res.data.extend_info

        let rel_entity_info = res.data.rel_entity_info
        //测试
        // rel_entity_info = [{ "rel_entity_name": "学校", "rel_data_id": "82fc295f759b41ae9926ab39c1da6ef1", "rel_entity_id": "2b107ba92fec4b2399a5fac3d36a94f4" }, { "rel_entity_name": "个人用户", "rel_data_id": "82fc295f759b41ae9926ab39c1da6ef1", "rel_entity_id": "22d96bca0a4f4c7f9797f38aa5b7e0ba" }]
        // rel_entity_info = []
        let pre_biz_flow_info = res.data.pre_biz_flow_info
        let flow_event_info = res.data.flow_event_info

        if (extend_info.rel_entity_id != null) {
          this.dataFieldForm.extend_entity_id = extend_info.rel_entity_id
        }


        this.dataFieldForm.rel_entity_info = []
        for (let i = 0; i < rel_entity_info.length; i++) {
          this.dataFieldForm.rel_entity_info.push(rel_entity_info[i].rel_entity_id)
        }

        this.dataFieldForm.pre_biz_flow_info = []
        for (let i = 0; i < pre_biz_flow_info.length; i++) {
          this.dataFieldForm.pre_biz_flow_info.push(pre_biz_flow_info[i].rel_entity_id)
        }

        this.dataFieldForm.flow_event_info = []
        for (let i = 0; i < flow_event_info.length; i++) {
          this.dataFieldForm.flow_event_info.push(flow_event_info[i].rel_entity_id)
        }
        console.log(this.dataFieldForm)
        this.dialogType = 'dataField'
        this.dialogTitle = '编辑'
        this.dialogVisible = true
        this.is_disabled = true
      }

      // const res = await this.$simpleAsyncTo(
      //   queryByDataId({ data_id: row.data_id }),
      //   '获取数据域详情信息失败'
      // )
      // if (res) {
      //   this.dataFieldForm = res.data
      // }
      // this.dataFieldForm.data_name = row.data_name
      // this.dataFieldForm.entity_code = row.entity_code
      // this.dataFieldForm.nameEnAbb = row.nameEnAbb
      // this.dataFieldForm.comments = row.comments
      // this.dataFieldForm.data_id = row.data_id
    },
    //改变
    changeField(val) {
      console.log(val);
      console.log(this.dataFieldForm.flow_event_info);
    },
    // 新增&编辑业务实体
    async handleDataField() {
      this.globalLoading()
      this.getList1()
      this.getList2()
      this.getList3()
      this.getList4()
      // if (this.dialogTitle == '新增'){
      this.addValue = JSON.parse(JSON.stringify(this.dataFieldForm))
      // }
      if (this.dataFieldForm.entity_type != null && this.dataFieldForm.entity_type != []) {
        if (this.dataFieldForm.entity_type[0] == "duixiang") {
          this.dataFieldForm.biz_type = "业务对象"
        } else {
          this.dataFieldForm.biz_type = "业务活动"
        }

      }
      if (this.dataFieldForm.entity_type != null && this.dataFieldForm.entity_type != []) {
        this.dataFieldForm.entity_type = this.dataFieldForm.entity_type[1]
      }


      //继承自实体
      if (this.dataFieldForm.extend_entity_id != null || this.dataFieldForm.extend_entity_id != '') {
        for (let i = 0; i < this.getList1_options.length; i++) {
          if (this.getList1_options[i].entity_id == this.dataFieldForm.extend_entity_id) {
            this.dataFieldForm.extend_entity_name = this.getList1_options[i].entity_name
            this.dataFieldForm.extend_data_id = this.getList1_options[i].data_id
            break
          }
        }
      }


      //关联实体
      if (this.dataFieldForm.rel_entity_info != null || this.dataFieldForm.rel_entity_info != []) {
        for (let i1 = 0; i1 < this.dataFieldForm.rel_entity_info.length; i1++) {
          for (let i = 0; i < this.getList2_options.length; i++) {
            if (this.getList2_options[i].entity_id == this.dataFieldForm.rel_entity_info[i1]) {
              this.dataFieldForm.rel_entity_info[i1] = {}
              this.dataFieldForm.rel_entity_info[i1].rel_entity_name = this.getList2_options[i].entity_name
              this.dataFieldForm.rel_entity_info[i1].rel_data_id = this.getList2_options[i].data_id
              this.dataFieldForm.rel_entity_info[i1].rel_entity_id = this.getList2_options[i].entity_id

            }
          }
        }

      }
      this.dataFieldForm.rel_entity_info = JSON.stringify(this.dataFieldForm.rel_entity_info);
      //前序业务流程
      if (this.dataFieldForm.pre_biz_flow_info != null || this.dataFieldForm.pre_biz_flow_info != []) {
        for (let i1 = 0; i1 < this.dataFieldForm.pre_biz_flow_info.length; i1++) {
          for (let i = 0; i < this.getList3_options.length; i++) {
            if (this.getList3_options[i].entity_id == this.dataFieldForm.pre_biz_flow_info[i1]) {
              this.dataFieldForm.pre_biz_flow_info[i1] = {}
              this.dataFieldForm.pre_biz_flow_info[i1].rel_entity_name = this.getList3_options[i].entity_name
              this.dataFieldForm.pre_biz_flow_info[i1].rel_data_id = this.getList3_options[i].data_id
              this.dataFieldForm.pre_biz_flow_info[i1].rel_entity_id = this.getList3_options[i].entity_id

            }
          }
        }

      }
      this.dataFieldForm.pre_biz_flow_info = JSON.stringify(this.dataFieldForm.pre_biz_flow_info);
      //流程事件
      if (this.dataFieldForm.flow_event_info != null || this.dataFieldForm.flow_event_info != []) {
        for (let i1 = 0; i1 < this.dataFieldForm.flow_event_info.length; i1++) {
          for (let i = 0; i < this.getList4_options.length; i++) {
            if (this.getList4_options[i].entity_id == this.dataFieldForm.flow_event_info[i1]) {
              this.dataFieldForm.flow_event_info[i1] = {}
              this.dataFieldForm.flow_event_info[i1].rel_entity_name = this.getList4_options[i].entity_name
              this.dataFieldForm.flow_event_info[i1].rel_data_id = this.getList4_options[i].data_id
              this.dataFieldForm.flow_event_info[i1].rel_entity_id = this.getList4_options[i].entity_id
              this.dataFieldForm.flow_event_info[i1].rel_order = i1 + 1
              // this.getList4_options[i].entity_code
              // flow_event_info
              // let index = this.getList4_options.findIndex((item)=>item.entity_id ==this.dataFieldForm.flow_event_info[i1])


            }
          }
        }

      }
      this.dataFieldForm.flow_event_info = JSON.stringify(this.dataFieldForm.flow_event_info);
      if (this.dialogTitle === '新建') {
        const params = { busin_id: this.businId, ...this.dataFieldForm }

        const res = await this.$simpleAsyncTo(
          saveEntity(params),
          '新建失败'
        )
        console.log(res, 'dsfsdf1121')
        if (res && res.flag) {


          this.resetDataFieldForm()
          this.getTableList()
          this.handleSucces(res.msg)
        } else {
          this.handlefail()
        }
      } else if (this.dialogTitle === '编辑') {

        const params = { busin_id: this.businId, ...this.dataFieldForm }
        console.log(params)
        const res = await this.$simpleAsyncTo(
          editEntity(params),
          '编辑失败'
        )
        console.log(res, 'dsfsdf222')
        if (res && res.flag) {
       
          this.handleSucces(res.msg)
        } else {
          this.handlefail()
        }
      }

      this.globalLoading().close()
    },
    //成功操作
    handleSucces(msg) {
      let t = this
      this.$message({
        type: 'success',
        message: msg == ''?'操作成功':msg
      })
      this.$refs.dataFieldForm.resetFields()
      this.dialogVisible = false
      this.dataFieldForm = this.resetDataFieldForm()
      this.getTableList()
    },
    //失败操作
    handlefail() {

      this.globalLoading().close()
      if (this.dialogTitle == '编辑') {
        this.handleEditData(this.editValue)
      } else {
        this.dataFieldForm = this.addValue
        //   this.dataFieldForm.flow_event_info = JSON.parse(this.dataFieldForm.flow_event_info);
        // this.dataFieldForm.rel_entity_info = JSON.parse(this.dataFieldForm.rel_entity_info);
        // this.dataFieldForm.pre_biz_flow_info = JSON.parse(this.dataFieldForm.pre_biz_flow_info);
        // this.handleAddData()
      }
      // this.$message({
      //   type: 'error',
      //   message: '操作失败'
      // })
    },
    async handleDeleteData(row) {
      const res = await this.$simpleAsyncTo(
        delEntity({ entity_id: row.entity_id }),
        '删除失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTableList()
      }
    },
    // 获取id
    getChildren(children) {
      children.map((item) => {
        this.batchId.push(item.entity_id)
        if (item.children && item.children.length > 0) {
          this.getChildren(item.children)
        }
      })
    },
    // 批量上线
    BatchPublish() {
      console.log(this.checkedList);
      this.batchId = []
      if (this.allChecked) {
        this.checkedList.forEach(item => {
          this.batchId.push(item.entity_id)
          if (item.children && item.children.length > 0) {
            this.getChildren(item.children)

          }
        })
      } else {
        this.checkedList.forEach(item => {
          this.batchId.push(item.entity_id)
          if (this.sinHasSelect && item.children && item.children.length > 0) {
            this.getChildren(item.children)
          }
        })
      }
      console.log(222);
      this.$confirm('你确定要批量上线吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(
          entityBatchPublish({ entity_id: this.batchId.join(',') }),
          '上线失败'
        )
        this.getTableList()
        if (res) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getTableList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    // 批量下线
    entityBatchOffLine() {
      console.log(this.checkedList);
      this.batchId = []
      if (this.allChecked) {
        this.checkedList.forEach(item => {
          this.batchId.push(item.entity_id)
          if (item.children && item.children.length > 0) {
            this.getChildren(item.children)
          }
        })
      } else {
        this.checkedList.forEach(item => {

          this.batchId.push(item.entity_id)
          if (this.sinHasSelect && item.children && item.children.length > 0) {
            this.getChildren(item.children)
          }
        })
      }
      console.log(222);
      this.$confirm('你确定要批量下线吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(
          entityBatchOffLine({ entity_id: this.batchId.join(',') }),
          '批量下线失败'
        )
        this.getTableList()
        if (res) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getTableList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    // 上线
    async entityPublish(row) {
      const res = await this.$simpleAsyncTo(
        entityPublish({ entity_id: row.entity_id }),
        '上线失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '上线成功!'
        })
        this.getTableList()
      }
    },

    // 下线
    async entityOffLine(row) {
      const res = await this.$simpleAsyncTo(
        entityOffLine({ entity_id: row.entity_id }),
        '下线失败'
      )
      if (res) {
        this.$message({
          type: 'success',
          message: '下线成功!'
        })
        this.getTableList()
      }
    },
    // 版本号
    async queryEntityVersionNum() {
      const res = await this.$simpleAsyncTo(
        queryEntityVersionNum(),
        '获取失败'
      )
      if (res) {
        this.queryEntityVersionNum_options = res.data
      }
    },
    // 继承自实体
    async getList1() {
      const params = {

        busin_id: this.businId,
        type: 1,
      }
      const res = await this.$simpleAsyncTo(
        queryEntityRel(params),
        '获取失败'
      )
      if (res) {
        this.getList1_options = res.data
      }
    },
    // 关联实体
    async getList2() {
      const params = {

        busin_id: this.businId,
        type: 2,
      }
      const res = await this.$simpleAsyncTo(
        queryEntityRel(params),
        '获取失败'
      )
      if (res) {
        this.getList2_options = res.data
      }
    },

    // 前序业务流程
    async getList3() {
      const params = {

        busin_id: this.businId,
        type: 3,
      }
      const res = await this.$simpleAsyncTo(
        queryEntityRel(params),
        '获取失败'
      )
      if (res) {
        this.getList3_options = res.data
      }
    },
    // 流程事件
    async getList4() {
      const params = {

        busin_id: this.businId,
        type: 4,
      }
      const res = await this.$simpleAsyncTo(
        queryEntityRel(params),
        '获取失败'
      )
      if (res) {
        this.getList4_options = res.data
      }
    },
    //实体类型7
    async queryEntityTypeList() {
      this.queryEntityTypeList_options = []
      const res = await this.$simpleAsyncTo(
        queryEntityTypeList(),
        '获取失败'
      )
      if (res) {
        let duixiang = []
        let huodong = []
        for (let i = 0; i < res.data.biz_activity.length; i++) {
          duixiang.push({ 'label': res.data.biz_activity[i].param_name, 'value': res.data.biz_activity[i].param_value })
        }
        for (let i = 0; i < res.data.biz_object.length; i++) {
          huodong.push({ 'label': res.data.biz_object[i].param_name, 'value': res.data.biz_object[i].param_value })
        }
        this.queryEntityTypeList_options = []
        this.queryEntityTypeList_options.push({
          value: 'duixiang',
          label: '业务对象',
          children: huodong
        },
          {
            value: 'huodong',
            label: '业务活动',
            children: duixiang
          }
        )

      }
    },

    //负责人
    async queryUserList() {
      const res = await this.$simpleAsyncTo(
        queryUserList(),
        '获取失败'
      )
      if (res) {
        this.queryUserList_Info = res.data
      }
    },
    //主题域
    async getDataNameList() {
      const res = await this.$simpleAsyncTo(
        queryDataFieldTreeInfo({ busin_id: this.businId }),
        '获取主题域名称列表'
      )
      if (res) {
        console.log('res.data');
        console.log(res.data);

        this.dataFieldList = res.data.children // res.data.child
      }
    },

    // 提交表单
    handleSubmit() {
      if (this.dialogType === 'business') {
        this.$refs.businessForm.validate(valid => {
          if (valid) {
            this.handleBusiness()
            // this.$refs.businessForm.resetFields()
            // this.dialogVisible = false
            // this.businessForm = this.resetBusinessForm()
          }
        })
      } else if (this.dialogType === 'dataField') {
        this.$refs.dataFieldForm.validate(valid => {
          if (valid) {
            this.handleDataField()
            // this.$refs.dataFieldForm.resetFields()
            // this.dialogVisible = false
            // this.dataFieldForm = this.resetDataFieldForm()
          }
        })
      }
    },
    // 关闭弹框
    handleCancel() {
      if (this.dialogType === 'business') {
        this.$refs.businessForm.resetFields()
        this.businessForm = this.resetBusinessForm()
      }  else if (this.dialogType === 'dataField') {
        this.$refs.dataFieldForm.resetFields()
        this.dataFieldForm = this.resetDataFieldForm()
      }
      this.dialogVisible = false
    },
    // // 新建项目
    // handleAddProject() {
    //   this.$router.push({
    //     path: '/plan/project-manage'
    //   })
    // },
    // 相关项目
    async getBusiProject() {
      const res = await this.$simpleAsyncTo(
        getBusiProject({ busin_id: this.activeBusinessId }),
        '获取相关对象失败'
      )
      if (res) {
        this.busiProject = res.data
      }
    },

    handleAllChecked(val) {

      this.checkedList = val ? this.tableList : []

      if (this.checkedList.length > 0) {
        this.selectAll(this.checkedList)
      } else {
        this.$refs.tableList.clearSelection()
      }

      // this.isIndeterminate = false
    },
    // 批量删除
    delInBatches() {
      this.batchId = []
      if (this.allChecked) {
        this.checkedList.forEach(item => {
          this.batchId.push(item.entity_id)
          if (item.children && item.children.length > 0) {
            this.getChildren(item.children)
          }
        })
      } else {

        this.checkedList.forEach(item => {
          this.batchId.push(item.entity_id)
          if (this.sinHasSelect && item.children && item.children.length > 0) {
            this.getChildren(item.children)
          }
        })
      }

      this.$confirm('你确定要批量删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(
          delBatchEntity({ entity_id: this.batchId.join(',') }),
          '删除失败'
        )
        this.getTableList()
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTableList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },

    selectAll(selection) {

      const isSlect = selection.some((el) => {
        const tableDataIds = this.tableList.map((j) => j.entity_id)
        return tableDataIds.includes(el.entity_id)
      })
      const isCancel = !this.tableList.every((el) => {
        const selectIds = selection.map((j) => j.entity_id)
        return selectIds.includes(el.entity_id)
      })

      if (isSlect) {
        this.allChecked = true
        selection.map((el) => {
          this.$refs.tableList.toggleRowSelection(el, true)
          if (el.children) {
            this.setChildren(el.children, true)
          }
        })
        this.checkedList = this.tableList
        this.delInBatchesStatus = false
      }
      if (isCancel) {
        this.allChecked = false
        this.tableList.map((el) => {
          if (el.children) {
            this.setChildren(el.children, false)
          }
        })
        this.checkedList = []
        this.delInBatchesStatus = true
      }
      console.log(this.checkedList, 'dddddddd');

    },
    toggleRowSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.tableList &&
            this.$refs.tableList.toggleRowSelection(row, select)
        })
      }
    },
    setChildren(children, type) {
      children.map((j) => {
        this.toggleRowSelection(j, type)
        if (j.children) {
          this.setChildren(j.children, type)
        }
      })
    },

    select(selection, row) {
      console.log(selection, row);
      console.log(selection, 'select');
      const hasSelect = selection.some((el) => {
        return row.entity_id === el.entity_id
      })
      console.log(hasSelect);
      this.sinHasSelect = hasSelect
      if (hasSelect) {
        if (row.children) {
          this.setChildren(row.children, true)
        } else {
          this.tableList.forEach((item) => {
            if (row.entity_id === item.entity_id) {
              this.toggleRowSelection(item, true)
            }
          })
        }
      } else {
        if (row.children) {
          this.setChildren(row.children, false)
        }
      }
      this.checkedList = selection
      this.delInBatchesStatus = selection.length == 0
    },
    handleSelectionChange(val) {
      this.checkedList = val

      // console.log(this.batchId);
      this.delInBatchesStatus = this.checkedList.length == 0
      console.log(this.checkedList);
      console.log(val.length);


      // this.BatchPublish()
    },
  }
}
</script>

<style lang="scss" scoped>
  .business-box {
  width: 300px;
}

.btn {
  position: fixed;
  right: 10px;
  top: 90px;
  margin-right: 50px;
}

.btn_search {
  margin-right: 0px;
}

.searchBox {
  position: fixed;
  width: 240px;
  top: 90px;
  right: 200px;
}
.m-flag-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 40px;
  margin-left: 20px;

}

.line {
  border-bottom: 1px solid rgba(0, 0, 0, 0.10);
}

.m-flag,
.b-flag {
  margin-bottom: 10px;
  height: 150px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  margin-top: 10px;
  /* margin-left: 20px; */
  /* padding-left: 20px; */
  ;
}

.l-flag {
  margin-bottom: 10px;
  height: 150px;
}

.t-flag {
  border-bottom: 1px solid rgba(0, 0, 0, 0.10);
  margin-bottom: 10px;
}

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}

.topic-domain-management {
  .topic-domain-management-content {
    height: calc(100% - 40px);
    background-color: #f5f5f5;
    padding: 15px 15px 10px;
    overflow-y: scroll;

    overflow-x:none ::v-deep .el-table__row:not([class*='el-table__row--level-']) {
      td:nth-of-type(2) {
        padding-left: 24px;
      }
    }

    ::v-deep .el-table__body-wrapper {
      .el-table__row td div.cell {
        display: flex;
        align-items: center;
      }
    }
  }

}
</style>
<style lang="scss">
.logic-tab {
  .el-tabs__header {
    position: absolute !important;
    margin-top: -60px !important;
    margin-left: 100px;

    .el-tabs__item {
      color: rgba(0, 0, 0, 0.5);
      font-weight: 600;
    }

    .is-active {
      color: black !important;
    }
  }

  // display: flex;

}



.btn_img {
  margin-right: 10px;
  cursor: pointer;
}

.node-blocks {
  display: flex;
  align-items: center;
  justify-content: center;
  /* // padding: 8px;
    // padding: 10; */
  background-color: white !important;
  /** 通过自定义样式设置节点颜色需要加 !important **/
  width: 120px;
  height: 48px;
  border: 1px solid #eee;

  img {
    width: 20px;
    height: 20px;
    margin: 0 4px;
    margin-top: 5px;
  }

  .node-label {
    font-weight: bold;
    font-size: 12px;
    padding: 0;

    span {
      font-weight: normal;
    }
  }
}

.business {
  .business-content {
    height: calc(100% - 40px);

    .el-col {
      height: 100%;
    }

  }

  @mixin icon {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    color: $grey10;
  }

  .form-dialog {
    .busin-icon-box {
      border: 1px solid transparent;
      padding: 5px;

      &.active {
        border-color: $--color-primary;
      }

      &:hover {
        cursor: pointer;
        border-color: $--color-primary;
      }

      .busin_icon {
        @include icon();
      }
    }

    // .el-select{
    //   width:100%;
    // }
  }
}

.my-node-style {
  background-color: white !important;
  /** 通过自定义样式设置节点颜色需要加 !important **/
  width: 120px;
  height: 40px;
  border: 1px solid #eee !important;
}</style>
