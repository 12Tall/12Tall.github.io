---
title: websocket  
sidebar: auto  
tags:  
    - websocket  
    - server  
---  

# Websocket  
## 作用  
- **可以从服务端向客户端主动推送信息** 2011 年成为国际标准，目前已被所有主流浏览器支持。  
- 基于`TCP`  
- 默认端口`80/443`，握手采用HTTP 协议，并且能通过各种HTTP 代理服务器  
- 数据格式轻量：可以传输文本、二进制数据  
- 无同源限制  
- 默认协议为`ws`，加密协议为`wss`  

## 浏览器客户端  
### 构造函数  
WebSocket(url[, protocols]) 返回一个 WebSocket 对象。 

### 常量  
对应的是socket 连接的状态  
- `WebSocket.CONNECTING` 0  
- `WebSocket.OPEN` 1  
- `WebSocket.CLOSING` 2  
- `WebSocket.CLOSED` 3  

### 属性  
#### 只读属性  
- `WebSocket.bufferedAmount` 未发送至服务器的字节数  
- `WebSocket.extensions` 服务器选择的扩展  
- `WebSocket.protocol ` 服务器选择的下属协议  
- `WebSocket.readyState` 当前的链接状态  
- `WebSocket.url` WebSocket 的绝对路径  

#### 普通属性
- `WebSocket.binaryType` 使用二进制的数据类型连接。
- `WebSocket.onclose`   
- `WebSocket.onerror`   
- `WebSocket.onmessage`   
- `WebSocket.onopen`   

### 方法  
- `WebSocket.close([code[, reason]])` 关闭当前链接  
- `WebSocket.send(data)` 对要传输的数据进行排队  

### 示例  
```js
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
```  

## WS  
`ws` 包含客户端与服务端的实现，但是不能运行在浏览器中。  

### 安装  
```bash
npm install ws  

# 可选的性能与规范插件  
npm install --save-optional bufferutil 
npm install --save-optional utf-8-validate  # 高效地检测消息是否包含utf8
```   

### 消息压缩  
在需要时启用  
- 在客户端默认启用  
- 在服务端默认禁止


### 服务端  
#### new WebSocket.Server(options[, callback])  
- options  
  - host 
  - port  
  - backlog  最大挂起连接数  
  - server 预先创建的http、https 服务器（用于扩展http）  
  - verifyClient 一个用于验证接入的函数，不推荐  
  - handleProtocols  
  - path 仅接入匹配路径的连接  
  - noSever 无服务模式  
  - clientTracking 启用客户端追踪  
  - perMessageDeflate 
  - maxPayload 最大负载字节数  
- callback 回调  

#### 示例代码  
```js
const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});
```

### 客户端  
#### new WebSocket(address[, protocols][, options])  
- address 
- protocols  
- options  
  - followRedirects 是否进入重定向  
  - handshakeTimeout 握手延时  
  - maxRedirects 做大重定向书  
  - ... 与原生基本类似  

#### 示例代码  
```js
// 1. 收发文本信息  
const WebSocket = require('ws');
 
const ws = new WebSocket('ws://www.host.com/path');
 
ws.on('open', function open() {
  ws.send('something');
});
 
ws.on('message', function incoming(data) {
  console.log(data);
});

// 2. 收发二进制信息  
const WebSocket = require('ws');
 
const ws = new WebSocket('ws://www.host.com/path');
 
ws.on('open', function open() {
  const array = new Float32Array(5);
 
  for (var i = 0; i < array.length; ++i) {
    array[i] = i / 2;
  }
 
  ws.send(array);
});
```


## 参考资料  
1. [阮一峰：WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)  
2. [MDN: WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)  
3. [npm: ws](https://www.npmjs.com/package/ws)  
4. [Github: ws doc](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback)
