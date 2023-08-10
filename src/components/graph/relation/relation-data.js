export const initData = {
  flag: true,
  data: {
    modelType: 4,
    modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.s_od_trade',
    bizUnitName: null,
    tableOwner: 'hdl超管(hdl_super_user@dataphin)',
    nodeId: null,
    directUpStreamTableCount: 1,
    directDownStreamTableCount: 21,
    upStreamTableList: [
      {
        tableName: 's_od_dlt_trade',
        modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.s_od_dlt_trade',
        columnNameList: [],
        tempTable: false,
        modelType: 4,
        envType: null
      }
    ],
    // downStreamTableList: []
    downStreamTableList: [
      {
        tableName: 'FCT_BUSINESS_MM_DI',
        modelId: 'LD_hdl_zl.FCT_BUSINESS_MM_DI',
        columnNameList: [
          'V'
          // 'QUANTITY',
          // 'BID_PRICE',
          // 'TRADE_PRICE',
          // 'FEE',
          // 'COMMISSION',
          // 'TAX',
          // 'TRADE_ID',
          // 'STATUS_TYPE_ID',
          // 'TRADE_TYPE_ID',
          // 'CASH_FLAG',
          // 'SECURITY_SYMBOL',
          // 'ACCOUNT_ID',
          // 'EXECUTED_BY',
          // 'CREATE_DATE',
          // 'CREATE_TIME',
          // 'QUANTITY',
          // 'BID_PRICE',
          // 'TRADE_PRICE',
          // 'FEE',
          // 'COMMISSION',
          // 'TAX',
          // 'TRADE_ID',
          // 'STATUS_TYPE_ID',
          // 'TRADE_TYPE_ID',
          // 'CASH_FLAG',
          // 'SECURITY_SYMBOL',
          // 'ACCOUNT_ID',
          // 'EXECUTED_BY',
          // 'CREATE_DATE',
          // 'CREATE_TIME'
        ],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'FCT_TRADE_CREATE_DI',
        modelId: 'LD_demo.FCT_TRADE_CREATE_DI',
        columnNameList: [
          'QUANTITY',
          'BID_PRICE',
          'TRADE_PRICE',
          'FEE',
          'COMMISSION',
          'TAX',
          'TRADE_ID',
          'STATUS_TYPE_ID',
          'TRADE_TYPE_ID',
          'CASH_FLAG',
          'SECURITY_SYMBOL',
          'ACCOUNT_ID',
          'EXECUTED_BY',
          'CREATE_DATE',
          'CREATE_TIME'
        ],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'FCT_SECURITY_HOLD_CHANGE_DI',
        modelId: 'LD_demo.FCT_SECURITY_HOLD_CHANGE_DI',
        columnNameList: [
          'SECURITY_SYMBOL',
          'ACCOUNT_ID',
          'CLOSE_DATE_ID',
          'CLOSE_TIME_ID',
          'CURRENT_PRICE'
        ],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'DIM_DON',
        modelId: 'LD_hdl_zl.DIM_DON',
        columnNameList: ['ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'FCT_BUSINESS_ERROR_TEST_DI',
        modelId: 'LD_hdl_zl.FCT_BUSINESS_ERROR_TEST_DI',
        columnNameList: ['AGENCYID'],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'DIM_BBB',
        modelId: 'LD_retail.DIM_BBB',
        columnNameList: ['BBB_ID', 'T_QTY', 'T_S_SYMB', 'T_BID_PRICE'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_ZL_LOG',
        modelId: 'LD_retail.DIM_ZL_LOG',
        columnNameList: ['T_DTS', 'LOGDFS_ID', 'T_ST_ID', 'T_TT_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'retail_kkk_mid',
        modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.retail_kkk_mid',
        columnNameList: [],
        tempTable: false,
        modelType: 4,
        envType: null
      },
      {
        tableName: 'DIM_AA_EXT',
        modelId: 'LD_retail.DIM_AA_EXT',
        columnNameList: ['A_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_AOA',
        modelId: 'LD_retail.DIM_AOA',
        columnNameList: ['AAA_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_AAA',
        modelId: 'LD_retail.DIM_AAA',
        columnNameList: ['A_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_FA',
        modelId: 'LD_demo.DIM_FA',
        columnNameList: ['ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_BALL',
        modelId: 'LD_hdl_zl.DIM_BALL',
        columnNameList: ['ID', 'T_QTY', 'T_S_SYMB', 'T_BID_PRICE'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_ERROR_LOG',
        modelId: 'LD_retail.DIM_ERROR_LOG',
        columnNameList: ['ERROR_LOG_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'FCT_TRADE_CREATE_DF',
        modelId: 'LD_retail.FCT_TRADE_CREATE_DF',
        columnNameList: ['T_DTS', 'T_TT_ID', 'T_ST_ID', 'DF_ID'],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'retail_dim_ddd_mid',
        modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.retail_dim_ddd_mid',
        columnNameList: [],
        tempTable: false,
        modelType: 4,
        envType: null
      },
      {
        tableName: 'retail_dim_mod_mid',
        modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.retail_dim_mod_mid',
        columnNameList: [],
        tempTable: false,
        modelType: 4,
        envType: null
      },
      {
        tableName: 'DIM_EXT_BBB',
        modelId: 'LD_retail.DIM_EXT_BBB',
        columnNameList: ['EXT_BBB_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'FCT_FDSS_FOSS_DI',
        modelId: 'LD_retail.FCT_FDSS_FOSS_DI',
        columnNameList: ['T_ID', 'T_DTS', 'T_ST_ID', 'T_CREATE', 'T_TT_ID'],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'FCT_TRADE_CREATE_NOV_DI',
        modelId: 'LD_retail.FCT_TRADE_CREATE_NOV_DI',
        columnNameList: [
          'T_CLOSE',
          'T_TAX',
          'T_ID',
          'T_DTS',
          'T_ST_ID',
          'T_TT_ID'
        ],
        tempTable: false,
        modelType: 2,
        envType: null
      },
      {
        tableName: 'DIM_ACCOUNT',
        modelId: 'LD_retail.DIM_ACCOUNT',
        columnNameList: ['T_ST_ID', 'T_ID', 'T_DTS'],
        tempTable: false,
        modelType: 1,
        envType: null
      }
    ],
    envType: 'PROD'
  },
  monitorLog: null
}

export const nextRelationData = {
  flag: true,
  message: '',
  data: {
    modelType: 4,
    modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.retail_dim_ddd_mid',
    bizUnitName: null,
    tableOwner: 'hdl超管(hdl_super_user@dataphin)',
    nodeId: 'n_1022040',
    directUpStreamTableCount: 1,
    directDownStreamTableCount: 6,
    upStreamTableList: [
      {
        tableName: 's_od_trade',
        modelId: '794eb791143a248b1e0dd6891009a7f5.hdl.s_od_trade',
        columnNameList: [],
        tempTable: false,
        modelType: 4,
        envType: null
      }
    ],
    downStreamTableList: [
      {
        tableName: 'DIM_DDD',
        modelId: 'LD_retail.DIM_DDD',
        columnNameList: [
          'D_NAME',
          'D_LVL1_ID',
          'D_LVL4_ID',
          'D_LVL3_ID',
          'IS_LEAF',
          'D_ID',
          'D_LVL2_ID'
        ],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_DDD_LVL2',
        modelId: 'LD_retail.DIM_DDD_LVL2',
        columnNameList: ['D_LVL1_ID', 'D_LVL2_NAME', 'D_LVL2_ID'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_DDD_LVL1',
        modelId: 'LD_retail.DIM_DDD_LVL1',
        columnNameList: ['D_LVL1_ID', 'D_LVL1_NAME'],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_DDD_LVL4',
        modelId: 'LD_retail.DIM_DDD_LVL4',
        columnNameList: [
          'D_LVL1_ID',
          'D_LVL2_ID',
          'D_LVL3_ID',
          'D_LVL4_NAME',
          'D_LVL4_ID'
        ],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_DDD_LEAF',
        modelId: 'LD_retail.DIM_DDD_LEAF',
        columnNameList: [
          'D_LVL4_ID',
          'D_LVL2_ID',
          'D_LVL1_ID',
          'D_LEAF_NAME',
          'D_LVL3_ID',
          'D_LEAF_ID'
        ],
        tempTable: false,
        modelType: 1,
        envType: null
      },
      {
        tableName: 'DIM_DDD_LVL3',
        modelId: 'LD_retail.DIM_DDD_LVL3',
        columnNameList: ['D_LVL1_ID', 'D_LVL2_ID', 'D_LVL3_ID', 'D_LVL3_NAME'],
        tempTable: false,
        modelType: 1,
        envType: null
      }
    ],
    envType: 'PROD'
  }
}
