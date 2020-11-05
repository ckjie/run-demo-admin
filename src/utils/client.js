
import Utils from './utils'
const OSS = require('ali-oss')

export default {

  randomString(num) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let res = ''
    for (let i = 0; i < num; i++) {
      var id = Math.ceil(Math.random() * 35)
      res += chars[id]
    }
    return res
  },

  createOssClient() {
    return new Promise((resolve, reject) => {
      const client = new OSS({
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAI4GCE1QbxNta7kgUd2iRG',
        accessKeySecret: '0z4rNwqkCXnqMa622D0UoBRMY9bw7a',
        bucket: 'it-demo'
      })
      resolve(client)
    })
  },

  async ossUploadFile(option) {
    const file = option.file
    const self = this
    return new Promise((resolve, reject) => {
      const date = Utils.dateFormat(new Date(), 'yyyyMMdd') // 当前时间
      const dateTime = Utils.dateFormat(new Date(), 'yyyyMMddhhmmss') // 当前时间
      const randomStr = self.randomString(4)//  4位随机字符串
      const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
      const fileName = 'images/' + date + '/' + dateTime + '_' + randomStr + extensionName // 文件名字（相对于根目录的路径 + 文件名）
      // 执行上传
      // 简单上传
      self.createOssClient().then(client => {
        async function putObject() {
          try {
            const result = await client.put(fileName, file)
            option.onSuccess(result)
            resolve(result)
          } catch (e) {
            console.log(e, 'e')
            option.onError('上传失败')
            reject(e)
          }
        }
        putObject()
      })
      // 分片上传
      // self.createOssClient().then(client => {
      //   // 异步上传,返回数据
      //   // resolve({
      //   //   fileName: file.name,
      //   //   fileUrl: store.getters.ossHost + fileName
      //   // })
      //   // 上传处理
      //   // 分片上传文件
      //   client.multipartUpload(fileName, file, {
      //     progress: function (p) {
      //       let e = {}
      //       e.percent = Math.floor(p * 100)
      //       // console.log('Progress: ' + p)
      //       option.onProgress(e)
      //     }
      //   }).then((val) => {
      //     // console.info(val)
      //     if (val.res.statusCode === 200) {
      //       console.log(val.res.requestUrls, 'vvv')
      //       option.onSuccess(val)
      //       return val
      //     } else {
      //       option.onError('上传失败')
      //     }
      //   }, err => {
      //     option.onError('上传失败')
      //     reject(err)
      //   })
      // })
    })
  }
}
