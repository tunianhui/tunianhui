import fetch from '@/libs/fetch'

const filterList = {
  reason: [
    {
      id: 1,
      label: '完成',
      type: 'reason',
      state: 'done'
    },
    {
      id: 2,
      label: '出错',
      type: 'reason',
      state: 'err'
    },
    {
      id: 3,
      label: '运行超时',
      type: 'reason',
      state: 'overTime'
    },
    {
      id: 4,
      label: '未完成',
      type: 'reason',
      state: 'not'
    }
  ],
  receive: [
    {
      id: 11,
      label: '邮件',
      type: 'receive',
      state: 'email'
    },
    {
      id: 21,
      label: '微信',
      type: 'receive',
      state: 'WeChat'
    }
  ],
  receiveUser: [
    {
      id: 211,
      label: 'hdl超管(hdl_super_user@dataphin)',
      type: 'receiveUser',
      state: 'hdl超管(hdl_super_user@dataphin)'
    },
    {
      id: 21111,
      label: 'None(cus_test_003@dataphin)',
      type: 'buildUser',
      state: 'None(cus_test_003@dataphin)'
    }
  ],
  buildUser: [
    {
      id: 2111,
      label: 'None(cus_test_003@dataphin)',
      type: 'buildUser',
      state: 'None(cus_test_003@dataphin)'
    }
  ]
}

const filterList1 = {
  reason: [
    {
      id: 1,
      label: '完成',
      type: 'reason',
      state: 'done'
    },
    {
      id: 2,
      label: '出错',
      type: 'reason',
      state: 'err'
    },
    {
      id: 3,
      label: '运行超时',
      type: 'reason',
      state: 'overTime'
    },
    {
      id: 4,
      label: '未完成',
      type: 'reason',
      state: 'not'
    }
  ],
  receive: [
    {
      id: 11,
      label: '邮件',
      type: 'receive',
      state: 'email'
    },
    {
      id: 21,
      label: '微信',
      type: 'receive',
      state: 'WeChat'
    }
  ],
  sendState: [
    {
      state: 'success',
      label: '成功',
      type: 'sendState'
    },
    {
      state: 'fail',
      label: '失败',
      type: 'sendState'
    },
    {
      state: 'sending',
      label: '发送中',
      type: 'sendState'
    },
    {
      state: 'send',
      label: '已发送',
      type: 'sendState'
    }
  ],
  receiveUser: [
    {
      id: 211,
      label: 'hdl超管(hdl_super_user@dataphin)',
      type: 'receiveUser',
      state: 'hdl超管(hdl_super_user@dataphin)'
    }
  ]
}

