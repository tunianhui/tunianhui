export const treeData = {
  'flag': true,
  'message': '',
  'data': [{
    'children': [{
      'nodeId': 'n_3174752',
      'nodeName': 'dim_a_house_core_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dim_a_house_core_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dim_a_house_core_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3174752',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3174752',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3174752',
        'createTime': '2019-06-30 18:51:41',
        'lastModifiedTime': '2019-06-30 18:51:41'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487764',
      'parentName': 'dim_a_house',
      'leaf': true
    }],
    'id': 30487764,
    'name': 'dim_a_house',
    'type': 16,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3387367',
      'nodeName': 'dim_area_code_core_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dim_area_code_core_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dim_area_code_core_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3387367',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3387367',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3387367',
        'createTime': '2019-08-13 16:45:17',
        'lastModifiedTime': '2019-08-22 16:03:09'
      },
      'content': null,
      'version': 4,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '33831010',
      'parentName': 'dim_area_code',
      'leaf': true
    }],
    'id': 33831010,
    'name': 'dim_area_code',
    'type': 16,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3231825',
      'nodeName': 'dim_province_core_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dim_province_core_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dim_province_core_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3231825',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3231825',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3231825',
        'createTime': '2019-06-24 16:59:24',
        'lastModifiedTime': '2019-06-24 16:59:24'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487558',
      'parentName': 'dim_province',
      'leaf': true
    }],
    'id': 30487558,
    'name': 'dim_province',
    'type': 16,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3231802',
      'nodeName': 'dim_source_core_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dim_source_core_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dim_source_core_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3231802',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3231802',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3231802',
        'createTime': '2019-06-24 15:16:36',
        'lastModifiedTime': '2019-06-24 15:16:39'
      },
      'content': null,
      'version': 2,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487704',
      'parentName': 'dim_source',
      'leaf': true
    }],
    'id': 30487704,
    'name': 'dim_source',
    'type': 16,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3142591',
      'nodeName': 'dim_user_core_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dim_user_core_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dim_user_core_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': [{
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3183111',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3279192',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3183128',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3142602',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3142592',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3150494',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3142591',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3142591',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3142591',
        'createTime': '2019-06-24 16:35:50',
        'lastModifiedTime': '2019-06-24 16:35:50'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30193357',
      'parentName': 'dim_user',
      'leaf': true
    }],
    'id': 30193357,
    'name': 'dim_user',
    'type': 16,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3644811',
      'nodeName': 'dws_area_code_od000_v1',
      'nodeOutputNameList': ['cus_test_003.dws_area_code_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_area_code_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3387368',
        'sourceNodeOutputName': 'cus_test_003.fct_res_person_area_di_od000_v1',
        'targetNodeId': 'n_3644811',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3644811',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3644811',
        'createTime': '2019-08-13 17:06:30',
        'lastModifiedTime': '2019-08-13 17:06:30'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '33844350',
      'parentName': 'dws_area_code',
      'leaf': true
    }, {
      'nodeId': 'n_3416872',
      'nodeName': 'dws_area_code_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dws_area_code_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_area_code_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3387368',
        'sourceNodeOutputName': 'cus_test_003.fct_res_person_area_di_od000_v1',
        'targetNodeId': 'n_3416872',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3416872',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3416872',
        'createTime': '2019-08-13 19:43:10',
        'lastModifiedTime': '2019-08-13 19:43:10'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '33844350',
      'parentName': 'dws_area_code',
      'leaf': true
    }],
    'id': 33844350,
    'name': 'dws_area_code',
    'type': 18,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 2,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3143389',
      'nodeName': 'dws_province_od002_v1',
      'nodeOutputNameList': ['cus_test_003.dws_province_od002_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_province_od002_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3143389',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3143389',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3143389',
        'createTime': '2019-06-25 17:53:39',
        'lastModifiedTime': '2019-07-02 10:32:25'
      },
      'content': null,
      'version': 3,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487594',
      'parentName': 'dws_province',
      'leaf': true
    }, {
      'nodeId': 'n_3143390',
      'nodeName': 'dws_province_od003_v1',
      'nodeOutputNameList': ['cus_test_003.dws_province_od003_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_province_od003_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3143390',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3143390',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3143390',
        'createTime': '2019-06-25 17:55:41',
        'lastModifiedTime': '2019-07-02 10:32:25'
      },
      'content': null,
      'version': 3,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487594',
      'parentName': 'dws_province',
      'leaf': true
    }],
    'id': 30487594,
    'name': 'dws_province',
    'type': 18,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 2,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3252222',
      'nodeName': 'dws_source_od000_v1',
      'nodeOutputNameList': ['cus_test_003.dws_source_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_source_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3252222',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3252222',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3252222',
        'createTime': '2019-06-28 15:23:18',
        'lastModifiedTime': '2019-06-28 15:23:18'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490301',
      'parentName': 'dws_source',
      'leaf': true
    }, {
      'nodeId': 'n_3143464',
      'nodeName': 'dws_source_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dws_source_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_source_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3143464',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3143464',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3143464',
        'createTime': '2019-06-28 15:23:18',
        'lastModifiedTime': '2019-06-29 19:52:59'
      },
      'content': null,
      'version': 2,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490301',
      'parentName': 'dws_source',
      'leaf': true
    }],
    'id': 30490301,
    'name': 'dws_source',
    'type': 18,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 2,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3231832',
      'nodeName': 'dws_user_od000_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3231832',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3231832',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3231832',
        'createTime': '2019-06-24 17:15:44',
        'lastModifiedTime': '2019-07-08 16:24:39'
      },
      'content': null,
      'version': 8,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487570',
      'parentName': 'dws_user',
      'leaf': true
    }, {
      'nodeId': 'n_3142592',
      'nodeName': 'dws_user_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3142592',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3142592',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3142592',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3142592',
        'createTime': '2019-06-24 17:15:44',
        'lastModifiedTime': '2019-07-24 18:07:25'
      },
      'content': null,
      'version': 9,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487570',
      'parentName': 'dws_user',
      'leaf': true
    }, {
      'nodeId': 'n_3142602',
      'nodeName': 'dws_user_od002_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_od002_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_od002_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3142602',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3142602',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3142602',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3142602',
        'createTime': '2019-06-24 18:51:40',
        'lastModifiedTime': '2019-07-24 18:07:25'
      },
      'content': null,
      'version': 8,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487570',
      'parentName': 'dws_user',
      'leaf': true
    }, {
      'nodeId': 'n_3252224',
      'nodeName': 'dws_user_od004_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_od004_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_od004_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3252224',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3252224',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3252224',
        'createTime': '2019-06-28 15:44:30',
        'lastModifiedTime': '2019-06-28 15:44:30'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487570',
      'parentName': 'dws_user',
      'leaf': true
    }, {
      'nodeId': 'n_3174685',
      'nodeName': 'dws_user_od005_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_od005_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_od005_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3174685',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3174685',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3174685',
        'createTime': '2019-06-28 15:44:30',
        'lastModifiedTime': '2019-06-28 15:44:30'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487570',
      'parentName': 'dws_user',
      'leaf': true
    }, {
      'nodeId': 'n_3183128',
      'nodeName': 'dws_user_od006_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_od006_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_od006_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3183128',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3183128',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3183128',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3183128',
        'createTime': '2019-07-09 14:11:34',
        'lastModifiedTime': '2019-07-24 18:07:25'
      },
      'content': null,
      'version': 5,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487570',
      'parentName': 'dws_user',
      'leaf': true
    }],
    'id': 30487570,
    'name': 'dws_user',
    'type': 18,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 6,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3174590',
      'nodeName': 'dws_user_province_od001_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_province_od001_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_province_od001_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3174590',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3174590',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3174590',
        'createTime': '2019-06-25 17:47:43',
        'lastModifiedTime': '2019-07-02 10:32:26'
      },
      'content': null,
      'version': 3,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490246',
      'parentName': 'dws_user_province',
      'leaf': true
    }, {
      'nodeId': 'n_3279192',
      'nodeName': 'dws_user_province_od002_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_province_od002_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_province_od002_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3279192',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3279192',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3279192',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3279192',
        'createTime': '2019-07-03 16:46:46',
        'lastModifiedTime': '2019-09-24 18:02:52'
      },
      'content': null,
      'version': 7,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490246',
      'parentName': 'dws_user_province',
      'leaf': true
    }, {
      'nodeId': 'n_3150494',
      'nodeName': 'dws_user_province_od003_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_province_od003_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_province_od003_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3150494',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3150494',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3150494',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3150494',
        'createTime': '2019-07-08 16:19:58',
        'lastModifiedTime': '2019-07-24 18:07:25'
      },
      'content': null,
      'version': 6,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490246',
      'parentName': 'dws_user_province',
      'leaf': true
    }, {
      'nodeId': 'n_3183111',
      'nodeName': 'dws_user_province_od004_v1',
      'nodeOutputNameList': ['cus_test_003.dws_user_province_od004_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.dws_user_province_od004_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3142591',
        'sourceNodeOutputName': 'cus_test_003.dim_user_core_od001_v1',
        'targetNodeId': 'n_3183111',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3183111',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3183111',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3183111',
        'createTime': '2019-07-08 16:19:58',
        'lastModifiedTime': '2019-07-24 18:07:24'
      },
      'content': null,
      'version': 9,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490246',
      'parentName': 'dws_user_province',
      'leaf': true
    }],
    'id': 30490246,
    'name': 'dws_user_province',
    'type': 18,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 4,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3142623',
      'nodeName': 'fct_house_pro_house_a_di_od000_v1',
      'nodeOutputNameList': ['cus_test_003.fct_house_pro_house_a_di_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.fct_house_pro_house_a_di_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': [{
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3252224',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3174685',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3143464',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3142623',
        'sourceNodeOutputName': 'cus_test_003.fct_house_pro_house_a_di_od000_v1',
        'targetNodeId': 'n_3252222',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_3384732',
        'sourceNodeOutputName': 'test_2',
        'targetNodeId': 'n_3142623',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3377288',
        'sourceNodeOutputName': 'area_province',
        'targetNodeId': 'n_3142623',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3304831',
        'sourceNodeOutputName': 'DWD_S_SRV_REQ',
        'targetNodeId': 'n_3142623',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3142623',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3142623',
        'createTime': '2019-06-25 11:22:17',
        'lastModifiedTime': '2019-08-28 14:55:50'
      },
      'content': null,
      'version': 4,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30490216',
      'parentName': 'fct_house_pro_house_a_di',
      'leaf': true
    }],
    'id': 30490216,
    'name': 'fct_house_pro_house_a_di',
    'type': 17,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3231824',
      'nodeName': 'fct_house_statistics_house_di_od000_v1',
      'nodeOutputNameList': ['cus_test_003.fct_house_statistics_house_di_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.fct_house_statistics_house_di_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': [{
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3231832',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3142602',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3143389',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3174590',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3183128',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3183111',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3150494',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3142592',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3143390',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3231824',
        'sourceNodeOutputName': 'cus_test_003.fct_house_statistics_house_di_od000_v1',
        'targetNodeId': 'n_3279192',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3231824',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3231824',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3231824',
        'createTime': '2019-06-24 16:53:36',
        'lastModifiedTime': '2019-07-05 15:20:19'
      },
      'content': null,
      'version': 4,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '30487548',
      'parentName': 'fct_house_statistics_house_di',
      'leaf': true
    }],
    'id': 30487548,
    'name': 'fct_house_statistics_house_di',
    'type': 17,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_919520990198235136',
      'nodeName': 'fct_res_person_20191106_di_od000_v1',
      'nodeOutputNameList': ['cus_test_003.fct_res_person_20191106_di_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.fct_res_person_20191106_di_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': null,
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_919520990198235136',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402',
        'environment': 'PROD'
      },
      'userInfo': {
        'entityId': 'n_919520990198235136',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_919520990198235136',
        'createTime': '2019-11-06 17:46:23',
        'lastModifiedTime': '2019-11-06 17:46:23'
      },
      'content': null,
      'version': 1,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '36541473',
      'parentName': 'fct_res_person_20191106_di',
      'leaf': true
    }],
    'id': 36541473,
    'name': 'fct_res_person_20191106_di',
    'type': 17,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }, {
    'children': [{
      'nodeId': 'n_3387368',
      'nodeName': 'fct_res_person_area_di_od000_v1',
      'nodeOutputNameList': ['cus_test_003.fct_res_person_area_di_od000_v1'],
      'nodeDesc': 'auto-created node for table cus_test_003.fct_res_person_area_di_od000_v1',
      'nodeType': 1,
      'operatorType': 25,
      'cronExpression': '00 00 00 * * ?',
      'dagId': 'd_1000000',
      'priority': 5,
      'downstreamNodeRelations': [{
        'sourceNodeId': 'n_3387368',
        'sourceNodeOutputName': 'cus_test_003.fct_res_person_area_di_od000_v1',
        'targetNodeId': 'n_3416872',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }, {
        'sourceNodeId': 'n_3387368',
        'sourceNodeOutputName': 'cus_test_003.fct_res_person_area_di_od000_v1',
        'targetNodeId': 'n_3644811',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'upstreamNodeRelations': [{
        'sourceNodeId': 'n_1000001',
        'sourceNodeOutputName': 'virtual_root_node_1000000',
        'targetNodeId': 'n_3387368',
        'targetNodeOutputName': null,
        'periodDiff': 0,
        'dayDiff': null
      }],
      'params': 'bizdate=${yyyyMMdd}',
      'dsConfig': {
        'dsId': '29412402'
      },
      'userInfo': {
        'entityId': 'n_3387368',
        'tenant': {
          'tenantId': '183454'
        },
        'project': {
          'projectId': '29412409',
          'projectName': 'cus_test_003(cus_test_003)',
          'modeEnum': 'BASIC',
          'projectType': 'GENERAL'
        },
        'creator': {
          'userId': '29414347',
          'userName': null
        },
        'owner': {
          'userId': '29414347',
          'userName': 'None(cus_test_003@dataphin)'
        },
        'modifier': {
          'userId': '29414347',
          'userName': null
        }
      },
      'timeInfo': {
        'entityId': 'n_3387368',
        'createTime': '2019-08-13 16:48:08',
        'lastModifiedTime': '2019-08-13 18:10:12'
      },
      'content': null,
      'version': 2,
      'nodeStatus': 1,
      'nodeFrom': 'onedata3-server',
      'tags': null,
      'statusCode': null,
      'countOfRun': null,
      'executeTimeEntity': null,
      'columns': null,
      'task': null,
      'downstreamLogicalNodeRelations': null,
      'upstreamLogicalNodeRelations': null,
      'parentId': '33842460',
      'parentName': 'fct_res_person_area_di',
      'leaf': true
    }],
    'id': 33842460,
    'name': 'fct_res_person_area_di',
    'type': 17,
    'gmtModified': null,
    'owner': null,
    'executeTimeEntity': null,
    'catalogId': null,
    'catalogName': 'LD_cus_test_003',
    'catalogType': 'BIZUNIT',
    'childrenCount': 1,
    'leaf': false
  }]
}
