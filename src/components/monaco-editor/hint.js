export default {
  flag: true,
  data: {
    dbs: [
      {
        db_name: 'db_test1',
        tables: [
          {
            table_name: 'dim_province',
            table_desc: '维度逻辑表',
            columns: [
              {
                element_code: 'province_code',
                element_desc: '维度逻辑表字段'
              },
              {
                element_code: 'city_name',
                element_desc: '维度逻辑表字段'
              }
            ]
          },
          {
            table_name: 'fact_dim_province',
            table_desc: '事实逻辑表',
            columns: [
              {
                element_code: 'fact_province_code',
                element_desc: '事实逻辑表字段'
              },
              {
                element_code: 'tac_city_name',
                element_desc: '事实逻辑表字段'
              }
            ]
          },
          {
            table_name: 'dim_user',
            table_desc: '维度逻辑表',
            columns: [
              {
                element_code: 'province_code',
                element_desc: '维度逻辑表字段'
              },
              {
                element_code: 'city_code',
                element_desc: '维度逻辑表字段'
              }
            ]
          },
          {
            table_name: 'user_plo',
            table_desc: '汇总逻辑表',
            columns: [
              {
                element_code: 'user_plo_code',
                element_desc: '汇总逻辑表字段'
              },
              {
                element_code: 'user_plo_city',
                element_desc: '汇总逻辑表字段'
              }
            ]
          }
        ]
      },
      {
        db_name: 'db_test2',
        tables: [
          {
            table_name: 'dim_providim_enterprise_lynce',
            table_desc: '事实逻辑表',
            columns: [
              {
                element_code: 'enterprise_name',
                element_desc: '事实逻辑表字段'
              },
              {
                element_code: 'ly',
                element_desc: '事实逻辑表字段'
              }
            ]
          },
          {
            table_name: 'dim_enterprise',
            table_desc: '事实逻辑表',
            columns: [
              {
                element_code: 'province_code',
                element_desc: '事实逻辑表字段'
              },
              {
                element_code: 'city_code',
                element_desc: '事实逻辑表字段'
              }
            ]
          }
        ]
      },
      {
        tables: [
          {
            columns: [
              {
                element_desc: '物理表字段',
                element_code: 'enterprise_id'
              },
              {
                element_desc: '物理表字段',
                element_code: 'enterprise_name'
              },
              {
                element_desc: '物理表字段',
                element_code: 'enterprise_add'
              },
              {
                element_desc: '物理表字段',
                element_code: 'ds'
              }
            ],
            table_name: 't_dm_enterprise',
            table_desc: '物理表'
          }
        ],
        db_name: 'test1'
      }
    ],
    functions: ['CAST', 'SUBSTR', 'TRIM'],
    keywords: ['ABS', 'BIN'],
    constants: ['UUID', 'UCASE']
  }
}