const tableData = {
  traceId: '14d057ad77e04076',
  flag: true,
  message: '',
  data: [
    {
      id: 139160259,
      alertId: 139160237,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:11:38',
      sendAlertTime: '2019-11-16 01:11:43',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160258,
      alertId: 139160237,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:11:38',
      sendAlertTime: '2019-11-16 01:11:43',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160256,
      alertId: 139160222,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:11:18',
      sendAlertTime: '2019-11-16 01:11:18',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160257,
      alertId: 139160223,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:11:18',
      sendAlertTime: '2019-11-16 01:11:18',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160255,
      alertId: 139160218,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:10:53',
      sendAlertTime: '2019-11-16 01:10:53',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160254,
      alertId: 139160227,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:06:18',
      sendAlertTime: '2019-11-16 01:06:23',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160253,
      alertId: 139160227,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:06:18',
      sendAlertTime: '2019-11-16 01:06:23',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160252,
      alertId: 139160208,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:05:28',
      sendAlertTime: '2019-11-16 01:05:33',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160250,
      alertId: 139160200,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:03:18',
      sendAlertTime: '2019-11-16 01:03:23',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160251,
      alertId: 139160200,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 01:03:18',
      sendAlertTime: '2019-11-16 01:03:23',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160249,
      alertId: 139160237,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:41:33',
      sendAlertTime: '2019-11-16 00:41:38',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160248,
      alertId: 139160237,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:41:33',
      sendAlertTime: '2019-11-16 00:41:38',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160246,
      alertId: 139160222,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:41:18',
      sendAlertTime: '2019-11-16 00:41:18',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160247,
      alertId: 139160223,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:41:18',
      sendAlertTime: '2019-11-16 00:41:18',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160245,
      alertId: 139160218,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:40:53',
      sendAlertTime: '2019-11-16 00:40:53',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160243,
      alertId: 139160227,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:36:13',
      sendAlertTime: '2019-11-16 00:36:18',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160244,
      alertId: 139160227,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:36:13',
      sendAlertTime: '2019-11-16 00:36:18',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160242,
      alertId: 139160208,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:35:23',
      sendAlertTime: '2019-11-16 00:35:28',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160241,
      alertId: 139160200,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:33:13',
      sendAlertTime: '2019-11-16 00:33:18',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160240,
      alertId: 139160200,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:33:13',
      sendAlertTime: '2019-11-16 00:33:18',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: '',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160239,
      alertId: 139160237,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:11:27',
      sendAlertTime: '2019-11-16 00:11:33',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160238,
      alertId: 139160237,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:11:27',
      sendAlertTime: '2019-11-16 00:11:33',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160234,
      alertId: 139160222,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:11:17',
      sendAlertTime: '2019-11-16 00:11:18',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160235,
      alertId: 139160223,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:11:17',
      sendAlertTime: '2019-11-16 00:11:18',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160231,
      alertId: 139160218,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:10:50',
      sendAlertTime: '2019-11-16 00:10:53',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160228,
      alertId: 139160227,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:06:07',
      sendAlertTime: '2019-11-16 00:06:13',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160229,
      alertId: 139160227,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:06:07',
      sendAlertTime: '2019-11-16 00:06:13',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160225,
      alertId: 139160223,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:05:47',
      sendAlertTime: '2019-11-16 00:05:53',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160224,
      alertId: 139160222,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:05:47',
      sendAlertTime: '2019-11-16 00:05:53',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160219,
      alertId: 139160218,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:05:27',
      sendAlertTime: '2019-11-16 00:05:33',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160216,
      alertId: 139160208,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:05:17',
      sendAlertTime: '2019-11-16 00:05:23',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160201,
      alertId: 139160200,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:03:07',
      sendAlertTime: '2019-11-16 00:03:13',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160202,
      alertId: 139160200,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-16 00:03:07',
      sendAlertTime: '2019-11-16 00:03:13',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160188,
      alertId: 139160166,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:11:18',
      sendAlertTime: '2019-11-15 01:11:23',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160187,
      alertId: 139160166,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:11:18',
      sendAlertTime: '2019-11-15 01:11:23',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160186,
      alertId: 139160145,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:11:03',
      sendAlertTime: '2019-11-15 01:11:03',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160184,
      alertId: 139160144,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:10:58',
      sendAlertTime: '2019-11-15 01:10:58',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160185,
      alertId: 139160146,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:10:58',
      sendAlertTime: '2019-11-15 01:10:58',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160183,
      alertId: 139160156,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:06:18',
      sendAlertTime: '2019-11-15 01:06:23',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160182,
      alertId: 139160156,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:06:18',
      sendAlertTime: '2019-11-15 01:06:23',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: '',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160181,
      alertId: 139160153,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:05:53',
      sendAlertTime: '2019-11-15 01:05:58',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160180,
      alertId: 139160129,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:03:18',
      sendAlertTime: '2019-11-15 01:03:23',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160179,
      alertId: 139160129,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 01:03:18',
      sendAlertTime: '2019-11-15 01:03:23',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160177,
      alertId: 139160166,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:41:13',
      sendAlertTime: '2019-11-15 00:41:18',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160178,
      alertId: 139160166,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:41:13',
      sendAlertTime: '2019-11-15 00:41:18',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160176,
      alertId: 139160145,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:41:03',
      sendAlertTime: '2019-11-15 00:41:03',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160175,
      alertId: 139160146,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:40:58',
      sendAlertTime: '2019-11-15 00:40:58',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160174,
      alertId: 139160144,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:40:58',
      sendAlertTime: '2019-11-15 00:40:58',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160172,
      alertId: 139160156,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:36:13',
      sendAlertTime: '2019-11-15 00:36:18',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160173,
      alertId: 139160156,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:36:13',
      sendAlertTime: '2019-11-15 00:36:18',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160171,
      alertId: 139160153,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:35:48',
      sendAlertTime: '2019-11-15 00:35:53',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160169,
      alertId: 139160129,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:33:13',
      sendAlertTime: '2019-11-15 00:33:18',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160170,
      alertId: 139160129,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:33:13',
      sendAlertTime: '2019-11-15 00:33:18',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160168,
      alertId: 139160166,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:11:07',
      sendAlertTime: '2019-11-15 00:11:13',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160167,
      alertId: 139160166,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:11:07',
      sendAlertTime: '2019-11-15 00:11:13',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160164,
      alertId: 139160145,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:11:00',
      sendAlertTime: '2019-11-15 00:11:03',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160162,
      alertId: 139160146,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:10:57',
      sendAlertTime: '2019-11-15 00:10:58',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160161,
      alertId: 139160144,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:10:57',
      sendAlertTime: '2019-11-15 00:10:58',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160157,
      alertId: 139160156,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:06:07',
      sendAlertTime: '2019-11-15 00:06:13',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160158,
      alertId: 139160156,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:06:07',
      sendAlertTime: '2019-11-15 00:06:13',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160154,
      alertId: 139160153,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:05:41',
      sendAlertTime: '2019-11-15 00:05:48',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160151,
      alertId: 139160146,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:05:31',
      sendAlertTime: '2019-11-15 00:05:38',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160150,
      alertId: 139160145,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:05:31',
      sendAlertTime: '2019-11-15 00:05:38',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160149,
      alertId: 139160144,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:05:31',
      sendAlertTime: '2019-11-15 00:05:38',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160131,
      alertId: 139160129,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:03:07',
      sendAlertTime: '2019-11-15 00:03:13',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160130,
      alertId: 139160129,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-15 00:03:07',
      sendAlertTime: '2019-11-15 00:03:13',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160116,
      alertId: 139160095,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:11:28',
      sendAlertTime: '2019-11-14 01:11:33',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160117,
      alertId: 139160095,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:11:28',
      sendAlertTime: '2019-11-14 01:11:33',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160115,
      alertId: 139160079,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:11:08',
      sendAlertTime: '2019-11-14 01:11:08',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160114,
      alertId: 139160078,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:11:03',
      sendAlertTime: '2019-11-14 01:11:03',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160113,
      alertId: 139160077,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:11:03',
      sendAlertTime: '2019-11-14 01:11:03',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160111,
      alertId: 139160085,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:06:18',
      sendAlertTime: '2019-11-14 01:06:23',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160112,
      alertId: 139160085,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:06:18',
      sendAlertTime: '2019-11-14 01:06:23',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160110,
      alertId: 139160076,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:05:48',
      sendAlertTime: '2019-11-14 01:05:53',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160109,
      alertId: 139160058,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:03:18',
      sendAlertTime: '2019-11-14 01:03:23',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160108,
      alertId: 139160058,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 01:03:18',
      sendAlertTime: '2019-11-14 01:03:23',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160106,
      alertId: 139160095,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:41:23',
      sendAlertTime: '2019-11-14 00:41:28',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160107,
      alertId: 139160095,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:41:23',
      sendAlertTime: '2019-11-14 00:41:28',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160105,
      alertId: 139160079,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:41:08',
      sendAlertTime: '2019-11-14 00:41:08',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160104,
      alertId: 139160078,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:41:03',
      sendAlertTime: '2019-11-14 00:41:03',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160103,
      alertId: 139160077,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:41:03',
      sendAlertTime: '2019-11-14 00:41:03',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160102,
      alertId: 139160085,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:36:13',
      sendAlertTime: '2019-11-14 00:36:18',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160101,
      alertId: 139160085,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:36:13',
      sendAlertTime: '2019-11-14 00:36:18',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160100,
      alertId: 139160076,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:35:43',
      sendAlertTime: '2019-11-14 00:35:48',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160098,
      alertId: 139160058,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:33:13',
      sendAlertTime: '2019-11-14 00:33:18',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160099,
      alertId: 139160058,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:33:13',
      sendAlertTime: '2019-11-14 00:33:18',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160097,
      alertId: 139160095,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:11:17',
      sendAlertTime: '2019-11-14 00:11:23',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160096,
      alertId: 139160095,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '6',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:11:17',
      sendAlertTime: '2019-11-14 00:11:23',
      content:
        '【Dataphin-报警】任务 dim_province_core_od001_v1(n_3231825)-运行时间超过6分钟，从属项目cus_test_003',
      nodeId: 'n_3231825',
      nodeName: 'dim_province_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160093,
      alertId: 139160079,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:11:07',
      sendAlertTime: '2019-11-14 00:11:08',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160090,
      alertId: 139160077,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:11:02',
      sendAlertTime: '2019-11-14 00:11:03',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160091,
      alertId: 139160078,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:11:02',
      sendAlertTime: '2019-11-14 00:11:03',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160086,
      alertId: 139160085,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:06:07',
      sendAlertTime: '2019-11-14 00:06:13',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160087,
      alertId: 139160085,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:06',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:06:07',
      sendAlertTime: '2019-11-14 00:06:13',
      content:
        '【Dataphin-报警】任务 dws_province_od002_v1(n_3143389)-于00:06未完成，从属项目cus_test_003',
      nodeId: 'n_3143389',
      nodeName: 'dws_province_od002_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160081,
      alertId: 139160077,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:05:37',
      sendAlertTime: '2019-11-14 00:05:43',
      content:
        '【Dataphin-报警】任务 fct_house_statistics_house_di_od000_v1(n_3231824)-出错，从属项目cus_test_003',
      nodeId: 'n_3231824',
      nodeName: 'fct_house_statistics_house_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160080,
      alertId: 139160076,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_SET_TIMEOUT',
      setTime: '0',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:05:37',
      sendAlertTime: '2019-11-14 00:05:43',
      content:
        '【Dataphin-报警】任务 fct_res_person_20191106_di_od000_v1(n_919520990198235136)-运行时间超过0分钟，从属项目cus_test_003',
      nodeId: 'n_919520990198235136',
      nodeName: 'fct_res_person_20191106_di_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160082,
      alertId: 139160078,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:05:37',
      sendAlertTime: '2019-11-14 00:05:43',
      content:
        '【Dataphin-报警】任务 dim_a_house_core_od001_v1(n_3174752)-出错，从属项目cus_test_003',
      nodeId: 'n_3174752',
      nodeName: 'dim_a_house_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160083,
      alertId: 139160079,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:05:37',
      sendAlertTime: '2019-11-14 00:05:43',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160060,
      alertId: 139160058,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:03:07',
      sendAlertTime: '2019-11-14 00:03:13',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '3',
        userName: 'hdl超管(hdl_super_user@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160059,
      alertId: 139160058,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_SMS',
      alertReason: 'MONITOR_UN_FINISH',
      setTime: '00:03',
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-14 00:03:07',
      sendAlertTime: '2019-11-14 00:03:13',
      content:
        '【Dataphin-报警】任务 dws_source_od000_v1(n_3252222)-于00:03未完成，从属项目cus_test_003',
      nodeId: 'n_3252222',
      nodeName: 'dws_source_od000_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    },
    {
      id: 139160039,
      alertId: 139160031,
      monitorType: 'CUSTOM_TASK_MONITOR',
      alertType: 'BY_EMAIL',
      alertReason: 'MONITOR_ERROR',
      setTime: null,
      alertRecordStatus: 'FAILED',
      alertLevel: 'INFORMATION',
      dueAlertTime: '2019-11-13 16:50:58',
      sendAlertTime: '2019-11-13 16:51:03',
      content:
        '【Dataphin-报警】任务 dim_source_core_od001_v1(n_3231802)-出错，从属项目cus_test_003',
      nodeId: 'n_3231802',
      nodeName: 'dim_source_core_od001_v1',
      alertRecipient: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      },
      failedReasonMsg: '账户中找不到指定接收人',
      projectId: '29412409',
      projectName: 'cus_test_003',
      alertOwner: {
        userId: '29414347',
        userName: 'None(cus_test_003@dataphin)',
        phoneNumber: null,
        mailAddress: null,
        dingtalkRobotHook: null,
        dingtalkPhoneNumber: null
      }
    }
  ],
  monitorLog: null
}

