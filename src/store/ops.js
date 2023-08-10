import storage from '@/libs/storage'

export default {
  namespaced: true,
  state() {
    return {
      activeComp: storage.get('ops/activeComp') || Object.create(null),
      activeNode: storage.get('ops/activeNode') || Object.create(null),
      activeDialogComp: null,
      splitWidth: '420px'
    }
  },
  getters: {
    activeComp(state) {
      return state.activeComp
    },
    activeNode(state) {
      return state.activeNode
    },
    splitWidth(state) {
      return state.splitWidth
    },
    activeDialogComp(state) {
      return state.activeDialogComp
    }
  },
  mutations: {
    SET_ACTIVE_COMP(state, payload) {
      state.activeComp = payload
      storage.set('ops/activeComp', payload)
    },
    SET_ACTIVE_NODE(state, payload) {
      state.activeNode = payload
      storage.set('ops/activeNode', payload)
    },
    SET_SPLIT_WIDTH(state, payload) {
      state.splitWidth = payload
    },
    SET_ACTIVE_DIALOG_COMP(state, payload) {
      state.activeDialogComp = payload
    }
  }
}
