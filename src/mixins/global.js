import {mapGetters, mapActions} from 'vuex'

import CryptoJS from 'crypto-js/crypto-js'
import config from '@/config'
const KEY = CryptoJS.enc.Utf8.parse('act-telecom.com1')

export default {
  // inheritAttrs: false,
  computed: {
    ...mapGetters([
      'dics',
      'metadata',
      'btnAuths'
      // 'project'
    ]),
    btnIdPrefix() {
      const matched = this.$route.matched,
        separator = '-'
      return (
        matched
          .slice(1)
          .map(item => item.meta.name)
          .join(separator) + separator
      )
    }
  },
  data() {
    return {
      baseURL: config.baseurl,
      isSqlEncrypt: true
    }
  },
  created() {
    // console.log(config)
    if (this.$store) {
      !Object.keys(this.dics).length && this.getDicsData()
      // 放在 router/routes.js 中获取
      // !this.metadata.length && this.getMetadata()
    }
  },
  methods: {
    ...mapActions(['getDicsData', 'getMetadata']),
    getBtnStatus(id) {
      return this.btnAuths[id] || false
    },
    getDicsValue(dicsKey, keyValue) {
      return (
        this.dics[dicsKey] &&
        (this.dics[dicsKey].find(d => d.key === keyValue) || {}).value
      )
    },
    globalLoading(text = '提交中...') {
      let loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, .7)',
        customClass: 'global-loading'
      })
      return loading
    },
    encrypt(word) {
      if (!this.isSqlEncrypt) return word
      if (!word) return ''
      let key = KEY

      let srcs = CryptoJS.enc.Utf8.parse(word)
      let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.toString()
    },
    decrypt(word) {
      if (!this.isSqlEncrypt) return word
      if (!word) return ''
      let key = KEY
      let encryptedHexStr = CryptoJS.enc.Base64.parse(word)
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
      let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
      return decryptedStr.toString()
    }
  }
}
