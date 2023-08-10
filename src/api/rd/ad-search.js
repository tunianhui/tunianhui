import fetch from '@/libs/fetch'

const excuteData = {
  flag: true,
  data: {
    logs: [
      '2019-10-31 15:36:31 ---------------- voldemort task initiating ----------------',
      '2019-10-31 15:36:31 Task id: t_5000629_20191031_5000630',
      '2019-10-31 15:36:31 Task Type: TEMP',
      '2019-10-31 15:36:31 Taskrun id: tr_5000629_20191031_5000631',
      '2019-10-31 15:36:31 Taskrun priority is HIGH',
      '2019-10-31 15:36:31 Taskrun was due to execute at 2019-10-31 15:36:26',
      '2019-10-31 15:36:31 Taskrun delay time is: 5253ms',
      '2019-10-31 15:36:31 Current Taskrun has been dispatched to agent: ',
      '2019-10-31 15:36:31 Begin to execute SPARK_JAR_ON_MAX_COMPUTE task.',
      '2019-10-31 15:36:31 Current task status: RUNNING',
      '2019-10-31 15:36:31 --------------------------------',
      '2019-10-31 15:36:31 List of task parameters: ',
      '2019-10-31 15:36:31 taskid=t_5000629_20191031_5000630',
      '2019-10-31 15:36:31 --------------------------------',
      '2019-10-31 15:36:31 =================================================================',
      '[Following shell command will be executed]',
      '[NO CONTENT]',
      '----- Shell command logs are shown below -----',
      'FAILED: ArrayIndexOutOfBoundsException: 0',
      '2019-10-31 15:36:31 Shell command exit with code: 0',
      '2019-10-31 15:36:31 =================================================================',
      '2019-10-31 15:36:31 Current task status: FAILED',
      '2019-10-31 15:36:31 Elapsed time: 896.8 ms',
      '2019-10-31 15:36:31 ---------------- voldemort task ends ----------------'
    ],
    result: []
  }
}
const compileData = {
  flag: true,
  data: {
    status: 'Failed',
    tasks: [
      {
        physicalSql: null,
        status: 'Failed',
        startRow: 1,
        startCol: 1,
        message: 'SystemErrors.COLUMN_NOT_FOUND:Column Not Found: A'
      }
    ]
  }
}

const fetchTest = (data, time = 1000) => _ =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, time)
  })

export const excute = fetchTest(excuteData, 3000)
export const compile = fetchTest(compileData)
export const save = fetchTest({flag: true, msg: 'ok'})

// tree列表
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/list',
    method: 'post',
    data
  })
}

// 新建文件
export function getNewBuildFile(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/saveFile',
    method: 'post',
    data
  })
}

// 新建文件夹
export function getNewBuildFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/saveFolder',
    method: 'post',
    data
  })
}

// 编辑文件
export function getEditFile(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/saveFile',
    method: 'post',
    data
  })
}

// 删除文件
export function getDel(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/deleteFileOrFolder',
    method: 'post',
    data
  })
}

// 重命名文件/文件夹
export function getRename(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/renameFileOrFolder',
    method: 'post',
    data
  })
}

// 移动文件/文件夹
export function moveFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/moveFileOrFolder',
    method: 'post',
    data
  })
}

// 文件内容查询
export function getQueryFileContent(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/queryFileById',
    method: 'post',
    data
  })
}

// 文件内容保存
export function getEditFileContent(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/editFile',
    method: 'post',
    data
  })
}

// 预编译
export function getAdHocQueryCheck(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/adHocQueryCheck',
    method: 'post',
    data
  })
}

// 即席查询
export function getExecute(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/adHocQuery',
    method: 'post',
    data
  })
}
// 数据联想接口
export function automaticPromptInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelAdHocQuery/automaticPromptInfo',
    method: 'post',
    data
  })
}
