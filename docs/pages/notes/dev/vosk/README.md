---
title: vosk  
sidebar: auto  
tags:  
    - vosk  
    - 语音  
    - 识别
    - 转写  
---  

# vosk  

[vosk](https://alphacephei.com/vosk/) 是一个离线语音识别包。可以在本地引用，也可自己搭建语音识别服务。对于背景噪音较小的情况下，识别率还可以。本文仅记录中文语言识别服务的搭建步骤。    

## 准备工作
在前期音频处理时，会需要用到以下两个工具：  
- [ffmpeg](http://ffmpeg.org/)  
- [SoX](http://sox.sourceforge.net/)  
- [Docker](https://www.docker.com/)  

```bash  
# 安装docker  
docker run -d -p 9700:2700 alphacep/kaldi-cn:latest  
# 2700 端口会报异常，权限不被允许，所以换成了9700  

# 安装ffmpeg，提取音频  
ffmpeg -i test.mp4 -f s16le -vn -ar 8000 -ac 1 test.wav  
# -f s16le 设置文件格式为 s16le
# -vn 只保留音频  
# -ar 8000 采样频率，也可以设置为16K  
# -ac 1 单声道  

# 去除噪音 
# 这里需要sox 工具  
# 首先，使用ffmpeg 截取一段纯背景噪音  
ffmpeg -i test.wav -ss 00:00:10.3 -t 00:00:00.2 noise.wav  
# -ss 起始时间  
# -t  持续时间
# 也可以直接从源文件提取  
# ffmpeg -i test.mp4 -f s16le -vn -ar 8000 -ac 1 -ss 00:00:10.3 -t 00:00:00.2 noise.wav

# 处理噪音文件  
sox noise.wav -n noiseprof noise.prof  
# 消除噪音  
sox test.wav test-free.wav noisered noise.prof  
# 这样就得到了去除噪音的音频文件，效果还是很好的  
# 如果音频本身噪音不大，就不需要处理了  
```


## Websocket 客户端  

在[Github](https://github.com/alphacep/vosk-server) 上有示例，其中`node` 版本经测试后可以使用。下面是代码：

```js  
const websocket = require('ws');
const fs = require('fs');
const ws = new websocket('ws://localhost:9700');

ws.on('open', function open() {
  var readStream = fs.createReadStream('test-free.wav');
  readStream.on('data', function (chunk) {
      ws.send(chunk);
  });
  readStream.on('end', function () {
      ws.send('{"eof" : 1}');
  });
});

ws.on('message', function incoming(data) {
  console.log(data);
});

ws.on('close', function close() {
  process.exit()
});

```  

## 参考链接  
1. [VOSK](https://alphacephei.com/vosk/server)