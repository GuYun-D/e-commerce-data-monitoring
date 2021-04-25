const Websocket = require('ws')
const path = require('path')
const fileUtils = require('../utils/files_utils')

const wss = new Websocket.Server({
  port: 9998
})

// 相当于服务端开启了监听
module.exports.listen = () => {
  wss.on('connection', client => {
    console.log("有客户连接成功.........................................");
    client.on('message', async msg => {
      console.log("客户端发送数据给客户端了：" + msg);
      // 前端传来的是字符串，将他转化成对象
      let payLoad = JSON.parse(msg)
      // 获取参数中的action，并做判断
      const action = payLoad.action
      if(action === 'getData'){
        // 拼接路径
        let filePath = '../data/' + payLoad.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        // 读取文件内容
        const ret = await fileUtils.getFilesJsonData(filePath)
        // 在服务端获取到的数据的基础上添加data字段
        payLoad.data = ret
        client.send(JSON.stringify(payLoad))
      }else {
        // 原封不动的将所接收到的数据转发给每一个处于连接状态的用户
        // wss.client 所有链接的用户
        wss.clients.forEach(item => {
          client.send(msg)
        });
      }

      client.send("hello socket from backend")
    })
  })
}