const tableData1 = {
  traceId: 'af35a4bc19555b1f',
  flag: true,
  message: '',
  data: {
    resultData: [
      {
        nodeId: 'n_919520990198235136',
        nodeName: 'fct_res_person_20191106_di_od000_v1',
        nodeOutputNameList: [
          'cus_test_003.fct_res_person_20191106_di_od000_v1'
        ],
        nodeDesc:
          'auto-created node for table cus_test_003.fct_res_person_20191106_di_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_919520990198235136',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402',
          environment: 'PROD'
        },
        userInfo: {
          entityId: 'n_919520990198235136',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_919520990198235136',
          createTime: '2019-11-06 17:46:23',
          lastModifiedTime: '2019-11-06 17:46:23'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3644811',
        nodeName: 'dws_area_code_od000_v1',
        nodeOutputNameList: ['cus_test_003.dws_area_code_od000_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_area_code_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3387368',
            sourceNodeOutputName:
              'cus_test_003.fct_res_person_area_di_od000_v1',
            targetNodeId: 'n_3644811',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3644811',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3644811',
          createTime: '2019-08-13 17:06:30',
          lastModifiedTime: '2019-08-13 17:06:30'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3416872',
        nodeName: 'dws_area_code_od001_v1',
        nodeOutputNameList: ['cus_test_003.dws_area_code_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_area_code_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3387368',
            sourceNodeOutputName:
              'cus_test_003.fct_res_person_area_di_od000_v1',
            targetNodeId: 'n_3416872',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3416872',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3416872',
          createTime: '2019-08-13 19:43:10',
          lastModifiedTime: '2019-08-13 19:43:10'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3387368',
        nodeName: 'fct_res_person_area_di_od000_v1',
        nodeOutputNameList: ['cus_test_003.fct_res_person_area_di_od000_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.fct_res_person_area_di_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: [
          {
            sourceNodeId: 'n_3387368',
            sourceNodeOutputName:
              'cus_test_003.fct_res_person_area_di_od000_v1',
            targetNodeId: 'n_3416872',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3387368',
            sourceNodeOutputName:
              'cus_test_003.fct_res_person_area_di_od000_v1',
            targetNodeId: 'n_3644811',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3387368',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3387368',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3387368',
          createTime: '2019-08-13 16:48:08',
          lastModifiedTime: '2019-08-13 18:10:12'
        },
        content: null,
        version: 2,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3387367',
        nodeName: 'dim_area_code_core_od001_v1',
        nodeOutputNameList: ['cus_test_003.dim_area_code_core_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dim_area_code_core_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3387367',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3387367',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3387367',
          createTime: '2019-08-13 16:45:17',
          lastModifiedTime: '2019-08-22 16:03:09'
        },
        content: null,
        version: 4,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3279192',
        nodeName: 'dws_user_province_od002_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_province_od002_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_user_province_od002_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3279192',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3279192',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3279192',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3279192',
          createTime: '2019-07-03 16:46:46',
          lastModifiedTime: '2019-09-24 18:02:52'
        },
        content: null,
        version: 7,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3252224',
        nodeName: 'dws_user_od004_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_od004_v1'],
        nodeDesc: 'auto-created node for table cus_test_003.dws_user_od004_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3252224',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3252224',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3252224',
          createTime: '2019-06-28 15:44:30',
          lastModifiedTime: '2019-06-28 15:44:30'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3252222',
        nodeName: 'dws_source_od000_v1',
        nodeOutputNameList: ['cus_test_003.dws_source_od000_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_source_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3252222',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3252222',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3252222',
          createTime: '2019-06-28 15:23:18',
          lastModifiedTime: '2019-06-28 15:23:18'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3231832',
        nodeName: 'dws_user_od000_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_od000_v1'],
        nodeDesc: 'auto-created node for table cus_test_003.dws_user_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3231832',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3231832',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3231832',
          createTime: '2019-06-24 17:15:44',
          lastModifiedTime: '2019-07-08 16:24:39'
        },
        content: null,
        version: 8,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3231825',
        nodeName: 'dim_province_core_od001_v1',
        nodeOutputNameList: ['cus_test_003.dim_province_core_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dim_province_core_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3231825',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3231825',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3231825',
          createTime: '2019-06-24 16:59:24',
          lastModifiedTime: '2019-06-24 16:59:24'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3231824',
        nodeName: 'fct_house_statistics_house_di_od000_v1',
        nodeOutputNameList: [
          'cus_test_003.fct_house_statistics_house_di_od000_v1'
        ],
        nodeDesc:
          'auto-created node for table cus_test_003.fct_house_statistics_house_di_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3231832',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3142602',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3143389',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3174590',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3183128',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3183111',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3150494',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3142592',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3143390',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3279192',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3231824',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3231824',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3231824',
          createTime: '2019-06-24 16:53:36',
          lastModifiedTime: '2019-07-05 15:20:19'
        },
        content: null,
        version: 4,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3231802',
        nodeName: 'dim_source_core_od001_v1',
        nodeOutputNameList: ['cus_test_003.dim_source_core_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dim_source_core_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3231802',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3231802',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3231802',
          createTime: '2019-06-24 15:16:36',
          lastModifiedTime: '2019-06-24 15:16:39'
        },
        content: null,
        version: 2,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3183128',
        nodeName: 'dws_user_od006_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_od006_v1'],
        nodeDesc: 'auto-created node for table cus_test_003.dws_user_od006_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3183128',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3183128',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3183128',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3183128',
          createTime: '2019-07-09 14:11:34',
          lastModifiedTime: '2019-07-24 18:07:25'
        },
        content: null,
        version: 5,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3183111',
        nodeName: 'dws_user_province_od004_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_province_od004_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_user_province_od004_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3183111',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3183111',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3183111',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3183111',
          createTime: '2019-07-08 16:19:58',
          lastModifiedTime: '2019-07-24 18:07:24'
        },
        content: null,
        version: 9,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3174752',
        nodeName: 'dim_a_house_core_od001_v1',
        nodeOutputNameList: ['cus_test_003.dim_a_house_core_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dim_a_house_core_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3174752',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3174752',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3174752',
          createTime: '2019-06-30 18:51:41',
          lastModifiedTime: '2019-06-30 18:51:41'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3174685',
        nodeName: 'dws_user_od005_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_od005_v1'],
        nodeDesc: 'auto-created node for table cus_test_003.dws_user_od005_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3174685',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3174685',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3174685',
          createTime: '2019-06-28 15:44:30',
          lastModifiedTime: '2019-06-28 15:44:30'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3174590',
        nodeName: 'dws_user_province_od001_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_province_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_user_province_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3174590',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3174590',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3174590',
          createTime: '2019-06-25 17:47:43',
          lastModifiedTime: '2019-07-02 10:32:26'
        },
        content: null,
        version: 3,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3150494',
        nodeName: 'dws_user_province_od003_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_province_od003_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_user_province_od003_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3150494',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3150494',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3150494',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3150494',
          createTime: '2019-07-08 16:19:58',
          lastModifiedTime: '2019-07-24 18:07:25'
        },
        content: null,
        version: 6,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3143464',
        nodeName: 'dws_source_od001_v1',
        nodeOutputNameList: ['cus_test_003.dws_source_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_source_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3143464',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3143464',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3143464',
          createTime: '2019-06-28 15:23:18',
          lastModifiedTime: '2019-06-29 19:52:59'
        },
        content: null,
        version: 2,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3143390',
        nodeName: 'dws_province_od003_v1',
        nodeOutputNameList: ['cus_test_003.dws_province_od003_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_province_od003_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3143390',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3143390',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3143390',
          createTime: '2019-06-25 17:55:41',
          lastModifiedTime: '2019-07-02 10:32:25'
        },
        content: null,
        version: 3,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3143389',
        nodeName: 'dws_province_od002_v1',
        nodeOutputNameList: ['cus_test_003.dws_province_od002_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dws_province_od002_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3143389',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3143389',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3143389',
          createTime: '2019-06-25 17:53:39',
          lastModifiedTime: '2019-07-02 10:32:25'
        },
        content: null,
        version: 3,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3142623',
        nodeName: 'fct_house_pro_house_a_di_od000_v1',
        nodeOutputNameList: ['cus_test_003.fct_house_pro_house_a_di_od000_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.fct_house_pro_house_a_di_od000_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3252224',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3174685',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3143464',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142623',
            sourceNodeOutputName:
              'cus_test_003.fct_house_pro_house_a_di_od000_v1',
            targetNodeId: 'n_3252222',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3384732',
            sourceNodeOutputName: 'test_2',
            targetNodeId: 'n_3142623',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3377288',
            sourceNodeOutputName: 'area_province',
            targetNodeId: 'n_3142623',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3304831',
            sourceNodeOutputName: 'DWD_S_SRV_REQ',
            targetNodeId: 'n_3142623',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3142623',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3142623',
          createTime: '2019-06-25 11:22:17',
          lastModifiedTime: '2019-08-28 14:55:50'
        },
        content: null,
        version: 4,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3142602',
        nodeName: 'dws_user_od002_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_od002_v1'],
        nodeDesc: 'auto-created node for table cus_test_003.dws_user_od002_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3142602',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3142602',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3142602',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3142602',
          createTime: '2019-06-24 18:51:40',
          lastModifiedTime: '2019-07-24 18:07:25'
        },
        content: null,
        version: 8,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3142592',
        nodeName: 'dws_user_od001_v1',
        nodeOutputNameList: ['cus_test_003.dws_user_od001_v1'],
        nodeDesc: 'auto-created node for table cus_test_003.dws_user_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: null,
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_3231824',
            sourceNodeOutputName:
              'cus_test_003.fct_house_statistics_house_di_od000_v1',
            targetNodeId: 'n_3142592',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3142592',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3142592',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3142592',
          createTime: '2019-06-24 17:15:44',
          lastModifiedTime: '2019-07-24 18:07:25'
        },
        content: null,
        version: 9,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      },
      {
        nodeId: 'n_3142591',
        nodeName: 'dim_user_core_od001_v1',
        nodeOutputNameList: ['cus_test_003.dim_user_core_od001_v1'],
        nodeDesc:
          'auto-created node for table cus_test_003.dim_user_core_od001_v1',
        nodeType: 1,
        operatorType: 25,
        cronExpression: '00 00 00 * * ?',
        dagId: 'd_1000000',
        priority: 5,
        downstreamNodeRelations: [
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3183111',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3279192',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3183128',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3142602',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3142592',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          },
          {
            sourceNodeId: 'n_3142591',
            sourceNodeOutputName: 'cus_test_003.dim_user_core_od001_v1',
            targetNodeId: 'n_3150494',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        upstreamNodeRelations: [
          {
            sourceNodeId: 'n_1000001',
            sourceNodeOutputName: 'virtual_root_node_1000000',
            targetNodeId: 'n_3142591',
            targetNodeOutputName: null,
            periodDiff: 0,
            dayDiff: null
          }
        ],
        params: 'bizdate=${yyyyMMdd}',
        dsConfig: {
          dsId: '29412402'
        },
        userInfo: {
          entityId: 'n_3142591',
          tenant: {
            tenantId: '183454'
          },
          project: {
            projectId: '29412409',
            projectName: 'cus_test_003',
            modeEnum: 'BASIC',
            projectType: 'GENERAL'
          },
          creator: {
            userId: '29414347',
            userName: null
          },
          owner: {
            userId: '29414347',
            userName: 'None(cus_test_003@dataphin)'
          },
          modifier: {
            userId: '29414347',
            userName: null
          }
        },
        timeInfo: {
          entityId: 'n_3142591',
          createTime: '2019-06-24 16:35:50',
          lastModifiedTime: '2019-06-24 16:35:50'
        },
        content: null,
        version: 1,
        nodeStatus: 1,
        nodeFrom: 'onedata3-server',
        tags: null,
        statusCode: null,
        countOfRun: null,
        executeTimeEntity: null,
        columns: null,
        task: null,
        downstreamLogicalNodeRelations: null,
        upstreamLogicalNodeRelations: null,
        parentId: null,
        parentName: null,
        leaf: null
      }
    ],
    count: 25
  },
  monitorLog: null
}

