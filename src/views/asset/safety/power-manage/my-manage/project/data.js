export const filterList = {
  'traceId': '8c04afaed7725460',
  flag: true,
  'message': '',
  'data': [
    {
      'options': [
        {
          'detail': null,
          'des': 'LD_retail',
          'value': 'LD_retail',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev',
          'value': 'LD_demo_dev',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev1',
          'value': 'LD_demo_dev1',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev2',
          'value': 'LD_demo_dev2',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev3',
          'value': 'LD_demo_dev3',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev4',
          'value': 'LD_demo_dev4',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev5',
          'value': 'LD_demo_dev5',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev6',
          'value': 'LD_demo_dev6',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev7',
          'value': 'LD_demo_dev7',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev8',
          'value': 'LD_demo_dev8',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev9',
          'value': 'LD_demo_dev9',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev91',
          'value': 'LD_demo_dev91',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev92',
          'value': 'LD_demo_dev92',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev93',
          'value': 'LD_demo_dev93',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev94',
          'value': 'LD_demo_dev94',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev95',
          'value': 'LD_demo_dev95',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev96',
          'value': 'LD_demo_dev96',
          'count': null
        },
        {
          'detail': null,
          'des': 'LD_demo_dev97',
          'value': 'LD_demo_dev97',
          'count': null
        }
      ],
      'id': 'alertReason',
      'des': '业务板块',
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
