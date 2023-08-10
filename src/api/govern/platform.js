import fetch from '@/libs/fetch'
import { method } from 'lodash'

 
export function getItemCode(data = {}) {
    return fetch({
        url: '/resGover/itemMgt/getItemCode',
        method: 'get',
       params: data
    })
}

export function getScoreExplain(data = {}) {
    return fetch({
        url: '/resGover/workTable/getScoreExplain',
        method: 'get',
       params: data
    })
}

//
export function getDomainNum(data = {}) {
    return fetch({
        url: '/resGover/itemMgt/getDomainNum',
        method: 'get',
       params: data
    })
}

//
export function getObjectNum(data = {}) {
    return fetch({
        url: '/resGover/itemMgt/getObjectNum',
        method: 'get',
       params: data
    })
}

export function getItemNum(data = {}) {
    return fetch({
        url: '/resGover/itemMgt/getItemNum',
        method: 'get',
       params: data
    })
}

//下拉列表项目选择
export function getProject(data = {}) {
    return fetch({
        url: '/resGover/workTable/getProject',
        method: 'get',
       params: data
    })
}


//存储待治理项列表查询接口
export function getMyGoverSto(data = {}) {
    return fetch({
        url: '/resGover/workTable/getMyGoverSto',
        method: 'get',
       params: data
    })
}

///计算待治理项列表查询接口resGover/workTable/getMyGoverCom
export function getMyGoverCom(data = {}) {
    return fetch({
        url: '/resGover/workTable/getMyGoverCom',
        method: 'get',
       params: data
    })
}

//线下已治理
export function offlineDeal(data = {}) {
    return fetch({
        url: '/resGover/workTable/offlineDeal',
        method: 'post', 	
        need: true,
        data
    })
}

//状态选择
export function getSysdict(data= {}) {
    return fetch({
        url: '/resGover/comctrl/getSysdict',
        method: 'get',
       params: data
    })
}

//白名单设置
export function setItemWhite(data = {}) {
    return fetch({
        url: '/resGover/workTable/setItemWhite',
        method: 'post',
        need: true,
        data
    })
}

//申请drop表设置
export function dropTable(data = {}) {
    return fetch({
        url: '/resGover/workTable/dropTable',
        method: 'post', 	
        need: true,
        data
    })
}

//iceberg元数据优化
export function icebergMetaOptimize(data = {}) {
    return fetch({
        url: '/resGover/workTable/setLifeCycle',
        method: 'post', 	
        need: true,
        data
    })
}

//申请设置生命周期
export function setLifeCycle(data = {}) {
    return fetch({
        url: '/resGover/workTable/setLifeCycle',
        method: 'post', 	
        need: true,
        data
    })
}

// 获取转交责任人列表
export function getProjectMenList(data = {}) {
    return fetch({
        url: '/resGover/workTable/getProjectMenList',
        method: 'get',
       params: data
    })
}

//转交责任人
export function transferGoverName(data = {}) {
    return fetch({
        url: '/resGover/workTable/transferGoverName',
        method: 'post', 	
        need: true,
        data
    })
}

//iceberg数据优化提交接口
export function icebergDataOptimize(data = {}) {
    return fetch({
        url: '/resGover/workTable/icebergDataOptimize',
        method: 'post', 	
        need: true,
        data
    })
}

//治理项管理列表
export function getItemList(data = {}) {
    return fetch({
        url: '/resGover/gItems/getItemList',
        method: 'get',
       params: data
    })
}

// 激活失效接口
export function modifyItemState(data = {}) {
    return fetch({
        url: '/resGover/gItems/modifyItemState',
        method: 'post', 	
        need: true,
        data
    })
}

//回收站列表查询接口
export function getRecycleList(data = {}) {
    return fetch({
        url: '/resGover/recycle/getRecycleList',
        method: 'get',
        params: data
    })
}

// 治理项申请接口
export function applyOper(data = {}) {
    return fetch({
        url: '/resGover/workTable/applyOper',
        method: 'post', 	
        need: true,				//请求方式post 或 put请求
        data
    })
}

//治理项审批接口
export function approveOper(data = {}) {
    return fetch({
        url: '/resGover/workTable/approveOper',
        method: 'post',
        need: true,
        data
    })
}

//回收站清除接口
export function clearRecycle(data = {}) {
    return fetch ({
        url: '/resGover/recycle/clearRecycle',
        method: 'post', 	
        need: true,
        data
    })
}

//回收站恢复接口
export function recoverRecycle(data ={}) {
    return fetch({
        url: '/resGover/recycle/recoverRecycle',
        method: 'post', 	
        need: true,
        data
    })
}

//Hive分区治理按钮 /resGover/stoGovernMod/setPartitionsState
export function setPartitionsState(data = {}) {
    return fetch({
        url: '/resGover/stoGovernMod/setPartitionsState',
        method: 'get',
        params: data
    })
}