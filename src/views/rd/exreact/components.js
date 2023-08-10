/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-03-03 10:01:38
 * @Description: component
 */

// 用于与tabs匹配组件
export default {
  Initialize: _ => import(/* webpackChunkName: "ExreactInitialize" */ './initialize/index.vue'),
  Wellcome: _ => import(/* webpackChunkName: "ExreactWellcome" */ './wellcome/index.vue'),
  ExreactObjectTable: _ => import(/* webpackChunkName: "ExreactObjectTable" */ './object-table'),
  BehaviorBoard: _ => import(/* webpackChunkName: "BehaviorBoard" */ './behavior-board/index.vue'),
  RegularAttr: _ => import(/* webpackChunkName: "RegularAttr" */ './behavior-center/behavior/regular/attr.vue'),
  RegularEdit: _ => import(/* webpackChunkName: "RegularEdit" */ './behavior-center/behavior/regular/edit.vue'),
  RegularEditDialog: _ => import(/* webpackChunkName: "RegularEditDialog" */ './behavior-center/behavior/regular/edit-dialog.vue'),
  RegularAddData: _ => import(/* webpackChunkName: "RegularAddData" */ './behavior-center/behavior/regular/add-data.vue'),
  RegularTable: _ => import(/* webpackChunkName: "RegularTable" */ './behavior-center/behavior/regular/table.vue'),
  ActionAttr: _ => import(/* webpackChunkName: "ActionAttr" */ './behavior-center/element/action/attr.vue'),
  ActionEdit: _ => import(/* webpackChunkName: "ActionEdit" */ './behavior-center/element/action/edit.vue'),
  ActionTable: _ => import(/* webpackChunkName: "ActionTable" */ './behavior-center/element/action/table.vue'),
  DomainBusAttr: _ => import(/* webpackChunkName: "DomainBusAttr" */ './behavior-center/element/domain-bus/attr.vue'),
  DomainEdit: _ => import(/* webpackChunkName: "DomainEdit" */ './behavior-center/element/domain-bus/domain-edit.vue'),
  BusEdit: _ => import(/* webpackChunkName: "BusEdit" */ './behavior-center/element/domain-bus/bus-edit.vue'),
  DomainBusTable: _ => import(/* webpackChunkName: "DomainBusTable" */ './behavior-center/element/domain-bus/table.vue'),
  ObjectAttr: _ => import(/* webpackChunkName: "ObjectAttr" */ './behavior-center/element/object/attr.vue'),
  ObjectEdit: _ => import(/* webpackChunkName: "ObjectEdit" */ './behavior-center/element/object/edit.vue'),
  ObjectTable: _ => import(/* webpackChunkName: "ObjectTable" */ './behavior-center/element/object/table.vue'),
  ObjectAttrSideAttr: _ => import(/* webpackChunkName: "ObjectAttrSideAttr" */ './behavior-center/element/object-attr/attr.vue'),
  ObjectAttrEdit: _ => import(/* webpackChunkName: "ObjectAttrEdit" */ './behavior-center/element/object-attr/edit.vue'),
  ObjectAttrTable: _ => import(/* webpackChunkName: "ObjectAttrTable" */ './behavior-center/element/object-attr/table.vue'),
  FactoryAttr: _ => import(/* webpackChunkName: "FactoryAttr" */ './tag-center/factory/attr.vue'),
  FactoryEdit: _ => import(/* webpackChunkName: "FactoryEdit" */ './tag-center/factory/edit.vue'),
  FactoryTable: _ => import(/* webpackChunkName: "FactoryTable" */ './tag-center/factory/table.vue'),
  LabelBasicAttr: _ => import(/* webpackChunkName: "LabelBasicAttr" */ './tag-center/factory/tag/label-basic-edit.vue'),
  LogicAttr: _ => import(/* webpackChunkName: "LogicAttr" */ './tag-center/logic/attr.vue'),
  LogicEdit: _ => import(/* webpackChunkName: "LogicEdit" */ './tag-center/logic/edit.vue'),
  AddManual: _ => import(/* webpackChunkName: "AddManual" */ './tag-center/logic/new-manual.vue'),
  CategoryAttr: _ => import(/* webpackChunkName: "CategoryAttr" */ './tag-center/category/attr.vue'),
  CategoryEdit: _ => import(/* webpackChunkName: "CategoryEdit" */ './tag-center/category/edit.vue'),
  CategoryTable: _ => import(/* webpackChunkName: "CategoryTable" */ './tag-center/category/table.vue'),
  ServiceAttr: _ => import(/* webpackChunkName: "ServiceAttr" */ './tag-center/service/attr.vue'),
  ServiceEdit: _ => import(/* webpackChunkName: "ServiceEdit" */ './tag-center/service/edit.vue'),
  TagConfig: _ => import(/* webpackChunkName: "TagConfig" */ './tag-center/factory/tag/config.vue'),
  DelDialog: _ => import(/* webpackChunkName: "DelDialog" */ '@c/del.vue'),
  TagAddData: _ => import(/* webpackChunkName: "TagAddData" */ './tag-center/factory/tag/add-data.vue'),
  TagOffline: _ => import(/* webpackChunkName: "TagOffline" */ './tag-center/factory/offline.vue'),
  ReportAttr: _ => import(/* webpackChunkName: "ReportAttr" */ './tag-center/factory/report-attr.vue'),
  // id中心
  IdEditCreate: _ => import(/* webpackChunkName: "IdEditCreate" */ './idsCenter/entity-id/edit.vue'),
  EntityIdAttr: _ => import(/* webpackChunkName: "EntityIdAttr" */ './idsCenter/entity-id/attr.vue'),
  EntityIdTable: _ => import(/* webpackChunkName: "EntityIdTable" */ './idsCenter/entity-id/table.vue'),
  MainIdEdit: _ => import(/* webpackChunkName: "MainIdEdit" */ './idsCenter/main/edit.vue'),
  // id映射表
  MappingTableId: _ => import(/* webpackChunkName: "MappingTableId" */ './idsCenter/mapping-table/edit.vue'),
  MappingTableIdTable: _ => import(/* webpackChunkName: "MappingTableIdTable" */ './idsCenter/mapping-table/table.vue'),
  MappingTableIdAttr: _ => import(/* webpackChunkName: "MappingTableIdAttr" */ './idsCenter/mapping-table/attr.vue'),
}
