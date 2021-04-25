"use strict";

var Websocket = require('ws');

var wss = new Websocket.Server({
  port: 9998
}); // 相当于服务端开启了监听

module.exports.listen = function () {
  wss.on('connection', function (client) {
    console.log("有客户连接成功.........................................");
    client.on('message', function (msg) {
      console.log("客户端发送数据给客户端了：" + msg);
      client.send("hello socket from backend");
    });
  });
};