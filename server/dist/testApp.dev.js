"use strict";

var koa = require("koa"); // 创建koa对象


var app = new koa();
/**
 * 编写响应函数（中间件）
 * ctx: 上下文，web容器
 *          ctx.request 请求对象
 *          ctx.response 响应对象
 * next：下一个中间件
 */
// app.use((ctx, next) => {
//     console.log(ctx.request.url);
//     ctx.response.body = "hello world"
// })

/**
 * 总耗时中间件，第一层中间件
 */

var respDurationMiddleware = require("./middleware/koa_respones_duration");

app.use(respDurationMiddleware);
/**
 * 响应头中间件
 * 第二层中间件
 * 获取mime类型
 *      application/json
 * 响应头设置
 *      Content-Type: application/json;charset=UTF-8
 */

var respHeaderMiddleware = require("./middleware/koa_respones_header");

app.use(respHeaderMiddleware);
/**
 * 业务逻辑中间件
 * 第三层中间件
 * 读取文件内容 http: //localhost: 3000/api/seller
 *             获取请求的路径，拼接文件路径
 *              获取文件内容
 * 设置响应体
 *  ctx.response.body
 */

var respDatarMiddleware = require("./middleware/koa_respones_data");

app.use(respDatarMiddleware); // 监听端口

app.listen(3000);
console.log("服务器已启动.....................");
/**
 * websocket
 */
// 创建websocket对象

var Websocket = require('ws'); // 绑定端口号


var wss = new Websocket.Server({
  port: 9998
}); // 监听事件
// 链接事件
// client表示客户端连接的socket对象

wss.on('connection', function (client) {
  console.log("有客户连接成功........................................."); // 对客户端的链接对象进行message事件监听
  // msg:有客户端发送给服务端的数据

  client.on('message', function (msg) {
    console.log("客户端发送数据给客户端了：" + msg); // 服务端往客户端发送数据 

    client.send("hello socket from backend");
  });
});