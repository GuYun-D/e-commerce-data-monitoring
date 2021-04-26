export default class SocketService {
  /**
   * 单例设计模式
   */
  static instance = null

  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService
    }

    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null

  /**
       * 该方法得到后端传来的数据之后，要传给组件
       * 事先将图表组件的某一个方法存储在当前这个模块中
       * 一旦得到数据在调用此方法，将数据传给图表组件
       */
  // 存储回调函数
  callbackMapping = {}

  // 标识websocket是否连接成功了
  connected = false

  // 调用send方法的次数
  sendRetryCount = 0

  // 定义链接服务器的代码
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      return alert("你的浏览器不支持websocket")
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 连接成功事件
    this.ws.onopen = () => {
      console.log("连接服务成功");
      // 说明链接成功，将connected变回true
      this.connected = true
      // 连接成功将connectRetryCount置0
      this.connectRetryCount = 0
    }

    // 连接失败
    /**
     * closed事件的调用场景
     * - 连接服务器失败
     * - 当链接成功之后服务器关闭也会调用
     */
    this.ws.onclosed = () => {
      console.log("链接服务器失败");
      this.connected = false
    }

    // 得到服务端发送过来的数据
    this.ws.onmessage = msg => {
      console.log("服务端发送数据了");
      // 服务端发送过来的原始数据是在msg中的data
      // console.log(msg.data);

      // 将JSON字符串转化成对象
      const recvData = JSON.parse(msg.data)
      // 得到回调函数的标识
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callbackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          // 在后端处理时，getData是获取数据，所以recvData中有图表数据
          const realData = JSON.parse(recvData.data)
          // 调用回调函数，传递数据
          this.callbackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {

        } else if (action === 'themeChange') {

        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack(socketType, callBack) {
    this.callbackMapping[socketType] = callBack
  }

  // 回调函数的取消
  unregisterCallBack(socketType) {
    this.callbackMapping[socketType] = null
  }

  // 发送数据的方法
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount ++
      // 延时重新发送
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }
}
