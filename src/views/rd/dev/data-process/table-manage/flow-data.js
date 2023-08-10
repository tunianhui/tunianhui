import {
  dimLogicRelationTypesMap,
  logicPkTypes,
  logicSystemTypes
} from '@/config/rd-config'

export function getRelationDatas(data) {
  const {relKeyData = {}, relAttrData = [], relDsData = {}} = data,
    temp = {
      attrData: [],
      primarykeyData: [],
      systemData: [],
      relationData: []
    }
  if (relKeyData.pk_id) {
    temp.primarykeyData.push({
      ...logicPkTypes,
      element_code: relKeyData.pk_code,
      element_name: relKeyData.pk_name,
      element_type: relKeyData.pk_type,
      element_id: relKeyData.pk_id,
      ...relKeyData
    })
  }

  if (relDsData.partition_name) {
    const name = relDsData.partition_name + '，' + relDsData.biz_data_value
    temp.systemData.push({
      ...logicSystemTypes,
      element_code: relDsData.partition_code,
      element_name: name,
      element_id: name,
      element_type: relDsData.data_type || 'string',
      ...relDsData
    })
  }

  relAttrData.forEach(item => {
    const d = dimLogicRelationTypesMap[item.relation_type]
    if (item.relation_type === '1') {
      temp.attrData.push({
        ...item,
        ...d
      })
    } else {
      temp.relationData.push({
        ...item,
        ...d
      })
    }
  })
  return temp
}
