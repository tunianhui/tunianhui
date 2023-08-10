export default {
  data() {
    return {
      curCheckedList: [],
      isToggle: true,
      style: {height: '46px', overflow: 'hidden'}
    }
  },
  methods: {
    myClickHandle(subitem, paritem) {
      paritem.options.forEach(e => {
        e.flag = false
      })
      let index = this.curCheckedList.findIndex(e => e.parid === paritem.id)
      if (index === -1) {
        this.curCheckedList.push({
          ...subitem,
          parid: paritem.id,
          pardes: paritem.des,
          options: paritem.options
        })
      } else {
        this.curCheckedList[index].value = subitem.value
        this.curCheckedList[index].des = subitem.des
      }
      subitem.flag = true
    },
    myCancelHanle(item) {
      item.flag = false
      let index = this.curCheckedList.findIndex(e => item.value === e.value)
      this.curCheckedList.splice(index, 1)
    },
    myCurDel(item) {
      let resArr = this.filterGroupList.filter(e => {
        return e.id === item.parid
      })
      let index = this.curCheckedList.findIndex(e => e.value === item.value)
      if (index !== -1) {
        this.curCheckedList.splice(index, 1)
      }
      if (resArr && resArr.length) {
        resArr[0].options.forEach(e => {
          e.flag = false
        })
      }
    }
  }
}
