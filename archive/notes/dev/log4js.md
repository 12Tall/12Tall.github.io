---
title: Log4js  
sidebar: auto  
tags:  
    - log4js  
    - log  
---  
# Log4js  
## 日志级别  
参考`log4j`，共有8 种日志级别，如下：  
```
+------+-------+-------+-------+-------+-------+-------+-------+
|      | FATAL | ERROR | WARN  | INFO  | DEBUG | TRACE | ALL   |
+--------------------------------------------------------------+
|OFF   |       |       |       |       |       |       |       |
+--------------------------------------------------------------+
|FATAL |   X   |       |       |       |       |       |      ||
+--------------------------------------------------------------+
|ERROR |   X   |   X   |       |       |       |       |       |
+--------------------------------------------------------------+
|WARN  |   X   |   X   |   X   |       |       |       |       |
+--------------------------------------------------------------+
|INFO  |   X   |   X   |   X   |   X   |       |       |       |
+--------------------------------------------------------------+
|DEBUG |   X   |   X   |   X   |   X   |   X   |       |       |
+--------------------------------------------------------------+
|TRACE |   X   |   X   |   X   |   X   |   X   |   X   |       |
+--------------------------------------------------------------+
|ALL   |   X   |   X   |   X   |   X   |   X   |   X   |   X   |
+------+-------+-------+-------+-------+-------+-------+-------+
```

## 使用  
### 安装  
```shell  
yarn add log4js
```  

### 配置  
`log4js` 有两种配置方式，一种是在代码中配置，另一种是通过配置文件进行配置，这里仅介绍在代码中配置的例子
```js   
var log4js = require('log4js');
log4js.configure({
    // 输出位置
    appenders: {
        // 控制台输出
        out: { type: 'console' },
        // 按日期输出
        task: {
            type: 'dateFile',
            filename: 'logs/task',
            // 命名方式
            "pattern": "-yyyy-MM-dd.log",
            alwaysIncludePattern: true
        },
        // 输出至文件
        result: {
            type: 'file',
            filename: 'logs/result.log',
            keepFileExt: true,  // 保持扩展名
            maxLogSize: 10485760,  // 日志上限(B)
            backups: 3,  // 备份文件个数
        },
   },
   // 将不同等级的日志追加到不同的输出位置
    categories: {
        // 默认将error 等级的信息追加到consol 和task 指定的文件
        default: { appenders: ['out', 'task'], level: 'error' },
        // 将info 等级的日志追加到task 指定的文件
        task: { appenders: ['task'], level: 'info' }
    }
})

// 获取实例
const logger = log4js.getLogger();
logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");
```
输出：  
```log
[2010-01-17 11:43:37.987] [ERROR] cheese - Cheese is too ripe!
[2010-01-17 11:43:37.990] [FATAL] cheese - Cheese was breeding ground for listeria.
```

## 参考资料  

1. [干货：日志打印的8种级别（很详细）](https://zhuanlan.zhihu.com/p/63810820)  
2. [log4js-node](https://github.com/log4js-node/log4js-node)  
3. [日志模块log4js的配置说明](https://www.cnblogs.com/Joans/p/9647601.html)