const fetchTest2 = (data, time = 500) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        flag: true,
        data: data
      })
    }, time)
  })
const fetchTest3 = (data, time = 500) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        flag: true,
        msg: ''
      })
    }, time)
  })

// export function getTaskList(params) {
//   return new Promise((resolve, reject) => {
//     let data = tableData.data.slice((params.pageSize - 1) * params.pageRow, params.pageSize * params.pageRow)
//     setTimeout(() => {
//       resolve({
//         flag: true,
//         total: 100,
//         data,
//         msg: ''
//       })
//     }, 1500)
//   })
// }

export function getTableList(params) {
  return new Promise((resolve, reject) => {
    let data = tableData1.data.resultData.slice(
      (params.pageSize - 1) * params.pageRow,
      params.pageSize * params.pageRow
    )
    setTimeout(() => {
      resolve({
        flag: true,
        total: 25,
        data,
        msg: ''
      })
    }, 1500)
  })
}

export const getFilter = fetchTest2(filterList)
export const getFilterList = fetchTest2(filterList1)
export const getAddTsdk = fetchTest3(tableData)
export const getDel = fetchTest3(tableData)

// 任务列表
export function getTaskList(data = {}) {
  return fetch({
    url: '/developTask/list',
    method: 'post',
    data
  })
}

