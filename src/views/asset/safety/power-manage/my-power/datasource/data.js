export const filterList = {
  traceId: '8c04afaed7725460',
  flag: true,
  message: '',
  data: [
    {
      options: [
        {
          detail: null,
          des: '同步读',
          value: 'syncread',
          count: null
        },
        {
          detail: null,
          des: '同步写',
          value: 'syncwrite',
          count: null
        }
      ],
      id: 'quanxianType',
      des: '权限类型',
      filterChildren: null
    },
    {
      options: [
        {
          detail: null,
          des: '个人账号',
          value: 'gr_num',
          count: null
        },
        {
          detail: null,
          des: '生产账号',
          value: 'dev_num',
          count: null
        }
      ],
      id: 'alertType',
      des: '权限账号',
      filterChildren: null
    }
  ],
  monitorLog: null
}

const fetchTest = (data, time = 500) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, time)
  })

export const getFilterList = fetchTest(filterList)
