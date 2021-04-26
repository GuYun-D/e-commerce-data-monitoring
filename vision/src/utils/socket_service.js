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

  // 存储回调函数
  callbackMapping = {}

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
    }

    // 连接失败
    this.ws.onclosed = () => {
      console.log("链接服务器失败");
    }

    // 得到服务端发送过来的数据
    this.ws.onmessage = msg => {
      console.log("服务端发送数据了");
      // 服务端发送过来的原始数据是在msg中的data
      // console.log(msg.data);

      /**
       * 该方法得到后端传来的数据之后，要传给组件
       * 事先将图表组件的某一个方法存储在当前这个模块中
       * 一旦得到数据在调用此方法，将数据传给图表组件
       */
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callBack){
    this.callbackMapping[socketType] = callBack
  }

  // 回调函数的取消
  unregisterCallBack (socketType){
    this.callbackMapping[socketType] = null
  }
}
