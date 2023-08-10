export const filterList = {
  'traceId': '8c04afaed7725460',
  flag: true,
  'message': '',
  'data': [
    {
      'options': [
        {
          'detail': null,
          'des': '高',
          'value': 'height',
          'count': null
        },
        {
          'detail': null,
          'des': '中',
          'value': 'center',
          'count': null
        },
        {
          'detail': null,
          'des': '低',
          'value': 'low',
          'count': null
        }
      ],
      'id': 'quanxianGrade',
      'des': '权限等级',
      'filterChildren': null
    },
    {
      'options': [
        {
          'detail': null,
          'des': '期限',
          'value': 'term',
          'count': null
        },
        {
          'detail': null,
          'des': '长期',
          'value': 'longTrem',
          'count': null
        }
      ],
      'id': 'expiryDate',
      'des': '有效期',
      'filterChildren': null
    }
  ],
  'monitorLog': null
}

const fetchTest = (data, time = 500) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, time)
  })

export const getFilterList = fetchTest(filterList)