// 调度流程信息
export function getTaskFlow(data = {}) {
  return fetch({
    url: '/developTask/queryById',
    method: 'post',
    data
  })
}

// 展开父节点
export function getTaskParent(data = {}) {
  return fetch({
    url: '/developTask/getParent',
    method: 'post',
    data
  })
}

// 展开子节点
export function getTaskChild(data = {}) {
  return fetch({
    url: '/developTask/getChild',
    method: 'post',
    data
  })
}

// 查看节点代码
export function getNodeCode(data = {}) {
  return fetch({
    url: '/developTask/getNodeCode',
    method: 'post',
    data
  })
}

// 补数据
export function compensateData(data = {}) {
  return fetch({
    url: '/developTask/compensateData',
    method: 'post',
    data
  })
}

// 操作日志
export function getOperLog(data = {}) {
  return fetch({
    url: '/developTask/getOperLog',
    method: 'post',
    data
  })
}

// 周期实例列表
export function listCycleInstance(data = {}) {
  return fetch({
    url: '/developTask/listCycleInstance',
    method: 'post',
    data
  })
}

// 补数据实例列表
export function listRepairDataInstance(data = {}) {
  return fetch({
    url: '/developTask/listRepairDataInstance',
    method: 'post',
    data
  })
}

// 重跑
export function reRunTask(data = {}) {
  return fetch({
    url: '/developTask/ReRunTask',
    method: 'post',
    data
  })
}

// 暂停 | 恢复
export function pauseRecover(data = {}) {
  return fetch({
    url: '/developTask/operate',
    method: 'post',
    data
  })
}

// 下游节点列表
export function getDownstream(data = {}) {
  return fetch({
    url: '/developTask/getDownstream',
    method: 'post',
    data
  })
}

// 重跑下游
export function reRunDownstream(data = {}) {
  return fetch({
    url: '/developTask/reRunDownstream',
    method: 'post',
    data
  })
}

// 获取运行日志
export function getRunLog(data = {}) {
  return fetch({
    url: '/developTask/getRunLog',
    method: 'post',
    data
  })
}

// 查看运行日志列表
export function listHistoryLog(data = {}) {
  return fetch({
    url: '/developTask/listHistoryLog',
    method: 'post',
    data
  })
}
