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
      console.log(msg.data);
    }
  }
}
