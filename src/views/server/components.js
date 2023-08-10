/*
 * @Autor: YONG
 * @LastEditors: YONG
 * @Date: 2022-02-24 14:12:05
 * @LastEditTime: 2022-02-24 15:34:25
 * @Description: component
 */

// 用于与tabs匹配组件
export default {
  // 服务开发引导页
  Wellcome: _ =>
    import(/* webpackChunkName: "ServerWelcome" */ './wellcome/index.vue'),

  ServerObjectTable: _ =>
    import(/* webpackChunkName: "ServerObjectTable" */ './object-table'),

  // Api生成
  ApiCreate: _ =>
    import(/* webpackChunkName: "ApiCreate" */ './api-dev/api-dev/create.vue'),

  ApiCreateEdit: _ =>
    import(
      /* webpackChunkName: "ApiCreateEdit" */ './service-dev/api-create/edit.vue'
    ),
  ApiCreateAttr: _ =>
    import(
      /* webpackChunkName: "ApiCreateAttr" */ './service-dev/api-create/attr.vue'
    ),

  // Api注册
  ApiRegisterEdit: _ =>
    import(
      /* webpackChunkName: "ApiRegisterEdit" */ './service-dev/register/edit.vue'
    ),
  RegisterAttr: _ =>
    import(
      /* webpackChunkName: "ApiRegisterAttr" */ './service-dev/register/attr.vue'
    ),

  // 函数
  FuncEdit: _ =>
    import(/* webpackChunkName: "FuncEdit" */ './service-dev/func/edit.vue'),
  FuncAttr: _ =>
    import(/* webpackChunkName: "FuncAttr" */ './service-dev/func/attr.vue'),

  // 服务编排
  ArrangeEdit: _ =>
    import(
      /* webpackChunkName: "ArrangeEdit" */ './service-dev/arrange/edit.vue'
    ),
  ArrangeAttr: _ =>
    import(
      /* webpackChunkName: "ArrangeAttr" */ './service-dev/arrange/attr.vue'
    ),

  // 业务流程
  FlowEdit: _ =>
    import(/* webpackChunkName: "FlowEdit" */ './service-dev/flow/edit.vue'),
  FlowAttr: _ =>
    import(/* webpackChunkName: "FlowAttr" */ './service-dev/flow/attr.vue')
}
