/*
 * @Author: 大炸鹅
 * @Date: 2023-07-31 16:10:01
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-08-08 17:41:25
 * @FilePath: \智能数据构建\src\views\management\datasourceManage\datasource\config.js
 */
export const dataSourceTypeList = [
  {
    id: '大数据存储',
    name: '大数据存储',
    children: [
      {
        id: 'MaxCompute',
        name: 'MaxCompute',
        scene: '离线集成、实时研发、全域质量',
        color: 'rgb(0, 193, 222)',
        icon: 'iconfont icon-MaxCompute',
        img: require('@/assets/images/1max/1_MaxCompute.png')
      },
      {
        id: 'Hologres',
        name: 'Hologres',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(70, 140, 255)',
        icon: 'iconfont',
        img: require('@/assets/images/1max/2_Hologres.png')
      },
      {
        id: 'IMPALA',
        name: 'IMPALA',
        scene: '离线集成、数据服务',
        color: 'rgb(0, 193, 222)',
        icon: 'iconfont icon-Impala',
        img: require('@/assets/images/1max/3_IMPALA.png')
      },
      {
        id: 'StarRocks',
        name: 'StarRocks',
        scene: '离线集成、实时研发',
        color: 'rgb(0, 193, 222)',
        icon: 'iconfont icon-StarRocks',
        img: require('@/assets/images/1max/4_StarRocks.png')
      },
      {
        id: 'Hudi',
        name: 'Hudi',
        scene: '实时研发',
        color: 'rgb(0, 193, 222)',
        icon: 'iconfont',
        img: require('@/assets/images/1max/5_Hudi.png')
      },
      {
        id: 'Doris',
        name: 'Doris',
        scene: '实时研发',
        color: 'rgb(0, 193, 222)',
        icon: 'iconfont icon-Doris',
        img: require('@/assets/images/1max/6_Doris.png')
      },
      {
        id: 'GreenPlum',
        name: 'GreenPlum',
        scene: '离线集成',
        color: 'rgb(43, 193, 72)',
        icon: 'iconfont icon-GreenPlum2',
        img: require('@/assets/images/1max/7_GreenPlum.png')
      },
      {
        id: 'Hive',
        name: 'Hive',
        scene: '离线集成',
        color: 'rgb(70, 140, 255)',
        icon: '',
        img: require('@/assets/images/1max/8_HIVE.png')
      }
    ]
  },
  {
    id: '消息队列',
    name: '消息队列',
    children: [
      {
        id: 'Log_Service',
        name: 'Log Service',
        scene: '离线集成、实时研发',
        color: 'rgb(0, 193, 222)',
        icon: '',
        img: require('@/assets/images/2queue/1_LogService.png')
      },
      {
        id: 'Kafka',
        name: 'Kafka',
        scene: '离线集成、实时研发',
        color: 'rgb(70, 70, 70)',
        icon: '',
        img: require('@/assets/images/2queue/2_Kafka.png')
      },
      {
        id: 'RocketMQ',
        name: 'RocketMQ',
        scene: '实时研发',
        color: 'rgb(0, 193, 222)',
        icon: '',
        img: require('@/assets/images/2queue/3_RocketMQ.png')
      },
      {
        id: 'DataHub',
        name: 'DataHub',
        scene: '离线集成、实时研发',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/2queue/4_DataHub.png')
      },
      {
        id: 'Pulsar',
        name: 'Pulsar',
        scene: '离线集成、实时研发',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/2queue/5_PULSAR.png')
      }
    ]
  },
  {
    id: '关系型数据库',
    name: '关系型数据库',
    children: [
      {
        id: 'PolarDB',
        name: 'PolarDB',
        scene: '离线集成',
        color: 'rgb(0, 193, 222)',
        icon: '',
        img: require('@/assets/images/3sql/1_PolarDB.png')
      },
      {
        id: 'PolarDB-X(原DRDS)',
        name: 'PolarDB-X(原DRDS)',
        scene: '离线集成、实时研发',
        color: 'rgb(0, 193, 222)',
        icon: '',
        img: require('@/assets/images/3sql/2_PolarDB-X.png')
      },
      {
        id: 'MySQL',
        name: 'MySQL',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(255, 147, 22)',
        icon: 'iconfont icon-mysql',
        img: require('@/assets/images/3sql/3_MySQL.png')
      },
      {
        id: 'SAP_HANA',
        name: 'SAP HANA',
        scene: '离线集成、全域质量',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/4_SAPHANA.png')
      },
      {
        id: 'Microsoft_SQL_Server',
        name: 'Microsoft SQL Server',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(230, 67, 67)',
        icon: '',
        img: require('@/assets/images/3sql/5_MicrosoftSQLServer.png')
      },
      {
        id: 'PostgreSQL',
        name: 'PostgreSQL',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/6_PostgreSQL.png')
      },
      {
        id: 'AnalyticDB_for_MySQL2.0',
        name: 'AnalyticDB for MySQL 2.0',
        scene: '离线集成、实时研发、数据服务',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/7_AnalyticDBforMySQL2.png')
      },
      {
        id: 'AnalyticDB_for_MySQL3.0',
        name: 'AnalyticDB for MySQL 3.0',
        scene: '离线集成、实时研发、数据服务',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/8_AnalyticDBforMySQL3.png')
      },
      {
        id: 'AnalyticDB_for_PostgreSQL',
        name: 'AnalyticDB for PostgreSQL',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/9_AnalyticDBforPostgreSQL.png')
      },
      {
        id: 'OceanBase',
        name: 'OceanBase',
        scene: '离线集成、实时研发',
        color: 'rgb(0, 193, 222)',
        icon: '',
        img: require('@/assets/images/3sql/10_OceanBase.png')
      },
      {
        id: 'Oracle',
        name: 'Oracle',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(230, 67, 67)',
        icon: '',
        img: require('@/assets/images/3sql/11_Oracle.png')
      },
      {
        id: 'Vertica',
        name: 'Vertica',
        scene: '离线集成、实时研发、数据服务、全域质量',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/12_Vertica.png')
      },
      {
        id: 'IBMDB2',
        name: 'IBM DB2',
        scene: '离线集成、全域质量',
        color: 'rgb(43, 193, 72)',
        icon: '',
        img: require('@/assets/images/3sql/13_IBMDB2.png')
      },
      {
        id: 'Teradata',
        name: 'Teradata',
        scene: '离线集成',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/3sql/14_Teradata.png')
      },
      {
        id: 'ClickHouse',
        name: 'ClickHouse',
        scene: '离线集成、全域质量',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/15_ClickHouse.png')
      },
      {
        id: 'DM',
        name: 'DM',
        scene: '离线集成、全域质量',
        color: 'rgb(28, 34, 134)',
        icon: '',
        img: require('@/assets/images/3sql/16_DM.png')
      },
      {
        id: 'GBase_8a',
        name: 'GBase 8a',
        scene: '离线集成',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/3sql/17_GBase8a.png')
      },
      {
        id: 'KingbaseES',
        name: 'KingbaseES',
        scene: '离线集成',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/3sql/18_KingbaseES.png')
      },
      {
        id: 'TiDB',
        name: 'TiDB',
        scene: '离线集成、实时研发',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/3sql/19_TiDB.png')
      },
      {
        id: 'GoldenDB',
        name: 'GoldenDB',
        scene: '离线集成',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/3sql/20_GoldenDB.png')
      },
      {
        id: 'openGauss',
        name: 'openGauss',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/21_openGauss.png')
      },
      {
        id: 'Sybase',
        name: 'Sybase',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/3sql/22_sybase.png')
      },
    ]
  },
  {
    id: '文件',
    name: '文件',
    children: [
      {
        id: 'FTP',
        name: 'FTP',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/4file/1_FTP.png')
      },
      {
        id: 'OSS',
        name: 'OSS',
        scene: '离线集成',
        color: 'rgb(43, 193, 72)',
        icon: '',
        img: require('@/assets/images/4file/2_OSS.png')
      },
    ]
  },
  {
    id: 'NoSQL',
    name: 'NoSQL',
    children: [
      {
        id: 'Elasticsearch',
        name: 'Elasticsearch',
        scene: '离线集成、实时研发、数据服务',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/5nosql/1_Elasticsearch.png')
      },
      {
        id: 'MongoDB',
        name: 'MongoDB',
        scene: '离线集成、实时研发、数据服务',
        color: 'rgb(43, 193, 72)',
        icon: '',
        img: require('@/assets/images/5nosql/2_MongoDB.png')
      },
      {
        id: 'Tablestore',
        name: 'Tablestore',
        scene: '离线集成、实时研发',
        color: 'rgb(70, 140, 255)',
        icon: '',
        img: require('@/assets/images/5nosql/3_Tablestore.png')
      },
      {
        id: 'HBase',
        name: 'HBase',
        scene: '实时研发',
        color: 'rgb(255, 106, 0)',
        icon: '',
        img: require('@/assets/images/5nosql/4_AliyunHBase.png')
      },
      {
        id: 'Redis',
        name: 'Redis',
        scene: '实时研发、离线集成',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/5nosql/5_Redis.png')
      },
      {
        id: 'lindorm(宽表)',
        name: 'lindorm(宽表)',
        scene: '离线集成、实时研发',
        color: 'rgb(255, 147, 22)',
        icon: '',
        img: require('@/assets/images/5nosql/6_lindorm.png')
      },
    ]
  },
  {
    id: '半结构化存储',
    name: '半结构化存储',
    children: [
      {
        id: 'API',
        name: 'API',
        scene: '离线集成',
        color: 'rgb(15, 175, 201)',
        icon: '',
        img: require('@/assets/images/6semi/1_API.png')
      },
      {
        id: 'SAP_TABLE',
        name: 'SAP TABLE',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/6semi/2_SAPTABLE.png')
      },
      {
        id: 'Hdfs',
        name: 'Hdfs',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/6semi/3_HDFS.png')
      },
      {
        id: 'Iceberg',
        name: 'Iceberg',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/6semi/4_ICEBERG.png')
      },
      {
        id: 'ceph',
        name: 'ceph',
        scene: '离线集成',
        color: 'rgb(65, 174, 255)',
        icon: '',
        img: require('@/assets/images/6semi/5_ceph.png')
      }
    ]
  }
]
