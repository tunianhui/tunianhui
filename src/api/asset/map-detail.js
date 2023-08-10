
const datalist = [
  {
    id: 1,
    table_type: 17,
    is_collect: 0,
    cube_code: 'dolor ea ex Lorem',
    cube_name: '',
    oper_user: 'poc-02@dataphin',
    create_time: '2019-10-10',
    desc: '',
    collect_num: 100,
    read_num: 50,
    storage_num: 0,
    ddl_change: '2019-05-12 17:48:36',
    updata_data: '',
    lately_visit: ''
  },
  {
    id: 2,
    table_type: 16,
    is_collect: 0,
    cube_code: 'dolor ea ex Lorem',
    cube_name: '',
    oper_user: 'poc-02@dataphin',
    create_time: '2019-10-10',
    desc: '',
    collect_num: 100,
    read_num: 50,
    storage_num: 0,
    ddl_change: '2019-05-12 17:48:36',
    updata_data: '',
    lately_visit: ''
  },
  {
    id: 3,
    table_type: 18,
    is_collect: 0,
    cube_code: 'dolor ea ex Lorem',
    cube_name: '',
    oper_user: 'poc-02@dataphin',
    create_time: '2019-10-10',
    desc: '',
    collect_num: 100,
    read_num: 50,
    storage_num: 0,
    ddl_change: '2019-05-12 17:48:36',
    updata_data: '',
    lately_visit: ''
  },
  {
    id: 4,
    table_type: 100,
    is_collect: 0,
    cube_code: 'dolor ea ex Lorem',
    cube_name: '',
    oper_user: 'poc-02@dataphin',
    create_time: '2019-10-10',
    desc: '',
    collect_num: 100,
    read_num: 50,
    storage_num: 0,
    ddl_change: '2019-05-12 17:48:36',
    updata_data: '',
    lately_visit: ''
  }
]

const tableInfo = [
  {
    id: 1,
    major_key: 1,
    en_name: 'abcd1',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 10,
    zone_field: 1
  },
  {
    id: 2,
    major_key: 0,
    en_name: 'abcd2',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 50,
    zone_field: 0
  },
  {
    id: 3,
    major_key: 1,
    en_name: 'abcd3',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 60,
    zone_field: 1
  },
  {
    id: 4,
    major_key: 0,
    en_name: 'abcd4',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 40,
    zone_field: 0
  },
  {
    id: 5,
    major_key: 1,
    en_name: 'abcd5',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 81,
    zone_field: 1
  },
  {
    id: 1,
    major_key: 1,
    en_name: 'abcd6',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 80,
    zone_field: 0
  },
  {
    id: 6,
    major_key: 0,
    en_name: 'abcd7',
    zh_name: '中文名',
    data_type: 'bigdata',
    heat: 80,
    zone_field: 1
  }
]

const zoneDetail = [
  {
    id: 1,
    zone: 'zone',
    record_num: 12,
    updata_date: '2019-10-19',
    create_time: '2019-11-11'
  },
  {
    id: 2,
    zone: 'zone1',
    record_num: 12,
    updata_date: '2019-10-19',
    create_time: '2019-11-11'
  },
  {
    id: 4,
    zone: 'zone2',
    record_num: 12,
    updata_date: '2019-10-19',
    create_time: '2019-11-11'
  }
]

const dataSearch = {
  district_value: '',
  section_value: '',
  tableData: [
    {
      primaryKey: '12',
      value: '2',
      index: '1'
    }
  ]
}

// function random(min, max) {
//   return Math.floor(Math.random() * (max - min)) + min
// }

// const fetchTest = (data, min = 0, max = 0, time = 1000) => _ =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({
//         flag: true,
//         data: data[random(min, max)]
//       })
//     }, time)
//   })

const fetchTest1 = (data, time = 1000) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        flag: true,
        data: data
      })
    }, time)
  })
const fetchTest2 = (data, time = 1000) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        flag: true,
        data: data,
        total: 10000
      })
    }, time)
  })
// export const getBasicInfo = fetchTest(datalist, 0, 4)
export function getBasicInfo(params) {
  return new Promise((resolve, reject) => {
    let data = datalist.filter(e => {
      return params.table_type === e.table_type
    })
    setTimeout(() => {
      resolve({
        flag: true,
        data: data[0]
      })
    }, 500)
  })
}
export const getTableInfo = fetchTest1(tableInfo)
export const getZoneDetail = fetchTest2(zoneDetail)
export const getDataSearch = fetchTest2(dataSearch)
